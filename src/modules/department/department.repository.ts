import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Department } from '@/generated/prisma/client';

@Injectable()
export class DepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.DepartmentWhereInput;
    orderBy?: Prisma.DepartmentOrderByWithRelationInput;
  }): Promise<{ data: Department[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const whereClause: Prisma.DepartmentWhereInput = {
      ...where,
    };

    const [data, total] = await Promise.all([
      this.prisma.department.findMany({
        skip,
        take,
        where: whereClause,
        orderBy: orderBy ?? { createdAt: 'desc' },
      }),
      this.prisma.department.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Department | null> {
    return this.prisma.department.findUnique({
      where: { id },
    });
  }

  async findByOrgId(orgId: number): Promise<{ data: Department[]; total: number }> {
    return this.findMany({ where: { orgId } });
  }

  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return this.prisma.department.create({ data });
  }

  async update(id: number, data: Prisma.DepartmentUpdateInput): Promise<Department> {
    return this.prisma.department.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Department> {
    return this.prisma.department.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
  }
}