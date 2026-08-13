import Image from "next/image";
import { isValidElement } from "react";
import { AlertTriangle, Check, ChevronDown, ChevronRight, Clock3, Code2, HelpCircle, Lightbulb, MessageCircleQuestion, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="!max-w-[720px] !text-lg !font-medium !leading-8 !text-[var(--ink)]">{children}</p>;
}

export function InterviewDialogue({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-7 rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--muted)]"><MessageCircleQuestion className="size-4 text-[var(--accent)]" /> Interview dialogue</div>
      <div className="space-y-4 text-[0.98rem] leading-7 text-[var(--muted)]">{children}</div>
    </div>
  );
}

export function DialogueLine({ speaker, children }: { speaker: "You" | "Interviewer"; children: React.ReactNode }) {
  const interviewer = speaker === "Interviewer";
  return (
    <div className={cn("flex gap-3", interviewer && "sm:pl-10")}>
      <span className={cn("mt-0.5 shrink-0 rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider", interviewer ? "bg-[var(--blue-soft)] text-[#37627c]" : "bg-[var(--accent-soft)] text-[#a85220]")}>{speaker}</span>
      <p>{children}</p>
    </div>
  );
}

export function ScopeGrid({ inScope, outOfScope }: { inScope: string[]; outOfScope: string[] }) {
  return (
    <div className="my-7 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-[#cce4da] bg-[var(--mint-soft)] p-5">
        <p className="mb-4 flex items-center gap-2 font-extrabold"><Check className="size-5 text-[#27775d]" /> In scope</p>
        <ul className="space-y-2 text-sm leading-6 text-[var(--muted)]">{inScope.map((item) => <li key={item}>• {item}</li>)}</ul>
      </div>
      <div className="rounded-xl border border-[#f0d7c8] bg-[var(--accent-soft)] p-5">
        <p className="mb-4 flex items-center gap-2 font-extrabold"><X className="size-5 text-[#b45423]" /> Out of scope</p>
        <ul className="space-y-2 text-sm leading-6 text-[var(--muted)]">{outOfScope.map((item) => <li key={item}>• {item}</li>)}</ul>
      </div>
    </div>
  );
}

export function Insight({ title, children, tone = "accent" }: { title: string; children: React.ReactNode; tone?: "accent" | "warning" | "mint" }) {
  const colors = tone === "mint" ? "border-[#a8d3c5] bg-[var(--mint-soft)]" : tone === "warning" ? "border-[#e5c978] bg-[#fff8dc]" : "border-[#ecc3a9] bg-[var(--accent-soft)]";
  return (
    <aside className={cn("my-7 rounded-xl border p-5", colors)}>
      <div className="flex gap-3">
        {tone === "warning" ? <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#9b7617]" /> : <Sparkles className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" />}
        <div><p className="font-extrabold text-[var(--ink)]">{title}</p><div className="mt-2 text-sm leading-7 text-[var(--muted)]">{children}</div></div>
      </div>
    </aside>
  );
}

export function ResponsibilityTable({ rows }: { rows: Array<[string, string, string]> }) {
  return (
    <div className="my-7 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
      <div className="hidden grid-cols-[.7fr_1.2fr_1fr] border-b border-[var(--line)] bg-[var(--paper-2)] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[var(--faint)] sm:grid"><span>Object</span><span>Owns</span><span>Does not own</span></div>
      {rows.map(([entity, owns, excludes]) => (
        <div key={entity} className="grid gap-2 border-b border-[var(--line)] px-5 py-4 last:border-0 sm:grid-cols-[.7fr_1.2fr_1fr] sm:gap-5">
          <strong className="font-mono text-sm text-[var(--ink)]">{entity}</strong>
          <span className="text-sm leading-6 text-[var(--muted)]">{owns}</span>
          <span className="text-sm leading-6 text-[var(--faint)]">{excludes}</span>
        </div>
      ))}
    </div>
  );
}

export function TradeoffCards({ options }: { options: Array<{ label: string; title: string; text: string; verdict: string; recommended?: boolean }> }) {
  return (
    <div className="my-7 grid gap-4 md:grid-cols-2">
      {options.map((option) => (
        <div key={option.title} className={cn("relative rounded-xl border bg-white p-5", option.recommended ? "border-[var(--mint)]" : "border-[var(--line)]")}>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--faint)]">{option.label}</span>
          <h4 className="mt-2 text-lg font-extrabold">{option.title}</h4>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{option.text}</p>
          <p className={cn("mt-4 rounded-lg px-3 py-2 text-xs font-bold", option.recommended ? "bg-[var(--mint-soft)] text-[#27775d]" : "bg-[var(--paper-2)] text-[var(--muted)]")}>{option.verdict}</p>
        </div>
      ))}
    </div>
  );
}

