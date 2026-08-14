"use client";

import { CarFront, MapPin, Navigation, RotateCcw, Sparkles, StepForward, UserRound } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NodeId = "A" | "B" | "C" | "D" | "E" | "F" | "G";
type DriverStatus = "AVAILABLE" | "BUSY";
type RideStatus = "MATCHED" | "IN_PROGRESS" | "COMPLETED";
type Driver = { id: string; name: string; node: NodeId; status: DriverStatus; color: string };
type Edge = { from: NodeId; to: NodeId; minutes: number; twoWay: boolean };
type RouteResult = { path: NodeId[]; minutes: number } | null;
type TraceStep = { current: NodeId | null; settled: NodeId[]; frontier: NodeId[]; distances: Record<NodeId, number>; updates: string[]; route: RouteResult; done: boolean };

const nodeIds: NodeId[] = ["A", "B", "C", "D", "E", "F", "G"];
const nodes: Record<NodeId, { x: number; y: number; name: string }> = {
  A: { x: 70, y: 80, name: "West" },
  B: { x: 245, y: 70, name: "Market" },
  C: { x: 180, y: 205, name: "Park" },
  D: { x: 355, y: 150, name: "Museum" },
  E: { x: 465, y: 250, name: "Harbor" },
  F: { x: 585, y: 145, name: "Airport" },
  G: { x: 555, y: 45, name: "Hill" },
};

const edges: Edge[] = [
  { from: "A", to: "B", minutes: 4, twoWay: true },
  { from: "A", to: "C", minutes: 2, twoWay: true },
  { from: "C", to: "B", minutes: 1, twoWay: true },
  { from: "B", to: "D", minutes: 5, twoWay: true },
  { from: "C", to: "D", minutes: 8, twoWay: true },
  { from: "C", to: "E", minutes: 10, twoWay: true },
  { from: "D", to: "E", minutes: 2, twoWay: true },
  { from: "D", to: "F", minutes: 6, twoWay: true },
  { from: "E", to: "F", minutes: 3, twoWay: true },
  { from: "G", to: "F", minutes: 1, twoWay: false },
];

const initialDrivers: Driver[] = [
  { id: "D1", name: "Maya", node: "B", status: "AVAILABLE", color: "#ee9360" },
  { id: "D2", name: "Leo", node: "E", status: "AVAILABLE", color: "#52a78c" },
  { id: "D3", name: "Noor", node: "A", status: "AVAILABLE", color: "#7da9c4" },
];

function adjacency() {
  const result: Record<NodeId, Array<{ to: NodeId; minutes: number }>> = {
    A: [], B: [], C: [], D: [], E: [], F: [], G: [],
  };
  for (const edge of edges) {
    result[edge.from].push({ to: edge.to, minutes: edge.minutes });
    if (edge.twoWay) result[edge.to].push({ to: edge.from, minutes: edge.minutes });
  }
  for (const id of nodeIds) result[id].sort((left, right) => left.to.localeCompare(right.to));
  return result;
}

const graph = adjacency();
const infinityDistances = () => Object.fromEntries(nodeIds.map((id) => [id, Number.POSITIVE_INFINITY])) as Record<NodeId, number>;

function reconstruct(previous: Partial<Record<NodeId, NodeId>>, start: NodeId, target: NodeId) {
  const path: NodeId[] = [target];
  while (path[0] !== start) {
    const parent = previous[path[0]];
    if (!parent) return [];
    path.unshift(parent);
  }
  return path;
}

