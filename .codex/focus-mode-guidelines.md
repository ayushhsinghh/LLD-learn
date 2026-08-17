# Focus Mode authoring guidelines

## Purpose

Focus Mode is an optional, interactive path through an existing LLD lesson. It teaches the same reasoning as the complete walkthrough one decision at a time. It is not a summary page, a separate lesson, or a collection of quizzes.

Read this file completely before adding or changing Focus Mode for any LLD topic. Also follow `.codex/AGENTS.md`; its project-wide lesson, teaching, code, diagram, and validation rules still apply.

## Product boundaries

- Keep Focus Mode frontend-only, deterministic, and local.
- Do not add authentication, accounts, progress persistence, browser storage, bookmarks, notes, APIs, or a backend.
- Keep the complete walkthrough available at `/problems/<topic>/` and Focus Mode at `/problems/<topic>/learn/`.
- Do not replace or weaken the complete walkthrough. Focus Mode is an optional learning path through the same source material.
- Do not add a second global header, footer, page title, or other layout outside the Focus Mode shell.
- Do not add a dependency when the existing React, Radix, Tailwind, or shared lesson components can implement the interaction cleanly.

## Shared-content architecture

- Keep lesson content in `content/<topic>.mdx` and reuse that MDX in both modes.
- Wrap meaningful units with `LessonStep`. In the complete walkthrough the wrapper must add no visible structure; in Focus Mode it exposes only the active step.
- Use `WalkthroughOnly` for detailed prose, large tables, complete code, and explanations that would overload a slide.
- Use `FocusOnly` for compact interactions, diagrams, code excerpts, and focus-specific teaching treatments.
- Do not duplicate the lesson into a second MDX file. A design or API correction must remain consistent across both modes.
- Register every visible Focus step in `lib/learning-paths.ts` with:
  - a stable, topic-specific hash ID;
  - the correct phase;
  - one objective-focused title;
  - a short eyebrow;
  - a realistic minute estimate.
- Preserve stable IDs when redesigning a phase unless breaking old direct links is explicitly approved.
- Keep the route, ordered learning path, MDX step IDs, phase labels, and displayed step count synchronized.

## Coverage and lesson sequence

Focus Mode must cover the complete five-phase interview path:

1. Requirements
2. Entities and relationships
3. Class design
4. Implementation and important technical concepts
5. Verification and extensions

The learner must encounter the same confirmed requirements, ownership decisions, class model, public API, implementation, invariants, verification, and extension reasoning as the walkthrough.

Use explicit transition slides when moving between phases. A transition should explain:

- what the previous phase established;
- what question the next phase answers;
- the decisions the learner will make next.

Do not jump directly from a final answer in one phase to an unexplained exercise in the next.

## Planning the slide sequence

- Give each slide one learning objective.
- Prefer a short sequence of decision-rich slides over one slide per fact or entity.
- Combine closely related questions when they can be answered together without overwhelming the learner.
- Do not expand a small phase into ten or more repetitive question slides merely to make it interactive.
- Use an informational slide when the learner needs a mental model before making decisions.
- End each major reasoning phase with a compact confirmed model, specification, blueprint, or flow.
- Keep deeper candidate-by-candidate reasoning in the complete walkthrough when it does not fit the focus card.
- Never reduce text below a readable size to make a slide fit. Simplify, use tabs, reveal one explanation at a time, or split the objective.

### Recommended Requirements pattern

- Introduce what the prompt omits.
- Ask the learner to select the useful interviewer questions from plausible options.
- Present the confirmed questions and answers together rather than one answer per slide.
- Finish with a compact specification and deliberate `Not building` list.
- Avoid repeating `Why ask it?` or implementation notes when those ideas are taught later.

### Recommended Entities pattern

- Introduce noun extraction and explicitly state that not every noun deserves a class.
- Ask which candidates deserve classes.
- Classify the remaining concepts as enums, fields, parameters, or deliberately omitted ideas.
- Assign rules to the object that owns the information needed to check them.
- Finish by building or reviewing one concrete object flow.
- Prefer a few multi-item decisions over a separate slide for every entity.

### Recommended Class Design pattern

Teach this repeatable sequence:

> Requirement → responsibility → state → behavior → public API → relationships → principles → patterns

- Introduce how to design a class before showing final fields and methods.
- Discuss every confirmed class, including small immutable classes.
- Derive state and behavior from requirements rather than presenting an unexplained class table.
- Distinguish public use cases from internal behavior and another class's responsibility.
- Teach principles where they appear in the design:
  - single responsibility with class ownership;
  - encapsulation with private state and safe public reads;
  - composition with `has-a` relationships;
  - immutability with stable identity or value objects;
  - cohesion by keeping related state and rules together.
