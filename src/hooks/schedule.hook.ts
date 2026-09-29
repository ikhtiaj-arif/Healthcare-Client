import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createSchedule,
  deleteSchedule,
  getMySchedules,
  publishSchedule,
} from "@/api";
import type { ScheduleParams } from "@/types";

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
