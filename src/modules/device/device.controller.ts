import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { RequirePermissions } from '@/decorators/permissions.decorator';
import { Permission } from '@/modules/role/permissions.enum';

@ApiTags('devices')
@Controller('users')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  /**
   * GET /users/:id/devices
   * List all XR devices for a user
   */
  @RequirePermissions([Permission.USER_READ])
  @Get(':id/devices')
  @ApiOkResponse()
  async findAll(@Param('id') id: string) {
    return this.deviceService.findAll(id);
  }
}
