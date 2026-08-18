import type { Metadata } from "next";
import NotificationSystemLesson from "@/content/notification-system.mdx";
import { FocusLessonShell } from "@/components/learning/focus-lesson-shell";
import { notificationSystemLearningSteps } from "@/lib/learning-paths";

export const metadata: Metadata = {
  title: "Notification System Focus Mode",
  description: "Learn asynchronous delivery, channel strategies, retries, and thread-safe job tracking one decision at a time.",
};

export default function NotificationSystemLearnPage() {
  return <FocusLessonShell title="Notification System" completeHref="/problems/notification-system/" steps={notificationSystemLearningSteps}><NotificationSystemLesson /></FocusLessonShell>;
}