function dijkstraWithTrace(start: NodeId, target: NodeId): TraceStep[] {
  const distances = infinityDistances();
  const previous: Partial<Record<NodeId, NodeId>> = {};
  const settled = new Set<NodeId>();
  const queue: Array<{ node: NodeId; distance: number }> = [{ node: start, distance: 0 }];
  distances[start] = 0;
  const snapshots: TraceStep[] = [{ current: null, settled: [], frontier: [start], distances: { ...distances }, updates: [`Start at ${start}. Its known time is 0.`], route: null, done: false }];

  while (queue.length > 0) {
    queue.sort((left, right) => left.distance - right.distance || left.node.localeCompare(right.node));
    const next = queue.shift()!;
    if (settled.has(next.node) || next.distance !== distances[next.node]) continue;
    settled.add(next.node);
    const updates: string[] = [`Settle ${next.node} at ${next.distance} min. This time is now final.`];

    if (next.node === target) {
      const path = reconstruct(previous, start, target);
      snapshots.push({ current: next.node, settled: [...settled], frontier: [], distances: { ...distances }, updates: [...updates, `Reached ${target}. Rebuild the path: ${path.join(" → ")}.`], route: { path, minutes: distances[target] }, done: true });
      return snapshots;
    }

    for (const road of graph[next.node]) {
      if (settled.has(road.to)) continue;
      const candidate = distances[next.node] + road.minutes;
      if (candidate < distances[road.to]) {
        const old = Number.isFinite(distances[road.to]) ? `${distances[road.to]} min` : "∞";
        distances[road.to] = candidate;
        previous[road.to] = next.node;
        queue.push({ node: road.to, distance: candidate });
        updates.push(`Relax ${next.node} → ${road.to}: ${old} becomes ${candidate} min.`);
      } else {
        updates.push(`Keep ${road.to} at ${distances[road.to]} min; ${candidate} min is not better.`);
      }
    }
    const frontier = nodeIds.filter((id) => !settled.has(id) && Number.isFinite(distances[id])).sort((left, right) => distances[left] - distances[right] || left.localeCompare(right));
    snapshots.push({ current: next.node, settled: [...settled], frontier, distances: { ...distances }, updates, route: null, done: false });
  }

  snapshots.push({ current: null, settled: [...settled], frontier: [], distances: { ...distances }, updates: [`The frontier is empty. ${target} is unreachable from ${start}.`], route: null, done: true });
  return snapshots;
}

function shortestRoute(start: NodeId, target: NodeId): RouteResult {
  const steps = dijkstraWithTrace(start, target);
  return steps[steps.length - 1].route;
}

function edgeIsOnPath(edge: Edge, path: NodeId[]) {
  return path.some((node, index) => index < path.length - 1 && ((node === edge.from && path[index + 1] === edge.to) || (edge.twoWay && node === edge.to && path[index + 1] === edge.from)));
}

