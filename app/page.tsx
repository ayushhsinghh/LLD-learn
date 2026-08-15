import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Route, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { lessonHref, lessons } from "@/lib/lessons";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white px-5 py-10 text-[var(--ink)] sm:px-8 lg:py-16">
      <div className="mx-auto max-w-[860px]">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-[var(--ink)] text-white"><BookOpen className="size-5" /></span>
          <div><p className="text-sm font-extrabold">LLD Interview Guide</p><p className="text-xs text-[var(--muted)]">One method. Every problem.</p></div>
        </div>

        <section className="mt-16 max-w-[720px]">
          <Badge>Low-level design interview preparation</Badge>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.08] tracking-[-0.05em] sm:text-6xl">Learn how to reach the design—not just what the final design looks like.</h1>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">Every lesson follows the same five steps: clarify requirements, find entities, derive classes, write Java code, and handle extensions.</p>
        </section>

        <section className="mt-16">
          <p className="section-kicker">Start with the method</p>
          <Link href="/framework/" className="group mt-3 flex items-center justify-between gap-5 rounded-xl border border-[var(--line)] bg-[var(--blue-soft)] p-5 hover:border-[#8eb2c6]">
            <div className="flex gap-4"><Route className="mt-1 size-5 shrink-0 text-[#346985]" /><div><h2 className="font-extrabold">LLD Interview Framework</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">The question groups, order, and timing to reuse in every interview.</p><span className="mt-3 flex items-center gap-1 text-xs font-bold text-[#346985]"><Clock3 className="size-3" /> 10 minute lesson</span></div></div>
            <ArrowRight className="shrink-0 transition group-hover:translate-x-1" />
          </Link>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3"><p className="section-kicker">Complete problem walkthroughs</p><span className="text-xs text-[var(--faint)]">Java · diagrams · simulations</span></div>
          <div>
            {lessons.map((lesson, index) => (
              <article key={lesson.slug} className="group relative grid gap-3 border-b border-[var(--line)] py-6 sm:grid-cols-[50px_1fr_auto] sm:items-center">
                <Link href={lessonHref(lesson.slug)} aria-label={`Open complete ${lesson.title} walkthrough`} className="absolute inset-0" />
                <span className="font-mono text-xs font-bold text-[var(--accent-dark)]">0{index + 1}</span>
                <div><h3 className="text-lg font-extrabold">{lesson.title}</h3><p className="mt-1 max-w-xl text-sm leading-6 text-[var(--muted)]">{lesson.summary}</p><div className="mt-3 flex flex-wrap items-center gap-2"><Badge>{lesson.difficulty}</Badge><Badge>{lesson.duration}</Badge>{lesson.focusHref && <Link href={lesson.focusHref} className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-[#f1c3a7] bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--accent-dark)] hover:border-[var(--accent)]"><Sparkles className="size-3" /> Focus Mode</Link>}</div></div>
                <ArrowRight className="hidden transition group-hover:translate-x-1 sm:block" />
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
