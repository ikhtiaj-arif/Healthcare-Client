import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createSchedule,
  deleteSchedule,
  getAllSchedules,
  getMySchedules,
  getScheduleById,
  publishSchedule,
  updateSchedule,
} from "@/api";
import type {
  AllSchedulesParams,
  ScheduleParams,
  UpdateSchedulePayload,
} from "@/types";

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

export function useMySchedules(params: ScheduleParams) {
  return useQuery({
    queryKey: [...SCHEDULES_QUERY_KEY, params],
    queryFn: () => getMySchedules(params),
    // `useSuspenseQuery` omits `placeholderData` from its options, so keeping
    // the current page on screen across a page or tab change means using
    // `useQuery`. Without it every interaction drops the table to its skeleton.
    placeholderData: keepPreviousData,
  });
}

export function useAllSchedules(params: AllSchedulesParams) {
  return useQuery({
    queryKey: [...SCHEDULES_QUERY_KEY, "all", params],
    queryFn: () => getAllSchedules(params),
    placeholderData: keepPreviousData,
  });
}

/** `enabled` guards the request while the id is still undefined on first render. */
export function useScheduleById(scheduleId: string | undefined) {
  return useQuery({
    queryKey: [...SCHEDULES_QUERY_KEY, "detail", scheduleId],
    queryFn: () => getScheduleById(scheduleId as string),
    enabled: !!scheduleId,
  });
}

/**
 * Takes `{ scheduleId, ...payload }` because the id travels in the path rather
 * than the body, so one `mutationFn` signature cannot read it from the payload.
 *
 * Invalidates the whole prefix, which covers the doctor's own list, the admin
 * list and this detail query in one call. The `removeQueries` afterwards is
 * deliberate: the update response is a narrower projection than the detail
 * query returns, so refetching it first would briefly render a row missing its
 * doctor summary and appointments.
 */
export function useUpdateSchedule() {
  const invalidateSchedules = useInvalidateSchedules();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scheduleId,
      ...payload
    }: UpdateSchedulePayload & { scheduleId: string }) =>
      updateSchedule(scheduleId, payload),
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({
        queryKey: [...SCHEDULES_QUERY_KEY, "detail", variables.scheduleId],
      });
      invalidateSchedules();
    },
  });
}
