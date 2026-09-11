---
name: ui-motion
description: "UI motion and overlays: reuse repo Modal first, then CSS, then framer-motion; optional View Transitions/Dialog/Popover for greenfield. Use when adding animations, modals, popovers, or page transitions."
disable-model-invocation: false
---

# UI Motion & overlays

Animations and overlays **in application code**. The order below is for React + (often) `framer-motion`.

Related: [react-feature-ui](../react-feature-ui/SKILL.md), [figma-to-code](../figma-to-code/SKILL.md).

## Choice priority (required)

| # | Action |
|---|--------|
| 1 | **Reuse repo** — existing `Modal`, `BottomModal`, `Tooltip`, motion helpers, `lockScroll` |
| 2 | **CSS** `transition` / `@keyframes` — hover, focus, micro ≤150–250ms |
| 3 | **Same motion package as the feature** (`framer-motion` or `motion`) — gestures, stagger, layout/exit |
| 4 | **Web Platform** (View Transitions, Dialog, Popover, Navigation, Workers, Broadcast Channel, Clipboard) — only if the repo has **no** ready pattern and the task fits the API well; otherwise do not rewrite working portal modals |

**Do not** migrate existing Modal/BottomModal to `<dialog>` / Popover “to match the skill” without an explicit request.

**Do not** mix `motion/react` and `framer-motion` in one file — use the package from neighboring code.

## Discover

1. How are Modal / BottomModal / Tooltip done in `components/UI`?
2. Which animation package is already in `package.json` and neighboring files?
3. Is there `lockScroll`, shared `variants`, a route transition wrapper?
4. Environment (WebView / in-app): feature-detect + fallback, without crashing the app.

## When to use what

### Modal / sheet already exists in the repo

- New modal / bottom sheet → **extend** the existing API (`type`, content slot), not a new portal.
- Open/close animation — same as neighboring overlays (often `AnimatePresence` + `motion`).

### CSS

- Hover / color / opacity / simple state.
- Do not pull motion for a button fade.

### framer-motion / motion

- Drag (bottom sheet), complex stagger, exit inside a screen, shared layout — when CSS is not enough.
- Durations/easing — as in the feature or from the mockup (intent); do not copy the Figma Plugin API.

### Web Platform (greenfield / targeted)

| API | Case |
|-----|------|
| View Transitions | Large view/route change when there is no custom transition layer |
| Dialog | New modal from scratch and no UI-Modal |
| Popover | Non-modal menus/tooltips from scratch and no UI-Tooltip |
| Navigation | Intercept navigation next to the router without breaking React Router |
| Workers | CPU-heavy (parsing, large JSON), not UI animation |
| Broadcast Channel | Tab sync (logout, cache bump) |
| Clipboard | `navigator.clipboard` in a user gesture; fallback only if the API is missing |

```ts
const supportsVT =
  typeof document !== 'undefined' && 'startViewTransition' in document;
```

## Principles

- 1–2 effects per interaction
- Animate `opacity` / `transform` (and VT pseudo-elements if using VT)
- Progressive enhancement in WebView
- From Figma — duration/easing intent; implementation — via the repo pattern

## Anti-patterns

- Rewriting portal-Modal to Dialog without a request
- `AnimatePresence` on the whole router “instead of” anything when another approach already exists
- A new animation package next to an existing one
- Tailwind `animate-*` from Figma MCP as-is
- Worker / Broadcast Channel for trivial UI

## Checklist

- [ ] Repo pattern found and reused first
- [ ] CSS → motion package → (optional) Platform API
- [ ] Motion package aligned with the feature
- [ ] WebView: feature-detect + fallback
- [ ] No “migration for migration’s sake”
