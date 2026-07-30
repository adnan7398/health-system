import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300",
        primary: "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300",
        secondary: "bg-secondary-50 text-secondary-700 dark:bg-secondary-950 dark:text-secondary-300",
        success: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500",
        danger: "bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500",
        warning: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ className, variant, dot = false, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function statusBadgeVariant(status) {
  const map = {
    pending: "warning",
    accepted: "success",
    confirmed: "success",
    completed: "primary",
    rejected: "danger",
    cancelled: "danger",
    active: "success",
    inactive: "default",
  };
  return map[String(status).toLowerCase()] || "default";
}
