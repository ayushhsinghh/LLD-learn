import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all outline-none select-none focus-visible:ring-4 focus-visible:ring-[var(--focus)] disabled:pointer-events-none disabled:opacity-45 active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[var(--ink)] text-white shadow-[0_3px_0_#0a1728] hover:bg-[#203550]",
        accent: "bg-[var(--accent)] text-[var(--ink)] shadow-[0_3px_0_#b45d25] hover:bg-[#ffb276]",
        outline: "border border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--paper-2)]",
        ghost: "text-[var(--muted)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]",
      },
      size: {
        sm: "h-9 px-3",
        default: "h-11 px-4",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
