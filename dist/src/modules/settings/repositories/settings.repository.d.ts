import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
export declare class SettingsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get(): Promise<{
        id: string;
        restaurantName: string;
        address: string;
        phone: string;
        openingHours: Prisma.JsonValue;
        aiEnabled: boolean;
        aiModel: string;
        confidenceThreshold: Prisma.Decimal;
        systemPrompt: string;
        facebookPageId: string | null;
        facebookPageAccessToken: string | null;
        facebookVerifyToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.RestaurantSettingsUpdateInput): Prisma.Prisma__RestaurantSettingsClient<{
        id: string;
        restaurantName: string;
        address: string;
        phone: string;
        openingHours: Prisma.JsonValue;
        aiEnabled: boolean;
        aiModel: string;
        confidenceThreshold: Prisma.Decimal;
        systemPrompt: string;
        facebookPageId: string | null;
        facebookPageAccessToken: string | null;
        facebookVerifyToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
