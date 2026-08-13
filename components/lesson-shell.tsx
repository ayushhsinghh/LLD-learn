"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronLeft, ChevronRight, List, Route, X } from "lucide-react";
import { useEffect, useState } from "react";
import { lessonHref, lessons } from "@/lib/lessons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type TocItem = { id: string; label: string };

export function LessonShell({
  title,
  eyebrow,
  difficulty,
  duration,
  toc,
  children,
  previous,
  next,
}: {
  title: string;
  eyebrow: string;
  difficulty: string;
  duration: string;
  toc: TocItem[];
  children: React.ReactNode;
  previous?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeId, setActiveId] = useState(toc[0]?.id ?? "");

  useEffect(() => {
    const observers = toc.map(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return null;
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActiveId(id),
        { rootMargin: "-18% 0px -70%", threshold: 0 },
      );
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, [toc]);

  const curriculum = (
    <div className="flex h-full flex-col">
      <Link href="/" className="mb-8 flex items-center gap-3 text-[var(--ink)]">
        <span className="grid size-9 place-items-center rounded-lg bg-[var(--ink)] text-white">
          <BookOpen className="size-4" />
        </span>
        <span>
          <span className="block text-[15px] font-extrabold leading-none">LLD Interview Guide</span>
          <span className="mt-1 block text-[11px] text-[var(--muted)]">One method. Every problem.</span>
        </span>
      </Link>

      <p className="section-kicker">Start here</p>
      <Link
        href="/framework/"
        onClick={() => setDrawerOpen(false)}
        className={cn(
          "mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
          pathname?.startsWith("/framework") ? "bg-[var(--nav-active)] font-bold text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]",
        )}
      >
        <Route className="size-4" /> Interview framework
      </Link>

      <p className="section-kicker mt-7">Problem breakdowns</p>
      <nav aria-label="Problem lessons" className="mt-3 space-y-2">
        {lessons.map((lesson, index) => {
          const href = lessonHref(lesson.slug);
          const active = pathname === href || pathname === href.slice(0, -1);
          return (
            <Link
              key={lesson.slug}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className={cn(
                "group flex items-start gap-3 rounded-lg border-l-2 px-3 py-2.5 transition",
                active
                  ? "border-[var(--accent)] bg-[var(--nav-active)] text-[var(--ink)]"
                  : "border-transparent text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]",
              )}
            >
              <span className={cn("mt-0.5 font-mono text-[10px] font-bold", active ? "text-[var(--accent-dark)]" : "text-[var(--faint)]")}>0{index + 1}</span>
              <span>
                <span className="block text-sm font-bold">{lesson.title}</span>
                <span className="mt-0.5 block text-[11px] text-[var(--faint)]">{lesson.eyebrow}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[var(--line)] pt-4 text-[11px] leading-5 text-[var(--muted)]">
        Requirements → Entities → Classes → Code → Extensions
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[var(--ink)]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[250px] border-r border-[var(--line)] bg-[var(--sidebar)] p-6 xl:block">
        {curriculum}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button className="absolute inset-0 bg-[var(--ink)]/35 backdrop-blur-sm" aria-label="Close index" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[min(88vw,340px)] overflow-y-auto bg-white p-6 shadow-2xl">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" aria-label="Close index" onClick={() => setDrawerOpen(false)}><X /></Button>
            {curriculum}
          </aside>
        </div>
      )}

      <Button variant="outline" className="fixed bottom-4 left-4 z-40 bg-white shadow-lg xl:hidden" onClick={() => setDrawerOpen(true)}>
        <List /> Index
      </Button>

      <main className="xl:ml-[250px] xl:mr-[224px]">
        <article className="mx-auto w-full max-w-[780px] px-5 pb-24 pt-10 sm:px-8 lg:px-10 lg:pt-14">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
            <span>{eyebrow}</span><span className="text-[var(--accent)]">•</span><span>{difficulty}</span><span className="text-[var(--accent)]">•</span><span>{duration}</span>
          </div>
          <h1 className="text-[2.6rem] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl">{title}</h1>
          <div className="lesson-prose mt-7">{children}</div>

          <nav aria-label="Lesson pagination" className="mt-20 grid gap-4 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
            {previous ? (
              <Link href={previous.href} className="lesson-nav-card">
                <ChevronLeft /><span><small>Previous problem</small>{previous.label}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link href={next.href} className="lesson-nav-card justify-end text-right">
                <span><small>Next problem</small>{next.label}</span><ChevronRight />
              </Link>
            )}
          </nav>
        </article>
      </main>

      <aside className="fixed inset-y-0 right-0 hidden w-[224px] border-l border-[var(--line)] bg-white px-6 py-14 xl:block">
        <p className="section-kicker">On this page</p>
        <nav aria-label="Page sections" className="mt-4 space-y-1">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "block border-l-2 py-1.5 pl-3 text-sm transition",
                activeId === item.id ? "border-[var(--accent)] font-bold text-[var(--ink)]" : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]",
              )}
            >{item.label}</a>
          ))}
        </nav>
      </aside>
    </div>
  );
}
