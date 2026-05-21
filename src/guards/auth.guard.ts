import {
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { auth } from '@/lib/auth';
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

    // Construir Headers nativo con la cookie del request
    const cookieHeader = request.headers.cookie ?? '';

    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: cookieHeader,
      }),
    });

    if (!session) {
      throw new UnauthorizedException('No active session');
    }

    // Fetch user from DB to get custom fields (roleId, orgId, etc.)
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
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = {
      ...session.user,
      ...user,
    };
    request.session = session.session;

    return true;
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
