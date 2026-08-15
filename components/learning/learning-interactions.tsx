"use client";

import { Check, ChevronLeft, ChevronRight, CircleHelp, Eye, Lightbulb, RotateCcw, Sparkles, X } from "lucide-react";
import { RadioGroup } from "radix-ui";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type LearningChoice = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
};

const frameworkPhases = [
  {
    name: "Requirements",
    description: "Clarify the rules, actions, invalid cases, and scope before naming classes.",
    badgeClass: "bg-[var(--accent)]",
  },
  {
    name: "Entities",
    description: "Find the objects, values, and state owners revealed by those requirements.",
    badgeClass: "bg-[#e9b949]",
  },
  {
    name: "Class design",
    description: "Give every rule and responsibility to the object that should own it.",
    badgeClass: "bg-[var(--mint)]",
  },
  {
    name: "Implementation",
    description: "Write complete code that validates a move before changing shared state.",
    badgeClass: "bg-[#5f8fc9]",
  },
  {
    name: "Extensions",
    description: "Adapt the design only when a new requirement creates real variation.",
    badgeClass: "bg-[var(--ink)]",
  },
] as const;

export function FocusFrameworkRoadmap() {
  return (
    <ol aria-label="Five-phase interview roadmap" className="m-0 grid !list-none gap-2 !p-0 sm:grid-cols-5 sm:gap-3 [&>li]:!mt-0">
      {frameworkPhases.map((phase, index) => (
        <li key={phase.name} className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:block sm:min-h-48 sm:p-4">
          <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-black leading-none text-white shadow-sm sm:size-9", phase.badgeClass)}>{index + 1}</span>
          <div className="min-w-0 sm:mt-5">
            <h3 className="!text-sm font-extrabold leading-5 text-[var(--ink)]">{phase.name}</h3>
            <p className="mt-1 text-[11px] leading-[1.35rem] text-[var(--muted)] sm:mt-2 sm:text-xs">{phase.description}</p>
          </div>
          <span aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-1", phase.badgeClass)} />
        </li>
      ))}
    </ol>
  );
}

export function PredictReveal({ prompt, hint, children }: { prompt: string; hint?: string; children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <aside className="learning-question learning-question-predict">
      <div className="flex items-start gap-3">
        <span className="learning-question-icon"><Lightbulb /></span>
        <div>
          <p className="section-kicker">What do you think?</p>
          <h3 className="mt-2 !text-lg font-extrabold leading-7">{prompt}</h3>
          {hint && <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{hint}</p>}
        </div>
      </div>
      {!revealed ? (
        <Button variant="outline" className="mt-5" onClick={() => setRevealed(true)}><Eye /> Reveal the reasoning</Button>
      ) : (
        <div className="mt-5 rounded-xl border border-[#b8ddcf] bg-[var(--mint-soft)] p-4" aria-live="polite">
          <p className="flex items-center gap-2 text-sm font-extrabold text-[var(--ink)]"><Sparkles className="size-4 text-[var(--mint)]" /> Reason it through</p>
          <div className="mt-2 text-sm leading-7 text-[var(--muted)]">{children}</div>
        </div>
      )}
    </aside>
  );
}

