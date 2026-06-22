import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { Clock, ArrowRight } from "lucide-react";

export function ComingSoonPage({ name, description }: { name: string; description: string }) {
  return (
    <SiteLayout>
      <section className="container-page py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
            <Clock className="h-3.5 w-3.5" /> Coming Soon
          </span>
          <h1 className="mt-5">{name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          <p className="mt-3 text-muted-foreground">
            In the meantime, we can still help with debt relief, personal loans, and tax relief.
          </p>
          <Link href="/" className="btn-cta mt-8 inline-flex">
            See current services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

