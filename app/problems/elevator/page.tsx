import type { Metadata } from "next";
import ElevatorLesson from "@/content/elevator.mdx";
import { LessonShell } from "@/components/lesson-shell";

export const metadata: Metadata = { title: "Elevator System", description: "A visual, interactive low-level design interview breakdown for an elevator system." };

const toc = [
  { id: "requirements", label: "1. Requirements" },
  { id: "entities", label: "2. Entities" },
  { id: "class-design", label: "3. Class design" },
  { id: "implementation", label: "4. Java implementation" },
  { id: "extensions", label: "5. Extensions" },
];

export default function ElevatorPage() {
  return <LessonShell title="Elevator System" eyebrow="Problem 01 · Complete walkthrough" difficulty="Intermediate" duration="35 min" toc={toc} previous={{ href: "/framework/", label: "Interview Framework" }} next={{ href: "/problems/tic-tac-toe/", label: "Tic-Tac-Toe" }}><ElevatorLesson /></LessonShell>;
}
