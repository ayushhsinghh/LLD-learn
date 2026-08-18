"use client";

import Image from "next/image";
import { Check, ChevronLeft, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const ownershipRules = [
  { id: "validate", label: "Validate immutable request content", owner: "Request", reason: "NotificationRequest owns the submitted values and rejects incomplete construction." },
  { id: "provider", label: "Call one delivery provider", owner: "Sender", reason: "A channel sender owns only its provider-specific delivery operation." },
  { id: "attempt", label: "Count attempts and publish status", owner: "Job", reason: "DeliveryJob owns the changing state queried by callers." },
  { id: "retry", label: "Decide whether another attempt is allowed", owner: "Policy", reason: "RetryPolicy owns the configured attempt boundary." },
  { id: "route", label: "Select a sender by channel", owner: "Service", reason: "NotificationService owns the sender registry and coordinates the workflow." },
  { id: "queue", label: "Submit background work", owner: "Service", reason: "The service creates the job before handing its worker task to the executor." },
] as const;

export function NotificationOwnershipQuiz() {
  const owners = ["Request", "Sender", "Job", "Policy", "Service"];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [review, setReview] = useState<string>(ownershipRules[0].id);
  const active = ownershipRules.find((item) => item.id === review)!;
  const correct = ownershipRules.every((item) => answers[item.id] === item.owner);
  return <section className="rounded-xl border bg-[var(--paper-2)] p-3">
    <p className="mb-2 rounded-lg bg-[var(--mint-soft)] px-3 py-2 text-[10px] leading-4"><strong>Give each rule to the type that owns the information needed to enforce it.</strong></p>
    <div className="grid grid-cols-2 gap-1.5">{ownershipRules.map((item) => checked ? <button key={item.id} type="button" onClick={() => setReview(item.id)} className={cn("flex min-h-10 items-center justify-between gap-2 rounded-lg border bg-white px-2 py-1.5 text-left text-[8px] font-bold", review === item.id && "ring-2 ring-[var(--ink)]")}><span>{item.label}</span>{answers[item.id] === item.owner ? <Check aria-label="Correct" className="size-3.5 text-[#24785f]" /> : <X aria-label="Incorrect" className="size-3.5 text-[#a23d2e]" />}</button> : <div key={item.id} className="rounded-lg border bg-white px-2 py-1.5"><p className="text-[8px] font-extrabold leading-3">{item.label}</p><div className="mt-1 flex flex-wrap gap-1">{owners.map((owner) => <button key={owner} type="button" aria-pressed={answers[item.id] === owner} onClick={() => setAnswers((value) => ({ ...value, [item.id]: owner }))} className={cn("rounded px-1.5 py-1 text-[7px] font-bold", answers[item.id] === owner ? "bg-[var(--ink)] text-white" : "bg-[var(--paper-2)] text-[var(--muted)]")}>{owner}</button>)}</div></div>)}</div>
    {checked && <div className="mt-2 rounded-lg border bg-white px-3 py-2"><p className="text-[9px] font-extrabold">Why {active.owner}?</p><p className="mt-1 text-[9px] leading-4 text-[var(--muted)]">{active.reason}</p></div>}
    <div className="mt-2 flex items-center gap-3">{checked ? <Button size="sm" variant="ghost" onClick={() => { setAnswers({}); setChecked(false); }}><RotateCcw /> Try again</Button> : <Button size="sm" disabled={Object.keys(answers).length !== ownershipRules.length} onClick={() => { setReview(ownershipRules.find((item) => answers[item.id] !== item.owner)?.id ?? ownershipRules[0].id); setChecked(true); }}>Check owners</Button>}<p aria-live="polite" className="text-[10px] font-bold">{checked && (correct ? "Every rule has the right owner." : "Tap a row to review its reason.")}</p></div>
  </section>;
}

const flow = [
  { id: "submit", label: "Caller submits a request" },
  { id: "validate", label: "Service validates request and channel" },
  { id: "job", label: "Service indexes a QUEUED job" },
  { id: "executor", label: "Service submits worker task" },
  { id: "sender", label: "Worker selects the channel sender" },
  { id: "attempt", label: "Worker sends and retries failures" },
  { id: "finish", label: "Job becomes SENT or FAILED" },
] as const;
const scrambled = ["attempt", "validate", "finish", "submit", "sender", "job", "executor"];

export function NotificationDeliveryFlow() {
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [solution, setSolution] = useState(false);
  const correct = flow.map((item) => item.id);
  const score = correct.filter((id, index) => order[index] === id).length;
  const remaining = scrambled.filter((id) => !order.includes(id)).map((id) => flow.find((item) => item.id === id)!);
  return <section className="flex h-full min-h-0 flex-col rounded-xl border bg-[var(--paper-2)] p-3">
    {!solution ? <div className="min-h-0 flex-1"><p className="text-[10px] leading-4 text-[var(--muted)]">Build the path. Tap a chosen row to remove and rearrange it.</p><div className="mt-2 flex flex-wrap gap-1">{remaining.map((item) => <button key={item.id} type="button" onClick={() => { setOrder((value) => [...value, item.id]); setChecked(false); }} className="rounded-lg border bg-white px-2 py-1.5 text-[8px] font-bold">{item.label}</button>)}</div><ol className="mt-2 grid grid-cols-2 gap-1.5">{order.map((id, index) => { const item = flow.find((candidate) => candidate.id === id)!; const right = correct[index] === id; return <li key={id}><button type="button" onClick={() => { setOrder((value) => value.filter((entry) => entry !== id)); setChecked(false); }} className={cn("flex h-full w-full items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[8px] font-bold", !checked && "border-transparent bg-white", checked && right && "border-[#8bcab3] bg-[var(--mint-soft)]", checked && !right && "border-[#efaaa0] bg-[#fff0ed]")}><span className={cn("grid size-4 shrink-0 place-items-center rounded-full text-[8px] text-white", checked ? right ? "bg-[#24785f]" : "bg-[#a23d2e]" : "bg-[var(--ink)]")}>{checked ? right ? <Check className="size-3" /> : <X className="size-3" /> : index + 1}</span>{item.label}</button></li>; })}</ol>{checked && <p aria-live="polite" className="mt-2 text-[10px] font-extrabold">{score} of 7 positions correct</p>}</div> : <div className="flex min-h-0 flex-1 flex-col"><div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border bg-white"><Image src="/images/notification-system-entity-flow.png" alt="Caller submits to NotificationService, which indexes a job and uses a thread pool and channel sender" width={1693} height={929} className="h-full w-full object-contain" unoptimized /></div><ol className="mt-2 grid shrink-0 grid-cols-2 gap-1 text-[8px] font-bold leading-3">{flow.map((item, index) => <li key={item.id} className="rounded bg-white px-2 py-1"><span className="mr-1 text-[var(--accent-dark)]">{index + 1}.</span>{item.label}</li>)}</ol></div>}
    <div className="mt-2 flex shrink-0 flex-wrap gap-2">{!solution && <Button size="sm" disabled={order.length !== flow.length} onClick={() => setChecked(true)}>{checked ? "Check again" : "Check flow"}</Button>}{checked && !solution && <Button size="sm" variant="outline" onClick={() => setSolution(true)}>{score === flow.length ? "See final diagram" : "Reveal solution"}</Button>}{order.length > 0 && !solution && <Button size="sm" variant="ghost" onClick={() => { setOrder([]); setChecked(false); }}><RotateCcw /> Start over</Button>}{solution && <Button size="sm" variant="outline" onClick={() => setSolution(false)}><ChevronLeft /> Back to my flow</Button>}</div>
  </section>;
}

export function NotificationJobStateMachine() {
  return <section className="grid h-full min-h-0 grid-rows-[auto_1fr_auto] gap-3 rounded-xl border bg-[var(--paper-2)] p-4"><p className="text-xs leading-5 text-[var(--muted)]">A state name tells callers what has happened without exposing the mutable job.</p><div className="grid min-h-0 grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center"><div className="rounded-xl border-2 bg-white p-3 text-sm font-extrabold">QUEUED</div><span className="text-xl text-[var(--accent)]">→</span><div className="rounded-xl border-2 border-[#e1bb62] bg-[#fff4cc] p-3 text-sm font-extrabold">SENDING</div><span className="text-xl text-[var(--accent)]">→</span><div className="grid gap-2"><div className="rounded-xl border-2 border-[#8bcab3] bg-[var(--mint-soft)] p-2 text-xs font-extrabold">SENT</div><div className="rounded-xl border-2 border-[#efaaa0] bg-[#fff0ed] p-2 text-xs font-extrabold">FAILED</div></div></div><div className="grid gap-2 sm:grid-cols-2"><p className="rounded-lg bg-white px-3 py-2 text-[10px] leading-4"><strong>Retry:</strong> SENDING starts another attempt until the third failure.</p><p className="rounded-lg bg-white px-3 py-2 text-[10px] leading-4"><strong>Terminal:</strong> SENT and FAILED never transition again.</p></div></section>;
}

const blueprints = [
  { id: "values", label: "Values", image: "/images/notification-system-values-class.png", alt: "Sketch UML of notification immutable values", reading: "Requests, receipts, snapshots, and retry limits cross boundaries as stable values.", principle: "Immutability prevents queued content from changing." },
  { id: "job", label: "Job", image: "/images/notification-system-job-class.png", alt: "Sketch UML of DeliveryJob", reading: "DeliveryJob keeps one job's mutable status behind synchronized methods.", principle: "Encapsulation and thread safety protect legal transitions." },
  { id: "senders", label: "Senders", image: "/images/notification-system-senders-class.png", alt: "Sketch UML of NotificationSender implementations", reading: "Each sender implements the same small channel contract.", principle: "Dependency inversion lets the service depend on an interface." },
  { id: "service", label: "Service", image: "/images/notification-system-service-class.png", alt: "Sketch UML of NotificationService", reading: "The service composes jobs, policy, senders, and executor to coordinate delivery.", principle: "Single responsibility keeps provider code outside the workflow." },
  { id: "whole", label: "Whole flow", image: "/images/notification-system-blueprint.png", alt: "Sketch UML of the complete notification system", reading: "The caller receives an ID while a worker updates a private job in the background.", principle: "Composition creates replaceable boundaries without inheritance." },
] as const;

export function NotificationClassBlueprint() {
  return <section className="flex h-full min-h-0 flex-col rounded-xl border bg-[var(--paper-2)] p-3"><Tabs defaultValue="values" className="flex min-h-0 flex-1 flex-col"><div className="overflow-x-auto"><TabsList className="grid min-w-max grid-flow-col">{blueprints.map((tab) => <TabsTrigger key={tab.id} value={tab.id} className="px-3 py-1.5 text-[9px]">{tab.label}</TabsTrigger>)}</TabsList></div>{blueprints.map((tab) => <TabsContent key={tab.id} value={tab.id} className="mt-2 min-h-0 flex-1"><article className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border bg-white"><div className="flex min-h-0 items-center justify-center overflow-hidden bg-[#fbf7ef] p-1"><Image src={tab.image} alt={tab.alt} width={1693} height={929} className="h-full w-full object-contain" unoptimized /></div><div className="grid gap-1 border-t px-3 py-2 sm:grid-cols-2"><p className="text-[8px] leading-3 text-[var(--muted)]"><strong>Read it: </strong>{tab.reading}</p><p className="text-[8px] leading-3 text-[var(--muted)]"><strong className="text-[var(--accent-dark)]">Principle: </strong>{tab.principle}</p></div></article></TabsContent>)}</Tabs></section>;
}

export function NotificationImplementationMap() {
  return <section className="grid gap-2"><div className="grid grid-cols-4 gap-2">{[["Values","Carry stable facts"],["Job","Own live status"],["Sender","Deliver one channel"],["Service","Coordinate async work"]].map(([title, body]) => <div key={title} className="rounded-lg border bg-[var(--paper-2)] p-2.5"><p className="text-[9px] font-extrabold">{title}</p><p className="mt-1 text-[8px] leading-3 text-[var(--muted)]">{body}</p></div>)}</div><ol className="grid grid-cols-2 gap-2">{[["1","Submit","Create and index QUEUED job"],["2","Schedule","Executor accepts one task"],["3","Attempt","Sender either succeeds or throws"],["4","Publish","Job snapshot reports final state"]].map(([number, title, body]) => <li key={number} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono text-[9px] font-bold text-white">{number}</span><span><strong className="block text-[9px]">{title}</strong><span className="block text-[8px] leading-3 text-[var(--muted)]">{body}</span></span></li>)}</ol></section>;
}
