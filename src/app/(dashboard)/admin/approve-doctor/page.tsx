import { ClipboardCheck } from "lucide-react";
import { DoctorApprovalStats } from "@/components/modules/doctor-approval/doctor-approval-stats";
import { DoctorApprovalTabs } from "@/components/modules/doctor-approval/doctor-approval-tabs";

const Page = () => {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center bg-primary/10 text-primary">
            <ClipboardCheck className="size-5" />
          </div>
          <h1 className="font-heading text-lg font-semibold tracking-wider uppercase">
            Doctor Approval
          </h1>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Review doctor applications and approve only verified and legitimate
          doctors.
        </p>
      </div>

      <DoctorApprovalStats />

      <DoctorApprovalTabs />
    </div>
  );
};

export default Page;
