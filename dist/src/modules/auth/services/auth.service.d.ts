import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly config;
    constructor(jwtService: JwtService, config: ConfigService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        tokenType: string;
    }>;
}