export function LevelStrip({ junior, mid, senior }: { junior: string; mid: string; senior: string }) {
  return (
    <div className="my-7 grid overflow-hidden rounded-xl border border-[var(--line)] bg-white md:grid-cols-3">
      {[['Junior', junior, '#f7d66f'], ['Mid-level', mid, '#7fc7ae'], ['Senior', senior, '#ee9360']].map(([label, text, color]) => (
        <div key={label} className="border-b border-[var(--line)] p-5 last:border-0 md:border-b-0 md:border-r md:last:border-r-0">
          <div className="mb-4 h-1.5 w-10 rounded-full" style={{ background: color }} /><strong>{label}</strong><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
        </div>
      ))}
    </div>
  );
}

export function ConceptImage({ src, alt, caption, width = 1536, height = 1024, mobileScrollable = false }: { src: string; alt: string; caption: string; width?: number; height?: number; mobileScrollable?: boolean }) {
  return (
    <figure className="my-7">
      {mobileScrollable && <p className="mb-2 text-right text-[10px] font-bold uppercase tracking-wider text-[var(--faint)] sm:hidden">Swipe to follow the flow →</p>}
      <div className={cn("rounded-xl border border-[var(--line)] bg-[#fbfaf7]", mobileScrollable ? "overflow-x-auto" : "overflow-hidden")}>
        <Image src={src} alt={alt} width={width} height={height} unoptimized className={cn("h-auto w-full", mobileScrollable && "min-w-[680px] sm:min-w-0")} />
      </div>
      <figcaption className="mt-2 text-center text-xs leading-5 text-[var(--faint)]">{caption}</figcaption>
    </figure>
  );
}

const phases = [
  ["requirements", "1", "Requirements", "~5 min"],
  ["entities", "2", "Entities", "~3 min"],
  ["class-design", "3", "Class design", "10–15 min"],
  ["implementation", "4", "Implementation", "~10 min"],
  ["extensions", "5", "Extensions", "~5 min"],
] as const;

