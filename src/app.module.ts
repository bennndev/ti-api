import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { UsersModule } from './modules/users/users.module';
import { DepartmentModule } from './modules/department/department.module';
import { SpecialtyModule } from './modules/specialty/specialty.module';
import { CourseModule } from './modules/course/course.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { GroupModule } from './modules/group/group.module';
import { UserGroupModule } from './modules/user-group/user-group.module';
import { GroupExperienceModule } from './modules/group-experience/group-experience.module';
import { ScoreEventModule } from './modules/score-event/score-event.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { RoleModule } from './modules/role/role.module';
import { RbacModule } from './modules/role/rbac.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { XrAuthModule } from './modules/xr-auth/xr-auth.module';
import { AddressableModule } from './modules/addressable/addressable.module';
import { XRSessionModule } from './modules/xr-session/xr-session.module';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    OrganizationModule,
    UsersModule,
    DepartmentModule,
    SpecialtyModule,
    CourseModule,
    ExperienceModule,
    GroupModule,
    UserGroupModule,
    GroupExperienceModule,
    ScoreEventModule,
    TelemetryModule,
    RoleModule,
    RbacModule,
    XrAuthModule,
    AddressableModule,
    XRSessionModule,
    ActivityLogModule,
    PrismaModule,
  ],
})
export class AppModule {}
