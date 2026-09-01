import { AlertTriangle, ArrowRight, Check, Database, GitBranch, Layers3, RadioTower, RotateCcw, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type KafkaTerm = { term: string; definition: string };

export const kafkaTerms: KafkaTerm[] = [
  { term: "Record", definition: "One event containing a key, value, timestamp, and optional headers." },
  { term: "Producer", definition: "An application that publishes records to Kafka topics." },
  { term: "Topic", definition: "A named stream of related records." },
  { term: "Partition", definition: "One ordered append-only log within a topic." },
  { term: "Key", definition: "A value commonly used to route related records to the same partition." },
  { term: "Broker", definition: "A Kafka server that stores partitions and serves reads and writes." },
  { term: "Leader", definition: "The replica that handles writes for one partition." },
  { term: "Follower", definition: "A replica that copies the partition leader's log." },
  { term: "Consumer", definition: "An application that reads records from topic partitions." },
  { term: "Consumer group", definition: "Consumers cooperating so each partition is assigned to one member in that group." },
  { term: "Offset", definition: "A record's position in one partition; a committed offset controls where consumption resumes." },
  { term: "Lag", definition: "The records available after a consumer group's current position." },
  { term: "Retention", definition: "How long or how much Kafka keeps records, independent of whether they were read." },
  { term: "Replay", definition: "Reading retained records again from an earlier offset." },
];

export function KafkaTerminology({ terms = kafkaTerms, compact = false }: { terms?: KafkaTerm[]; compact?: boolean }) {
  return <dl className={cn("overflow-hidden rounded-xl border border-[var(--line)] bg-white", compact ? "grid h-full min-h-0 grid-cols-2" : "my-6 grid sm:grid-cols-2")}>
    {terms.map((item) => <div key={item.term} className={cn("min-w-0 border-[var(--line)]", compact ? "border-b border-r px-2 py-1.5 even:border-r-0" : "border-b px-4 py-3 sm:odd:border-r")}><dt className={cn("font-mono font-extrabold text-[var(--accent-dark)]", compact ? "text-[9px]" : "text-xs")}>{item.term}</dt><dd className={cn("mt-0.5 text-[var(--muted)]", compact ? "text-[8px] leading-3" : "text-xs leading-5")}>{item.definition}</dd></div>)}
  </dl>;
}

export function KafkaRecordJourney({ compact = false }: { compact?: boolean }) {
  const items = [
    { icon: RadioTower, label: "Producer", detail: "publishes OrderCreated" },
    { icon: Layers3, label: "Partition", detail: "appends at offset 42" },
    { icon: Database, label: "Broker", detail: "retains the record" },
    { icon: Users, label: "Consumer group", detail: "reads and commits 43" },
  ];
  return <section aria-label="Journey of one Kafka record" className={cn("rounded-xl border border-[var(--line)] bg-[var(--paper-2)]", compact ? "p-2" : "my-6 p-4")}><div className={cn("grid items-center", compact ? "grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-1" : "gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]")}>
    {items.map((item, index) => <div key={item.label} className="contents"><article className={cn("min-w-0 rounded-lg border border-[var(--line)] bg-white text-center", compact ? "px-1 py-2" : "px-3 py-4")}><item.icon className={cn("mx-auto text-[var(--accent)]", compact ? "size-4" : "size-5")} /><strong className={cn("mt-1 block", compact ? "text-[8px]" : "text-xs")}>{item.label}</strong><span className={cn("mt-0.5 block text-[var(--muted)]", compact ? "text-[7px] leading-3" : "text-[10px] leading-4")}>{item.detail}</span></article>{index < items.length - 1 && <ArrowRight className={compact ? "size-3" : "size-4"} />}</div>)}
  </div>{!compact && <p className="mt-3 text-center text-xs leading-5 text-[var(--muted)]">The producer and consumer are decoupled by a durable partition log. Reading a record does not delete it.</p>}</section>;
}

export function KafkaMotivation({ compact = false }: { compact?: boolean }) {
  const rows = [
    ["Direct integration", "Every producer knows every downstream service.", "A slow dependency blocks or fails the caller."],
    ["Database polling", "Each consumer repeatedly asks whether data changed.", "Polling wastes work and makes replay awkward."],
    ["Kafka stream", "Producers append once; consumers read independently.", "Records remain available for lagging groups and replay."],
  ];
  return <section className={cn("overflow-hidden rounded-xl border border-[var(--line)]", compact ? "h-full" : "my-6")}><div className="divide-y divide-[var(--line)]">{rows.map(([title, model, result], index) => <article key={title} className={cn("grid items-center gap-2", compact ? "grid-cols-[.7fr_1fr_1fr] px-2 py-2" : "px-4 py-3 sm:grid-cols-[.7fr_1fr_1fr]", index === 2 && "bg-[var(--mint-soft)]")}><strong className={compact ? "text-[8px]" : "text-xs"}>{title}</strong><p className={cn("text-[var(--muted)]", compact ? "text-[8px] leading-3" : "text-xs leading-5")}>{model}</p><p className={cn("text-[var(--muted)]", compact ? "text-[8px] leading-3" : "text-xs leading-5")}>{result}</p></article>)}</div></section>;
}

export function KafkaBoundary({ compact = false }: { compact?: boolean }) {
  const items = [
    { title: "Not your source of truth", body: "Kafka retains events, but an application database still owns current business state.", icon: Database },
    { title: "Not automatically exactly-once", body: "Retries can duplicate external side effects unless the consumer or destination is idempotent.", icon: RotateCcw },
    { title: "Not the simplest queue", body: "One low-volume worker often needs SQS or RabbitMQ, not a streaming platform.", icon: AlertTriangle },
    { title: "Not global ordering", body: "Kafka orders records inside one partition, not across every partition in a topic.", icon: GitBranch },
  ];
  return <section className={cn("grid gap-2", compact ? "h-full grid-cols-2" : "my-6 sm:grid-cols-2")}>{items.map((item) => <article key={item.title} className={cn("rounded-xl border border-[var(--line)] bg-white", compact ? "p-2" : "p-4")}><item.icon className={cn("text-[var(--accent)]", compact ? "size-4" : "size-5")} /><strong className={cn("mt-2 block", compact ? "text-[9px]" : "text-sm")}>{item.title}</strong><p className={cn("mt-1 text-[var(--muted)]", compact ? "text-[8px] leading-3" : "text-xs leading-5")}>{item.body}</p></article>)}</section>;
}

export function KafkaMechanicBullets({ compact = false }: { compact?: boolean }) {
  const mechanics = [
    ["Partition", "Append-only log; ordering is local to this log."],
    ["Key", "Routes related records to the same partition."],
    ["Replication", "A leader accepts writes; followers copy its log."],
    ["Consumer group", "Splits partitions across cooperating consumers."],
    ["Offset", "Marks where one group should resume reading."],
    ["Retention", "Keeps records after reading so they can be replayed."],
  ];
  return <section className={cn("grid overflow-hidden rounded-xl border border-[var(--line)] bg-white", compact ? "h-full grid-cols-2" : "my-6 sm:grid-cols-2")}><div className="contents">{mechanics.map(([name, body]) => <article key={name} className={cn("border-b border-[var(--line)]", compact ? "px-2 py-1.5 odd:border-r" : "px-4 py-3 sm:odd:border-r")}><strong className={cn("font-mono text-[var(--accent-dark)]", compact ? "text-[8px]" : "text-xs")}>{name}</strong><p className={cn("mt-0.5 text-[var(--muted)]", compact ? "text-[8px] leading-3" : "text-xs leading-5")}>{body}</p></article>)}</div></section>;
}

export function KafkaDeliverySemantics({ compact = false }: { compact?: boolean }) {
  const rows = [
    ["At-most-once", "Commit before processing", "A crash may lose work; duplicates are avoided."],
    ["At-least-once", "Process before commit", "A crash may repeat work; use idempotent effects."],
    ["Kafka exactly-once", "Transactions + read_committed", "Atomic Kafka records and offsets; not arbitrary external effects."],
  ];
  return <section className={cn("overflow-hidden rounded-xl border border-[var(--line)] bg-white", compact ? "h-full" : "my-6")}><div className="divide-y divide-[var(--line)]">{rows.map(([name, order, result]) => <article key={name} className={cn("grid gap-2", compact ? "grid-cols-[.7fr_1fr_1.25fr] px-2 py-2" : "px-4 py-3 sm:grid-cols-[.7fr_1fr_1.25fr]")}><strong className={compact ? "text-[8px]" : "text-xs"}>{name}</strong><span className={cn("text-[var(--muted)]", compact ? "text-[8px] leading-3" : "text-xs leading-5")}>{order}</span><span className={cn("text-[var(--muted)]", compact ? "text-[8px] leading-3" : "text-xs leading-5")}>{result}</span></article>)}</div></section>;
}

export type KafkaUseCaseExample = {
  title: string;
  example: string;
  fit: string;
  boundary: string;
};

export const kafkaRealtimeUseCases: KafkaUseCaseExample[] = [
  {
    title: "Real-time fraud detection",
    example: "CARD-11 produces five payments from three countries within two minutes.",
    fit: "A stream processor groups by card, evaluates a time window, and publishes a SuspiciousActivity event as new payments arrive.",
    boundary: "Blocking a payment is an external side effect, so retries and false positives still need deliberate handling.",
  },
  {
    title: "Logs and operational events",
    example: "Payment, order, and authentication services publish errors with a shared requestId.",
    fit: "Search, security, alerting, and archive consumers can read the same retained stream independently.",
    boundary: "A small application with one log destination may be simpler with a direct collection agent.",
  },
  {
    title: "IoT and device telemetry",
    example: "Delivery vehicle V-18 reports location, speed, and engine temperature every five seconds.",
    fit: "Keying by vehicleId preserves each vehicle's reading order while map, ETA, and maintenance consumers scale separately.",
    boundary: "Kafka transports telemetry; it does not replace device command protocols or a queryable time-series store.",
  },
  {
    title: "Notification pipelines",
    example: "PAYMENT_COMPLETED triggers an email, SMS, and push notification workflow.",
    fit: "The payment service publishes once, while notification consumers retry provider failures without blocking payment completion.",
    boundary: "Consumers need an event ID or another idempotency check to avoid duplicate external messages.",
  },
];

export const kafkaPlatformUseCases: KafkaUseCaseExample[] = [
  {
    title: "Audit and event history",
    example: "ACCOUNT_OPENED, MONEY_DEPOSITED, and MONEY_WITHDRAWN explain how a balance reached ₹800.",
    fit: "Retained ordered events can rebuild derived views and support investigation or controlled replay.",
    boundary: "Configure retention deliberately and keep a separate compliance archive or business source of truth when required.",
  },
  {
    title: "Data integration",
    example: "Committed product changes flow from a database to search, a warehouse, and object storage.",
    fit: "Kafka Connect source and sink connectors move large continuous datasets without every application owning custom integrations.",
    boundary: "A small nightly file or one local target may be clearer as a direct batch load.",
  },
  {
    title: "Cross-region replication",
    example: "An India Kafka cluster mirrors selected topics and consumer positions to a US recovery cluster.",
    fit: "MirrorMaker can replicate topics and related metadata for migration, regional access, or disaster recovery.",
    boundary: "Replication does not resolve conflicting business writes or replace a tested failover plan.",
  },
];

export function KafkaUseCaseCatalog({ items, compact = false }: { items: KafkaUseCaseExample[]; compact?: boolean }) {
  return <section aria-label="Additional Kafka use cases" className={cn("overflow-hidden rounded-xl border border-[var(--line)] bg-white", compact ? "h-full" : "my-6")}>
    <div className="divide-y divide-[var(--line)]">
      {items.map((item) => <article key={item.title} className={cn("grid min-w-0", compact ? "grid-cols-[6.5rem_1fr] gap-2 px-2 py-2" : "gap-2 px-4 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:px-5")}>
        <strong className={cn("text-[var(--ink)]", compact ? "text-[10px] leading-4" : "text-sm leading-6")}>{item.title}</strong>
        <div className={cn("text-[var(--muted)]", compact ? "text-[10px] leading-[0.9rem] sm:text-[11px] sm:leading-4" : "space-y-1.5 text-xs leading-5")}>
          <p><strong className="text-[var(--ink)]">Example:</strong> {item.example}</p>
          <p><strong className="text-[var(--ink)]">Why Kafka:</strong> {item.fit}</p>
          <p><strong className="text-[var(--ink)]">Boundary:</strong> {item.boundary}</p>
        </div>
      </article>)}
    </div>
  </section>;
}

export function KafkaInterviewQuestions({ compact = false }: { compact?: boolean }) {
  const questions = [
    "Why does Kafka partition a topic?",
    "What ordering does Kafka guarantee?",
    "How do consumer groups scale consumption?",
    "What happens when processing succeeds but offset commit fails?",
    "When is Kafka a worse choice than a queue or database?",
  ];
  return <ol className={cn("grid gap-2", compact ? "h-full" : "my-6")}>{questions.map((question, index) => <li key={question} className={cn("flex items-center gap-3 rounded-lg border border-[var(--line)] bg-white", compact ? "px-2 py-1.5" : "px-4 py-3")}><span className={cn("grid shrink-0 place-items-center rounded-full bg-[var(--ink)] font-mono font-bold text-white", compact ? "size-5 text-[8px]" : "size-7 text-[10px]")}>{index + 1}</span><span className={compact ? "text-[9px]" : "text-sm font-bold"}>{question}</span></li>)}</ol>;
}

export function KafkaRecap({ compact = false }: { compact?: boolean }) {
  const items = [
    "A topic is split into ordered partition logs.",
    "Keys keep related records in the same partition.",
    "Replication protects partition availability.",
    "Consumer groups divide partitions, while separate groups read independently.",
    "Committed offsets enable restart, lag tracking, and replay.",
    "Do not use Kafka when a simple low-volume queue or direct call solves the problem.",
  ];
  return <section className={cn("rounded-xl border border-[var(--line)] bg-[var(--paper-2)]", compact ? "h-full p-3" : "my-6 p-5")}><ul className={cn("grid gap-2", compact && "grid-cols-2")}>{items.map((item, index) => <li key={item} className={cn("flex gap-2 rounded-lg border bg-white", compact ? "px-2 py-2 text-[8px] leading-3" : "px-3 py-3 text-xs leading-5", index === items.length - 1 ? "border-[#e5c978]" : "border-[var(--line)]")}><Check className={cn("mt-0.5 shrink-0 text-[var(--mint)]", compact ? "size-3" : "size-4")} /><span>{item}</span></li>)}</ul></section>;
}
