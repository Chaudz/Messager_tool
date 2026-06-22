export class ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: Record<string, unknown>;
  error?: { code: string; message: string };

  static ok<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
    return { success: true, data, meta };
  }

  static fail(code: string, message: string): ApiResponse<null> {
    return { success: false, error: { code, message } };
  }
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
