export type LearningPhase = "start" | "requirements" | "entities" | "class-design" | "implementation" | "extensions";

export type LearningStep = {
  id: string;
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
  { id: "orientation-check", phase: "start", title: "Know what to clarify first", eyebrow: "Think before classes", minutes: 1 },
  { id: "incomplete-prompt", phase: "requirements", title: "Find what the prompt omits", eyebrow: "Incomplete prompt", minutes: 1 },
  { id: "question-groups", phase: "requirements", title: "Choose the questions to ask", eyebrow: "Question checklist", minutes: 2 },
  { id: "players-and-marks", phase: "requirements", title: "Review the interviewer answers", eyebrow: "Question and answer", minutes: 2 },
  { id: "confirmed-spec", phase: "requirements", title: "Confirm the specification", eyebrow: "Agreed requirements", minutes: 1 },
  { id: "entity-transition", phase: "entities", title: "Discover the entities", eyebrow: "From requirements to objects", minutes: 1 },
  { id: "entity-intro", phase: "entities", title: "Choose the classes", eyebrow: "Class candidates", minutes: 2 },
  { id: "cell-question", phase: "entities", title: "Model the remaining values", eyebrow: "Classes, fields, and enums", minutes: 2 },
  { id: "ownership-rule", phase: "entities", title: "Assign each rule an owner", eyebrow: "Responsibility check", minutes: 2 },
  { id: "entity-flow", phase: "entities", title: "Build the final entity flow", eyebrow: "Flow challenge", minutes: 2 },
  { id: "game-design-intro", phase: "class-design", title: "How to design a class", eyebrow: "Class design method", minutes: 1 },
  { id: "pattern-future", phase: "class-design", title: "Design Player", eyebrow: "Immutable identity", minutes: 2 },
  { id: "board-design", phase: "class-design", title: "Design Board", eyebrow: "Encapsulate the grid", minutes: 2 },
  { id: "game-design", phase: "class-design", title: "Derive Game state", eyebrow: "Match-flow state", minutes: 2 },
  { id: "game-design-two", phase: "class-design", title: "Derive Game behavior and API", eyebrow: "Public boundary", minutes: 2 },
  { id: "board-design-two", phase: "class-design", title: "Connect the classes", eyebrow: "Composition and principles", minutes: 2 },
  { id: "pattern-decisions", phase: "class-design", title: "Decide whether patterns help", eyebrow: "Pattern discipline", minutes: 2 },
  { id: "pattern-check", phase: "class-design", title: "Review the final class blueprint", eyebrow: "Design checkpoint", minutes: 1 },
  { id: "implementation-map", phase: "implementation", title: "Separate workflow from cell rules", eyebrow: "Code map", minutes: 1 },
  { id: "implementation-flow", phase: "implementation", title: "Trace one move through the code", eyebrow: "Execution order", minutes: 1 },
  { id: "validation-order", phase: "implementation", title: "Order one safe move", eyebrow: "Interactive workflow", minutes: 2 },
  { id: "validation-rule", phase: "implementation", title: "Validate before changing state", eyebrow: "Core invariant", minutes: 1 },
  { id: "ownership-concept", phase: "implementation", title: "Separate Board and Game rules", eyebrow: "Encapsulation", minutes: 1 },
  { id: "enum-concept", phase: "implementation", title: "Prefer precise states", eyebrow: "Enums", minutes: 1 },
  { id: "pattern-concept", phase: "implementation", title: "Keep the first implementation direct", eyebrow: "Pattern restraint", minutes: 1 },
  { id: "value-types", phase: "implementation", title: "Read the three value types", eyebrow: "Java code", minutes: 1 },
  { id: "move-result-check", phase: "implementation", title: "Choose results over exceptions", eyebrow: "API semantics", minutes: 1 },
  { id: "player-code", phase: "implementation", title: "Keep Player immutable", eyebrow: "Java code", minutes: 2 },
  { id: "board-placement-code", phase: "implementation", title: "Validate and place a mark", eyebrow: "Board.java", minutes: 2 },
  { id: "board-win-code", phase: "implementation", title: "Check every winning line", eyebrow: "Board.java", minutes: 2 },
  { id: "board-support-code", phase: "implementation", title: "Read, fill, and reset Board", eyebrow: "Board.java", minutes: 2 },
  { id: "game-overview", phase: "implementation", title: "Find the safe turn switch", eyebrow: "Game coordinator", minutes: 1 },
  { id: "game-setup-code", phase: "implementation", title: "Construct a valid Game", eyebrow: "Game.java", minutes: 2 },
  { id: "game-guards-code", phase: "implementation", title: "Reject before mutation", eyebrow: "Game.makeMove", minutes: 2 },
  { id: "game-result-code", phase: "implementation", title: "Resolve an accepted move", eyebrow: "Game.makeMove", minutes: 2 },
  { id: "game-support-code", phase: "implementation", title: "Reset and expose Game state", eyebrow: "Game.java", minutes: 1 },
  { id: "demo-code", phase: "implementation", title: "Use the public API", eyebrow: "TicTacToeDemo.java", minutes: 2 },
  { id: "scenario-happy", phase: "implementation", title: "Trace a complete win", eyebrow: "Scenario proof", minutes: 2 },
  { id: "scenario-rejection", phase: "implementation", title: "Prove rejected state is unchanged", eyebrow: "Invariant proof", minutes: 1 },
  { id: "scenario-check", phase: "implementation", title: "Identify the full invariant", eyebrow: "Test your reasoning", minutes: 1 },
  { id: "simulator-lab", phase: "implementation", title: "Challenge the model", eyebrow: "Interactive lab", minutes: 3 },
  { id: "extension-strategies", phase: "extensions", title: "Add computer move strategies", eyebrow: "Changed requirement", minutes: 2 },
  { id: "extension-board", phase: "extensions", title: "Generalize the board and win rule", eyebrow: "Changed requirement", minutes: 1 },
  { id: "extension-state", phase: "extensions", title: "Extend history and coordination", eyebrow: "Changed requirements", minutes: 2 },
  { id: "extension-answer", phase: "extensions", title: "Explain the design aloud", eyebrow: "Interview response", minutes: 1 },
  { id: "extensions-check", phase: "extensions", title: "Choose the smallest extension", eyebrow: "Final check", minutes: 1 },
];
