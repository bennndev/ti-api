import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';

@Module({
  controllers: [EmailController, PhoneController],
  providers: [EmailService, PhoneService],
  exports: [EmailService, PhoneService],
})
export class ContactModule {}
