import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto, UpdateExperienceDto, ExperienceResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('experiences')
@Controller('experiences')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @RequirePermissions([Permission.EXPERIENCE_CREATE])
  @Post()
  @ApiOkResponse({ type: ExperienceResponseDto })
  async create(@Body() body: CreateExperienceDto) {
    return this.experienceService.create(body);
  }

  @RequirePermissions([Permission.EXPERIENCE_READ])
  @Get()
  @ApiOkResponse({ type: ExperienceResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'courseId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('courseId') courseId?: string,
    @Query('status') status?: string,
  ) {
    return this.experienceService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      courseId: courseId ? Number(courseId) : undefined,
      status,
    });
  }

  @RequirePermissions([Permission.EXPERIENCE_READ])
  @Get(':id')
  @ApiOkResponse({ type: ExperienceResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.experienceService.findById(id);
  }

  @RequirePermissions([Permission.EXPERIENCE_UPDATE])
  @Patch(':id')
  @ApiOkResponse({ type: ExperienceResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateExperienceDto,
  ) {
    return this.experienceService.update(id, body);
  }

  @RequirePermissions([Permission.EXPERIENCE_DELETE])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.experienceService.softDelete(id);
  }
}