import { Suspense } from "react";
import { AdminPaymentList } from "@/components/modules/admin-payments/admin-payment-list";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Payments"
        description="Every bKash payment. There is no status filter on this list."
      />
      <Suspense fallback={<Skeleton className="h-[32rem] w-full" />}>
        <AdminPaymentList />
      </Suspense>
    </div>
  );
}
