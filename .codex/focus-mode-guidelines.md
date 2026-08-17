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

Focus Mode must also teach these cross-cutting concerns alongside the five phases:

- **OOP fundamentals** — introduce the modeling vocabulary (class, enum, field, leave out) and whichever design principles the topic's design naturally demonstrates, just-in-time, before the learner applies them in exercises. The principle catalog includes encapsulation, single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion, composition over inheritance, immutability, cohesion, loose coupling, Law of Demeter, and topic-specific concerns such as thread safety or algorithmic separation. Do not assume the learner already understands these concepts merely because they recognize the names.
- **Interview communication** — teach how to present reasoning aloud, manage time, interact with the interviewer, and deliver extension answers confidently. Weave interview-awareness into the Start, Requirements, and Extensions phases rather than isolating it in a separate lesson.

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
- Teach vocabulary and principles just-in-time, immediately before the exercise that uses them, not in a separate pre-lesson.
- Group related boilerplate code (getters, reset, support methods) into tabbed views rather than giving each method its own slide.
- Keep the overall interactive-to-passive ratio above 40 percent. If a phase drops below 30 percent interactive, add predict-before-reveal or classification exercises before passive code or information slides.

### Recommended Start pattern

- Show the real-world problem with an overview illustration.
- Present the five-phase interview framework.
- Teach interview dynamics: time budget, talking-aloud discipline, and common interviewer signals. Use an interactive reveal for signals so the learner predicts meaning before seeing the answer.
- End with a predict-before-reveal check: "Before naming classes, what must you learn?"

### Recommended Requirements pattern

- Introduce what the prompt omits.
- Teach interview dialogue rhythm before the first exercise: show a short scripted candidate-interviewer exchange that demonstrates stating a question, hearing the answer, and confirming the requirement aloud.
- Ask the learner to select the useful interviewer questions from plausible options.
- Present the confirmed questions and answers together rather than one answer per slide.
- Finish with a compact specification and deliberate `Not building` list.
- Avoid repeating `Why ask it?` or implementation notes when those ideas are taught later.

### Recommended Entities pattern

- Introduce noun extraction and explicitly state that not every noun deserves a class.
- Before asking the learner to classify candidates, teach the four modeling choices—class, enum, field, and leave out—with a short interactive matching exercise. The learner must understand the test for each choice before applying it:
  - Class: owns information that changes while the program runs AND enforces rules on that information.
  - Enum: a value from a small fixed set with no independent changing state.
  - Field: a simple value with no behavior in this scope, belonging inside another class.
  - Leave out: a real concept absent from the confirmed requirements or with only one fixed implementation.
- Ask which candidates deserve classes.
- Classify the remaining concepts as enums, fields, parameters, or deliberately omitted ideas.
- Assign rules to the object that owns the information needed to check them.
- Finish by building or reviewing one concrete object flow.
- Prefer a few multi-item decisions over a separate slide for every entity.

### Recommended Class Design pattern

Teach this repeatable sequence:

> Requirement → responsibility → state → behavior → public API → relationships → principles → patterns

- Before the first class design exercise, teach whichever design principles this topic's design will exercise. Use a "match the principle to the failure it prevents" interaction. Each principle is introduced with the concrete problem it solves, not with a textbook definition.
- Choose from the principle catalog below or check if any additional LLD principle is more suited for the current problem satement. A beginner topic may need only three or four; a harder topic that exercises interfaces, concurrency, or algorithmic separation may need more:
  - **Encapsulation:** without it, a caller changes state directly and skips validation.
  - **Single responsibility:** without it, unrelated concerns share a class and a change in one breaks the other.
  - **Open/closed:** without it, adding a new behavior forces modification of stable, tested code.
  - **Liskov substitution:** without it, a subtype breaks the contract the caller expects from the parent type.
  - **Interface segregation:** without it, a class is forced to implement methods it does not need.
  - **Dependency inversion:** without it, a high-level class depends on a concrete low-level implementation and cannot be tested or extended independently.
  - **Composition over inheritance:** without it, inheritance couples unrelated behaviors and a caller can bypass the coordinator.
  - **Immutability:** without it, identity can be silently changed after construction and corrupt downstream logic.
  - **Cohesion:** without it, a class mixes unrelated state and behavior, making it harder to understand and change.
  - **Loose coupling:** without it, changing one class forces changes in many others.
  - **Law of Demeter:** without it, a caller reaches through one object to manipulate another's internals.
  - **Thread safety** (topic-specific): without it, concurrent callers can interleave operations and corrupt shared state.
  - **Algorithmic separation** (topic-specific): without it, a complex algorithm is tangled into domain classes instead of being encapsulated behind an interface.
