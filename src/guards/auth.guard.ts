import { Injectable, UnauthorizedException } from '@nestjs/common';
import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name?: string;
    emailVerified: boolean;
  };
}

@Injectable()
export class AuthGuard {
  async canActivate(req: Request): Promise<boolean> {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      throw new UnauthorizedException('No active session');
    }

    (req as AuthenticatedRequest).user = session.user;
    return true;
  }
}
