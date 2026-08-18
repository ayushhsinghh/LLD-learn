"use client";

import { Mail, MessageSquare, RotateCcw, Smartphone, StepForward } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Channel = "EMAIL" | "SMS" | "PUSH";
type Failure = "NONE" | "TRANSIENT" | "PERMANENT";
type Status = "QUEUED" | "SENDING" | "SENT" | "FAILED";
type Job = { id: string; channel: Channel; destination: string; body: string; failure: Failure; status: Status; attempts: number; lastError?: string };

export function NotificationSystemSimulator({ compact = false }: { compact?: boolean }) {
  const [channel, setChannel] = useState<Channel>("EMAIL");
  const [destination, setDestination] = useState("learner@example.com");
  const [subject, setSubject] = useState("Interview update");
  const [body, setBody] = useState("Your interview starts at 3 PM.");
  const [failure, setFailure] = useState<Failure>("TRANSIENT");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState("Submit returns immediately. Advance a worker to perform one attempt.");
  const nextId = useMemo(() => `N${String(jobs.length + 1).padStart(3, "0")}`, [jobs.length]);

  const submit = () => {
    if (!destination.trim() || !body.trim()) { setMessage("Rejected before queueing: destination and body are required."); return; }
    const job: Job = { id: nextId, channel, destination: destination.trim(), body: body.trim(), failure, status: "QUEUED", attempts: 0 };
    setJobs((value) => [job, ...value].slice(0, compact ? 4 : 8));
    setMessage(`${job.id} accepted as QUEUED. The caller already has its job ID.`);
  };

  const advance = (id: string) => {
    setJobs((current) => current.map((job) => {
      if (job.id !== id || job.status === "SENT" || job.status === "FAILED") return job;
      const attempts = job.attempts + 1;
      const succeeds = job.failure === "NONE" || (job.failure === "TRANSIENT" && attempts >= 2);
      const status: Status = succeeds ? "SENT" : attempts >= 3 ? "FAILED" : "SENDING";
      setMessage(succeeds ? `${job.id} was SENT on attempt ${attempts}.` : status === "FAILED" ? `${job.id} FAILED after exactly three attempts.` : `${job.id} attempt ${attempts} failed. It remains SENDING and may retry.`);
      return { ...job, attempts, status, lastError: succeeds ? undefined : "Provider unavailable" };
    }));
  };

  const reset = () => { setJobs([]); setMessage("Reset complete. No jobs are queued."); };
  const ChannelIcon = channel === "EMAIL" ? Mail : channel === "SMS" ? MessageSquare : Smartphone;

  return <section aria-label="Notification system simulator" className={cn("overflow-hidden rounded-xl border bg-white", compact ? "flex h-full min-h-0 flex-col" : "my-10 rounded-[1.4rem] shadow-[5px_6px_0_#dfd9cd]")}>
    <div className="flex shrink-0 items-center justify-between bg-[var(--ink)] px-4 py-3 text-white"><div><p className="text-[9px] font-bold uppercase tracking-wider text-[var(--mint)]">Deterministic worker lab</p><h3 className={cn("font-extrabold", compact ? "!text-sm" : "!text-xl")}>Notification delivery</h3></div><Button size="sm" variant="ghost" className="text-white" onClick={reset}><RotateCcw /> Reset</Button></div>
    <div className={cn("min-h-0 flex-1", compact ? "grid grid-cols-[.9fr_1.1fr]" : "grid lg:grid-cols-[.8fr_1.2fr]")}>
      <div className="border-r bg-[var(--paper-2)] p-3">
        <div className="grid grid-cols-3 gap-1">{(["EMAIL", "SMS", "PUSH"] as Channel[]).map((item) => <button key={item} type="button" aria-pressed={channel === item} onClick={() => setChannel(item)} className={cn("rounded-lg border px-2 py-2 text-[8px] font-extrabold", channel === item ? "border-[var(--ink)] bg-white" : "border-transparent")}>{item}</button>)}</div>
        <label className="mt-2 block text-[8px] font-bold">Destination<input value={destination} onChange={(event) => setDestination(event.target.value)} className="mt-1 w-full rounded-lg border bg-white px-2 py-1.5 text-[9px]" /></label>
        {!compact && <label className="mt-2 block text-[8px] font-bold">Optional subject<input value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-1 w-full rounded-lg border bg-white px-2 py-1.5 text-[9px]" /></label>}
        <label className="mt-2 block text-[8px] font-bold">Message body<textarea value={body} onChange={(event) => setBody(event.target.value)} rows={compact ? 2 : 3} className="mt-1 w-full resize-none rounded-lg border bg-white px-2 py-1.5 text-[9px]" /></label>
        <label className="mt-2 block text-[8px] font-bold">Provider behavior<select value={failure} onChange={(event) => setFailure(event.target.value as Failure)} className="mt-1 w-full rounded-lg border bg-white px-2 py-1.5 text-[9px]"><option value="NONE">Success immediately</option><option value="TRANSIENT">Fail once, then succeed</option><option value="PERMANENT">Always fail</option></select></label>
        <Button size="sm" variant="accent" className="mt-2 w-full" onClick={submit}><ChannelIcon /> Submit asynchronously</Button>
      </div>
      <div className="flex min-h-0 flex-col p-3"><p aria-live="polite" className="shrink-0 rounded-lg bg-[var(--blue-soft)] px-3 py-2 text-[9px] leading-4 text-[var(--muted)]">{message}</p><div className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-hidden">{jobs.length === 0 ? <div className="grid h-full place-items-center text-center text-[10px] text-[var(--faint)]">No jobs yet</div> : jobs.map((job) => <article key={job.id} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border bg-white px-3 py-2"><div className="min-w-0"><div className="flex items-center gap-2"><strong className="font-mono text-[9px]">{job.id}</strong><span className={cn("rounded px-1.5 py-0.5 text-[7px] font-extrabold", job.status === "SENT" && "bg-[var(--mint-soft)] text-[#24785f]", job.status === "FAILED" && "bg-[#fff0ed] text-[#a23d2e]", (job.status === "QUEUED" || job.status === "SENDING") && "bg-[#fff4cc] text-[#8b641f]")}>{job.status}</span></div><p className="mt-1 truncate text-[8px] text-[var(--muted)]">{job.channel} · attempt {job.attempts}/3 · {job.destination}</p></div><Button size="sm" variant="outline" disabled={job.status === "SENT" || job.status === "FAILED"} onClick={() => advance(job.id)}><StepForward /> <span className={compact ? "sr-only" : undefined}>Run attempt</span></Button></article>)}</div>{!compact && <p className="mt-3 text-[10px] leading-5 text-[var(--muted)]"><strong>What this proves:</strong> acceptance and delivery are separate events. The caller gets an ID before any attempt, while each worker updates only its own job.</p>}</div>
    </div>
  </section>;
}