- Check whether a proposed public API leaks mutable internals or lets a caller bypass invariants.
- Discuss patterns only after identifying a real source of variation. Explain both why a pattern is rejected now and what future requirement could justify it.
- Finish with a compact final blueprint covering state, behavior, API, relationships, enums, and protected invariants.

### Recommended Implementation pattern

- Start with a code map that connects each class to its responsibility.
- Ask the learner to predict validation and mutation order before showing code.
- Keep code slides focused on one coherent method or concept.
- Show complete production-quality code in the walkthrough; use readable excerpts in Focus Mode.
- Teach difficult concepts before relying on them in code.
- Connect every guard, state mutation, result enum, and helper back to a requirement or invariant.
- Include deterministic scenarios that prove accepted and rejected paths.

### Recommended Extensions pattern

- Begin from a changed requirement, not a pattern name.
- Ask what part of the current model must change and what should remain stable.
- Introduce Strategy, Observer, State, Factory, or another abstraction only when the changed requirement creates a real boundary.
- End with an interview-style explanation or a decision that demonstrates restrained extension.

## Interaction design

Use interaction only when it practices reasoning. Suitable patterns include:

- selecting useful questions or class candidates;
- classifying concepts, state, behavior, visibility, ownership, or pattern timing;
- assigning rules to classes;
- ordering operations or an object flow;
- predicting output, state, or failure behavior;
- revealing an answer after the learner forms a prediction;
- changing inputs in a deterministic simulation.

Avoid interaction that only makes the learner click through prose.

### Submission and feedback

- Let the learner make the complete decision before submission when the items belong to one model.
- Disable submission until the minimum required input is complete.
- After submission, show a compact score or overall result.
- Use icons and explicit text such as `Correct`, `Incorrect`, `Correct position`, or `Wrong position`. Never depend on green and red alone.
- Explain why every option is right or wrong.
- Reveal only one detailed explanation at a time when showing all explanations would overflow the card.
- Automatically select the first incorrect item for review; select the first item when everything is correct.
- Keep checked rows keyboard- and touch-operable when selecting a row changes the explanation.
- Always provide retry. Retry must reset answers, checked state, selected explanation, and any secondary view.
- Do not immediately replace the learner's submitted work with a final diagram or answer.

### Ordering and flow challenges

- Present choices in a fixed scrambled order.
- Keep the learner's sequence visible after checking.
- Mark each position with icon, text, and color.
- Let every chosen row remain editable so the learner can rearrange and check again.
- Do not reveal the correct item beside every wrong position if the intended learning loop is retry-first.
- Offer `Reveal solution` after an incomplete attempt.
- After a fully correct attempt, use `See final diagram` or equivalent wording.
- In the solution view, show the diagram followed by the full correct path and provide `Back to my flow`.

### Classification challenges

- Use categories that match the real design question, such as:
  - `State / Behavior / Does not belong`;
  - `Public API / Internal / Other class`;
  - `Use now / Use later / Do not use`.
- Submit all rows together.
- In checked state, show the selected and correct classification compactly.
- Let the learner tap a checked row to inspect that row's reasoning.
- Reuse one classifier component across classes when the interaction behavior is identical.

### Multiple-choice questions

- Use plausible distractors that expose common design mistakes.
- Keep wording direct; do not hide the concept behind wordplay.
- Explain every choice after submission, including the correct choice.
- Keep retry available.

## Teaching and writing rules

- Use simple, direct English.
- Introduce technical words such as invariant, immutable, encapsulation, composition, and orchestration before using them as labels.
- Keep option labels short and put nuance in feedback.
- Prefer concrete actions such as `Game checks the current player` over indirect phrases such as `the orchestration layer validates actor eligibility`.
- Explain ownership with: `Give the rule to the class that has the information needed to check it.`
- Keep general teaching rules in one fixed location. Tapping an item should change only that item's specific explanation, not repeat the same general rule.
- Do not expose implementation details during early requirements or entity discovery unless the learner is explicitly deciding them.
- Do not use patterns, classes, or methods as interview decoration. Every design choice must answer a requirement or protect an invariant.

## Viewport and layout rules

Focus Mode is a slide deck, not a vertically scrolling document.

- The page, active card, card body, and active step must fit within the viewport without vertical scrolling.
- Support at least:
  - mobile: `390 × 844`;
  - laptop: `1280 × 720`.
