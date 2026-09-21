"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ApplicationStatus,
  doctorApplications,
} from "./doctor-approval.data";
import { DoctorApprovalTable } from "./doctor-approval-table";

type TabValue = "all" | ApplicationStatus;

const tabs: { value: TabValue; label: string; status?: ApplicationStatus }[] = [
  { value: "PENDING", label: "Pending", status: "PENDING" },
  { value: "APPROVED", label: "Approved", status: "APPROVED" },
  { value: "REJECTED", label: "Rejected", status: "REJECTED" },
  { value: "all", label: "All" },
];

export function DoctorApprovalTabs() {
  return (
    <Tabs defaultValue="PENDING">
      <TabsList variant="line">
        {tabs.map((tab) => {
          const count = tab.status
            ? doctorApplications.filter((a) => a.status === tab.status).length
            : doctorApplications.length;
          return (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <span className="ml-1.5 rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                {count}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => {
        const applications = tab.status
          ? doctorApplications.filter((a) => a.status === tab.status)
          : doctorApplications;
        return (
          <TabsContent key={tab.value} value={tab.value}>
            <DoctorApprovalTable applications={applications} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
