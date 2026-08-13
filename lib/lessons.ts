export type Lesson = {
  slug: string;
  title: string;
  eyebrow: string;
  difficulty: "Beginner" | "Intermediate";
  duration: string;
  summary: string;
  accent: string;
};

export const lessons: Lesson[] = [
  {
    slug: "elevator",
    title: "Elevator System",
    eyebrow: "Complete walkthrough",
    difficulty: "Intermediate",
    duration: "35 min",
    summary: "Derive the requirements, choose the objects, write the Java design, and test it with a working simulation.",
    accent: "#f58a4a",
  },
  {
    slug: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    eyebrow: "Complete walkthrough",
    difficulty: "Beginner",
    duration: "30 min",
    summary: "Turn interview answers into game rules, complete Java classes, and a move-by-move working simulation.",
    accent: "#52a78c",
  },
];

export const lessonHref = (slug: string) => `/problems/${slug}/`;
