import { Suspense } from "react";
import { LoginForm } from "@/components/form/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* LoginForm reads ?redirect= via useSearchParams, which needs a
            Suspense boundary under output: "export". */}
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
