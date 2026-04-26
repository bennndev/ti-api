import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(private readonly groupRepository: GroupRepository) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    orgId?: number;
    courseId?: number;
    status?: string;
  }): Promise<{
    data: any[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const { page = 1, pageSize = 20, orgId, courseId, status } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.GroupWhereInput = {};
    if (orgId !== undefined) where.orgId = orgId;
    if (courseId !== undefined) where.courseId = courseId;
    if (status !== undefined) where.status = status as any;

    const { data, total } = await this.groupRepository.findMany({
      skip,
      take: pageSize,
      where,
    });

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findById(id: number): Promise<any> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async create(dto: CreateGroupDto): Promise<any> {
    return this.groupRepository.create({
      org: { connect: { id: dto.orgId } },
      course: { connect: { id: dto.courseId } },
      name: dto.name,
      code: dto.code,
      status: dto.status,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
  }

  async update(id: number, dto: UpdateGroupDto): Promise<any> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return this.groupRepository.update(id, {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
  }

  async softDelete(id: number): Promise<void> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    await this.groupRepository.softDelete(id);
  }
}