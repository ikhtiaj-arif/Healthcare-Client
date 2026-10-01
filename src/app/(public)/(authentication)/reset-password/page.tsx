import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/form/ResetPasswordForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* ResetPasswordForm reads ?email= via useSearchParams, which requires a
            Suspense boundary under output: "export". Same reason as /login. */}
        <Suspense fallback={<Skeleton className="h-[32rem] w-full" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
