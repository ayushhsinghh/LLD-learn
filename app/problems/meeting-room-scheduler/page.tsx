import type { Metadata } from "next";
import MeetingRoomSchedulerLesson from "@/content/meeting-room-scheduler.mdx";
import { LessonShell } from "@/components/lesson-shell";

export const metadata: Metadata = {
  title: "Meeting Room Scheduler",
  description: "A visual, interactive low-level design interview breakdown for meeting-room scheduling and interval conflicts.",
};

const toc = [
  { id: "requirements", label: "1. Requirements" },
  { id: "entities", label: "2. Entities" },
  { id: "class-design", label: "3. Class design" },
  { id: "implementation", label: "4. Java implementation" },
  { id: "extensions", label: "5. Extensions" },
];

export default function MeetingRoomSchedulerPage() {
  return <LessonShell title="Meeting Room Scheduler" eyebrow="Problem 06 · Complete walkthrough" difficulty="Intermediate" duration="45 min" toc={toc} focusHref="/problems/meeting-room-scheduler/learn/" previous={{ href: "/problems/notification-system/", label: "Notification System" }} next={{ href: "/problems/splitwise/", label: "Splitwise" }}><MeetingRoomSchedulerLesson /></LessonShell>;
}
