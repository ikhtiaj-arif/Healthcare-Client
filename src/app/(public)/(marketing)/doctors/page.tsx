import DoctorList from "@/components/modules/doctors/doctor-list";

const page = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Doctors</h1>
        <p className="text-sm text-muted-foreground">
          Approved doctors you can book. Open slots are on each doctor&apos;s
          page.
        </p>
      </div>
      <DoctorList />
    </div>
  );
};

export default page;
