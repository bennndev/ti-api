import { Controller, Post, Get, Req, UseGuards, Body } from '@nestjs/common';
import type { IncomingHttpHeaders } from 'http';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.schema';
import { SignInDto } from './dto/sign-in.schema';
import { AuthGuard } from '@/guards/auth.guard';
import type { AuthenticatedRequest } from '@/guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
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
