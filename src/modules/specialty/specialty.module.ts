import { Module } from '@nestjs/common';
import { SpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';
import { SpecialtyRepository } from './specialty.repository';

@Module({
  controllers: [SpecialtyController],
  providers: [SpecialtyService, SpecialtyRepository],
  exports: [SpecialtyService],
})
export class SpecialtyModule {}