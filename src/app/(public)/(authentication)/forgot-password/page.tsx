import { ForgotPasswordForm } from "@/components/form/ForgotPasswordForm";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* No Suspense boundary needed here: unlike LoginForm, this one never
            calls useSearchParams, which is the only reason /login needs one
            under output: "export". */}
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
