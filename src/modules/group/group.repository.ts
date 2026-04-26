import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Group } from '@/generated/prisma/client';

@Injectable()
export class GroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.GroupWhereInput;
    orderBy?: Prisma.GroupOrderByWithRelationInput;
  }): Promise<{ data: Group[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const [data, total] = await Promise.all([
      this.prisma.group.findMany({
        skip,
        take,
        where,
        orderBy: orderBy ?? { createdAt: 'desc' },
      }),
      this.prisma.group.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Group | null> {
    return this.prisma.group.findUnique({
      where: { id },
    });
  }

  async findByOrgId(orgId: number): Promise<{ data: Group[]; total: number }> {
    return this.findMany({ where: { orgId } });
  }

  async findByCourseId(courseId: number): Promise<{ data: Group[]; total: number }> {
    return this.findMany({ where: { courseId } });
  }

  async create(data: Prisma.GroupCreateInput): Promise<Group> {
    return this.prisma.group.create({ data });
  }

  async update(id: number, data: Prisma.GroupUpdateInput): Promise<Group> {
    return this.prisma.group.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Group> {
    return this.prisma.group.update({
      where: { id },
      data: { status: 'DISSOLVED' as any },
    });
  }
}