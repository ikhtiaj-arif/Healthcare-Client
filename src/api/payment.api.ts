import apiClient from "@/lib/apiClient";
import type {
  AllPaymentItem,
  AllPaymentsParams,
  ApiResponse,
  PaginatedApiResponse,
  PaginatedData,
  PaymentDetail,
  PaymentListItem,
  PaymentParams,
} from "@/types";

/**
 * The patient's own payments, newest first by default.
 *
 * `meta` is a sibling of `data` here, so the pagination is unwrapped by hand
 * rather than reusing the nested `{data: {data, meta}}` shape that
 * `/doctor/all-doctors` uses.
 */
export async function getMyPayments(
  params: PaymentParams,
): Promise<PaginatedData<PaymentListItem>> {
  const response = await apiClient<PaginatedApiResponse<PaymentListItem>>(
    "/payment/my-payments",
    { params },
  );
  return { data: response.data, meta: response.meta };
}

/**
 * One payment, with the patient included.
 *
 * The backend answers 403 when the payment belongs to someone else and 404 when
 * it does not exist; both read as "not found" to a patient, so the caller does
 * not need to tell them apart.
 */
export async function getPaymentById(
  paymentId: string,
): Promise<PaymentDetail> {
  const response = await apiClient<ApiResponse<PaymentDetail>>(
    `/payment/${paymentId}`,
  );
  return response.data;
}

/**
 * Admin list of every payment on the platform.
 *
 * `meta` is a sibling of `data` here, same as `my-payments`.
 *
 * The only filter is `patientEmail` (contains + insensitive, resolved through
 * the appointment) — **there is no `status` filter**, so E2 gets sortable columns
 * and a patient-email search but no status tabs. Rows carry the appointment with
 * its doctor and full schedule, but no patient.
 */
export async function getAllPayments(
  params: AllPaymentsParams,
): Promise<PaginatedData<AllPaymentItem>> {
  const response = await apiClient<PaginatedApiResponse<AllPaymentItem>>(
    "/payment/all-payments",
    { params },
  );
  return { data: response.data, meta: response.meta };
}
