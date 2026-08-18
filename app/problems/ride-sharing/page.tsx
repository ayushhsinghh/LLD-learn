import type { Metadata } from "next";
import RideSharingLesson from "@/content/ride-sharing.mdx";
import { LessonShell } from "@/components/lesson-shell";

export const metadata: Metadata = {
  title: "Ride Sharing",
  description: "A visual, interactive low-level design interview breakdown for driver matching, ride state, road graphs, and Dijkstra routing.",
};

const toc = [
  { id: "requirements", label: "1. Requirements" },
  { id: "entities", label: "2. Entities" },
  { id: "class-design", label: "3. Class design" },
  { id: "implementation", label: "4. Java implementation" },
  { id: "extensions", label: "5. Extensions" },
];

export default function RideSharingPage() {
  return <LessonShell title="Ride Sharing" eyebrow="Problem 08 · Complete walkthrough" difficulty="Intermediate" duration="60 min" toc={toc} previous={{ href: "/problems/splitwise/", label: "Splitwise" }}><RideSharingLesson /></LessonShell>;
}
