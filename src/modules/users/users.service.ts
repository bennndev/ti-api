import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { auth } from '@/lib/auth';
import { UsersRepository } from './users.repository';
import type { CreateUserDto } from './dto/create-user.schema';
import type { UpdateUserDto } from './dto/update-user.schema';
import type { UserResponseDto } from './dto/response-user.schema';
import { PrismaService } from '@/lib/prisma';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateUserDto) {
    const existingByEmail = await this.usersRepository.findByEmail(dto.email);
    if (existingByEmail) {
      throw new ConflictException(`User with email "${dto.email}" already exists`);
    }

    // Use Better Auth's signUpEmail with additional fields in body
    const result = await auth.api.signUpEmail({
      body: {
        email: dto.email,
        password: dto.password,
        name: dto.name,
        username: dto.username,
        lastName: dto.lastName,
        documentType: dto.documentType,
        documentNumber: dto.documentNumber,
        preferredLanguage: dto.preferredLanguage,
        orgId: dto.orgId,
        roleId: dto.roleId,
        position: dto.position,
        phone: dto.phone,
        specialtyId: dto.specialtyId,
        bio: dto.bio,
      },
    });

    // Update orgId and roleId via repository since signUpEmail doesn't set them
    await this.usersRepository.update(result.user.id as string, {
      orgId: dto.orgId,
      roleId: dto.roleId,
      position: dto.position,
      phone: dto.phone,
      specialtyId: dto.specialtyId,
    } as any);

    return this.findById(result.user.id as string);
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    orgId?: number;
    roleId?: number;
    status?: boolean;
  }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const where: any = {};
    if (params.orgId !== undefined) where.orgId = params.orgId;
    if (params.roleId !== undefined) where.roleId = params.roleId;
    if (params.status !== undefined) where.status = params.status;

    const { data, total } = await this.usersRepository.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: data.map(this.mapToResponse),
      meta: { page, pageSize, total, totalPages },
    };
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.mapToResponse(user);
  }

  async getDashboard(userId: string) {
    const memberships = await this.prisma.user_Group.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            course: {
              select: { id: true, name: true },
            },
            groupExperiences: {
              include: {
                experience: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
    });

    const coursesProgress = new Map<number, {
      courseId: number;
      courseName: string;
      totalExperiences: number;
      completedExperiences: number;
      experiences: any[];
    }>();

    for (const membership of memberships) {
      const course = membership.group.course;
      if (!coursesProgress.has(course.id)) {
        coursesProgress.set(course.id, {
          courseId: course.id,
          courseName: course.name,
          totalExperiences: 0,
          completedExperiences: 0,
          experiences: [],
        });
      }

      const courseEntry = coursesProgress.get(course.id)!;
      for (const ge of membership.group.groupExperiences) {
        courseEntry.experiences.push({
          experienceId: ge.experienceId,
          experienceName: ge.experience.name,
          status: ge.status,
          finalScore: ge.finalScore,
        });
        courseEntry.totalExperiences++;
        if (ge.status === 'COMPLETED') {
          courseEntry.completedExperiences++;
        }
      }
    }

    const progress = Array.from(coursesProgress.values()).map((c) => ({
      ...c,
      percent: c.totalExperiences > 0
        ? Math.round((c.completedExperiences / c.totalExperiences) * 100)
        : 0,
    }));

    return {
      user: await this.findById(userId),
      groups: memberships.map((m) => ({
        groupId: m.group.id,
        groupName: m.group.name,
        courseId: m.group.course.id,
        courseName: m.group.course.name,
        roleInGroup: m.roleInGroup,
        status: m.status,
      })),
      progress,
    };
  }

  async update(id: string, dto: UpdateUserDto, currentUser: { id: string; orgId: number | null; roleId: number | null }) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    const isSelf = currentUser.id === id;
    const adminFieldKeys: (keyof UpdateUserDto)[] = [
      'name', 'lastName', 'username', 'documentType', 'documentNumber', 'status',
    ];
    const hasAdminFields = adminFieldKeys.some((k) => dto[k] !== undefined);

    // Only super_admin (1) or org_admin (2) can update admin fields or other users
    if (!isSelf || hasAdminFields) {
      if (currentUser.roleId !== 1 && currentUser.roleId !== 2) {
        throw new ForbiddenException('Cannot update admin fields or other users');
      }
    }

    // Users can only update users in their org (except superadmin)
    if (!isSelf && user.orgId !== currentUser.orgId && currentUser.roleId !== 1) {
      throw new ForbiddenException('Cannot update users from other organizations');
    }

    const updated = await this.usersRepository.update(id, dto);
    return this.mapToResponse(updated);
  }

  async softDelete(id: string, currentUser: { id: string; orgId: number | null; roleId: number | null }) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // Prevent self-deletion
    if (user.id === currentUser.id) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    // Users can only delete users in their org (except superadmin)
    if (user.orgId !== currentUser.orgId && currentUser.roleId !== 1) {
      throw new ForbiddenException('Cannot delete users from other organizations');
    }

    const deleted = await this.usersRepository.softDelete(id);
    return this.mapToResponse(deleted);
  }

  private mapToResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username ?? null,
      name: user.name ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      documentType: user.documentType ?? null,
      documentNumber: user.documentNumber ?? null,
      roleId: user.roleId ?? null,
      orgId: user.orgId ?? null,
      position: user.position ?? null,
      phone: user.phone ?? null,
      specialtyId: user.specialtyId ?? null,
      bio: user.bio ?? null,
      specialty: user.specialty ?? null,
      emailVerified: user.emailVerified ?? false,
      status: user.status ?? true,
      createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  }
}