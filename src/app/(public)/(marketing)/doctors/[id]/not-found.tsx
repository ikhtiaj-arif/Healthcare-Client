import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DoctorNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-xl font-semibold">Doctor not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This profile is not in the published catalog. A newly approved doctor
        appears after the site is built again.
      </p>
      <Button
        className="mt-4"
        nativeButton={false}
        render={<Link href="/doctors" />}
      >
        Back to doctors
      </Button>
    </div>
  );
}
