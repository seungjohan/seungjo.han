# Overall Compound Note: Codebase Baseline Review

**Date:** 2026-05-14
**Scope:** Comprehensive Codebase Review & Baseline Establishment

## 1. Architectural Patterns & Discoveries

### Content-as-Code
- **Pattern:** All dynamic content (blog posts, projects) is stored as typed TypeScript objects in `src/app/data/`.
- **Learning:** this allows for full type safety across the site and eliminates the need for a CMS in the early stages. It also allows the "Superpowers" TDD workflow to be applied to content updates (e.g., verifying a project object has all required fields).

### Dynamic Navigation (`AnchorNav`)
- **Discovery:** The `AnchorNav` component implements a table-of-contents feature by scanning the DOM for `h2` and `h3` tags with IDs.
- **Learning:** It uses a 120ms timeout to wait for React's render. This is a pragmatic "gotcha" fix for a decoupled component. A more robust "10-star" version might use a custom hook or context to register headings during their component lifecycle.

### Modern Styling Stack
- **Pattern:** Tailwind v4 + `@tailwindcss/vite` + `motion/react` + `lucide-react`.
- **Observation:** The site uses `motion/react` (the new Framer Motion package) and Tailwind v4, showing a commitment to cutting-edge web standards.

## 2. Technical Debt & Calibration

### UI Library Overlap
- **Observation:** Both `@mui/material` and a full suite of Shadcn UI (Radix-based) components are present in `package.json`.
- **Debt:** Using two heavy UI libraries can lead to bundle bloat and inconsistent styling patterns.
- **Action:** Future work should favor Shadcn/Tailwind and phase out MUI unless specific components (like complex charts or unique icons) strictly require it.

### Testing Gap
- **Calibration:** While the `GEMINI.md` mandates TDD, there is currently no test runner (Vitest/Jest) configured in `package.json`.
- **Priority:** High. Establishing a test baseline is the next "Compound" requirement to enable the Superpowers workflow.

## 3. "10-Star" Calibration
The site currently reaches a **7/10** on the "Designer & Writer" vision.
- **Strengths:** Clean typography, smooth transitions, functional navigation.
- **Missing for 10/10:**
    - "Magical moments" in the blog reader (e.g., interactive scroll progress, better typography).
    - Empirical verification (tests) to ensure the "Senior Engineer" side of the persona is equally represented.
    - Deep search functionality (the modal is there, but need to check its indexing logic).

## 4. Reusable Patterns Identified
- **`FadeIn` component:** Standardized entry animation.
- **`isActive` helper:** Consistent route highlighting in `Layout.tsx`.
- **Static Data Exports:** Reusable interfaces for content.
