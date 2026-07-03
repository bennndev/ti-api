import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma';
import type { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversations(currentUser: { id: string; orgId: number | null; roleId: number | null }) {
    if (!currentUser.orgId) {
      throw new ForbiddenException('User not assigned to an organization');
    }

    // Admin (roleId=2) ve instructores. Instructor (roleId=3) ve su admin.
    const targetRoleId = currentUser.roleId === 2 ? 3 : 2;

    const users = await this.prisma.user.findMany({
      where: {
        orgId: currentUser.orgId,
        roleId: targetRoleId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        roleId: true,
      },
    });

    const conversations: {
      userId: string;
      userName: string;
      userRole: string;
      userRoleId: number | null;
      lastMessage: string | null;
      lastMessageAt: string | null;
      unreadCount: number;
    }[] = [];

    for (const user of users) {
      const [lastMessage, unreadCount] = await Promise.all([
        this.prisma.message.findFirst({
          where: {
            OR: [
              { senderId: user.id, receiverId: currentUser.id },
              { senderId: currentUser.id, receiverId: user.id },
            ],
          },
          orderBy: { createdAt: 'desc' },
          select: { content: true, createdAt: true },
        }),
        this.prisma.message.count({
          where: {
            senderId: user.id,
            receiverId: currentUser.id,
            readAt: null,
          },
        }),
      ]);

      conversations.push({
        userId: user.id,
        userName: user.name ?? 'Unknown',
        userRole: targetRoleId === 3 ? 'instructor' : 'admin',
        userRoleId: user.roleId,
        lastMessage: lastMessage?.content ?? null,
        lastMessageAt: lastMessage?.createdAt?.toISOString() ?? null,
        unreadCount,
      });
    }

    return conversations;
  }

  async getMessages(
    currentUser: { id: string; orgId: number | null },
    targetUserId: string,
    page: number = 1,
    pageSize: number = 50,
  ) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId, deletedAt: null },
      select: { orgId: true, roleId: true },
    });

    if (!targetUser || targetUser.orgId !== currentUser.orgId) {
      throw new ForbiddenException('User not in your organization');
    }

    const skip = (page - 1) * pageSize;

    const where = {
      OR: [
        { senderId: currentUser.id, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: currentUser.id },
      ],
    };

    const [data, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.message.count({ where }),
    ]);

    // Mark received messages as read
    await this.prisma.message.updateMany({
      where: {
        senderId: targetUserId,
        receiverId: currentUser.id,
        readAt: null,
      },
      data: { readAt: new Date() },
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

  async sendMessage(
    currentUser: { id: string; orgId: number | null },
    targetUserId: string,
    dto: CreateMessageDto,
  ) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId, deletedAt: null },
      select: { orgId: true, roleId: true },
    });

    if (!targetUser || targetUser.orgId !== currentUser.orgId) {
      throw new ForbiddenException('User not in your organization');
    }

    if (targetUser.roleId !== 2 && targetUser.roleId !== 3) {
      throw new ForbiddenException('Can only message admin or instructor');
    }

    return this.prisma.message.create({
      data: {
        senderId: currentUser.id,
        receiverId: targetUserId,
        content: dto.content,
      },
    });
  }
}