export function ChoiceQuestion({ prompt, instruction = "Choose the strongest answer, then inspect every explanation.", choices }: { prompt: string; instruction?: string; choices: LearningChoice[] }) {
  const labelId = useId();
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const selectedChoice = choices.find((choice) => choice.id === selected);
  const reviewedChoice = choices[reviewIndex];

  const reset = () => {
    setSelected("");
    setChecked(false);
    setReviewIndex(0);
  };

  return (
    <aside className="learning-question">
      <div className="flex items-start gap-3">
        <span className="learning-question-icon"><CircleHelp /></span>
        <div>
          <p className="section-kicker">Test your reasoning</p>
          <h3 id={labelId} className="mt-2 !text-lg font-extrabold leading-7">{prompt}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{instruction}</p>
        </div>
      </div>

      {!checked ? <RadioGroup.Root aria-labelledby={labelId} value={selected} onValueChange={(value) => { setSelected(value); setChecked(false); }} className="mt-5 grid gap-3">
        {choices.map((choice) => {
          return (
            <label key={choice.id} className={cn("learning-choice", selected === choice.id && "learning-choice-selected")}>
              <RadioGroup.Item value={choice.id} className="learning-radio" aria-label={choice.label}>
                <RadioGroup.Indicator className="block size-2.5 rounded-full bg-current" />
              </RadioGroup.Item>
              <span className="min-w-0 flex-1">
                <span className="font-bold text-[var(--ink)]">{choice.label}</span>
              </span>
            </label>
          );
        })}
      </RadioGroup.Root> : (
        <div className={cn("mt-4 rounded-xl border p-4", reviewedChoice.correct ? "border-[#b8ddcf] bg-[var(--mint-soft)]" : "border-[#efc2bb] bg-[#fff3f0]")} aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--faint)]">Review {reviewIndex + 1} of {choices.length}</span>
            <span className={cn("flex items-center gap-1 text-xs font-extrabold", reviewedChoice.correct ? "text-[#24785f]" : "text-[#a23d2e]")}>{reviewedChoice.correct ? <Check className="size-4" /> : <X className="size-4" />}{reviewedChoice.correct ? "Correct" : "Incorrect"}</span>
          </div>
          <p className="mt-3 text-sm font-extrabold text-[var(--ink)]">{reviewedChoice.label}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{reviewedChoice.feedback}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" disabled={reviewIndex === 0} onClick={() => setReviewIndex((index) => index - 1)}><ChevronLeft /> Previous</Button>
            <Button variant="ghost" size="sm" disabled={reviewIndex === choices.length - 1} onClick={() => setReviewIndex((index) => index + 1)}>Next <ChevronRight /></Button>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!checked && <Button onClick={() => { setReviewIndex(Math.max(0, choices.findIndex((choice) => choice.id === selected))); setChecked(true); }} disabled={!selected}>Check answer</Button>}
        {checked && <Button variant="ghost" onClick={reset}><RotateCcw /> Try again</Button>}
        <p className="min-h-6 text-sm font-bold" aria-live="polite">
          {checked && selectedChoice && (selectedChoice.correct ? <span className="text-[#24785f]">Correct. Notice why each alternative fails.</span> : <span className="text-[#a23d2e]">Not quite. The correct choice is now highlighted.</span>)}
        </p>
      </div>
    </aside>
  );
}

