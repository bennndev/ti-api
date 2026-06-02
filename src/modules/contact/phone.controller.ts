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
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { PhoneService } from './phone.service';
import { CreatePhoneDto, UpdatePhoneDto } from './dto/phone.schema';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';
import { CurrentUser } from '@/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '@/guards/auth.guard';

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
   * Add a new phone (only for self)
   */
  @RequirePermissions([Permission.USER_READ])
  @Post(':id/phones')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  async create(
    @Param('id') id: string,
    @Body() body: CreatePhoneDto,
    @CurrentUser() currentUser: AuthenticatedRequest['user'],
  ) {
    if (currentUser.id !== id) {
      throw new ForbiddenException('Can only manage your own phones');
    }
    return this.phoneService.create(id, body);
  }

  /**
   * PATCH /users/:id/phones/:phoneId
   * Update a phone (only for self)
   */
  @RequirePermissions([Permission.USER_READ])
  @Patch(':id/phones/:phoneId')
  @ApiOkResponse()
  async update(
    @Param('id') id: string,
    @Param('phoneId', ParseIntPipe) phoneId: number,
    @Body() body: UpdatePhoneDto,
    @CurrentUser() currentUser: AuthenticatedRequest['user'],
  ) {
    if (currentUser.id !== id) {
      throw new ForbiddenException('Can only manage your own phones');
    }
    return this.phoneService.update(phoneId, body);
  }

  /**
   * DELETE /users/:id/phones/:phoneId
   * Delete a phone (only for self)
   */
  @RequirePermissions([Permission.USER_READ])
  @Delete(':id/phones/:phoneId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Param('phoneId', ParseIntPipe) phoneId: number,
    @CurrentUser() currentUser: AuthenticatedRequest['user'],
  ) {
    if (currentUser.id !== id) {
      throw new ForbiddenException('Can only manage your own phones');
    }
    return this.phoneService.delete(phoneId);
  }
}
