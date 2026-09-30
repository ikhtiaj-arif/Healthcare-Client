import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateSchedulePayload,
  PaginatedApiResponse,
  PaginatedData,
  Schedule,
  ScheduleParams,
} from "@/types";

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

export async function publishSchedule(scheduleId: string): Promise<Schedule> {
  const response = await apiClient<ApiResponse<Schedule>>(
    `/schedule/publish-schedule/${scheduleId}`,
    {
      method: "PATCH",
    },
  );
  return response.data;
}

export async function deleteSchedule(scheduleId: string): Promise<Schedule> {
  const response = await apiClient<ApiResponse<Schedule>>(
    `/schedule/${scheduleId}`,
    {
      method: "DELETE",
    },
  );
  return response.data;
}