- After the principles step, introduce how to design a class before showing final fields and methods.
- Discuss every confirmed class, including small immutable classes.
- Derive state and behavior from requirements rather than presenting an unexplained class table.
- Distinguish public use cases from internal behavior and another class's responsibility.
- Apply the taught principles naturally during each class's classification exercise. Reference the principle by name only after the learner has seen the concrete failure it prevents.
- Check whether a proposed public API leaks mutable internals or lets a caller bypass invariants.
- Discuss patterns only after identifying a real source of variation. Explain both why a pattern is rejected now and what future requirement could justify it.
- Finish with a compact final blueprint covering state, behavior, API, relationships, enums, and protected invariants.

### Recommended Implementation pattern

- Start with a code map that connects each class to its responsibility.
- Merge closely related concept dropdowns (such as ownership, enum usage, and pattern restraint) into a single tabbed step rather than giving each a separate slide.
- Ask the learner to predict validation and mutation order before showing code.
- Before each major code block, add a predict-before-reveal exercise. Ask the learner to predict what checks a method performs, what order guards execute in, or what result a method returns given a specific state. Then show the code as verification of the prediction.
- Group an entire class's code (validation, core logic, and support methods) into a tabbed code view when the class has more than two Focus-visible methods. Each tab should cover one coherent responsibility: validate and mutate, detect outcomes, support and reset.
- Keep each tab focused on one coherent method or concept. Do not place unrelated methods in the same tab.
- Show complete production-quality code in the walkthrough; use readable excerpts in Focus Mode.
- Teach difficult concepts before relying on them in code.
- Connect every guard, state mutation, result enum, and helper back to a requirement or invariant.
- Include deterministic scenarios that prove accepted and rejected paths.
- Absorb short single-sentence insights (such as a rejection proof) into the adjacent interactive check rather than giving them a separate slide.

### Recommended Extensions pattern

- Begin from a changed requirement, not a pattern name.
- Ask what part of the current model must change and what should remain stable.
- Introduce Strategy, Observer, State, Factory, or another abstraction only when the changed requirement creates a real boundary.
- Include an interactive verbal-presentation exercise: show two or three candidate spoken responses to an extension prompt and ask the learner to choose the strongest. The correct answer should demonstrate explaining why the pattern was not used earlier, what changed, where the interface goes, and what stays stable. Weak answers should illustrate common interview mistakes: naming a pattern without justification, or rewriting stable code unnecessarily.
- End with a brief interview-closing guide: how to summarize the design in two sentences, mention extensions with more time, and invite the interviewer to go deeper.

## Interaction design

Use interaction only when it practices reasoning. Suitable patterns include:

