import { Spinner } from "@/components/ui/spinner";

const AuthLoading = ({
  label = "Verifying Account...",
}: {
  label?: string;
}) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <div className="flex size-16 items-center justify-center bg-primary/10 text-primary">
        <Spinner className="size-8" />
      </div>
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
};

export default AuthLoading;
