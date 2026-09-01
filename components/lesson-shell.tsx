"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, List, Route, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { lessonHref, lessons } from "@/lib/lessons";
import { componentHref, systemComponents } from "@/lib/system-components";
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
  focusHref,
  track = "lld",
}: {
  title: string;
  eyebrow: string;
  difficulty: string;
  duration: string;
  toc: TocItem[];
  children: React.ReactNode;
  previous?: { href: string; label: string };
  next?: { href: string; label: string };
  focusHref?: string;
  track?: "lld" | "component";
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [phaseMenuOpen, setPhaseMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(toc[0]?.id ?? "");
  const activeCurriculumItemRef = useRef<HTMLAnchorElement>(null);
  const drawerCloseButtonRef = useRef<HTMLButtonElement>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const activePhaseIndex = Math.max(0, toc.findIndex((item) => item.id === activeId));
  const activePhase = toc[activePhaseIndex];
  const activePhaseLabel = activePhase?.label.replace(/^\d+\.\s*/, "");

  useEffect(() => {
    const updateActiveSection = () => {
      const readingLine = window.scrollY + window.innerHeight * 0.24;
      let nextId = toc[0]?.id ?? "";
      for (const { id } of toc) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= readingLine) nextId = id;
      }
      setActiveId(nextId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [toc]);

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    const frame = window.requestAnimationFrame(() => {
      activeCurriculumItemRef.current?.scrollIntoView({ block: "center" });
      drawerCloseButtonRef.current?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        window.requestAnimationFrame(() => drawerTriggerRef.current?.focus());
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen, pathname]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    window.requestAnimationFrame(() => drawerTriggerRef.current?.focus());
  };

  const curriculum = (
    <div className="flex h-full flex-col">
      <Link href="/" className="mb-8 flex items-center gap-3 text-[var(--ink)]">
        <span className="grid size-9 place-items-center rounded-lg bg-[var(--ink)] text-white">
          <BookOpen className="size-4" />
        </span>
        <span>
          <span className="block text-[15px] font-extrabold leading-none">System Design Guide</span>
          <span className="mt-1 block text-[11px] text-[var(--muted)]">Components, LLD, and trade-offs.</span>
        </span>
      </Link>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <p className="section-kicker">Start here</p>
        <Link
          href="/framework/"
          onClick={() => setDrawerOpen(false)}
          className={cn(
            "mt-2 flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
            pathname?.startsWith("/framework") ? "bg-[var(--nav-active)] font-bold text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]",
          )}
        >
          <Route className="size-4" /> Interview framework
        </Link>

        <p className="section-kicker mt-7">System components</p>
        <nav aria-label="System component lessons" className="mt-3 space-y-2">
        {systemComponents.map((component) => {
          const href = componentHref(component.slug);
          const active = pathname === href || pathname === href.slice(0, -1);
          return <Link ref={active ? activeCurriculumItemRef : undefined} key={component.slug} href={href} onClick={() => setDrawerOpen(false)} className={cn("group flex items-start gap-3 rounded-lg border-l-2 px-3 py-2.5 transition", active ? "border-[var(--accent)] bg-[var(--nav-active)] text-[var(--ink)]" : "border-transparent text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]")}><span className="mt-0.5 font-mono text-[10px] font-bold text-[var(--accent-dark)]">C1</span><span><span className="block text-sm font-bold">{component.title}</span><span className="mt-0.5 block text-[11px] text-[var(--faint)]">{component.eyebrow}</span></span></Link>;
        })}
        </nav>

        <p className="section-kicker mt-7">LLD problems</p>
        <nav aria-label="Problem lessons" className="mt-3 space-y-2 pb-4">
        {lessons.map((lesson, index) => {
          const href = lessonHref(lesson.slug);
          const active = pathname === href || pathname === href.slice(0, -1);
          return (
            <Link
              key={lesson.slug}
              ref={active ? activeCurriculumItemRef : undefined}
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
      </div>

      <div className="mt-4 shrink-0 border-t border-[var(--line)] pt-4 text-[11px] leading-5 text-[var(--muted)]">
        {track === "component" ? "Concept → Mechanics → Use cases → Trade-offs" : "Requirements → Entities → Classes → Code → Extensions"}
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
          <button className="absolute inset-0 bg-[var(--ink)]/35 backdrop-blur-sm" aria-label="Dismiss lessons" onClick={closeDrawer} />
          <aside id="lesson-curriculum-drawer" role="dialog" aria-modal="true" aria-label="Lesson curriculum" className="absolute inset-y-0 left-0 w-[min(88vw,340px)] overflow-y-auto bg-white p-6 shadow-2xl">
            <Button ref={drawerCloseButtonRef} variant="ghost" size="icon" className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))]" aria-label="Close lessons" onClick={closeDrawer}><X /></Button>
            {curriculum}
          </aside>
        </div>
      )}

      <main className="xl:ml-[250px] xl:mr-[224px]">
        <article className="mx-auto w-full max-w-[780px] px-5 pb-24 pt-10 sm:px-8 lg:px-10 lg:pt-14">
          {activePhase && (
            <div className="sticky top-0 z-30 -mx-5 mb-6 border-b border-[var(--line)] bg-white/95 px-5 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10 xl:hidden">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-expanded={phaseMenuOpen}
                  aria-controls="mobile-phase-navigation"
                  onClick={() => setPhaseMenuOpen((open) => !open)}
                  className="flex min-h-11 min-w-0 flex-1 items-center justify-between gap-4 rounded-lg text-left outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]"
                >
                  <span className="min-w-0">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--faint)]">Phase {activePhaseIndex + 1} of {toc.length}</span>
                    <span className="mt-0.5 block truncate text-sm font-extrabold text-[var(--ink)]">{activePhaseLabel}</span>
                  </span>
                  <ChevronDown className={cn("size-4 shrink-0 transition-transform", phaseMenuOpen && "rotate-180")} />
                </button>

                <Button
                  ref={drawerTriggerRef}
                  variant="outline"
                  aria-expanded={drawerOpen}
                  aria-controls="lesson-curriculum-drawer"
                  className="h-11 shrink-0 px-3 shadow-none"
                  onClick={() => {
                    setPhaseMenuOpen(false);
                    setDrawerOpen(true);
                  }}
                >
                  <List /> Lessons
                </Button>
              </div>

              {phaseMenuOpen && (
                <nav id="mobile-phase-navigation" aria-label="Lesson phases" className="mt-2 grid max-h-[min(22rem,calc(100dvh-5rem-env(safe-area-inset-top)))] gap-1 overflow-y-auto overscroll-contain border-t border-[var(--line)] pb-2 pt-2">
                  {toc.map((item) => {
                    const active = item.id === activeId;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        aria-current={active ? "location" : undefined}
                        onClick={() => {
                          setActiveId(item.id);
                          setPhaseMenuOpen(false);
                        }}
                        className={cn(
                          "flex min-h-11 items-center rounded-lg px-3 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[var(--focus)]",
                          active ? "bg-[var(--nav-active)] font-extrabold text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]",
                        )}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              )}
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
            <span>{eyebrow}</span><span className="text-[var(--accent)]">•</span><span>{difficulty}</span><span className="text-[var(--accent)]">•</span><span>{duration}</span>
          </div>
          <h1 className="text-[2.6rem] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl">{title}</h1>
          {focusHref && (
            <div className="mt-6 rounded-2xl border border-[#f1c3a7] bg-[var(--accent-soft)] p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
              <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--accent)]"><Sparkles className="size-4" /></span><div><p className="text-sm font-extrabold">Prefer to learn one decision at a time?</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Try questions, reveal the reasoning, trace the code, and finish with the simulator.</p></div></div>
              <Button asChild className="mt-4 w-full sm:mt-0 sm:w-auto"><Link href={focusHref}>Start Focus Mode <ChevronRight /></Link></Button>
            </div>
          )}
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

      <aside className="fixed inset-y-0 right-0 hidden w-[224px] overflow-y-auto border-l border-[var(--line)] bg-white px-6 py-14 xl:block">
        <p className="section-kicker">On this page</p>
        <nav aria-label="Page sections" className="mt-4 space-y-1">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveId(item.id)}
              className={cn(
                "flex min-h-11 items-center border-l-2 py-1.5 pl-3 text-sm transition",
                activeId === item.id ? "border-[var(--accent)] font-bold text-[var(--ink)]" : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]",
              )}
            >{item.label}</a>
          ))}
        </nav>
      </aside>
    </div>
  );
}
