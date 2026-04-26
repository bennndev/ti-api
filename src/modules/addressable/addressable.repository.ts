import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Addressable } from '@/generated/prisma/client';

@Injectable()
export class AddressableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AddressableWhereInput;
    orderBy?: Prisma.AddressableOrderByWithRelationInput;
    include?: Prisma.AddressableInclude;
  }): Promise<{ data: Addressable[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy, include } = params;

    const [data, total] = await Promise.all([
      this.prisma.addressable.findMany({
        skip,
        take,
        where,
        orderBy: orderBy ?? { id: 'asc' },
        include,
      }),
      this.prisma.addressable.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Addressable | null> {
    return this.prisma.addressable.findUnique({ where: { id } });
  }

  async findByExperienceId(experienceId: number): Promise<Addressable | null> {
    return this.prisma.addressable.findUnique({
      where: { experienceId },
      include: { experience: { select: { id: true, name: true } } },
    });
  }

  async create(data: Prisma.AddressableCreateInput): Promise<Addressable> {
    return this.prisma.addressable.create({ data });
  }

  async update(id: number, data: Prisma.AddressableUpdateInput): Promise<Addressable> {
    return this.prisma.addressable.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.addressable.delete({ where: { id } });
  }

  async upsert(experienceId: number, data: Prisma.AddressableCreateInput): Promise<Addressable> {
    return this.prisma.addressable.upsert({
      where: { experienceId },
      create: data,
      update: data,
    });
  }
}