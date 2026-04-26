import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, User } from '@/generated/prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<{ data: User[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const whereClause: Prisma.UserWhereInput = {
      ...where,
      deletedAt: null,
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where: whereClause,
        orderBy: orderBy ?? { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async findByOrgId(orgId: number): Promise<{ data: User[]; total: number }> {
    return this.findMany({ where: { orgId } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}