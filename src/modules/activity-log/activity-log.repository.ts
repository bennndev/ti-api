import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Activity_Log } from '@/generated/prisma/client';

@Injectable()
export class ActivityLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.Activity_LogWhereInput;
    orderBy?: Prisma.Activity_LogOrderByWithRelationInput;
  }): Promise<{ data: Activity_Log[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const [data, total] = await Promise.all([
      this.prisma.activity_Log.findMany({
        skip,
        take,
        where,
        orderBy: orderBy ?? { createdAt: 'desc' },
      }),
      this.prisma.activity_Log.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Activity_Log | null> {
    return this.prisma.activity_Log.findUnique({ where: { id } });
  }

  async create(data: Prisma.Activity_LogCreateInput): Promise<Activity_Log> {
    return this.prisma.activity_Log.create({ data });
  }

  async createMany(data: Prisma.Activity_LogCreateManyInput[]): Promise<number> {
    const result = await this.prisma.activity_Log.createMany({ data });
    return result.count;
  }
}