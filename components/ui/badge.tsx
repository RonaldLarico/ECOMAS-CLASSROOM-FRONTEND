import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        successTable:
          "border-transparent bg-green-500 text-green-500-foreground hover:bg-green-500/80",
        reviewTable:
          "border-transparent bg-yellow-500 text-yellow-500-foreground hover:bg-yellow-500/80",
        outline: "text-foreground",
        // Payment status variants
        payed:
          "border-transparent dark:border-green-500/10 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100/80 dark:hover:bg-green-500/20",
        review:
          "border-transparent dark:border-yellow-500/10 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-100/80 dark:hover:bg-yellow-500/20",
        warning:
          "border-transparent dark:border-red-500/10 bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 hover:bg-red-100/80 dark:hover:bg-red-500/20",
        info: "border-transparent dark:border-blue-500/10 bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 hover:bg-blue-100/80 dark:hover:bg-blue-500/20",
        success:
          "border-transparent dark:border-green-500/10 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100/80 dark:hover:bg-green-500/20",
        pending:
          "border-transparent dark:border-gray-500/10 bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
