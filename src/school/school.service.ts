import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { DatabaseService } from 'src/database/database.service';
import type { StructuredResponse } from '../global/types';
import { Prisma } from 'generated/prisma';
@Injectable()
export class SchoolService {
  constructor(private readonly dbService: DatabaseService) {}
  async create(createSchoolDto: CreateSchoolDto) {
    const existingSchool = await this.dbService.school.findFirst({
      where: {
        email: createSchoolDto.email,
      },
    });
    if (existingSchool) {
      throw new ConflictException(
        'This School already exists in our database.',
      );
    }
    const data = await this.dbService.school.create({
      data: createSchoolDto,
    });
    return {
      ...data,
      message: 'School created Successfully',
    };
  }

  async findAll() {
    const schools = await this.dbService.school.findMany();

    return schools;
  }

  findOne(id: number) {
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  async remove(id: string) {
    return await this.dbService.school.delete({
      where: {
        id,
      },
    });
  }
}
