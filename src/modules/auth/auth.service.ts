import { Injectable, Logger } from '@nestjs/common';
import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { IncomingHttpHeaders } from 'http';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async signUp(body: Record<string, unknown>) {
    return auth.api.signUpEmail({
      body: body as any,
    });
  }

  async signIn(body: Record<string, unknown>) {
    return auth.api.signInEmail({
      body: body as any,
    });
  }

  async signOut(headers: IncomingHttpHeaders) {
    return auth.api.signOut({
      headers: fromNodeHeaders(headers),
    });
  }

  async getSession(headers: IncomingHttpHeaders) {
    return auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });
  }
}
