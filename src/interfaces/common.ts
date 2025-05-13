export interface IPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ICommonResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IPaginatedResponse<T> extends ICommonResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IApiErrorResponse extends ICommonResponse<null> {
  statusCode: number;
  errorMessages: {
    path: string | number;
    message: string;
  }[];
}

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};
