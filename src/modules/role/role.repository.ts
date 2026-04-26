import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Role } from '@/generated/prisma/client';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
  }): Promise<{ data: Role[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const [data, total] = await Promise.all([
      this.prisma.role.findMany({
        skip,
        take,
        where,
        orderBy: orderBy ?? { id: 'asc' },
      }),
      this.prisma.role.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { code },
    });
  }
}