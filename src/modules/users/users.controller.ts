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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { Roles } from '@/decorators/roles.decorator';
import { CurrentUser } from '@/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '@/guards/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(['1']) // super_admin only
  @ApiOkResponse({ type: UserResponseDto })
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

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

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.usersService.update(id, body, user as any);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.usersService.softDelete(id, user as any);
  }
}