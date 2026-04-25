import { Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import type { IncomingHttpHeaders } from 'http';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { signUpSchema } from './dto/sign-up.schema';
import { signInSchema } from './dto/sign-in.schema';
import { AuthGuard } from '@/guards/auth.guard';
import type { AuthenticatedRequest } from '@/guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Req() req: Request) {
    const body = signUpSchema.parse(req.body);
    return this.authService.signUp(body);
  }

  @Post('sign-in')
  async signIn(@Req() req: Request) {
    const body = signInSchema.parse(req.body);
    return this.authService.signIn(body);
  }

  @Post('sign-out')
  async signOut(@Req() req: Request) {
    return this.authService.signOut(
      req.headers as unknown as IncomingHttpHeaders,
    );
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
