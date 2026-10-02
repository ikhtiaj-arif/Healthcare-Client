import { AvailableTodayList } from "@/components/modules/doctors/available-today-list";

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Available today</h1>
        <p className="text-sm text-muted-foreground">
          Approved doctors with an open published slot later today. Booking
          continues on the doctor&apos;s page.
        </p>
      </div>
      <AvailableTodayList />
    </div>
  );
}
