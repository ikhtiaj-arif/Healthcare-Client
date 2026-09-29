import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { bookAppointment, getMyAppointments } from "@/api";
import type { AppointmentParams } from "@/types";
import { SCHEDULES_QUERY_KEY } from "./schedule.hook";

export const APPOINTMENTS_QUERY_KEY = ["appointments"] as const;

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
      // Booking claims a slot, so the doctor's availability counts are stale too.
      queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
    },
  });
}

export function useGetMyAppointments(params: AppointmentParams) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, params],
    queryFn: () => getMyAppointments(params),
    // Same reasoning as `useMySchedules`: keeping the current page on screen
    // across a page or status change is why this is `useQuery` and not
    // `useSuspenseQuery`, which does not accept `placeholderData`.
    placeholderData: keepPreviousData,
  });
}
