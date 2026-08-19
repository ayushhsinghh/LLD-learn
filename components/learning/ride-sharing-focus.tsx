"use client";

import { Check, ChevronLeft, RotateCcw, StepForward, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const classCandidates = [
  { id: "map", label: "MapDisplay", correct: false, feedback: "Drawing a map is outside the confirmed workflow." },
  { id: "driver", label: "Driver", correct: true, feedback: "Driver owns changing availability and current location." },
  { id: "payment", label: "Payment", correct: false, feedback: "No fare or payment rule exists in this version." },
  { id: "graph", label: "RoadGraph", correct: true, feedback: "RoadGraph owns locations and directed adjacency lists." },
  { id: "ride", label: "Ride", correct: true, feedback: "Ride owns accepted trip facts and guarded lifecycle state." },
  { id: "vehicle", label: "Vehicle", correct: false, feedback: "Vehicle details do not affect matching in the confirmed scope." },
  { id: "service", label: "RideService", correct: true, feedback: "RideService coordinates validation, routing, matching, IDs, and lifecycle actions." },
  { id: "gps", label: "GpsTracker", correct: false, feedback: "Live GPS and map matching are explicitly excluded." },
] as const;

export function RideClassPicker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState("map");
  const expected = classCandidates.filter((item) => item.correct).map((item) => item.id);
  const correct = selected.length === expected.length && expected.every((id) => selected.includes(id));
  const review = classCandidates.find((item) => item.id === reviewId)!;
  const reset = () => { setSelected([]); setChecked(false); setReviewId("map"); };
  const check = () => { setReviewId(classCandidates.find((item) => selected.includes(item.id) !== item.correct)?.id ?? classCandidates[0].id); setChecked(true); };
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5">
    <p className="text-xs leading-5 text-[var(--muted)]">Select the candidates that own changing state and enforce rules.</p>
    <div className="mt-3 grid grid-cols-2 gap-2">{classCandidates.map((item) => checked ? <button key={item.id} type="button" onClick={() => setReviewId(item.id)} aria-pressed={reviewId === item.id} className={cn("flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 text-left text-[10px] font-extrabold focus-visible:ring-4 focus-visible:ring-[var(--focus)]", reviewId === item.id && "ring-2 ring-[var(--ink)]")}><span>{item.label}</span><span className={item.correct ? "text-[#24785f]" : "text-[#a23d2e]"}>{item.correct ? <Check className="size-3.5" /> : <X className="size-3.5" />}</span></button> : <label key={item.id} className={cn("flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-[10px] font-extrabold", selected.includes(item.id) ? "border-[var(--ink)]" : "border-[var(--line)]")}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} className="size-4 accent-[var(--ink)]" />{item.label}</label>)}</div>
    {checked && <div className="mt-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2"><p className="text-[10px] font-extrabold">{review.correct ? "Why keep it?" : "Why leave it out?"}</p><p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{review.feedback}</p></div>}
    <div className="mt-3 flex items-center gap-3">{checked ? <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button> : <Button size="sm" disabled={selected.length === 0} onClick={check}>Check classes</Button>}<p aria-live="polite" className={cn("text-xs font-bold", checked && (correct ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (correct ? "Only the useful state owners remain." : "Tap a marked row to review it.")}</p></div>
  </section>;
}

const ownership = [
  { id: "roads", label: "Store outgoing roads", owner: "RoadGraph", feedback: "RoadGraph owns the adjacency lists used by every route search." },
  { id: "path", label: "Find one cheapest path", owner: "Routing", feedback: "RoutingStrategy owns the replaceable graph algorithm." },
  { id: "winner", label: "Choose the winning driver", owner: "Matching", feedback: "DriverMatchingStrategy compares eligible pickup routes." },
  { id: "availability", label: "Change driver availability", owner: "Driver", feedback: "Driver owns status and current location." },
  { id: "transition", label: "Guard ride transitions", owner: "Ride", feedback: "Ride owns MATCHED, IN_PROGRESS, and COMPLETED." },
  { id: "workflow", label: "Validate and create the ride", owner: "Service", feedback: "RideService coordinates the complete request and commits accepted state." },
] as const;

export function RideOwnershipQuiz() {
  const owners = ["RoadGraph", "Routing", "Matching", "Driver", "Ride", "Service"];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [reviewId, setReviewId] = useState("roads");
  const review = ownership.find((item) => item.id === reviewId)!;
  const allCorrect = ownership.every((item) => answers[item.id] === item.owner);
  const reset = () => { setAnswers({}); setChecked(false); setReviewId("roads"); };
  const check = () => { setReviewId(ownership.find((item) => answers[item.id] !== item.owner)?.id ?? ownership[0].id); setChecked(true); };
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3">
    <div className="mb-2 rounded-lg border border-[#b8ddcf] bg-[var(--mint-soft)] px-3 py-2 text-[10px] leading-4"><strong>Give each rule to the object with the information needed to check it.</strong></div>
    <div className="grid grid-cols-2 gap-1.5">{ownership.map((item) => checked ? <button key={item.id} type="button" onClick={() => setReviewId(item.id)} className={cn("flex items-center justify-between gap-2 rounded-lg border bg-white px-2.5 py-2 text-left text-[9px] font-bold focus-visible:ring-4 focus-visible:ring-[var(--focus)]", reviewId === item.id && "ring-2 ring-[var(--ink)]")}><span>{item.label}</span>{answers[item.id] === item.owner ? <Check className="size-3.5 text-[#24785f]" /> : <X className="size-3.5 text-[#a23d2e]" />}</button> : <div key={item.id} className="rounded-lg border border-[var(--line)] bg-white p-2"><p className="text-[9px] font-extrabold">{item.label}</p><div className="mt-1 flex flex-wrap gap-1">{owners.map((owner) => <button key={owner} type="button" aria-pressed={answers[item.id] === owner} onClick={() => setAnswers((current) => ({ ...current, [item.id]: owner }))} className={cn("rounded px-1.5 py-1 text-[7px] font-bold", answers[item.id] === owner ? "bg-[var(--ink)] text-white" : "bg-[var(--paper-2)] text-[var(--muted)]")}>{owner}</button>)}</div></div>)}</div>
    {checked && <div className="mt-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2"><p className="text-[10px] font-extrabold">Why {review.owner}?</p><p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{review.feedback}</p></div>}
    <div className="mt-2 flex items-center gap-3">{checked ? <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Try again</Button> : <Button size="sm" disabled={Object.keys(answers).length !== ownership.length} onClick={check}>Check owners</Button>}<p className={cn("text-xs font-bold", checked && (allCorrect ? "text-[#24785f]" : "text-[#a23d2e]"))}>{checked && (allCorrect ? "Every rule has its owner." : "Tap a row to review why.")}</p></div>
  </section>;
}

const flow = [
  { id: "request", label: "Rider submits a request" },
  { id: "validate", label: "Service validates rider and locations" },
  { id: "trip", label: "Routing proves the trip is possible" },
  { id: "candidates", label: "Matcher evaluates available drivers" },
  { id: "pickup", label: "Routing calculates each pickup route" },
  { id: "winner", label: "Matcher returns the winning driver" },
  { id: "commit", label: "Service creates Ride and marks Driver busy" },
] as const;
const scrambledFlow = ["pickup", "request", "commit", "trip", "winner", "validate", "candidates"];

export function RideRequestFlow() {
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [diagram, setDiagram] = useState(false);
  const correctOrder = flow.map((item) => item.id);
  const score = correctOrder.filter((id, index) => order[index] === id).length;
  const correct = score === flow.length;
  const available = scrambledFlow.filter((id) => !order.includes(id));
  const reset = () => { setOrder([]); setChecked(false); setDiagram(false); };
  return <section className="flex h-full min-h-0 flex-col rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3">
    {!diagram ? <div className="min-h-0 flex-1"><p className="text-xs leading-5 text-[var(--muted)]">Tap each action in execution order. Chosen rows remain editable after checking.</p><div className="mt-2 flex flex-wrap gap-1.5">{available.map((id) => { const item = flow.find((candidate) => candidate.id === id)!; return <button key={id} type="button" onClick={() => { setOrder((current) => [...current, id]); setChecked(false); }} className="rounded-lg border border-[var(--line)] bg-white px-2 py-1.5 text-[9px] font-bold">{item.label}</button>; })}</div><ol className="mt-2 grid grid-cols-2 gap-1.5">{order.map((id, index) => { const item = flow.find((candidate) => candidate.id === id)!; const right = id === correctOrder[index]; return <li key={id}><button type="button" onClick={() => { setOrder((current) => current.filter((value) => value !== id)); setChecked(false); }} aria-label={`${checked ? right ? "Correct. " : "Incorrect. " : ""}Remove ${item.label}`} className={cn("flex h-full w-full items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[9px] font-bold", !checked && "border-transparent bg-white", checked && right && "border-[#8bcab3] bg-[var(--mint-soft)]", checked && !right && "border-[#efaaa0] bg-[#fff0ed]")}><span className={cn("grid size-4 shrink-0 place-items-center rounded-full text-white", !checked ? "bg-[var(--ink)]" : right ? "bg-[#24785f]" : "bg-[#a23d2e]")}>{checked ? right ? <Check className="size-3" /> : <X className="size-3" /> : index + 1}</span>{item.label}</button></li>; })}</ol>{checked && <p aria-live="polite" className={cn("mt-2 text-xs font-extrabold", correct ? "text-[#24785f]" : "text-[#a23d2e]")}>{score} of 7 positions correct</p>}</div> : <div className="flex min-h-0 flex-1 flex-col"><div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-white"><Image src="/images/ride-sharing-entity-flow.png" alt="RideService uses routing and matching before creating a ride and assigning the driver" width={1692} height={930} className="h-full w-full object-contain" unoptimized /></div><ol className="mt-2 grid shrink-0 grid-cols-2 gap-1 text-[8px] font-bold leading-4">{flow.map((item, index) => <li key={item.id} className="rounded-md bg-white px-2 py-1"><span className="mr-1 text-[var(--accent-dark)]">{index + 1}.</span>{item.label}</li>)}</ol></div>}
    <div className="mt-2 flex shrink-0 flex-wrap gap-2">{!diagram && <Button size="sm" disabled={order.length !== flow.length} onClick={() => setChecked(true)}>{checked ? "Check again" : "Check flow"}</Button>}{checked && !diagram && <Button size="sm" variant="outline" onClick={() => setDiagram(true)}>{correct ? "See final diagram" : "Reveal solution"}</Button>}{!diagram && order.length > 0 && <Button size="sm" variant="ghost" onClick={reset}><RotateCcw /> Start over</Button>}{diagram && <Button size="sm" variant="outline" onClick={() => setDiagram(false)}><ChevronLeft /> Back to my flow</Button>}</div>
  </section>;
}

const trace = [
  { node: "Start", distances: "A 0 · B ∞ · C ∞ · D ∞", update: "Place A in the frontier with distance 0." },
  { node: "A", distances: "A 0 · B 4 · C 2 · D ∞", update: "Settle A. Discover C at 2 and B at 4." },
  { node: "C", distances: "A 0 · B 3 · C 2 · D 10", update: "Settle C. C→B improves B from 4 to 3; C→D gives 10." },
  { node: "B", distances: "A 0 · B 3 · C 2 · D 8", update: "Settle B. B→D improves D from 10 to 8." },
  { node: "D", distances: "A 0 · B 3 · C 2 · D 8", update: "Settle D. Rebuild D←B←C←A, then reverse it." },
] as const;

export function DijkstraLearningTrace() {
  const [index, setIndex] = useState(0);
  const step = trace[index];
  return <section className="grid h-full min-h-0 gap-2 sm:grid-cols-[1.1fr_.9fr]">
    <div className="relative overflow-hidden rounded-xl border border-[var(--line)] bg-[#fbf7ef] p-3"><svg viewBox="0 0 430 230" className="h-full w-full"><g stroke="#c8c1b6" strokeWidth="4"><line x1="60" y1="110" x2="190" y2="50"/><line x1="60" y1="110" x2="190" y2="175"/><line x1="190" y1="175" x2="190" y2="50"/><line x1="190" y1="50" x2="360" y2="110"/><line x1="190" y1="175" x2="360" y2="110"/></g>{[[125,70,"4"],[125,150,"2"],[205,115,"1"],[275,70,"5"],[275,150,"8"]].map(([x,y,label]) => <text key={String(x)+String(y)} x={x} y={y} fill="#6e6a63" fontSize="14" fontWeight="700">{label}</text>)}{[[60,110,"A"],[190,50,"B"],[190,175,"C"],[360,110,"D"]].map(([x,y,id], nodeIndex) => { const settledIndex = [1,3,2,4][nodeIndex]; const active = index === settledIndex; const settled = index >= settledIndex; return <g key={String(id)}><circle cx={x} cy={y} r="27" fill={active ? "#ee9360" : settled ? "#91cfba" : "#fff"} stroke="#17202a" strokeWidth="3"/><text x={x} y={Number(y)+5} textAnchor="middle" fontWeight="800" fill="#17202a">{id}</text></g>; })}</svg></div>
    <div className="flex min-h-0 flex-col rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-4"><p className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--accent-dark)]">Step {index + 1} of {trace.length}</p><h3 className="mt-1 !text-lg font-extrabold">{step.node === "Start" ? "Initialize the frontier" : `Settle ${step.node}`}</h3><p className="mt-3 rounded-lg bg-white px-3 py-2 font-mono text-[10px] font-bold">{step.distances}</p><p className="mt-3 text-xs leading-5 text-[var(--muted)]">{step.update}</p>{index === trace.length - 1 && <p className="mt-3 rounded-lg bg-[var(--mint-soft)] px-3 py-2 text-xs font-extrabold">Final route: A → C → B → D · 8 min</p>}<div className="mt-auto flex gap-2 pt-3"><Button size="sm" variant="outline" onClick={() => setIndex(0)} disabled={index === 0}><RotateCcw /> Restart</Button><Button size="sm" onClick={() => setIndex((current) => Math.min(trace.length - 1, current + 1))} disabled={index === trace.length - 1}><StepForward /> Next step</Button></div></div>
  </section>;
}

