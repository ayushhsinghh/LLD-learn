import type { Metadata } from "next";
import TicTacToeLesson from "@/content/tic-tac-toe.mdx";
import { FocusLessonShell } from "@/components/learning/focus-lesson-shell";
import { ticTacToeLearningSteps } from "@/lib/learning-paths";

export const metadata: Metadata = {
  title: "Tic-Tac-Toe Focus Mode",
  description: "Learn the Tic-Tac-Toe low-level design one decision, question, and code trace at a time.",
};

export default function TicTacToeFocusPage() {
  return (
    <FocusLessonShell title="Tic-Tac-Toe" completeHref="/problems/tic-tac-toe/" steps={ticTacToeLearningSteps}>
      <TicTacToeLesson />
    </FocusLessonShell>
  );
}

