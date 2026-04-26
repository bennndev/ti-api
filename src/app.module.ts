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
import { PrismaModule } from './modules/prisma/prisma.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    OrganizationModule,
    UsersModule,
    DepartmentModule,
    SpecialtyModule,
    CourseModule,
    PrismaModule,
  ],
})
export class AppModule {}
