# Compound Note: Initial Project Setup & Workflow Integration

**Date:** 2026-05-14
**Scope:** Project Architecture and Specialized Workflow Setup

## 1. Architectural Overview
- **Framework:** React + Vite + TypeScript.
- **Routing:** React Router v7 (using `createBrowserRouter` and `RouterProvider`).
- **Styling:** Tailwind CSS + Shadcn UI. Custom theme variables are managed in `src/styles/theme.css` and `default_shadcn_theme.css`.
- **Data Management:** Content (Projects/Blog) is currently hardcoded in `src/app/data/`.
    - *Decision:* This is appropriate for a static portfolio, but should be monitored for scaling issues.
- **Task Management:** Integrated with `task-master-ai` MCP for structured task tracking.

## 2. Workflow Integration (The "Installation")
Three major engineering philosophies have been integrated into this project's DNA:

### gstack (Brainstorming)
- **Office Hours:** 6 forcing questions to challenge initial framing.
- **Role Reviews:** CEO, EM, Designer, and DX Lead perspectives.
- **Location:** Managed via `GEMINI.md` and `.gemini/skills/gstack-brainstorming.md`.

### Superpowers (Execution)
- **Agentic Lifecycle:** Research -> Strategy -> Execution.
- **TDD:** Strict Red-Green-Refactor mandate.
- **Isolation:** Use of `git worktrees` for all feature work.
- **Location:** Supported by global extension skills and project `GEMINI.md`.

### Compound Engineering (Compounding Value)
- **The Compound Step:** Mandatory post-implementation review to capture context.
- **Location:** Managed via `GEMINI.md` and `.gemini/skills/compound.md`.

## 3. Persistent Memory Updates
- `MEMORY.md` has been updated to include the new workflow mandates.
- A `STRATEGY.md` has been initiated to anchor future architectural decisions.

## 4. Learnings & Observations
- The project structure is highly modular and follows modern React best practices.
- The use of static data files makes the site "content-as-code," which aligns well with the Superpowers TDD approach for content updates.
- Future improvements could include a more robust test suite (e.g., Vitest) to fully leverage the TDD mandate.
