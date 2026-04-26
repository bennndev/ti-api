import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Group_Experience } from '@/generated/prisma/client';

@Injectable()
export class GroupExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.Group_ExperienceWhereInput;
    orderBy?: Prisma.Group_ExperienceOrderByWithRelationInput;
  }): Promise<{ data: Group_Experience[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const [data, total] = await Promise.all([
      this.prisma.group_Experience.findMany({
        skip,
        take,
        where,
        orderBy: orderBy ?? { groupId: 'asc' },
      }),
      this.prisma.group_Experience.count({ where }),
    ]);

    return { data, total };
  }

  async findById(groupId: number, experienceId: number): Promise<Group_Experience | null> {
    return this.prisma.group_Experience.findUnique({
      where: { groupId_experienceId: { groupId, experienceId } },
    });
  }

  async findByGroupId(groupId: number): Promise<{ data: Group_Experience[]; total: number }> {
    return this.findMany({ where: { groupId } });
  }

  async findByExperienceId(experienceId: number): Promise<{ data: Group_Experience[]; total: number }> {
    return this.findMany({ where: { experienceId } });
  }

  async create(data: Prisma.Group_ExperienceCreateInput): Promise<Group_Experience> {
    return this.prisma.group_Experience.create({ data });
  }

  async update(groupId: number, experienceId: number, data: Prisma.Group_ExperienceUpdateInput): Promise<Group_Experience> {
    return this.prisma.group_Experience.update({
      where: { groupId_experienceId: { groupId, experienceId } },
      data,
    });
  }

  async delete(groupId: number, experienceId: number): Promise<void> {
    await this.prisma.group_Experience.delete({
      where: { groupId_experienceId: { groupId, experienceId } },
    });
  }
}