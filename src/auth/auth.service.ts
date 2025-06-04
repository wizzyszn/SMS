import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { AdminSignUpAuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}
  async signUpAdmin(payload : AdminSignUpAuthDto){
    
  }
}
