"use client";

import { createContext, useContext } from "react";

const FocusStepContext = createContext<string | null>(null);

export function FocusStepProvider({ activeStepId, children }: { activeStepId: string; children: React.ReactNode }) {
  return <FocusStepContext.Provider value={activeStepId}>{children}</FocusStepContext.Provider>;
}

export function LessonStep({ id, children }: { id: string; children: React.ReactNode }) {
  const activeStepId = useContext(FocusStepContext);

  if (activeStepId === null) return <>{children}</>;
  if (activeStepId !== id) return null;

  return <section data-learning-step={id} className="lesson-prose focus-step">{children}</section>;
}

export function FocusOnly({ children }: { children: React.ReactNode }) {
  return useContext(FocusStepContext) === null ? null : <>{children}</>;
}

export function WalkthroughOnly({ children }: { children: React.ReactNode }) {
  return useContext(FocusStepContext) === null ? <>{children}</> : null;
}
