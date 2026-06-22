import { FaqCategory } from '@prisma/client';
import { FaqRepository } from '../repositories/faq.repository';
export declare class FaqService {
    private readonly faqRepo;
    constructor(faqRepo: FaqRepository);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
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
    findByCategory(category: FaqCategory): import("@prisma/client").Prisma.Prisma__FaqItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(data: Parameters<FaqRepository['create']>[0]): import("@prisma/client").Prisma.Prisma__FaqItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: Parameters<FaqRepository['update']>[1]): import("@prisma/client").Prisma.Prisma__FaqItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(id: string): import("@prisma/client").Prisma.Prisma__FaqItemClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    formatFaqsForContext(faqs: Awaited<ReturnType<FaqRepository['findAll']>>): string;
}
