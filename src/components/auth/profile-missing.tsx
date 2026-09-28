import { UserRoundX } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/**
 * Shown to a DOCTOR whose `doctors` row is missing. Deliberately has no action
 * that creates the profile: apply-as-doctor always writes the profile in the
 * same insert and re-running it fails on the unique email constraint, so a
 * button here would dead-end. The seeded tester account self-heals on boot.
 */
const ProfileMissing = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 border border-destructive/30 bg-card px-8 py-12 text-center">
        <div className="flex size-16 items-center justify-center bg-destructive/10 text-destructive">
          <UserRoundX className="size-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold uppercase tracking-wider text-foreground">
            Doctor Profile Missing
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your account is a doctor, but its profile could not be found, so
            there is nothing to show here. Please contact support to have it
            restored.
          </p>
        </div>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ProfileMissing;
