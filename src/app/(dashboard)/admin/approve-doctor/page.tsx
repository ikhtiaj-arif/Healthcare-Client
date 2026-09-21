import { ClipboardCheck } from "lucide-react";
import { doctorApplications } from "@/components/modules/doctor-approval/doctor-approval.data";
import { DoctorApprovalTabs } from "@/components/modules/doctor-approval/doctor-approval-tabs";
import { Card, CardContent } from "@/components/ui/card";

const counts = {
  PENDING: doctorApplications.filter((a) => a.status === "PENDING").length,
  APPROVED: doctorApplications.filter((a) => a.status === "APPROVED").length,
  REJECTED: doctorApplications.filter((a) => a.status === "REJECTED").length,
  TOTAL: doctorApplications.length,
};

const stats = [
  { label: "Pending", value: counts.PENDING },
  { label: "Approved", value: counts.APPROVED },
  { label: "Rejected", value: counts.REJECTED },
  { label: "Total", value: counts.TOTAL },
];

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

      <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardContent className="flex flex-col gap-1.5 py-4">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </span>
              <span className="font-heading text-2xl font-semibold text-foreground">
                {stat.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <DoctorApprovalTabs />
    </div>
  );
};

export default Page;
