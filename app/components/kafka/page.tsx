import type { Metadata } from "next";
import KafkaLesson from "@/content/kafka.mdx";
import { LessonShell } from "@/components/lesson-shell";

export const metadata: Metadata = {
  title: "Apache Kafka",
  description: "Learn Kafka partitions, consumer groups, replay, delivery semantics, and practical use cases through visual simulations and concrete examples.",
};

const toc = [
  { id: "what-is-kafka", label: "1. What is Kafka" },
  { id: "motivation", label: "2. Motivation" },
  { id: "terminology", label: "3. Terminology" },
  { id: "core-mechanics", label: "4. Core mechanics" },
  { id: "use-cases", label: "5. Use-cases" },
  { id: "interview-questions", label: "6. Interview questions" },
  { id: "recap", label: "7. TL;DR" },
];

export default function KafkaPage() {
  return <LessonShell title="Apache Kafka" eyebrow="System component · Complete guide" difficulty="Beginner" duration="45 min" toc={toc} focusHref="/components/kafka/learn/" track="component"><KafkaLesson /></LessonShell>;
}
