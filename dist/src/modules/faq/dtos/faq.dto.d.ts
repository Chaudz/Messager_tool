import { FaqCategory } from '@prisma/client';
export declare class CreateFaqDto {
    question: string;
    answer: string;
    category: FaqCategory;
    keywords?: string[];
    isActive?: boolean;
    sortOrder?: number;
}
export declare class UpdateFaqDto {
    question?: string;
    answer?: string;
    category?: FaqCategory;
    keywords?: string[];
    isActive?: boolean;
    sortOrder?: number;
}
