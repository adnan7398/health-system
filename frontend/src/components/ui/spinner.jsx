import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function Spinner({ className, size = 20 }) {
  return (
    <Loader2
      className={cn("animate-spin text-primary-600", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3 text-surface-500 dark:text-surface-400">
      <Spinner size={32} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
