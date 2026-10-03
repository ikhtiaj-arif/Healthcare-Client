import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import DoctorApplyForm from "@/components/form/DoctorApplyForm";

export default function ApplyPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col col-span-2 gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex items-center gap-2">
              <Logo />
              <span>HealthCare Service</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl">
            <DoctorApplyForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted p-10 lg:flex lg:items-end">
        <p className="text-sm text-muted-foreground">
          Apply with your license and resume. An admin reviews it before
          patients can book you.
        </p>
      </div>
    </div>
  );
}
