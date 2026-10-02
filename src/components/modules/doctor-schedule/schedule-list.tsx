"use client";

import { CalendarX2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import TablePagination from "@/components/ui/table-pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMySchedules } from "@/hooks";
import type { ScheduleParams, ScheduleStatus } from "@/types";
import ScheduleCreateDialog from "./schedule-create-dialog";
import ScheduleListLoading from "./schedule-list-loading";
import ScheduleTable from "./schedule-table";

const PAGE_SIZE = 10;

type TabValue = "ALL" | ScheduleStatus;

const statuses: { value: TabValue; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
];

function ScheduleResults({
  params,
  page,
  setPage,
}: {
  params: ScheduleParams;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  const { data, isPending, isError } = useMySchedules(params);

  if (isError) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="Could not load your schedules"
        description="Please try again. If it keeps failing, your session may have expired."
      />
    );
  }

  // Only the first load has no data. Later page and tab changes are served from
  // `keepPreviousData`, so they render straight away instead of blanking out.
  if (isPending && !data) {
    return <ScheduleListLoading />;
  }

  if (!data) {
    return <ScheduleListLoading />;
  }

  return (
    <>
      <ScheduleTable schedules={data.data} />
      <TablePagination
        totalPages={data.meta.totalPages}
        page={page}
        handlePageChange={setPage}
      />
    </>
  );
}

export default function ScheduleList() {
  const [tab, setTab] = useState<TabValue>("ALL");
  const [page, setPage] = useState(1);

  const queryParams: ScheduleParams = {
    page,
    limit: PAGE_SIZE,
    sortBy: "startDateTime",
    sortOrder: "asc",
    ...(tab === "ALL" ? {} : { status: tab }),
  };

  return (
    <>
      <div className="my-5 flex justify-between gap-3">
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as TabValue);
            setPage(1);
          }}
        >
          <TabsList>
            {statuses.map((status) => (
              <TabsTrigger key={status.value} value={status.value}>
                {status.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <ScheduleCreateDialog />
      </div>

      <ScheduleResults params={queryParams} page={page} setPage={setPage} />
    </>
  );
}
