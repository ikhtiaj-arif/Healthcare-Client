import { Suspense } from "react";
import { VerifyAccountForm } from "@/components/form/VerifyAccountForm";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <VerifyAccountForm mode="doctor" />
        </Suspense>
      </div>
    </div>
  );
}
