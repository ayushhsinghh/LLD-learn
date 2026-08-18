import type { Metadata } from "next";
import MovieTicketBookingLesson from "@/content/movie-ticket-booking.mdx";
import { FocusLessonShell } from "@/components/learning/focus-lesson-shell";
import { movieTicketBookingLearningSteps } from "@/lib/learning-paths";

export const metadata: Metadata = {
  title: "Movie Ticket Booking Focus Mode",
  description: "Learn safe movie seat holds, state transitions, and concurrency one decision at a time.",
};

export default function MovieTicketBookingLearnPage() {
  return <FocusLessonShell title="Movie Ticket Booking" completeHref="/problems/movie-ticket-booking/" steps={movieTicketBookingLearningSteps}><MovieTicketBookingLesson /></FocusLessonShell>;
}
