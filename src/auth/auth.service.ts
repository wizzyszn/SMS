import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AdminSignUpAuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private readonly dbService: DatabaseService) {}
  async signUpAdmin(payload: AdminSignUpAuthDto) {
    const [existingAdmin, existingSchool] = await Promise.all([
      this.dbService.admin.findFirst({
        where: {
          email: payload.email,
          schoolId: payload.school.connect?.id,
        },
      }),
      this.dbService.school.findFirst({
        where: {
          id: payload.school.connect?.id,
        },
      }),
    ]);
    if (!existingSchool) {
      throw new NotFoundException("This School doesn't exists in our Database");
    }
    if (existingAdmin) {
      throw new ConflictException('This admin already exists in our database');
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(payload.password, salt);
    return await this.dbService.admin.create({
      data: {
        ...payload,
        password: hashedPassword,
        role: 'ADMIN',
      },
      select: {
        email: true,
        role: true,
        address: true,
        avi: true,
        lastLogin: true,
      },
    });
  }
  async signUpSuperAdmin(payload: AdminSignUpAuthDto) {
    const existingAdmin = await this.dbService.admin.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (existingAdmin) {
      throw new ConflictException('This Super Admin already exists');
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(payload.password, salt);
    return await this.dbService.admin.create({
      data: {
        ...payload,
        role: 'SUPER_ADMIN',
        password: hashedPassword,
      },
      select: {
        email: true,
        role: true,
        address: true,
        avi: true,
        lastLogin: true,
      },
    });
  }
}
