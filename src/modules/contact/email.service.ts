import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import type { CreateEmailDto, UpdateEmailDto } from './dto/email.schema';

@Injectable()
export class EmailService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.email.findMany({
      where: { userId },
      select: {
        id: true,
        email: true,
        type: true,
        isPrimary: true,
        verifiedAt: true,
      },
    });
  }

  async create(userId: string, dto: CreateEmailDto) {
    if (dto.isPrimary) {
      await this.prisma.email.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.email.create({
      data: {
        email: dto.email,
        type: dto.type,
        isPrimary: dto.isPrimary,
        userId,
      },
      select: {
        id: true,
        email: true,
        type: true,
        isPrimary: true,
        verifiedAt: true,
      },
    });
  }

  async update(emailId: number, dto: UpdateEmailDto) {
    const existing = await this.prisma.email.findUnique({ where: { id: emailId } });
    if (!existing) {
      throw new NotFoundException(`Email #${emailId} not found`);
    }

    if (dto.isPrimary) {
      await this.prisma.email.updateMany({
        where: { userId: existing.userId!, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.email.update({
      where: { id: emailId },
      data: {
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.isPrimary !== undefined && { isPrimary: dto.isPrimary }),
      },
      select: {
        id: true,
        email: true,
        type: true,
        isPrimary: true,
        verifiedAt: true,
      },
    });
  }

  async delete(emailId: number) {
    const existing = await this.prisma.email.findUnique({ where: { id: emailId } });
    if (!existing) {
      throw new NotFoundException(`Email #${emailId} not found`);
    }
    await this.prisma.email.delete({ where: { id: emailId } });
  }
}
