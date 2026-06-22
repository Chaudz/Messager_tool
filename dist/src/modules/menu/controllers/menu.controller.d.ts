import { ApiResponse } from '../../../common/utils/api-response';
import { MenuService } from '../services/menu.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from '../dtos/menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    list(): Promise<ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSeasonal: boolean;
        category: import("@prisma/client").$Enums.MenuCategory;
        sortOrder: number;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        isAvailable: boolean;
    }[]>>;
    create(dto: CreateMenuItemDto): Promise<ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSeasonal: boolean;
        category: import("@prisma/client").$Enums.MenuCategory;
        sortOrder: number;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        isAvailable: boolean;
    }>>;
    update(id: string, dto: UpdateMenuItemDto): Promise<ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSeasonal: boolean;
        category: import("@prisma/client").$Enums.MenuCategory;
        sortOrder: number;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        isAvailable: boolean;
    }>>;
    remove(id: string): Promise<ApiResponse<{
        deleted: boolean;
    }>>;
    toggleAvailability(id: string, isAvailable: boolean): Promise<ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSeasonal: boolean;
        category: import("@prisma/client").$Enums.MenuCategory;
        sortOrder: number;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        isAvailable: boolean;
    }>>;
}
