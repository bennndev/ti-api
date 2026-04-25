import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Organization } from '@/generated/prisma/client';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    departments: { select: { id: true } },
    users: { select: { id: true } },
  };

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput;
  }): Promise<{ data: Organization[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const whereClause: Prisma.OrganizationWhereInput = {
      ...where,
      deletedAt: null,
    };

    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        skip,
        take,
        where: whereClause,
        orderBy: orderBy ?? { createdAt: 'desc' },
        include: { _count: { select: { departments: true, users: true } } },
      }),
      this.prisma.organization.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Organization | null> {
    return this.prisma.organization.findFirst({
      where: { id, deletedAt: null },
      include: { _count: { select: { departments: true, users: true } } },
    });
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: { slug },
      include: { _count: { select: { departments: true, users: true } } },
    });
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    return this.prisma.organization.create({ data });
  }

  async update(
    id: number,
    data: Prisma.OrganizationUpdateInput,
  ): Promise<Organization> {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Organization> {
    return this.prisma.organization.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
