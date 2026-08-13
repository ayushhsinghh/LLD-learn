"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mark = "X" | "O" | null;
type Status = "IN_PROGRESS" | "X_WON" | "O_WON" | "DRAW";
const emptyBoard: Mark[] = Array(9).fill(null);
const wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function evaluate(board: Mark[]): { status: Status; line: number[] } {
  for (const line of wins) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { status: `${board[a]}_WON` as Status, line };
  }
  return { status: board.every(Boolean) ? "DRAW" : "IN_PROGRESS", line: [] };
}

export function TicTacToeSimulator() {
  const [board, setBoard] = useState<Mark[]>(emptyBoard);
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [events, setEvents] = useState<string[]>(["Game created. Player X owns the first turn."]);
  const result = useMemo(() => evaluate(board), [board]);
  const moveCount = board.filter(Boolean).length;

  const play = (index: number) => {
    if (result.status !== "IN_PROGRESS") {
      setEvents((log) => ["Rejected: the game is already finished.", ...log].slice(0, 7));
      return;
    }
    if (board[index]) {
      setEvents((log) => [`Rejected: cell ${index} is occupied. Board remains unchanged.`, ...log].slice(0, 7));
      return;
    }
    const next = [...board];
    next[index] = turn;
    const nextResult = evaluate(next);
    setBoard(next);
    setEvents((log) => [
      nextResult.status === "IN_PROGRESS" ? `Accepted: ${turn} placed at cell ${index}; turn passes to ${turn === "X" ? "O" : "X"}.` : nextResult.status === "DRAW" ? `Accepted: ${turn} placed at cell ${index}; board is full → DRAW.` : `Accepted: ${turn} placed at cell ${index}; rule finds a winning line → ${turn}_WON.`,
      ...log,
    ].slice(0, 7));
    if (nextResult.status === "IN_PROGRESS") setTurn(turn === "X" ? "O" : "X");
  };

  const reset = () => { setBoard(emptyBoard); setTurn("X"); setEvents(["New game. Player X owns the first turn."]); };
  const loadScenario = (kind: "fork" | "draw") => {
    if (kind === "fork") {
      setBoard(["X", "O", null, null, "X", "O", null, null, null]); setTurn("X"); setEvents(["Scenario: X can win on the diagonal. Which cell completes the invariant?"]);
    } else {
      setBoard(["X", "O", "X", "X", "O", "O", "O", "X", null]); setTurn("X"); setEvents(["Scenario: one legal move remains. The rule should return DRAW."]);
    }
  };

  const statusLabel = result.status === "IN_PROGRESS" ? `${turn}'s turn` : result.status === "DRAW" ? "Draw" : `${result.status[0]} wins`;

  return (
    <section aria-label="Interactive Tic-Tac-Toe simulation" className="my-10 overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-white shadow-[5px_6px_0_#dfd9cd]">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] bg-[var(--ink)] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mint)]">Try it yourself</p><h3 className="mt-1 !text-xl font-extrabold">Play and inspect each move</h3></div>
        <div className="flex items-center gap-2"><Badge className="border-white/20 bg-white/10 text-white">Move {moveCount}</Badge><Badge className="border-white/20 bg-white/10 text-white">{statusLabel}</Badge></div>
      </div>

      <div className="grid lg:grid-cols-[.8fr_1.2fr]">
        <div className="border-b border-[var(--line)] bg-[var(--paper-2)] p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="mx-auto grid aspect-square max-w-[360px] grid-cols-3 overflow-hidden rounded-2xl border-[3px] border-[var(--ink)] bg-[var(--ink)] gap-[3px] shadow-[5px_6px_0_var(--accent)]">
            {board.map((mark, index) => (
              <button
                key={index}
                aria-label={`Cell ${Math.floor(index / 3) + 1}, ${index % 3 + 1}${mark ? ` occupied by ${mark}` : " empty"}`}
                onClick={() => play(index)}
                className={cn(
                  "grid place-items-center bg-[#fffdf8] font-display text-5xl font-bold transition hover:bg-[var(--accent-soft)] focus:z-10 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[var(--accent)] sm:text-6xl",
                  result.line.includes(index) && "!bg-[var(--mint)] text-white",
                  mark === "X" ? "text-[var(--ink)]" : "text-[var(--accent)]",
                )}
              >{mark}</button>
            ))}
          </div>
          <p className="mt-6 text-center text-sm font-bold text-[var(--muted)]">Choose an empty cell. Try clicking an occupied cell too.</p>
        </div>

        <div className="p-5 sm:p-7">
          <p className="section-kicker">Live object state</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <StateCard label="Game.status" value={result.status} accent="#52a78c" />
            <StateCard label="Game.current" value={result.status === "IN_PROGRESS" ? `Player ${turn}` : "—"} accent="#f58a4a" />
            <StateCard label="Board.moves" value={`${moveCount} / 9`} accent="#f7d66f" />
          </div>

          <div className="mt-6 rounded-xl border border-[var(--line)] p-4">
            <p className="flex items-center gap-2 text-sm font-extrabold"><Sparkles className="size-4 text-[var(--accent)]" /> What happened</p>
            <ol aria-live="polite" className="mt-3 space-y-2 font-mono text-[11px] leading-5 text-[var(--muted)]">{events.map((event, index) => <li key={`${event}-${index}`} className={cn("rounded-lg px-3 py-2", index === 0 ? "bg-[var(--mint-soft)] font-medium text-[var(--ink)]" : "bg-[var(--paper-2)] opacity-65")}>{event}</li>)}</ol>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={reset}><RotateCcw /> New game</Button>
            <Button variant="outline" onClick={() => loadScenario("fork")}>Load win</Button>
            <Button variant="outline" onClick={() => loadScenario("draw")}>Load draw</Button>
          </div>
        </div>
      </div>

      <div className="grid border-t border-[var(--line)] bg-[var(--paper-2)] sm:grid-cols-4">
        {["UI sends intent", "Game checks status", "Board validates cell", "Rule evaluates result"].map((step, index) => <div key={step} className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-white font-mono text-[10px] font-bold">{index + 1}</span><span className="text-xs font-bold text-[var(--muted)]">{step}</span></div>)}
      </div>
    </section>
  );
}

function StateCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3"><div className="mb-3 h-1 w-7 rounded-full" style={{ background: accent }} /><p className="font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--faint)]">{label}</p><p className="mt-1 truncate font-mono text-xs font-bold text-[var(--ink)]">{value}</p></div>;
}
