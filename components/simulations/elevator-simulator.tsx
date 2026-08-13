"use client";

import { Pause, Play, Plus, RotateCcw, StepForward } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Direction = "UP" | "DOWN" | "IDLE";
type RequestType = "PICKUP_UP" | "PICKUP_DOWN" | "DESTINATION";
type Request = { floor: number; type: RequestType };
type Elevator = { id: string; floor: number; direction: Direction; requests: Request[] };
type Strategy = "nearest" | "direction-aware";

const initialElevators: Elevator[] = [
  { id: "A", floor: 0, direction: "IDLE", requests: [] },
  { id: "B", floor: 6, direction: "IDLE", requests: [] },
];

function labelRequest(request: Request) {
  return `${request.floor}${request.type === "PICKUP_UP" ? "↑" : request.type === "PICKUP_DOWN" ? "↓" : "•"}`;
}

function hasAhead(elevator: Elevator, direction: Direction) {
  if (direction === "UP") return elevator.requests.some((request) => request.floor > elevator.floor);
  if (direction === "DOWN") return elevator.requests.some((request) => request.floor < elevator.floor);
  return false;
}

function tickElevator(elevator: Elevator): { elevator: Elevator; event: string } {
  const next = { ...elevator, requests: [...elevator.requests] };
  if (next.requests.length === 0) return { elevator: { ...next, direction: "IDLE" }, event: `Elevator ${next.id} stays idle at floor ${next.floor}.` };

  if (next.direction === "IDLE") {
    const nearest = [...next.requests].sort((a, b) => Math.abs(a.floor - next.floor) - Math.abs(b.floor - next.floor) || a.floor - b.floor)[0];
    next.direction = nearest.floor > next.floor ? "UP" : "DOWN";
  }

  const matching = next.requests.filter((request) => request.floor === next.floor && (request.type === "DESTINATION" || request.type === `PICKUP_${next.direction}`));
  if (matching.length > 0) {
    next.requests = next.requests.filter((request) => !matching.includes(request));
    if (next.requests.length === 0) next.direction = "IDLE";
    return { elevator: next, event: `Elevator ${next.id} serves floor ${next.floor}: ${matching.map(labelRequest).join(", ")}.` };
  }

  if (!hasAhead(next, next.direction)) {
    next.direction = next.direction === "UP" ? "DOWN" : "UP";
    return { elevator: next, event: `Elevator ${next.id} reverses to ${next.direction}.` };
  }

  next.floor += next.direction === "UP" ? 1 : -1;
  return { elevator: next, event: `Elevator ${next.id} moves ${next.direction.toLowerCase()} to floor ${next.floor}.` };
}

function selectElevator(elevators: Elevator[], floor: number, direction: Exclude<Direction, "IDLE">, strategy: Strategy) {
  return [...elevators].sort((a, b) => {
    const score = (elevator: Elevator) => {
      const distance = Math.abs(elevator.floor - floor);
      if (strategy === "nearest") return distance;
      if (elevator.direction === "IDLE") return 20 + distance;
      const movingToward = elevator.direction === direction && (direction === "UP" ? elevator.floor <= floor : elevator.floor >= floor);
      return movingToward ? distance : 100 + distance;
    };
    return score(a) - score(b) || a.id.localeCompare(b.id);
  })[0];
}

