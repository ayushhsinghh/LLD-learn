import type { Metadata } from "next";
import ParkingLotLesson from "@/content/parking-lot.mdx";
import { LessonShell } from "@/components/lesson-shell";

export const metadata: Metadata = { title: "Parking Lot", description: "A visual, interactive low-level design interview breakdown for a parking lot." };

const toc = [
  { id: "requirements", label: "1. Requirements" },
  { id: "entities", label: "2. Entities" },
  { id: "class-design", label: "3. Class design" },
  { id: "implementation", label: "4. Java implementation" },
  { id: "extensions", label: "5. Extensions" },
];

export default function ParkingLotPage() {
  return <LessonShell title="Parking Lot" eyebrow="Problem 03 · Complete walkthrough" difficulty="Intermediate" duration="40 min" toc={toc} previous={{ href: "/problems/tic-tac-toe/", label: "Tic-Tac-Toe" }} next={{ href: "/problems/movie-ticket-booking/", label: "Movie Ticket Booking" }}><ParkingLotLesson /></LessonShell>;
}
