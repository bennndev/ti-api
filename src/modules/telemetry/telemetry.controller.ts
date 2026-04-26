import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { TelemetryService } from './telemetry.service';
import { CloseSessionDto, CloseSessionResponseDto } from './dto';

@ApiTags('telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post('session')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CloseSessionResponseDto })
  async closeSession(@Body() body: CloseSessionDto) {
    return this.telemetryService.closeSession(body);
  }
}