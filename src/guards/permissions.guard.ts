import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../modules/role/permissions.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RoleRepository } from '../modules/role/role.repository';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleRepository: RoleRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.roleId) {
      throw new ForbiddenException('No role assigned to user');
    }

    const role = await this.roleRepository.findById(user.roleId);

    if (!role) {
      throw new ForbiddenException('Role not found');
    }

    const hasPermission = requiredPermissions.some(
      (permission) => role.code === permission,
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}