- Keep the title inside the active card. Do not render a duplicate title above it.
- Preserve the fixed previous/next navigation and ensure content never extends behind it.
- Use `h-full`, `min-h-0`, bounded flex children, and `overflow-hidden` intentionally throughout the shell and large interactive views.
- Do not solve overflow with an inner vertical scrollbar.
- Use responsive grids to reduce laptop height while preserving readable mobile rows.
- Validate the tallest states, not only the initial state:
  - every option selected;
  - partially and fully incorrect feedback;
  - fully correct feedback;
  - expanded explanation;
  - revealed solution or diagram;
  - longest tab or code sample.
- Check `scrollHeight <= clientHeight` for the document, card body, and active step in every tested state.

### Images and diagrams

- Prefer code-native diagrams when the learner manipulates the state.
- Use generated images only for conceptual scenes or object flows that benefit from illustration.
- Keep images inside a bounded flex region with `min-height: 0`.
- Use `max-width: 100%`, `max-height: 100%`, and `object-fit: contain` so an image scales against both available width and height.
- Reserve space for captions, answers, and controls before sizing the image.
- Never use only `width: 100%; height: auto` for an image that shares a fixed-height slide with other content.
- Use horizontal scrolling only for an intentionally wide walkthrough diagram, not as a general Focus Mode escape hatch.
- Provide descriptive alt text and do not rely on the image alone to teach the flow.

## Navigation and state

- Laptop must retain the persistent phase-and-step map.
- Mobile must retain the accessible modal lesson map.
- Both layouts must show current phase, step count, and progress.
- Previous and next controls must remain fixed and keyboard-operable.
- Direct hash loading must select the correct step after hydration.
- Browser back and forward must move between previously visited steps.
- Opening the complete walkthrough from Focus Mode must preserve the static trailing-slash route behavior.
- Keep interaction state local to the client component. Do not persist progress in storage.
- A step change may preserve local state while the page remains mounted, so checked and expanded states must still fit if the learner returns.

## Accessibility

- Use native buttons, checkboxes, radio controls, or accessible Radix primitives.
- Every interactive control must be reachable and usable with a keyboard.
- Provide visible focus indicators.
- Use `aria-pressed`, `aria-expanded`, labels, and live regions where they communicate interaction state.
- Do not use color as the only indication of correctness, selection, phase, or progress.
- Keep touch targets comfortably tappable and avoid tiny adjacent controls.
- Respect reduced-motion preferences and keep transitions short.
- Move focus to the new slide heading after navigation without creating a duplicate announcement.

## Reuse and component design

- Reuse `FocusLessonShell`, `LessonStep`, `FocusOnly`, `WalkthroughOnly`, and existing learning interactions before adding new components.
- Add a reusable interaction when several slides share the same state machine and differ only in data.
- Keep topic-specific answer data local and explicit; do not build a generic framework so abstract that lesson content becomes hard to read.
- Keep simulations deterministic and in memory.
- Keep server-rendered prose separate from client interaction state where practical.
- Do not return mutable internal state merely to make a Focus Mode visualization easier. Correct the visualization boundary instead of weakening the design.

## Required validation

Before considering Focus Mode complete:

1. Run `git diff --check` on changed source files.
2. Run `npm run lint`.
3. Run `npm run typecheck`.
4. Run `npm run build` using the project's configured Webpack build.
5. Compile and run complete Java examples when lesson APIs or code change.
6. Use the in-app Browser for UI validation; do not use standalone Playwright unless the user explicitly requests it.
7. Test every step at `390 × 844` and `1280 × 720`.
8. Test every interaction's correct, partial, and incorrect states, retry, and secondary reveal.
9. Verify keyboard selection, focus visibility, tabs, dialogs, and lesson-map controls.
10. Verify direct hashes, previous/next navigation, browser back/forward, and complete-walkthrough links.
11. Check browser console errors and warnings.
12. Confirm the complete walkthrough still contains the detailed reasoning and complete implementation.
13. Confirm the generated static route and assets load from the configured deployment base or custom-domain root.

## Final acceptance checklist

- [ ] Focus Mode and walkthrough use one MDX source of truth.
- [ ] All five interview phases are covered.
- [ ] Every slide has one objective.
- [ ] Phase transitions explain what comes next.
- [ ] Interactions practice decisions rather than reveal prose one click at a time.
- [ ] Every answer has useful feedback and retry.
- [ ] Correctness never depends on color alone.
- [ ] No slide or interaction state scrolls vertically or clips content.
- [ ] Images and diagrams remain within card and navigation boundaries.
- [ ] Mobile and laptop navigation work.
- [ ] Stable hashes and browser history work.
- [ ] The complete walkthrough remains detailed and correct.
- [ ] Java code and public APIs match the design taught in Focus Mode.
- [ ] Lint, type checks, build, browser QA, and applicable Java checks pass.
