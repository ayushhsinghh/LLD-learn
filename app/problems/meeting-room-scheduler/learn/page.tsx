import type { Metadata } from "next";
import MeetingRoomSchedulerLesson from "@/content/meeting-room-scheduler.mdx";
import { FocusLessonShell } from "@/components/learning/focus-lesson-shell";
import { meetingRoomSchedulerLearningSteps } from "@/lib/learning-paths";

export const metadata: Metadata = {
  title: "Meeting Room Scheduler Focus Mode",
  description: "Learn interval scheduling and ordered room calendars one decision at a time.",
};

export default function MeetingRoomSchedulerLearnPage() {
  return <FocusLessonShell title="Meeting Room Scheduler" completeHref="/problems/meeting-room-scheduler/" steps={meetingRoomSchedulerLearningSteps}><MeetingRoomSchedulerLesson /></FocusLessonShell>;
}
