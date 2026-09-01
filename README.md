# System Design Guide

A visual, interview-focused guide to system components and low-level design. Component lessons explain mechanics through deterministic comparisons; LLD lessons turn unclear prompts into requirements, entities, class responsibilities, complete Java code, and working simulations.

## Live website

The guide is live at **[learn.ayush.ltd](https://learn.ayush.ltd/)**.

## What makes this guide different

- One repeatable interview method for every problem
- Simple explanations that show how each decision is reached
- Clarifying questions and the requirements derived from their answers
- Original overview and entity-flow illustrations
- Interactive simulations for normal and failure cases
- Complete, syntax-colored Java 17 implementations
- Clear explanations of useful patterns and deliberately unused patterns
- Deeper teaching for important concepts such as concurrency, scheduling, and graph routing
- Responsive reading and simulations on laptops and phones
- Fully static frontend with no backend, authentication, accounts, or storage

## Available lessons

### System components

| # | Topic | Main idea | Level |
|---:|---|---|---|
| C1 | [Apache Kafka](https://learn.ayush.ltd/components/kafka/) ([Focus Mode](https://learn.ayush.ltd/components/kafka/learn/)) | Partitions, consumer groups, offsets, replay, and use-case trade-offs | Beginner |

### LLD walkthroughs

| # | Topic | Main idea | Level |
|---:|---|---|---|
| 01 | [Elevator System](https://learn.ayush.ltd/problems/elevator/) | Scheduling requests and coordinating elevator state | Intermediate |
| 02 | [Tic-Tac-Toe](https://learn.ayush.ltd/problems/tic-tac-toe/) | Turn rules, move validation, and game completion | Beginner |
| 03 | [Parking Lot](https://learn.ayush.ltd/problems/parking-lot/) | Spot allocation and ticket lifecycle | Intermediate |
| 04 | [Movie Ticket Booking](https://learn.ayush.ltd/problems/movie-ticket-booking/) | Seat state and safe concurrent booking | Intermediate |
| 05 | [Notification System](https://learn.ayush.ltd/problems/notification-system/) | Asynchronous channels, retries, and thread-safe job state | Intermediate |
| 06 | [Meeting Room Scheduler](https://learn.ayush.ltd/problems/meeting-room-scheduler/) | Time intervals and deterministic room selection | Intermediate |
| 07 | [Splitwise](https://learn.ayush.ltd/problems/splitwise/) | Exact expense splitting and debt simplification | Intermediate |
| 08 | [Ride Sharing](https://learn.ayush.ltd/problems/ride-sharing/) ([Focus Mode](https://learn.ayush.ltd/problems/ride-sharing/learn/)) | Driver matching, Dijkstra routing, and ride lifecycle | Intermediate |

## The lesson pattern

Every topic follows the same five interview phases:

1. **Requirements (~5 minutes)** — clarify actions, rules, errors, and boundaries before naming classes.
2. **Entities (~3 minutes)** — derive candidate objects from confirmed requirements and reject unnecessary classes.
3. **Class design (10–15 minutes)** — connect each requirement to the object, state, and method responsible for it.
4. **Java implementation (~10 minutes)** — study the complete Java 17 solution, code concepts, and a concrete execution trace.
5. **Extensions (~5 minutes)** — respond to realistic follow-up requirements with the smallest justified design change.

The reasoning rhythm stays consistent:

> Recall the requirement → ask a useful question → reason from the answer → make the design decision → explain what the decision enables.

Complex topics receive an additional deep explanation inside these phases. For example, Movie Ticket Booking teaches the booking race and lock boundary, Notification System separates asynchronous acceptance from bounded delivery retries, and Ride Sharing teaches weighted road graphs and Dijkstra's algorithm step by step.

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS and shadcn-style UI primitives
- MDX lesson content
- Java 17 examples
- Static export deployed through GitHub Pages

The site remains frontend-only. Simulations are deterministic local React components and do not call a backend or save browser data.

## Run locally

Requirements: Node.js 22 or later, npm, and JDK 17 or later when validating lesson code.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validate the project

```bash
npm run lint
npm run typecheck
npm run build
```

A new or changed lesson also requires its displayed Java files to be extracted, compiled together with `javac`, and exercised through its demo program. The main simulation and one rejection or edge case must be checked at laptop and mobile widths.

## Add a new LLD topic

The complete authoring and acceptance rules live in [`.codex/AGENTS.md`](.codex/AGENTS.md). At minimum, a topic with slug `<topic>` requires:

```text
content/<topic>.mdx
app/problems/<topic>/page.tsx
components/simulations/<topic>-simulator.tsx
public/images/<topic>-overview.png
public/images/<topic>-entity-flow.png
```

Also register the lesson in `lib/lessons.ts`, update adjacent previous/next links, and update the lesson table in this README. Every lesson must keep the five phase IDs: `requirements`, `entities`, `class-design`, `implementation`, and `extensions`.

## Deployment

Pushes to `main` are validated and exported by [the GitHub Pages workflow](.github/workflows/deploy-pages.yml). The custom domain serves the generated site from `/`, so production builds leave `NEXT_PUBLIC_BASE_PATH` empty.
