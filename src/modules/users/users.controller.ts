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
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { RoleRepository } from '@/modules/role/role.repository';
import type { AuthenticatedRequest } from '@/guards/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly roleRepository: RoleRepository,
  ) {}

  @RequirePermissions([Permission.USER_CREATE])
  @Throttle({
    default: { ttl: 60000, limit: 200 },
  })
  @Post()
  @ApiOkResponse({ type: UserResponseDto })
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @RequirePermissions([Permission.USER_READ])
  @Get()
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'orgId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('orgId') orgId?: string,
    @Query('status') status?: string,
  ) {
    return this.usersService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      orgId: orgId ? Number(orgId) : undefined,
      status: status !== undefined ? status === 'true' : undefined,
    });
  }

  @Get('me')
  @ApiOkResponse({ type: UserResponseDto })
  async me(@CurrentUser() user: AuthenticatedRequest['user']) {
    if (!user) {
      return null;
    }

    let role: { id: number; name: string; code: string; description: string | null } | null = null;
    if (user.roleId) {
      role = await this.roleRepository.findById(user.roleId);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      orgId: user.orgId,
      roleId: user.roleId,
      username: user.username,
      role: role ? { id: role.id, name: role.name, code: role.code, description: role.description } : null,
    };
  }

  @RequirePermissions([Permission.USER_READ])
  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @RequirePermissions([Permission.USER_UPDATE])
  @Patch(':id')
  @ApiOkResponse({ type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.usersService.update(id, body, user as any);
  }

  @RequirePermissions([Permission.USER_DELETE])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.usersService.softDelete(id, user as any);
  }
}
