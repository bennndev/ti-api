import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserGroupRepository } from './user-group.repository';
import { CreateUserGroupDto, UpdateUserGroupDto } from './dto';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class UserGroupService {
  private readonly logger = new Logger(UserGroupService.name);

  constructor(private readonly userGroupRepository: UserGroupRepository) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    groupId?: number;
    userId?: string;
    status?: string;
  }): Promise<{
    data: any[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const { page = 1, pageSize = 20, groupId, userId, status } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.User_GroupWhereInput = {};
    if (groupId !== undefined) where.groupId = groupId;
    if (userId !== undefined) where.userId = userId;
    if (status !== undefined) where.status = status as any;

    const { data, total } = await this.userGroupRepository.findMany({
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

  async findById(userId: string, groupId: number): Promise<any> {
    const userGroup = await this.userGroupRepository.findById(userId, groupId);
    if (!userGroup) {
      throw new NotFoundException(`User_Group not found`);
    }
    return userGroup;
  }

  async create(dto: CreateUserGroupDto): Promise<any> {
    return this.userGroupRepository.create({
      user: { connect: { id: dto.userId } },
      group: { connect: { id: dto.groupId } },
      roleInGroup: dto.roleInGroup,
      status: dto.status,
    });
  }

  async update(userId: string, groupId: number, dto: UpdateUserGroupDto): Promise<any> {
    const userGroup = await this.userGroupRepository.findById(userId, groupId);
    if (!userGroup) {
      throw new NotFoundException(`User_Group not found`);
    }

    return this.userGroupRepository.update(userId, groupId, dto);
  }

  async delete(userId: string, groupId: number): Promise<void> {
    const userGroup = await this.userGroupRepository.findById(userId, groupId);
    if (!userGroup) {
      throw new NotFoundException(`User_Group not found`);
    }

    await this.userGroupRepository.delete(userId, groupId);
  }
}