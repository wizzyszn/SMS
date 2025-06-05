import { Prisma } from 'generated/prisma';
export class CreateSchoolDto implements Prisma.SchoolCreateInput {
  name: string;
  address?: string | null | undefined;
  email?: string | null | undefined;
  phone?: string | null | undefined;
  website?: string | null | undefined;
  logo?: string | null | undefined;
  isActive?: boolean | undefined;
  createdBy?: Prisma.AdminCreateNestedOneWithoutCreatedSchoolsInput | undefined;
}
