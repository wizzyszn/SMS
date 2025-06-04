import { $Enums, Prisma } from 'generated/prisma';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
export class AdminSignUpAuthDto implements Prisma.AdminCreateInput {
  @IsNotEmpty({ message: 'First Name is required' })
  firstName: string;
  @IsNotEmpty({ message: 'Last Name is required' })
  lastName: string;
  middleName?: string | null | undefined;
  @IsEmail({},{message : "Please provide a valid email address"})
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  role?: $Enums.Role | undefined;
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  password: string;
  address?: string | null | undefined;
  avi?: string | null | undefined;
  phone?: string | null | undefined;
  isActive?: boolean | undefined;
  lastLogin?: string | Date | null | undefined;
  school: Prisma.SchoolCreateNestedOneWithoutAdminsInput;
}
export class AdminLoginAuthDto {}
