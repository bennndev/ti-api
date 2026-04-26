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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @RequirePermissions([Permission.DEPARTMENT_CREATE])
  @Post()
  @ApiOkResponse({ type: DepartmentResponseDto })
  async create(@Body() body: CreateDepartmentDto) {
    return this.departmentService.create(body);
  }

  @RequirePermissions([Permission.DEPARTMENT_READ])
  @Get()
  @ApiOkResponse({ type: DepartmentResponseDto, isArray: true })
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
    return this.departmentService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      orgId: orgId ? Number(orgId) : undefined,
      status: status !== undefined ? status === 'true' : undefined,
    });
  }

  @RequirePermissions([Permission.DEPARTMENT_READ])
  @Get(':id')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.findById(id);
  }

  @RequirePermissions([Permission.DEPARTMENT_UPDATE])
  @Patch(':id')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, body);
  }

  @RequirePermissions([Permission.DEPARTMENT_DELETE])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.softDelete(id);
  }
}