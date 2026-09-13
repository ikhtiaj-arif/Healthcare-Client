import { Suspense } from "react";
import { VerifyAccountForm } from "@/components/form/VerifyAccountForm";

 

export default async function Page(){

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<p>Loading...</p>}>
          <VerifyAccountForm />
          {/* <VerifyAccountForm email={email ?? ""} /> */}
        </Suspense>
      </div>
    </div>
  );
}
