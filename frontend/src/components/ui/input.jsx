import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(({ className, type = "text", error, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-10 w-full rounded-xl border border-surface-200 bg-white px-3.5 text-sm text-surface-900 shadow-sm transition-colors placeholder:text-surface-400",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100",
      error && "border-danger-500 focus-visible:ring-danger-500",
      className
    )}
    aria-invalid={error || undefined}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 shadow-sm transition-colors placeholder:text-surface-400",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100",
      error && "border-danger-500 focus-visible:ring-danger-500",
      className
    )}
    aria-invalid={error || undefined}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const FormField = ({ label, htmlFor, error, hint, required, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={htmlFor} className="text-sm font-medium text-surface-700 dark:text-surface-300">
        {label}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <p className="text-xs font-medium text-danger-600 dark:text-danger-500" role="alert">
        {error}
      </p>
    ) : hint ? (
      <p className="text-xs text-surface-400">{hint}</p>
    ) : null}
  </div>
);
