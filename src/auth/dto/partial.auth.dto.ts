import { PartialType } from '@nestjs/swagger';
import { AdminLoginAuthDto, AdminSignUpAuthDto } from './auth.dto';

export class UpdateAdminLoginAuthDto extends PartialType(AdminLoginAuthDto) {}
export class UpdateAdminSignUpDto extends PartialType(AdminSignUpAuthDto) {}
