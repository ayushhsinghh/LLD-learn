# LLD Interview Guide authoring rules

## Purpose

This project teaches low-level design interview problem solving. It is not a collection of short definitions or finished class diagrams. Every topic must teach the reader how to move from an unclear interview prompt to requirements, entities, class design, complete Java code, verification, and extensions.

When adding or revising an LLD topic, follow this file as an acceptance checklist. Preserve the same learning pattern across every problem so readers learn one reusable interview method.

## Product boundaries

- Keep the application frontend-only.
- Do not add a backend, API routes, databases, authentication, accounts, bookmarks, personal notes, or browser storage.
- Do not add a distracting global header or footer.
- Keep useful navigation: the left lesson index, the page table of contents, previous/next lesson links, and the mobile Index control.
- The site must work well in laptop and mobile browsers.
- Interactive simulations must be deterministic, local React client components. They must not require network calls or persistence.

## Technology and existing architecture

- Use Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, and MDX.
- Preserve static export through `output: "export"` and trailing-slash routes.
- Prefer Server Components and static MDX. Use Client Components only for browser interaction, such as simulations and mobile navigation.
- Reuse the shared components in `components/lesson-blocks.tsx` and the layout in `components/lesson-shell.tsx`.
- Keep lesson prose in `content/<topic>.mdx` and route composition in `app/problems/<topic>/page.tsx`.
- Register each topic in `lib/lessons.ts` and connect previous/next navigation.
- Put original project images under `public/images/` with clear topic-specific filenames.
- Do not introduce a dependency when the existing components or a small local implementation can solve the problem cleanly.

## Optional Focus Mode

A lesson may add a Focus Mode alongside its complete walkthrough. Focus Mode is a second way to learn the same lesson, not a shortened replacement or a separate source of truth.

Before adding, redesigning, or reviewing Focus Mode for any LLD lesson, read `.codex/focus-mode-guidelines.md` completely. Treat it as the Focus Mode implementation and acceptance checklist; the project-wide rules in this file continue to apply.

## System component lessons

The site also teaches reusable system-design components such as Kafka and Redis. Before adding or revising one of these lessons, read `.codex/component-learning-guidelines.md` completely. Component lessons use What it is → Motivation → Terminology → Core mechanics → Use-cases → Interview questions → Recap; do not force them into the LLD five-phase structure.

- Keep the complete walkthrough available at `/problems/<topic>/` and add Focus Mode at `/problems/<topic>/learn/`.
- Reuse the same MDX content in both routes. Wrap meaningful sections with `LessonStep`; the wrapper must add no DOM in the complete walkthrough and show only the active section in Focus Mode.
- Register the ordered steps in `lib/learning-paths.ts`. Give each step one clear objective, a short time estimate, and a stable hash ID so links and browser navigation work.
- Cover the entire five-phase lesson. A learner who completes Focus Mode must encounter the same confirmed requirements, entity reasoning, class design, complete Java implementation, verification, and extensions as the walkthrough.
- Ask the learner to predict before revealing important reasoning. Use interaction only when it helps practice a decision, trace state, order operations, or inspect a failure.
- Every multiple-choice option must explain why it is correct or incorrect after submission. Do not make correctness depend on color alone, and permit retry.
- Keep interactions deterministic, keyboard-operable, and local. Do not save progress in browser storage or require a backend.
- Treat Focus Mode as a slide deck, not a document. Lock it to the viewport: the page and active card must never require vertical scrolling at supported laptop or mobile sizes.
- Show one card with one learning objective. Keep the step title inside that card; do not add a second page-level title or introductory block above it.
- If content does not fit, split it into more steps or provide a concise focus-only treatment. Never clip content, shrink text below readable sizes, or move overflow into a vertically scrolling card.
- On laptop, provide a persistent phase-and-step map. On mobile, use an accessible modal lesson map and fixed previous/next controls. Preserve visible progress in both layouts.
- Respect reduced-motion preferences and keep transitions short. Motion must support orientation, not delay access to content.
- Prefer code-native diagrams and interactions for state that the learner manipulates. Use generated illustrations only where a static conceptual scene teaches better than HTML, CSS, or an existing required lesson image.
- Validate direct hash loading, browser back/forward, every interaction's success and error feedback, keyboard focus, the complete walkthrough, and the final simulator at laptop and approximately 390 px mobile widths. For every Focus Mode step, verify `scrollHeight <= clientHeight` for both the page and active card body.

