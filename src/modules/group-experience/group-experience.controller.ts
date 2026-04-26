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
import { GroupExperienceService } from './group-experience.service';
import { CreateGroupExperienceDto, UpdateGroupExperienceDto, GroupExperienceResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('group-experiences')
@Controller('group-experiences')
export class GroupExperienceController {
  constructor(private readonly groupExperienceService: GroupExperienceService) {}

  @RequirePermissions([Permission.GROUP_EXPERIENCE_CREATE])
  @Post()
  @ApiOkResponse({ type: GroupExperienceResponseDto })
  async create(@Body() body: CreateGroupExperienceDto) {
    return this.groupExperienceService.create(body);
  }

  @RequirePermissions([Permission.GROUP_EXPERIENCE_READ])
  @Get()
  @ApiOkResponse({ type: GroupExperienceResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'groupId', required: false, type: Number })
  @ApiQuery({ name: 'experienceId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('groupId') groupId?: string,
    @Query('experienceId') experienceId?: string,
    @Query('status') status?: string,
  ) {
    return this.groupExperienceService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      groupId: groupId ? Number(groupId) : undefined,
      experienceId: experienceId ? Number(experienceId) : undefined,
      status,
    });
  }

  @RequirePermissions([Permission.GROUP_EXPERIENCE_READ])
  @Get(':groupId/:experienceId')
  @ApiOkResponse({ type: GroupExperienceResponseDto })
  async findById(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('experienceId', ParseIntPipe) experienceId: number,
  ) {
    return this.groupExperienceService.findById(groupId, experienceId);
  }

  @RequirePermissions([Permission.GROUP_EXPERIENCE_UPDATE])
  @Patch(':groupId/:experienceId')
  @ApiOkResponse({ type: GroupExperienceResponseDto })
  async update(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('experienceId', ParseIntPipe) experienceId: number,
    @Body() body: UpdateGroupExperienceDto,
  ) {
    return this.groupExperienceService.update(groupId, experienceId, body);
  }

  @RequirePermissions([Permission.GROUP_EXPERIENCE_DELETE])
  @Delete(':groupId/:experienceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('experienceId', ParseIntPipe) experienceId: number,
  ) {
    return this.groupExperienceService.delete(groupId, experienceId);
  }
}