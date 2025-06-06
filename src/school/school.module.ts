import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, DatabaseService],
  imports: [],
})
export class SchoolModule {}
