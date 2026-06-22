import { SettingsRepository } from '../repositories/settings.repository';
export declare class SettingsService {
    private readonly settingsRepo;
    constructor(settingsRepo: SettingsRepository);
    get(): Promise<{
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
        facebookPageAccessToken: string | null;
        facebookVerifyToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Parameters<SettingsRepository['update']>[1]): import("@prisma/client").Prisma.Prisma__RestaurantSettingsClient<{
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
        facebookPageAccessToken: string | null;
        facebookVerifyToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    toggleAi(aiEnabled: boolean): Promise<{
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
        facebookPageAccessToken: string | null;
        facebookVerifyToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    formatOpeningHours(openingHours: Record<string, string>): string;
}
