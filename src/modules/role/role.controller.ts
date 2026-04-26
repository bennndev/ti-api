import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { RoleResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from './permissions.enum';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @RequirePermissions([Permission.SUPER_ADMIN, Permission.ORG_ADMIN])
  @Get()
  @ApiOkResponse({ type: RoleResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.roleService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @RequirePermissions([Permission.SUPER_ADMIN, Permission.ORG_ADMIN, Permission.INSTRUCTOR, Permission.STUDENT])
  @Get(':id')
  @ApiOkResponse({ type: RoleResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findById(id);
  }
}