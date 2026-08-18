"use client";

import { Check, ChevronLeft, RotateCcw, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const classCandidates = [
  { id: "gate", label: "EntranceGate", correct: false, feedback: "The confirmed scope gives a gate no identity, state, or rule. ParkingLot.park already represents entry." },
  { id: "spot", label: "ParkingSpot", correct: true, feedback: "A spot owns its type and changing occupant, so it protects compatibility and availability." },
  { id: "payment", label: "Payment", correct: false, feedback: "Pricing and payment are explicitly outside the first version." },
  { id: "vehicle", label: "Vehicle", correct: true, feedback: "Plate and vehicle type form one stable value used throughout a parking session." },
  { id: "lot", label: "ParkingLot", correct: true, feedback: "The lot coordinates entry, selection, tickets, and exit across all floors." },
  { id: "address", label: "Address", correct: false, feedback: "The requirements contain no location-based behavior or address state." },
  { id: "ticket", label: "ParkingTicket", correct: true, feedback: "A ticket is the stable receipt that connects an accepted entry to the exact spot released later." },
  { id: "floor", label: "ParkingFloor", correct: true, feedback: "A floor owns a meaningful group of spots and provides lookup within that group." },
] as const;

export function ParkingClassPicker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState("gate");
  const expected = classCandidates.filter((item) => item.correct).map((item) => item.id);
  const isCorrect = selected.length === expected.length && expected.every((id) => selected.includes(id));
  const reviewed = classCandidates.find((item) => item.id === reviewId)!;
  const reset = () => { setSelected([]); setChecked(false); setReviewId("gate"); };
  const check = () => { setReviewId(classCandidates.find((item) => selected.includes(item.id) !== item.correct)?.id ?? classCandidates[0].id); setChecked(true); };

  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
    <p className="text-xs leading-5 text-[var(--muted)]">Select every candidate that owns meaningful state, behavior, or a stable domain value in the confirmed scope.</p>
    <div className="mt-3 grid grid-cols-2 gap-2">{classCandidates.map((item) => checked ? <button key={item.id} type="button" aria-pressed={reviewId === item.id} onClick={() => setReviewId(item.id)} className={cn("flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 text-left text-[10px] font-extrabold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", reviewId === item.id && "ring-2 ring-[var(--ink)]")}><span>{item.label}</span><span className={cn("flex items-center gap-1", item.correct ? "text-[#24785f]" : "text-[#a23d2e]")}>{item.correct ? <Check className="size-3.5" /> : <X className="size-3.5" />}{item.correct ? "Class" : "Leave out"}</span></button> : <label key={item.id} className={cn("flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-[10px] font-extrabold", selected.includes(item.id) ? "border-[var(--ink)]" : "border-[var(--line)]")}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} className="size-4 accent-[var(--ink)]" />{item.label}</label>)}</div>
    {checked && <div className="mt-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2"><p className="text-[10px] font-extrabold">{reviewed.correct ? "Why keep it?" : "Why leave it out?"}</p><p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{reviewed.feedback}</p></div>}
    <div className="mt-3 flex items-center gap-3">{checked ? <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button> : <Button size="sm" disabled={selected.length === 0} onClick={check}>Check classes</Button>}<p aria-live="polite" className={cn("text-xs font-bold", checked && (isCorrect ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (isCorrect ? "The model keeps only useful classes." : "Review the marked candidates.")}</p></div>
  </section>;
}

const ownershipRules = [
  { id: "duplicate", label: "Reject a duplicate plate", owner: "ParkingLot", feedback: "ParkingLot owns the index of plates with active tickets." },
  { id: "fit", label: "Check whether a vehicle fits", owner: "ParkingSpot", feedback: "ParkingSpot knows its own type and can apply the compatibility rule." },
  { id: "rank", label: "Compare compatible candidates", owner: "Strategy", feedback: "The strategy owns only the replaceable selection ordering." },
  { id: "group", label: "Find a spot on one floor", owner: "ParkingFloor", feedback: "ParkingFloor owns the spots belonging to that numbered floor." },
  { id: "occupy", label: "Record the occupant", owner: "ParkingSpot", feedback: "Availability is the spot's mutable state, so the spot changes it." },
  { id: "ticket", label: "Create and index the ticket", owner: "ParkingLot", feedback: "ParkingLot coordinates the complete session and owns both ticket indexes." },
  { id: "release", label: "Release the recorded occupant", owner: "ParkingSpot", feedback: "The same object that owns occupation also restores availability." },
  { id: "exit", label: "Find the ticket for exit", owner: "ParkingLot", feedback: "ParkingLot owns activeTicketsById and validates the exit request." },
] as const;

export function ParkingOwnershipQuiz() {
  const owners = ["ParkingLot", "ParkingSpot", "ParkingFloor", "Strategy"];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState("duplicate");
  const reviewed = ownershipRules.find((item) => item.id === reviewId)!;
  const isCorrect = ownershipRules.every((item) => answers[item.id] === item.owner);
  const reset = () => { setAnswers({}); setChecked(false); setReviewId("duplicate"); };
  const check = () => { setReviewId(ownershipRules.find((item) => answers[item.id] !== item.owner)?.id ?? ownershipRules[0].id); setChecked(true); };
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-4">
    <div className="mb-2 rounded-lg border border-[#b8ddcf] bg-[var(--mint-soft)] px-3 py-2"><p className="text-[10px] font-extrabold">Give each rule to the class that has the information needed to check it.</p><p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">Selection chooses a candidate; the state owner performs the mutation.</p></div>
    <div className="grid grid-cols-2 gap-1.5">{ownershipRules.map((item) => checked ? <button key={item.id} type="button" onClick={() => setReviewId(item.id)} className={cn("flex items-center justify-between gap-2 rounded-lg border bg-white px-2.5 py-1.5 text-left text-[9px] font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", reviewId === item.id && "ring-2 ring-[var(--ink)]")}><span>{item.label}</span><span className={answers[item.id] === item.owner ? "text-[#24785f]" : "text-[#a23d2e]"}>{answers[item.id] === item.owner ? <Check className="size-3.5" /> : <X className="size-3.5" />}</span></button> : <div key={item.id} className="rounded-lg border border-[var(--line)] bg-white px-2 py-1"><p className="text-[9px] font-extrabold leading-3">{item.label}</p><div className="mt-1 grid grid-cols-2 gap-1">{owners.map((owner) => <button key={owner} type="button" aria-pressed={answers[item.id] === owner} onClick={() => setAnswers((current) => ({ ...current, [item.id]: owner }))} className={cn("rounded px-1 py-0.5 text-[7px] font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", answers[item.id] === owner ? "bg-[var(--ink)] text-white" : "bg-[var(--paper-2)] text-[var(--muted)]")}>{owner}</button>)}</div></div>)}</div>
    {checked && <div className="mt-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2"><p className="text-[10px] font-extrabold">Why {reviewed.owner}?</p><p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{reviewed.feedback}</p></div>}
    <div className="mt-2 flex items-center gap-3">{checked ? <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button> : <Button size="sm" disabled={Object.keys(answers).length !== ownershipRules.length} onClick={check}>Check owners</Button>}<p aria-live="polite" className={cn("text-xs font-bold", checked && (isCorrect ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (isCorrect ? "Every rule has its information owner." : "Tap a row to review its owner.")}</p></div>
  </section>;
}

const flowItems = [
  { id: "request", label: "Vehicle requests entry" },
  { id: "duplicate", label: "ParkingLot checks duplicate entry" },
  { id: "search", label: "Strategy searches compatible free spots" },
  { id: "report", label: "Strategy reports a floor and spot" },
  { id: "occupy", label: "ParkingSpot validates and records the vehicle" },
  { id: "ticket", label: "ParkingLot creates and indexes the ticket" },
] as const;
const flowDisplay = ["occupy", "request", "ticket", "search", "duplicate", "report"];

export function ParkingEntryFlow() {
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [diagram, setDiagram] = useState(false);
  const correct = flowItems.map((item) => item.id);
  const correctCount = correct.filter((id, index) => order[index] === id).length;
  const isCorrect = correctCount === correct.length;
  const remaining = flowDisplay.map((id) => flowItems.find((item) => item.id === id)!).filter((item) => !order.includes(item.id));
  const reset = () => { setOrder([]); setChecked(false); setDiagram(false); };
  return <section className="flex h-full min-h-0 flex-col rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-4">
    {!diagram ? <div className="min-h-0 flex-1"><p className="text-xs leading-5 text-[var(--muted)]">Tap the actions in execution order. Tap a chosen row to remove it and rearrange.</p><div className="mt-2 flex flex-wrap gap-1.5">{remaining.map((item) => <button key={item.id} type="button" onClick={() => { setOrder((current) => [...current, item.id]); setChecked(false); }} className="rounded-lg border border-[var(--line)] bg-white px-2 py-1.5 text-[9px] font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]">{item.label}</button>)}</div><ol className="mt-2 grid grid-cols-2 gap-1.5">{order.map((id, index) => { const item = flowItems.find((candidate) => candidate.id === id)!; const right = correct[index] === id; return <li key={id}><button type="button" aria-label={`${checked ? right ? "Correct. " : "Incorrect. " : ""}Remove step ${index + 1}: ${item.label}`} onClick={() => { setOrder((current) => current.filter((value) => value !== id)); setChecked(false); }} className={cn("flex h-full w-full items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[9px] font-bold leading-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]", !checked && "border-transparent bg-white", checked && right && "border-[#8bcab3] bg-[var(--mint-soft)] text-[#24785f]", checked && !right && "border-[#efaaa0] bg-[#fff0ed] text-[#a23d2e]")}><span className={cn("grid size-4 shrink-0 place-items-center rounded-full text-[8px]", !checked && "bg-[var(--ink)] text-white", checked && right && "bg-[#24785f] text-white", checked && !right && "bg-[#a23d2e] text-white")}>{checked ? right ? <Check className="size-3" /> : <X className="size-3" /> : index + 1}</span>{item.label}</button></li>; })}</ol>{checked && <p aria-live="polite" className={cn("mt-2 text-xs font-extrabold", isCorrect ? "text-[#24785f]" : "text-[#a23d2e]")}>{correctCount} of 6 positions correct</p>}</div> : <div className="flex min-h-0 flex-1 flex-col"><div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-white"><Image src="/images/parking-lot-entity-flow.png" alt="Vehicle enters ParkingLot, which checks duplicates, asks the strategy to select a spot, occupies the spot, and returns a ticket" width={1774} height={887} className="h-full w-full object-contain" unoptimized /></div><ol className="mt-2 grid shrink-0 grid-cols-2 gap-1 text-[8px] font-bold leading-4">{flowItems.map((item, index) => <li key={item.id} className="rounded-md bg-white px-2 py-1"><span className="mr-1 text-[var(--accent-dark)]">{index + 1}.</span>{item.label}</li>)}</ol></div>}
    <div className="mt-2 flex shrink-0 flex-wrap items-center gap-2">{!diagram && <Button size="sm" disabled={order.length !== 6} onClick={() => setChecked(true)}>{checked ? "Check again" : "Check flow"}</Button>}{checked && !diagram && <Button size="sm" variant="outline" onClick={() => setDiagram(true)}>{isCorrect ? "See final diagram" : "Reveal solution"}</Button>}{!diagram && order.length > 0 && <Button size="sm" variant="ghost" onClick={reset}><RotateCcw /> Start over</Button>}{diagram && <Button size="sm" variant="outline" onClick={() => setDiagram(false)}><ChevronLeft /> Back to my flow</Button>}</div>
  </section>;
}

const blueprintTabs = [
  { id: "values", label: "Values", image: "/images/parking-lot-values-class.png", alt: "Sketch UML diagram of Parking Lot immutable value records", diagram: "Vehicle, Ticket, Selection, and Result carry stable facts between state-owning objects.", principle: "Immutability gives these values safe construction and value equality." },
  { id: "spot", label: "Spot", image: "/images/parking-lot-spot-class.png", alt: "Sketch UML diagram of ParkingSpot", diagram: "ParkingSpot keeps type and occupant together with every availability-changing operation.", principle: "Encapsulation prevents callers from occupying or releasing a spot without its checks." },
  { id: "floor", label: "Floor", image: "/images/parking-lot-floor-class.png", alt: "Sketch UML diagram of ParkingFloor", diagram: "ParkingFloor owns one numbered, read-only group and local lookup.", principle: "Cohesion keeps grouping rules here without taking over cross-floor selection." },
  { id: "lot", label: "Lot", image: "/images/parking-lot-system-class.png", alt: "Sketch UML diagram of ParkingLot", diagram: "ParkingLot composes floors and a strategy, then owns ticket indexes and workflow order.", principle: "Single responsibility separates session coordination from availability and ranking." },
  { id: "strategy", label: "Strategy", image: "/images/parking-lot-strategy-class.png", alt: "Sketch UML diagram of SpotAssignmentStrategy and its nearest implementation", diagram: "The interface selects one candidate; it never occupies a spot or creates a ticket.", principle: "Loose coupling and open-closed design localize a replaceable ranking policy." },
] as const;

export function ParkingClassBlueprint() {
  return <section className="flex h-full min-h-0 flex-col rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3"><Tabs defaultValue="values" className="flex min-h-0 flex-1 flex-col"><div className="overflow-x-auto"><TabsList className="grid min-w-max grid-flow-col">{blueprintTabs.map((tab) => <TabsTrigger key={tab.id} value={tab.id} className="px-3 py-1.5 text-[10px]">{tab.label}</TabsTrigger>)}</TabsList></div>{blueprintTabs.map((tab) => <TabsContent key={tab.id} value={tab.id} className="mt-2 min-h-0 flex-1"><article className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-[var(--line)] bg-white"><div className="flex min-h-0 items-center justify-center overflow-hidden bg-[#fbf7ef] p-1"><Image src={tab.image} alt={tab.alt} width={1536} height={1024} className="h-full w-full object-contain" unoptimized /></div><div className="grid gap-1 border-t border-[var(--line)] px-3 py-2 sm:grid-cols-2"><p className="text-[9px] leading-4 text-[var(--muted)]"><strong>Read it: </strong>{tab.diagram}</p><p className="text-[9px] leading-4 text-[var(--muted)]"><strong className="text-[var(--accent-dark)]">Principle: </strong>{tab.principle}</p></div></article></TabsContent>)}</Tabs></section>;
}

export function ParkingImplementationMap() {
  return <section className="grid gap-2"><div className="grid grid-cols-3 gap-2">{[["Values","Carry facts"],["Spot + Floor","Own resources"],["Lot + Strategy","Coordinate + select"]].map(([title, body]) => <div key={title} className="rounded-lg border border-[var(--line)] bg-[var(--paper-2)] p-3"><p className="text-[10px] font-extrabold">{title}</p><p className="mt-1 text-[9px] leading-4 text-[var(--muted)]">{body}</p></div>)}</div><ol className="grid grid-cols-2 gap-2">{[["1","Lot checks","Duplicate plate"],["2","Strategy selects","Compatible nearest spot"],["3","Spot changes","Occupant recorded"],["4","Lot commits","Ticket and indexes"]].map(([number,title,body]) => <li key={number} className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono text-[10px] font-bold text-white">{number}</span><span><strong className="block text-[10px]">{title}</strong><span className="block text-[9px] leading-4 text-[var(--muted)]">{body}</span></span></li>)}</ol></section>;
}

export function ParkingStateProof() {
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5"><Tabs defaultValue="duplicate"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="duplicate" className="text-[9px]">Duplicate</TabsTrigger><TabsTrigger value="full" className="text-[9px]">No spot</TabsTrigger><TabsTrigger value="ticket" className="text-[9px]">Bad ticket</TabsTrigger></TabsList><TabsContent value="duplicate" className="mt-2 rounded-lg bg-white p-3 text-[10px] leading-5"><strong>Check:</strong> plate index. <strong>Result:</strong> ALREADY_PARKED. <strong>Unchanged:</strong> spots, tickets, sequence, and current assignment.</TabsContent><TabsContent value="full" className="mt-2 rounded-lg bg-white p-3 text-[10px] leading-5"><strong>Check:</strong> strategy returns empty. <strong>Result:</strong> NO_COMPATIBLE_SPOT. <strong>Unchanged:</strong> every occupant and both ticket indexes.</TabsContent><TabsContent value="ticket" className="mt-2 rounded-lg bg-white p-3 text-[10px] leading-5"><strong>Check:</strong> ticket ID is absent. <strong>Result:</strong> TICKET_NOT_FOUND. <strong>Unchanged:</strong> the parked vehicle, spot, and active sessions.</TabsContent></Tabs><p className="mt-3 rounded-lg bg-[var(--mint-soft)] px-3 py-2 text-[10px] font-bold leading-4">An expected rejection returns before the first mutation it could make unsafe.</p></section>;
}
