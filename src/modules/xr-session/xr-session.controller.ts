import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { XRSessionService } from './xr-session.service';
import { CreateXRSessionBodyDto, XRSessionResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('experiences')
@Controller('experiences')
export class XRSessionController {
  constructor(private readonly xrSessionService: XRSessionService) {}

  /**
   * POST /experiences/:experienceId/sessions
   * Create a new XR session when user starts an experience
   */
  @RequirePermissions([Permission.EXPERIENCE_SESSION])
  @Post(':experienceId/sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: XRSessionResponseDto })
  async createSession(
    @Param('experienceId', ParseIntPipe) experienceId: number,
    @Body() body: CreateXRSessionBodyDto,
  ) {
    return this.xrSessionService.create(experienceId, body);
  }
}