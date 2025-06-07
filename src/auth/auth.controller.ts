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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginAuthDto, AdminSignUpAuthDto } from './dto/auth.dto';
import { Roles } from 'src/decorators/roles';
import { Role } from 'src/global/types';
import { RolesGuard } from 'src/guards/roles';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary:
      'Create an Admin Account. Note that only a super admin is allowed to create an Admin',
  })
  @ApiResponse({ status: 201, description: 'Admin created Succesfully' })
  @ApiResponse({ status: 409, description: 'Admin already exists' })
  @ApiResponse({ status: 404, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({
    type: AdminSignUpAuthDto,
    description: 'Admin registration details',
    examples: {
      example1: {
        summary: 'Complete admin registration',
        description: 'Example of creating a new admin with all required fields',
        value: {
          email: 'admin@school.edu',
          password: 'SecurePassword123!',
          role: 'ADMIN',
          address: '123 School Street',
          school: {
            connect: {
              id: 'school-uuid-here',
            },
          },
        },
      },
    },
  })
  @Post('register/admin')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createAdmin(@Body(ValidationPipe) payload: AdminSignUpAuthDto) {
    return await this.authService.signUpAdmin(payload);
  }
  @Post('register/super')
  async createSuperAdmin(@Body(ValidationPipe) payload: AdminSignUpAuthDto) {
    return await this.authService.signUpSuperAdmin(payload);
  }
  @Post('login/super')
  async loginSuperAdmin(@Body(ValidationPipe) payload: AdminLoginAuthDto) {
    return await this.authService.loginSuperAdmin(payload);
  }
  @Post("login/admin")
  async loginAdmin(@Body(ValidationPipe) payload : AdminLoginAuthDto) {
    return await this.authService.loginAdmin(payload)
  }
  @Get()
  findAll() {
    return;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: any) {
    return;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return;
  }
}
