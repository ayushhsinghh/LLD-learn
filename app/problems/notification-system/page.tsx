import type { Metadata } from "next";
import NotificationSystemLesson from "@/content/notification-system.mdx";
import { LessonShell } from "@/components/lesson-shell";

export const metadata: Metadata = {
  title: "Notification System",
  description: "A visual, interactive low-level design walkthrough for asynchronous multi-channel notification delivery.",
};

const toc = [
  { id: "requirements", label: "1. Requirements" },
  { id: "entities", label: "2. Entities" },
  { id: "class-design", label: "3. Class design" },
  { id: "implementation", label: "4. Java implementation" },
  { id: "extensions", label: "5. Extensions" },
];

export default function NotificationSystemPage() {
  return <LessonShell title="Notification System" eyebrow="Problem 05 · Complete walkthrough" difficulty="Intermediate" duration="50 min" toc={toc} focusHref="/problems/notification-system/learn/" previous={{ href: "/problems/movie-ticket-booking/", label: "Movie Ticket Booking" }} next={{ href: "/problems/meeting-room-scheduler/", label: "Meeting Room Scheduler" }}><NotificationSystemLesson /></LessonShell>;
}
