---
name: react-feature-ui
description: "Feature/UI layering with SCSS Modules and path aliases. Use when adding screens, UI primitives, nesting components, page wrappers, or clarifying component structure."
disable-model-invocation: false
---

# React Feature / UI

Universal layers for **React + SCSS Modules**: **Page → Feature → UI**.  
Discover paths in the repo first, then use the template.

Related: [figma-to-code](../figma-to-code/SKILL.md), [ui-motion](../ui-motion/SKILL.md), [data-layer](../data-layer/SKILL.md), [project-conventions](../project-conventions/SKILL.md), [coding-standards](../coding-standards/SKILL.md).

## Discover

| Artifact | Typical paths |
|----------|----------------|
| Feature | `src/components/Feature/<Name>/` |
| UI | `src/components/UI/<Name>/` |
| Pages | `src/pages/<Name>/` (folder triple) |
| Styles entry | `@styles/index.scss` |
| Scale | `--ui-scale` / `global-ui-scale` |
| Barrels | `Feature/index.ts`, `UI/index.ts` |
| Aliases | from vite/tsconfig |

If structure differs — follow the repo.

## Layers

| Layer | Responsibility | Do not put |
|-------|----------------|------------|
| **Page** | Route mount, loader wiring; optional page-shell styles | Full screen / domain markup |
| **Feature** | Screen / domain, UI + data composition | Universal atoms “for every case” |
| **UI** | Primitives without domain logic | API, query keys, knowledge of specific screens |

```tsx
// pages/Example/Example.tsx
import { Example as ExampleFeature } from '@components/Feature';

export const Example = () => <ExampleFeature />;
```

Do not multiply legacy exceptions (UI with domain) in new code.

## File triple

Same layout for **UI**, **Feature**, and **pages**:

```
Name/
  Name.tsx
  Name.module.scss   # optional
  index.ts
  components/        # nested blocks (required when splitting)
    Child/
      Child.tsx
      Child.module.scss
      index.ts
```

- Pages: `src/pages/Name/` — never flat `src/pages/Name.tsx` next to a sibling `.module.scss`
- Nested Feature/UI blocks — **only** under `Name/components/<Child>/` with the same triple (including Figma sections)
- Do not place `Child.tsx` as a flat sibling of `Name.tsx`

**Figma / size limit:** component `*.tsx` — **≤ 70 lines**. If more — extract into `components/<Child>/` (see [figma-to-code](../figma-to-code/SKILL.md#4-decompose--components)).

```tsx
import type { FC } from 'react';
import clsx from 'clsx';
import styles from './Name.module.scss';

type NameProps = {
  className?: string;
};

export const Name: FC<NameProps> = ({ className }) => (
  <div className={clsx(styles.root, className)} />
);
```

## When UI, when Feature

- **UI** — atom or block used on ≥2 screens (Button, Input, Modal shell, Typography…).
- **Feature** — knows the domain or assembles a screen.

Before a new UI: search `components/UI` → `variant` / `className` → create only if no analog exists.

## SCSS Modules

```scss
@use '@styles/index.scss' as *;
```

- Classes camelCase; tokens from `@styles`
- Sizes: `calc(Npx * var(--ui-scale))` when scale exists in the repo
- Do not duplicate `dynit` / local `--*-scale` in components

## Assets

| Type | Path | Import |
|------|------|--------|
| Raster | `assets/images/<feature>/` | `WEBP_*`, `PNG_*` |
| Icons | `assets/icons/*.svg` | `SVG_*` + `?react` |

Files: kebab-case. Details — [coding-standards](../coding-standards/SKILL.md).

## State and overlays

- Server data / store — [data-layer](../data-layer/SKILL.md)
- Local `useState` — component UI details
- Modals / motion / transitions — [ui-motion](../ui-motion/SKILL.md): **repo patterns first**

## Checklist

- [ ] Page is thin; layout in Feature/UI
- [ ] Pages use folder triple (`pages/Name/`), not flat files
- [ ] Triple + named export + clsx
- [ ] UI reused, not copied
- [ ] `@use` styles; aliases instead of `../../../`
- [ ] Data not in UI primitive (except legacy)
- [ ] Overlays/animations per `ui-motion`
- [ ] Accessibility: semantics, non-empty `alt` on every `<img>`, accessible name, keyboard — [react-components](../react-components/SKILL.md#accessibility-and-semantics)
- [ ] `*.tsx` ≤ 70 lines; otherwise nested `components/<Child>/`
