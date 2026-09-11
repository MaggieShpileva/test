---
name: coding-standards
description: "TypeScript and SCSS standards: type not interface, FC exports, clsx, camelCase modules, SVG_/WEBP_ prefixes, import aliases. Use when writing TS/TSX/SCSS or importing assets."
disable-model-invocation: false
---

# Coding standards

Stack: React + TypeScript + SCSS Modules.  
Related: [project-conventions](../project-conventions/SKILL.md), [react-components](../react-components/SKILL.md), [linting-formatting](../linting-formatting/SKILL.md).

## TypeScript / React

- Functional components only (arrow functions)
- `export const Name: FC<Props>`
- `import type { FC } from 'react'` (or together with value imports — as in the repo)
- Only **`type`**, not `interface`
- Props: PascalCase + `Props` suffix (`ButtonProps`)

```ts
type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export const Button: FC<ButtonProps> = ({ children, variant = 'primary', onClick }) => {
  // ...
};
```

### Naming

| What | Style |
|------|--------|
| Components / component files | PascalCase (`UserProfile.tsx`) |
| Variables / functions | camelCase |
| Constants | UPPER_SNAKE_CASE |

## Component structure

Same folder triple for UI, Feature, and pages (`src/pages/Name/`):

```
Name/
├── index.ts
├── Name.tsx
├── Name.module.scss   # optional
└── components/        # when the parent splits into parts
    └── Child/
        ├── index.ts
        ├── Child.tsx
        └── Child.module.scss
```

Nested blocks (including Figma sections) go under `Name/components/<Child>/` — not flat next to `Name.tsx`. Details: [react-feature-ui](../react-feature-ui/SKILL.md), [figma-to-code](../figma-to-code/SKILL.md#4-decompose--components).

```ts
// Name.tsx
import type { FC } from 'react';
import clsx from 'clsx';
import styles from './Name.module.scss';

type NameProps = {
  className?: string;
  variant?: 'primary' | 'secondary';
};

export const Name: FC<NameProps> = ({ className, variant = 'primary' }) => {
  const rootClass = clsx(
    styles.root,
    styles[`root${variant.charAt(0).toUpperCase()}${variant.slice(1)}`],
    className
  );
  return <div className={rootClass} />;
};

// index.ts
export { Name } from './Name';
```

## clsx

```ts
clsx(styles.button, styles[`button${Variant}`], {
  [styles.disabled]: disabled,
  [styles.active]: isActive,
}, className);
```

## SCSS Modules

- Classes: **camelCase** (`.buttonPrimary`, `.modalContent`)
- Nesting ≤ 3
- First line (or equivalent styles entry in the repo):

```scss
@use '@styles/index.scss' as *;
```

- Colors / spacing / fonts — from `@styles`, not local “magic” palettes
- Sizes from mockups: `calc(<px> * var(--ui-scale))` if the repo has `--ui-scale` (confirm name via discover)
- Do not import partials bypassing `styles/index` when index is the single entry

## Static files

Assets vs public — [project-conventions](../project-conventions/SKILL.md#srcassets-vs-public).

### Import prefixes

| Type | Prefix | Example |
|------|--------|---------|
| SVG (SVGR) | `SVG_` | `import SVG_logoIcon from '@assets/icons/logo.svg?react'` |
| PNG | `PNG_` | `PNG_backgroundImage` |
| JPG/JPEG | `JPG_` | `JPG_heroPhoto` |
| WEBP | `WEBP_` | `WEBP_heroImage` |

Asset files: **kebab-case**. Raster in `assets/images/<feature>/` must be **`.webp`** (from Figma MCP: download → convert → commit; do not leave png/jpg from the export).

## Imports

Order (unless the linter dictates otherwise):

1. React and external packages  
2. Internal modules (aliases)  
3. Relative  
4. `import type`

Always aliases instead of `../../../`. Relative — sibling component files only.
