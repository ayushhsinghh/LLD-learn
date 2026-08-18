export type Lesson = {
  slug: string;
  title: string;
  eyebrow: string;
  difficulty: "Beginner" | "Intermediate";
  duration: string;
  summary: string;
  accent: string;
  focusHref?: string;
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
    focusHref: "/problems/tic-tac-toe/learn/",
  },
  {
    slug: "parking-lot",
    title: "Parking Lot",
    eyebrow: "Complete walkthrough",
    difficulty: "Intermediate",
    duration: "40 min",
    summary: "Turn vague parking rules into spot ownership, a deterministic allocation strategy, complete Java code, and an interactive lot.",
    accent: "#f7d66f",
  },
  {
    slug: "movie-ticket-booking",
    title: "Movie Ticket Booking",
    eyebrow: "Complete walkthrough",
    difficulty: "Intermediate",
    duration: "50 min",
    summary: "Derive seat holds and booking rules, make concurrent requests safe, and prove the design with complete Java and an interactive race lab.",
    accent: "#ee9360",
    focusHref: "/problems/movie-ticket-booking/learn/",
  },
  {
    slug: "notification-system",
    title: "Notification System",
    eyebrow: "Complete walkthrough",
    difficulty: "Intermediate",
    duration: "50 min",
    summary: "Design asynchronous multi-channel delivery, bounded retries, thread-safe job tracking, and graceful shutdown with complete Java and an interactive worker lab.",
    accent: "#6aa99b",
    focusHref: "/problems/notification-system/learn/",
  },
  {
    slug: "meeting-room-scheduler",
    title: "Meeting Room Scheduler",
    eyebrow: "Complete walkthrough",
    difficulty: "Intermediate",
    duration: "45 min",
    summary: "Turn time ranges into precise interval rules, choose the smallest suitable available room, and test the design with complete Java and an interactive schedule.",
    accent: "#7fc7ae",
    focusHref: "/problems/meeting-room-scheduler/learn/",
  },
  {
    slug: "splitwise",
    title: "Splitwise",
    eyebrow: "Complete walkthrough",
    difficulty: "Intermediate",
    duration: "50 min",
    summary: "Turn shared bills into exact split rules, net pairwise debts safely, and simplify repayments with complete Java and an interactive expense lab.",
    accent: "#8fb8d0",
  },
  {
    slug: "ride-sharing",
    title: "Ride Sharing",
    eyebrow: "Complete walkthrough",
    difficulty: "Intermediate",
    duration: "60 min",
    summary: "Separate driver matching from road routing, trace Dijkstra step by step, and complete a ride lifecycle with Java and an interactive dispatch lab.",
    accent: "#6ab6a1",
  },
];

export const lessonHref = (slug: string) => `/problems/${slug}/`;