export function FrameworkMap() {
  return (
    <nav aria-label="Five interview phases" className="my-7 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
      <div className="border-b border-[var(--line)] bg-[var(--paper-2)] px-4 py-3">
        <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--muted)]"><Clock3 className="size-4 text-[var(--accent-dark)]" /> The same five steps for every problem</p>
      </div>
      <div className="grid sm:grid-cols-5">
        {phases.map(([id, number, label, time], index) => (
          <a key={id} href={`#${id}`} className="group relative flex items-center gap-3 border-b border-[var(--line)] px-3 py-3 last:border-0 hover:bg-[var(--surface)] sm:block sm:border-b-0 sm:border-r sm:text-center sm:last:border-r-0">
            <span className="inline-grid size-6 place-items-center rounded-full bg-[var(--ink)] font-mono text-[10px] font-bold text-white">{number}</span>
            <span className="mt-2 block text-xs font-extrabold">{label}</span>
            <span className="mt-0.5 block text-[10px] text-[var(--faint)]">{time}</span>
            {index < phases.length - 1 && <ChevronRight className="absolute -right-2.5 top-5 z-10 hidden size-4 rounded-full bg-white text-[var(--faint)] sm:block" />}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function QuestionGuide() {
  const questions = [
    ["Actions", "What must a user be able to do?"],
    ["Rules", "When does an action succeed, fail, or change state?"],
    ["Errors", "Which invalid actions must we reject?"],
    ["Boundaries", "What should we deliberately not build?"],
  ];
  return (
    <div className="my-7 rounded-xl border border-[#cddce6] bg-[var(--blue-soft)] p-5">
      <p className="flex items-center gap-2 font-extrabold"><HelpCircle className="size-5 text-[#346985]" /> Use these four question groups every time</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {questions.map(([name, question], index) => <div key={name} className="flex gap-3 rounded-lg bg-white p-3"><span className="font-mono text-xs font-bold text-[#346985]">{index + 1}</span><div><strong className="text-sm">{name}</strong><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{question}</p></div></div>)}
      </div>
    </div>
  );
}

export function QuestionAnswer({ ask, why, answer, derived }: { ask: string; why: string; answer: string; derived: string }) {
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
      <div className="border-b border-[var(--line)] px-4 py-3"><span className="mr-2 rounded bg-[var(--accent-soft)] px-2 py-1 text-[10px] font-extrabold uppercase text-[var(--accent-dark)]">Ask</span><strong className="text-sm leading-6">{ask}</strong></div>
      <div className="grid sm:grid-cols-3">
        <div className="border-b border-[var(--line)] p-4 sm:border-b-0 sm:border-r"><p className="section-kicker">Why ask it?</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{why}</p></div>
        <div className="border-b border-[var(--line)] p-4 sm:border-b-0 sm:border-r"><p className="section-kicker">Interviewer says</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{answer}</p></div>
        <div className="bg-[var(--mint-soft)] p-4"><p className="section-kicker !text-[#28725c]">Write this down</p><p className="mt-2 text-xs font-semibold leading-5 text-[var(--ink)]">{derived}</p></div>
      </div>
    </div>
  );
}

export function RequirementBox({ requirements, outOfScope }: { requirements: string[]; outOfScope: string[] }) {
  return (
    <div className="my-7 rounded-xl border-2 border-[var(--ink)] bg-white">
      <div className="border-b-2 border-[var(--ink)] px-5 py-3"><p className="font-mono text-xs font-bold uppercase tracking-wider">Confirmed specification</p></div>
      <div className="grid md:grid-cols-[1.4fr_.8fr]">
        <div className="border-b border-[var(--line)] p-5 md:border-b-0 md:border-r"><p className="mb-3 text-sm font-extrabold">Requirements</p><ol className="space-y-2 text-sm leading-6 text-[var(--muted)]">{requirements.map((item, index) => <li key={item} className="flex gap-3"><span className="font-mono text-xs font-bold text-[var(--accent-dark)]">{index + 1}.</span><span>{item}</span></li>)}</ol></div>
        <div className="bg-[var(--paper-2)] p-5"><p className="mb-3 text-sm font-extrabold">Not building</p><ul className="space-y-2 text-xs leading-5 text-[var(--muted)]">{outOfScope.map((item) => <li key={item}>— {item}</li>)}</ul></div>
      </div>
    </div>
  );
}

export function CandidateWalkthrough({ name, fromRequirement, question, reasoning, decision, children }: { name: string; fromRequirement: string; question: string; reasoning: string; decision: "Class" | "Field" | "Enum" | "Interface" | "Leave out"; children?: React.ReactNode }) {
  const createsObject = decision === "Class" || decision === "Interface";
  return (
    <section className="entity-walkthrough my-8 border-l-2 border-[var(--line)] pl-5 sm:pl-6">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="!m-0 !text-xl">{name}</h3>
        <span className={cn("rounded px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide", createsObject ? "bg-[var(--mint-soft)] text-[#28725c]" : "bg-[var(--paper-2)] text-[var(--muted)]")}>{decision}</span>
      </div>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]"><strong>Where did it come from?</strong> {fromRequirement}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]"><strong>Question to ask:</strong> {question}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{reasoning}</p>
      {children && <div className="mt-3 rounded-lg bg-[var(--paper-2)] px-4 py-3 text-sm leading-7 text-[var(--muted)]"><strong>Decision:</strong> {children}</div>}
    </section>
  );
}

export function DerivationTable({ rows }: { rows: Array<[string, string, string]> }) {
  return (
    <div className="my-7 overflow-hidden rounded-xl border border-[var(--line)]">
      <div className="hidden grid-cols-[1.15fr_.85fr_1fr] bg-[var(--paper-2)] px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-[var(--faint)] sm:grid"><span>Requirement</span><span>Owner</span><span>State or method it creates</span></div>
      {rows.map(([requirement, owner, result]) => <div key={`${owner}-${requirement}`} className="grid gap-2 border-t border-[var(--line)] p-4 first:border-t-0 sm:grid-cols-[1.15fr_.85fr_1fr] sm:gap-4"><p className="text-xs leading-5 text-[var(--muted)]">{requirement}</p><strong className="font-mono text-xs">{owner}</strong><code className="!w-fit text-xs">{result}</code></div>)}
    </div>
  );
}

export function PatternDecision({ name, useIt, children }: { name: string; useIt: boolean; children: React.ReactNode }) {
  return <div className={cn("my-6 rounded-xl border p-5", useIt ? "border-[#b7dacc] bg-[var(--mint-soft)]" : "border-[var(--line)] bg-[var(--paper-2)]")}><p className="text-sm font-extrabold">{useIt ? "Use" : "Do not force"}: {name}</p><div className="mt-2 text-sm leading-6 text-[var(--muted)]">{children}</div></div>;
}

export function ImplementationGuide({ what, why, flow }: { what: string; why: string; flow: string[] }) {
  return (
    <div className="my-7 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
      <div className="grid md:grid-cols-2">
        <div className="border-b border-[var(--line)] p-5 md:border-b-0 md:border-r">
          <p className="section-kicker">What the code does</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{what}</p>
        </div>
        <div className="border-b border-[var(--line)] bg-[var(--paper-2)] p-5 md:border-b-0">
          <p className="section-kicker">Why it is structured this way</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{why}</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] p-5">
        <p className="section-kicker">Follow one request through the code</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {flow.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono text-[10px] font-bold text-white">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function ConceptDropdown({ title, summary, children, defaultOpen = false }: { title: string; summary: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="concept-dropdown my-3 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
      <summary className="flex list-none items-start gap-3 px-4 py-4 sm:px-5">
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-dark)]"><Lightbulb className="size-4" /></span>
        <span className="min-w-0 flex-1">
          <strong className="block text-sm text-[var(--ink)]">{title}</strong>
          <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{summary}</span>
        </span>
        <ChevronDown className="concept-chevron mt-1 size-4 shrink-0 text-[var(--faint)]" />
      </summary>
      <div className="concept-content border-t border-[var(--line)] bg-[var(--paper-2)] px-5 py-4 text-sm leading-7 text-[var(--muted)]">{children}</div>
    </details>
  );
}

