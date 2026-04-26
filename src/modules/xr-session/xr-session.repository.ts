import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, XR_Session } from '@/generated/prisma/client';

@Injectable()
export class XRSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<XR_Session | null> {
    return this.prisma.xR_Session.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, name: true } },
        experience: { select: { id: true, name: true } },
      },
    });
  }

  async findByGroupAndExperience(groupId: number, experienceId: number): Promise<XR_Session[]> {
    return this.prisma.xR_Session.findMany({
      where: { groupId, experienceId },
      orderBy: { startedAt: 'desc' },
    });
  }

  async create(data: Prisma.XR_SessionCreateInput): Promise<XR_Session> {
    return this.prisma.xR_Session.create({ data });
  }

  async update(id: string, data: Prisma.XR_SessionUpdateInput): Promise<XR_Session> {
    return this.prisma.xR_Session.update({ where: { id }, data });
  }

  async countAttempts(groupId: number, experienceId: number): Promise<number> {
    return this.prisma.xR_Session.count({
      where: { groupId, experienceId },
    });
  }
}