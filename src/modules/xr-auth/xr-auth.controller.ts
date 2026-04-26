import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { XrAuthService } from './xr-auth.service';
import { ValidatePinDto, XrTokenResponseDto } from './dto';
import { Request } from 'express';
import { SessionUser } from '@/guards/auth.guard';

@ApiTags('xr-auth')
@Controller('xr-auth')
export class XrAuthController {
  constructor(private readonly xrAuthService: XrAuthService) {}

  /**
   * Generate PIN for XR device login
   * Called from web interface when user is logged in
   */
  @Post('generate-pin')
  @HttpCode(HttpStatus.OK)
  async generatePin(@Req() req: Request & { user?: SessionUser }) {
    if (!req.user) {
      return { error: 'Unauthorized', message: 'Must be logged in to generate PIN' };
    }

    const pin = await this.xrAuthService.generatePin(req.user.id);
    return {
      pin,
      expiresIn: '5 minutes',
      message: 'PIN generated successfully. Enter this code on your XR device.',
    };
  }

  /**
   * Validate PIN and return JWT for XR device
   * Called from XR device with the 6-digit PIN
   */
  @Post('validate-pin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: XrTokenResponseDto })
  async validatePin(@Body() body: ValidatePinDto) {
    const result = await this.xrAuthService.validatePinAndGetToken(body);
    return {
      token: result.token,
      expiresAt: result.expiresAt.toISOString(),
      user: result.user,
    };
  }
}