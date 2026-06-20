export type ApiResponse<T> = {
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
