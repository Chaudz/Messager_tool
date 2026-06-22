import { MenuCategory, Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
export declare class MenuRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSeasonal: boolean;
        category: import("@prisma/client").$Enums.MenuCategory;
        sortOrder: number;
        description: string | null;
        price: Prisma.Decimal;
        unit: string;
        isAvailable: boolean;
    }[]>;
    findById(id: string): Prisma.Prisma__MenuItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSeasonal: boolean;
        category: import("@prisma/client").$Enums.MenuCategory;
        sortOrder: number;
        description: string | null;
        price: Prisma.Decimal;
        unit: string;
        isAvailable: boolean;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    search(keyword?: string, category?: MenuCategory): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSeasonal: boolean;
        category: import("@prisma/client").$Enums.MenuCategory;
        sortOrder: number;
        description: string | null;
        price: Prisma.Decimal;
        unit: string;
        isAvailable: boolean;
    }[]>;
    create(data: Prisma.MenuItemCreateInput): Prisma.Prisma__MenuItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSeasonal: boolean;
        category: import("@prisma/client").$Enums.MenuCategory;
        sortOrder: number;
        description: string | null;
        price: Prisma.Decimal;
        unit: string;
        isAvailable: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, data: Prisma.MenuItemUpdateInput): Prisma.Prisma__MenuItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSeasonal: boolean;
        category: import("@prisma/client").$Enums.MenuCategory;
        sortOrder: number;
        description: string | null;
        price: Prisma.Decimal;
        unit: string;
        isAvailable: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    delete(id: string): Prisma.Prisma__MenuItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSeasonal: boolean;
        category: import("@prisma/client").$Enums.MenuCategory;
        sortOrder: number;
        description: string | null;
        price: Prisma.Decimal;
        unit: string;
        isAvailable: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
