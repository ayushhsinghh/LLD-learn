"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ClassDiagramDefinition } from "@/lib/class-diagrams";

export function ClassDiagramGallery({ diagrams, label = "Final class diagrams" }: { diagrams: ClassDiagramDefinition[]; label?: string }) {
  const first = diagrams[0];
  if (!first) return null;

  return (
    <section aria-label={label} className="my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
      <Tabs defaultValue={first.id}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="grid min-w-max grid-flow-col">
            {diagrams.map((diagram) => <TabsTrigger key={diagram.id} value={diagram.id} className="px-4 py-2 text-xs">{diagram.label}</TabsTrigger>)}
          </TabsList>
        </div>
        {diagrams.map((diagram) => (
          <TabsContent key={diagram.id} value={diagram.id} className="mt-3">
            <figure className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
              <div className="flex min-h-[220px] items-center justify-center bg-[#fbf7ef] p-2 sm:min-h-[360px] sm:p-4">
                <Image src={diagram.image} alt={diagram.alt} width={diagram.width ?? 1536} height={diagram.height ?? 1024} className="max-h-[620px] h-auto w-full object-contain" unoptimized />
              </div>
              <figcaption className="grid gap-3 border-t border-[var(--line)] p-4 sm:grid-cols-2 sm:p-5">
                <p className="text-sm leading-6 text-[var(--muted)]"><strong className="text-[var(--ink)]">How to read it: </strong>{diagram.reading}</p>
                <p className="text-sm leading-6 text-[var(--muted)]"><strong className="text-[var(--accent-dark)]">Design principle: </strong>{diagram.principle}</p>
              </figcaption>
            </figure>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
