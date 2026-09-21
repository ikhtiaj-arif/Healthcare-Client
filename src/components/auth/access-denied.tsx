import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const AccessDenied = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 border border-destructive/30 bg-card px-8 py-12 text-center">
        <div className="flex size-16 items-center justify-center bg-destructive/10 text-destructive">
          <ShieldAlert className="size-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-lg font-semibold uppercase tracking-wider text-foreground">
            Access Denied
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You do not have permission to view this page. Contact your
            administrator if you believe this is a mistake.
          </p>
        </div>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
