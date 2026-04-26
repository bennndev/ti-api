import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, User_Group } from '@/generated/prisma/client';

@Injectable()
export class UserGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.User_GroupWhereInput;
    orderBy?: Prisma.User_GroupOrderByWithRelationInput;
  }): Promise<{ data: User_Group[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const [data, total] = await Promise.all([
      this.prisma.user_Group.findMany({
        skip,
        take,
        where,
        orderBy: orderBy ?? { joinedAt: 'desc' },
      }),
      this.prisma.user_Group.count({ where }),
    ]);

    return { data, total };
  }

  async findById(userId: string, groupId: number): Promise<User_Group | null> {
    return this.prisma.user_Group.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });
  }

  async findByGroupId(groupId: number): Promise<{ data: User_Group[]; total: number }> {
    return this.findMany({ where: { groupId } });
  }

  async findByUserId(userId: string): Promise<{ data: User_Group[]; total: number }> {
    return this.findMany({ where: { userId } });
  }

  async create(data: Prisma.User_GroupCreateInput): Promise<User_Group> {
    return this.prisma.user_Group.create({ data });
  }

  async update(userId: string, groupId: number, data: Prisma.User_GroupUpdateInput): Promise<User_Group> {
    return this.prisma.user_Group.update({
      where: { userId_groupId: { userId, groupId } },
      data,
    });
  }

  async delete(userId: string, groupId: number): Promise<void> {
    await this.prisma.user_Group.delete({
      where: { userId_groupId: { userId, groupId } },
    });
  }
}