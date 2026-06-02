import {
  Controller,
  Patch,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { XRSessionService } from './xr-session.service';
import { CompleteXRSessionDto, XRSessionCompleteResponseDto, XRSessionResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('sessions')
@Controller('sessions')
export class SessionController {
  constructor(private readonly xrSessionService: XRSessionService) {}

  /**
   * GET /sessions
   * List sessions with optional userId filter
   */
  @RequirePermissions([Permission.SESSION_READ])
  @Get()
  @ApiOkResponse({ type: XRSessionResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    return this.xrSessionService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      userId: userId || undefined,
      status,
    });
  }

  /**
   * PATCH /sessions/:sessionId/complete
   * Complete an XR session and update group_experience
   */
  @RequirePermissions([Permission.SESSION_UPDATE])
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
  @RequirePermissions([Permission.SESSION_READ])
  @Get(':sessionId')
  @ApiOkResponse({ type: XRSessionResponseDto })
  async getSession(@Param('sessionId') sessionId: string) {
    return this.xrSessionService.findById(sessionId);
  }
}