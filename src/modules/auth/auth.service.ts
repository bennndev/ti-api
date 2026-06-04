import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { signJwt } from '@/lib/jwt';
import { PrismaService } from '@/lib/prisma';
import type { IncomingHttpHeaders } from 'http';
import type { SignUpDto } from './dto/sign-up.schema';
import type { SignInDto } from './dto/sign-in.schema';
import type { ChangePasswordDto } from './dto/change-password.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async signUp(body: SignUpDto) {
    return auth.api.signUpEmail({
      body: body,
    });
  }

  async signIn(body: SignInDto) {
    return auth.api.signInEmail({
      body: body,
    });
  }

  async signOut(headers: IncomingHttpHeaders) {
    return auth.api.signOut({
      headers: fromNodeHeaders(headers),
    });
  }

  async changePassword(headers: IncomingHttpHeaders, dto: ChangePasswordDto) {
    return auth.api.changePassword({
      headers: fromNodeHeaders(headers),
      body: dto,
    });
  }

  async getSession(headers: IncomingHttpHeaders) {
    return auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });
  }

  async tokenExchange(headers: IncomingHttpHeaders) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });

    if (!session) {
      throw new UnauthorizedException('No active session');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        orgId: true,
        roleId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const expiresInMs = 7 * 24 * 60 * 60 * 1000;
    const token = await signJwt(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        orgId: user.orgId,
        roleId: user.roleId,
        type: 'api',
      },
      expiresInMs,
    );

    const expiresAt = new Date(Date.now() + expiresInMs);

    this.logger.log(`JWT issued for user ${user.id}`);

    return { token, expiresAt };
  }
}