## The required five-step lesson structure

Every LLD problem must use these exact top-level phases and IDs:

1. `requirements` — Requirements, approximately 5 interview minutes
2. `entities` — Entities and relationships, approximately 3 interview minutes
3. `class-design` — Class design, approximately 10–15 interview minutes
4. `implementation` — Java implementation, approximately 10 interview minutes
5. `extensions` — Extensions, approximately 5 interview minutes

Use `FrameworkMap` near the beginning of every lesson. Use the same phase labels in the page table of contents. The teaching page may take longer to read than the interview timings; the timings describe how long the interviewee should spend performing the step.

Render walkthrough phase headings as direct children of the walkthrough prose with explicit stable IDs. Do not wrap them in topic-specific elements that bypass the shared `.lesson-prose` heading hierarchy, scroll margins, or table-of-contents observation.

## Teaching voice

- Write like a skilled and patient teacher, not like API documentation or revision notes.
- Use simple, direct English. Prefer familiar words over buzzwords and abstract phrases.
- Explain one idea at a time. Use short paragraphs with a clear logical connection.
- Never present a conclusion without showing how the reader could reach it.
- Frequently connect the current decision to the previous step: “This came from the requirement that…”
- Use concrete examples with real values, such as floor 5, direction UP, or cell `(0, 2)`.
- Explain both positive and negative choices: why something is a class and why another candidate is only a field or should be left out.
- Define a technical term the first time it appears. Do not assume the reader already understands terms such as immutable, orchestration, invariant, strategy, or encapsulation.
- Avoid filler, motivational slogans, and pattern-name dumping.
- Use original wording. Reference sites may guide structure and quality, but do not copy their prose or diagrams.

The default reasoning rhythm is:

> Recall the requirement → ask a useful question → reason from the answer → make the design decision → explain what the decision enables.

## Opening concept illustration

Every problem lesson must begin with an original overview illustration immediately after `Lead` and before `FrameworkMap`. Generate it with the image-generation skill and save it as `public/images/<topic>-overview.png`.

The opening illustration must:

- teach the real-world problem and main user action before any classes or patterns are introduced;
- show a concrete normal scenario that the requirements section can refer back to;
- avoid class names, pattern names, UML notation, code, dense labels, logos, and decoration that does not teach;
- use the established visual style: warm white paper, hand-drawn navy lines, muted orange action or movement, and soft teal highlights;
- use `ConceptImage` with the real image dimensions, descriptive alt text, and a caption that states what the learner should notice;
- remain clear and correctly aligned at both laptop and mobile widths.

The opening overview and the later entity-flow image have different jobs. The overview teaches the physical or user-facing problem. The entity-flow image teaches which software objects receive, delegate, change state, and return a result. Do not reuse one image for both purposes.

## Step 1: Requirements

Begin with the short interview prompt and explain why it is incomplete. Do not start by naming classes.

Use the same four question groups for every problem:

1. Actions — What must a user or caller be able to do?
2. Rules — When does an action succeed, fail, or complete the workflow?
3. Errors — Which invalid actions must be rejected, and must state remain unchanged?
4. Boundaries — What is deliberately out of scope?

For each important clarification, use the compact `QuestionAnswer` accordion and include:

- the exact question the interviewee should ask;
- a realistic interviewer answer containing the observable rule.

