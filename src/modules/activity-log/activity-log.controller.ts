import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ActivityLogService } from './activity-log.service';
import {
  CreateActivityLogDto,
  CreateActivityLogBatchDto,
  ActivityLogResponseDto,
} from './dto';

@ApiTags('activity-log')
@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  /**
   * POST /activity-log
   * Create a single activity log entry (fire-and-forget)
   */
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: ActivityLogResponseDto })
  async create(@Body() body: CreateActivityLogDto) {
    return this.activityLogService.create(body);
  }

  /**
   * POST /activity-log/batch
   * Create multiple activity log entries (fire-and-forget)
   */
  @Post('batch')
  @HttpCode(HttpStatus.ACCEPTED)
  async createBatch(@Body() body: CreateActivityLogBatchDto) {
    return this.activityLogService.createBatch(body);
  }

  /**
   * GET /activity-log
   * List activity logs (with pagination and filters)
   */
  @Get()
  @ApiOkResponse({ type: ActivityLogResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'orgId', required: false, type: Number })
  @ApiQuery({ name: 'action', required: false, type: String })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('userId') userId?: string,
    @Query('orgId') orgId?: string,
    @Query('action') action?: string,
  ) {
    return this.activityLogService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      userId,
      orgId: orgId ? Number(orgId) : undefined,
      action,
    });
  }

  /**
   * GET /activity-log/:id
   * Get a single activity log by ID
   */
  @Get(':id')
  @ApiOkResponse({ type: ActivityLogResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.activityLogService.findById(id);
  }
}