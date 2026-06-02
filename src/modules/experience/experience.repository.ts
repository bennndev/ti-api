import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Experience } from '@/generated/prisma/client';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ExperienceWhereInput;
    orderBy?: Prisma.ExperienceOrderByWithRelationInput;
  }): Promise<{ data: Experience[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const [data, total] = await Promise.all([
      this.prisma.experience.findMany({
        skip,
        take,
        where: { ...where, deletedAt: null },
        orderBy: orderBy ?? { order: 'asc' },
      }),
      this.prisma.experience.count({ where: { ...where, deletedAt: null } }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Experience | null> {
    return this.prisma.experience.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findByCourseId(courseId: number): Promise<{ data: Experience[]; total: number }> {
    return this.findMany({ where: { courseId, deletedAt: null } });
  }

  async create(data: Prisma.ExperienceCreateInput): Promise<Experience> {
    return this.prisma.experience.create({ data });
  }

  async update(id: number, data: Prisma.ExperienceUpdateInput): Promise<Experience> {
    return this.prisma.experience.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Experience> {
    return this.prisma.experience.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}