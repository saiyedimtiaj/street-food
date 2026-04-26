import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-amber-500/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