Keep every question collapsed initially so the walkthrough is easy to scan. The closed row must remain one line, and expanding it must reveal only the interviewer answer. Do not add `Why ask it?`, `Write this down`, implementation notes, or design derivation to the Requirements question cards. Teach those consequences later in Entities, Class Design, and Implementation.

Use the heading `Ask these questions` consistently. Ensure each answer or the final confirmed specification preserves every rule needed to create later fields, methods, validation, and tests.

Finish with `RequirementBox` containing:

- a numbered confirmed specification;
- a deliberate not-building list.

Add a short checkpoint explaining how the reader knows the requirements are complete. Read requirements back before moving to entities.

## Step 2: Entities and relationships

This section must teach how to discover entities from the confirmed requirements. Do not show a compact final entity table as the first explanation.

Start by extracting candidate nouns. Clearly say that a real-world noun does not automatically deserve a class.

Present the final choices in the shared passive `EntityModelOverview`, driven by topic metadata rather than repeated MDX cards. Keep it scannable:

1. **Types we will create** — show every finalized class, Java record, and interface together. Use one full-width row per type with its exact name, a subtle `Class`, `Record`, or `Interface` tag, and a clear responsibility explanation. Define a record as validated immutable data with generated accessors and value equality; keep immutability as the principle it demonstrates.
2. **Enums** — use a separate section with one row per enum. Each row names the enum and explains the fixed choices or outcomes it represents.
3. **Fields** — use a separate section with one row per important field. Each row names the field and explains why the containing type needs it. Show relevant infrastructure in its own quiet supporting section.
4. **Why this model is enough** — summarize the main ownership relationship, explain which apparent entities remain fields, name what is deliberately omitted, and state why extra classes would not help the confirmed first version.

This walkthrough overview is passive. Do not add accordions, chevrons, per-candidate reveals, `Decision:` labels, requirement excerpts, or detailed candidate reasoning. Keep requirement-to-class derivation in Class Design, where state and behavior are taught in context.

Render each type, enum, field, and infrastructure item in one readable full-width row. Use aligned name and explanation columns on larger screens and stack them on mobile. Model names must use a plain monospaced text element, never the global inline-code chip treatment. Give rows consistent padding, line height, dividers, and enough group spacing that long names wrap without crowding or horizontal overflow.

Display field names as exact Java-style camelCase identifiers, such as `userId`, `roomId`, and `attemptCount`. Do not turn field names into prose labels such as “user ID” or “attempt count”; keep the human-readable explanation in the purpose column.

Store the types, enums, fields, infrastructure, omissions, relationship, and restraint rationale in shared topic metadata. When Focus Mode exists, its final entity checkpoint must consume the same metadata so classifications, omissions, and relationship explanations cannot drift. Every finalized type must be visible by its exact name.

Every Focus-only entity checkpoint must remain inside both its registered `LessonStep` and `FocusOnly`. Never place `EntityModelSummary` unguarded in shared MDX, because `LessonStep` deliberately renders its children in the walkthrough.

Use these tests:

- Does the candidate own information that changes while the program runs?
- Does it enforce or perform an important rule?
- Is it only a value from a small fixed set? Use an enum.
- Is it merely a number or value with no behavior in this scope? Keep it as a field.
- Is it real in the physical system but absent from the confirmed requirements? Leave it out.
- Do several validated values form one immutable data carrier and need value equality? Consider a Java record.

Always name at least one rejected class candidate in the final restraint note. Readers must learn restraint, not only class creation. End the overview by explaining how the state owners, values, and behavior boundaries work together.

Explain ownership by asking, “What information does this rule need?” Keep the rule beside the state it needs.

### Entity flow diagram

After the candidate reasoning, add an original sketch-style entity flow diagram generated with the image-generation skill.

The diagram must:

