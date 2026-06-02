import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { PhoneService } from './phone.service';
import { CreatePhoneDto, UpdatePhoneDto } from './dto/phone.schema';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('phones')
@Controller('users')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  /**
   * GET /users/:id/phones
   * List all phones for a user
   */
  @RequirePermissions([Permission.USER_READ])
  @Get(':id/phones')
  @ApiOkResponse()
  async findAll(@Param('id') id: string) {
    return this.phoneService.findAll(id);
  }

  /**
   * POST /users/:id/phones
   * Add a new phone for a user
   */
  @RequirePermissions([Permission.USER_UPDATE])
  @Post(':id/phones')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  async create(
    @Param('id') id: string,
    @Body() body: CreatePhoneDto,
  ) {
    return this.phoneService.create(id, body);
  }

  /**
   * PATCH /users/:id/phones/:phoneId
   * Update a phone for a user
   */
  @RequirePermissions([Permission.USER_UPDATE])
  @Patch(':id/phones/:phoneId')
  @ApiOkResponse()
  async update(
    @Param('phoneId', ParseIntPipe) phoneId: number,
    @Body() body: UpdatePhoneDto,
  ) {
    return this.phoneService.update(phoneId, body);
  }

  /**
   * DELETE /users/:id/phones/:phoneId
   * Delete a phone for a user
   */
  @RequirePermissions([Permission.USER_UPDATE])
  @Delete(':id/phones/:phoneId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('phoneId', ParseIntPipe) phoneId: number) {
    return this.phoneService.delete(phoneId);
  }
}
