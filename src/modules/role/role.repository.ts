import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Role, Permission } from '@/generated/prisma/client';

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

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

  async findById(id: number): Promise<RoleWithPermissions | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) return null;

    return {
      ...role,
      permissions: role.permissions.map((rp) => rp.permission),
    };
  }

  async findByCode(code: string): Promise<RoleWithPermissions | null> {
    const role = await this.prisma.role.findUnique({
      where: { code },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) return null;

    return {
      ...role,
      permissions: role.permissions.map((rp) => rp.permission),
    };
  }
}