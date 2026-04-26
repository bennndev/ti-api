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
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto, UpdateSpecialtyDto, SpecialtyResponseDto } from './dto';

@ApiTags('specialties')
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post()
  @ApiOkResponse({ type: SpecialtyResponseDto })
  async create(@Body() body: CreateSpecialtyDto) {
    return this.specialtyService.create(body);
  }

  @Get()
  @ApiOkResponse({ type: SpecialtyResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'departmentId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
  ) {
    return this.specialtyService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      departmentId: departmentId ? Number(departmentId) : undefined,
      status: status !== undefined ? status === 'true' : undefined,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: SpecialtyResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.specialtyService.findById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: SpecialtyResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateSpecialtyDto,
  ) {
    return this.specialtyService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.specialtyService.softDelete(id);
  }
}