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
import { AddressableService } from './addressable.service';
import {
  CreateAddressableDto,
  UpdateAddressableDto,
  AddressableResponseDto,
  AddressableUnityResponseDto,
} from './dto';

@ApiTags('addressables')
@Controller('addressables')
export class AddressableController {
  constructor(private readonly addressableService: AddressableService) {}

  @Post()
  @ApiOkResponse({ type: AddressableResponseDto })
  async create(@Body() body: CreateAddressableDto) {
    return this.addressableService.create(body);
  }

  @Get()
  @ApiOkResponse({ type: AddressableResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'experienceId', required: false, type: Number })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('experienceId') experienceId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.addressableService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      experienceId: experienceId ? Number(experienceId) : undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: AddressableResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.addressableService.findById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: AddressableResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAddressableDto,
  ) {
    return this.addressableService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.addressableService.delete(id);
  }
}

// Endpoint específico para Unity
@ApiTags('experiences')
@Controller('experiences')
export class ExperienceAddressableController {
  constructor(private readonly addressableService: AddressableService) {}

  @Get(':experienceId/addressable')
  @ApiOkResponse({ type: AddressableUnityResponseDto })
  async getByExperience(@Param('experienceId', ParseIntPipe) experienceId: number) {
    return this.addressableService.findByExperienceId(experienceId);
  }
}