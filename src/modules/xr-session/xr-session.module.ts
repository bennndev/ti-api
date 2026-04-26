import { Module } from '@nestjs/common';
import { XRSessionController } from './xr-session.controller';
import { SessionController } from './session.controller';
import { XRSessionService } from './xr-session.service';
import { XRSessionRepository } from './xr-session.repository';

@Module({
  controllers: [XRSessionController, SessionController],
  providers: [XRSessionService, XRSessionRepository],
  exports: [XRSessionService],
})
export class XRSessionModule {}