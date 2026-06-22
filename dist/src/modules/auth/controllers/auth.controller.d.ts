import { ApiResponse } from '../../../common/utils/api-response';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<ApiResponse<{
        accessToken: string;
        tokenType: string;
    }>>;
}
