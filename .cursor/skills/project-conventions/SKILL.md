---
name: project-conventions
description: "Folder structure, Feature/UI layers, path aliases, assets vs public, naming, a11y for React + Vite + SCSS. Use when creating files, choosing UI vs Feature, or importing assets."
disable-model-invocation: false
---

# Project conventions (React + Vite + SCSS Modules)

Stack template: **React 19 + TypeScript + Vite + SCSS Modules + Feature/UI**.  
Related skills: [coding-standards](../coding-standards/SKILL.md), [react-feature-ui](../react-feature-ui/SKILL.md), [data-layer](../data-layer/SKILL.md).

## 0. Discover (required)

Do not copy the tree from this skill as-is. First find in the repo:

| What | Where to look |
|------|----------------|
| App root | `src/` or `app/` — whichever exists |
| Feature / UI | `src/components/Feature`, `src/components/UI` |
| Pages | `src/pages/` |
| Store / API / Query | `src/store`, `src/api`, `src/lib`, `src/lib/react-query` |
| Loaders | `src/loaders/` (if React Router data APIs) |
| Styles entry | `src/styles/index.scss`, `global-ui-scale` / `--ui-scale` |
| Aliases | `vite.config.*`, `tsconfig*.json` → `paths` |
| Assets | `src/assets/`, `public/` |

If the structure differs — **follow the repo**, do not force the template below.

## Typical tree (reference)

```
src/
├── components/
│   ├── UI/              # reusable primitives
│   └── Feature/         # screens and domain blocks
├── pages/               # thin route wrappers (folder triple per page)
├── hooks/
├── store/               # RTK (UI/session state), if present
├── api/                 # thin API modules (optional)
├── lib/                 # api client, react-query, integrations
├── loaders/             # route loaders (optional)
├── types/
├── utils/
├── mock/                # only for dev/stub
├── assets/              # icons/, images/
├── styles/              # SCSS tokens + index
├── App.tsx
└── main.tsx
public/                  # favicon, fonts, static URL files
```

Folders like `auth/`, `nativeBridge/`, Telegram, etc. — only if they exist in the repo; do not invent a layer that is not there.

## Feature vs UI

| Layer | Yes | No |
|-------|-----|-----|
| **UI** | Button, Input, Modal shell, Typography, Badge | Screen knowledge, API, query keys, business rules |
| **Feature** | Screen, domain composition, API/store calls | Duplicating atoms “for the mockup” |
| **Page** | Mount Feature + loader/errorElement; optional page-shell styles in folder module | Full screen / domain UI markup |

Exceptions already in the repo (e.g. UI Modal with domain content) — **do not expand**; new code should stay closer to the table above.

## `src/assets/` vs `public/`

- **`src/assets/`** — import via bundler (`@assets/*`), SVGR `?react`, hashes, tree-shaking.
- **`public/`** — fixed URL (`/fonts/...`), SEO, files without processing.

SVG as a React component — only from `src/assets/`.

Import naming and prefixes — [coding-standards](../coding-standards/SKILL.md#static-files).

## File naming

- Components (UI / Feature) and pages: folder triple `Name/Name.tsx` + optional `Name.module.scss` + `index.ts`
  - Pages live under `src/pages/Name/` — not flat `src/pages/Name.tsx`
- Hooks: `useThing.ts`
- Utils: `thingName.ts`
  - local (Feature/component only) — `Name/utils/`
  - shared — `src/utils/` (`@utils/*`)
- Types: `types.ts` / domain file in `types/`
- SCSS modules: `Name.module.scss`

Complex `useEffect` (> 10 lines) — extract to utils: [react-components](../react-components/SKILL.md#complex-logic-in-useeffect).

## Aliases (typical set)

After discover, use what is in tsconfig/vite:

- `@/*`, `@components/*`, `@styles/*`, `@assets/*`, `@hooks/*`, `@utils/*`, `@types/*`

Rules:

- Internal modules — via aliases
- Relative — only sibling files of the component (`./Name.module.scss`, `./hooks`)

## Performance and a11y

- `React.memo` / `useMemo` / `useCallback` — **only when proven needed** or as in neighboring code (see [react-components](../react-components/SKILL.md))
- `React.lazy` + `Suspense` for large screens, if that is the repo pattern
- **Accessibility is required** when writing components: semantic tags by meaning, non-empty `alt` on every `<img>`, accessible name, meaningful ARIA — details in [react-components](../react-components/SKILL.md#accessibility-and-semantics)
- Error boundaries / unified error UX — follow existing repo patterns
