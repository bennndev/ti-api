import {
  Controller,
  Patch,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { XRSessionService } from './xr-session.service';
import { CompleteXRSessionDto, XRSessionCompleteResponseDto, XRSessionResponseDto } from './dto';

@ApiTags('sessions')
@Controller('sessions')
export class SessionController {
  constructor(private readonly xrSessionService: XRSessionService) {}

  /**
   * PATCH /sessions/:sessionId/complete
   * Complete an XR session and update group_experience
   */
  @Patch(':sessionId/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: XRSessionCompleteResponseDto })
  async completeSession(
    @Param('sessionId') sessionId: string,
    @Body() body: CompleteXRSessionDto,
  ) {
    return this.xrSessionService.complete(sessionId, body);
  }

  /**
   * GET /sessions/:sessionId
   * Get session details
   */
  @Get(':sessionId')
  @ApiOkResponse({ type: XRSessionResponseDto })
  async getSession(@Param('sessionId') sessionId: string) {
    return this.xrSessionService.findById(sessionId);
  }
}