import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPrescription,
  getPrescriptionByAppointmentId,
} from "@/api/prescription.api";
import { APPOINTMENTS_QUERY_KEY } from "./appointment.hook";

/**
 * Keyed by appointmentId, not a list — there is no prescriptions list endpoint,
 * because a prescription only ever exists as a PDF URL hanging off an appointment.
 */
export const PRESCRIPTIONS_QUERY_KEY = ["prescriptions"] as const;

/**
 * Writing a prescription sets `prescriptionUrl` on the appointment, so the
 * appointment lists and any open detail sheet now show it. Invalidate that family
 * or the patient keeps seeing "no prescription" until a hard refresh.
 *
 * Also drops any cached 404 on this key. `useGetPrescription` uses `retry: 0`,
 * so a "not written yet" response would stay on screen after a successful write
 * until the query was invalidated.
 */
export function useCreatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRESCRIPTIONS_QUERY_KEY });
    },
  });
}

/**
 * `retry` is 0 rather than the default 3, because the 404 here is expected: most
 * completed appointments have no prescription yet. Retrying it just delays the
 * empty state by several seconds.
 */
export function useGetPrescription(appointmentId: string | undefined) {
  return useQuery({
    queryKey: [...PRESCRIPTIONS_QUERY_KEY, appointmentId],
    queryFn: () => getPrescriptionByAppointmentId(appointmentId as string),
    enabled: Boolean(appointmentId),
    retry: 0,
  });
}
