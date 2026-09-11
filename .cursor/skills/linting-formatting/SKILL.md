---
name: linting-formatting
description: "Prettier, ESLint, Stylelint, Husky hooks, and format-on-save for React + SCSS. Use when formatting code, fixing lint errors, preparing commits, or configuring the editor."
disable-model-invocation: false
---

# Formatting and linting

Typical stack tooling: **Prettier**, **ESLint** (typescript-eslint + react-hooks), **Stylelint** (SCSS), **Husky** + lint-staged.  
Concrete options — from repo configs (`.prettierrc*`, `eslint.config.*`, `stylelint.config.*`), do not invent them.

Related: [git-workflow](../git-workflow/SKILL.md).

## Discover

```bash
# commands — as in repo package.json, often:
npm run format / format:check
npm run lint / lint:fix
npm run lint:css / lint:css:fix
```

## Prettier (typical values for this stack)

If the config matches — use as a guide:

- 2 spaces, printWidth ~80
- single quotes; JSX double
- semicolons; trailingComma es5
- arrowParens always

Import order (if not enforced by a plugin): React/libs → aliases → relative → `import type`.

## ESLint / Stylelint

- ESLint: unused, hooks rules, prettier conflict disables
- Stylelint: standard-scss + order; classes **camelCase** in modules
- Exceptions only with a comment explaining why

## Pre-commit

When a hook fails:

```bash
npm run lint:fix
npm run format
npm run lint:css:fix
```

`--no-verify` — only on explicit user request.

## IDE

Format on save → Prettier; codeActionsOnSave → ESLint/Stylelint fix, if that is how the team works.

## Pre-commit checklist

- [ ] format / lint / lint:css clean (or auto-fix done)
- [ ] No dead commented-out code
- [ ] Disable comments are justified
