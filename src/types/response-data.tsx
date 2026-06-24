export type ISuccessResponseData<T> = {
  message: string;
  success: boolean;
  data: T;
};

export type ISuccessResponsePaginatedData<T> = {
  message: string;
  success: boolean;
  data: {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};
