import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { XRSessionRepository } from './xr-session.repository';
import { CreateXRSessionBodyDto, CompleteXRSessionDto } from './dto';
import { PrismaService } from '@/lib/prisma';

@Injectable()
export class XRSessionService {
  private readonly logger = new Logger(XRSessionService.name);

  constructor(
    private readonly xrSessionRepository: XRSessionRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(experienceId: number, dto: CreateXRSessionBodyDto): Promise<any> {
    // Count existing sessions for attempt number
    const attemptNumber = await this.xrSessionRepository.countAttempts(dto.groupId, experienceId) + 1;

    const session = await this.xrSessionRepository.create({
      group: { connect: { id: dto.groupId } },
      experience: { connect: { id: experienceId } },
      deviceType: dto.deviceType,
      platform: dto.platform,
      ipAddress: dto.ipAddress,
    });

    this.logger.log(`XR Session created: ${session.id}, attempt: ${attemptNumber}`);

    return {
      session_id: session.id,
      started_at: session.startedAt.toISOString(),
      experience_id: experienceId,
      attempt_number: attemptNumber,
    };
  }

  async findById(sessionId: string): Promise<any> {
    const session = await this.xrSessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }
    return session;
  }

  async complete(sessionId: string, dto: CompleteXRSessionDto): Promise<any> {
    const session = await this.xrSessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    // Map deviceType string to enum value
    const deviceTypeMap: Record<string, any> = {
      'vr_headset': 'VR_HEADSET',
      'desktop': 'DESKTOP',
      'mobile': 'MOBILE',
      'tablet': 'TABLET',
    };
    const deviceTypeEnum = session.deviceType ? (deviceTypeMap[session.deviceType.toLowerCase()] ?? null) : null;

    // Update session status
    await this.xrSessionRepository.update(sessionId, {
      status: 'COMPLETED',
      endedAt: new Date(),
    });

    // Update Group_Experience with final results
    const groupExperience = await this.prisma.group_Experience.upsert({
      where: {
        groupId_experienceId: {
          groupId: session.groupId,
          experienceId: session.experienceId,
        },
      },
      update: {
        finalScore: dto.finalScore ?? null,
        status: 'COMPLETED',
        completedAt: new Date(),
        timeSpent: dto.totalTimeSeconds ?? null,
        attempts: { increment: 1 },
        interactionsCount: dto.interactionsCount ?? 0,
        pauseCount: dto.pauseCount ?? 0,
        errorCount: dto.errorCount ?? 0,
        sessionId: sessionId,
        ipAddress: session.ipAddress,
        platform: session.platform,
        deviceType: deviceTypeEnum,
      },
      create: {
        groupId: session.groupId,
        experienceId: session.experienceId,
        finalScore: dto.finalScore ?? null,
        status: 'COMPLETED',
        completedAt: new Date(),
        timeSpent: dto.totalTimeSeconds ?? null,
        attempts: 1,
        interactionsCount: dto.interactionsCount ?? 0,
        pauseCount: dto.pauseCount ?? 0,
        errorCount: dto.errorCount ?? 0,
        sessionId: sessionId,
        ipAddress: session.ipAddress,
        platform: session.platform,
        deviceType: deviceTypeEnum,
      },
    });

    // Update Experience stats
    if (dto.finalScore !== undefined) {
      const experience = await this.prisma.experience.update({
        where: { id: session.experienceId },
        data: {
          totalAttempts: { increment: 1 },
          totalCompletions: dto.finalScore >= 70 ? { increment: 1 } : undefined,
          avgScore: {
            set: dto.finalScore, // Simplified - could compute rolling average
          },
        },
      });

      return {
        session_id: sessionId,
        completed_at: new Date().toISOString(),
        group_experience_updated: {
          status: 'completed',
          final_score: groupExperience.finalScore,
          attempts: groupExperience.attempts,
          time_spent: groupExperience.timeSpent,
        },
        experience_stats_updated: {
          avg_score: experience.avgScore,
          total_completions: experience.totalCompletions,
          total_attempts: experience.totalAttempts,
          difficulty_rating: experience.difficultyRating,
        },
      };
    }

    return {
      session_id: sessionId,
      completed_at: new Date().toISOString(),
      group_experience_updated: {
        status: 'completed',
        final_score: groupExperience.finalScore,
        attempts: groupExperience.attempts,
        time_spent: groupExperience.timeSpent,
      },
      experience_stats_updated: null,
    };
  }
}