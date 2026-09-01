import type { Metadata } from "next";
import KafkaLesson from "@/content/kafka.mdx";
import { FocusLessonShell } from "@/components/learning/focus-lesson-shell";
import { kafkaLearningSteps } from "@/lib/learning-paths";

export const metadata: Metadata = {
  title: "Apache Kafka Focus Mode",
  description: "Learn Kafka fundamentals and trade-offs one visual decision at a time.",
};

export default function KafkaFocusPage() {
  return <FocusLessonShell title="Apache Kafka" completeHref="/components/kafka/" steps={kafkaLearningSteps}><KafkaLesson /></FocusLessonShell>;
}
