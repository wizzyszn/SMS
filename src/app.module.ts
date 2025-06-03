import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StandardLoggerService } from './logger/logger.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,StandardLoggerService],
  exports : [StandardLoggerService]
})
export class AppModule {}
