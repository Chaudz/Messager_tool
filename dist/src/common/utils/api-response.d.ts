export declare class ApiResponse<T> {
    success: boolean;
    data?: T;
    meta?: Record<string, unknown>;
    error?: {
        code: string;
        message: string;
    };
    static ok<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T>;
    static fail(code: string, message: string): ApiResponse<null>;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
}
export interface PaginatedQuery {
    page?: number;
    limit?: number;
}
