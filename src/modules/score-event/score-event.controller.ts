import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ScoreEventService } from './score-event.service';
import { CreateScoreEventDto, ScoreEventResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('score-events')
@Controller('score-events')
export class ScoreEventController {
  constructor(private readonly scoreEventService: ScoreEventService) {}

  @RequirePermissions([Permission.STUDENT])
  @Post()
  @ApiOkResponse({ type: ScoreEventResponseDto })
  async create(@Body() body: CreateScoreEventDto) {
    return this.scoreEventService.create(body);
  }

  @RequirePermissions([Permission.SUPER_ADMIN, Permission.ORG_ADMIN, Permission.INSTRUCTOR, Permission.STUDENT])
  @Get()
  @ApiOkResponse({ type: ScoreEventResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'groupId', required: false, type: Number })
  @ApiQuery({ name: 'experienceId', required: false, type: Number })
  @ApiQuery({ name: 'sessionId', required: false, type: String })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('groupId') groupId?: string,
    @Query('experienceId') experienceId?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.scoreEventService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      groupId: groupId ? Number(groupId) : undefined,
      experienceId: experienceId ? Number(experienceId) : undefined,
      sessionId,
    });
  }

  @RequirePermissions([Permission.SUPER_ADMIN, Permission.ORG_ADMIN, Permission.INSTRUCTOR, Permission.STUDENT])
  @Get('session/:sessionId')
  @ApiOkResponse({ type: ScoreEventResponseDto, isArray: true })
  async findBySessionId(@Param('sessionId') sessionId: string) {
    return this.scoreEventService.findBySessionId(sessionId);
  }

  @RequirePermissions([Permission.SUPER_ADMIN, Permission.ORG_ADMIN, Permission.INSTRUCTOR, Permission.STUDENT])
  @Get('group/:groupId/experience/:experienceId')
  @ApiOkResponse({ type: ScoreEventResponseDto, isArray: true })
  async findByGroupAndExperience(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('experienceId', ParseIntPipe) experienceId: number,
  ) {
    return this.scoreEventService.findByGroupAndExperience(groupId, experienceId);
  }

  @RequirePermissions([Permission.SUPER_ADMIN, Permission.ORG_ADMIN, Permission.INSTRUCTOR, Permission.STUDENT])
  @Get(':id')
  @ApiOkResponse({ type: ScoreEventResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.scoreEventService.findById(id);
  }

  @RequirePermissions([Permission.SUPER_ADMIN, Permission.ORG_ADMIN])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.scoreEventService.delete(id);
  }
}