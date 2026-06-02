import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.userDevice.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        platform: true,
        deviceId: true,
        lastSyncAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
