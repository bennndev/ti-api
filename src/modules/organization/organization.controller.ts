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
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @RequirePermissions([Permission.ORGANIZATION_CREATE])
  @Post()
  @ApiOkResponse({ type: OrganizationResponseDto })
  async create(@Body() body: CreateOrganizationDto) {
    return this.organizationService.create(body);
  }

  @RequirePermissions([Permission.ORGANIZATION_READ])
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

  @RequirePermissions([Permission.ORGANIZATION_READ])
  @Get(':id')
  @ApiOkResponse({ type: OrganizationResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.findById(id);
  }

  @RequirePermissions([Permission.ORGANIZATION_UPDATE])
  @Patch(':id')
  @ApiOkResponse({ type: OrganizationResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, body);
  }

  @RequirePermissions([Permission.ORGANIZATION_DELETE])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.softDelete(id);
  }
}
