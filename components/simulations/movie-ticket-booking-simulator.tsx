"use client";

import { Clock3, LockKeyhole, RotateCcw, Sparkles, TicketCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SeatState = "AVAILABLE" | "HELD" | "BOOKED";
type Seat = { id: string; state: SeatState; heldBy?: string; expiresAt?: number };
type LabMode = "unsafe" | "locked";

const initialSeats: Seat[] = ["A1", "A2", "A3", "A4", "A5", "A6"].map((id) => ({ id, state: "AVAILABLE" }));

const unsafeSteps = [
  { actor: "A", text: "A checks A3 and sees AVAILABLE.", observed: "A remembers AVAILABLE", seat: "AVAILABLE", owner: "Nobody", successes: 0 },
  { actor: "B", text: "B checks A3 before A writes. B also sees AVAILABLE.", observed: "A and B remember AVAILABLE", seat: "AVAILABLE", owner: "Nobody", successes: 0 },
  { actor: "A", text: "A writes HELD and returns success.", observed: "B still has an old answer", seat: "HELD by A", owner: "Nobody", successes: 1 },
  { actor: "B", text: "B trusts its old answer, writes HELD, and also returns success.", observed: "Two callers were told they won", seat: "HELD by B", owner: "Nobody", successes: 2 },
];

const lockedSteps = [
  { actor: "A", text: "A acquires the lock for this show.", observed: "B must wait", seat: "AVAILABLE", owner: "A", successes: 0 },
  { actor: "A", text: "While holding the lock, A checks A3 and changes it to HELD.", observed: "Check and change stay together", seat: "HELD by A", owner: "A", successes: 1 },
  { actor: "A", text: "A releases the lock in a finally block.", observed: "B may enter now", seat: "HELD by A", owner: "Nobody", successes: 1 },
  { actor: "B", text: "B acquires the lock and checks the current state.", observed: "B sees HELD, not an old value", seat: "HELD by A", owner: "B", successes: 1 },
  { actor: "B", text: "B is rejected and releases the lock.", observed: "Exactly one caller succeeded", seat: "HELD by A", owner: "Nobody", successes: 1 },
];

export function MovieTicketBookingSimulator({ compact = false }: { compact?: boolean }) {
  const [view, setView] = useState<"booking" | "race">("booking");
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selected, setSelected] = useState<string[]>(["A2", "A3"]);
  const [minute, setMinute] = useState(0);
  const [events, setEvents] = useState<string[]>(["Show opened. Every seat is available."]);
  const [mode, setMode] = useState<LabMode>("locked");
  const [raceStep, setRaceStep] = useState(-1);

  const activeHold = seats.some((seat) => seat.state === "HELD" && seat.heldBy === "YOU");
  const heldSeats = seats.filter((seat) => seat.state === "HELD" && seat.heldBy === "YOU");
  const race = mode === "locked" ? lockedSteps : unsafeSteps;
  const currentRace = raceStep >= 0 ? race[raceStep] : null;
  const counts = useMemo(() => ({
    available: seats.filter((seat) => seat.state === "AVAILABLE").length,
    held: seats.filter((seat) => seat.state === "HELD").length,
    booked: seats.filter((seat) => seat.state === "BOOKED").length,
  }), [seats]);

  const log = (message: string) => setEvents((items) => [message, ...items].slice(0, 7));

  const releaseExpired = (nextMinute: number) => {
    let released = 0;
    setSeats((current) => current.map((seat) => {
      if (seat.state === "HELD" && (seat.expiresAt ?? Infinity) <= nextMinute) {
        released += 1;
        return { id: seat.id, state: "AVAILABLE" };
      }
      return seat;
    }));
    if (released > 0) log(`Minute ${nextMinute}: the hold expired. ${released} seats became AVAILABLE again.`);
  };

  const advanceMinute = () => {
    const next = minute + 1;
    setMinute(next);
    releaseExpired(next);
  };

  const toggleSeat = (seat: Seat) => {
    if (seat.state !== "AVAILABLE") {
      log(`${seat.id} cannot be selected because it is ${seat.state}.`);
      return;
    }
    setSelected((current) => current.includes(seat.id) ? current.filter((id) => id !== seat.id) : [...current, seat.id]);
  };

  const holdSelection = () => {
    if (selected.length === 0) {
      log("Choose at least one available seat before asking for a hold.");
      return;
    }
    const allAvailable = selected.every((id) => seats.find((seat) => seat.id === id)?.state === "AVAILABLE");
    if (!allAvailable) {
      log("Hold rejected: at least one requested seat is no longer available. No requested seat changed.");
      return;
    }
    const expiresAt = minute + 5;
    setSeats((current) => current.map((seat) => selected.includes(seat.id) ? { ...seat, state: "HELD", heldBy: "YOU", expiresAt } : seat));
    log(`Hold H1 accepted for ${selected.join(", ")}. It expires at minute ${expiresAt}.`);
    setSelected([]);
  };

  const confirm = () => {
    if (!activeHold) {
      log("Nothing to confirm. Create a live hold first.");
      return;
    }
    setSeats((current) => current.map((seat) => seat.state === "HELD" && seat.heldBy === "YOU" ? { id: seat.id, state: "BOOKED" } : seat));
    log(`Booking B1 confirmed for ${heldSeats.map((seat) => seat.id).join(", ")}. Booked seats do not expire.`);
  };

  const loadRejectedGroup = () => {
    setMinute(0);
    setSeats(initialSeats.map((seat) => seat.id === "A3" ? { id: seat.id, state: "BOOKED" } : seat));
    setSelected(["A2", "A3"]);
    setEvents(["Edge case loaded: A2 is free but A3 is booked. Try holding both; A2 must stay free."]);
  };

  const resetBooking = () => {
    setSeats(initialSeats);
    setSelected(["A2", "A3"]);
    setMinute(0);
    setEvents(["Simulation reset. A2 and A3 are selected."]);
  };

  const selectMode = (nextMode: LabMode) => {
    setMode(nextMode);
    setRaceStep(-1);
  };

  if (compact) {
    return <section aria-label="Compact movie ticket booking simulation" className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--line)] bg-white">
      <div className="flex shrink-0 items-center justify-between bg-[var(--ink)] px-3 py-2 text-white"><strong className="text-xs">Movie booking lab</strong><div className="flex rounded-md bg-white/10 p-0.5" role="tablist" aria-label="Simulation view"><button role="tab" aria-selected={view === "booking"} onClick={() => setView("booking")} className={cn("rounded px-2 py-1 text-[9px] font-bold", view === "booking" && "bg-white text-[var(--ink)]")}>Booking</button><button role="tab" aria-selected={view === "race"} onClick={() => setView("race")} className={cn("rounded px-2 py-1 text-[9px] font-bold", view === "race" && "bg-white text-[var(--ink)]")}>Race</button></div></div>
      {view === "booking" ? <div className="flex min-h-0 flex-1 flex-col p-3"><div className="flex items-center justify-between"><p className="text-[9px] font-extrabold">Screen 1 · 7:00 PM</p><span className="text-[9px] font-bold">minute {minute}</span></div><div className="mt-2 grid grid-cols-6 gap-1.5">{seats.map((seat) => { const isSelected = selected.includes(seat.id); return <button key={seat.id} aria-label={`${seat.id}, ${seat.state}${isSelected ? ", requested" : ""}`} onClick={() => toggleSeat(seat)} className={cn("rounded-t-lg rounded-b border px-1 py-2 text-center text-[8px] font-extrabold focus-visible:ring-4 focus-visible:ring-[var(--focus)]", seat.state === "BOOKED" && "bg-[var(--ink)] text-white", seat.state === "HELD" && "bg-[#fff4cc]", seat.state === "AVAILABLE" && !isSelected && "bg-[var(--mint-soft)]", isSelected && seat.state === "AVAILABLE" && "border-[var(--accent)] bg-[var(--accent-soft)]")}><span className="block">{seat.id}</span><span className="mt-1 block text-[6px]">{isSelected && seat.state === "AVAILABLE" ? "SELECTED" : seat.state}</span></button>; })}</div><div className="mt-2 grid grid-cols-3 gap-1.5"><Button size="sm" variant="accent" onClick={holdSelection}><LockKeyhole /> Hold</Button><Button size="sm" variant="outline" onClick={confirm}><TicketCheck /> Confirm</Button><Button size="sm" variant="outline" onClick={advanceMinute}><Clock3 /> +1 min</Button></div><p aria-live="polite" className="mt-2 min-h-10 rounded-lg bg-[var(--paper-2)] px-3 py-2 text-[9px] leading-4 text-[var(--muted)]">{events[0]}</p><div className="mt-2 flex gap-2"><Button size="sm" variant="ghost" onClick={resetBooking}><RotateCcw /> Reset</Button><Button size="sm" variant="ghost" onClick={loadRejectedGroup}>All-or-nothing edge</Button></div></div> : <div className="flex min-h-0 flex-1 flex-col p-3"><div className="grid grid-cols-2 gap-2"><button onClick={() => selectMode("unsafe")} className={cn("rounded-lg border p-2 text-left text-[9px]", mode === "unsafe" ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "bg-white")}><strong>No lock</strong><span className="block text-[8px] text-[var(--muted)]">Check and write split.</span></button><button onClick={() => selectMode("locked")} className={cn("rounded-lg border p-2 text-left text-[9px]", mode === "locked" ? "border-[var(--mint)] bg-[var(--mint-soft)]" : "bg-white")}><strong>Show lock</strong><span className="block text-[8px] text-[var(--muted)]">One caller finishes.</span></button></div><div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-[var(--paper-2)] p-2 text-center text-[8px]"><p><strong className="block">A3</strong>{currentRace?.seat ?? "AVAILABLE"}</p><p><strong className="block">Lock</strong>{currentRace?.owner ?? "Nobody"}</p><p><strong className="block">Successes</strong>{currentRace?.successes ?? 0}</p></div><p className="mt-2 min-h-10 rounded-lg border px-3 py-2 text-[9px] leading-4 text-[var(--muted)]">{currentRace?.text ?? "A and B request A3 together."}</p><div className="mt-2 flex gap-2"><Button size="sm" variant="accent" disabled={raceStep >= race.length - 1} onClick={() => setRaceStep((step) => step + 1)}>Run next step</Button><Button size="sm" variant="outline" onClick={() => setRaceStep(-1)}><RotateCcw /> Reset</Button></div>{raceStep === race.length - 1 && <p aria-live="polite" className={cn("mt-2 rounded-lg px-3 py-2 text-[9px] font-bold", mode === "locked" ? "bg-[var(--mint-soft)]" : "bg-[var(--accent-soft)]")}>{mode === "locked" ? "Correct: exactly one hold succeeds." : "Bug: two callers received success."}</p>}</div>}
    </section>;
  }

  return (
    <section aria-label="Interactive movie ticket booking simulation" className="my-10 overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-white shadow-[5px_6px_0_#dfd9cd]">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] bg-[var(--ink)] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mint)]">Try the state and lock rules</p><h3 className="mt-1 !text-xl font-extrabold">Movie booking lab</h3></div>
        <div className="flex rounded-lg bg-white/10 p-1" role="tablist" aria-label="Simulation view">
          <button role="tab" aria-selected={view === "booking"} onClick={() => setView("booking")} className={cn("rounded-md px-3 py-2 text-xs font-bold", view === "booking" ? "bg-white text-[var(--ink)]" : "text-white/70")}>Booking flow</button>
          <button role="tab" aria-selected={view === "race"} onClick={() => setView("race")} className={cn("rounded-md px-3 py-2 text-xs font-bold", view === "race" ? "bg-white text-[var(--ink)]" : "text-white/70")}>Concurrency race</button>
        </div>
      </div>

      {view === "booking" ? (
        <div>
          <div className="grid lg:grid-cols-[1.08fr_.92fr]">
            <div className="border-b border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex items-center justify-between"><div><p className="section-kicker">Screen 1 · 7:00 PM</p><p className="mt-1 text-sm font-extrabold">Row A</p></div><Badge className="border border-[var(--line)] bg-white text-[var(--ink)]"><Clock3 /> minute {minute}</Badge></div>
              <div className="mb-6 rounded-[50%] border-t-4 border-[var(--ink)] pt-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">Screen</div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {seats.map((seat) => {
                  const isSelected = selected.includes(seat.id);
                  return <button key={seat.id} aria-label={`${seat.id}, ${seat.state}${isSelected ? ", requested" : ""}`} onClick={() => toggleSeat(seat)} className={cn("min-h-24 rounded-t-xl rounded-b-md border-2 p-2 text-center transition focus:outline-none focus:ring-4 focus:ring-[var(--focus)]", seat.state === "BOOKED" && "border-[var(--ink)] bg-[var(--ink)] text-white", seat.state === "HELD" && "border-[#d1902e] bg-[#fff4cc]", seat.state === "AVAILABLE" && !isSelected && "border-[#9db8ad] bg-[var(--mint-soft)]", isSelected && seat.state === "AVAILABLE" && "border-[var(--accent-dark)] bg-[var(--accent-soft)] shadow-[0_0_0_2px_white,0_0_0_4px_var(--accent)]") }>
                    <span className="font-mono text-xs font-extrabold">{seat.id}</span><span className="mt-3 block text-[9px] font-bold">{isSelected && seat.state === "AVAILABLE" ? "SELECTED" : seat.state}</span>{isSelected && seat.state !== "AVAILABLE" && <span className="mt-1 block text-[8px] font-bold text-[var(--accent)]">REQUESTED</span>}{seat.expiresAt && <span className="mt-1 block text-[9px]">until {seat.expiresAt}</span>}
                  </button>;
                })}
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-[10px]"><Badge className="bg-[var(--mint-soft)] text-[#28725c]">{counts.available} available</Badge><Badge className="bg-[#fff4cc] text-[#8b641f]">{counts.held} held</Badge><Badge className="bg-[var(--ink)] text-white">{counts.booked} booked</Badge></div>
            </div>

            <div className="p-4 sm:p-6">
              <p className="section-kicker">User YOU</p>
              <div className="mt-3 rounded-xl border border-[var(--line)] p-4">
                <p className="text-sm font-extrabold">Selected seats</p><p className="mt-1 min-h-6 font-mono text-xs text-[var(--muted)]">{selected.length ? selected.join(", ") : "None"}</p>
                <Button variant="accent" className="mt-4 w-full" onClick={holdSelection}><LockKeyhole /> Hold for 5 minutes</Button>
                <Button variant="outline" className="mt-2 w-full" onClick={confirm}><TicketCheck /> Confirm booking</Button>
                <Button variant="ghost" className="mt-2 w-full" onClick={advanceMinute}><Clock3 /> Advance one minute</Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2"><Button variant="outline" onClick={resetBooking}><RotateCcw /> Reset</Button><Button variant="ghost" onClick={loadRejectedGroup}>Load all-or-nothing edge</Button></div>
            </div>
          </div>
          <div className="border-t border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-5"><p className="flex items-center gap-2 text-sm font-extrabold"><Sparkles className="size-4 text-[var(--accent)]" /> What the objects did</p><ol aria-live="polite" className="mt-3 space-y-1.5 font-mono text-[11px] leading-5 text-[var(--muted)]">{events.map((event, index) => <li key={`${event}-${index}`} className={index === 0 ? "font-medium text-[var(--ink)]" : "opacity-60"}>{event}</li>)}</ol></div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[.82fr_1.18fr]">
          <div className="border-b border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <p className="section-kicker">Choose the implementation</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => selectMode("unsafe")} className={cn("rounded-xl border p-3 text-left", mode === "unsafe" ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)] bg-white")}><strong className="text-sm">No lock</strong><span className="mt-1 block text-[10px] leading-4 text-[var(--muted)]">Check and write can be separated.</span></button>
              <button onClick={() => selectMode("locked")} className={cn("rounded-xl border p-3 text-left", mode === "locked" ? "border-[var(--mint)] bg-[var(--mint-soft)]" : "border-[var(--line)] bg-white")}><strong className="text-sm">Show lock</strong><span className="mt-1 block text-[10px] leading-4 text-[var(--muted)]">One caller finishes before the other checks.</span></button>
            </div>
            <div className="mt-5 rounded-xl border border-[var(--line)] bg-white p-4">
              <p className="font-mono text-xs font-bold">Seat A3: {currentRace?.seat ?? "AVAILABLE"}</p>
              <p className="mt-2 text-xs">Lock owner: <strong>{currentRace?.owner ?? "Nobody"}</strong></p>
              <p className="mt-1 text-xs">Success replies: <strong className={cn((currentRace?.successes ?? 0) > 1 && "text-red-700")}>{currentRace?.successes ?? 0}</strong></p>
              <p className="mt-3 min-h-10 rounded-lg bg-[var(--blue-soft)] p-2 text-[11px] leading-5 text-[var(--muted)]">{currentRace?.observed ?? "A and B are ready to request A3 at the same time."}</p>
            </div>
            <div className="mt-4 flex gap-2"><Button variant="accent" disabled={raceStep >= race.length - 1} onClick={() => setRaceStep((step) => step + 1)}>Run next step</Button><Button variant="outline" onClick={() => setRaceStep(-1)}><RotateCcw /> Reset</Button></div>
          </div>
          <div className="p-4 sm:p-6">
            <p className="section-kicker">Interleaving: who runs between whom?</p>
            <ol className="mt-4 space-y-3">
              {race.map((step, index) => <li key={step.text} className={cn("flex gap-3 rounded-xl border p-3 transition", index <= raceStep ? "border-[var(--line)] bg-white" : "border-transparent bg-[var(--paper-2)] opacity-45", index === raceStep && "border-[var(--accent)] shadow-[3px_3px_0_var(--accent-soft)]")}><span className={cn("grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-extrabold", step.actor === "A" ? "bg-[var(--accent-soft)] text-[var(--accent-dark)]" : "bg-[var(--blue-soft)] text-[#346985]")}>{step.actor}</span><p className="text-sm leading-6 text-[var(--muted)]">{step.text}</p></li>)}
            </ol>
            {raceStep === race.length - 1 && <div aria-live="polite" className={cn("mt-4 rounded-xl border p-4 text-sm font-bold", mode === "locked" ? "border-[#b7dacc] bg-[var(--mint-soft)] text-[#28725c]" : "border-[#efb7a5] bg-[var(--accent-soft)] text-[#9e431d]")}>{mode === "locked" ? "Correct: exactly one hold succeeds." : "Bug reproduced: two callers received success for one seat."}</div>}
          </div>
        </div>
      )}
    </section>
  );
}
