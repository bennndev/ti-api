import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import { Prisma, DevicePin } from '@/generated/prisma/client';

@Injectable()
export class XrAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.DevicePinCreateInput): Promise<DevicePin> {
    return this.prisma.devicePin.create({ data });
  }

  async createUnchecked(data: { userId: string; pin: string; expiresAt: Date; deviceId?: string | null }): Promise<DevicePin> {
    return this.prisma.devicePin.create({
      data: {
        userId: data.userId,
        pin: data.pin,
        expiresAt: data.expiresAt,
        deviceId: data.deviceId,
      },
    });
  }

  async findValidPin(pin: string): Promise<DevicePin | null> {
    return this.prisma.devicePin.findFirst({
      where: {
        pin,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markAsUsed(id: number): Promise<DevicePin> {
    return this.prisma.devicePin.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async deleteExpiredPins(): Promise<number> {
    const result = await this.prisma.devicePin.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
        usedAt: null,
      },
    });
    return result.count;
  }
}