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
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto, CourseResponseDto } from './dto';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @RequirePermissions([Permission.COURSE_CREATE])
  @Post()
  @ApiOkResponse({ type: CourseResponseDto })
  async create(@Body() body: CreateCourseDto) {
    return this.courseService.create(body);
  }

  @RequirePermissions([Permission.COURSE_READ])
  @Get()
  @ApiOkResponse({ type: CourseResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'specialtyId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('specialtyId') specialtyId?: string,
    @Query('status') status?: string,
  ) {
    return this.courseService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      specialtyId: specialtyId ? Number(specialtyId) : undefined,
      status: status !== undefined ? status === 'true' : undefined,
    });
  }

  @RequirePermissions([Permission.COURSE_READ])
  @Get(':id')
  @ApiOkResponse({ type: CourseResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findById(id);
  }

  @RequirePermissions([Permission.COURSE_UPDATE])
  @Patch(':id')
  @ApiOkResponse({ type: CourseResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCourseDto,
  ) {
    return this.courseService.update(id, body);
  }

  @RequirePermissions([Permission.COURSE_DELETE])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.softDelete(id);
  }
}