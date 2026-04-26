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
import { GroupService } from './group.service';
import { CreateGroupDto, UpdateGroupDto, GroupResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @RequirePermissions([Permission.GROUP_CREATE])
  @Post()
  @ApiOkResponse({ type: GroupResponseDto })
  async create(@Body() body: CreateGroupDto) {
    return this.groupService.create(body);
  }

  @RequirePermissions([Permission.GROUP_READ])
  @Get()
  @ApiOkResponse({ type: GroupResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'orgId', required: false, type: Number })
  @ApiQuery({ name: 'courseId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('orgId') orgId?: string,
    @Query('courseId') courseId?: string,
    @Query('status') status?: string,
  ) {
    return this.groupService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      orgId: orgId ? Number(orgId) : undefined,
      courseId: courseId ? Number(courseId) : undefined,
      status,
    });
  }

  @RequirePermissions([Permission.GROUP_READ])
  @Get(':id')
  @ApiOkResponse({ type: GroupResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.findById(id);
  }

  @RequirePermissions([Permission.GROUP_UPDATE])
  @Patch(':id')
  @ApiOkResponse({ type: GroupResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGroupDto,
  ) {
    return this.groupService.update(id, body);
  }

  @RequirePermissions([Permission.GROUP_DELETE])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.softDelete(id);
  }
}