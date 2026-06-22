import { FaqCategory, Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
export declare class FaqRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    }[]>;
    findByCategory(category: FaqCategory): Prisma.Prisma__FaqItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findById(id: string): Prisma.Prisma__FaqItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    create(data: Prisma.FaqItemCreateInput): Prisma.Prisma__FaqItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, data: Prisma.FaqItemUpdateInput): Prisma.Prisma__FaqItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    delete(id: string): Prisma.Prisma__FaqItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
