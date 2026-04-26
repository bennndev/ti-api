import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Specialty } from '@/generated/prisma/client';

@Injectable()
export class SpecialtyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SpecialtyWhereInput;
    orderBy?: Prisma.SpecialtyOrderByWithRelationInput;
  }): Promise<{ data: Specialty[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const [data, total] = await Promise.all([
      this.prisma.specialty.findMany({
        skip,
        take,
        where,
        orderBy: orderBy ?? { createdAt: 'desc' },
      }),
      this.prisma.specialty.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Specialty | null> {
    return this.prisma.specialty.findUnique({
      where: { id },
    });
  }

  async findByDepartmentId(departmentId: number): Promise<{ data: Specialty[]; total: number }> {
    return this.findMany({ where: { departmentId } });
  }

  async create(data: Prisma.SpecialtyCreateInput): Promise<Specialty> {
    return this.prisma.specialty.create({ data });
  }

  async update(id: number, data: Prisma.SpecialtyUpdateInput): Promise<Specialty> {
    return this.prisma.specialty.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Specialty> {
    return this.prisma.specialty.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
  }
}