export function ElevatorSimulator() {
  const [elevators, setElevators] = useState(initialElevators);
  const [floor, setFloor] = useState(3);
  const [hallDirection, setHallDirection] = useState<"UP" | "DOWN">("UP");
  const [strategy, setStrategy] = useState<Strategy>("direction-aware");
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [events, setEvents] = useState<string[]>(["Simulation ready. Add a hall call or destination."]);

  const advance = useCallback(() => {
    setElevators((current) => {
      const results = current.map(tickElevator);
      setEvents((log) => [`Tick ${tick + 1} · ${results.map((result) => result.event).join(" ")}`, ...log].slice(0, 8));
      return results.map((result) => result.elevator);
    });
    setTick((value) => value + 1);
  }, [tick]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(advance, 850);
    return () => window.clearInterval(timer);
  }, [advance, playing]);

  const addHallCall = () => {
    const selected = selectElevator(elevators, floor, hallDirection, strategy);
    const request: Request = { floor, type: `PICKUP_${hallDirection}` };
    setElevators((current) => current.map((elevator) => elevator.id === selected.id
      ? { ...elevator, requests: elevator.requests.some((existing) => existing.floor === request.floor && existing.type === request.type) ? elevator.requests : [...elevator.requests, request] }
      : elevator));
    const ruleName = strategy === "nearest" ? "nearest-car rule" : "same-direction-first rule";
    setEvents((log) => [`Hall call ${floor}${hallDirection === "UP" ? "↑" : "↓"} assigned to Elevator ${selected.id} by the ${ruleName}.`, ...log].slice(0, 8));
  };

  const addDestination = (id: string, destination: number) => {
    setElevators((current) => current.map((elevator) => {
      if (elevator.id !== id || destination === elevator.floor) return elevator;
      const request: Request = { floor: destination, type: "DESTINATION" };
      return { ...elevator, requests: elevator.requests.some((existing) => existing.floor === destination && existing.type === "DESTINATION") ? elevator.requests : [...elevator.requests, request] };
    }));
    setEvents((log) => [`Passenger in Elevator ${id} selects floor ${destination}.`, ...log].slice(0, 8));
  };

  const reset = () => {
    setPlaying(false); setElevators(initialElevators); setTick(0); setEvents(["Simulation reset."]);
  };

  const loadRushHour = () => {
    setPlaying(false);
    setTick(0);
    setElevators([
      { id: "A", floor: 2, direction: "UP", requests: [{ floor: 7, type: "DESTINATION" }] },
      { id: "B", floor: 8, direction: "DOWN", requests: [{ floor: 1, type: "DESTINATION" }] },
    ]);
    setFloor(5); setHallDirection("UP");
    setEvents(["Scenario loaded: both elevators are moving. Add the floor 5↑ hall call and compare strategies."]);
  };

  const floors = useMemo(() => Array.from({ length: 10 }, (_, index) => 9 - index), []);

  return (
    <section aria-label="Interactive elevator simulation" className="my-10 overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-white shadow-[5px_6px_0_#dfd9cd]">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] bg-[var(--ink)] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Try it yourself</p><h3 className="mt-1 !text-xl font-extrabold">Elevator simulator</h3></div>
        <Badge className="w-fit border-white/20 bg-white/10 text-white">Tick {tick}</Badge>
      </div>

      <div className="grid lg:grid-cols-[1.05fr_.95fr]">
        <div className="border-b border-[var(--line)] p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-3">
            <div className="mb-2 grid grid-cols-[38px_1fr_1fr] gap-2 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--faint)]"><span /><span>Car A</span><span>Car B</span></div>
            {floors.map((level) => (
              <div key={level} className="grid h-10 grid-cols-[38px_1fr_1fr] gap-2 border-t border-dashed border-[var(--line)] first:border-t-0">
                <span className="self-center font-mono text-xs text-[var(--faint)]">F{level}</span>
                {elevators.map((elevator) => (
                  <div key={elevator.id} className="relative grid place-items-center border-x border-[var(--line)] bg-white/60">
                    {elevator.floor === level && <div className={cn("grid h-8 w-[72%] max-w-20 place-items-center rounded-lg border-2 border-[var(--ink)] font-mono text-xs font-bold shadow-[2px_2px_0_#14263d] transition-all", elevator.id === "A" ? "bg-[var(--accent)]" : "bg-[var(--mint)]")}>{elevator.id} {elevator.direction === "UP" ? "↑" : elevator.direction === "DOWN" ? "↓" : "·"}</div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <Tabs value={strategy} onValueChange={(value) => setStrategy(value as Strategy)}>
            <p className="section-kicker mb-2">How should we choose a car?</p>
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="nearest">Nearest car</TabsTrigger><TabsTrigger value="direction-aware">Same direction first</TabsTrigger></TabsList>
            <TabsContent value="nearest" className="text-xs leading-5 text-[var(--muted)]">Picks the closest car, even if it is travelling the wrong way.</TabsContent>
            <TabsContent value="direction-aware" className="text-xs leading-5 text-[var(--muted)]">Prefers a car already travelling toward the caller in the requested direction.</TabsContent>
          </Tabs>

          <div className="mt-5 rounded-xl border border-[var(--line)] p-4">
            <p className="text-sm font-extrabold">Create hall call</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-[var(--muted)]">Floor<select aria-label="Hall call floor" value={floor} onChange={(event) => setFloor(Number(event.target.value))} className="mt-1 h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] outline-none focus:ring-4 focus:ring-[var(--focus)]">{Array.from({ length: 10 }, (_, value) => <option key={value}>{value}</option>)}</select></label>
              <label className="text-xs font-bold text-[var(--muted)]">Direction<select aria-label="Hall call direction" value={hallDirection} onChange={(event) => setHallDirection(event.target.value as "UP" | "DOWN")} className="mt-1 h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] outline-none focus:ring-4 focus:ring-[var(--focus)]"><option>UP</option><option>DOWN</option></select></label>
            </div>
            <Button variant="accent" className="mt-3 w-full" onClick={addHallCall}><Plus /> Add hall call</Button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {elevators.map((elevator) => <ElevatorPanel key={elevator.id} elevator={elevator} onDestination={addDestination} />)}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => setPlaying((value) => !value)}>{playing ? <Pause /> : <Play />}{playing ? "Pause" : "Play"}</Button>
            <Button variant="outline" onClick={advance}><StepForward /> Step</Button>
            <Button variant="ghost" onClick={reset}><RotateCcw /> Reset</Button>
            <Button variant="ghost" onClick={loadRushHour}>Load edge case</Button>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-5">
        <p className="section-kicker">Event log</p>
        <ol aria-live="polite" className="mt-3 space-y-1.5 font-mono text-[11px] leading-5 text-[var(--muted)]">{events.map((event, index) => <li key={`${event}-${index}`} className={index === 0 ? "font-medium text-[var(--ink)]" : "opacity-65"}>{event}</li>)}</ol>
      </div>
    </section>
  );
}

function ElevatorPanel({ elevator, onDestination }: { elevator: Elevator; onDestination: (id: string, destination: number) => void }) {
  const [destination, setDestination] = useState(elevator.floor === 9 ? 0 : elevator.floor + 1);
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3">
      <div className="flex items-center justify-between"><strong className="text-sm">Car {elevator.id}</strong><span className="font-mono text-[10px] text-[var(--muted)]">F{elevator.floor} · {elevator.direction}</span></div>
      <div className="mt-2 min-h-7 text-xs text-[var(--muted)]">Queue: {elevator.requests.length ? elevator.requests.map(labelRequest).join("  ") : "empty"}</div>
      <div className="mt-2 flex gap-2"><select aria-label={`Destination for elevator ${elevator.id}`} value={destination} onChange={(event) => setDestination(Number(event.target.value))} className="min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-white px-2 text-xs">{Array.from({ length: 10 }, (_, value) => <option key={value}>{value}</option>)}</select><Button size="sm" variant="outline" onClick={() => onDestination(elevator.id, destination)}>Add stop</Button></div>
    </div>
  );
}
