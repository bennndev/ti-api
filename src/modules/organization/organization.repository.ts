import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Organization } from '@/generated/prisma/client';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

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
      }),
      this.prisma.organization.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Organization | null> {
    return this.prisma.organization.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: { slug },
    });
  }

  async findByRuc(ruc: string): Promise<Organization | null> {
    return this.prisma.organization.findFirst({
      where: { ruc, deletedAt: null },
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