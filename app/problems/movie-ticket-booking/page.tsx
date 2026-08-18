import type { Metadata } from "next";
import MovieTicketBookingLesson from "@/content/movie-ticket-booking.mdx";
import { LessonShell } from "@/components/lesson-shell";

export const metadata: Metadata = {
  title: "Movie Ticket Booking",
  description: "A visual, interactive low-level design interview breakdown for safe movie seat holds and bookings.",
};

const toc = [
  { id: "requirements", label: "1. Requirements" },
  { id: "entities", label: "2. Entities" },
  { id: "class-design", label: "3. Class design" },
  { id: "implementation", label: "4. Java implementation" },
  { id: "extensions", label: "5. Extensions" },
];

export default function MovieTicketBookingPage() {
  return <LessonShell title="Movie Ticket Booking" eyebrow="Problem 04 · Complete walkthrough" difficulty="Intermediate" duration="50 min" toc={toc} focusHref="/problems/movie-ticket-booking/learn/" previous={{ href: "/problems/parking-lot/", label: "Parking Lot" }} next={{ href: "/problems/notification-system/", label: "Notification System" }}><MovieTicketBookingLesson /></LessonShell>;
}
