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

## The required five-step lesson structure

Every LLD problem must use these exact top-level phases and IDs:

1. `requirements` — Requirements, approximately 5 interview minutes
2. `entities` — Entities and relationships, approximately 3 interview minutes
3. `class-design` — Class design, approximately 10–15 interview minutes
4. `implementation` — Java implementation, approximately 10 interview minutes
5. `extensions` — Extensions, approximately 5 interview minutes

Use `FrameworkMap` near the beginning of every lesson. Use the same phase labels in the page table of contents. The teaching page may take longer to read than the interview timings; the timings describe how long the interviewee should spend performing the step.

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

## Step 1: Requirements

Begin with the short interview prompt and explain why it is incomplete. Do not start by naming classes.

Use the same four question groups for every problem:

1. Actions — What must a user or caller be able to do?
2. Rules — When does an action succeed, fail, or complete the workflow?
3. Errors — Which invalid actions must be rejected, and must state remain unchanged?
4. Boundaries — What is deliberately out of scope?

For each important clarification, use `QuestionAnswer` and include:

- the exact question the interviewee should ask;
- why that question changes the design;
- a realistic interviewer answer;
- the concrete requirement derived from that answer.

Do not use vague derived statements. Write observable requirements that can later create fields, methods, validation, or tests.

Finish with `RequirementBox` containing:

- a numbered confirmed specification;
- a deliberate not-building list.

Add a short checkpoint explaining how the reader knows the requirements are complete. Read requirements back before moving to entities.

## Step 2: Entities and relationships

This section must teach how to discover entities from the confirmed requirements. Do not show a compact final entity table as the first explanation.

Start by extracting candidate nouns. Clearly say that a real-world noun does not automatically deserve a class.

For every meaningful candidate, use `CandidateWalkthrough` with this sequence:

1. `fromRequirement` — quote or paraphrase the requirement that revealed the candidate;
2. `question` — ask what the candidate must remember or decide;
3. `reasoning` — work through changing state and rules in plain language;
4. `decision` — choose `Class`, `Interface`, `Enum`, `Field`, or `Leave out`;
5. child content — explain the final modeling choice and its boundary.

Use these tests:

- Does the candidate own information that changes while the program runs?
- Does it enforce or perform an important rule?
- Is it only a value from a small fixed set? Use an enum.
- Is it merely a number or value with no behavior in this scope? Keep it as a field.
- Is it real in the physical system but absent from the confirmed requirements? Leave it out.
- Do several values form one meaningful concept and need value equality? Consider an immutable value class.

Always include at least one rejected class candidate. Readers must learn restraint, not only class creation.

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
- Avoid dashboard-style cards, excessive borders, oversized colored blocks, and visual decoration that does not teach.
- Use images only when they explain a system, relationship, state change, or request flow.
- All generated diagrams must be original and project-local.
- Align images to the lesson column and use accurate width/height values to prevent distortion.
- Wide diagrams must scroll horizontally on mobile instead of shrinking labels until they are unreadable.
- Use concise captions that tell readers what to notice.
- Keep code horizontally scrollable and readable on small screens.
- Reuse the same component and color system across every topic.

## Files to add or update for a new topic

For a topic with slug `<topic>`:

1. Add `content/<topic>.mdx` using all five required phases.
2. Add `app/problems/<topic>/page.tsx` with metadata, the five-item table of contents, and correct previous/next links.
3. Add the topic to `lib/lessons.ts`.
4. Add `components/simulations/<topic>-simulator.tsx` as a client component.
5. Add an overview illustration when it materially helps explain the real-world flow.
6. Add `public/images/<topic>-entity-flow.png` using the required sketch style.
7. Reuse shared lesson blocks; extend them only when the new component will remain useful for future topics.
8. Update adjacent lesson pagination when needed.

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
- verify generated diagram labels, aspect ratio, captions, alt text, and mobile horizontal scrolling;
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
- Is the language simple and free of unexplained buzzwords?
- Is the layout clean and readable on both laptop and mobile browsers?
- Did the change avoid backend, authentication, storage, bookmarks, and personal notes?
