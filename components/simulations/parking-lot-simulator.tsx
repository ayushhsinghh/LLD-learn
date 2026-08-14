"use client";

import { CarFront, LogOut, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VehicleType = "MOTORCYCLE" | "CAR";
type SpotType = "MOTORCYCLE" | "COMPACT" | "LARGE";
type Spot = { id: string; floor: number; type: SpotType; vehicle: Vehicle | null };
type Vehicle = { plate: string; type: VehicleType };
type Ticket = { id: string; vehicle: Vehicle; spotId: string; floor: number };

const initialSpots: Spot[] = [
  { id: "M-01", floor: 0, type: "MOTORCYCLE", vehicle: null },
  { id: "C-01", floor: 0, type: "COMPACT", vehicle: null },
  { id: "L-01", floor: 0, type: "LARGE", vehicle: null },
  { id: "M-11", floor: 1, type: "MOTORCYCLE", vehicle: null },
  { id: "C-11", floor: 1, type: "COMPACT", vehicle: null },
  { id: "L-11", floor: 1, type: "LARGE", vehicle: null },
];

function canFit(vehicle: Vehicle, spot: Spot) {
  if (vehicle.type === "CAR") return spot.type === "COMPACT" || spot.type === "LARGE";
  return true;
}

function preference(vehicle: Vehicle, spot: Spot) {
  if (vehicle.type === "CAR") return spot.type === "COMPACT" ? 0 : 1;
  if (spot.type === "MOTORCYCLE") return 0;
  return spot.type === "COMPACT" ? 1 : 2;
}

function chooseSpot(spots: Spot[], vehicle: Vehicle) {
  return [...spots]
    .filter((spot) => !spot.vehicle && canFit(vehicle, spot))
    .sort((a, b) => a.floor - b.floor || preference(vehicle, a) - preference(vehicle, b) || a.id.localeCompare(b.id))[0];
}

export function ParkingLotSimulator() {
  const [spots, setSpots] = useState<Spot[]>(initialSpots);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [plate, setPlate] = useState("KA-01-AB-1234");
  const [vehicleType, setVehicleType] = useState<VehicleType>("CAR");
  const [nextTicket, setNextTicket] = useState(1);
  const [events, setEvents] = useState<string[]>(["Lot ready. Six spots are free across two floors."]);

  const freeCount = spots.filter((spot) => !spot.vehicle).length;
  const compatibleCount = useMemo(
    () => spots.filter((spot) => !spot.vehicle && canFit({ plate: "preview", type: vehicleType }, spot)).length,
    [spots, vehicleType],
  );

  const park = () => {
    const normalizedPlate = plate.trim().toUpperCase();
    if (!normalizedPlate) {
      setEvents((log) => ["Rejected: a license plate is required. No spot changed.", ...log].slice(0, 8));
      return;
    }
    if (tickets.some((ticket) => ticket.vehicle.plate === normalizedPlate)) {
      setEvents((log) => [`Rejected: ${normalizedPlate} already has an active ticket. No spot changed.`, ...log].slice(0, 8));
      return;
    }

    const vehicle = { plate: normalizedPlate, type: vehicleType };
    const selected = chooseSpot(spots, vehicle);
    if (!selected) {
      setEvents((log) => [`Rejected: no compatible free spot exists for ${vehicleType}.`, ...log].slice(0, 8));
      return;
    }

    const ticket: Ticket = { id: `T${String(nextTicket).padStart(3, "0")}`, vehicle, spotId: selected.id, floor: selected.floor };
    setSpots((current) => current.map((spot) => spot.id === selected.id ? { ...spot, vehicle } : spot));
    setTickets((current) => [...current, ticket]);
    setNextTicket((value) => value + 1);
    setEvents((log) => [`Accepted: ${ticket.id} assigns ${normalizedPlate} to floor ${selected.floor}, spot ${selected.id}.`, ...log].slice(0, 8));
    setPlate(`KA-01-AB-${String(nextTicket + 1).padStart(4, "0")}`);
  };

  const leave = (ticketId: string) => {
    const ticket = tickets.find((item) => item.id === ticketId);
    if (!ticket) {
      setEvents((log) => [`Rejected: ticket ${ticketId} is not active.`, ...log].slice(0, 8));
      return;
    }
    setSpots((current) => current.map((spot) => spot.id === ticket.spotId ? { ...spot, vehicle: null } : spot));
    setTickets((current) => current.filter((item) => item.id !== ticketId));
    setEvents((log) => [`Exit complete: ${ticket.vehicle.plate} left ${ticket.spotId}; the spot is free again.`, ...log].slice(0, 8));
  };

  const reset = () => {
    setSpots(initialSpots);
    setTickets([]);
    setNextTicket(1);
    setPlate("KA-01-AB-1234");
    setVehicleType("CAR");
    setEvents(["Simulation reset. All spots are free."]);
  };

  const loadCompatibilityEdge = () => {
    const occupied = initialSpots.map((spot) => {
      if (spot.type === "MOTORCYCLE") return spot;
      return { ...spot, vehicle: { plate: `USED-${spot.id}`, type: "CAR" as const } };
    });
    setSpots(occupied);
    setTickets(occupied.filter((spot) => spot.vehicle).map((spot, index) => ({
      id: `E${index + 1}`,
      vehicle: spot.vehicle!,
      spotId: spot.id,
      floor: spot.floor,
    })));
    setVehicleType("CAR");
    setPlate("KA-EDGE-0001");
    setNextTicket(1);
    setEvents(["Edge case loaded: two spots are free, but both are motorcycle-only. Try parking a car."]);
  };

  return (
    <section aria-label="Interactive parking lot simulation" className="my-10 overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-white shadow-[5px_6px_0_#dfd9cd]">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] bg-[var(--ink)] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mint)]">Try the allocation rule</p><h3 className="mt-1 !text-xl font-extrabold">Parking lot simulator</h3></div>
        <div className="flex gap-2"><Badge className="border-white/20 bg-white/10 text-white">{freeCount} free</Badge><Badge className="border-white/20 bg-white/10 text-white">{tickets.length} active tickets</Badge></div>
      </div>

      <div className="grid lg:grid-cols-[1.08fr_.92fr]">
        <div className="border-b border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-6 lg:border-b-0 lg:border-r">
          {[0, 1].map((floor) => (
            <div key={floor} className="mb-5 last:mb-0">
              <div className="mb-2 flex items-center justify-between"><strong className="text-sm">Floor {floor}</strong><span className="font-mono text-[10px] text-[var(--faint)]">checked {floor === 0 ? "first" : "second"}</span></div>
              <div className="grid grid-cols-3 gap-2">
                {spots.filter((spot) => spot.floor === floor).map((spot) => (
                  <div key={spot.id} className={cn("min-h-28 rounded-xl border-2 border-dashed p-3 transition", spot.vehicle ? "border-[var(--ink)] bg-white" : "border-[#9db8ad] bg-[var(--mint-soft)]") }>
                    <div className="flex flex-col items-start gap-1 sm:flex-row sm:justify-between sm:gap-2"><span className="whitespace-nowrap font-mono text-[10px] font-bold">{spot.id}</span><span className="whitespace-nowrap rounded bg-white px-1.5 py-1 font-mono text-[7px] font-bold text-[var(--faint)] sm:text-[8px]">{spot.type}</span></div>
                    <div className="mt-4 text-center">
                      {spot.vehicle ? <><CarFront className="mx-auto size-7 text-[var(--accent-dark)]" /><p className="mt-2 truncate font-mono text-[9px] font-bold">{spot.vehicle.plate}</p></> : <p className="pt-2 text-xs font-bold text-[#28725c]">Available</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className="mt-5 text-xs leading-5 text-[var(--muted)]"><strong>Selection order:</strong> lower floor → smallest suitable spot type → spot ID.</p>
        </div>

        <div className="p-4 sm:p-6">
          <p className="section-kicker">Entry gate</p>
          <div className="mt-3 rounded-xl border border-[var(--line)] p-4">
            <label className="text-xs font-bold text-[var(--muted)]">License plate<input aria-label="License plate" value={plate} onChange={(event) => setPlate(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 font-mono text-sm uppercase text-[var(--ink)] outline-none focus:ring-4 focus:ring-[var(--focus)]" /></label>
            <label className="mt-3 block text-xs font-bold text-[var(--muted)]">Vehicle type<select aria-label="Vehicle type" value={vehicleType} onChange={(event) => setVehicleType(event.target.value as VehicleType)} className="mt-1 h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] outline-none focus:ring-4 focus:ring-[var(--focus)]"><option value="CAR">Car</option><option value="MOTORCYCLE">Motorcycle</option></select></label>
            <div className="mt-3 rounded-lg bg-[var(--blue-soft)] px-3 py-2 text-xs text-[var(--muted)]">Strategy currently sees <strong>{compatibleCount}</strong> compatible free {compatibleCount === 1 ? "spot" : "spots"}.</div>
            <Button variant="accent" className="mt-3 w-full" onClick={park}><CarFront /> Park vehicle</Button>
          </div>

          <div className="mt-5">
            <p className="section-kicker">Active tickets</p>
            <div className="mt-2 max-h-44 space-y-2 overflow-y-auto">
              {tickets.length === 0 && <p className="rounded-lg bg-[var(--paper-2)] px-3 py-4 text-center text-xs text-[var(--faint)]">No vehicles are parked.</p>}
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--line)] px-3 py-2">
                  <div className="min-w-0"><p className="font-mono text-[10px] font-bold">{ticket.id} · {ticket.spotId}</p><p className="truncate text-xs text-[var(--muted)]">{ticket.vehicle.plate}</p></div>
                  <Button size="sm" variant="outline" onClick={() => leave(ticket.id)}><LogOut /> Exit</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2"><Button variant="outline" onClick={reset}><RotateCcw /> Reset</Button><Button variant="ghost" onClick={loadCompatibilityEdge}>Load edge case</Button></div>
        </div>
      </div>

      <div className="border-t border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-5">
        <p className="flex items-center gap-2 text-sm font-extrabold"><Sparkles className="size-4 text-[var(--accent)]" /> What the objects did</p>
        <ol aria-live="polite" className="mt-3 space-y-1.5 font-mono text-[11px] leading-5 text-[var(--muted)]">{events.map((event, index) => <li key={`${event}-${index}`} className={index === 0 ? "font-medium text-[var(--ink)]" : "opacity-60"}>{event}</li>)}</ol>
      </div>
    </section>
  );
}
