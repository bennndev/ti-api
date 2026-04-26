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

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

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
      },
    });

    // Update orgId and roleId via repository since signUpEmail doesn't set them
    await this.usersRepository.update(result.user.id as string, {
      orgId: dto.orgId,
      roleId: dto.roleId,
    } as any);

    return this.findById(result.user.id as string);
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    orgId?: number;
    status?: boolean;
  }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const where: any = {};
    if (params.orgId !== undefined) where.orgId = params.orgId;
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

  async update(id: string, dto: UpdateUserDto, currentUser: { id: string; orgId: number | null; roleId: number | null }) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // Users can only update users in their org (except superadmin)
    if (user.orgId !== currentUser.orgId && currentUser.roleId !== 1) {
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
      roleId: user.roleId ?? null,
      orgId: user.orgId ?? null,
      emailVerified: user.emailVerified ?? false,
      status: user.status ?? true,
      createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  }
}