function getText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getText).join("");
  if (isValidElement<{ children?: React.ReactNode }>(node)) return getText(node.props.children);
  return "";
}

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

export function JavaFile({ name, purpose, children }: { name: string; purpose: string; children: React.ReactNode }) {
  const source = getText(children).trim();
  return (
    <section className="java-file my-6 overflow-hidden rounded-xl border border-[#293442]">
      <div className="flex items-start justify-between gap-4 bg-[#202a36] px-4 py-3 text-white"><div className="flex items-center gap-2"><Code2 className="size-4 text-[var(--accent)]" /><span className="font-mono text-xs font-bold">{name}</span></div><span className="max-w-[55%] text-right text-[10px] leading-4 text-white/60">{purpose}</span></div>
      <pre aria-label={`${name} Java source code`}><code className="language-java">{highlightJava(source).map((token, index) => <span key={`${index}-${token.text.slice(0, 8)}`} className={token.kind ? `java-token-${token.kind}` : undefined}>{token.text}</span>)}</code></pre>
    </section>
  );
}

export function ScenarioTrace({ steps }: { steps: string[] }) {
  return <ol className="my-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">{steps.map((step, index) => <li key={step} className="flex gap-3 border-b border-[var(--line)] p-4 last:border-0"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono text-[10px] font-bold text-white">{index}</span><span className="text-sm leading-6 text-[var(--muted)]">{step}</span></li>)}</ol>;
}
