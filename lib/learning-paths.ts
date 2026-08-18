export type LearningPhase = "start" | "requirements" | "entities" | "class-design" | "implementation" | "extensions";

export type LearningStep = {
  id: string;
  legacyIds?: string[];
  phase: LearningPhase;
  title: string;
  eyebrow: string;
  minutes: number;
};

export const learningPhaseLabels: Record<LearningPhase, string> = {
  start: "Start",
  requirements: "Requirements",
  entities: "Entities",
  "class-design": "Class design",
  implementation: "Implementation",
  extensions: "Extensions",
};

export const ticTacToeLearningSteps: LearningStep[] = [
  { id: "orientation", phase: "start", title: "See the game loop", eyebrow: "Mental model", minutes: 1 },
  { id: "framework", phase: "start", title: "Use the five-phase method", eyebrow: "Reusable interview path", minutes: 1 },
  { id: "interview-dynamics", phase: "start", title: "Navigate the interview", eyebrow: "Time, talk, and signals", minutes: 2 },
  { id: "orientation-check", phase: "start", title: "Know what to clarify first", eyebrow: "Think before classes", minutes: 1 },
  { id: "incomplete-prompt", phase: "requirements", title: "Find what the prompt omits", eyebrow: "Incomplete prompt", minutes: 1 },
  { id: "requirements-dialogue", phase: "requirements", title: "Practice the interview dialogue", eyebrow: "Ask, listen, confirm", minutes: 1 },
  { id: "question-groups", phase: "requirements", title: "Choose the questions to ask", eyebrow: "Question checklist", minutes: 2 },
  { id: "players-and-marks", phase: "requirements", title: "Review the interviewer answers", eyebrow: "Question and answer", minutes: 2 },
  { id: "confirmed-spec", phase: "requirements", title: "Confirm the specification", eyebrow: "Agreed requirements", minutes: 1 },
  { id: "entity-transition", phase: "entities", title: "Discover the entities", eyebrow: "From requirements to objects", minutes: 1 },
  { id: "modeling-vocabulary", phase: "entities", title: "Learn the four modeling choices", eyebrow: "Class, enum, field, or leave out", minutes: 2 },
  { id: "entity-intro", phase: "entities", title: "Choose the classes", eyebrow: "Class candidates", minutes: 2 },
  { id: "cell-question", phase: "entities", title: "Model the remaining values", eyebrow: "Classes, fields, and enums", minutes: 2 },
  { id: "ownership-rule", phase: "entities", title: "Assign each rule an owner", eyebrow: "Responsibility check", minutes: 2 },
  { id: "entity-flow", phase: "entities", title: "Build the final entity flow", eyebrow: "Flow challenge", minutes: 2 },
  { id: "design-principles", phase: "class-design", title: "Learn the principles through failures", eyebrow: "Problems before names", minutes: 2 },
  { id: "game-design-intro", phase: "class-design", title: "How to design a class", eyebrow: "Class design method", minutes: 1 },
  { id: "pattern-future", phase: "class-design", title: "Design Player", eyebrow: "Immutable identity", minutes: 2 },
  { id: "board-design", phase: "class-design", title: "Design Board", eyebrow: "Encapsulate the grid", minutes: 2 },
  { id: "game-design", phase: "class-design", title: "Derive Game state", eyebrow: "Match-flow state", minutes: 2 },
  { id: "game-design-two", phase: "class-design", title: "Derive Game behavior and API", eyebrow: "Public boundary", minutes: 2 },
  { id: "board-design-two", phase: "class-design", title: "Apply the design tools", eyebrow: "Principles by class", minutes: 2 },
  { id: "pattern-decisions", phase: "class-design", title: "Know when patterns are unnecessary", eyebrow: "Pattern restraint", minutes: 2 },
  { id: "pattern-check", phase: "class-design", title: "Review the final class blueprint", eyebrow: "Design checkpoint", minutes: 1 },
  { id: "implementation-map", legacyIds: ["implementation-flow"], phase: "implementation", title: "Map the code responsibilities", eyebrow: "From design to code", minutes: 1 },
  { id: "validation-order", phase: "implementation", title: "Order one safe move", eyebrow: "Interactive workflow", minutes: 2 },
  { id: "ownership-concept", legacyIds: ["enum-concept", "pattern-concept"], phase: "implementation", title: "Review the implementation concepts", eyebrow: "Four ideas in context", minutes: 2 },
  { id: "value-types", phase: "implementation", title: "Read the three value types", eyebrow: "Java code", minutes: 1 },
  { id: "move-result-check", phase: "implementation", title: "Model expected move failures", eyebrow: "API semantics", minutes: 1 },
  { id: "player-code", phase: "implementation", title: "Keep Player immutable", eyebrow: "Java code", minutes: 2 },
  { id: "validation-rule", phase: "implementation", title: "Predict what Board must protect", eyebrow: "Before Board.java", minutes: 2 },
  { id: "board-placement-code", legacyIds: ["board-win-code", "board-support-code"], phase: "implementation", title: "Read Board by responsibility", eyebrow: "Tabbed Board.java", minutes: 3 },
  { id: "game-overview", phase: "implementation", title: "Predict the Game workflow", eyebrow: "Before Game.java", minutes: 2 },
  { id: "game-setup-code", legacyIds: ["game-guards-code", "game-result-code", "game-support-code"], phase: "implementation", title: "Read Game by responsibility", eyebrow: "Tabbed Game.java", minutes: 3 },
  { id: "demo-code", phase: "implementation", title: "Use the public API", eyebrow: "TicTacToeDemo.java", minutes: 2 },
  { id: "scenario-happy", phase: "implementation", title: "Trace a complete win", eyebrow: "Scenario proof", minutes: 2 },
  { id: "scenario-check", legacyIds: ["scenario-rejection"], phase: "implementation", title: "Prove rejection changes nothing", eyebrow: "Invariant check", minutes: 2 },
  { id: "simulator-lab", phase: "implementation", title: "Challenge the model", eyebrow: "Interactive lab", minutes: 3 },
  { id: "extension-strategies", phase: "extensions", title: "Add computer move strategies", eyebrow: "Changed requirement", minutes: 2 },
  { id: "extension-board", phase: "extensions", title: "Generalize the board and win rule", eyebrow: "Changed requirement", minutes: 1 },
  { id: "extension-state", phase: "extensions", title: "Extend history and coordination", eyebrow: "Changed requirements", minutes: 2 },
  { id: "extension-answer", phase: "extensions", title: "Explain the design aloud", eyebrow: "Interview response", minutes: 1 },
  { id: "extensions-check", phase: "extensions", title: "Choose the smallest extension", eyebrow: "Final check", minutes: 1 },
];
