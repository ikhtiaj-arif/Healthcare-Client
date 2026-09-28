import {
  createSchedule,
  deleteSchedule,
  getMySchedules,
  publishSchedule,
} from "@/api";
import type { ScheduleParams } from "@/types";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export const SCHEDULES_QUERY_KEY = ["schedules"] as const;

function useInvalidateSchedules() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
  };
}

export function useCreateSchedule() {
  const invalidateSchedules = useInvalidateSchedules();

  return useMutation({
    mutationFn: createSchedule,
    onSuccess: invalidateSchedules,
  });
}

export function usePublishSchedule() {
  const invalidateSchedules = useInvalidateSchedules();

  return useMutation({
    mutationFn: publishSchedule,
    onSuccess: invalidateSchedules,
  });
}

export function useDeleteSchedule() {
  const invalidateSchedules = useInvalidateSchedules();

  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: invalidateSchedules,
  });
}

export function useSuspenseMySchedules(params: ScheduleParams) {
  return useSuspenseQuery({
    queryKey: [...SCHEDULES_QUERY_KEY, params],
    queryFn: () => getMySchedules(params),
  });
}
