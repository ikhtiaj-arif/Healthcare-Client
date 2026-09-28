import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateSchedulePayload,
  PaginatedData,
  PaginationMeta,
  Schedule,
  ScheduleParams,
} from "@/types";

/**
 * Paginated schedule endpoints send `meta` as a sibling of `data`, not nested
 * inside it, so the usual `ApiResponse<PaginatedData<T>>` misdescribes the wire
 * format and makes `response.data` resolve to a bare array.
 *
 * The doctor module nests instead (`/doctor/all-doctors` returns
 * `data: { data, meta }`); that endpoint is the exception, not the pattern.
 */
type PaginatedApiResponse<T> = Omit<ApiResponse<T[]>, "meta"> & {
  meta: PaginationMeta;
};

export async function createSchedule(
  payload: CreateSchedulePayload,
): Promise<Schedule> {
  const response = await apiClient<ApiResponse<Schedule>>(
    "/schedule/create-schedule",
    {
      method: "POST",
      body: payload,
    },
  );
  return response.data;
}

export async function getMySchedules(
  params: ScheduleParams,
): Promise<PaginatedData<Schedule>> {
  const response = await apiClient<PaginatedApiResponse<Schedule>>(
    "/schedule/my-schedules",
    {
      params,
    },
  );
  return { data: response.data, meta: response.meta };
}

export async function publishSchedule(
  scheduleId: string,
): Promise<Schedule> {
  const response = await apiClient<ApiResponse<Schedule>>(
    `/schedule/publish-schedule/${scheduleId}`,
    {
      method: "PATCH",
    },
  );
  return response.data;
}

export async function deleteSchedule(
  scheduleId: string,
): Promise<Schedule> {
  const response = await apiClient<ApiResponse<Schedule>>(
    `/schedule/${scheduleId}`,
    {
      method: "DELETE",
    },
  );
  return response.data;
}
