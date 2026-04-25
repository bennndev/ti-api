import { Injectable, Logger } from '@nestjs/common';
import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { IncomingHttpHeaders } from 'http';
import type { SignUpDto } from './dto/sign-up.schema';
import type { SignInDto } from './dto/sign-in.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async signUp(body: SignUpDto) {
    return auth.api.signUpEmail({
      body: body as any,
    });
  }

  async signIn(body: SignInDto) {
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
