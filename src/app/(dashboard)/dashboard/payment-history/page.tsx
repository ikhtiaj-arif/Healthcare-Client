import { Suspense } from "react";
import { PaymentDetailSheet } from "@/components/modules/payments/payment-detail-sheet";
import PaymentList from "@/components/modules/payments/payment-list";
import { PageHeader } from "@/components/ui/page-header";

const page = () => {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Payment History"
        description="Every bKash transaction against your consultations, including refunds."
      />

      {/* Both components read the query string (page, sort, and the ?payment id
          the detail sheet opens on), which under output: "export" opts this route
          into client rendering and so needs a boundary. */}
      <Suspense fallback={null}>
        <PaymentList />
        <PaymentDetailSheet />
      </Suspense>
    </div>
  );
};

export default page;
