import { MenuCategory } from '@prisma/client';
export declare class CreateMenuItemDto {
    name: string;
    category: MenuCategory;
    description?: string;
    price: number;
    unit?: string;
    isAvailable?: boolean;
    isSeasonal?: boolean;
    sortOrder?: number;
}
export declare class UpdateMenuItemDto {
    name?: string;
    category?: MenuCategory;
    description?: string;
    price?: number;
    unit?: string;
    isAvailable?: boolean;
    isSeasonal?: boolean;
    sortOrder?: number;
}
