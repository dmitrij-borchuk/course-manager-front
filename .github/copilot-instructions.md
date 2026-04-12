# GitHub Copilot Instructions

Keep code changes small, readable, and consistent with the existing project style.

## General
- Use TypeScript for new source files.
- Prefer functional React components and hooks.
- Use Atomic Design principles for UI structure (atoms, molecules, organisms, templates, pages).
- Reuse existing utilities, hooks, and shared components before adding new ones.
- Avoid large refactors unless explicitly requested.

## Quality
- Keep imports tidy and remove unused code.
- Add or update tests when behavior changes.
- Preserve current API contracts and component props unless asked to change them.

## UI and UX
- Follow existing layout and styling patterns in the codebase.
- Keep accessibility in mind (labels, semantic elements, keyboard support).

## Safety
- Do not introduce secrets, tokens, or credentials in code.
- Prefer explicit error handling and user-friendly error messages.
