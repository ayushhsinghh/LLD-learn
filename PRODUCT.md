# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are beginner-to-intermediate software engineers preparing for system-design interviews. They use the guide to learn how to reason through low-level design problems and reusable system components, not merely memorize finished diagrams or definitions.

## Product Purpose

System Design Guide helps learners move from an unclear interview prompt to a defensible design. Success means a learner can clarify requirements, discover the necessary entities, assign state and behavior to the right classes, implement the design in Java 17, verify normal and failure cases, and respond to realistic extensions.

The product also teaches reusable system components through their terminology, mechanics, use cases, trade-offs, interview questions, and deterministic visual scenarios.

## Positioning

The guide teaches one repeatable reasoning method across complete interview problems:

> Requirements → entities → class design → Java implementation → extensions

Its distinction is that conclusions are derived step by step and reinforced with original diagrams, complete code, and local deterministic simulations. It is not a catalog of short definitions or finished class diagrams.

## Operating Context

Learners study complete walkthroughs in a browser on laptops and phones. Some lessons also provide a viewport-locked Focus Mode that presents the same source material as a sequence of small learning objectives, predictions, and deterministic interactions.

The site is publicly available at `learn.ayush.ltd` and is deployed as a static export through GitHub Pages.

## Capabilities and Constraints

- Teach low-level design problems with the fixed phases `requirements`, `entities`, `class-design`, `implementation`, and `extensions`.
- Teach reusable system components with a mechanics-first structure appropriate to the component rather than forcing the LLD phase model onto them.
- Include complete Java 17 examples and verify displayed Java when lessons change.
- Use original conceptual illustrations, entity-flow diagrams, class-design diagrams, and deterministic local React simulations where they improve understanding.
- Keep the application frontend-only. Do not add a backend, API routes, databases, authentication, accounts, bookmarks, personal notes, browser storage, or network-dependent simulations.
- Preserve static export, trailing-slash routes, the lesson index, page table of contents, previous/next navigation, and mobile Index control.
- Use Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, shadcn-style primitives, and MDX.
- Prefer Server Components and static MDX; use Client Components only when browser interaction requires them.
- Keep lesson prose in `content/`, route composition in `app/`, shared teaching blocks in `components/lesson-blocks.tsx`, and shared lesson navigation in `components/lesson-shell.tsx`.

## Brand Commitments

- Product name: **System Design Guide**.
- Teaching voice: skilled, patient, direct, and evidence-led. Explain how each decision is reached, one idea at a time, with concrete examples and without filler or pattern-name dumping.
- Preserve exact technical terminology and use original wording and original visual assets.
- The incumbent interface and project assets are established product evidence. Visual-system documentation or future redesign decisions belong outside this product record.

## Evidence on Hand

- Published product: `https://learn.ayush.ltd/`
- Product overview and operating instructions: `README.md`
- Detailed lesson structure and acceptance rules: `.codex/AGENTS.md`
- Existing LLD lessons, system-component lessons, Focus Mode routes, Java examples, generated diagrams, and deterministic simulations in the repository
- There are no testimonials, customer logos, usage benchmarks, pricing claims, or other commercial proof assets in the repository; future work must not fabricate them.

## Product Principles

1. Teach the reasoning path, not only the final answer.
2. Make every important design decision traceable to a confirmed requirement or component mechanic.
3. Use interactions and visuals only when they materially improve understanding.
4. Preserve restraint: omit classes, patterns, infrastructure, and product features that the confirmed scope does not need.
5. Keep the learning experience complete, deterministic, responsive, and independently usable without accounts or network services.

## Accessibility & Inclusion

The experience must work with keyboard input and at laptop and approximately 390 px mobile widths. Important state and correctness must not depend on color alone. Interactive controls require accessible names and visible focus, and motion must respect reduced-motion preferences. No specific external conformance level has been confirmed.
