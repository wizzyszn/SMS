import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { DatabaseService } from 'src/database/database.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, DatabaseService],
  imports : [JwtModule]
})
export class SchoolModule {}
