import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const username = this.config.get<string>('ADMIN_USERNAME', 'admin');
    const password = this.config.get<string>('ADMIN_PASSWORD', 'admin123');

    if (dto.username !== username || dto.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({
      sub: 'admin',
      username: dto.username,
    });

    return { accessToken: token, tokenType: 'Bearer' };
  }
}
