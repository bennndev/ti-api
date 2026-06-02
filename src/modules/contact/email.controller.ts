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
import { EmailService } from './email.service';
import { CreateEmailDto, UpdateEmailDto } from './dto/email.schema';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

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
   * Add a new email for a user
   */
  @RequirePermissions([Permission.USER_UPDATE])
  @Post(':id/emails')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  async create(
    @Param('id') id: string,
    @Body() body: CreateEmailDto,
  ) {
    return this.emailService.create(id, body);
  }

  /**
   * PATCH /users/:id/emails/:emailId
   * Update an email for a user
   */
  @RequirePermissions([Permission.USER_UPDATE])
  @Patch(':id/emails/:emailId')
  @ApiOkResponse()
  async update(
    @Param('emailId', ParseIntPipe) emailId: number,
    @Body() body: UpdateEmailDto,
  ) {
    return this.emailService.update(emailId, body);
  }

  /**
   * DELETE /users/:id/emails/:emailId
   * Delete an email for a user
   */
  @RequirePermissions([Permission.USER_UPDATE])
  @Delete(':id/emails/:emailId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('emailId', ParseIntPipe) emailId: number) {
    return this.emailService.delete(emailId);
  }
}
