import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ActivityLogRepository } from './activity-log.repository';
import { CreateActivityLogDto, CreateActivityLogBatchDto } from './dto';

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    userId?: string;
    orgId?: number;
    action?: string;
  }): Promise<{
    data: any[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const { page = 1, pageSize = 20, userId, orgId, action } = params;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (userId) where.userId = userId;
    if (orgId) where.orgId = orgId;
    if (action) where.action = action;

    const { data, total } = await this.activityLogRepository.findMany({
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
    const log = await this.activityLogRepository.findById(id);
    if (!log) {
      throw new NotFoundException(`Activity log #${id} not found`);
    }
    return log;
  }

  async create(dto: CreateActivityLogDto): Promise<any> {
    return this.activityLogRepository.create({
      user: { connect: { id: dto.userId } },
      org: { connect: { id: dto.orgId } },
      action: dto.action,
      entity: dto.entity,
      entityId: dto.entityId,
      metadata: dto.metadata ?? undefined,
      ipAddress: dto.ipAddress,
    });
  }

  async createBatch(dto: CreateActivityLogBatchDto): Promise<{ received: number }> {
    const data = dto.events.map((event) => ({
      userId: event.userId,
      orgId: event.orgId,
      action: event.action,
      entity: event.entity ?? undefined,
      entityId: event.entityId ?? undefined,
      metadata: event.metadata ?? undefined,
      ipAddress: event.ipAddress ?? undefined,
    }));

    const count = await this.activityLogRepository.createMany(data);
    this.logger.log(`Batch activity logs created: ${count}`);

    return { received: count };
  }
}