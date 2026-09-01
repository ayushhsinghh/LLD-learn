import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Route, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { lessonHref, lessons } from "@/lib/lessons";
import { componentHref, systemComponents } from "@/lib/system-components";

const interviewPhases = ["Requirements", "Entities", "Classes", "Code", "Extensions"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white px-5 py-10 text-[var(--ink)] sm:px-8 lg:py-16">
      <div className="mx-auto max-w-[860px]">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-[var(--ink)] text-white"><BookOpen className="size-5" /></span>
          <div><p className="text-sm font-extrabold">System Design Guide</p><p className="text-xs text-[var(--muted)]">Components, LLD, and trade-offs.</p></div>
        </div>

        <section className="mt-16 max-w-[720px]">
          <Badge>System design interview preparation</Badge>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.08] tracking-[-0.05em] sm:text-6xl">Understand the building blocks—and learn how to choose them.</h1>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">Study system components through mechanics and visual scenarios, then practise complete low-level designs from requirements to working code.</p>
        </section>

        <section className="mt-16">
          <p className="section-kicker">One method, every problem</p>
          <Link href="/framework/" className="group mt-3 block rounded-xl border border-[var(--line)] bg-[var(--blue-soft)] px-3 py-4 transition-[border-color,box-shadow] duration-200 hover:border-[#8eb2c6] hover:shadow-[0_10px_28px_rgba(52,105,133,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)] sm:p-6">
            <div className="flex items-start justify-between gap-5">
              <div className="flex gap-4"><Route className="mt-1 size-5 shrink-0 text-[#346985]" /><div><h2 className="font-extrabold">LLD Interview Framework</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">Follow one reasoning path from an unclear prompt to a defensible design.</p><span className="mt-3 flex items-center gap-1 text-xs font-bold text-[#346985]"><Clock3 className="size-3" /> 10 minute lesson</span></div></div>
              <ArrowRight className="mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
            </div>
            <div className="relative mt-6">
              <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-3 h-px bg-[#b8cfdb]" />
              <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-3 h-px origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              <ol aria-label="Requirements, then entities, classes, code, and extensions" className="relative grid grid-cols-5">
                {interviewPhases.map((phase, index) => (
                  <li key={phase} className="text-center">
                    <span className="mx-auto grid size-6 place-items-center rounded-full border border-[#9ebdcd] bg-white font-mono text-[9px] font-bold text-[#346985] transition-[background-color,border-color,color,box-shadow] duration-200 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent-dark)] group-focus-visible:border-[var(--accent)] group-focus-visible:bg-[var(--accent-soft)] group-focus-visible:text-[var(--accent-dark)]">{index + 1}</span>
                    <span className="mt-2 block text-[10px] font-extrabold leading-4 tracking-[-0.04em] text-[var(--muted)] sm:text-[11px]">{phase}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Link>
        </section>

        <section className="mt-12">
          <div className="flex flex-col items-start gap-1 border-b border-[var(--line)] pb-3 sm:flex-row sm:items-center sm:justify-between"><p className="section-kicker">System components</p><span className="text-xs text-[var(--faint)]">Mechanics · simulations · trade-offs</span></div>
          <div>{systemComponents.map((component, index) => <article key={component.slug} className="group relative grid gap-3 border-b border-[var(--line)] py-6 sm:grid-cols-[50px_1fr_auto] sm:items-center"><Link href={componentHref(component.slug)} aria-label={`Open ${component.title} guide`} className="absolute inset-0" /><span className="font-mono text-xs font-bold text-[var(--accent-dark)]">C{index + 1}</span><div><h3 className="text-lg font-extrabold">{component.title}</h3><p className="mt-1 max-w-xl text-sm leading-6 text-[var(--muted)]">{component.summary}</p><div className="mt-3 flex flex-wrap items-center gap-2"><Badge>{component.difficulty}</Badge><Badge>{component.duration}</Badge><Link href={component.focusHref} className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-[#f1c3a7] bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--accent-dark)] hover:border-[var(--accent)]"><Sparkles className="size-3" /> Focus Mode</Link></div><span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[var(--ink)] sm:hidden">Open guide <ArrowRight className="size-4" /></span></div><ArrowRight className="hidden transition group-hover:translate-x-1 sm:block" /></article>)}</div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col items-start gap-1 border-b border-[var(--line)] pb-3 sm:flex-row sm:items-center sm:justify-between"><p className="section-kicker">LLD problem walkthroughs</p><span className="text-xs text-[var(--faint)]">Java · diagrams · simulations</span></div>
          <div>
            {lessons.map((lesson, index) => (
              <article key={lesson.slug} className="group relative grid gap-3 border-b border-[var(--line)] py-6 sm:grid-cols-[50px_1fr_auto] sm:items-center">
                <Link href={lessonHref(lesson.slug)} aria-label={`Open complete ${lesson.title} walkthrough`} className="absolute inset-0" />
                <span className="font-mono text-xs font-bold text-[var(--accent-dark)]">0{index + 1}</span>
                <div><h3 className="text-lg font-extrabold">{lesson.title}</h3><p className="mt-1 max-w-xl text-sm leading-6 text-[var(--muted)]">{lesson.summary}</p><div className="mt-3 flex flex-wrap items-center gap-2"><Badge>{lesson.difficulty}</Badge><Badge>{lesson.duration}</Badge>{lesson.focusHref && <Link href={lesson.focusHref} className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-[#f1c3a7] bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--accent-dark)] hover:border-[var(--accent)]"><Sparkles className="size-3" /> Focus Mode</Link>}</div><span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[var(--ink)] sm:hidden">Open walkthrough <ArrowRight className="size-4" /></span></div>
                <ArrowRight className="hidden transition group-hover:translate-x-1 sm:block" />
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
