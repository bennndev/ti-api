import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto';
import { OrganizationResponseDto } from './dto/response-organization.schema';
import { Public } from '@/decorators/public.decorator';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOkResponse({ type: OrganizationResponseDto })
  async create(@Body() body: CreateOrganizationDto) {
    return this.organizationService.create(body);
  }

  @Get()
  @ApiOkResponse({ type: OrganizationResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
  ) {
    return this.organizationService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      status: status !== undefined ? status === 'true' : undefined,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: OrganizationResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.findById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: OrganizationResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.softDelete(id);
  }
}
