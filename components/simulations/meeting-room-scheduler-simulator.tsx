"use client";

import { CalendarClock, RotateCcw, Sparkles, UsersRound, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Equipment = "PROJECTOR" | "WHITEBOARD" | "VIDEO";
type EquipmentChoice = Equipment | "NONE";
type Meeting = { id: string; title: string; start: number; end: number; organizer: string; createdByUser?: boolean };
type Room = { id: string; name: string; capacity: number; equipment: Equipment[]; meetings: Meeting[] };

const timeOptions = [16, 17, 18, 19, 20, 21, 22, 23, 24];
const formatTime = (halfHour: number) => `${String(Math.floor(halfHour / 2)).padStart(2, "0")}:${halfHour % 2 ? "30" : "00"}`;

const initialRooms: Room[] = [
  { id: "R1", name: "Focus", capacity: 4, equipment: ["PROJECTOR", "WHITEBOARD"], meetings: [{ id: "EX-1", title: "Daily sync", start: 18, end: 20, organizer: "team-a" }] },
  { id: "R2", name: "Cedar", capacity: 6, equipment: ["WHITEBOARD"], meetings: [{ id: "EX-2", title: "Planning", start: 21, end: 23, organizer: "team-b" }] },
  { id: "R3", name: "Atlas", capacity: 10, equipment: ["PROJECTOR", "VIDEO", "WHITEBOARD"], meetings: [{ id: "EX-3", title: "Customer call", start: 19, end: 21, organizer: "team-c" }] },
];

function overlaps(start: number, end: number, meeting: Meeting) {
  return start < meeting.end && meeting.start < end;
}

function evaluateRoom(room: Room, start: number, end: number, attendees: number, equipment: EquipmentChoice) {
  if (room.capacity < attendees) return { room, accepted: false, reason: `needs ${attendees} seats; has ${room.capacity}` };
  if (equipment !== "NONE" && !room.equipment.includes(equipment)) return { room, accepted: false, reason: `does not have ${equipment.toLowerCase()}` };
  const conflict = room.meetings.find((meeting) => overlaps(start, end, meeting));
  if (conflict) return { room, accepted: false, reason: `overlaps ${formatTime(conflict.start)}–${formatTime(conflict.end)}` };
  return { room, accepted: true, reason: "suitable and available" };
}

export function MeetingRoomSchedulerSimulator() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [start, setStart] = useState(20);
  const [end, setEnd] = useState(21);
  const [attendees, setAttendees] = useState(4);
  const [equipment, setEquipment] = useState<EquipmentChoice>("PROJECTOR");
  const [nextMeeting, setNextMeeting] = useState(1);
  const [events, setEvents] = useState<string[]>(["Ready: try 10:00–10:30. Focus becomes free exactly at 10:00."]);

  const evaluations = useMemo(
    () => rooms.map((room) => evaluateRoom(room, start, end, attendees, equipment)),
    [rooms, start, end, attendees, equipment],
  );
  const chosenRoom = [...evaluations]
    .filter((item) => item.accepted)
    .sort((a, b) => a.room.capacity - b.room.capacity || a.room.id.localeCompare(b.room.id))[0]?.room;

  const schedule = () => {
    if (end <= start) {
      setEvents((log) => ["Rejected: end time must be later than start time. No room changed.", ...log].slice(0, 8));
      return;
    }
    if (!chosenRoom) {
      setEvents((log) => [`Rejected: no room is suitable and available for ${formatTime(start)}–${formatTime(end)}.`, ...log].slice(0, 8));
      return;
    }

    const meeting: Meeting = { id: `M${nextMeeting}`, title: "Design review", start, end, organizer: "YOU", createdByUser: true };
    setRooms((current) => current.map((room) => room.id === chosenRoom.id ? { ...room, meetings: [...room.meetings, meeting].sort((a, b) => a.start - b.start) } : room));
    setNextMeeting((value) => value + 1);
    setEvents((log) => [`Scheduled ${meeting.id} in ${chosenRoom.name}: it is the smallest suitable free room.`, ...log].slice(0, 8));
  };

  const cancel = (roomId: string, meetingId: string) => {
    setRooms((current) => current.map((room) => room.id === roomId ? { ...room, meetings: room.meetings.filter((meeting) => meeting.id !== meetingId) } : room));
    setEvents((log) => [`Canceled ${meetingId}. Its room and time are available again.`, ...log].slice(0, 8));
  };

  const reset = () => {
    setRooms(initialRooms);
    setStart(20);
    setEnd(21);
    setAttendees(4);
    setEquipment("PROJECTOR");
    setNextMeeting(1);
    setEvents(["Reset: Focus is occupied until 10:00; a meeting starting at 10:00 may use it."]);
  };

  const loadOverlapEdge = () => {
    setStart(19);
    setEnd(20);
    setAttendees(4);
    setEquipment("PROJECTOR");
    setEvents(["Overlap edge loaded: request 09:30–10:00 with a projector. Check why every room fails."]);
  };

  const loadCapacityEdge = () => {
    setStart(23);
    setEnd(24);
    setAttendees(8);
    setEquipment("PROJECTOR");
    setEvents(["Capacity edge loaded: eight people need a projector. Only Atlas is large enough."]);
  };

  return (
    <section aria-label="Interactive meeting room scheduler simulation" className="my-10 overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-white shadow-[5px_6px_0_#dfd9cd]">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] bg-[var(--ink)] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mint)]">Try the interval rule</p><h3 className="mt-1 !text-xl font-extrabold">Meeting room scheduler</h3></div>
        <Badge className="border-white/20 bg-white/10 text-white"><CalendarClock /> 08:00–12:00</Badge>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_.85fr]">
        <div className="min-w-0 border-b border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-3 grid grid-cols-8 gap-1 text-center font-mono text-[8px] text-[var(--faint)] sm:text-[9px]">
            {timeOptions.slice(0, 8).map((time) => <span key={time}>{formatTime(time)}</span>)}
          </div>
          <div className="space-y-3">
            {rooms.map((room) => {
              const evaluation = evaluations.find((item) => item.room.id === room.id)!;
              return (
                <div key={room.id} className={cn("rounded-xl border bg-white p-3", chosenRoom?.id === room.id ? "border-[var(--mint)] shadow-[3px_3px_0_var(--mint-soft)]" : "border-[var(--line)]") }>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div><strong className="text-sm">{room.name}</strong><p className="mt-1 text-[10px] text-[var(--muted)]"><UsersRound className="mr-1 inline size-3" />{room.capacity} · {room.equipment.map((item) => item.toLowerCase()).join(", ")}</p></div>
                    <span className={cn("rounded px-2 py-1 text-[9px] font-bold", evaluation.accepted ? "bg-[var(--mint-soft)] text-[#28725c]" : "bg-[var(--accent-soft)] text-[var(--accent-dark)]")}>{evaluation.reason}</span>
                  </div>
                  <div className="relative mt-3 h-11 overflow-hidden rounded-lg border border-[var(--line)] bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(12.5%_-_1px),var(--line)_calc(12.5%_-_1px),var(--line)_12.5%)]">
                    {room.meetings.map((meeting) => <div key={meeting.id} className={cn("absolute inset-y-1 flex items-center justify-between gap-1 overflow-hidden rounded-md px-2 text-[9px] font-bold", meeting.createdByUser ? "bg-[var(--mint)] text-white" : "bg-[var(--ink)] text-white")} style={{ left: `${((meeting.start - 16) / 8) * 100}%`, width: `${((meeting.end - meeting.start) / 8) * 100}%` }}><span className="truncate">{meeting.title}</span>{meeting.createdByUser && <button aria-label={`Cancel ${meeting.id}`} onClick={() => cancel(room.id, meeting.id)} className="rounded p-0.5 hover:bg-white/20"><X className="size-3" /></button>}</div>)}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-5 text-[var(--muted)]"><strong>Selection order:</strong> suitable capacity and equipment → no overlap → smallest capacity → room ID.</p>
        </div>

        <div className="min-w-0 p-4 sm:p-6">
          <p className="section-kicker">New meeting request</p>
          <div className="mt-3 rounded-xl border border-[var(--line)] p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="min-w-0 text-xs font-bold text-[var(--muted)]">Start<select aria-label="Meeting start" value={start} onChange={(event) => setStart(Number(event.target.value))} className="mt-1 h-10 w-full min-w-0 rounded-lg border border-[var(--line)] bg-white px-2 text-xs text-[var(--ink)]">{timeOptions.slice(0, -1).map((time) => <option key={time} value={time}>{formatTime(time)}</option>)}</select></label>
              <label className="min-w-0 text-xs font-bold text-[var(--muted)]">End<select aria-label="Meeting end" value={end} onChange={(event) => setEnd(Number(event.target.value))} className="mt-1 h-10 w-full min-w-0 rounded-lg border border-[var(--line)] bg-white px-2 text-xs text-[var(--ink)]">{timeOptions.slice(1).map((time) => <option key={time} value={time}>{formatTime(time)}</option>)}</select></label>
            </div>
            <label className="mt-3 block text-xs font-bold text-[var(--muted)]">Attendees<input aria-label="Attendee count" type="number" min={1} max={12} value={attendees} onChange={(event) => setAttendees(Math.max(1, Number(event.target.value)))} className="mt-1 h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)]" /></label>
            <label className="mt-3 block text-xs font-bold text-[var(--muted)]">Required equipment<select aria-label="Required equipment" value={equipment} onChange={(event) => setEquipment(event.target.value as EquipmentChoice)} className="mt-1 h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)]"><option value="NONE">None</option><option value="PROJECTOR">Projector</option><option value="WHITEBOARD">Whiteboard</option><option value="VIDEO">Video</option></select></label>
            <div className="mt-3 rounded-lg bg-[var(--blue-soft)] px-3 py-2 text-xs leading-5 text-[var(--muted)]">Half-open slot: <strong>[{formatTime(start)}, {formatTime(end)})</strong>. A meeting ending at {formatTime(start)} does not conflict.</div>
            <Button variant="accent" className="mt-3 w-full" onClick={schedule}><CalendarClock /> Schedule meeting</Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2"><Button variant="outline" onClick={reset}><RotateCcw /> Reset</Button><Button variant="ghost" onClick={loadOverlapEdge}>Load overlap</Button><Button variant="ghost" onClick={loadCapacityEdge}>Load capacity edge</Button></div>
        </div>
      </div>

      <div className="border-t border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-5">
        <p className="flex items-center gap-2 text-sm font-extrabold"><Sparkles className="size-4 text-[var(--accent)]" /> What the scheduler decided</p>
        <ol aria-live="polite" className="mt-3 space-y-1.5 font-mono text-[11px] leading-5 text-[var(--muted)]">{events.map((event, index) => <li key={`${event}-${index}`} className={index === 0 ? "font-medium text-[var(--ink)]" : "opacity-60"}>{event}</li>)}</ol>
      </div>
    </section>
  );
}
