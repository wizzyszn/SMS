import { IsEmail, IsNotEmpty } from 'class-validator';
import { Prisma } from 'generated/prisma';
export class CreateSchoolDto implements Prisma.SchoolCreateInput {
  @IsNotEmpty()
  name: string;
  address?: string | null | undefined;
  @IsEmail()
  email?: string | null | undefined;
  phone?: string | null | undefined;
  website?: string | null | undefined;
  logo?: string | null | undefined;
  isActive?: boolean | undefined;
  createdBy?: Prisma.AdminCreateNestedOneWithoutCreatedSchoolsInput | undefined;
}
