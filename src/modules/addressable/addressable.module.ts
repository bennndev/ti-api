import { Module } from '@nestjs/common';
import { AddressableController, ExperienceAddressableController } from './addressable.controller';
import { AddressableService } from './addressable.service';
import { AddressableRepository } from './addressable.repository';

@Module({
  controllers: [AddressableController, ExperienceAddressableController],
  providers: [AddressableService, AddressableRepository],
  exports: [AddressableService],
})
export class AddressableModule {}