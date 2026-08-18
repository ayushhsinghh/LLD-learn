import type { Metadata } from "next";
import ParkingLotLesson from "@/content/parking-lot.mdx";
import { FocusLessonShell } from "@/components/learning/focus-lesson-shell";
import { parkingLotLearningSteps } from "@/lib/learning-paths";

export const metadata: Metadata = { title: "Parking Lot Focus Mode", description: "Learn Parking Lot low-level design one decision at a time." };

export default function ParkingLotLearnPage() {
  return <FocusLessonShell title="Parking Lot" completeHref="/problems/parking-lot/" steps={parkingLotLearningSteps}><ParkingLotLesson /></FocusLessonShell>;
}