const blueprintTabs = [
  { id: "graph", label: "Graph", image: "/images/ride-sharing-graph-class.png", alt: "Sketch UML of Location, Road, Route, and RoadGraph", read: "Immutable graph values feed RoadGraph adjacency lists.", principle: "Encapsulation keeps map structure read-only to algorithms." },
  { id: "people", label: "People", image: "/images/ride-sharing-people-class.png", alt: "Sketch UML of Rider, Driver, and RideRequest", read: "Rider and request are immutable; Driver alone owns availability and location.", principle: "Immutability protects intent while cohesion keeps driver state together." },
  { id: "routing", label: "Routing", image: "/images/ride-sharing-routing-class.png", alt: "Sketch UML of Route and RoutingStrategy", read: "RoutingStrategy turns two graph locations into an optional Route.", principle: "Dependency inversion keeps Dijkstra replaceable." },
  { id: "matching", label: "Ride", image: "/images/ride-sharing-ride-class.png", alt: "Sketch UML of Ride and DriverMatchingStrategy", read: "Matching returns a Driver and pickup Route; Ride guards accepted lifecycle facts.", principle: "Algorithmic separation keeps selection out of Ride." },
  { id: "service", label: "Service", image: "/images/ride-sharing-service-class.png", alt: "Sketch UML of RideService and all collaborators", read: "RideService composes graph, strategies, people, and accepted rides.", principle: "Single responsibility makes the service coordinate without traversing roads." },
] as const;

