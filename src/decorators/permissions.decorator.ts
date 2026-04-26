import { Reflector } from '@nestjs/core';
import { Permission } from '../modules/role/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = Reflector.createDecorator<Permission[]>();