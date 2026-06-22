import { ApiResponse } from '../../../common/utils/api-response';
import { SettingsService } from '../services/settings.service';
import { UpdateSettingsDto } from '../dtos/settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    get(): Promise<ApiResponse<{
        id: string;
        restaurantName: string;
        address: string;
        phone: string;
        openingHours: import("@prisma/client/runtime/library").JsonValue;
        aiEnabled: boolean;
        aiModel: string;
        confidenceThreshold: import("@prisma/client/runtime/library").Decimal;
        systemPrompt: string;
        facebookPageId: string | null;
        facebookVerifyToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    update(dto: UpdateSettingsDto): Promise<ApiResponse<{
        id: string;
        restaurantName: string;
        address: string;
        phone: string;
        openingHours: import("@prisma/client/runtime/library").JsonValue;
        aiEnabled: boolean;
        aiModel: string;
        confidenceThreshold: import("@prisma/client/runtime/library").Decimal;
        systemPrompt: string;
        facebookPageId: string | null;
        facebookVerifyToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    toggleAi(aiEnabled: boolean): Promise<ApiResponse<{
        aiEnabled: boolean;
    }>>;
}
