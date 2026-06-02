import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import type { CreatePhoneDto, UpdatePhoneDto } from './dto/phone.schema';

@Injectable()
export class PhoneService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.phone.findMany({
      where: { userId },
      select: {
        id: true,
        phone: true,
        type: true,
        isPrimary: true,
      },
    });
  }

  async create(userId: string, dto: CreatePhoneDto) {
    if (dto.isPrimary) {
      await this.prisma.phone.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.phone.create({
      data: {
        phone: dto.phone,
        type: dto.type,
        isPrimary: dto.isPrimary,
        userId,
      },
      select: {
        id: true,
        phone: true,
        type: true,
        isPrimary: true,
      },
    });
  }

  async update(phoneId: number, dto: UpdatePhoneDto) {
    const existing = await this.prisma.phone.findUnique({ where: { id: phoneId } });
    if (!existing) {
      throw new NotFoundException(`Phone #${phoneId} not found`);
    }

    if (dto.isPrimary) {
      await this.prisma.phone.updateMany({
        where: { userId: existing.userId!, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.phone.update({
      where: { id: phoneId },
      data: {
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.isPrimary !== undefined && { isPrimary: dto.isPrimary }),
      },
      select: {
        id: true,
        phone: true,
        type: true,
        isPrimary: true,
      },
    });
  }

  async delete(phoneId: number) {
    const existing = await this.prisma.phone.findUnique({ where: { id: phoneId } });
    if (!existing) {
      throw new NotFoundException(`Phone #${phoneId} not found`);
    }
    await this.prisma.phone.delete({ where: { id: phoneId } });
  }
}
