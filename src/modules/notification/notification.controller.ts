import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { UpdateNotifPrefDto } from './dto/update-notif-pref.schema';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('notification-preferences')
@Controller('users')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * GET /users/:id/notification-preferences
   * List all notification preferences for a user
   */
  @RequirePermissions([Permission.USER_READ])
  @Get(':id/notification-preferences')
  @ApiOkResponse()
  async findAll(@Param('id') id: string) {
    return this.notificationService.findAll(id);
  }

  /**
   * PATCH /users/:id/notification-preferences
   * Upsert notification preferences for a user
   */
  @RequirePermissions([Permission.USER_UPDATE])
  @Patch(':id/notification-preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async upsert(
    @Param('id') id: string,
    @Body() body: UpdateNotifPrefDto,
  ) {
    return this.notificationService.upsert(id, body);
  }
}
