
// Response types for API Auth calls
export type ApiAuthResponse<T = any> = {
    code: number;
    result: ApiAuthResponseResult<T>;
}

export type ApiAuthResponseResult<T = any> = {
    object: T;
    token: string;
}

// Response types for API calls
export type ApiResponse<T = any> = {
    code: number;
    result: ApiResponseResult<T>;
}

export type ApiResponseResult<T = any> = {
    object: T;
}

// Response types for API calls with pagination
export type ApiPaginatedResponse<T = any> = {
    code: number;
    result: ApiPaginatedResponseResult<T>;
    pagination: ApiPagination;
}

export type ApiPaginatedResponseResult<T = any> = {
    object: {
        count: number;
        rows: T[];
    };
    total: number;
    page: number;
    limit: number;
}

export type ApiPagination = {
    current_page: number;
    next_page: number;
    prev_page: number;
    limit: number;
}

