import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { RolesGuard } from 'src/guards/roles';
import { Role } from 'generated/prisma';
import { Roles } from 'src/decorators/roles';
import { AuthToken } from 'src/decorators/token';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async create(@Body(ValidationPipe) createSchoolDto: CreateSchoolDto) {
    return await this.schoolService.create(createSchoolDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async findAll() {
    return await this.schoolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body(ValidationPipe) updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.schoolService.remove(id);
  }
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  status(@Param('id') id: string, @Query('status') status: string) {
    return this.schoolService.status(id, status);
  }
}
