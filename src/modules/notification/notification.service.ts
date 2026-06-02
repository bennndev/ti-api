import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import type { UpdateNotifPrefDto } from './dto/update-notif-pref.schema';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.notificationPreference.findMany({
      where: { userId },
      select: { key: true, enabled: true },
    });
  }

  async upsert(userId: string, dto: UpdateNotifPrefDto) {
    const results: { key: string; enabled: boolean }[] = [];
    for (const [key, enabled] of Object.entries(dto.preferences)) {
      const result = await this.prisma.notificationPreference.upsert({
        where: { userId_key: { userId, key } },
        create: { userId, key, enabled },
        update: { enabled },
        select: { key: true, enabled: true },
      });
      results.push(result);
    }
    return results;
  }
}
