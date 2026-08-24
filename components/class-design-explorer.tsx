"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ClassDesignTopic, SupportingDesignType } from "@/lib/class-design-models";
import { cn } from "@/lib/utils";

const supportingKindStyles: Record<SupportingDesignType["kind"], string> = {
  Record: "bg-[var(--blue-soft)] text-[#37627c]",
  Interface: "bg-[#fff0cf] text-[#8a5b13]",
  Implementation: "bg-[var(--mint-soft)] text-[#24745b]",
  Helper: "bg-[var(--paper-2)] text-[var(--muted)]",
};

function MemberList({
  title,
  description,
  members,
}: {
  title: string;
  description: string;
  members: ClassDesignTopic["classes"][number]["state"];
}) {
  return (
    <section aria-label={title}>
      <h4 className="!m-0 !text-base">{title}</h4>
      <p className="mt-1 text-xs leading-5 text-[var(--faint)]">{description}</p>
      <div className="mt-3 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {members.map((member) => (
          <div key={`${member.name}-${member.purpose}`} className="py-3 first:pt-2 last:pb-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="min-w-0 break-words font-mono text-xs font-bold leading-5 text-[var(--accent-dark)]">{member.name}</span>
              {member.access && (
                <span className={cn(
                  "rounded px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.08em]",
                  member.access === "Public API" ? "bg-[var(--mint-soft)] text-[#24745b]" : "bg-[var(--paper-2)] text-[var(--muted)]",
                )}>{member.access}</span>
              )}
            </div>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{member.purpose}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClassPanel({ topic, index }: { topic: ClassDesignTopic; index: number }) {
  const design = topic.classes[index];

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
      <header className="border-b border-[var(--line)] px-4 py-4 sm:px-5">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[var(--faint)]">Class {index + 1} of {topic.classes.length}</p>
        <h3 className="mt-1 !mb-0 !text-2xl">{design.name}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{design.responsibility}</p>
      </header>

      <div className="border-b border-[var(--line)] bg-[var(--accent-soft)] px-4 py-3 sm:px-5">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[var(--accent-dark)]">Requirement behind this class</p>
        <p className="mt-1 text-sm leading-6 text-[var(--ink)]">{design.requirement}</p>
      </div>

      <div className="grid gap-6 px-4 py-5 md:grid-cols-2 md:gap-8 sm:px-5">
        <MemberList title="State it remembers" description="Private information required to perform this class's job." members={design.state} />
        <MemberList title="Behavior it owns" description="Public use cases and internal rules kept beside that state." members={design.behavior} />
      </div>

      <dl className="grid border-t border-[var(--line)] bg-[var(--paper-2)] sm:grid-cols-2">
        {[
          ["Invariant it protects", design.invariant],
          ["Works with", design.collaborators],
          ["Does not own", design.doesNotOwn],
          ["Principle demonstrated", design.principle],
        ].map(([label, value], detailIndex) => (
          <div key={label} className={cn(
            "border-b border-[var(--line)] px-4 py-3 last:border-b-0 sm:px-5",
            detailIndex < 2 ? "sm:border-b" : "sm:border-b-0",
            detailIndex % 2 === 1 && "sm:border-l sm:border-[var(--line)]",
          )}>
            <dt className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[var(--faint)]">{label}</dt>
            <dd className="mt-1 text-xs leading-5 text-[var(--muted)]">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function ClassDesignExplorer({ topic }: { topic: ClassDesignTopic }) {
  const first = topic.classes[0];
  if (!first) return null;

  return (
    <section className="my-7" aria-label={`${topic.label} class design explorer`}>
      <div className="max-w-2xl">
        <p className="section-kicker">One class at a time</p>
        <h3 className="mt-2 !text-2xl">Design the state owners</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Start with the coordinator, then follow the request into the classes that protect changing state. Select a class to see only the fields and behavior needed for its responsibility.</p>
      </div>

      <Tabs defaultValue={first.id} className="mt-5">
        <div className="overflow-x-auto pb-1">
          <TabsList aria-label="Choose a class" className="grid min-w-max grid-flow-col">
            {topic.classes.map((design) => (
              <TabsTrigger key={design.id} value={design.id} className="px-4 py-2 text-xs">{design.name}</TabsTrigger>
            ))}
          </TabsList>
        </div>
        {topic.classes.map((design, index) => (
          <TabsContent key={design.id} value={design.id} className="mt-3">
            <ClassPanel topic={topic} index={index} />
          </TabsContent>
        ))}
      </Tabs>

      {topic.supportingTypes.length > 0 && (
        <section className="mt-7" aria-labelledby={`${topic.id}-supporting-types`}>
          <div className="max-w-2xl">
            <h3 id={`${topic.id}-supporting-types`} className="!m-0 !text-xl">Supporting types</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">These types carry stable data or define replaceable behavior. They support the state owners without becoming another place to store live workflow state.</p>
          </div>
          <div className="mt-4 divide-y divide-[var(--line)] overflow-hidden rounded-xl border border-[var(--line)] bg-white">
            {topic.supportingTypes.map((type) => (
              <article key={`${type.kind}-${type.name}`} className="grid min-w-0 gap-2 px-4 py-4 sm:grid-cols-[minmax(12rem,.65fr)_1.35fr] sm:gap-6 sm:px-5">
                <div className="flex min-w-0 flex-wrap items-center gap-2 self-start">
                  <span className="min-w-0 break-words font-mono text-xs font-bold leading-5 text-[var(--accent-dark)]">{type.name}</span>
                  <span className={cn("rounded px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.08em]", supportingKindStyles[type.kind])}>{type.kind}</span>
                </div>
                <div>
                  <p className="text-sm leading-6 text-[var(--ink)]">{type.purpose}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{type.designNote}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
