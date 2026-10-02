import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("mr-2 size-6 shrink-0 text-primary", className)}
    >
      <rect width="32" height="32" fill="currentColor" />
      <path
        fill="var(--primary-foreground)"
        d="M12 4h8v8h8v8h-8v8h-8v-8H4v-8h8V4z"
      />
    </svg>
  );
};

export default Logo;
