"use client";

import { Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Eye, Lightbulb, RotateCcw, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { RadioGroup } from "radix-ui";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type LearningChoice = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
};

type JavaToken = { text: string; kind?: "comment" | "string" | "annotation" | "keyword" | "literal" | "number" | "type" | "method" };

function highlightJava(source: string): JavaToken[] {
  const pattern = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[A-Za-z_$][\w$]*|\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|record|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|var|void|volatile|while|yield|permits|non-sealed)\b|\b(?:true|false|null)\b|\b(?:0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?)\b|\b[A-Z][A-Za-z0-9_$]*\b|\b[A-Za-z_$][\w$]*(?=\s*\()/g;
  const tokens: JavaToken[] = [];
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) tokens.push({ text: source.slice(cursor, index) });
    const text = match[0];
    let kind: JavaToken["kind"];
    if (text.startsWith("//") || text.startsWith("/*")) kind = "comment";
    else if (text.startsWith('"') || text.startsWith("'")) kind = "string";
    else if (text.startsWith("@")) kind = "annotation";
    else if (/^(true|false|null)$/.test(text)) kind = "literal";
    else if (/^(?:0[xX][0-9a-fA-F]+|\d)/.test(text)) kind = "number";
    else if (/^[A-Z]/.test(text)) kind = "type";
    else if (/^[a-zA-Z_$]/.test(text) && source.slice(index + text.length).match(/^\s*\(/)) kind = "method";
    else kind = "keyword";
    tokens.push({ text, kind });
    cursor = index + text.length;
  }
  if (cursor < source.length) tokens.push({ text: source.slice(cursor) });
  return tokens;
}

function HighlightedJava({ code }: { code: string }) {
  return <>{highlightJava(code).map((token, index) => <span key={`${index}-${token.text.slice(0, 8)}`} className={token.kind ? `java-token-${token.kind}` : undefined}>{token.text}</span>)}</>;
}

export function PassiveLearningCards({ intro, items, conclusion }: { intro: string; items: Array<{ title: string; body: string; label?: string }>; conclusion?: string }) {
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
    <p className="text-xs leading-5 text-[var(--muted)]">{intro}</p>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">{items.map((item) => <article key={item.title} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
      {item.label && <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[var(--accent-dark)]">{item.label}</p>}
      <h3 className="mt-0.5 !text-xs font-extrabold text-[var(--ink)]">{item.title}</h3>
      <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{item.body}</p>
    </article>)}</div>
    {conclusion && <p className="mt-3 rounded-lg border border-[#b8ddcf] bg-[var(--mint-soft)] px-3 py-2 text-[10px] font-bold leading-4 text-[var(--ink)]">{conclusion}</p>}
  </section>;
}

export function ImplementationCodeMap() {
  return <section className="grid min-h-0 gap-3">
    <div className="grid grid-cols-3 gap-2">{[
      ["Player", "Identity", "Keeps name and mark fixed."],
      ["Board", "Grid rules", "Validates and changes cells."],
      ["Game", "Match flow", "Coordinates one complete move."],
    ].map(([name, role, body]) => <article key={name} className="rounded-lg border border-[var(--line)] bg-[var(--paper-2)] p-2.5">
      <p className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--accent-dark)]">{role}</p><h3 className="mt-0.5 !text-xs font-extrabold">{name}</h3><p className="mt-1 text-[9px] leading-4 text-[var(--muted)]">{body}</p>
    </article>)}</div>
    <ol className="grid min-h-0 grid-cols-2 gap-2">{[
      ["1", "Game checks", "Status and current player"],
      ["2", "Board validates", "Coordinate and empty cell"],
      ["3", "Board reports", "Placement, win, and fullness"],
      ["4", "Game resolves", "End the match or switch turns"],
    ].map(([number, title, body]) => <li key={number} className="flex min-h-0 items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2">
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono text-[10px] font-bold text-white">{number}</span><span><strong className="block text-[10px]">{title}</strong><span className="block text-[9px] leading-4 text-[var(--muted)]">{body}</span></span>
    </li>)}</ol>
  </section>;
}

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

const clarificationCandidates = [
  {
    id: "players",
    question: "Who will play, which marks do they use, and who takes the first turn?",
    useful: true,
    feedback: "Defines the actors, their marks, and the starting turn.",
  },
  {
    id: "rules",
    question: "What board size, win, draw, and stopping rules should the game follow?",
    useful: true,
    feedback: "Makes the core game and completion rules precise.",
  },
  {
    id: "errors",
    question: "Which moves are invalid, and must rejection leave the game unchanged?",
    useful: true,
    feedback: "Creates an observable rejection contract.",
  },
  {
    id: "scope",
    question: "Which features are deliberately outside the first version?",
    useful: true,
    feedback: "Prevents bots, history, and networking from expanding the scope.",
  },
  {
    id: "design",
    question: "Which Java classes and design patterns should the solution use?",
    useful: false,
    feedback: "Skip this for now. Design choices come after the behavior is clear.",
  },
] as const;

