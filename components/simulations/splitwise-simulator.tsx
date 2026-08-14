"use client";

import { ArrowRight, ReceiptText, RotateCcw, Sparkles, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UserId = "AVA" | "BEN" | "CARA";
type SplitType = "EQUAL" | "EXACT" | "PERCENTAGE";
type Balances = Record<string, number>;
type Expense = { id: string; description: string; payer: UserId; total: number; shares: Record<UserId, number>; type: SplitType };
type Suggestion = { debtor: UserId; creditor: UserId; amount: number };

const users: Array<{ id: UserId; name: string; color: string }> = [
  { id: "AVA", name: "Ava", color: "bg-[#f5a26f]" },
  { id: "BEN", name: "Ben", color: "bg-[#7fc7ae]" },
  { id: "CARA", name: "Cara", color: "bg-[#8fb8d0]" },
];

const nameOf = (id: UserId) => users.find((user) => user.id === id)!.name;
const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const debtKey = (debtor: UserId, creditor: UserId) => `${debtor}->${creditor}`;

function parseMoney(value: string) {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value.trim())) return null;
  const cents = Math.round(Number(value) * 100);
  return cents > 0 ? cents : null;
}

function applyDebt(balances: Balances, debtor: UserId, creditor: UserId, amount: number) {
  if (debtor === creditor || amount === 0) return balances;
  const next = { ...balances };
  const direct = debtKey(debtor, creditor);
  const reverse = debtKey(creditor, debtor);
  const opposite = next[reverse] ?? 0;

  if (opposite === 0) {
    next[direct] = (next[direct] ?? 0) + amount;
  } else if (opposite > amount) {
    next[reverse] = opposite - amount;
  } else if (opposite === amount) {
    delete next[reverse];
  } else {
    delete next[reverse];
    next[direct] = amount - opposite;
  }
  return next;
}

function simplify(balances: Balances): Suggestion[] {
  const net: Record<UserId, number> = { AVA: 0, BEN: 0, CARA: 0 };
  for (const [key, amount] of Object.entries(balances)) {
    const [debtor, creditor] = key.split("->") as [UserId, UserId];
    net[debtor] -= amount;
    net[creditor] += amount;
  }

  const debtors = users.map(({ id }) => ({ id, amount: -net[id] })).filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount || a.id.localeCompare(b.id));
  const creditors = users.map(({ id }) => ({ id, amount: net[id] })).filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount || a.id.localeCompare(b.id));
  const result: Suggestion[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = Math.min(debtor.amount, creditor.amount);
    result.push({ debtor: debtor.id, creditor: creditor.id, amount });
    debtor.amount -= amount;
    creditor.amount -= amount;
    if (debtor.amount === 0) debtorIndex++;
    if (creditor.amount === 0) creditorIndex++;
  }
  return result;
}

function calculateShares(total: number, participants: UserId[], type: SplitType, inputs: Record<UserId, string>) {
  const ordered = [...participants].sort();
  if (ordered.length === 0) return { error: "Choose at least one participant.", shares: null };

  const shares = { AVA: 0, BEN: 0, CARA: 0 } satisfies Record<UserId, number>;
  if (type === "EQUAL") {
    const base = Math.floor(total / ordered.length);
    const extra = total % ordered.length;
    ordered.forEach((id, index) => { shares[id] = base + (index < extra ? 1 : 0); });
    return { error: null, shares };
  }

  if (type === "EXACT") {
    let sum = 0;
    for (const id of ordered) {
      const parsed = parseMoney(inputs[id]);
      if (parsed === null) return { error: `Enter a positive exact share for ${nameOf(id)}.`, shares: null };
      shares[id] = parsed;
      sum += parsed;
    }
    if (sum !== total) return { error: `Exact shares add to ${money(sum)}, not ${money(total)}.`, shares: null };
    return { error: null, shares };
  }

  const percentages = ordered.map((id) => ({ id, value: Number(inputs[id]) }));
  if (percentages.some(({ value }) => !Number.isInteger(value) || value <= 0)) return { error: "Use positive whole percentages in this simulator.", shares: null };
  const sum = percentages.reduce((totalPercent, item) => totalPercent + item.value, 0);
  if (sum !== 100) return { error: `Percentages add to ${sum}%, not 100%.`, shares: null };

  const ranked = percentages.map(({ id, value }) => {
    const numerator = total * value;
    shares[id] = Math.floor(numerator / 100);
    return { id, remainder: numerator % 100 };
  }).sort((a, b) => b.remainder - a.remainder || a.id.localeCompare(b.id));
  let remaining = total - Object.values(shares).reduce((sumCents, value) => sumCents + value, 0);
  for (let index = 0; remaining > 0; index++, remaining--) shares[ranked[index].id]++;
  return { error: null, shares };
}

