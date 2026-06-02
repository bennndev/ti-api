import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Course } from '@/generated/prisma/client';

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<{ data: Course[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take,
        where: { ...where, deletedAt: null },
        orderBy: orderBy ?? { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where: { ...where, deletedAt: null } }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findBySpecialtyId(specialtyId: number): Promise<{ data: Course[]; total: number }> {
    return this.findMany({ where: { specialtyId, deletedAt: null } });
  }

  async create(data: Prisma.CourseCreateInput): Promise<Course> {
    return this.prisma.course.create({ data });
  }

  async update(id: number, data: Prisma.CourseUpdateInput): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}