- show a concrete user or caller action entering the system;
- show the main coordinating object;
- show delegation to the state-owning objects;
- show important return information or feedback when it helps explain ownership;
- use named arrows that can be read as a short story;
- use large, correctly spelled labels;
- use the established visual style: warm white paper, hand-drawn navy lines, muted orange arrows, and soft teal highlights;
- avoid formal UML notation, dense annotations, decorative clutter, logos, and watermarks;
- be saved under `public/images/<topic>-entity-flow.png`;
- use descriptive alt text and a teaching caption;
- use `ConceptImage` with the real image dimensions and `mobileScrollable={true}` for wide diagrams.

After the image, explain the arrows in order and state what the flow teaches about class responsibilities. Do not rely on the image alone.

## Step 3: Class design

Bridge explicitly from entities to classes:

> requirement → responsible object → state it remembers → method that changes or reads that state

Start with the object receiving the main action, then work downward. Explain why that is the useful starting point.

Before each `DerivationTable`, add prose that walks through representative transformations. For example, “players alternate” creates `currentPlayer`; “moves stop after completion” creates `status` and an early guard.

For every field and method, the reader should be able to point to the requirement that created it. Do not add getters, managers, factories, interfaces, or helpers without a stated need.

Keep state private. Keep a rule in the object owning the state required by that rule. A coordinating class may order operations, but it should not reach into another object's fields and perform that object's rules.

### Complete walkthrough class-design standard

When a topic also has Focus Mode, its complete walkthrough must remain the detailed source of truth rather than leaving class reasoning only inside Focus interactions.

- Discuss every finalized class, interface, and important immutable value from the Entities checkpoint.
- Present state-owning and coordinating classes through the shared one-class-at-a-time explorer. Select the caller-facing coordinator first, keep exactly one class panel visible, and let learners follow the request into downstream state owners.
- Every full class panel must name its requirement, private state, public API, internal behavior, invariant, collaborators, responsibilities it rejects, and demonstrated principle. Use exact Java member names with short plain-language explanations.
- Keep records, interfaces, stateless implementations, and helpers in a compact supporting-types section rather than giving them full state-owner panels. Explain what each carries or varies and the mutation boundary it must not cross.
- Use horizontally scrollable, keyboard-operable class tabs. Walkthrough panels may grow naturally with their content, but must not use fixed heights, nested tabs, dense dashboards, or page-level horizontal scrolling.
- For each state-owning class, derive representative fields and methods from confirmed requirements before showing final code.
- Distinguish private state, public API, internal behavior, and responsibilities that belong to another class.
- State the invariant the class protects and whether mutable state or collections may escape.
- Explain composition and other relationships, then connect the concrete design to relevant principles before discussing patterns.
- Keep advanced algorithms or concurrency concepts attached to the class that owns the affected state or behavior.
- Reuse the same generated UML assets and diagram metadata in Focus Mode and the complete walkthrough so labels and explanations cannot drift.
- End Class Design with a walkthrough-safe tabbed diagram gallery. Every tab must include descriptive alternative text, a short explanation of how to read the diagram, and the principle it demonstrates.
- Let walkthrough pages scroll naturally, but keep each diagram responsive, aspect-ratio safe, and free of horizontal page overflow. Do not reuse the fixed-height Focus card layout in the walkthrough.

### Design patterns

- Treat patterns as optional tools, not checklist items.
- Use `PatternDecision` to discuss each plausible pattern.
- For every used pattern, explain the exact rule expected to vary, the interface boundary, the current implementation, and the future change it localizes.
- For every tempting but unused pattern, explain why it adds indirection without solving a current requirement.
- Do not force Singleton, Factory, Strategy, Observer, State, or any other pattern because it is common in LLD answers.
- If a future extension creates several versions of a rule, explain that this is the point where Strategy or another pattern becomes useful.

### Topic-specific and advanced concepts

Some LLD problems depend on a technical concept that is more difficult than ordinary object modeling. Examples include concurrency in movie-ticket booking, shortest-path routing in ride sharing, scheduling in parking or elevator systems, state machines in vending machines, and allocation rules in inventory systems.