export function SplitwiseSimulator() {
  const [balances, setBalances] = useState<Balances>({});
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("Dinner");
  const [amount, setAmount] = useState("120");
  const [payer, setPayer] = useState<UserId>("AVA");
  const [participants, setParticipants] = useState<UserId[]>(["AVA", "BEN", "CARA"]);
  const [splitType, setSplitType] = useState<SplitType>("EQUAL");
  const [inputs, setInputs] = useState<Record<UserId, string>>({ AVA: "40", BEN: "40", CARA: "40" });
  const [events, setEvents] = useState<string[]>(["Ready: record the $120 dinner that Ava paid for all three friends."]);

  const total = parseMoney(amount);
  const preview = total === null ? { error: "Enter a positive amount with at most two decimals.", shares: null } : calculateShares(total, participants, splitType, inputs);
  const pairwise = useMemo(() => Object.entries(balances).map(([key, value]) => {
    const [debtor, creditor] = key.split("->") as [UserId, UserId];
    return { debtor, creditor, amount: value };
  }).sort((a, b) => a.debtor.localeCompare(b.debtor) || a.creditor.localeCompare(b.creditor)), [balances]);
  const suggestions = useMemo(() => simplify(balances), [balances]);

  const recordExpense = () => {
    if (total === null || preview.error || !preview.shares) {
      setEvents((current) => [`Rejected: ${preview.error ?? "Enter a valid amount."} No balance changed.`, ...current].slice(0, 8));
      return;
    }
    if (!description.trim()) {
      setEvents((current) => ["Rejected: add a description. No balance changed.", ...current].slice(0, 8));
      return;
    }

    let nextBalances = balances;
    for (const participant of participants) nextBalances = applyDebt(nextBalances, participant, payer, preview.shares[participant]);
    const expense: Expense = { id: `E${expenses.length + 1}`, description: description.trim(), payer, total, shares: preview.shares, type: splitType };
    setBalances(nextBalances);
    setExpenses((current) => [...current, expense]);
    setEvents((current) => [
      `Recorded ${expense.id}: ${nameOf(payer)} paid ${money(total)}; ${splitType.toLowerCase()} shares were applied.`,
      "BalanceSheet canceled any opposite debts before storing the new pairwise result.",
      ...current,
    ].slice(0, 8));
  };

  const settle = (debtor: UserId, creditor: UserId) => {
    const key = debtKey(debtor, creditor);
    const paid = balances[key];
    if (!paid) return;
    const next = { ...balances };
    delete next[key];
    setBalances(next);
    setEvents((current) => [`Settled: ${nameOf(debtor)} paid ${nameOf(creditor)} ${money(paid)}.`, ...current].slice(0, 8));
  };

  const reset = () => {
    setBalances({});
    setExpenses([]);
    setDescription("Dinner");
    setAmount("120");
    setPayer("AVA");
    setParticipants(["AVA", "BEN", "CARA"]);
    setSplitType("EQUAL");
    setInputs({ AVA: "40", BEN: "40", CARA: "40" });
    setEvents(["Reset: nobody owes anything. The dinner example is ready."]);
  };

  const loadTaxi = () => {
    setDescription("Taxi");
    setAmount("60");
    setPayer("BEN");
    setParticipants(["BEN", "CARA"]);
    setSplitType("EQUAL");
    setEvents((current) => ["Taxi example loaded: Ben paid $60 for Ben and Cara. Record it after the dinner.", ...current].slice(0, 8));
  };

  const loadInvalidExact = () => {
    setDescription("Groceries");
    setAmount("90");
    setPayer("CARA");
    setParticipants(["AVA", "BEN", "CARA"]);
    setSplitType("EXACT");
    setInputs({ AVA: "50", BEN: "30", CARA: "5" });
    setEvents((current) => ["Invalid exact split loaded: the shares total $85, so recording must change nothing.", ...current].slice(0, 8));
  };

  const changeType = (type: SplitType) => {
    setSplitType(type);
    if (type === "PERCENTAGE") setInputs({ AVA: "34", BEN: "33", CARA: "33" });
    if (type === "EXACT") setInputs({ AVA: "40", BEN: "40", CARA: "40" });
  };

  const toggleParticipant = (id: UserId) => setParticipants((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <section aria-label="Interactive Splitwise expense simulation" className="my-10 overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-white shadow-[5px_6px_0_#dfd9cd]">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] bg-[var(--ink)] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mint)]">Follow the money</p><h3 className="mt-1 !text-xl font-extrabold">Shared expense lab</h3></div>
        <Badge className="border-white/20 bg-white/10 text-white"><UsersRound /> Weekend group · 3 people</Badge>
      </div>

      <div className="grid lg:grid-cols-[.9fr_1.1fr]">
        <div className="min-w-0 border-b border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="section-kicker">Record an expense</p>
          <div className="mt-3 space-y-3 rounded-xl border border-[var(--line)] bg-white p-4">
            <label className="block text-xs font-bold text-[var(--muted)]">Description<input aria-label="Expense description" value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-[var(--line)] px-3 text-sm text-[var(--ink)]" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="min-w-0 text-xs font-bold text-[var(--muted)]">Amount ($)<input aria-label="Expense amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1 h-10 w-full min-w-0 rounded-lg border border-[var(--line)] px-3 text-sm text-[var(--ink)]" /></label>
              <label className="min-w-0 text-xs font-bold text-[var(--muted)]">Paid by<select aria-label="Expense payer" value={payer} onChange={(event) => setPayer(event.target.value as UserId)} className="mt-1 h-10 w-full min-w-0 rounded-lg border border-[var(--line)] bg-white px-2 text-sm text-[var(--ink)]">{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label>
            </div>
            <fieldset><legend className="text-xs font-bold text-[var(--muted)]">Shared by</legend><div className="mt-2 flex flex-wrap gap-2">{users.map((user) => <button type="button" key={user.id} aria-pressed={participants.includes(user.id)} onClick={() => toggleParticipant(user.id)} className={cn("rounded-lg border px-3 py-2 text-xs font-bold", participants.includes(user.id) ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line)] text-[var(--muted)]")}>{user.name}</button>)}</div></fieldset>
            <label className="block text-xs font-bold text-[var(--muted)]">Split rule<select aria-label="Split rule" value={splitType} onChange={(event) => changeType(event.target.value as SplitType)} className="mt-1 h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)]"><option value="EQUAL">Equal</option><option value="EXACT">Exact amounts</option><option value="PERCENTAGE">Percentages</option></select></label>
            {splitType !== "EQUAL" && <div className="grid grid-cols-3 gap-2">{users.filter((user) => participants.includes(user.id)).map((user) => <label key={user.id} className="min-w-0 text-[10px] font-bold text-[var(--muted)]">{user.name} {splitType === "EXACT" ? "$" : "%"}<input aria-label={`${user.name} ${splitType.toLowerCase()} share`} inputMode="decimal" value={inputs[user.id]} onChange={(event) => setInputs((current) => ({ ...current, [user.id]: event.target.value }))} className="mt-1 h-9 w-full min-w-0 rounded-lg border border-[var(--line)] px-2 text-xs text-[var(--ink)]" /></label>)}</div>}
            <div className={cn("rounded-lg px-3 py-2 text-xs leading-5", preview.error ? "bg-[var(--accent-soft)] text-[var(--accent-dark)]" : "bg-[var(--mint-soft)] text-[var(--muted)]")}>
              {preview.error ?? users.filter((user) => participants.includes(user.id)).map((user) => `${user.name} ${money(preview.shares![user.id])}`).join(" · ")}
            </div>
            <Button variant="accent" className="w-full" onClick={recordExpense}><ReceiptText /> Record expense</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" onClick={reset}><RotateCcw /> Reset</Button><Button variant="ghost" onClick={loadTaxi}>Load taxi</Button><Button variant="ghost" onClick={loadInvalidExact}>Load invalid exact</Button></div>
        </div>

        <div className="min-w-0 p-4 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="min-w-0"><p className="section-kicker">Pairwise BalanceSheet</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">What each pair owes after opposite debts cancel.</p><div className="mt-3 space-y-2">{pairwise.length === 0 ? <p className="rounded-xl border border-dashed border-[var(--line)] p-4 text-center text-xs text-[var(--faint)]">Nobody owes anything yet.</p> : pairwise.map((debt) => <div key={debtKey(debt.debtor, debt.creditor)} className="rounded-xl border border-[var(--line)] p-3"><div className="flex flex-wrap items-center gap-2 text-xs"><strong>{nameOf(debt.debtor)}</strong><ArrowRight className="size-3 text-[var(--accent)]" /><strong>{nameOf(debt.creditor)}</strong><span className="ml-auto font-mono font-bold">{money(debt.amount)}</span></div><button onClick={() => settle(debt.debtor, debt.creditor)} className="mt-2 text-[10px] font-bold text-[var(--accent-dark)] underline underline-offset-2">Settle this direct debt</button></div>)}</div></div>
            <div className="min-w-0"><p className="section-kicker">Simplified suggestions</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">A fresh payment plan with the same net result.</p><div className="mt-3 space-y-2">{suggestions.length === 0 ? <p className="rounded-xl border border-dashed border-[var(--line)] p-4 text-center text-xs text-[var(--faint)]">No payment is needed.</p> : suggestions.map((item) => <div key={debtKey(item.debtor, item.creditor)} className="flex flex-wrap items-center gap-2 rounded-xl border border-[#b7dacc] bg-[var(--mint-soft)] p-3 text-xs"><strong>{nameOf(item.debtor)}</strong><ArrowRight className="size-3 text-[#28725c]" /><strong>{nameOf(item.creditor)}</strong><span className="ml-auto font-mono font-bold">{money(item.amount)}</span></div>)}</div><p className="mt-3 text-[10px] leading-4 text-[var(--faint)]">Suggestions preserve each person&apos;s net total. They do not rewrite the stored expense history.</p></div>
          </div>
          <div className="mt-6 border-t border-[var(--line)] pt-5"><p className="section-kicker">Accepted expenses</p><div className="mt-3 space-y-2">{expenses.length === 0 ? <p className="text-xs text-[var(--faint)]">No expense recorded.</p> : expenses.map((expense) => <div key={expense.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"><Badge className="border-[var(--line)] bg-white text-[var(--ink)]">{expense.id}</Badge><strong>{expense.description}</strong><span className="text-[var(--muted)]">{nameOf(expense.payer)} paid {money(expense.total)}</span><span className="font-mono text-[10px] text-[var(--faint)]">{expense.type}</span></div>)}</div></div>
        </div>
      </div>

      <div className="border-t border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-5">
        <p className="flex items-center gap-2 text-sm font-extrabold"><Sparkles className="size-4 text-[var(--accent)]" /> What the service did</p>
        <ol aria-live="polite" className="mt-3 space-y-1.5 font-mono text-[11px] leading-5 text-[var(--muted)]">{events.map((event, index) => <li key={`${event}-${index}`} className={index === 0 ? "font-medium text-[var(--ink)]" : "opacity-60"}>{event}</li>)}</ol>
      </div>
    </section>
  );
}
