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
 * There is no exception: every list endpoint in the backend, including
 * `/doctor/all-doctors`, uses `sendResponse({ data, meta })` with sibling `meta`.
 * An earlier version of this comment claimed the doctor module nested instead —
 * that was wrong and cost a round of defensive unwrapping.
 */
export type PaginatedApiResponse<T> = Omit<ApiResponse<T[]>, "meta"> & {
  meta: PaginationMeta;
};