When a concept materially affects the design, do not merely name it or hide it inside code. Add a clearly titled teaching subsection within class design, and reinforce it with `ConceptDropdown` explanations near the implementation.

Teach each important concept in this order:

1. **The practical problem** — begin with a concrete situation the reader already understands.
2. **What goes wrong without it** — walk through a failure with real values or an event sequence.
3. **The core idea** — define the concept in simple language before using formal terms.
4. **The model or data structure** — show what information is stored and why.
5. **The algorithm or rule** — walk through it step by step on a small example.
6. **Where it belongs in the design** — connect it to the responsible entity, fields, and methods.
7. **Complexity and limits** — state time and space cost where relevant, plus assumptions that make the simplified interview version possible.
8. **Alternatives and trade-offs** — explain at least one reasonable alternative and why the lesson chose its approach.
9. **Java implementation** — point to the exact code that implements the concept.
10. **Visual or interactive proof** — demonstrate the normal case and a failure or edge case.

Do not assume that a reader understands a concept because they recognize its name. Explain terms such as race condition, atomic operation, lock, graph, edge weight, priority queue, relaxation, heuristic, or state transition when first used.

#### Concurrency example: movie-ticket booking

If two users can act on the same seat at the same time, concurrency is part of the core correctness of the design.

The lesson must explain:

- the race condition as an interleaving: User A checks seat A7, User B checks A7, both see AVAILABLE, and both attempt to book;
- why `if (available) { book(); }` is not one indivisible action;
- the critical section that must happen as one unit: check availability → reserve or book → record the result;
- the difference between thread safety inside one Java process and consistency across several service instances;
- the chosen interview scope, such as an in-memory per-show or per-seat lock;
- why a coarse lock is simpler but reduces parallel work, while a finer lock permits unrelated seats to be booked concurrently;
- lock ownership, unlock behavior, and avoiding deadlock;
- when optimistic version checks, database constraints, transactions, or temporary seat holds would be alternatives in a larger system;
- how a seat moves through explicit states such as AVAILABLE, HELD, and BOOKED when holds are in scope;
- a deterministic concurrent test or simulation in which two callers attempt the same seat and exactly one succeeds.

If Java concurrency appears in the solution, provide complete code and explain the relevant primitives, such as `synchronized`, `ReentrantLock`, `ConcurrentHashMap`, atomic compare-and-set, or `CountDownLatch`. Use only the primitives actually needed by the chosen design. Never imply that an in-process lock protects multiple application servers.

#### Routing example: ride sharing

If the design chooses drivers, estimates arrival time, or calculates a route through a road network, routing is part of the model rather than a magic helper call.

The lesson must explain:

- how locations and roads become a graph: intersections are nodes, road segments are edges, and distance or travel time is the edge weight;
- the difference between straight-line distance and travel distance along roads;
- the difference between **matching** a rider to a driver and **routing** that driver through the road graph;
- why breadth-first search is correct only when every edge has equal cost;
- how Dijkstra's algorithm grows the cheapest known route using a priority queue when weights are non-negative;
- the meaning of distance estimates, predecessor links, visited or settled nodes, and edge relaxation in plain language;
- a small worked graph where the visually shortest-looking road is not the cheapest route;
- time and space complexity using `V` for locations and `E` for road segments;
- when A* may explore less of the map by using a safe heuristic, and why an incorrect heuristic can harm correctness;
- practical boundaries excluded from the interview version, such as live traffic, turn restrictions, map matching, road closures, and geographic indexing, unless the interviewer asks for them;
- how `RoadGraph`, `Route`, `RoutingStrategy`, or equivalent objects connect back to the confirmed requirements;
- a route simulation that highlights the frontier, selected node, updated distances, and final path one step at a time.

Do not turn a ride-sharing LLD lesson into a full distributed-system design. Explain enough routing to make the objects and code honest, then state the boundary clearly.

#### Choosing the depth

