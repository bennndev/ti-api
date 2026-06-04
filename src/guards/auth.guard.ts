import {
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { verifyJwt } from '@/lib/jwt';
import type { JwtPayload } from '@/lib/jwt';
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';
import { PrismaService } from '@/lib/prisma';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const session = await auth.api.getSession({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      headers: fromNodeHeaders(request.headers as Record<string, string>),
    });

    if (session) {
      const user = await this.prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          orgId: true,
          roleId: true,
          username: true,
          documentType: true,
          documentNumber: true,
          lastName: true,
          position: true,
          phone: true,
          specialtyId: true,
          bio: true,
          specialty: { select: { id: true, code: true, name: true } },
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.user = {
        ...session.user,
        ...user,
      };

      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const jwtPayload = await this.extractAndVerifyJwt(request);

    if (jwtPayload) {
      const user = await this.prisma.user.findUnique({
        where: { id: jwtPayload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          orgId: true,
          roleId: true,
          username: true,
          documentType: true,
          documentNumber: true,
          lastName: true,
          position: true,
          phone: true,
          specialtyId: true,
          bio: true,
          specialty: { select: { id: true, code: true, name: true } },
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.user = {
        ...user,
        emailVerified: user.emailVerified ?? false,
      };

      return true;
    }

    throw new UnauthorizedException('No active session');
  }

  private async extractAndVerifyJwt(
    request: Request,
  ): Promise<JwtPayload | null> {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2) return null;

    const [scheme, token] = parts;
    if (!scheme || !token) return null;
    if (scheme.toLowerCase() !== 'bearer') return null;

    return verifyJwt(token);
  }
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  orgId?: number;
  roleId?: number;
  username?: string;
}

export interface AuthenticatedRequest extends Request {
  user: SessionUser;
}
