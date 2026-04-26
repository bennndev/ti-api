import { Module } from '@nestjs/common';
import { XrAuthController } from './xr-auth.controller';
import { XrAuthService } from './xr-auth.service';
import { XrAuthRepository } from './xr-auth.repository';

@Module({
  controllers: [XrAuthController],
  providers: [XrAuthService, XrAuthRepository],
  exports: [XrAuthService],
})
export class XrAuthModule {}