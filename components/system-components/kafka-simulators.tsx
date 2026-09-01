"use client";

import { Gauge, Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════ */
/*  Types                                                              */
/* ═══════════════════════════════════════════════════════════════════ */

type Tone = "idle" | "active" | "success" | "warning" | "error";
type TimelineStep<S> = { label: string; narration: string; state: S };
type Pt = { x: number; y: number };

/* ═══════════════════════════════════════════════════════════════════ */
/*  Palette – glow values use box-shadow syntax                        */
/* ═══════════════════════════════════════════════════════════════════ */

const pal: Record<Tone, { bg: string; border: string; text: string; glow: string }> = {
  idle:    { bg: "#ffffff", border: "#cfd5da", text: "#7a8490", glow: "0 0 0 0 rgba(0,0,0,0)" },
  active:  { bg: "#fff4ec", border: "#e87632", text: "#8d461f", glow: "0 0 28px 2px rgba(232,118,50,.30)" },
  success: { bg: "#ecfaf4", border: "#4dba8c", text: "#1e6b51", glow: "0 0 24px 2px rgba(77,186,140,.22)" },
  warning: { bg: "#fffbeb", border: "#d7ae39", text: "#7c5e14", glow: "0 0 20px 2px rgba(215,174,57,.22)" },
  error:   { bg: "#fff2ef", border: "#d46e60", text: "#963e32", glow: "0 0 20px 2px rgba(212,110,96,.22)" },
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  Geometry – all coordinates use percentage 0-100 to align CSS %     */
/* ═══════════════════════════════════════════════════════════════════ */

/** Cubic-bezier SVG `d` string. Leaves source horizontally / vertically and arrives the same way. */
function makePathD(a: Pt, b: Pt, vert: boolean): string {
  if (vert) {
    const dy = b.y - a.y;
    return `M${a.x} ${a.y} C${a.x} ${a.y + dy * .38},${b.x} ${a.y + dy * .62},${b.x} ${b.y}`;
  }
  const dx = b.x - a.x;
  return `M${a.x} ${a.y} C${a.x + dx * .38} ${a.y},${a.x + dx * .62} ${b.y},${b.x} ${b.y}`;
}

/** Sample N+1 evenly-spaced bezier points for keyframe animation. */
function samplePath(a: Pt, b: Pt, vert: boolean, n = 14) {
  let c1x: number, c1y: number, c2x: number, c2y: number;
  if (vert) {
    const dy = b.y - a.y;
    c1x = a.x; c1y = a.y + dy * .38; c2x = b.x; c2y = a.y + dy * .62;
  } else {
    const dx = b.x - a.x;
    c1x = a.x + dx * .38; c1y = a.y; c2x = a.x + dx * .62; c2y = b.y;
  }
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    xs.push(u * u * u * a.x + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * b.x);
    ys.push(u * u * u * a.y + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * b.y);
  }
  return { xs, ys };
}

function pathMid(a: Pt, b: Pt, vert: boolean): Pt {
  const s = samplePath(a, b, vert, 2);
  return { x: s.xs[1], y: s.ys[1] };
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Mobile hook                                                        */
/* ═══════════════════════════════════════════════════════════════════ */

function subscribeMobile(cb: () => void) {
  const q = window.matchMedia("(max-width:639px)");
  q.addEventListener("change", cb);
  return () => q.removeEventListener("change", cb);
}
function useMobile() {
  return useSyncExternalStore(subscribeMobile, () => window.matchMedia("(max-width:639px)").matches, () => false);
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SelectControl                                                      */
/* ═══════════════════════════════════════════════════════════════════ */

function SelectControl({ label, value, onChange, options }: {
  label: string; value: string | number; onChange: (v: string) => void;
  options: Array<{ label: string; value: string | number }>;
}) {
  return (
    <label className="flex items-center gap-2 text-[10px] font-bold text-[var(--muted)]">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-8 rounded-lg border border-[var(--line)] bg-white px-2 text-[11px] font-bold text-[var(--ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  FlowNode – positioned card with animated glow                     */
/* ═══════════════════════════════════════════════════════════════════ */

function FlowNode({ x, y, label, detail, tone, records, compact }: {
  x: number; y: number; label: string; detail: string; tone: Tone;
  records?: { total: number; done: number }; compact?: boolean;
}) {
  const c = pal[tone];
  return (
    <div className="absolute z-10" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}>
      <motion.div
        className={cn(
          "rounded-2xl border-2 text-center",
          compact
            ? "w-[90px] px-1.5 py-1 sm:w-[115px] sm:px-2 sm:py-1.5"
            : "w-[100px] px-2 py-1.5 sm:w-[162px] sm:px-3.5 sm:py-3",
        )}
        animate={{ backgroundColor: c.bg, borderColor: c.border, boxShadow: c.glow }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <p className={cn("font-extrabold leading-snug text-[#172033]", compact ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-[13px]")}>{label}</p>
        <motion.p
          className={cn("mt-0.5 font-bold leading-snug", compact ? "text-[7px] sm:text-[8px]" : "text-[8px] sm:text-[10px]")}
          animate={{ color: c.text }}
          transition={{ duration: 0.3 }}
        >{detail}</motion.p>
        {records && (
          <div className="mt-1 flex flex-wrap justify-center gap-0.5" aria-label={`${records.done} of ${records.total} processed`}>
            {Array.from({ length: records.total }, (_, i) => (
              <motion.span
                key={i}
                className="grid size-3 place-items-center rounded text-[6px] font-extrabold sm:size-3.5 sm:text-[7px]"
                animate={{ backgroundColor: i < records.done ? "#d7f0e7" : "#fff0c4", color: i < records.done ? "#256b56" : "#7c5e14" }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >{i + 1}</motion.span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  EdgePath – SVG path with animated flowing dashes                   */
/* ═══════════════════════════════════════════════════════════════════ */

function EdgePath({ from, to, active, vert }: { from: Pt; to: Pt; active: boolean; vert: boolean }) {
  const d = makePathD(from, to, vert);
  const rm = useReducedMotion();
  return (
    <>
      {/* quiet baseline */}
      <path d={d} fill="none" stroke="#e2e6ea" strokeWidth={1.2} strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
      {/* active overlay with flowing dashes */}
      <motion.path
        d={d} fill="none" vectorEffect="non-scaling-stroke" strokeDasharray="8 5"
        animate={{
          stroke: active ? "#e87632" : "rgba(232,118,50,0)",
          strokeWidth: active ? 3 : 0,
          strokeDashoffset: active && !rm ? [0, -26] : 0,
        }}
        transition={{
          stroke: { duration: 0.35 },
          strokeWidth: { duration: 0.35 },
          strokeDashoffset: active && !rm ? { duration: 0.7, repeat: Infinity, ease: "linear" } : { duration: 0 },
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  EdgeLabel – HTML pill at the bezier midpoint                       */
/* ═══════════════════════════════════════════════════════════════════ */

function EdgeLabel({ from, to, label, active, vert, compact }: {
  from: Pt; to: Pt; label: string; active: boolean; vert: boolean; compact?: boolean;
}) {
  const mid = pathMid(from, to, vert);
  return (
    <div className="pointer-events-none absolute z-20" style={{ left: `${mid.x}%`, top: `${mid.y}%`, transform: "translate(-50%,-50%)" }}>
      <motion.span
        className={cn(
          "inline-block whitespace-nowrap rounded-full border font-bold shadow-sm backdrop-blur-sm",
          compact ? "px-1.5 py-px text-[6px]" : "px-2 py-0.5 text-[8px]",
        )}
        animate={{
          backgroundColor: active ? "rgba(255,244,236,.95)" : "rgba(255,255,255,.95)",
          borderColor: active ? "#e8c4a8" : "#d7dde1",
          color: active ? "#8d461f" : "#7a8490",
        }}
        transition={{ duration: 0.3 }}
      >{label}</motion.span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  DataPacket – animated pill traveling along a bezier edge           */
/* ═══════════════════════════════════════════════════════════════════ */

function DataPacket({ from, to, label, vert, delay = 0, compact }: {
  from: Pt; to: Pt; label: string; vert: boolean; delay?: number; compact?: boolean;
}) {
  const rm = useReducedMotion();
  const keys = useMemo(() => samplePath(from, to, vert, 14), [from, to, vert]);

  if (rm) return null;

  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute z-30 whitespace-nowrap rounded-full border-2 border-white font-extrabold text-white",
        "shadow-[0_0_14px_4px_rgba(232,118,50,.35)]",
        compact ? "px-1 py-px text-[6px]" : "px-2 py-0.5 text-[8px] sm:px-2.5 sm:py-1 sm:text-[9px]",
      )}
      style={{ backgroundColor: "#e87632" }}
      initial={{ left: `${keys.xs[0]}%`, top: `${keys.ys[0]}%`, x: "-50%", y: "-50%", opacity: 0, scale: 0.5 }}
      animate={{
        left: keys.xs.map((v) => `${v}%`),
        top: keys.ys.map((v) => `${v}%`),
        x: "-50%", y: "-50%",
        opacity: [0, 1, 1, 1, 0],
        scale: [0.5, 1, 1, 1, 0.7],
      }}
      transition={{ duration: 1.3, delay, repeat: Infinity, ease: "linear" }}
    >{label}</motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SimulationFrame – cinematic playback container                     */
/* ═══════════════════════════════════════════════════════════════════ */

type EdgeDef = { id: string; from: Pt; to: Pt; active: boolean; label: string; packetLabel: string };

/** Renders the SVG, labels, and packets for an edge list. Expects to be inside a relative container. */
function EdgeLayer({ edges, vert, compact }: { edges: EdgeDef[]; vert: boolean; compact?: boolean }) {
  return (
    <>
      {/* SVG paths */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {edges.map((e) => <EdgePath key={e.id} from={e.from} to={e.to} active={e.active} vert={vert} />)}
      </svg>
      {/* HTML labels */}
      {edges.map((e) => <EdgeLabel key={`lbl-${e.id}`} from={e.from} to={e.to} label={e.label} active={e.active} vert={vert} compact={compact} />)}
      {/* Animated packets for active edges */}
      {edges.filter((e) => e.active).map((e, i) => (
        <DataPacket key={`pkt-${e.id}`} from={e.from} to={e.to} label={e.packetLabel} vert={vert} delay={i * 0.15} compact={compact} />
      ))}
    </>
  );
}

function SimulationFrame<S>({ title, problem, steps, renderScene, controls, result, decision, compact = false }: {
  title: string; problem: string; steps: TimelineStep<S>[]; renderScene: (state: S) => ReactNode;
  controls?: ReactNode; result: string; decision: string; compact?: boolean;
}) {
  const rm = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const last = steps.length - 1;
  const done = index === last;
  const cur = steps[index];

  useEffect(() => {
    if (!playing || rm || done) return;
    const id = window.setTimeout(() => setIndex((i) => Math.min(i + 1, last)), 1700 / speed);
    return () => clearTimeout(id);
  }, [done, index, last, playing, rm, speed]);

  const restart = () => { setPlaying(false); setIndex(0); };
  const play = () => { if (done) setIndex(0); setPlaying(true); };
  const elapsed = Math.min(index + 1, steps.length);

  return (
    <section
      aria-label={`${title} Kafka flow simulator`}
      className={cn("overflow-hidden rounded-[22px] border border-[#cfd6dc] bg-[#f7f5ef] shadow-[0_18px_45px_rgba(28,38,48,.12)]", compact ? "flex h-full min-h-0 flex-col" : "my-8")}
    >
      {/* ─── header ─────────────────────────────────────────────── */}
      <header className={cn("shrink-0 border-b border-[#d8dde2] bg-white", compact ? "px-3 py-2" : "px-5 py-4")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#25705a]">Kafka live flow</p>
            <h3 className={cn("font-extrabold text-[var(--ink)]", compact ? "!text-sm" : "!text-xl")}>{title}</h3>
            {!compact && <p className="mt-1 max-w-[620px] text-sm leading-5 text-[var(--muted)]">{problem}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">{controls}</div>
        </div>
      </header>

      {/* ─── canvas ─────────────────────────────────────────────── */}
      <div className={cn("relative min-h-0 flex-1", compact ? "p-2" : "p-4 sm:p-5")}>
        <div className={cn("relative overflow-hidden rounded-2xl border border-[#cbd3d9] bg-[#fffdf9]", compact ? "h-full min-h-0" : "aspect-[16/7] min-h-[340px]")}>

          {/* narration overlay */}
          <div className="absolute left-3 right-3 top-3 z-20 rounded-xl border border-[#cbdce8] bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm sm:right-auto sm:max-w-[min(65%,500px)]">
            <div className="flex items-center gap-2">
              <span className="size-2 shrink-0 animate-pulse rounded-full bg-[#e87632] motion-reduce:animate-none" />
              <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#8d461f]">{cur.label}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${index}-${cur.narration.slice(0, 30)}`}
                aria-live="polite"
                className={cn("mt-1 text-[var(--muted)]", compact ? "text-[9px] leading-4" : "text-xs leading-5")}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >{cur.narration}</motion.p>
            </AnimatePresence>
          </div>

          {/* scene area */}
          <div className="h-full w-full pt-14 sm:pt-10">{renderScene(cur.state)}</div>

          {/* result overlay */}
          <AnimatePresence>
            {done && (
              <motion.div
                className="absolute inset-x-3 bottom-3 z-20 rounded-xl border border-[#9bcfbd] bg-[#f0faf6]/95 px-3 py-2 shadow-sm backdrop-blur-sm"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p className={cn("text-[var(--muted)]", compact ? "text-[8px] leading-3" : "text-xs leading-5")}>
                  <strong className="text-[#256b56]">What Kafka changed:</strong> {result}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── footer ─────────────────────────────────────────────── */}
      <footer className={cn("shrink-0 border-t border-[#d8dde2] bg-white", compact ? "px-3 py-2" : "px-5 py-3")}>
        <input
          aria-label="Simulation timeline" type="range" min={0} max={last} step={1} value={index}
          onChange={(e) => { setPlaying(false); setIndex(Number(e.target.value)); }}
          className="block h-2 w-full cursor-pointer accent-[#e87632]"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="accent" onClick={rm ? () => setIndex((v) => Math.min(v + 1, last)) : playing ? () => setPlaying(false) : play} disabled={Boolean(rm && done)}>
              {rm ? <StepForward /> : playing ? <Pause /> : <Play />}
              {rm ? "Next" : playing ? "Pause" : done ? "Replay" : "Play"}
            </Button>
            <Button size="sm" variant="ghost" onClick={restart} aria-label="Restart Kafka flow"><RotateCcw /></Button>
            <span className="font-mono text-[10px] font-bold text-[var(--faint)]">0:{String(elapsed).padStart(2, "0")} / 0:{String(steps.length).padStart(2, "0")}</span>
          </div>
          {!rm && (
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)]">
              <Gauge className="size-3.5" /><span className="sr-only sm:not-sr-only">Speed</span>
              <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="h-8 rounded-lg border border-[var(--line)] bg-white px-1.5 text-[10px] font-bold text-[var(--ink)]">
                <option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.5}>1.5×</option>
              </select>
            </label>
          )}
        </div>
        {!compact && <p className="mt-2 text-xs leading-5 text-[var(--muted)]"><strong className="text-[var(--ink)]">Trade-off:</strong> {decision}</p>}
      </footer>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Scene 1: Order event fan-out                                       */
/* ═══════════════════════════════════════════════════════════════════ */

type OrderState = { topic: number; inventory: Tone; shipping: Tone; analytics: Tone; shippingLag: number; producer: "ready" | "returned" };

function OrderScene({ state, compact }: { state: OrderState; compact?: boolean }) {
  const mobile = useMobile();
  const vert = mobile;
  const pos = mobile
    ? { producer: { x: 50, y: 18 }, topic: { x: 50, y: 45 }, inventory: { x: 15, y: 82 }, shipping: { x: 50, y: 82 }, analytics: { x: 85, y: 82 } }
    : { producer: { x: 13, y: 50 }, topic: { x: 42, y: 50 }, inventory: { x: 78, y: 12 }, shipping: { x: 78, y: 50 }, analytics: { x: 78, y: 88 } };
  const edges: EdgeDef[] = [
    { id: "append", from: pos.producer, to: pos.topic, active: state.topic > 0, label: "append", packetLabel: "OrderCreated" },
    { id: "inv", from: pos.topic, to: pos.inventory, active: state.inventory === "active", label: "inventory group", packetLabel: "offset 0" },
    { id: "ship", from: pos.topic, to: pos.shipping, active: state.shipping === "active", label: `shipping · lag ${state.shippingLag}`, packetLabel: "offset 0" },
    { id: "ana", from: pos.topic, to: pos.analytics, active: state.analytics === "active", label: "analytics group", packetLabel: "offset 0" },
  ];

  return (
    <div role="img" aria-label="OrderCreated flowing through Kafka to independent Inventory, Shipping, and Analytics consumer groups" className="relative h-full w-full">
      <EdgeLayer edges={edges} vert={vert} compact={compact} />
      <FlowNode x={pos.producer.x} y={pos.producer.y} label="Order Service" detail={state.producer} tone={state.producer === "returned" ? "success" : "active"} compact={compact} />
      <FlowNode x={pos.topic.x} y={pos.topic.y} label="orders topic · P0" detail={state.topic ? "offset 0 retained" : "waiting for event"} tone={state.topic ? "active" : "idle"} records={state.topic ? { total: 1, done: state.shippingLag ? 0 : 1 } : undefined} compact={compact} />
      <FlowNode x={pos.inventory.x} y={pos.inventory.y} label="Inventory" detail={state.inventory === "success" ? "committed 1" : state.inventory} tone={state.inventory} compact={compact} />
      <FlowNode x={pos.shipping.x} y={pos.shipping.y} label="Shipping" detail={state.shippingLag ? `lag ${state.shippingLag}` : state.shipping === "success" ? "committed 1" : state.shipping} tone={state.shipping} compact={compact} />
      <FlowNode x={pos.analytics.x} y={pos.analytics.y} label="Analytics" detail={state.analytics === "success" ? "committed 1" : state.analytics} tone={state.analytics} compact={compact} />
    </div>
  );
}

export function KafkaOrderFanoutSimulator({ compact = false }: { compact?: boolean }) {
  const [delay, setDelay] = useState(2);
  const steps = useMemo<TimelineStep<OrderState>[]>(() => {
    const pauseFrames = Array.from({ length: delay }, (_, i) => ({
      label: "Shipping is behind",
      narration: `Inventory and Analytics are done. Shipping remains ${delay - i} beat${delay - i === 1 ? "" : "s"} behind, and only its own lag grows.`,
      state: { topic: 1, inventory: "success" as Tone, shipping: "warning" as Tone, analytics: "success" as Tone, shippingLag: 1, producer: "returned" as const },
    }));
    return [
      { label: "Ready", narration: "The order service is ready to publish one OrderCreated event.", state: { topic: 0, inventory: "idle", shipping: "idle", analytics: "idle", shippingLag: 0, producer: "ready" } },
      { label: "Producer acknowledged", narration: "Kafka appends OrderCreated at offset 0 and acknowledges the producer before downstream work finishes.", state: { topic: 1, inventory: "active", shipping: "warning", analytics: "active", shippingLag: 1, producer: "returned" } },
      ...pauseFrames,
      { label: "Shipping resumes", narration: "Shipping reads its retained record from offset 0. The other groups do not repeat their completed work.", state: { topic: 1, inventory: "success", shipping: "active", analytics: "success", shippingLag: 1, producer: "returned" } },
      { label: "All groups caught up", narration: "Every consumer group has committed offset 1. Shipping lag is now zero.", state: { topic: 1, inventory: "success", shipping: "success", analytics: "success", shippingLag: 0, producer: "returned" } },
    ];
  }, [delay]);
  const controls = <SelectControl label="Shipping delay" value={delay} onChange={(v) => setDelay(Number(v))} options={[{ label: "Short", value: 1 }, { label: "Medium", value: 2 }, { label: "Long", value: 3 }]} />;
  return <SimulationFrame key={`order-${delay}`} title="Order event fan-out" problem="Watch one retained event move independently through three consumer groups." steps={steps} renderScene={(s) => <OrderScene state={s} compact={compact} />} controls={controls} result="A slow Shipping consumer creates lag only for Shipping; the producer and other groups remain independent." decision="Choose Kafka for replayable fan-out. Prefer SQS or RabbitMQ for one simple work queue." compact={compact} />;
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Scene 2: Activity analytics                                        */
/* ═══════════════════════════════════════════════════════════════════ */

type AnalyticsState = { accepted: number; processed: number; lag: number; partitions: number[] };

function AnalyticsScene({ state, compact }: { state: AnalyticsState; compact?: boolean }) {
  const mobile = useMobile();
  const vert = mobile;
  const topicDetail = state.partitions.map((lag, i) => `P${i}:${lag}`).join(" · ");
  const pos = mobile
    ? { app: { x: 50, y: 14 }, topic: { x: 50, y: 46 }, analytics: { x: 50, y: 82 } }
    : { app: { x: 13, y: 50 }, topic: { x: 45, y: 50 }, analytics: { x: 82, y: 50 } };
  const edges: EdgeDef[] = [
    { id: "partition", from: pos.app, to: pos.topic, active: state.accepted > 0, label: "key = userId", packetLabel: "activity" },
    { id: "consume", from: pos.topic, to: pos.analytics, active: state.processed > 0 && state.lag > 0, label: `lag ${state.lag}`, packetLabel: "record" },
  ];

  return (
    <div role="img" aria-label="Keyed activity events entering Kafka partitions and draining into analytics consumers" className="relative h-full w-full">
      <EdgeLayer edges={edges} vert={vert} compact={compact} />
      <FlowNode x={pos.app.x} y={pos.app.y} label="Web App" detail={state.accepted ? `${state.accepted} accepted` : "burst ready"} tone={state.accepted ? "success" : "idle"} compact={compact} />
      <FlowNode x={pos.topic.x} y={pos.topic.y} label="activity topic" detail={topicDetail || "partitions empty"} tone={state.lag ? "warning" : state.accepted ? "success" : "idle"} records={state.accepted ? { total: state.accepted, done: state.processed } : undefined} compact={compact} />
      <FlowNode x={pos.analytics.x} y={pos.analytics.y} label="Analytics" detail={`${state.processed} processed · lag ${state.lag}`} tone={state.lag ? "active" : state.accepted ? "success" : "idle"} compact={compact} />
    </div>
  );
}

export function KafkaActivityAnalyticsSimulator({ compact = false }: { compact?: boolean }) {
  const [burst, setBurst] = useState(8);
  const [partitionCount, setPartitionCount] = useState(3);
  const steps = useMemo<TimelineStep<AnalyticsState>[]>(() => {
    const distribution = Array.from({ length: partitionCount }, (_, i) => Math.floor(burst / partitionCount) + (i < burst % partitionCount ? 1 : 0));
    const midway = Math.ceil(burst / 2);
    const remaining = (processed: number) => {
      let left = processed;
      return distribution.map((count) => { const consumed = Math.min(count, left); left -= consumed; return count - consumed; });
    };
    return [
      { label: "Burst ready", narration: `${burst} activity events are ready. Kafka will partition them by userId.`, state: { accepted: 0, processed: 0, lag: 0, partitions: Array(partitionCount).fill(0) } },
      { label: "Kafka absorbs the burst", narration: `All ${burst} events are appended immediately. Events sharing a userId stay ordered inside the same partition.`, state: { accepted: burst, processed: 0, lag: burst, partitions: distribution } },
      { label: "Consumers make progress", narration: "Consumers work on separate partitions while Kafka exposes the unread records as lag.", state: { accepted: burst, processed: midway, lag: burst - midway, partitions: remaining(midway) } },
      { label: "Lag drains", narration: "The producer does not resend anything. Consumers continue from their offsets.", state: { accepted: burst, processed: Math.max(midway, burst - 2), lag: Math.min(2, burst - midway), partitions: remaining(Math.max(midway, burst - 2)) } },
      { label: "Caught up", narration: `All ${burst} accepted events are processed and every partition has zero lag.`, state: { accepted: burst, processed: burst, lag: 0, partitions: Array(partitionCount).fill(0) } },
    ];
  }, [burst, partitionCount]);
  const controls = (
    <>
      <SelectControl label="Burst" value={burst} onChange={(v) => setBurst(Number(v))} options={[{ label: "6 events", value: 6 }, { label: "8 events", value: 8 }, { label: "10 events", value: 10 }]} />
      <SelectControl label="Partitions" value={partitionCount} onChange={(v) => setPartitionCount(Number(v))} options={[{ label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4", value: 4 }]} />
    </>
  );
  return <SimulationFrame key={`analytics-${burst}-${partitionCount}`} title="Activity analytics burst" problem="Change the burst and partition count, then watch keyed records build and drain lag." steps={steps} renderScene={(s) => <AnalyticsScene state={s} compact={compact} />} controls={controls} result="Kafka absorbs the burst, preserves order per key and partition, and lets consumers drain lag at their own pace." decision="Choose Kafka for continuous high-volume streams. Use direct writes or batches for small, delay-tolerant analytics." compact={compact} />;
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Scene 3: Change-data capture                                       */
/* ═══════════════════════════════════════════════════════════════════ */

type CdcState = { db: number; topic: number; search: number; cache: number; searchLag: number; replaying: boolean };

function CdcScene({ state, compact }: { state: CdcState; compact?: boolean }) {
  const mobile = useMobile();
  const vert = mobile;
  const pos = mobile
    ? { db: { x: 50, y: 14 }, topic: { x: 50, y: 44 }, search: { x: 28, y: 82 }, cache: { x: 72, y: 82 } }
    : { db: { x: 13, y: 50 }, topic: { x: 42, y: 50 }, search: { x: 78, y: 24 }, cache: { x: 78, y: 76 } };
  const edges: EdgeDef[] = [
    { id: "cdc", from: pos.db, to: pos.topic, active: state.topic > 0, label: "CDC", packetLabel: "customer v2" },
    { id: "search", from: pos.topic, to: pos.search, active: state.replaying, label: state.searchLag ? `lag ${state.searchLag}` : "offset 1", packetLabel: "replay v2" },
    { id: "cache", from: pos.topic, to: pos.cache, active: state.topic > 0 && state.cache < state.db, label: "offset 1", packetLabel: "change v2" },
  ];

  return (
    <div role="img" aria-label="A committed database change flowing through CDC and Kafka to Search and Cache" className="relative h-full w-full">
      <EdgeLayer edges={edges} vert={vert} compact={compact} />
      <FlowNode x={pos.db.x} y={pos.db.y} label="Primary DB" detail={`version ${state.db}`} tone="success" compact={compact} />
      <FlowNode x={pos.topic.x} y={pos.topic.y} label="customer changes" detail={state.topic ? "version 2 retained" : "waiting for CDC"} tone={state.topic ? "active" : "idle"} records={state.topic ? { total: 1, done: state.searchLag ? 0 : 1 } : undefined} compact={compact} />
      <FlowNode x={pos.search.x} y={pos.search.y} label="Search" detail={`version ${state.search} · lag ${state.searchLag}`} tone={state.search === state.db ? "success" : state.replaying ? "active" : "warning"} compact={compact} />
      <FlowNode x={pos.cache.x} y={pos.cache.y} label="Cache" detail={`version ${state.cache}`} tone={state.cache === state.db ? "success" : "warning"} compact={compact} />
    </div>
  );
}

export function KafkaCdcSimulator({ compact = false }: { compact?: boolean }) {
  const [pause, setPause] = useState(2);
  const steps = useMemo<TimelineStep<CdcState>[]>(() => {
    const paused = Array.from({ length: pause }, (_, i) => ({
      label: "Search is paused",
      narration: `Cache already shows version 2. Search stays on version 1 for ${pause - i} more beat${pause - i === 1 ? "" : "s"}, while Kafka retains its unread change.`,
      state: { db: 2, topic: 2, search: 1, cache: 2, searchLag: 1, replaying: false },
    }));
    return [
      { label: "Consistent starting point", narration: "The database, Search, and Cache all show customer version 1.", state: { db: 1, topic: 0, search: 1, cache: 1, searchLag: 0, replaying: false } },
      { label: "Committed change captured", narration: "The database commits version 2. CDC appends that committed change to Kafka.", state: { db: 2, topic: 2, search: 1, cache: 1, searchLag: 1, replaying: false } },
      { label: "Cache consumes", narration: "Cache applies version 2. Search is unavailable, so only its own lag remains.", state: { db: 2, topic: 2, search: 1, cache: 2, searchLag: 1, replaying: false } },
      ...paused,
      { label: "Search replays", narration: "Search resumes from its committed offset and reads the retained version 2 change.", state: { db: 2, topic: 2, search: 1, cache: 2, searchLag: 1, replaying: true } },
      { label: "Views converge", narration: "Search reaches version 2. Both downstream views now match the primary database.", state: { db: 2, topic: 2, search: 2, cache: 2, searchLag: 0, replaying: false } },
    ];
  }, [pause]);
  const controls = <SelectControl label="Search outage" value={pause} onChange={(v) => setPause(Number(v))} options={[{ label: "1 beat", value: 1 }, { label: "2 beats", value: 2 }, { label: "3 beats", value: 3 }]} />;
  return <SimulationFrame key={`cdc-${pause}`} title="Change-data capture" problem="Pause Search, retain the database change, then replay it from the committed offset." steps={steps} renderScene={(s) => <CdcScene state={s} compact={compact} />} controls={controls} result="The retained change lets each downstream view recover independently after an outage." decision="Choose Kafka when several systems need a replayable change stream. Direct synchronization is simpler for one small target." compact={compact} />;
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Scene 4: Traffic-spike buffering                                   */
/* ═══════════════════════════════════════════════════════════════════ */

type SpikeState = { accepted: number; complete: number; lag: number; offset: number; total: number; throughput: number };

function SpikeScene({ state, compact }: { state: SpikeState; compact?: boolean }) {
  const mobile = useMobile();
  const vert = mobile;
  const pos = mobile
    ? { source: { x: 50, y: 14 }, topic: { x: 50, y: 46 }, workers: { x: 50, y: 82 } }
    : { source: { x: 13, y: 50 }, topic: { x: 45, y: 50 }, workers: { x: 82, y: 50 } };
  const edges: EdgeDef[] = [
    { id: "append", from: pos.source, to: pos.topic, active: state.accepted > 0, label: "append burst", packetLabel: `${state.total} jobs` },
    { id: "work", from: pos.topic, to: pos.workers, active: state.complete > 0 && state.lag > 0, label: `${state.throughput} per beat`, packetLabel: "work" },
  ];

  return (
    <div role="img" aria-label="A burst of jobs entering Kafka and draining through a bounded worker pool" className="relative h-full w-full">
      <EdgeLayer edges={edges} vert={vert} compact={compact} />
      <FlowNode x={pos.source.x} y={pos.source.y} label="Producers" detail={state.accepted ? `${state.accepted} accepted` : `${state.total} ready`} tone={state.accepted ? "success" : "idle"} compact={compact} />
      <FlowNode x={pos.topic.x} y={pos.topic.y} label="jobs topic" detail={`offset ${state.offset} · lag ${state.lag}`} tone={state.lag ? "warning" : state.accepted ? "success" : "idle"} records={state.accepted ? { total: state.total, done: state.complete } : undefined} compact={compact} />
      <FlowNode x={pos.workers.x} y={pos.workers.y} label={`${state.throughput} Workers`} detail={`${state.complete} complete`} tone={state.lag ? "active" : state.complete ? "success" : "idle"} compact={compact} />
    </div>
  );
}

export function KafkaTrafficSpikeSimulator({ compact = false }: { compact?: boolean }) {
  const [jobs, setJobs] = useState(8);
  const [throughput, setThroughput] = useState(2);
  const steps = useMemo<TimelineStep<SpikeState>[]>(() => {
    const timeline: TimelineStep<SpikeState>[] = [
      { label: "Burst ready", narration: `${jobs} jobs are ready while workers can finish ${throughput} per beat.`, state: { accepted: 0, complete: 0, lag: 0, offset: 0, total: jobs, throughput } },
      { label: "Kafka accepts the burst", narration: `Kafka appends all ${jobs} jobs before workers finish any of them.`, state: { accepted: jobs, complete: 0, lag: jobs, offset: 0, total: jobs, throughput } },
    ];
    for (let complete = Math.min(throughput, jobs); complete <= jobs; complete = Math.min(complete + throughput, jobs)) {
      timeline.push({
        label: complete === jobs ? "Backlog cleared" : "Workers drain lag",
        narration: complete === jobs
          ? `All ${jobs} accepted jobs are complete and lag is zero.`
          : `${complete} jobs are complete. Kafka retains the remaining ${jobs - complete} until workers are ready.`,
        state: { accepted: jobs, complete, lag: jobs - complete, offset: complete, total: jobs, throughput },
      });
      if (complete === jobs) break;
    }
    return timeline;
  }, [jobs, throughput]);
  const controls = (
    <>
      <SelectControl label="Jobs" value={jobs} onChange={(v) => setJobs(Number(v))} options={[{ label: "6", value: 6 }, { label: "8", value: 8 }, { label: "10", value: 10 }]} />
      <SelectControl label="Workers" value={throughput} onChange={(v) => setThroughput(Number(v))} options={[{ label: "1", value: 1 }, { label: "2", value: 2 }, { label: "3", value: 3 }]} />
    </>
  );
  return <SimulationFrame key={`spike-${jobs}-${throughput}`} title="Traffic-spike buffering" problem="Tune the burst and worker capacity, then watch Kafka retain and drain the backlog." steps={steps} renderScene={(s) => <SpikeScene state={s} compact={compact} />} controls={controls} result="Producers finish after Kafka accepts the burst; workers drain the retained backlog at a safe rate." decision="Choose Kafka when retained streams, replay, or several consumer groups matter. SQS is simpler for ordinary background jobs." compact={compact} />;
}
