import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, Score_Event } from '@/generated/prisma/client';

@Injectable()
export class ScoreEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.Score_EventWhereInput;
    orderBy?: Prisma.Score_EventOrderByWithRelationInput;
  }): Promise<{ data: Score_Event[]; total: number }> {
    const { skip = 0, take = 20, where, orderBy } = params;

    const [data, total] = await Promise.all([
      this.prisma.score_Event.findMany({
        skip,
        take,
        where,
        orderBy: orderBy ?? { occurredAt: 'desc' },
      }),
      this.prisma.score_Event.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Score_Event | null> {
    return this.prisma.score_Event.findUnique({ where: { id } });
  }

  async findBySessionId(sessionId: string): Promise<Score_Event[]> {
    return this.prisma.score_Event.findMany({
      where: { sessionId },
      orderBy: { occurredAt: 'asc' },
    });
  }

  async findByGroupAndExperience(groupId: number, experienceId: number): Promise<Score_Event[]> {
    return this.prisma.score_Event.findMany({
      where: { groupId, experienceId },
      orderBy: { occurredAt: 'asc' },
    });
  }

  async create(data: Prisma.Score_EventCreateInput): Promise<Score_Event> {
    return this.prisma.score_Event.create({ data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.score_Event.delete({ where: { id } });
  }

  async deleteBySessionId(sessionId: string): Promise<number> {
    const result = await this.prisma.score_Event.deleteMany({ where: { sessionId } });
    return result.count;
  }
}