export function RideClassBlueprint() {
  return <section className="flex h-full min-h-0 flex-col rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3"><Tabs defaultValue="graph" className="flex min-h-0 flex-1 flex-col"><div className="overflow-x-auto"><TabsList className="grid min-w-max grid-flow-col">{blueprintTabs.map((tab) => <TabsTrigger key={tab.id} value={tab.id} className="px-3 py-1.5 text-[10px]">{tab.label}</TabsTrigger>)}</TabsList></div>{blueprintTabs.map((tab) => <TabsContent key={tab.id} value={tab.id} className="mt-2 min-h-0 flex-1"><article className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-[var(--line)] bg-white"><div className="flex min-h-0 items-center justify-center overflow-hidden bg-[#fbf7ef] p-1"><Image src={tab.image} alt={tab.alt} width={1536} height={1024} className="h-full w-full object-contain" loading="eager" unoptimized /></div><div className="grid gap-1 border-t border-[var(--line)] px-3 py-2 sm:grid-cols-2"><p className="text-[9px] leading-4 text-[var(--muted)]"><strong>Read it: </strong>{tab.read}</p><p className="text-[9px] leading-4 text-[var(--muted)]"><strong className="text-[var(--accent-dark)]">Principle: </strong>{tab.principle}</p></div></article></TabsContent>)}</Tabs></section>;
}

export function RideImplementationMap() {
  return <section className="grid gap-3"><div className="grid grid-cols-3 gap-2">{[["Graph + Route","Map facts"],["Routing + Matching","Read-only decisions"],["Service + state","Accepted changes"]].map(([name, role]) => <div key={name} className="rounded-lg border border-[var(--line)] bg-[var(--paper-2)] p-3"><p className="text-[10px] font-extrabold">{name}</p><p className="mt-1 text-[9px] text-[var(--muted)]">{role}</p></div>)}</div><ol className="grid grid-cols-2 gap-2">{[["1","Service validates","Rider and endpoints"],["2","Routing proves","Trip can finish"],["3","Matching compares","Reachable drivers"],["4","Service commits","Ride and busy Driver"]].map(([n,title,body]) => <li key={n} className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono text-[10px] font-bold text-white">{n}</span><span><strong className="block text-[10px]">{title}</strong><span className="text-[9px] text-[var(--muted)]">{body}</span></span></li>)}</ol></section>;
}

export function RideScenarioProof() {
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3"><Tabs defaultValue="accepted"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="accepted" className="text-[9px]">Accepted</TabsTrigger><TabsTrigger value="trip" className="text-[9px]">No trip</TabsTrigger><TabsTrigger value="pickup" className="text-[9px]">No driver</TabsTrigger></TabsList><TabsContent value="accepted" className="mt-2 rounded-lg bg-white p-3 text-[10px] leading-5"><strong>Leo wins:</strong> E → D takes 2 minutes. Ride R1 stores pickup and trip routes; Leo becomes BUSY. Completion moves him to F and restores AVAILABLE.</TabsContent><TabsContent value="trip" className="mt-2 rounded-lg bg-white p-3 text-[10px] leading-5"><strong>UNREACHABLE_TRIP:</strong> routing fails before matching. No driver, ride, or ID changes.</TabsContent><TabsContent value="pickup" className="mt-2 rounded-lg bg-white p-3 text-[10px] leading-5"><strong>NO_DRIVER_AVAILABLE:</strong> the trip can finish, but no available driver reaches pickup G. Ride R1 is still the next accepted ID.</TabsContent></Tabs><p className="mt-3 rounded-lg bg-[var(--mint-soft)] px-3 py-2 text-[10px] font-bold">A rejection is correct only when every protected object remains unchanged.</p></section>;
}
