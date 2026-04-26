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
import { UserGroupService } from './user-group.service';
import { CreateUserGroupDto, UpdateUserGroupDto, UserGroupResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('user-groups')
@Controller('user-groups')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @RequirePermissions([Permission.USER_GROUP_CREATE])
  @Post()
  @ApiOkResponse({ type: UserGroupResponseDto })
  async create(@Body() body: CreateUserGroupDto) {
    return this.userGroupService.create(body);
  }

  @RequirePermissions([Permission.USER_GROUP_READ])
  @Get()
  @ApiOkResponse({ type: UserGroupResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'groupId', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('groupId') groupId?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    return this.userGroupService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      groupId: groupId ? Number(groupId) : undefined,
      userId,
      status,
    });
  }

  @RequirePermissions([Permission.USER_GROUP_READ])
  @Get(':userId/:groupId')
  @ApiOkResponse({ type: UserGroupResponseDto })
  async findById(
    @Param('userId') userId: string,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.userGroupService.findById(userId, groupId);
  }

  @RequirePermissions([Permission.USER_GROUP_UPDATE])
  @Patch(':userId/:groupId')
  @ApiOkResponse({ type: UserGroupResponseDto })
  async update(
    @Param('userId') userId: string,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() body: UpdateUserGroupDto,
  ) {
    return this.userGroupService.update(userId, groupId, body);
  }

  @RequirePermissions([Permission.USER_GROUP_DELETE])
  @Delete(':userId/:groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('userId') userId: string,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.userGroupService.delete(userId, groupId);
  }
}