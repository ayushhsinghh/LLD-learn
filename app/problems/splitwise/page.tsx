import type { Metadata } from "next";
import SplitwiseLesson from "@/content/splitwise.mdx";
import { LessonShell } from "@/components/lesson-shell";

export const metadata: Metadata = {
  title: "Splitwise",
  description: "A visual, interactive low-level design interview breakdown for shared expenses, split rules, pairwise balances, and debt simplification.",
};

const toc = [
  { id: "requirements", label: "1. Requirements" },
  { id: "entities", label: "2. Entities" },
  { id: "class-design", label: "3. Class design" },
  { id: "implementation", label: "4. Java implementation" },
  { id: "extensions", label: "5. Extensions" },
];

export default function SplitwisePage() {
  return <LessonShell title="Splitwise" eyebrow="Problem 07 · Complete walkthrough" difficulty="Intermediate" duration="50 min" toc={toc} previous={{ href: "/problems/meeting-room-scheduler/", label: "Meeting Room Scheduler" }} next={{ href: "/problems/ride-sharing/", label: "Ride Sharing" }}><SplitwiseLesson /></LessonShell>;
}
