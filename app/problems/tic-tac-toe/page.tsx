import type { Metadata } from "next";
import TicTacToeLesson from "@/content/tic-tac-toe.mdx";
import { LessonShell } from "@/components/lesson-shell";

export const metadata: Metadata = { title: "Tic-Tac-Toe", description: "A visual, interactive low-level design interview breakdown for Tic-Tac-Toe." };

const toc = [
  { id: "requirements", label: "1. Requirements" },
  { id: "entities", label: "2. Entities" },
  { id: "class-design", label: "3. Class design" },
  { id: "implementation", label: "4. Java implementation" },
  { id: "extensions", label: "5. Extensions" },
];

export default function TicTacToePage() {
  return <LessonShell title="Tic-Tac-Toe" eyebrow="Problem 02 · Complete walkthrough" difficulty="Beginner" duration="30 min" toc={toc} previous={{ href: "/problems/elevator/", label: "Elevator System" }}><TicTacToeLesson /></LessonShell>;
}