export function ClarificationQuestionPicker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const usefulIds = clarificationCandidates.filter((candidate) => candidate.useful).map((candidate) => candidate.id);
  const isCorrect = selected.length === usefulIds.length && usefulIds.every((id) => selected.includes(id));
  const reviewedCandidate = clarificationCandidates.find((candidate) => candidate.id === reviewId);

  const toggle = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  };

  const reset = () => {
    setSelected([]);
    setChecked(false);
    setReviewId(null);
  };

  const checkSelection = () => {
    setReviewId("design");
    setChecked(true);
  };

  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="learning-question-icon"><CircleHelp /></span>
        <div>
          <p className="section-kicker">Build your question list</p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Select every question that clarifies behavior before design.</p>
        </div>
      </div>

      <div className="mt-3 grid gap-1.5">
        {clarificationCandidates.map((candidate) => {
          const selectedNow = selected.includes(candidate.id);
          return checked ? (
            <button
              key={candidate.id}
              type="button"
              aria-pressed={reviewId === candidate.id}
              onClick={() => setReviewId(candidate.id)}
              className={cn(
                "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]",
                candidate.useful ? "border-[#92c8b5] bg-[var(--mint-soft)]" : "border-[#efc2bb] bg-[#fff3f0]",
                reviewId === candidate.id && "ring-2 ring-[var(--ink)]",
              )}
            >
              <span className={cn("mt-0.5 grid size-4 shrink-0 place-items-center rounded-full text-white", candidate.useful ? "bg-[#24785f]" : "bg-[#a23d2e]")}>{candidate.useful ? <Check className="size-3" /> : <X className="size-3" />}</span>
              <span className="min-w-0 flex-1 text-xs font-bold leading-4 text-[var(--ink)]">{candidate.question}</span>
              <span className={cn("flex shrink-0 items-center text-[10px] font-extrabold uppercase", candidate.useful ? "text-[#24785f]" : "text-[#a23d2e]")}>{candidate.useful ? "Ask" : "Skip"}</span>
            </button>
          ) : (
            <label key={candidate.id} className={cn("rounded-lg border bg-white px-3 py-2", selectedNow ? "border-[var(--ink)]" : "border-[var(--line)]")}>
              <span className="flex items-start gap-2.5">
                <input type="checkbox" checked={selectedNow} onChange={() => toggle(candidate.id)} className="mt-0.5 size-4 shrink-0 accent-[var(--ink)]" />
                <span className="min-w-0 flex-1 text-xs font-bold leading-5 text-[var(--ink)]">{candidate.question}</span>
              </span>
            </label>
          );
        })}
      </div>

      {checked && reviewedCandidate && (
        <div className="mt-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--faint)]">{reviewedCandidate.useful ? "Why ask it" : "Why skip it"}</p>
          <p className="mt-0.5 text-[10px] leading-4 text-[var(--muted)]">{reviewedCandidate.feedback}</p>
        </div>
      )}

      <div className="mt-3 flex items-center gap-3">
        {!checked ? <Button size="sm" onClick={checkSelection} disabled={selected.length === 0}>Check selection</Button> : <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button>}
        <p className={cn("text-xs font-bold", checked && (isCorrect ? "text-[#24785f]" : "text-[#a23d2e]") )} aria-live="polite">{checked && (isCorrect ? "Exactly right." : "Review the Ask and Skip labels.")}</p>
      </div>
    </section>
  );
}

const clarificationAnswers = [
  {
    id: "players",
    question: "Who plays, which marks do they use, and who starts?",
    answer: "Two local players use X and O. X takes the first turn.",
  },
  {
    id: "rules",
    question: "What board, win, draw, and stopping rules apply?",
    answer: "Use a fixed 3 by 3 board. Three equal marks in a row, column, or diagonal wins. A full board without a winner is a draw, and play stops after either result.",
  },
  {
    id: "errors",
    question: "Which moves are invalid, and what happens after rejection?",
    answer: "Reject wrong turns, out-of-range cells, occupied cells, and moves after completion. A rejection must not change the board or current player.",
  },
  {
    id: "scope",
    question: "What is outside the first version?",
    answer: "No computer player, undo, score history, variable board, online play, UI, or storage.",
  },
] as const;

