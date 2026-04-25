import { Controller, Post, Get, Req, Body } from '@nestjs/common';
import type { IncomingHttpHeaders } from 'http';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.schema';
import { SignInDto } from './dto/sign-in.schema';
import { Public } from '@/decorators/public.decorator';
import { CurrentUser } from '@/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '@/guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Public()
  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Public()
  @Post('sign-out')
  async signOut(@Req() req: Request) {
    return this.authService.signOut(
      req.headers as unknown as IncomingHttpHeaders,
    );
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedRequest['user']) {
    return user;
  }
}
