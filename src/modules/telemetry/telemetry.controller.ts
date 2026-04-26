import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { TelemetryService } from './telemetry.service';
import { CloseSessionDto, CloseSessionResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @RequirePermissions([Permission.TELEMETRY_CREATE])
  @Post('session')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CloseSessionResponseDto })
  async closeSession(@Body() body: CloseSessionDto) {
    return this.telemetryService.closeSession(body);
  }
}