export function ClarificationAnswerDeck() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
      <p className="border-b border-[var(--line)] bg-[var(--paper-2)] px-4 py-2.5 text-xs leading-5 text-[var(--muted)]">Open one question at a time to hear the interviewer&apos;s answer.</p>
      <div>
        {clarificationAnswers.map((item, index) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="border-b border-[var(--line)] last:border-b-0">
              <button type="button" aria-expanded={isOpen} onClick={() => setOpenId(isOpen ? null : item.id)} className="flex w-full items-center gap-3 px-3 py-3 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[var(--focus)] sm:px-4">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono text-[10px] font-bold text-white">{index + 1}</span>
                <span className="min-w-0 flex-1 text-xs font-extrabold leading-5 text-[var(--ink)] sm:text-sm">{item.question}</span>
                <ChevronDown className={cn("size-4 shrink-0 text-[var(--faint)] transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && <div className="border-t border-[var(--line)] bg-[var(--blue-soft)] px-4 py-3 text-xs leading-5 text-[var(--muted)] sm:pl-13 sm:pr-5">{item.answer}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const entityCandidates = [
  { id: "game", label: "Game", isClass: true, feedback: "Game remembers the current player, status, and winner while coordinating a complete move." },
  { id: "board", label: "Board", isClass: true, feedback: "Board owns the changing cells and every rule that can be answered from them." },
  { id: "player", label: "Player", isClass: true, feedback: "Player keeps a name and assigned mark together as one stable identity." },
  { id: "cell", label: "Cell", isClass: false, feedback: "A cell adds no behavior here; one Mark value inside Board is enough." },
  { id: "mark", label: "Mark", isClass: false, feedback: "X and O are choices from a fixed set, so Mark is an enum." },
  { id: "winning-rule", label: "WinningRule", isClass: false, feedback: "There is only one fixed winning rule, so a separate abstraction would be premature." },
] as const;

const entityIntroductionSteps = [
  ["Extract candidates", "Find nouns such as Game, Board, Player, Cell, Mark, and WinningRule."],
  ["Choose real classes", "Keep candidates that own meaningful state, behavior, or rules."],
  ["Model simple concepts", "Use enums for fixed choices and fields or parameters for simple values."],
  ["Assign responsibility", "Put each rule beside the object that owns the information it needs."],
  ["Trace the relationships", "Follow one move through Player, Game, and Board."],
] as const;

export function FocusEntityIntroduction() {
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
      <p className="text-xs leading-5 text-[var(--muted)] sm:text-sm sm:leading-6">With clear requirements in hand, the next step is figuring out what objects make up the system. A useful starting point is to find the nouns in the requirements—but not every noun deserves its own class.</p>
      <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--faint)]">What comes next</p>
      <ol className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {entityIntroductionSteps.map(([title, description], index) => (
          <li key={title} className="flex gap-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono text-[9px] font-bold text-white">{index + 1}</span>
            <p className="text-[10px] leading-4 text-[var(--muted)] sm:text-xs sm:leading-5"><strong className="text-[var(--ink)]">{title}</strong> — {description}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 rounded-lg border border-[#b8ddcf] bg-[var(--mint-soft)] px-3 py-2 text-[10px] font-bold leading-4 text-[var(--ink)] sm:text-xs sm:leading-5">The goal is not to create the most classes. It is to create the smallest model that can satisfy the confirmed requirements.</p>
    </section>
  );
}

export function EntityClassPicker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const expected = entityCandidates.filter((candidate) => candidate.isClass).map((candidate) => candidate.id);
  const isCorrect = selected.length === expected.length && expected.every((id) => selected.includes(id));
  const reviewed = entityCandidates.find((candidate) => candidate.id === reviewId);

  const reset = () => {
    setSelected([]);
    setChecked(false);
    setReviewId(null);
  };

  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
      <p className="text-xs leading-5 text-[var(--muted)]">Select every concept that owns meaningful state or rules.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {entityCandidates.map((candidate) => checked ? (
          <button key={candidate.id} type="button" aria-pressed={reviewId === candidate.id} onClick={() => setReviewId(candidate.id)} className={cn("flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", candidate.isClass ? "border-[#92c8b5] bg-[var(--mint-soft)]" : "border-[#efc2bb] bg-[#fff3f0]", reviewId === candidate.id && "ring-2 ring-[var(--ink)]")}>
            <span className="text-xs font-extrabold text-[var(--ink)]">{candidate.label}</span>
            <span className={cn("text-[9px] font-extrabold uppercase", candidate.isClass ? "text-[#24785f]" : "text-[#a23d2e]")}>{candidate.isClass ? "Class" : "Not class"}</span>
          </button>
        ) : (
          <label key={candidate.id} className={cn("flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-extrabold text-[var(--ink)]", selected.includes(candidate.id) ? "border-[var(--ink)]" : "border-[var(--line)]")}>
            <input type="checkbox" checked={selected.includes(candidate.id)} onChange={() => setSelected((current) => current.includes(candidate.id) ? current.filter((id) => id !== candidate.id) : [...current, candidate.id])} className="size-4 accent-[var(--ink)]" />
            {candidate.label}
          </label>
        ))}
      </div>
      {checked && reviewed && <div className="mt-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-[10px] leading-4 text-[var(--muted)]"><strong className="text-[var(--ink)]">{reviewed.label}: </strong>{reviewed.feedback}</div>}
      <div className="mt-3 flex items-center gap-3">
        {!checked ? <Button size="sm" disabled={selected.length === 0} onClick={() => { setChecked(true); setReviewId("cell"); }}>Check classes</Button> : <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button>}
        <p aria-live="polite" className={cn("text-xs font-bold", checked && (isCorrect ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (isCorrect ? "Exactly right." : "Review each Class label.")}</p>
      </div>
    </section>
  );
}

type EntityModelOption = { id: string; label: string; feedback: string };
type EntityModelRow = { id: string; label: string; answer: string; options: EntityModelOption[] };

const entityModelRows: EntityModelRow[] = [
  { id: "cell", label: "Cell", answer: "field", options: [
    { id: "class", label: "Class", feedback: "A class would wrap one value without adding a rule." },
    { id: "field", label: "Field", feedback: "Correct: store a Mark value directly in Board's cell array." },
    { id: "enum", label: "Enum", feedback: "The position is not a fixed choice; the value stored at it is." },
    { id: "leave", label: "Leave out", feedback: "The cell state is required, even though a Cell class is not." },
  ] },
  { id: "closed-values", label: "Mark, status, result", answer: "enum", options: [
    { id: "class", label: "Class", feedback: "These concepts name closed choices, not independent objects." },
    { id: "number", label: "Number", feedback: "Numbers hide meaning and allow invalid states." },
    { id: "enum", label: "Enum", feedback: "Correct: enums restrict each concept to its valid named values." },
    { id: "string", label: "String", feedback: "Strings allow spelling errors and unsupported values." },
  ] },
  { id: "coordinates", label: "Row and column", answer: "number", options: [
    { id: "class", label: "Class", feedback: "A Position class is unnecessary for this small fixed scope." },
    { id: "number", label: "Number fields", feedback: "Correct: row and column are simple integer inputs." },
    { id: "enum", label: "Enum", feedback: "Coordinates are numeric positions, not named domain states." },
    { id: "leave", label: "Leave out", feedback: "A move still needs coordinates to identify its target." },
  ] },
  { id: "winning-rule", label: "WinningRule", answer: "leave", options: [
    { id: "class", label: "Class", feedback: "A separate class adds indirection for one fixed rule." },
    { id: "interface", label: "Interface", feedback: "An interface becomes useful only when rule implementations vary." },
    { id: "field", label: "Field", feedback: "The winning check is behavior that reads Board state, not stored data." },
    { id: "leave", label: "Leave out", feedback: "Correct: keep the fixed winning check inside Board for now." },
  ] },
];

export function EntityModelClassifier() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [reviewRowId, setReviewRowId] = useState("cell");
  const reviewedRow = entityModelRows.find((row) => row.id === reviewRowId)!;
  const reviewedCorrectOption = reviewedRow.options.find((option) => option.id === reviewedRow.answer)!;
  const isCorrect = entityModelRows.every((row) => answers[row.id] === row.answer);

  const reset = () => {
    setAnswers({});
    setChecked(false);
    setReviewRowId("cell");
  };

  const checkModels = () => {
    const firstIncorrect = entityModelRows.find((row) => answers[row.id] !== row.answer);
    setReviewRowId(firstIncorrect?.id ?? "cell");
    setChecked(true);
  };

  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
      <div className="grid gap-2">
        {entityModelRows.map((row) => {
          const selectedOption = row.options.find((option) => option.id === answers[row.id])!;
          const correctOption = row.options.find((option) => option.id === row.answer)!;
          const rowIsCorrect = answers[row.id] === row.answer;
          return checked ? (
          <button key={row.id} type="button" aria-pressed={reviewRowId === row.id} onClick={() => setReviewRowId(row.id)} className={cn("flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", reviewRowId === row.id && "border-[var(--ink)] ring-2 ring-[var(--ink)]")}>
            <span className="text-xs font-extrabold text-[var(--ink)]">{row.label}</span>
            {rowIsCorrect ? (
              <span className="flex shrink-0 items-center gap-1 text-[10px] font-extrabold text-[#24785f]"><Check className="size-3.5" /> {correctOption.label}</span>
            ) : (
              <span className="flex shrink-0 items-center gap-2 text-[9px] font-extrabold">
                <span className="flex items-center gap-1 text-[#a23d2e]"><X className="size-3.5" /> {selectedOption.label}</span>
                <span className="flex items-center gap-1 text-[#24785f]"><Check className="size-3.5" /> {correctOption.label}</span>
              </span>
            )}
          </button>
        ) : (
          <div key={row.id} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
            <p className="text-[11px] font-extrabold text-[var(--ink)]">{row.label}</p>
            <div className="mt-1 grid grid-cols-4 gap-1">{row.options.map((option) => <button key={option.id} type="button" aria-pressed={answers[row.id] === option.id} onClick={() => setAnswers((current) => ({ ...current, [row.id]: option.id }))} className={cn("rounded-md border px-1 py-1 text-[9px] font-extrabold leading-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", answers[row.id] === option.id ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line)] bg-[var(--paper-2)] text-[var(--muted)]")}>{option.label}</button>)}</div>
          </div>
        );})}
      </div>
      {checked && <div className="mt-2 rounded-lg border border-[var(--line)] bg-white p-2.5">
        <p className="flex items-center gap-1 text-[10px] font-extrabold text-[#24785f]"><Check className="size-3.5" /> Why {reviewedRow.label} is {reviewedCorrectOption.label}</p>
        <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{reviewedCorrectOption.feedback.replace("Correct: ", "")}</p>
      </div>}
      <div className="mt-3 flex items-center gap-3">
        {!checked ? <Button size="sm" disabled={Object.keys(answers).length !== entityModelRows.length} onClick={checkModels}>Check models</Button> : <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button>}
        <p aria-live="polite" className={cn("text-xs font-bold", checked && (isCorrect ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (isCorrect ? "All four fit the scope." : "Review the marked rows.")}</p>
      </div>
    </section>
  );
}

const responsibilityRules = [
  { id: "occupied", label: "Cell is already occupied", owner: "Board", feedback: "Board stores the cells, so it can check whether the chosen cell is empty." },
  { id: "turn", label: "The wrong player moves", owner: "Game", feedback: "Game remembers the current player, so it can reject anyone else." },
  { id: "winner", label: "Three marks form a line", owner: "Board", feedback: "Board stores every mark, so it can check rows, columns, and diagonals." },
  { id: "complete", label: "A move happens after the game ends", owner: "Game", feedback: "Game remembers whether the match ended, so it can block another move." },
  { id: "range", label: "Position is outside the board", owner: "Board", feedback: "Board knows its size, so it can reject an invalid row or column." },
  { id: "change", label: "Switch to the next player", owner: "Game", feedback: "Game controls the turn, so it switches players only after a valid move." },
] as const;

export function EntityResponsibilityQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState("occupied");
  const reviewed = responsibilityRules.find((rule) => rule.id === reviewId)!;
  const isCorrect = responsibilityRules.every((rule) => answers[rule.id] === rule.owner);

  const reset = () => { setAnswers({}); setChecked(false); setReviewId("occupied"); };

  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-4">
      <div className="mb-2 rounded-lg border border-[#b8ddcf] bg-[var(--mint-soft)] px-3 py-2">
        <p className="text-[10px] font-extrabold leading-4 text-[var(--ink)]">Give each rule to the class that has the information needed to check it.</p>
        <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">Board stores the cells, so it checks cell rules. Game stores the current player and match status, so it checks game rules.</p>
      </div>
      {!checked ? <div className="grid gap-1.5">{responsibilityRules.map((rule) => <div key={rule.id} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3 py-1.5"><span className="text-[11px] font-bold leading-4 text-[var(--ink)]">{rule.label}</span><div className="flex rounded-md bg-[var(--paper-2)] p-0.5">{["Game", "Board"].map((owner) => <button key={owner} type="button" aria-pressed={answers[rule.id] === owner} onClick={() => setAnswers((current) => ({ ...current, [rule.id]: owner }))} className={cn("rounded px-2 py-1 text-[9px] font-extrabold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", answers[rule.id] === owner ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]")}>{owner}</button>)}</div></div>)}</div> : (
        <div className="grid grid-cols-2 gap-2">{["Game", "Board"].map((owner) => <div key={owner} className="rounded-lg border border-[var(--line)] bg-white p-2"><p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--faint)]">{owner} owns</p><div className="mt-1.5 grid gap-1">{responsibilityRules.filter((rule) => rule.owner === owner).map((rule) => <button key={rule.id} type="button" onClick={() => setReviewId(rule.id)} className={cn("rounded-md px-2 py-1 text-left text-[9px] font-bold leading-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", answers[rule.id] === rule.owner ? "bg-[var(--mint-soft)] text-[#24785f]" : "bg-[#fff3f0] text-[#a23d2e]", reviewId === rule.id && "ring-2 ring-[var(--ink)]")}>{rule.label}</button>)}</div></div>)}</div>
      )}
      {checked && <>
        <div className="mt-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          <p className="text-[10px] font-extrabold text-[var(--ink)]">Why {reviewed.owner}?</p>
          <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{reviewed.feedback}</p>
        </div>
      </>}
      <div className="mt-2 flex items-center gap-3">
        {!checked ? <Button size="sm" disabled={Object.keys(answers).length !== responsibilityRules.length} onClick={() => setChecked(true)}>Check owners</Button> : <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button>}
        <p aria-live="polite" className={cn("text-xs font-bold", checked && (isCorrect ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (isCorrect ? "Every rule has its owner." : "The groups show the right owners.")}</p>
      </div>
    </section>
  );
}

const entityFlowItems = [
  { id: "choose", label: "Player chooses a cell", reasoning: "The flow starts with the player's action: choosing where to place a mark." },
  { id: "check", label: "Game checks whether the move is allowed", reasoning: "Game knows whose turn it is and whether the match has already ended." },
  { id: "send", label: "Game asks Board to place the mark", reasoning: "Game coordinates the move, but Board owns the cells and must handle placement." },
  { id: "place", label: "Board checks the cell and places the mark", reasoning: "Board checks the position and occupancy before changing its cell data." },
  { id: "report", label: "Board reports whether the move worked", reasoning: "Game needs the placement result so a rejected move does not change the turn." },
  { id: "finish", label: "Game ends the match or switches the player", reasoning: "Only an accepted move can create a win, draw, or next turn." },
] as const;

const entityFlowDisplayOrder = ["report", "choose", "send", "finish", "place", "check"];

export function EntityFlowChallenge() {
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [view, setView] = useState<"results" | "diagram">("results");
  const correctOrder = entityFlowItems.map((item) => item.id);
  const isCorrect = correctOrder.every((id, index) => order[index] === id);
  const correctCount = correctOrder.filter((id, index) => order[index] === id).length;
  const remaining = entityFlowDisplayOrder.map((id) => entityFlowItems.find((item) => item.id === id)!).filter((item) => !order.includes(item.id));
  const reset = () => { setOrder([]); setChecked(false); setView("results"); };

  const removeStep = (id: string) => {
    setOrder((current) => current.filter((value) => value !== id));
    setChecked(false);
  };

  const checkFlow = () => {
    setView("results");
    setChecked(true);
  };

  return (
    <section className="flex h-full min-h-0 flex-col rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
      {view === "results" ? <div className="min-h-0 flex-1">
        <p className="text-xs leading-5 text-[var(--muted)]">Tap the six actions in execution order. Tap a chosen action to remove it.</p>
        <div className="mt-2 flex flex-wrap gap-1.5">{remaining.map((item) => <button key={item.id} type="button" onClick={() => setOrder((current) => [...current, item.id])} className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-[10px] font-bold leading-4 text-[var(--ink)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]">{item.label}</button>)}</div>
        <ol className="mt-2 grid grid-cols-2 gap-1.5">{order.map((id, index) => {
          const item = entityFlowItems.find((flowItem) => flowItem.id === id)!;
          const positionIsCorrect = correctOrder[index] === id;
          return <li key={id}><button type="button" onClick={() => removeStep(id)} aria-label={`${checked ? positionIsCorrect ? "Correct. " : "Incorrect. " : ""}Remove step ${index + 1}: ${item.label}`} className={cn("flex h-full w-full items-center gap-1.5 rounded-lg border px-2 py-1 text-left text-[9px] font-bold leading-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", !checked && "border-transparent bg-white", checked && positionIsCorrect && "border-[#8bcab3] bg-[var(--mint-soft)] text-[#24785f]", checked && !positionIsCorrect && "border-[#efaaa0] bg-[#fff0ed] text-[#a23d2e]")}>
            <span className={cn("grid size-4 shrink-0 place-items-center rounded-full font-mono text-[8px]", !checked && "bg-[var(--ink)] text-white", checked && positionIsCorrect && "bg-[#24785f] text-white", checked && !positionIsCorrect && "bg-[#a23d2e] text-white")}>{checked ? positionIsCorrect ? <Check className="size-3" /> : <X className="size-3" /> : index + 1}</span>
            <span>{index + 1}. {item.label}</span>
          </button></li>;
        })}</ol>
        {checked && <p className={cn("mt-2 text-xs font-extrabold", isCorrect ? "text-[#24785f]" : "text-[#a23d2e]")} aria-live="polite">{correctCount} of {entityFlowItems.length} positions correct</p>}
      </div> : <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-white"><Image src="/images/tic-tac-toe-entity-flow.png" alt="Player sends makeMove to Game, Game delegates placement to Board, and Board returns a result" width={1774} height={887} className="h-full w-full object-contain" priority unoptimized /></div>
        <ol className="mt-2 grid shrink-0 grid-cols-2 gap-1 text-[9px] font-bold leading-4">{entityFlowItems.map((item, index) => <li key={item.id} className="flex gap-1.5 rounded-md bg-white px-2 py-1"><span className="text-[var(--orange)]">{index + 1}.</span><span>{item.label}</span></li>)}</ol>
      </div>}
      <div className="mt-3 flex shrink-0 items-center gap-3">
        {view === "results" && <Button size="sm" disabled={order.length !== entityFlowItems.length} onClick={checkFlow}>{checked ? "Check again" : "Check flow"}</Button>}
        {checked && view === "results" && <Button variant="outline" size="sm" onClick={() => setView("diagram")}>{isCorrect ? "See final diagram" : "Reveal solution"}</Button>}
        {view === "results" && order.length > 0 && <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Start over</Button>}
        {view === "diagram" && <Button variant="outline" size="sm" onClick={() => setView("results")}><ChevronLeft /> Back to my flow</Button>}
      </div>
    </section>
  );
}

const classDesignRoadmap = [
  ["Responsibility", "What job does this class own?"],
  ["State", "What must it remember to do that job?"],
  ["Behavior", "What can it decide or change using that state?"],
  ["Public API", "What may callers ask without bypassing rules?"],
  ["Relationships", "Which objects does it contain or collaborate with?"],
  ["Principles", "Does the design protect state and keep jobs focused?"],
] as const;

export function ClassDesignIntroduction() {
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
      <p className="text-xs leading-5 text-[var(--muted)] sm:text-sm sm:leading-6">Entities tell us which objects exist. Class design turns each object into a clear promise: the state it protects, the behavior it owns, and the small API other objects may use.</p>
      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {classDesignRoadmap.map(([title, description], index) => <div key={title} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold text-[var(--ink)]"><span className="grid size-4 place-items-center rounded-full bg-[var(--ink)] font-mono text-[8px] text-white">{index + 1}</span>{title}</p>
          <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{description}</p>
        </div>)}
      </div>
      <p className="mt-3 rounded-lg border border-[#b8ddcf] bg-[var(--mint-soft)] px-3 py-2 text-[10px] font-bold leading-4 text-[var(--ink)] sm:text-xs">We will design Player first, then Board, then Game—the coordinator that composes them.</p>
    </section>
  );
}

export type ClassificationCategory = { id: string; label: string };
export type ClassificationItem = { id: string; label: string; answer: string; feedback: string };

export function ClassificationChallenge({ instruction, callout, categories, items, success, submitLabel = "Check answers" }: { instruction: string; callout?: string; categories: ClassificationCategory[]; items: ClassificationItem[]; success: string; submitLabel?: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState(items[0].id);
  const reviewed = items.find((item) => item.id === reviewId)!;
  const isCorrect = items.every((item) => answers[item.id] === item.answer);
  const reset = () => { setAnswers({}); setChecked(false); setReviewId(items[0].id); };
  const check = () => { setReviewId(items.find((item) => answers[item.id] !== item.answer)?.id ?? items[0].id); setChecked(true); };

  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
    <p className="text-xs leading-5 text-[var(--muted)]">{instruction}</p>
    {checked && callout && <p className="mt-2 rounded-md bg-[var(--mint-soft)] px-2 py-1 text-[9px] font-bold leading-4 text-[var(--ink)]">{callout}</p>}
    <div className="mt-2 grid gap-1.5 sm:grid-cols-2">{items.map((item) => {
      const selected = categories.find((category) => category.id === answers[item.id]);
      const correct = categories.find((category) => category.id === item.answer)!;
      const rowCorrect = answers[item.id] === item.answer;
      return checked ? <button key={item.id} type="button" aria-pressed={reviewId === item.id} onClick={() => setReviewId(item.id)} className={cn("flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-1.5 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", reviewId === item.id && "border-[var(--ink)] ring-2 ring-[var(--ink)]")}><span className="text-[10px] font-extrabold text-[var(--ink)] sm:text-xs">{item.label}</span><span className={cn("flex shrink-0 items-center gap-1 text-[9px] font-extrabold", rowCorrect ? "text-[#24785f]" : "text-[#a23d2e]")}>{rowCorrect ? <Check className="size-3" /> : <X className="size-3" />}{rowCorrect ? correct.label : `${selected?.label} → ${correct.label}`}</span></button> : <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3 py-1.5"><span className="text-[10px] font-extrabold leading-4 text-[var(--ink)] sm:text-xs">{item.label}</span><div className={cn("grid rounded-md bg-[var(--paper-2)] p-0.5", categories.length > 3 ? "grid-cols-2" : "grid-flow-col")}>{categories.map((category) => <button key={category.id} type="button" aria-pressed={answers[item.id] === category.id} onClick={() => setAnswers((current) => ({ ...current, [item.id]: category.id }))} className={cn("rounded px-1.5 py-1 text-[8px] font-extrabold leading-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)] sm:px-2 sm:text-[9px]", answers[item.id] === category.id ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]")}>{category.label}</button>)}</div></div>;
    })}</div>
    {checked && <div className="mt-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2"><p className="text-[10px] font-extrabold text-[var(--ink)]">Why {categories.find((category) => category.id === reviewed.answer)?.label}?</p><p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{reviewed.feedback}</p></div>}
    <div className="mt-3 flex items-center gap-3">{!checked ? <Button size="sm" disabled={Object.keys(answers).length !== items.length} onClick={check}>{submitLabel}</Button> : <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button>}<p aria-live="polite" className={cn("text-xs font-bold", checked && (isCorrect ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (isCorrect ? success : "Review the marked decisions.")}</p></div>
  </section>;
}

export function InterviewDynamicsGuide({ timing, speaking, signals }: { timing: Array<{ label: string; minutes: string }>; speaking: string[]; signals: Array<{ id: string; signal: string; response: string }> }) {
  const [openSignal, setOpenSignal] = useState<string | null>(null);
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5"><Tabs defaultValue="time"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="time" className="py-1.5 text-xs">Use time</TabsTrigger><TabsTrigger value="talk" className="py-1.5 text-xs">Talk aloud</TabsTrigger><TabsTrigger value="signals" className="py-1.5 text-xs">Read signals</TabsTrigger></TabsList><TabsContent value="time" className="mt-2"><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{timing.map((item) => <div key={item.label} className="rounded-lg bg-white px-3 py-2"><p className="text-[10px] font-extrabold">{item.label}</p><p className="mt-1 font-mono text-xs text-[var(--accent-dark)]">{item.minutes}</p></div>)}</div><p className="mt-2 text-[10px] leading-4 text-[var(--muted)]">Spend time in proportion to risk. Clarify first; do not use most of the interview naming classes.</p></TabsContent><TabsContent value="talk" className="mt-2"><ul className="grid gap-2">{speaking.map((item, index) => <li key={item} className="flex gap-2 rounded-lg bg-white px-3 py-2 text-xs leading-5 text-[var(--muted)]"><span className="font-mono font-bold text-[var(--accent-dark)]">{index + 1}</span>{item}</li>)}</ul></TabsContent><TabsContent value="signals" className="mt-2"><p className="mb-2 text-[10px] leading-4 text-[var(--muted)]">Predict what each interviewer signal asks you to do, then reveal it.</p><div className="grid gap-1.5">{signals.map((item) => <div key={item.id} className="overflow-hidden rounded-lg border border-[var(--line)] bg-white"><button type="button" aria-expanded={openSignal === item.id} onClick={() => setOpenSignal(openSignal === item.id ? null : item.id)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-extrabold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[var(--focus)]">{item.signal}<ChevronDown className={cn("size-4 transition", openSignal === item.id && "rotate-180")} /></button>{openSignal === item.id && <p className="border-t border-[var(--line)] bg-[var(--mint-soft)] px-3 py-2 text-[10px] leading-4 text-[var(--muted)]">{item.response}</p>}</div>)}</div></TabsContent></Tabs></section>;
}

