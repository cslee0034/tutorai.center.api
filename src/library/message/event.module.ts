import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot({ verboseMemoryLeak: true })],
})
export class EventModule {}
