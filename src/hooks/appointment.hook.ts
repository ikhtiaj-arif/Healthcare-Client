import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  bookAppointment,
  cancelAppointment,
  getAppointmentById,
  getMyAppointments,
  payAppointment,
} from "@/api";
import type {
  AppointmentParams,
  CancelAppointmentPayload,
  PayAppointmentPayload,
} from "@/types";
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

/**
 * Detail for one appointment.
 *
 * `enabled` guards the empty id that arrives before a dynamic route param
 * resolves, so this does not fire a request for `/appointment/` on a static
 * export where there is no server to ask.
 */
export function useGetAppointment(appointmentId: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, "detail", appointmentId],
    queryFn: () => getAppointmentById(appointmentId),
    enabled: Boolean(appointmentId),
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
      // Cancelling gives the slot back, so availability counts are stale for the
      // doctor and for anyone browsing the schedule.
      queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
      // Drop the specific detail entry too, so a refetch does not briefly show
      // CANCELLED in the list but PENDING in the header.
      queryClient.removeQueries({
        queryKey: [
          ...APPOINTMENTS_QUERY_KEY,
          "detail",
          variables.appointmentId,
        ],
      });
    },
  });
}

export function usePayAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payAppointment,
    // The gateway call only creates a checkout; nothing is confirmed until the
    // callback lands, so there is nothing local to refresh. The bKash redirect
    // replaces the page anyway.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}
