import { cn } from "../../lib/utils";

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-surface-200 bg-surface-50/50 px-6 py-14 text-center dark:border-surface-800 dark:bg-surface-900/40",
        className
      )}
    >
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      )}
      <div className="max-w-sm">
        <p className="text-sm font-semibold text-surface-900 dark:text-white">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
