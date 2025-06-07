export enum Role {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

interface StructuredResponse<D> {
  data: D;
  message: string;
  success: boolean;
  timestamp: string;
}

export type {
  StructuredResponse
}
