import {
  ArrowLeft,
  BriefcaseBusiness,
  GraduationCap,
  ScrollText,
  Stethoscope,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPublicDoctors, getPublicDoctorProfile } from "@/api";
import DoctorBooking from "@/components/modules/doctors/doctor-bookings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Page size for the build-time crawl. This used to be 1, which made the loop
 * below issue one HTTP request per doctor instead of per batch.
 */
const CRAWL_PAGE_SIZE = 100;

export async function generateStaticParams() {
  // `output: "export"` means this is the only thing that decides which /doctors
  // pages exist. An empty array is a *valid* return, so an API that is down or
  // unreachable used to produce a successful build that shipped zero doctor
  // pages -- every /doctors link then 404'd in production with nothing logged.
  // Fail the build instead, so a broken backend can't be deployed silently.
  const first = await getAllPublicDoctors({
    page: 1,
    limit: CRAWL_PAGE_SIZE,
  }).catch((error: unknown) => {
    throw new Error(
      "generateStaticParams could not reach the doctor API. " +
        "Is the backend running and is NEXT_PUBLIC_API_BASE_URL correct? " +
        `Underlying error: ${error instanceof Error ? error.message : String(error)}`,
    );
  });

  if (typeof first?.meta?.totalPages !== "number") {
    throw new Error(
      "generateStaticParams got a 200 from the doctor API without meta.totalPages. " +
        "Stopping so the build does not ship only the first page of doctors.",
    );
  }

  const totalPages = first.meta.totalPages;
  const all = [...first.data];

  for (let page = 2; page <= totalPages; page++) {
    const data = await getAllPublicDoctors({
      page,
      limit: CRAWL_PAGE_SIZE,
    }).catch((error: unknown) => {
      throw new Error(
        `generateStaticParams failed while loading doctor page ${page} of ${totalPages}. ` +
          `Underlying error: ${error instanceof Error ? error.message : String(error)}`,
      );
    });
    all.push(...data.data);
  }

  return all.map((doctor) => ({ id: doctor.id }));
}
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const data = await getPublicDoctorProfile(id);
  const doctor = data?.data || undefined;

  if (!doctor) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="my-10">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          render={<Link href="/doctors" />}
          nativeButton={false}
        >
          <ArrowLeft /> Back to doctors
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{doctor.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <Stethoscope className="size-4" />
              {doctor.specialization}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p className="flex items-center gap-2">
              <GraduationCap className="size-4 shrink-0" />
              {doctor.qualifications}
            </p>
            <p className="flex items-center gap-2">
              <BriefcaseBusiness className="size-4 shrink-0" />
              {doctor.experienceYears}{" "}
              {doctor.experienceYears === 1 ? "year" : "years"} of experience
            </p>
            <p className="flex items-center gap-2">
              <ScrollText className="size-4 shrink-0" />
              License No: {doctor.licenseNumber}
            </p>
            {doctor.consultationFee != null && (
              <p className="flex items-center gap-2">
                <Wallet className="size-4 shrink-0" />
                Consultation fee: ৳{doctor.consultationFee}
              </p>
            )}
            {doctor.bio && (
              <div className="pt-2">
                <p className="font-medium text-foreground">About</p>
                <p>{doctor.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Book appointment</h2>
          <p className="text-sm text-muted-foreground">
            Today&apos;s available slots. Booking redirects to bKash payment.
          </p>
        </div>
        <DoctorBooking doctorId={doctor.id} />
      </div>
    </div>
  );
};

export default page;
