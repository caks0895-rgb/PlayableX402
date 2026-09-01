import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppNotFoundComponent() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-pool">
        <Compass className="size-7" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-fg">Route Not Found</h1>
        <p className="max-w-sm text-sm text-muted">
          The table or route you requested doesn't exist or may have expired.
        </p>
      </div>
      <Button asChild variant="secondary" className="mt-2">
        <Link to="/">Return to Floor</Link>
      </Button>
    </main>
  );
}
