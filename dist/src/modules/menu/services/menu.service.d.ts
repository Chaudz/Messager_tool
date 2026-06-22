import { MenuCategory } from '@prisma/client';
import { MenuRepository } from '../repositories/menu.repository';
export declare class MenuService {
    private readonly menuRepo;
    constructor(menuRepo: MenuRepository);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    search(keyword?: string, category?: MenuCategory): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    create(data: Parameters<MenuRepository['create']>[0]): import("@prisma/client").Prisma.Prisma__MenuItemClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: Parameters<MenuRepository['update']>[1]): import("@prisma/client").Prisma.Prisma__MenuItemClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(id: string): import("@prisma/client").Prisma.Prisma__MenuItemClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    formatMenuForContext(items: Awaited<ReturnType<MenuRepository['search']>>): string;
}