export function InterviewDialogueExample({ turns }: { turns: Array<{ speaker: "Candidate" | "Interviewer"; text: string }> }) {
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5"><p className="text-xs leading-5 text-[var(--muted)]">Notice the rhythm: ask one precise question, listen, then repeat the resulting requirement.</p><ol className="mt-3 grid gap-2">{turns.map((turn, index) => <li key={`${turn.speaker}-${index}`} className={cn("rounded-lg border px-3 py-2", turn.speaker === "Candidate" ? "border-[#b8ddcf] bg-[var(--mint-soft)]" : "border-[var(--line)] bg-white")}><p className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--faint)]">{turn.speaker}</p><p className="mt-1 text-xs font-bold leading-5 text-[var(--ink)]">“{turn.text}”</p></li>)}</ol><p className="mt-3 text-[10px] font-bold leading-4 text-[var(--muted)]">Confirming aloud catches misunderstandings before they become fields, methods, and code.</p></section>;
}

export function PredictionChecklist({ prompt, items, success }: { prompt: string; items: Array<{ id: string; label: string; correct: boolean; feedback: string }>; success: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState(items[0].id);
  const reviewed = items.find((item) => item.id === reviewId)!;
  const expected = items.filter((item) => item.correct).map((item) => item.id);
  const isCorrect = selected.length === expected.length && expected.every((id) => selected.includes(id));
  const reset = () => { setSelected([]); setChecked(false); setReviewId(items[0].id); };
  const check = () => { setReviewId(items.find((item) => selected.includes(item.id) !== item.correct)?.id ?? items[0].id); setChecked(true); };
  return <section className="prediction-checklist rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3">
    <p className="text-xs font-extrabold leading-5 text-[var(--ink)]">{prompt}</p>
    <div className="mt-2 grid grid-cols-2 gap-1.5">{items.map((item) => {
      const matched = selected.includes(item.id) === item.correct;
      return checked ? <button key={item.id} type="button" aria-pressed={reviewId === item.id} onClick={() => setReviewId(item.id)} className={cn("flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[10px] font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", matched ? "border-[#92c8b5] bg-[var(--mint-soft)]" : "border-[#efc2bb] bg-[#fff3f0]", reviewId === item.id && "ring-2 ring-[var(--ink)]")}>
        <span className={cn("grid size-4 shrink-0 place-items-center rounded-full text-white", matched ? "bg-[#24785f]" : "bg-[#a23d2e]")}>{matched ? <Check className="size-3" /> : <X className="size-3" />}</span>
        <span><span className="block">{item.label}</span><span className="block text-[8px] font-extrabold uppercase tracking-wide">{matched ? "Correct" : item.correct ? "Should be selected" : "Should be left out"}</span></span>
      </button> : <label key={item.id} className={cn("flex items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5 text-[10px] font-bold", selected.includes(item.id) ? "border-[var(--ink)]" : "border-[var(--line)]")}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} className="size-4 accent-[var(--ink)]" />{item.label}</label>;
    })}</div>
    {checked && <div className="mt-2 rounded-lg border border-[var(--line)] bg-white px-3 py-1.5"><p className="text-[10px] font-extrabold">Correct answer: {reviewed.correct ? "Select it" : "Leave it out"}</p><p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{reviewed.feedback}</p></div>}
    <div className="mt-2 flex items-center gap-3">{!checked ? <Button size="sm" disabled={selected.length === 0} onClick={check}>Check prediction</Button> : <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button>}<p aria-live="polite" className={cn("text-xs font-bold", checked && (isCorrect ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (isCorrect ? success : "Review the marked choices.")}</p></div>
  </section>;
}

export function TabbedCodeView({ tabs, label }: { tabs: Array<{ id: string; label: string; code: string }>; label: string }) {
  return <section aria-label={label} className="flex h-full min-h-0 flex-col rounded-xl border border-[#2e3947] bg-[#18212c] text-white"><Tabs defaultValue={tabs[0].id} className="flex h-full min-h-0 flex-col"><div className="shrink-0 overflow-x-auto border-b border-white/10 p-2"><TabsList className="grid min-w-max grid-flow-col border-white/10 bg-white/5 p-0.5">{tabs.map((tab) => <TabsTrigger key={tab.id} value={tab.id} className="whitespace-nowrap px-2.5 py-1.5 text-[10px] text-white/70 data-[state=active]:bg-white data-[state=active]:text-[var(--ink)]">{tab.label}</TabsTrigger>)}</TabsList></div>{tabs.map((tab) => <TabsContent key={tab.id} value={tab.id} className="min-h-0 flex-1 overflow-hidden"><pre className="h-full overflow-x-auto overflow-y-hidden p-3 text-[10px] leading-[1.35] sm:p-4 sm:text-[11px]"><code><HighlightedJava code={tab.code} /></code></pre></TabsContent>)}</Tabs></section>;
}

export function TabbedConceptView({ tabs }: { tabs: Array<{ id: string; label: string; title: string; body: string }> }) {
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5"><Tabs defaultValue={tabs[0].id}><div className="overflow-x-auto"><TabsList className="grid min-w-max grid-flow-col">{tabs.map((tab) => <TabsTrigger key={tab.id} value={tab.id} className="whitespace-nowrap px-2.5 py-1.5 text-[10px]">{tab.label}</TabsTrigger>)}</TabsList></div>{tabs.map((tab) => <TabsContent key={tab.id} value={tab.id} className="mt-3 rounded-lg border border-[var(--line)] bg-white p-4"><p className="text-sm font-extrabold text-[var(--ink)]">{tab.title}</p><p className="mt-2 text-xs leading-6 text-[var(--muted)]">{tab.body}</p></TabsContent>)}</Tabs></section>;
}

const classRelationships = [
  { id: "board", label: "Game has one Board", correct: true, feedback: "Game composes and coordinates the board used by this match." },
  { id: "players", label: "Game has two Players", correct: true, feedback: "The match keeps both participants so it can validate and alternate turns." },
  { id: "player-mark", label: "Player has one Mark", correct: true, feedback: "A fixed mark is part of Player's immutable identity." },
  { id: "board-mark", label: "Board stores Mark values", correct: true, feedback: "Each grid position is empty or contains an enum value." },
  { id: "game-board-inherit", label: "Game extends Board", correct: false, feedback: "A Game is not a kind of Board; it has and coordinates one." },
  { id: "player-game-inherit", label: "Player extends Game", correct: false, feedback: "A Player participates in a Game but is not a specialized Game." },
] as const;

export function ClassRelationshipChallenge() {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState("game-board-inherit");
  const reviewed = classRelationships.find((item) => item.id === reviewId)!;
  const expected = classRelationships.filter((item) => item.correct).map((item) => item.id);
  const isCorrect = selected.length === expected.length && expected.every((id) => selected.includes(id));
  const reset = () => { setSelected([]); setChecked(false); setReviewId("game-board-inherit"); };

  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
    <p className="text-xs leading-5 text-[var(--muted)]">Select every relationship that describes the model.</p>
    <div className="mt-3 grid grid-cols-2 gap-2">{classRelationships.map((item) => checked ? <button key={item.id} type="button" onClick={() => setReviewId(item.id)} className={cn("flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-[10px] font-extrabold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", item.correct ? "border-[#92c8b5] bg-[var(--mint-soft)]" : "border-[#efc2bb] bg-[#fff3f0]", reviewId === item.id && "ring-2 ring-[var(--ink)]")}><span>{item.label}</span>{item.correct ? <Check className="size-3.5 text-[#24785f]" /> : <X className="size-3.5 text-[#a23d2e]" />}</button> : <label key={item.id} className={cn("flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-[10px] font-extrabold text-[var(--ink)]", selected.includes(item.id) ? "border-[var(--ink)]" : "border-[var(--line)]")}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} className="size-4 accent-[var(--ink)]" />{item.label}</label>)}</div>
    {checked && <div className="mt-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2"><p className="text-[10px] font-extrabold text-[var(--ink)]">{reviewed.correct ? "Composition" : "Why not inheritance?"}</p><p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{reviewed.feedback}</p></div>}
    <div className="mt-3 flex items-center gap-3">{!checked ? <Button size="sm" disabled={selected.length === 0} onClick={() => setChecked(true)}>Check relationships</Button> : <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button>}<p aria-live="polite" className={cn("text-xs font-bold", checked && (isCorrect ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (isCorrect ? "Composition matches the model." : "Review each relationship.")}</p></div>
  </section>;
}

const classBlueprints = {
  player: { image: "/images/tic-tac-toe-player-class.png", alt: "Sketch UML diagram of the Player class", diagram: "Two private fields form one stable identity. Construction sets them once, and getters provide safe reads.", principle: "Immutability and cohesion prevent a player's mark changing mid-game." },
  board: { image: "/images/tic-tac-toe-board-class.png", alt: "Sketch UML diagram of the Board class", diagram: "Board hides the cell grid and owns every operation decided by inspecting those cells.", principle: "Encapsulation keeps validation beside mutable grid state, so callers cannot bypass placement rules." },
  game: { image: "/images/tic-tac-toe-game-class.png", alt: "Sketch UML diagram of the Game class", diagram: "Game composes one Board and two Players, then coordinates a move from validation to result.", principle: "Single responsibility and composition separate match flow from grid algorithms." },
} as const;

export function FinalClassBlueprint() {
  return <section className="flex h-full min-h-0 flex-col rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-4">
    <Tabs defaultValue="player" className="flex min-h-0 flex-1 flex-col">
      <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="player" className="py-1.5 text-xs">Player</TabsTrigger><TabsTrigger value="board" className="py-1.5 text-xs">Board</TabsTrigger><TabsTrigger value="game" className="py-1.5 text-xs">Game</TabsTrigger></TabsList>
      {Object.entries(classBlueprints).map(([id, model]) => <TabsContent key={id} value={id} className="mt-2 min-h-0 flex-1"><article className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-[var(--line)] bg-white"><div className="flex min-h-0 items-center justify-center overflow-hidden bg-[#fbf7ef] p-1"><Image src={model.image} alt={model.alt} width={1536} height={1024} className="h-full w-full object-contain" unoptimized /></div><div className="grid gap-1 border-t border-[var(--line)] px-3 py-2 sm:grid-cols-2"><p className="text-[9px] leading-4 text-[var(--muted)]"><strong className="text-[var(--ink)]">Read the diagram: </strong>{model.diagram}</p><p className="text-[9px] leading-4 text-[var(--muted)]"><strong className="text-[var(--accent-dark)]">Principle: </strong>{model.principle}</p></div></article></TabsContent>)}
    </Tabs>
  </section>;
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
      <pre className="overflow-x-auto p-3 text-[11px] leading-[1.45] sm:p-4 sm:text-xs"><code><HighlightedJava code={code} /></code></pre>
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
