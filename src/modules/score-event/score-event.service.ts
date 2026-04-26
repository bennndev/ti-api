import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ScoreEventRepository } from './score-event.repository';
import { CreateScoreEventDto } from './dto';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class ScoreEventService {
  private readonly logger = new Logger(ScoreEventService.name);

  constructor(private readonly scoreEventRepository: ScoreEventRepository) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    groupId?: number;
    experienceId?: number;
    sessionId?: string;
  }): Promise<{
    data: any[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const { page = 1, pageSize = 20, groupId, experienceId, sessionId } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.Score_EventWhereInput = {};
    if (groupId !== undefined) where.groupId = groupId;
    if (experienceId !== undefined) where.experienceId = experienceId;
    if (sessionId !== undefined) where.sessionId = sessionId;

    const { data, total } = await this.scoreEventRepository.findMany({
      skip,
      take: pageSize,
      where,
    });

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findById(id: number): Promise<any> {
    const scoreEvent = await this.scoreEventRepository.findById(id);
    if (!scoreEvent) {
      throw new NotFoundException(`Score_Event not found`);
    }
    return scoreEvent;
  }

  async findBySessionId(sessionId: string): Promise<any[]> {
    return this.scoreEventRepository.findBySessionId(sessionId);
  }

  async findByGroupAndExperience(groupId: number, experienceId: number): Promise<any[]> {
    return this.scoreEventRepository.findByGroupAndExperience(groupId, experienceId);
  }

  async create(dto: CreateScoreEventDto): Promise<any> {
    return this.scoreEventRepository.create({
      groupExperience: {
        connect: { groupId_experienceId: { groupId: dto.groupId, experienceId: dto.experienceId } },
      },
      sessionId: dto.sessionId,
      eventId: dto.eventId,
      label: dto.label,
      scoreDelta: dto.scoreDelta,
      metadata: dto.metadata ?? undefined,
    });
  }

  async delete(id: number): Promise<void> {
    const scoreEvent = await this.scoreEventRepository.findById(id);
    if (!scoreEvent) {
      throw new NotFoundException(`Score_Event not found`);
    }

    await this.scoreEventRepository.delete(id);
  }
}