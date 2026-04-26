import { Module } from '@nestjs/common';
import { ScoreEventController } from './score-event.controller';
import { ScoreEventService } from './score-event.service';
import { ScoreEventRepository } from './score-event.repository';

@Module({
  controllers: [ScoreEventController],
  providers: [ScoreEventService, ScoreEventRepository],
  exports: [ScoreEventService],
})
export class ScoreEventModule {}