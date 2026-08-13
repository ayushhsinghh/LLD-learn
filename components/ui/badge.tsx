import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--line)] bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]",
        className,
      )}
      {...props}
    />
  );
}
