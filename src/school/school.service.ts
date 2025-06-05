import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { DatabaseService } from 'src/database/database.service';

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
    return await this.dbService.school.create({
      data: createSchoolDto,
    });
  }

  findAll() {
    return `This action returns all school`;
  }

  findOne(id: number) {
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
