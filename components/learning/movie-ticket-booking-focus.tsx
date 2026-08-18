"use client";

import Image from "next/image";
import { Check, ChevronLeft, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const ownershipRules = [
  { id: "transition", label: "Change one seat's state", owner: "ShowSeat", feedback: "ShowSeat owns its state and the hold details required for a legal transition." },
  { id: "group", label: "Reject a partly available group", owner: "Show", feedback: "Show sees the complete requested group and can validate it before changing any seat." },
  { id: "expiry", label: "Release expired seats", owner: "Show", feedback: "Show performs cleanup while holding the same lock that protects confirmation and new holds." },
  { id: "lock", label: "Protect concurrent seat changes", owner: "Show", feedback: "The lock belongs to the screening whose ShowSeat objects it protects." },
  { id: "lookup", label: "Find a show from its ID", owner: "BookingService", feedback: "BookingService owns the show index used by the public workflow." },
  { id: "ids", label: "Create hold and booking IDs", owner: "BookingService", feedback: "IDs coordinate accepted results across shows, not one seat's lifecycle." },
  { id: "hold-index", label: "Remember accepted holds", owner: "BookingService", feedback: "The service must find a hold later when the caller confirms it." },
  { id: "owner", label: "Check who may confirm", owner: "BookingService", feedback: "The service finds the SeatHold and compares its userId before delegating to Show." },
  { id: "receipt", label: "Record a completed booking", owner: "BookingService", feedback: "Only after Show reports BOOKED does the service create and index the receipt." },
] as const;

export function MovieOwnershipQuiz() {
  const owners = ["ShowSeat", "Show", "BookingService"];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState<string>(ownershipRules[0].id);
  const reviewed = ownershipRules.find((item) => item.id === reviewId)!;
  const correct = ownershipRules.every((item) => answers[item.id] === item.owner);
  const reset = () => { setAnswers({}); setChecked(false); setReviewId(ownershipRules[0].id); };
  const check = () => { setReviewId(ownershipRules.find((item) => answers[item.id] !== item.owner)?.id ?? ownershipRules[0].id); setChecked(true); };

  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3">
    <div className="mb-2 rounded-lg bg-[var(--mint-soft)] px-3 py-2 text-[10px] leading-4"><strong>Give the rule to the class that has the information needed to check it.</strong> The service coordinates; Show protects a group; ShowSeat protects one lifecycle.</div>
    <div className="grid grid-cols-2 gap-1.5">{ownershipRules.map((item) => checked ? <button key={item.id} type="button" onClick={() => setReviewId(item.id)} className={cn("flex min-h-9 items-center justify-between gap-1 rounded-lg border bg-white px-2 py-1 text-left text-[8px] font-bold focus-visible:ring-4 focus-visible:ring-[var(--focus)]", reviewId === item.id && "ring-2 ring-[var(--ink)]")}><span>{item.label}</span>{answers[item.id] === item.owner ? <Check aria-label="Correct" className="size-3.5 shrink-0 text-[#24785f]" /> : <X aria-label="Incorrect" className="size-3.5 shrink-0 text-[#a23d2e]" />}</button> : <div key={item.id} className="rounded-lg border bg-white px-2 py-1"><p className="text-[8px] font-extrabold leading-3">{item.label}</p><div className="mt-1 grid grid-cols-3 gap-1">{owners.map((owner) => <button key={owner} type="button" aria-pressed={answers[item.id] === owner} onClick={() => setAnswers((value) => ({ ...value, [item.id]: owner }))} className={cn("rounded px-1 py-1 text-[7px] font-bold focus-visible:ring-4 focus-visible:ring-[var(--focus)]", answers[item.id] === owner ? "bg-[var(--ink)] text-white" : "bg-[var(--paper-2)] text-[var(--muted)]")}>{owner}</button>)}</div></div>)}</div>
    {checked && <div className="mt-2 rounded-lg border bg-white px-3 py-2"><p className="text-[9px] font-extrabold">Why {reviewed.owner}?</p><p className="mt-1 text-[9px] leading-4 text-[var(--muted)]">{reviewed.feedback}</p></div>}
    <div className="mt-2 flex items-center gap-3">{checked ? <Button size="sm" variant="ghost" onClick={reset}><RotateCcw /> Try again</Button> : <Button size="sm" disabled={Object.keys(answers).length !== ownershipRules.length} onClick={check}>Check owners</Button>}<p aria-live="polite" className={cn("text-[10px] font-bold", checked && (correct ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (correct ? "Every rule has the right information owner." : "Tap a checked row to review its reason.")}</p></div>
  </section>;
}

const flowItems = [
  { id: "request", label: "User requests seats for one show" },
  { id: "find", label: "BookingService finds the Show" },
  { id: "lock", label: "Show acquires its lock" },
  { id: "validate", label: "Show validates the whole group" },
  { id: "hold", label: "ShowSeat objects move to HELD" },
  { id: "record", label: "BookingService records the SeatHold" },
] as const;
const scrambledFlow = ["hold", "request", "record", "validate", "find", "lock"];

export function MovieHoldFlow() {
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [solution, setSolution] = useState(false);
  const correctOrder = flowItems.map((item) => item.id);
  const correctCount = correctOrder.filter((id, index) => order[index] === id).length;
  const remaining = scrambledFlow.filter((id) => !order.includes(id)).map((id) => flowItems.find((item) => item.id === id)!);
  const reset = () => { setOrder([]); setChecked(false); setSolution(false); };

  return <section className="flex h-full min-h-0 flex-col rounded-xl border bg-[var(--paper-2)] p-3">
    {!solution ? <div className="min-h-0 flex-1"><p className="text-[10px] leading-4 text-[var(--muted)]">Choose the execution order. Tap a chosen row to remove it and rearrange.</p><div className="mt-2 flex flex-wrap gap-1">{remaining.map((item) => <button key={item.id} type="button" onClick={() => { setOrder((value) => [...value, item.id]); setChecked(false); }} className="rounded-lg border bg-white px-2 py-1.5 text-[8px] font-bold focus-visible:ring-4 focus-visible:ring-[var(--focus)]">{item.label}</button>)}</div><ol className="mt-2 grid grid-cols-2 gap-1.5">{order.map((id, index) => { const item = flowItems.find((candidate) => candidate.id === id)!; const right = correctOrder[index] === id; return <li key={id}><button type="button" aria-label={`${checked ? right ? "Correct. " : "Incorrect. " : ""}Remove step ${index + 1}: ${item.label}`} onClick={() => { setOrder((value) => value.filter((candidate) => candidate !== id)); setChecked(false); }} className={cn("flex h-full w-full items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[8px] font-bold leading-3", !checked && "border-transparent bg-white", checked && right && "border-[#8bcab3] bg-[var(--mint-soft)]", checked && !right && "border-[#efaaa0] bg-[#fff0ed]")}><span className={cn("grid size-4 shrink-0 place-items-center rounded-full text-[8px]", !checked && "bg-[var(--ink)] text-white", checked && right && "bg-[#24785f] text-white", checked && !right && "bg-[#a23d2e] text-white")}>{checked ? right ? <Check className="size-3" /> : <X className="size-3" /> : index + 1}</span>{item.label}</button></li>; })}</ol>{checked && <p aria-live="polite" className="mt-2 text-[10px] font-extrabold">{correctCount} of 6 positions correct</p>}</div> : <div className="flex min-h-0 flex-1 flex-col"><div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border bg-white"><Image src="/images/movie-ticket-booking-entity-flow.png" alt="BookingService asks a locked Show to validate and hold seats before recording a SeatHold" width={1774} height={887} className="h-full w-full object-contain" unoptimized /></div><ol className="mt-2 grid shrink-0 grid-cols-2 gap-1 text-[8px] font-bold leading-3">{flowItems.map((item, index) => <li key={item.id} className="rounded bg-white px-2 py-1"><span className="mr-1 text-[var(--accent-dark)]">{index + 1}.</span>{item.label}</li>)}</ol></div>}
    <div className="mt-2 flex shrink-0 flex-wrap gap-2">{!solution && <Button size="sm" disabled={order.length !== 6} onClick={() => setChecked(true)}>{checked ? "Check again" : "Check flow"}</Button>}{checked && !solution && <Button size="sm" variant="outline" onClick={() => setSolution(true)}>{correctCount === 6 ? "See final diagram" : "Reveal solution"}</Button>}{!solution && order.length > 0 && <Button size="sm" variant="ghost" onClick={reset}><RotateCcw /> Start over</Button>}{solution && <Button size="sm" variant="outline" onClick={() => setSolution(false)}><ChevronLeft /> Back to my flow</Button>}</div>
  </section>;
}

export function MovieStateMachine() {
  return <section className="grid h-full min-h-0 grid-rows-[auto_1fr_auto] gap-3 rounded-xl border bg-[var(--paper-2)] p-4"><p className="text-xs leading-5 text-[var(--muted)]">The state names prevent impossible shortcuts. Every arrow must come from a confirmed requirement.</p><div className="grid min-h-0 grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center"><div className="rounded-xl border-2 border-[#8bcab3] bg-[var(--mint-soft)] p-3 text-sm font-extrabold">AVAILABLE</div><span className="text-xl text-[var(--accent)]">→</span><div className="rounded-xl border-2 border-[#e1bb62] bg-[#fff4cc] p-3 text-sm font-extrabold">HELD</div><span className="text-xl text-[var(--accent)]">→</span><div className="rounded-xl border-2 border-[var(--ink)] bg-[var(--ink)] p-3 text-sm font-extrabold text-white">BOOKED</div></div><div className="grid gap-2 sm:grid-cols-2"><p className="rounded-lg bg-white px-3 py-2 text-[10px] leading-4"><strong>Expiry:</strong> HELD returns to AVAILABLE.</p><p className="rounded-lg bg-white px-3 py-2 text-[10px] leading-4"><strong>Not allowed:</strong> direct AVAILABLE → BOOKED or BOOKED → AVAILABLE.</p></div></section>;
}

const blueprintTabs = [
  { id: "values", label: "Values", image: "/images/movie-ticket-booking-values-class.png", alt: "Sketch UML of immutable movie booking values", reading: "Records carry accepted facts without exposing setters.", principle: "Immutability keeps hold and booking receipts stable." },
  { id: "physical", label: "Layout", image: "/images/movie-ticket-booking-physical-class.png", alt: "Sketch UML of Movie Seat and Screen", reading: "Screen owns permanent Seat values; no booking state lives here.", principle: "Single responsibility separates layout from each screening." },
  { id: "show-seat", label: "ShowSeat", image: "/images/movie-ticket-booking-show-seat-class.png", alt: "Sketch UML of ShowSeat and its state transitions", reading: "ShowSeat keeps one seat's state and transition data together.", principle: "Encapsulation blocks invalid direct state changes." },
  { id: "show", label: "Show", image: "/images/movie-ticket-booking-show-class.png", alt: "Sketch UML of Show and its protected ShowSeat collection", reading: "Show composes per-screening seats and protects group changes with one lock.", principle: "Thread safety makes the group operation atomic inside one process." },
  { id: "service", label: "Service", image: "/images/movie-ticket-booking-service-class.png", alt: "Sketch UML of BookingService delegating to Show", reading: "BookingService coordinates lookup, IDs, holds, and receipts; Show protects seats.", principle: "Composition keeps coordination separate from state ownership." },
] as const;

export function MovieClassBlueprint() {
  return <section className="flex h-full min-h-0 flex-col rounded-xl border bg-[var(--paper-2)] p-3"><Tabs defaultValue="values" className="flex min-h-0 flex-1 flex-col"><div className="overflow-x-auto"><TabsList className="grid min-w-max grid-flow-col">{blueprintTabs.map((tab) => <TabsTrigger key={tab.id} value={tab.id} className="px-3 py-1.5 text-[9px]">{tab.label}</TabsTrigger>)}</TabsList></div>{blueprintTabs.map((tab) => <TabsContent key={tab.id} value={tab.id} className="mt-2 min-h-0 flex-1"><article className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border bg-white"><div className="flex min-h-0 items-center justify-center overflow-hidden bg-[#fbf7ef] p-1"><Image src={tab.image} alt={tab.alt} width={1536} height={1024} className="h-full w-full object-contain" unoptimized /></div><div className="grid gap-1 border-t px-3 py-2 sm:grid-cols-2"><p className="text-[8px] leading-3 text-[var(--muted)]"><strong>Read it: </strong>{tab.reading}</p><p className="text-[8px] leading-3 text-[var(--muted)]"><strong className="text-[var(--accent-dark)]">Principle: </strong>{tab.principle}</p></div></article></TabsContent>)}</Tabs></section>;
}

export function MovieImplementationMap() {
  return <section className="grid gap-2"><div className="grid grid-cols-3 gap-2">{[["Values","Carry facts"],["ShowSeat + Show","Own and protect state"],["BookingService","Coordinate workflow"]].map(([title, body]) => <div key={title} className="rounded-lg border bg-[var(--paper-2)] p-3"><p className="text-[9px] font-extrabold">{title}</p><p className="mt-1 text-[8px] leading-3 text-[var(--muted)]">{body}</p></div>)}</div><ol className="grid grid-cols-2 gap-2">{[["1","Service finds","The requested Show"],["2","Show locks","One screening"],["3","Show validates","The entire seat group"],["4","Service records","The accepted SeatHold"]].map(([number,title,body]) => <li key={number} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono text-[9px] font-bold text-white">{number}</span><span><strong className="block text-[9px]">{title}</strong><span className="block text-[8px] leading-3 text-[var(--muted)]">{body}</span></span></li>)}</ol></section>;
}
