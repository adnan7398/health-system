import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800">
    <table ref={ref} className={cn("w-full min-w-full text-left text-sm", className)} {...props} />
  </div>
));
Table.displayName = "Table";

export const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-surface-50 text-xs uppercase tracking-wide text-surface-500 dark:bg-surface-900/60 dark:text-surface-400", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-surface-100 bg-white dark:divide-surface-800 dark:bg-surface-900", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50", className)}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th ref={ref} scope="col" className={cn("px-4 py-3 font-semibold", className)} {...props} />
));
TableHead.displayName = "TableHead";

export const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("px-4 py-3.5 text-surface-700 dark:text-surface-300", className)} {...props} />
));
TableCell.displayName = "TableCell";
