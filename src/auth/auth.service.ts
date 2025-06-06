import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AdminLoginAuthDto, AdminSignUpAuthDto } from './dto/auth.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}
  async signUpAdmin(payload: AdminSignUpAuthDto) {
    const [existingAdmin, existingSchool] = await Promise.all([
      this.dbService.admin.findFirst({
        where: {
          email: payload.email,
          schoolId: payload.school?.connect?.id,
        },
      }),
      this.dbService.school.findFirst({
        where: {
          id: payload.school?.connect?.id,
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
  async loginSuperAdmin(payload: AdminLoginAuthDto) {
    const admin = await this.dbService.admin.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (!admin) {
      throw new ConflictException('Invalid credentials');
    }
    const retrievedPassword = admin.password;
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      retrievedPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwtPayload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
    return {
      id : admin.id,
      avi : admin.avi,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      access_token: this.jwtService.sign(jwtPayload),
    };
  }
}
