import { Link } from "react-router-dom";
import { HeartPulse, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-50 px-6 text-center dark:bg-surface-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
        <HeartPulse className="h-8 w-8" />
      </div>
      <div>
        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">404 error</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-surface-500 dark:text-surface-400">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>
      <Button asChild>
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </Button>
    </div>
  );
}
