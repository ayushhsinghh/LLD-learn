"use client";

import Link from "next/link";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, List, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FocusStepProvider } from "@/components/learning/lesson-step";
import { Button } from "@/components/ui/button";
import { type LearningStep, learningPhaseLabels } from "@/lib/learning-paths";
import { cn } from "@/lib/utils";

export function FocusLessonShell({ title, completeHref, steps, children }: { title: string; completeHref: string; steps: LearningStep[]; children: React.ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [mapOpen, setMapOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const activeStep = steps[activeIndex];

  const indexForHash = useCallback((hash: string) => {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const index = steps.findIndex((step) => step.id === id || step.legacyIds?.includes(id));
    return index >= 0 ? index : 0;
  }, [steps]);

  useEffect(() => {
    const syncFromHash = () => setActiveIndex((current) => {
      const next = indexForHash(window.location.hash);
      const requestedId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (requestedId && requestedId !== steps[next].id && steps[next].legacyIds?.includes(requestedId)) {
        window.history.replaceState(null, "", `#${steps[next].id}`);
      }
      setDirection(next >= current ? 1 : -1);
      return next;
    });
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, [indexForHash, steps]);

  useEffect(() => {
    if (!activeStep) return;
    document.title = `${activeStep.title} · ${title} Focus Mode`;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    const timeout = window.setTimeout(() => headingRef.current?.focus(), reducedMotion ? 0 : 180);
    return () => window.clearTimeout(timeout);
  }, [activeStep, reducedMotion, title]);

  const goTo = (index: number) => {
    if (index < 0 || index >= steps.length || index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    window.history.pushState(null, "", `#${steps[index].id}`);
    setMapOpen(false);
  };

  const phaseGroups = useMemo(() => {
    const groups: { phase: LearningStep["phase"]; firstIndex: number; steps: LearningStep[] }[] = [];
    steps.forEach((step, index) => {
      const existing = groups.find((group) => group.phase === step.phase);
      if (existing) existing.steps.push(step);
      else groups.push({ phase: step.phase, firstIndex: index, steps: [step] });
    });
    return groups;
  }, [steps]);

  const progress = ((activeIndex + 1) / steps.length) * 100;

  const lessonMap = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-[var(--line)] pb-5">
        <span className="grid size-9 place-items-center rounded-lg bg-[var(--ink)] text-white"><BookOpen className="size-4" /></span>
        <div><p className="text-sm font-extrabold">{title}</p><p className="text-xs text-[var(--muted)]">Focus Mode · {steps.length} steps</p></div>
      </div>
      <nav aria-label="Learning phases" className="mt-5 space-y-5 overflow-y-auto pr-2">
        {phaseGroups.map((group) => {
          const completed = group.steps.every((step) => steps.findIndex((candidate) => candidate.id === step.id) < activeIndex);
          const current = activeStep.phase === group.phase;
          return (
            <div key={group.phase}>
              <button onClick={() => goTo(group.firstIndex)} className={cn("flex w-full items-center justify-between text-left text-[11px] font-extrabold uppercase tracking-[0.11em]", current ? "text-[var(--accent-dark)]" : "text-[var(--faint)]")}>
                {learningPhaseLabels[group.phase]}
                {completed && <Check className="size-3.5 text-[var(--mint)]" />}
              </button>
              <div className="mt-2 space-y-1 border-l border-[var(--line)] pl-3">
                {group.steps.map((step) => {
                  const index = steps.findIndex((candidate) => candidate.id === step.id);
                  return <button key={step.id} onClick={() => goTo(index)} className={cn("block w-full rounded-lg px-2 py-1.5 text-left text-xs leading-5", index === activeIndex ? "bg-[var(--nav-active)] font-extrabold text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[var(--paper-2)]")}>{index + 1}. {step.title}</button>;
                })}
              </div>
            </div>
          );
        })}
      </nav>
      <Link href={completeHref} className="mt-auto flex items-center gap-2 border-t border-[var(--line)] pt-4 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft className="size-4" /> Complete walkthrough</Link>
    </div>
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="h-dvh overflow-hidden bg-[#f8f8f6] text-[var(--ink)]">
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-[280px] border-r border-[var(--line)] bg-white p-6 xl:block">{lessonMap}</aside>

        <Dialog.Root open={mapOpen} onOpenChange={setMapOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--ink)]/35 backdrop-blur-sm xl:hidden" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(90vw,360px)] overflow-y-auto bg-white p-6 shadow-2xl outline-none xl:hidden">
              <Dialog.Title className="sr-only">{title} lesson map</Dialog.Title>
              <Dialog.Description className="sr-only">Choose a phase or learning step to continue the focus lesson.</Dialog.Description>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" className="absolute right-4 top-4" aria-label="Close lesson map"><X /></Button>
              </Dialog.Close>
              {lessonMap}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="flex h-dvh min-h-0 flex-col xl:ml-[280px]">
          <header className="z-30 shrink-0 border-b border-[var(--line)] bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-[980px] items-center gap-3 px-4 py-3 sm:px-7">
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open lesson map" onClick={() => setMapOpen(true)}><List /></Button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--faint)]"><span className="truncate">{learningPhaseLabels[activeStep.phase]}</span><span className="shrink-0">{activeIndex + 1} / {steps.length}</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--paper-2)]"><m.div className="h-full rounded-full bg-[var(--accent)]" animate={{ width: `${progress}%` }} transition={reducedMotion ? { duration: 0 } : { duration: 0.25 }} /></div>
              </div>
              <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex"><Link href={completeHref}>Full guide</Link></Button>
            </div>
          </header>

          <main className="mx-auto flex min-h-0 w-full max-w-[980px] flex-1 px-3 py-2 sm:px-6 sm:py-5">
            <div className="mx-auto h-full min-h-0 w-full max-w-[820px]">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <m.section key={activeStep.id} custom={direction} initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 24 }} animate={{ opacity: 1, x: 0 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -18 }} transition={{ duration: reducedMotion ? 0.01 : 0.2 }} className="focus-card flex h-full min-h-0 flex-col overflow-hidden rounded-[1.35rem] border border-[var(--line)] bg-white shadow-[0_12px_38px_rgba(23,28,36,0.07)]">
                  <header className="shrink-0 border-b border-[var(--line)] px-4 py-2 sm:px-6 sm:py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="section-kicker text-[var(--accent-dark)]">{activeStep.eyebrow} · {activeStep.minutes} min</p>
                        <h1 ref={headingRef} tabIndex={-1} className="mt-1.5 text-xl font-extrabold leading-tight tracking-[-0.025em] outline-none sm:text-2xl">{activeStep.title}</h1>
                      </div>
                      <span className="shrink-0 rounded-full bg-[var(--paper-2)] px-2.5 py-1 font-mono text-[10px] font-bold text-[var(--faint)] sm:hidden">{activeIndex + 1}/{steps.length}</span>
                    </div>
                  </header>
                  <div className="focus-card-body min-h-0 flex-1 overflow-hidden p-3 sm:p-6">
                    <FocusStepProvider activeStepId={activeStep.id}>{children}</FocusStepProvider>
                  </div>
                </m.section>
              </AnimatePresence>
            </div>
          </main>

          <nav aria-label="Focus lesson navigation" className="z-30 shrink-0 border-t border-[var(--line)] bg-white/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex max-w-[820px] items-center justify-between gap-3">
              <Button aria-label="Previous step" variant="outline" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}><ChevronLeft /> <span className="hidden sm:inline">Previous</span></Button>
              <button onClick={() => setMapOpen(true)} className="min-w-0 text-center xl:pointer-events-none"><span className="block truncate text-xs font-extrabold">{activeStep.title}</span><span className="mt-0.5 block text-[10px] text-[var(--faint)]">Step {activeIndex + 1} of {steps.length}</span></button>
              {activeIndex < steps.length - 1 ? <Button aria-label="Next step" onClick={() => goTo(activeIndex + 1)}><span className="hidden sm:inline">Next</span><ChevronRight /></Button> : <Button asChild><Link href={completeHref}>Finish <ArrowRight /></Link></Button>}
            </div>
          </nav>
        </div>
      </div>
    </LazyMotion>
  );
}