export function OrderQuestion({ prompt, items, correctOrder, explanation }: { prompt: string; items: { id: string; label: string }[]; correctOrder: string[]; explanation: string }) {
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const remaining = items.filter((item) => !order.includes(item.id));
  const isCorrect = correctOrder.every((id, index) => order[index] === id);

  const reset = () => {
    setOrder([]);
    setChecked(false);
  };

  return (
    <aside className="learning-question">
      <div className="flex items-start gap-3">
        <span className="learning-question-icon"><CircleHelp /></span>
        <div><p className="section-kicker">Build the workflow</p><h3 className="mt-2 !text-lg font-extrabold leading-7">{prompt}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Tap operations in the order they should execute. Tap a chosen operation to remove it.</p></div>
      </div>

      {!checked && <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-4">
        <p className="section-kicker">Choose operation {Math.min(order.length + 1, items.length)} of {items.length}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {remaining.map((item) => <button key={item.id} onClick={() => { setOrder((current) => [...current, item.id]); setChecked(false); }} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-left text-xs font-bold hover:border-[var(--ink)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)] sm:text-sm">{item.label}</button>)}
          {remaining.length === 0 && <span className="text-sm text-[var(--faint)]">Sequence complete. Check your reasoning.</span>}
        </div>
      </div>}

      {!checked && order.length > 0 && <ol aria-label="Your operation order" className="mt-3 flex flex-wrap gap-1.5">{order.map((id, index) => {
        const item = items.find((candidate) => candidate.id === id)!;
        return <li key={id}><button onClick={() => { setOrder((current) => current.filter((value) => value !== id)); setChecked(false); }} className="flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white px-2.5 py-1.5 text-left text-[11px] font-bold hover:bg-[var(--paper-2)]"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono text-[9px] text-white">{index + 1}</span>{item.label}</button></li>;
      })}</ol>}

      {!checked && <div className="mt-4 flex flex-wrap gap-3"><Button onClick={() => setChecked(true)} disabled={order.length !== items.length}>Check order</Button>{order.length > 0 && <Button variant="ghost" onClick={reset}><RotateCcw /> Reset</Button>}</div>}
      {checked && <div className={cn("mt-4 rounded-xl border p-3 text-sm leading-6", isCorrect ? "border-[#b8ddcf] bg-[var(--mint-soft)]" : "border-[#efc2bb] bg-[#fff3f0]")} aria-live="polite"><p className="font-extrabold">{isCorrect ? "Correct sequence." : "The sequence can still mutate state too early."}</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{explanation}</p><ol className="mt-3 grid grid-cols-2 gap-1.5">{correctOrder.map((id, index) => <li key={id} className="flex items-center gap-1.5 rounded-lg bg-white/70 px-2 py-1.5 text-[10px] font-bold leading-4"><span className="font-mono text-[var(--accent-dark)]">{index + 1}</span>{items.find((item) => item.id === id)?.label}</li>)}</ol><Button variant="ghost" size="sm" className="mt-3" onClick={reset}><RotateCcw /> Try again</Button></div>}
    </aside>
  );
}

export function FocusCode({ label, code }: { label: string; code: string }) {
  return (
    <div className="focus-code overflow-hidden rounded-xl border border-[#2e3947] bg-[#18212c] text-white">
      <div className="border-b border-white/10 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#9fcfbe]">{label}</div>
      <pre className="overflow-x-auto p-3 text-[11px] leading-[1.45] sm:p-4 sm:text-xs"><code>{code}</code></pre>
    </div>
  );
}

export function FocusSpec({ requirements, outOfScope }: { requirements: string[]; outOfScope: string[] }) {
  const [tab, setTab] = useState<"requirements" | "scope">("requirements");
  const items = tab === "requirements" ? requirements : outOfScope;
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-white p-1" role="tablist" aria-label="Confirmed specification">
        <button role="tab" aria-selected={tab === "requirements"} onClick={() => setTab("requirements")} className={cn("rounded-md px-3 py-2 text-xs font-extrabold", tab === "requirements" && "bg-[var(--ink)] text-white")}>Requirements</button>
        <button role="tab" aria-selected={tab === "scope"} onClick={() => setTab("scope")} className={cn("rounded-md px-3 py-2 text-xs font-extrabold", tab === "scope" && "bg-[var(--ink)] text-white")}>Not building</button>
      </div>
      <ol className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item, index) => <li key={item} className="flex gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold leading-5 text-[var(--muted)]"><span className="font-mono text-[var(--accent-dark)]">{tab === "requirements" ? index + 1 : "—"}</span><span>{item}</span></li>)}
      </ol>
    </section>
  );
}

export function WinningCellQuestion() {
  const board = ["X", "X", null, "O", "O", null, null, null, null] as const;
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === 2;

  return (
    <aside className="learning-question">
      <div className="flex items-start gap-3"><span className="learning-question-icon"><Sparkles /></span><div><p className="section-kicker">Visual challenge</p><h3 className="mt-2 !text-lg font-extrabold leading-7">Where should X play to complete a winning line?</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Select an empty cell. Then connect the visual result to `Board.hasWinningLine`.</p></div></div>
      <div className="mx-auto mt-4 grid aspect-square max-w-[220px] grid-cols-3 gap-1 rounded-2xl bg-[var(--ink)] p-1 shadow-[4px_5px_0_var(--accent)] sm:max-w-[280px]">
        {board.map((mark, index) => <button key={index} disabled={Boolean(mark)} onClick={() => setSelected(index)} aria-label={`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}${mark ? ` contains ${mark}` : " is empty"}`} className={cn("grid place-items-center rounded-md bg-[#fffdf8] font-display text-4xl font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[var(--accent)]", mark === "O" && "text-[var(--accent)]", !mark && "hover:bg-[var(--accent-soft)]", selected === index && (correct ? "!bg-[var(--mint)] text-white" : "!bg-[#f9c9c1]"))}>{mark ?? (selected === index ? "?" : "")}</button>)}
      </div>
      {selected !== null && <div className={cn("mx-auto mt-5 max-w-xl rounded-xl border p-4 text-sm leading-6", correct ? "border-[#b8ddcf] bg-[var(--mint-soft)]" : "border-[#efc2bb] bg-[#fff3f0]")} aria-live="polite"><p className="font-extrabold">{correct ? "Correct: row 0 becomes X X X." : "That cell does not complete a line yet."}</p><p className="mt-1 text-[var(--muted)]">`Board.hasWinningLine(X)` checks every row, column, and diagonal after the accepted placement. The top-right cell completes row 0.</p></div>}
    </aside>
  );
}
