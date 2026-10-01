import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  bookAppointment,
  cancelAppointment,
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointments,
  getMyAppointments,
  payAppointment,
  updateAppointmentStatus,
} from "@/api";
import type {
  AllAppointmentsParams,
  AppointmentParams,
  DoctorAppointmentsParams,
  UpdateAppointmentStatusPayload,
} from "@/types";
import { SCHEDULES_QUERY_KEY } from "./schedule.hook";

export const APPOINTMENTS_QUERY_KEY = ["appointments"] as const;

/**
 * Payments live in their own module but the sidebar groups them under the same
 * "payments and refunds" area, so the key is declared next to the appointments
 * one and re-exported from payment.hook.
 */
export const PAYMENTS_QUERY_KEY = ["payments"] as const;

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

/**
 * Scopes the doctor's own list to `"mine"` and the admin list to `"all"`.
 *
 * They are separate caches rather than one key with an optional segment, because
 * a doctor and an admin can never see the same rows and there is no screen that
 * switches between them — a shared key would let one role's cached page survive
 * into the other's view until it happened to refetch.
 */
export function useGetDoctorAppointments(params: DoctorAppointmentsParams) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, "doctor", params],
    queryFn: () => getDoctorAppointments(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetAllAppointments(params: AllAppointmentsParams) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, "all", params],
    queryFn: () => getAllAppointments(params),
    placeholderData: keepPreviousData,
  });
}

/**
 * The mutation takes the id as its own argument because the endpoint carries it
 * in the path rather than the body, so a single `mutationFn` cannot read it from
 * a payload object.
 */
export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      ...payload
    }: UpdateAppointmentStatusPayload & { appointmentId: string }) =>
      updateAppointmentStatus(appointmentId, payload),
    onSuccess: (_data, variables) => {
      // Invalidates the whole prefix, which covers the patient, doctor and admin
      // lists — a status change is visible in whichever one is mounted.
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
      // The detail sheet may be open on the row that just moved.
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
