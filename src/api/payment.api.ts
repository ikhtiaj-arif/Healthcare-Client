import apiClient from "@/lib/apiClient";
import type {
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
