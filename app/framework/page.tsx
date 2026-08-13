import type { Metadata } from "next";
import FrameworkLesson from "@/content/framework.mdx";
import { LessonShell } from "@/components/lesson-shell";

export const metadata: Metadata = { title: "LLD Interview Framework", description: "A five-step method for low-level design interviews." };

const toc = [
  { id: "requirements", label: "1. Requirements" },
  { id: "entities", label: "2. Entities" },
  { id: "class-design", label: "3. Class design" },
  { id: "implementation", label: "4. Implementation" },
  { id: "extensions", label: "5. Extensions" },
];

export default function FrameworkPage() {
  return <LessonShell title="LLD Interview Framework" eyebrow="Use this for every problem" difficulty="5 steps" duration="35 min" toc={toc} next={{ href: "/problems/elevator/", label: "Elevator System" }}><FrameworkLesson /></LessonShell>;
}
