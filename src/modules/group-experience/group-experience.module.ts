import { Module } from '@nestjs/common';
import { GroupExperienceController } from './group-experience.controller';
import { GroupExperienceService } from './group-experience.service';
import { GroupExperienceRepository } from './group-experience.repository';

@Module({
  controllers: [GroupExperienceController],
  providers: [GroupExperienceService, GroupExperienceRepository],
  exports: [GroupExperienceService],
})
export class GroupExperienceModule {}