- selecting useful questions or class candidates;
- classifying concepts, state, behavior, visibility, ownership, or pattern timing;
- assigning rules to classes;
- ordering operations or an object flow;
- predicting output, state, or failure behavior;
- revealing an answer after the learner forms a prediction;
- matching a vocabulary term or principle to its definition, test, or failure scenario;
- predicting what a method checks or returns before reading its code;
- choosing the strongest verbal interview response from plausible alternatives;
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
- Introduce technical words such as invariant, immutable, encapsulation, composition, and orchestration before using them as labels. Specifically, add a just-in-time teaching step before the first exercise that uses each term. Do not rely on the learner importing definitions from outside this lesson.
- Introduce each OOP principle by showing the concrete failure it prevents, not by stating a textbook definition. The learner should understand the problem before learning the name.
- Keep option labels short and put nuance in feedback.
- Prefer concrete actions such as `Game checks the current player` over indirect phrases such as `the orchestration layer validates actor eligibility`.
- Explain ownership with: `Give the rule to the class that has the information needed to check it.`
- Keep general teaching rules in one fixed location. Tapping an item should change only that item's specific explanation, not repeat the same general rule.
- Do not expose implementation details during early requirements or entity discovery unless the learner is explicitly deciding them.
- Do not use patterns, classes, or methods as interview decoration. Every design choice must answer a requirement or protect an invariant.
- When teaching interview communication, use concrete scripted examples rather than abstract tips. Show what a candidate actually says, not a rule about what to say.

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
  - longest tab or code sample;
  - every tab in a tabbed code view, including the tab with the most lines.
- Check `scrollHeight <= clientHeight` for the document, card body, and active step in every tested state.

### Tabbed code views

- Use a tabbed layout when three or more related code excerpts from the same class would otherwise become consecutive passive slides.
- Each tab must have a short descriptive label (such as `Place & validate`, `Win detection`, `Support`).
- Keep tab content horizontally scrollable for long lines but do not allow vertical scrolling within the code region.
- Reserve space for the tab bar, card header, and navigation controls before sizing the code area.
- On mobile, tabs may use a compact single-row scrollable tab bar. Do not stack tabs vertically.
- Validate the tallest tab at both laptop and mobile widths. If any tab overflows, split it into a separate step or shorten the excerpt.

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

### Cross-cutting reusable components

The following component types support OOP teaching, interview skills, and leaner implementation across all topics:

- **Vocabulary matcher:** an interactive exercise where the learner matches a term to its test or the failure it prevents. In the entity phase the terms are the modeling choices (class, enum, field, leave out). In the class design phase the terms are whichever principles the topic exercises, drawn from the principle catalog. The component accepts any list of terms and definitions as props so it works for any topic and any subset of the catalog.
- **Predict-before-reveal challenge:** the learner predicts what a method checks, returns, or the order of guards before seeing the actual code. Use multi-select for "what does it check" and ordering for "in what order."
- **Tabbed code view:** displays multiple related code excerpts from one class as tabs instead of consecutive slides. Each tab has a label, syntax-colored code, and horizontal scroll for long lines.
- **Tabbed concept view:** groups two or three related conceptual notes (such as ownership, enum usage, and pattern restraint) into tabs instead of consecutive info slides.
- **Interview dialogue example:** a scripted candidate-interviewer exchange showing conversational rhythm. May use a static layout or an accordion reveal.
- **Interview response picker:** a choice question where the learner selects the strongest verbal interview response from two or three candidates. Feedback explains why each response is strong or weak.
- **Interview dynamics guide:** time-budget visualization plus talking-aloud tips plus accordion-style interviewer signals.

All cross-cutting components must be topic-agnostic in shape and accept topic-specific data as props. Do not hard-code a single topic's content inside the component implementation.

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
- [ ] OOP modeling vocabulary (class, enum, field, leave out) is taught before the first entity classification exercise.
- [ ] Every OOP design principle used in the topic's classification exercises is taught before the learner first encounters it, using the principle catalog from the Recommended Class Design pattern section.
- [ ] Each principle is introduced through the concrete failure it prevents, not a textbook definition.
- [ ] Interview dynamics (time budget, talking aloud, interviewer signals) appear in the Start phase.
- [ ] Interview dialogue rhythm is demonstrated before the first requirements question exercise.
- [ ] Extensions include an interactive verbal-presentation exercise, not only a static explanation.
- [ ] The implementation phase interactive ratio is at or above 30 percent.
- [ ] Related code from one class is grouped into tabbed views rather than consecutive single-method slides.
- [ ] A predict-before-reveal exercise precedes every major code block (Board code, Game code).
- [ ] Every tabbed code view fits at both laptop and mobile widths for every tab.
