export declare class UpdateSettingsDto {
    restaurantName?: string;
    address?: string;
    phone?: string;
    openingHours?: Record<string, string>;
    aiEnabled?: boolean;
    aiModel?: string;
    confidenceThreshold?: number;
    systemPrompt?: string;
}