export function RideSharingSimulator() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [pickup, setPickup] = useState<NodeId>("D");
  const [destination, setDestination] = useState<NodeId>("F");
  const [ride, setRide] = useState<{ id: string; driverId: string; pickupRoute: RouteResult; tripRoute: RouteResult; status: RideStatus } | null>(null);
  const [comparisons, setComparisons] = useState<Array<{ driver: Driver; route: RouteResult }>>([]);
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>(dijkstraWithTrace("E", "D"));
  const [traceIndex, setTraceIndex] = useState(0);
  const [events, setEvents] = useState<string[]>(["Ready: request Museum (D) → Airport (F). Road time, not visual distance, should choose Leo."]);

  const trace = traceSteps[traceIndex];
  const selectedDriver = ride ? drivers.find((driver) => driver.id === ride.driverId) : null;
  const activePath = trace.route?.path ?? [];

  const requestRide = () => {
    if (ride && ride.status !== "COMPLETED") {
      setEvents((current) => ["Rejected: finish the active ride before requesting another. No driver changed.", ...current].slice(0, 8));
      return;
    }
    if (pickup === destination) {
      setEvents((current) => ["Rejected: pickup and destination must be different. No driver changed.", ...current].slice(0, 8));
      return;
    }

    const tripRoute = shortestRoute(pickup, destination);
    if (!tripRoute) {
      setEvents((current) => [`Rejected: no road route exists from ${pickup} to ${destination}. No driver changed.`, ...current].slice(0, 8));
      return;
    }

    const evaluated = drivers.filter((driver) => driver.status === "AVAILABLE").map((driver) => ({ driver, route: shortestRoute(driver.node, pickup) }));
    setComparisons(evaluated);
    const winner = evaluated.filter((item): item is { driver: Driver; route: NonNullable<RouteResult> } => item.route !== null).sort((left, right) => left.route.minutes - right.route.minutes || left.driver.id.localeCompare(right.driver.id))[0];
    if (!winner) {
      setEvents((current) => [`Rejected: no available driver can reach pickup ${pickup}. No driver changed.`, ...current].slice(0, 8));
      setRide(null);
      return;
    }

    setDrivers((current) => current.map((driver) => driver.id === winner.driver.id ? { ...driver, status: "BUSY" } : driver));
    setRide({ id: "R1", driverId: winner.driver.id, pickupRoute: winner.route, tripRoute, status: "MATCHED" });
    const nextTrace = dijkstraWithTrace(winner.driver.node, pickup);
    setTraceSteps(nextTrace);
    setTraceIndex(0);
    setEvents((current) => [
      `Matched ${winner.driver.name}: ${winner.route.minutes} min to pickup via ${winner.route.path.join(" → ")}.`,
      `Trip route is ${tripRoute.path.join(" → ")} in ${tripRoute.minutes} min. ${winner.driver.name} is now BUSY.`,
      ...current,
    ].slice(0, 8));
  };

  const advanceRide = () => {
    if (!ride) return;
    if (ride.status === "MATCHED") {
      setRide({ ...ride, status: "IN_PROGRESS" });
      setEvents((current) => [`Started ${ride.id}: the rider is in the car and the trip route is active.`, ...current].slice(0, 8));
      return;
    }
    if (ride.status === "IN_PROGRESS") {
      setRide({ ...ride, status: "COMPLETED" });
      setDrivers((current) => current.map((driver) => driver.id === ride.driverId ? { ...driver, node: destination, status: "AVAILABLE" } : driver));
      setEvents((current) => [`Completed ${ride.id}: driver moved to ${destination} and became AVAILABLE again.`, ...current].slice(0, 8));
    }
  };

  const reset = () => {
    setDrivers(initialDrivers);
    setPickup("D");
    setDestination("F");
    setRide(null);
    setComparisons([]);
    setTraceSteps(dijkstraWithTrace("E", "D"));
    setTraceIndex(0);
    setEvents(["Reset: all drivers are available. Default request is Museum (D) → Airport (F)."]);
  };

  const loadUnreachable = () => {
    setDrivers(initialDrivers);
    setPickup("G");
    setDestination("F");
    setRide(null);
    setComparisons([]);
    setTraceSteps(dijkstraWithTrace("B", "G"));
    setTraceIndex(0);
    setEvents(["Unreachable pickup loaded: G has a one-way road out to F, but no road enters G. The trip is valid; no driver can reach its pickup."]);
  };

  const nextTrace = () => setTraceIndex((current) => Math.min(current + 1, traceSteps.length - 1));
  const restartTrace = () => setTraceIndex(0);

  const distanceRows = nodeIds.map((id) => ({ id, distance: trace.distances[id], state: trace.current === id ? "current" : trace.settled.includes(id) ? "settled" : trace.frontier.includes(id) ? "frontier" : "unseen" }));

  return (
    <section aria-label="Interactive ride sharing routing simulation" className="my-10 overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-white shadow-[5px_6px_0_#dfd9cd]">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] bg-[var(--ink)] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mint)]">Match, then route</p><h3 className="mt-1 !text-xl font-extrabold">Ride dispatch and Dijkstra lab</h3></div>
        <Badge className="border-white/20 bg-white/10 text-white"><Navigation /> Deterministic city graph</Badge>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_.85fr]">
        <div className="min-w-0 border-b border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-5 lg:border-b-0 lg:border-r">
          <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white">
            <svg aria-label="Road graph with weighted roads, drivers, pickup, destination, and Dijkstra state" viewBox="0 0 650 320" className="h-auto min-w-[620px] sm:min-w-0">
              <defs><marker id="ride-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ee9360" /></marker></defs>
              {edges.map((edge) => {
                const from = nodes[edge.from];
                const to = nodes[edge.to];
                const highlighted = edgeIsOnPath(edge, activePath);
                return <g key={`${edge.from}-${edge.to}`}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={highlighted ? "#299f88" : "#cfc9bf"} strokeWidth={highlighted ? 8 : 4} strokeLinecap="round" markerEnd={!edge.twoWay ? "url(#ride-arrow)" : undefined} /><rect x={(from.x + to.x) / 2 - 12} y={(from.y + to.y) / 2 - 10} width="24" height="20" rx="6" fill="#fbfaf7" /><text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#6e6a63">{edge.minutes}</text></g>;
              })}
              {nodeIds.map((id) => {
                const node = nodes[id];
                const state = trace.current === id ? "current" : trace.settled.includes(id) ? "settled" : trace.frontier.includes(id) ? "frontier" : "unseen";
                const fill = state === "current" ? "#ee9360" : state === "settled" ? "#7fc7ae" : state === "frontier" ? "#f7d66f" : "#ffffff";
                return <g key={id}><circle cx={node.x} cy={node.y} r="22" fill={fill} stroke="#17202a" strokeWidth="3" /><text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#17202a">{id}</text><text x={node.x} y={node.y + 39} textAnchor="middle" fontSize="10" fill="#6e6a63">{node.name}</text></g>;
              })}
              {drivers.map((driver, index) => {
                const node = nodes[driver.node];
                return <g key={driver.id} transform={`translate(${node.x - 18 + index * 14},${node.y - 38})`}><circle r="10" fill={driver.color} stroke="white" strokeWidth="2" /><text x="0" y="4" textAnchor="middle" fontSize="8" fontWeight="800" fill="white">{driver.name[0]}</text></g>;
              })}
              <g transform={`translate(${nodes[pickup].x - 8},${nodes[pickup].y - 58})`}><path d="M8 0C2 0-2 5-2 11c0 9 10 20 10 20s10-11 10-20C18 5 14 0 8 0Z" fill="#ee9360" /><circle cx="8" cy="10" r="4" fill="white" /></g>
              <g transform={`translate(${nodes[destination].x + 12},${nodes[destination].y - 58})`}><path d="M8 0C2 0-2 5-2 11c0 9 10 20 10 20s10-11 10-20C18 5 14 0 8 0Z" fill="#17202a" /><circle cx="8" cy="10" r="4" fill="white" /></g>
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[var(--muted)]"><span className="rounded bg-[var(--accent-soft)] px-2 py-1">Orange = current</span><span className="rounded bg-[var(--mint-soft)] px-2 py-1">Teal = settled</span><span className="rounded bg-[#fff4c9] px-2 py-1">Yellow = frontier</span><span className="rounded bg-white px-2 py-1">Road number = minutes</span></div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[.75fr_1.25fr]">
            <div className="min-w-0"><p className="section-kicker">Known distances</p><div className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-2">{distanceRows.map((row) => <div key={row.id} className={cn("flex items-center justify-between rounded-lg border px-2 py-2 text-[10px]", row.state === "current" ? "border-[var(--accent)] bg-[var(--accent-soft)]" : row.state === "settled" ? "border-[#a8d3c5] bg-[var(--mint-soft)]" : row.state === "frontier" ? "border-[#e5c978] bg-[#fff8dc]" : "border-[var(--line)] bg-white text-[var(--faint)]")}><strong>{row.id}</strong><span className="font-mono">{Number.isFinite(row.distance) ? row.distance : "∞"}</span></div>)}</div></div>
            <div className="min-w-0"><p className="section-kicker">This Dijkstra step</p><div className="mt-2 rounded-xl border border-[var(--line)] bg-white p-3"><p className="text-xs font-bold">{trace.current ? `Current node: ${trace.current}` : "Ready to choose the cheapest frontier node"}</p><ul className="mt-2 space-y-1 text-[10px] leading-4 text-[var(--muted)]">{trace.updates.map((update) => <li key={update}>• {update}</li>)}</ul>{trace.route && <p className="mt-3 rounded-lg bg-[var(--mint-soft)] px-3 py-2 text-xs font-bold">Route {trace.route.path.join(" → ")} · {trace.route.minutes} min</p>}</div><div className="mt-2 flex flex-wrap gap-2"><Button variant="outline" onClick={restartTrace}><RotateCcw /> Restart trace</Button><Button variant="accent" onClick={nextTrace} disabled={traceIndex === traceSteps.length - 1}><StepForward /> Next step</Button></div></div>
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-6">
          <p className="section-kicker">New ride request</p>
          <div className="mt-3 rounded-xl border border-[var(--line)] p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="min-w-0 text-xs font-bold text-[var(--muted)]">Pickup<select aria-label="Pickup node" value={pickup} onChange={(event) => setPickup(event.target.value as NodeId)} className="mt-1 h-10 w-full min-w-0 rounded-lg border border-[var(--line)] bg-white px-2 text-xs text-[var(--ink)]">{nodeIds.map((id) => <option key={id} value={id}>{id} · {nodes[id].name}</option>)}</select></label>
              <label className="min-w-0 text-xs font-bold text-[var(--muted)]">Destination<select aria-label="Destination node" value={destination} onChange={(event) => setDestination(event.target.value as NodeId)} className="mt-1 h-10 w-full min-w-0 rounded-lg border border-[var(--line)] bg-white px-2 text-xs text-[var(--ink)]">{nodeIds.map((id) => <option key={id} value={id}>{id} · {nodes[id].name}</option>)}</select></label>
            </div>
            <Button variant="accent" className="mt-3 w-full" onClick={requestRide}><MapPin /> Request ride</Button>
          </div>

          <div className="mt-5"><p className="section-kicker">Driver comparison</p><div className="mt-2 space-y-2">{drivers.map((driver) => {
            const comparison = comparisons.find((item) => item.driver.id === driver.id);
            const chosen = ride?.driverId === driver.id;
            return <div key={driver.id} className={cn("rounded-xl border p-3", chosen ? "border-[var(--mint)] bg-[var(--mint-soft)]" : "border-[var(--line)]")}><div className="flex flex-wrap items-center gap-2"><CarFront className="size-4" /><strong className="text-xs">{driver.name}</strong><span className="text-[10px] text-[var(--muted)]">at {driver.node}</span><span className={cn("ml-auto rounded px-2 py-1 text-[9px] font-bold", driver.status === "AVAILABLE" ? "bg-[var(--mint-soft)] text-[#28725c]" : "bg-[var(--accent-soft)] text-[var(--accent-dark)]")}>{driver.status}</span></div>{comparison && <p className="mt-2 font-mono text-[10px] text-[var(--muted)]">{comparison.route ? `${comparison.route.path.join(" → ")} · ${comparison.route.minutes} min` : `cannot reach ${pickup}`}{chosen ? " · chosen" : ""}</p>}</div>;
          })}</div></div>

          {ride && <div className="mt-5 rounded-xl border-2 border-[var(--ink)] p-4"><div className="flex items-center justify-between gap-2"><div><p className="section-kicker">Ride {ride.id}</p><strong className="text-sm">{selectedDriver?.name} · {ride.status.replace("_", " ")}</strong></div><UserRound className="size-5 text-[var(--accent)]" /></div><p className="mt-3 text-xs leading-5 text-[var(--muted)]"><strong>Pickup:</strong> {ride.pickupRoute?.path.join(" → ")} ({ride.pickupRoute?.minutes} min)<br /><strong>Trip:</strong> {ride.tripRoute?.path.join(" → ")} ({ride.tripRoute?.minutes} min)</p>{ride.status !== "COMPLETED" && <Button className="mt-3 w-full" onClick={advanceRide}>{ride.status === "MATCHED" ? "Start ride" : "Complete ride"}</Button>}</div>}
          <div className="mt-5 flex flex-wrap gap-2"><Button variant="outline" onClick={reset}><RotateCcw /> Reset</Button><Button variant="ghost" onClick={loadUnreachable}>Load unreachable pickup</Button></div>
        </div>
      </div>

      <div className="border-t border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-5">
        <p className="flex items-center gap-2 text-sm font-extrabold"><Sparkles className="size-4 text-[var(--accent)]" /> What dispatch decided</p>
        <ol aria-live="polite" className="mt-3 space-y-1.5 font-mono text-[11px] leading-5 text-[var(--muted)]">{events.map((event, index) => <li key={`${event}-${index}`} className={index === 0 ? "font-medium text-[var(--ink)]" : "opacity-60"}>{event}</li>)}</ol>
      </div>
    </section>
  );
}
