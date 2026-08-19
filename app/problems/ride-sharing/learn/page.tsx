import type { Metadata } from "next";
import RideSharingLesson from "@/content/ride-sharing.mdx";
import { FocusLessonShell } from "@/components/learning/focus-lesson-shell";
import { rideSharingLearningSteps } from "@/lib/learning-paths";

export const metadata: Metadata = {
  title: "Ride Sharing Focus Mode",
  description: "Learn Ride Sharing low-level design, weighted routing, Dijkstra, matching, and lifecycle one decision at a time.",
};

export default function RideSharingFocusPage() {
  return <FocusLessonShell title="Ride Sharing" completeHref="/problems/ride-sharing/" steps={rideSharingLearningSteps}><RideSharingLesson /></FocusLessonShell>;
}
