import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMyPayments, getPaymentById } from "@/api";
import type { PaymentParams } from "@/types";
import { PAYMENTS_QUERY_KEY } from "./appointment.hook";

export { PAYMENTS_QUERY_KEY };

export function useGetMyPayments(params: PaymentParams) {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, params],
    queryFn: () => getMyPayments(params),
    // Keeps the table on screen across page and sort changes instead of dropping
    // to a skeleton, same reasoning as `useGetMyAppointments`.
    placeholderData: keepPreviousData,
  });
}

/**
 * One payment, for the detail sheet.
 *
 * `enabled` guards the empty id that arrives before the query param is read, so
 * this does not request `/payment/` on a static export with no server to ask.
 */
export function useGetPayment(paymentId: string) {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, "detail", paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId),
  });
}
