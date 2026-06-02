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
import { EmailService } from './email.service';
import { CreateEmailDto, UpdateEmailDto } from './dto/email.schema';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';
import { CurrentUser } from '@/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '@/guards/auth.guard';

@ApiTags('emails')
@Controller('users')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * GET /users/:id/emails
   * List all emails for a user
   */
  @RequirePermissions([Permission.USER_READ])
  @Get(':id/emails')
  @ApiOkResponse()
  async findAll(@Param('id') id: string) {
    return this.emailService.findAll(id);
  }

  /**
   * POST /users/:id/emails
   * Add a new email (only for self)
   */
  @RequirePermissions([Permission.USER_READ])
  @Post(':id/emails')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  async create(
    @Param('id') id: string,
    @Body() body: CreateEmailDto,
    @CurrentUser() currentUser: AuthenticatedRequest['user'],
  ) {
    if (currentUser.id !== id) {
      throw new ForbiddenException('Can only manage your own emails');
    }
    return this.emailService.create(id, body);
  }

  /**
   * PATCH /users/:id/emails/:emailId
   * Update an email (only for self)
   */
  @RequirePermissions([Permission.USER_READ])
  @Patch(':id/emails/:emailId')
  @ApiOkResponse()
  async update(
    @Param('id') id: string,
    @Param('emailId', ParseIntPipe) emailId: number,
    @Body() body: UpdateEmailDto,
    @CurrentUser() currentUser: AuthenticatedRequest['user'],
  ) {
    if (currentUser.id !== id) {
      throw new ForbiddenException('Can only manage your own emails');
    }
    return this.emailService.update(emailId, body);
  }

  /**
   * DELETE /users/:id/emails/:emailId
   * Delete an email (only for self)
   */
  @RequirePermissions([Permission.USER_READ])
  @Delete(':id/emails/:emailId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Param('emailId', ParseIntPipe) emailId: number,
    @CurrentUser() currentUser: AuthenticatedRequest['user'],
  ) {
    if (currentUser.id !== id) {
      throw new ForbiddenException('Can only manage your own emails');
    }
    return this.emailService.delete(emailId);
  }
}
