# Project Strategy

How this repo is worked on. For *what* the site is and who it serves, see
[PRD.md](PRD.md); for how it is built, [CLAUDE.md](CLAUDE.md).

## Vision

A high-performance, aesthetically pleasing portfolio site that serves as both a
professional showcase and a living laboratory for agentic engineering workflows.

## Technical Principles

1. **Simplicity over Complexity:** Follow the "Reduction" mode by default. Only
   add features that provide "10-star" value — every dependency, document, and
   abstraction is something a single maintainer has to carry.
2. **Compound Knowledge:** No context should be lost. Every task must leave the
   project better documented than before — and documentation that has gone stale
   is a defect, not a lesser artifact.
3. **Rigorous Validation:** Implementation is incomplete without empirical
   evidence. Here that means the build gates and the post-deploy smoke test, not
   a unit-test suite — see PRD §5.1 for why, and verify against the commit
   rather than the working tree (§5.2).
4. **AI-First Architecture:** Design components and data structures that are easy
   for AI agents to reason about (modular, well-typed, clear boundaries). The
   directory-name-is-the-slug convention exists because it is unmissable by a
   script or an agent, where a parsed `slug:` field was not.
5. **Modern Standards:** Stick to Tailwind v4, Motion, and React Router v7
   framework mode. Avoid UI library fragmentation — the dependency list is eight
   packages and should stay small enough to read in one screen.

## Roadmap

- [x] Integrate Superpowers, gstack, and Compound Engineering workflows.
- [x] Establish baseline compound note and architectural review.
- [x] **Validation:** build gates (typecheck, asset verification, SEO analysis)
      plus a post-deploy HTTP smoke test. This replaces the earlier
      "install Vitest for the TDD mandate" item — a test runner was considered
      and deliberately rejected for a 14-route static site whose deploy artifact
      is the thing under test.
- [x] **Credibility:** removed fabricated case-study copy; content moved to
      one-folder-per-item; real 404; accessibility baseline; `public/` 38MB → 9MB.
- [ ] **Experience:** Enhance "magical moments" in the blog/project views
      (Senior Designer review).
- [ ] **Automation:** Automate "Compound Note" generation after task completion.

> Dropped: *"Deduplicate UI libraries (phase out MUI in favor of Shadcn/Tailwind)."*
> Neither MUI nor Shadcn is a dependency, and neither ever was — the item
> described a codebase this is not.
