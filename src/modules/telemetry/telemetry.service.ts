import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { CloseSessionDto } from './dto';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async closeSession(dto: CloseSessionDto) {
    const {
      groupId,
      experienceId,
      sessionId,
      endReason,
      finalScore,
      totalTimeSeconds,
      startedAtUtc,
      endedAtUtc,
      deviceType,
      platform,
      ipAddress,
      scoreEvents,
    } = dto;

    // Use transaction to ensure atomicity
    const result = await this.prisma.$transaction(async (tx) => {
      // Upsert Group_Experience — update if exists, create if not
      const groupExperience = await tx.group_Experience.upsert({
        where: {
          groupId_experienceId: { groupId, experienceId },
        },
        update: {
          finalScore: finalScore ?? null,
          status: endReason === 'completed' ? 'COMPLETED' : 'FAILED',
          completedAt: endedAtUtc ? new Date(endedAtUtc) : new Date(),
          startedAt: startedAtUtc ? new Date(startedAtUtc) : undefined,
          totalTimeSeconds: totalTimeSeconds ?? null,
          endReason,
          endedAt: endedAtUtc ? new Date(endedAtUtc) : null,
          deviceType: deviceType ?? null,
          platform: platform ?? null,
          ipAddress: ipAddress ?? null,
          sessionId,
          attempts: { increment: 1 },
        },
        create: {
          groupId,
          experienceId,
          finalScore: finalScore ?? null,
          status: endReason === 'completed' ? 'COMPLETED' : 'FAILED',
          startedAt: startedAtUtc ? new Date(startedAtUtc) : undefined,
          completedAt: endedAtUtc ? new Date(endedAtUtc) : new Date(),
          totalTimeSeconds: totalTimeSeconds ?? null,
          endReason,
          endedAt: endedAtUtc ? new Date(endedAtUtc) : null,
          deviceType: deviceType ?? null,
          platform: platform ?? null,
          ipAddress: ipAddress ?? null,
          sessionId,
          attempts: 1,
          mandatory: false,
        },
      });

      // Create score events if provided
      let scoreEventsCreated = 0;
      if (scoreEvents && scoreEvents.length > 0) {
        await tx.score_Event.createMany({
          data: scoreEvents.map((event) => ({
            groupId,
            experienceId,
            sessionId,
            eventId: event.eventId,
            label: event.label,
            scoreDelta: event.scoreDelta,
            metadata: event.metadata as any,
            occurredAt: endedAtUtc ? new Date(endedAtUtc) : new Date(),
          })),
        });
        scoreEventsCreated = scoreEvents.length;
      }

      return {
        groupExperience,
        scoreEventsCreated,
      };
    });

    this.logger.log(
      `Session closed: groupId=${groupId}, experienceId=${experienceId}, sessionId=${sessionId}, endReason=${endReason}, scoreEvents=${result.scoreEventsCreated}`,
    );

    return {
      success: true,
      groupId,
      experienceId,
      sessionId,
      endReason,
      finalScore: finalScore ?? null,
      totalTimeSeconds: totalTimeSeconds ?? null,
      scoreEventsCreated: result.scoreEventsCreated,
    };
  }
}