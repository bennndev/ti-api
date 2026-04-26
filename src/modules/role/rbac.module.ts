import { Module } from '@nestjs/common';
import { RoleModule } from './role.module';
import { PermissionsGuard } from '../../guards/permissions.guard';

@Module({
  imports: [RoleModule],
  providers: [PermissionsGuard],
  exports: [PermissionsGuard],
})
export class RbacModule {}