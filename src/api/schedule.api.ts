import apiClient from "@/lib/apiClient";
import type {
  AllScheduleItem,
  AllSchedulesParams,
  ApiResponse,
  CreatedSchedule,
  CreateSchedulePayload,
  PaginatedApiResponse,
  PaginatedData,
  Schedule,
  ScheduleDetail,
  ScheduleParams,
  UpdatedSchedule,
  UpdateSchedulePayload,
} from "@/types";

export async function createSchedule(
  payload: CreateSchedulePayload,
): Promise<CreatedSchedule> {
  const response = await apiClient<ApiResponse<CreatedSchedule>>(
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

/**
 * Admin list of every schedule on the platform.
 *
 * Each row carries its appointments with the **full** patient row, unfiltered by
 * status — so `appointments.length` is the booking total for the slot count, and
 * any status filtering has to happen client-side.
 */
export async function getAllSchedules(
  params: AllSchedulesParams,
): Promise<PaginatedData<AllScheduleItem>> {
  const response = await apiClient<PaginatedApiResponse<AllScheduleItem>>(
    "/schedule/all-schedules",
    { params },
  );
  return { data: response.data, meta: response.meta };
}

/**
 * A single schedule with its appointments and a doctor summary.
 *
 * Available to any authenticated user, doctor-scoped or not.
 */
export async function getScheduleById(
  scheduleId: string,
): Promise<ScheduleDetail> {
  const response = await apiClient<ApiResponse<ScheduleDetail>>(
    `/schedule/${scheduleId}`,
  );
  return response.data;
}

/**
 * Partial update. The id is in the path, not the body, so callers pass it
 * separately and cannot get it from the payload alone.
 *
 * Side effect worth knowing before this is wired to a form: the service
 * recomputes `totalSlots` from the window and resets `availableSlots =
 * totalSlots`, so editing a schedule that already has bookings silently refills
 * it without any appointment being cancelled.
 */
export async function updateSchedule(
  scheduleId: string,
  payload: UpdateSchedulePayload,
): Promise<UpdatedSchedule> {
  const response = await apiClient<ApiResponse<UpdatedSchedule>>(
    `/schedule/update-schedule/${scheduleId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
  return response.data;
}
