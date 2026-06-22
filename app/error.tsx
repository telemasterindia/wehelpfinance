"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn&apos;t load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. You can retry or head home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={reset} className="btn-cta">Try again</button>
          <a href="/" className="btn-ghost-pill">Go home</a>
        </div>
      </div>
    </main>
  );
}
