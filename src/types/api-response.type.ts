export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

/**
 * Paginated endpoints send `meta` as a sibling of `data`, not nested inside it,
 * so the usual `ApiResponse<PaginatedData<T>>` misdescribes the wire format and
 * makes `response.data` resolve to a bare array.
 *
 * The doctor module nests instead (`/doctor/all-doctors` returns
 * `data: { data, meta }`); that endpoint is the exception, not the pattern.
 */
export type PaginatedApiResponse<T> = Omit<ApiResponse<T[]>, "meta"> & {
  meta: PaginationMeta;
};