- Give more space to a concept when misunderstanding it would make the design incorrect.
- Keep the main five-phase lesson structure; add concept subsections inside the relevant phase instead of inventing a different overall format.
- Prefer one deeply explained concept over several unexplained buzzwords.
- Use a small example before general rules or complexity notation.
- If the concept is useful only as a future extension, explain it in Extensions rather than forcing it into the first implementation.
- If an algorithm is central, provide complete compilable Java for it and trace the same sample input through the code.
- If a concept has an important failure mode, the simulation must allow the learner to reproduce or compare that failure safely.

## Step 4: Java implementation

Provide complete, compilable Java code for every entity, enum, interface, strategy, controller, result type, and demo used by the design. Do not use incomplete snippets, ellipses, or “implementation omitted.”

- Target Java 17 or later unless the topic requires otherwise.
- Use one `JavaFile` block per `.java` file.
- Pass Java source as `JavaFile` children and provide a concise `purpose` for every file. Never pass source through an unsupported prop or leave a code panel empty.
- Keep file names and public type names consistent.
- Use the existing Java syntax coloring.
- Prefer clear code over clever code.
- Validate input before changing state.
- Ensure rejected actions leave state unchanged.
- Return clear result enums or values for expected invalid user actions; reserve exceptions for invalid construction or programmer misuse.
- Return unmodifiable views when exposing mutable collections.
- Give deterministic tie-breakers when several choices are equally valid.

Begin the section with `ImplementationGuide` explaining:

- what the complete code does;
- why responsibilities are separated this way;
- how one concrete request flows through the code.

Add a “Code concepts to understand” area using `ConceptDropdown`. Explain relevant ideas such as:

- pattern use and its actual call flow;
- immutability and value equality;
- validation order;
- ownership and encapsulation;
- deterministic simulation time;
- why a pattern is deliberately absent;
- any topic-specific concept required for correctness, including its failure case, algorithm, complexity, and exact code path.

Before each group of files, explain:

- what these files are responsible for;
- how they connect to the previous requirement and class-design sections;
- the order in which the reader should read important methods;
- why the chosen data structure or return type is useful.

After the files, use `ScenarioTrace` to execute a concrete happy path and at least one invalid action. State the initial state, method calls, validation, state changes, completion, and unchanged state after rejection.

## Interactive simulation

Every LLD topic must include a meaningful custom interactive simulation unless the user explicitly removes it from scope.

The simulation must:

- teach the same rules implemented by the Java model;
- expose useful live object state rather than act as decoration;
- allow the learner to trigger the main action;
- include reset and one or more prepared edge cases when appropriate;
- explain accepted and rejected actions in plain language;
- use deterministic steps instead of real timers when possible;
- work with mouse, keyboard, and touch;
- fit the existing clean visual language on desktop and mobile;
- remain entirely local with no backend or storage.

For advanced concepts, the simulation must expose the reasoning, not only the final result. For example, a concurrency simulation should show the competing operation order and protected critical section; a routing simulation should show the frontier, current distances, selected node, and reconstructed path.

The simulator and Java example must agree on terminology, validation order, state transitions, and edge-case behavior.

## Step 5: Extensions

Use realistic interviewer follow-ups. For each extension:

1. state the changed requirement;
2. identify the existing rule affected;
3. name the class currently owning that rule;
4. explain the smallest design change;
5. introduce an interface or pattern only if multiple behaviors now exist.

End with a short example of what a strong spoken interview explanation sounds like.

## Visual and layout rules

