import { ApiResponse } from '../../../common/utils/api-response';
import { FaqService } from '../services/faq.service';
import { CreateFaqDto, UpdateFaqDto } from '../dtos/faq.dto';
export declare class FaqController {
    private readonly faqService;
    constructor(faqService: FaqService);
    list(): Promise<ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    }[]>>;
    create(dto: CreateFaqDto): Promise<ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    }>>;
    update(id: string, dto: UpdateFaqDto): Promise<ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        answer: string;
        category: import("@prisma/client").$Enums.FaqCategory;
        keywords: string[];
        isActive: boolean;
        sortOrder: number;
    }>>;
    remove(id: string): Promise<ApiResponse<{
        deleted: boolean;
    }>>;
}
