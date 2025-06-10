import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    const existingSchool = await this.dbService.school.findUnique({
      where: {
        id,
      },
    });
    if (!existingSchool) {
      throw new ConflictException(
        "This school doesn't exists in our database.",
      );
    }
    
    return await this.dbService.school.update({
      where: {
        id,
      },
      data: updateSchoolDto,
    });
  }

  async remove(id: string) {
    const data = await this.dbService.school.delete({
      where: {
        id,
      },
    });
    return {
      ...data,
      message: 'School successfully deleted.',
    };
  }
  async status(id: string, status: string) {
    const existingSchool = await this.dbService.school.findUnique({
      where: {
        id,
      },
    });
    if (!existingSchool) {
      throw new NotFoundException(
        "This school doesn't exists in our database.",
      );
    }
    if (!['true', 'false'].includes(status)) {
      throw new BadRequestException("Status must be either 'true' or 'false'");
    }
    const isActive = status === 'true';
    const data = await this.dbService.school.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });
    return {
      ...data,
      message: `School successfully is ${isActive ? 'activated' : 'deactivated'}`,
    };
  }
}