- Preserve the clean, quiet reading experience inspired by high-quality technical interview guides.
- Use a narrow readable content column, generous whitespace, small side navigation, and an unobtrusive page index.
- Establish a clear top-to-bottom reading order before adding decorative styling. Each callout or panel should communicate one primary idea.
- Do not use multi-column prose unless the content is genuinely parallel, similar in length, and easier to compare side by side. Prefer a single vertical narrative for explanations and conclusions.
- Give content at the same information level the same font size, weight, color, and line height. Reserve bold text and accent colors for headings, labels, and genuinely important terms rather than entire paragraphs.
- Design mobile-first: stack content naturally, keep line lengths readable, balance whitespace, and align related labels and text consistently at every breakpoint.
- Avoid dashboard-style cards, excessive borders, oversized colored blocks, and visual decoration that does not teach.
- Use images only when they explain a system, relationship, state change, or request flow.
- All generated diagrams must be original and project-local.
- Align images to the lesson column and use accurate width/height values to prevent distortion.
- Wide diagrams must scroll horizontally on mobile instead of shrinking labels until they are unreadable.
- Use concise captions that tell readers what to notice.
- Keep code horizontally scrollable and readable on small screens.
- Reuse the same component and color system across every topic.
- Treat browser-based visual inspection as a required UX quality gate, not an optional follow-up to a successful build. Check both laptop and approximately 390 px mobile widths, and inspect the topic with the longest content as well as a short example.

## Files to add or update for a new topic

For a topic with slug `<topic>`:

1. Add `content/<topic>.mdx` using all five required phases.
2. Add `app/problems/<topic>/page.tsx` with metadata, the five-item table of contents, and correct previous/next links.
3. Add the topic to `lib/lessons.ts`.
4. Add `components/simulations/<topic>-simulator.tsx` as a client component.
5. Add `public/images/<topic>-overview.png` and place it immediately after `Lead` as the required opening concept illustration.
6. Add `public/images/<topic>-entity-flow.png` using the required sketch style.
7. Reuse shared lesson blocks; extend them only when the new component will remain useful for future topics.
8. Update adjacent lesson pagination when needed.
9. Update the lesson catalog and ordering in `README.md` so the public project documentation stays aligned with `lib/lessons.ts`.

## Validation before completion

Run all of the following after adding or materially changing a lesson:

```bash
npm run lint
npm run build
npm run typecheck
```

Also:

- extract every Java file shown in the lesson into a temporary directory;
- compile all files together with `javac`;
- run the demo program and confirm its output matches the written scenario;
- test the main simulation flow and at least one rejection or edge case;
- visually inspect the lesson in a real browser at a laptop width;
- visually inspect it at approximately 390 px mobile width;
- verify phase heading hierarchy, direct hash alignment, and the active table-of-contents item at both sizes;
- verify every Java panel contains visible syntax-colored source and that only the code area scrolls horizontally on mobile;
- verify generated diagram labels, aspect ratio, captions, alt text, and mobile horizontal scrolling;
- verify the opening overview appears before `FrameworkMap`, teaches the real-world problem without design jargon, and renders correctly on laptop and mobile;
- check that the page index and previous/next links work;
- check for browser console errors.

Do not call a topic complete when only the build passes. Teaching quality, Java correctness, simulation behavior, and responsive rendering are all required.

## Final self-review for every topic

Before handing off a new lesson, answer yes to each question:

- Does the lesson teach how to think rather than only what to build?
- Can every entity be traced to a confirmed requirement?
- Does the lesson explain why rejected candidates are not classes?
- Can every important field and method be traced to a rule?
- Are pattern decisions justified by actual variation?
- Is all Java code complete, syntax-colored, compiled, and exercised?
- Does the simulation demonstrate the same rules as the Java code?
- Are all topic-specific concepts explained from intuition through implementation and verified with a concrete example?
- If concurrency is required, does the lesson show the race, protection boundary, scope of the guarantee, and a two-caller test?
- If graph routing is required, does the lesson define the graph, walk the algorithm, state complexity, and distinguish routing from matching?
- Does the entity flow image tell a clear story with readable labels?
- Does the opening overview teach the real-world problem before the lesson introduces requirements or classes?
- Is the language simple and free of unexplained buzzwords?
- Is the layout clean and readable on both laptop and mobile browsers?
- Did the change avoid backend, authentication, storage, bookmarks, and personal notes?
