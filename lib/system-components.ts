export type SystemComponentLesson = {
  slug: string;
  title: string;
  eyebrow: string;
  difficulty: "Beginner" | "Intermediate";
  duration: string;
  summary: string;
  accent: string;
  focusHref: string;
};

export const systemComponents: SystemComponentLesson[] = [
  {
    slug: "kafka",
    title: "Apache Kafka",
    eyebrow: "System component",
    difficulty: "Beginner",
    duration: "45 min",
    summary: "Understand Kafka mechanics through orders, analytics, CDC, traffic spikes, streaming, integration, and recovery examples.",
    accent: "#e28a4a",
    focusHref: "/components/kafka/learn/",
  },
];

export const componentHref = (slug: string) => `/components/${slug}/`;
