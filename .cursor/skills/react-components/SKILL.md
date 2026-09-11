---
name: react-components
description: "React component patterns: FC, named exports, type props, hooks order, clsx, a11y, extract heavy useEffect to utils. Use when writing or refactoring components, hooks, or JSX."
disable-model-invocation: false
---

# React components

Related: [coding-standards](../coding-standards/SKILL.md), [react-feature-ui](../react-feature-ui/SKILL.md), [project-conventions](../project-conventions/SKILL.md).

## Base template

```tsx
import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { Button } from '@components/UI';
import styles from './ComponentName.module.scss';

type ComponentNameProps = {
  title: string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
};

export const ComponentName: FC<ComponentNameProps> = ({
  title,
  children,
  className,
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    onClick?.();
    setIsVisible((v) => !v);
  };

  return (
    <div className={clsx(styles.container, { [styles.visible]: isVisible }, className)}>
      <h2 className={styles.title}>{title}</h2>
      {children != null && <div className={styles.content}>{children}</div>}
      <Button onClick={handleClick}>{isVisible ? 'Hide' : 'Show'}</Button>
    </div>
  );
};
```

- Named export + `FC<Props>`
- Props — `type`, next to the component
- Classes — `clsx` + CSS module

## Props typing

```ts
type InputProps = {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};
```

## Order in the component body

1. Hooks (`useState`, `useEffect`, custom — in Rules of Hooks call order)
2. Derived values / `clsx`
3. Handlers
4. Early return (error / loading / empty)
5. JSX

Do not force a rigid “all useState, then all useEffect” order — valid hooks order and readability like neighboring files matter more.

## Complex logic in `useEffect`

If a `useEffect` callback is **complex** and **> 10 lines** — extract the logic out of the effect.

| Usage scope | Where to put it |
|-------------|-----------------|
| Only this component / Feature | `utils/` **next to the parent** (`Feature/Name/utils/`, `Component/utils/`) |
| Reusable / universal | shared `src/utils/` (alias `@utils/*`) |

Rules:

- Keep thin orchestration in `useEffect`: call a util / hook, subscribe, cleanup
- Pure computations and data parsing — in util functions (or a custom hook if React state/lifecycle is needed)
- Util file name — camelCase (`thingName.ts`), as in [project-conventions](../project-conventions/SKILL.md)

```tsx
// ❌ long logic directly in the effect
useEffect(() => {
  // 15+ lines of parsing / mapping / branching
}, [deps]);

// ✅
useEffect(() => {
  const result = prepareModalState(deps);
  setState(result);
  return () => result.dispose?.();
}, [deps]);
```

## Conditional render

```tsx
if (error) return <ErrorMessage error={error} />;
if (isLoading) return <LoadingSpinner />;
if (!items.length) return <EmptyState />;

return (
  <div className={styles.container}>
    {items.map((item) => (
      <ItemCard key={item.id} item={item} />
    ))}
  </div>
);
```

Error/Loading names — from repo UI/Feature; do not invent new primitives.

## Accessibility and semantics

When writing **every** component, bake in a11y and correct semantic tags — do not leave this for later.

### Semantic tags

- Choose the tag by meaning, not appearance: `button` / `a` for actions and links; `nav`, `main`, `section`, `article`, `header`, `footer`, `ul`/`ol`/`li` — by block role
- Do not wrap everything in `div`/`span` when a suitable HTML element exists
- Headings — `h1`–`h6` hierarchy without skipping levels for styling (style via CSS)
- Card / item lists — `ul`/`ol` + `li`, not a set of `div`s
- Interactive control — native `button` / `a` (or another control), **not** a bare `div`/`span` with `onClick`

```tsx
// ❌ interactive = div
<div onClick={onOpen}>Open</div>

// ✅
<button type="button" onClick={onOpen}>Open</button>
```

### Clickable card / zone inside a card

Do **not** make the whole card a `<button>`: it often has a title, text, secondary buttons — nested interactive inside `button`/`a` is forbidden.

| Situation | How to handle |
|-----------|----------------|
| Whole card navigates / opens detail | Container — `article` / `li` (no `onClick`). Primary action — one `a` or `button` inside (often on the title) + **stretched link**: link/button stretched over the card via CSS (`::after` / absolute), cursor and click over the card area |
| Only part is clickable (title, “More”, icon) | Interactive only on that part — `a`/`button`; rest is normal markup without `onClick` |
| Primary click + secondary actions (favorite, menu) | Stretched link for primary; secondary — separate `button`s with higher `position`/`z-index` so they are not captured |
| Need `onClick` without navigation (open modal) | Same pattern, but control is `button type="button"`, not `div` |

```tsx
// ✅ card looks clickable; interactive is the link/button
<article className={styles.card}>
  <h3>
    <a href={href} className={styles.stretchedLink}>
      {title}
    </a>
  </h3>
  <p>{description}</p>
  <button type="button" className={styles.secondary} onClick={onFavorite}>
    Add to favorites
  </button>
</article>

// ❌
<article onClick={onOpen}>...</article>
<div role="button" onClick={onOpen}>...</div>
```

- Do not wrap the whole card in `<a>`/`<button>` if it already contains other links or buttons
- Do not put `onClick` on the container “for convenience” — expand hit-area with CSS on the real control

### Required a11y minimum

| What | Rule |
|------|------|
| Images | Every `<img>` `alt` is **always** filled with non-empty meaningful text. `alt=""` and missing `alt` are forbidden |
| Icon buttons | Accessible name: `aria-label` / visually hidden text |
| Forms | `label` linked to control (`htmlFor` / wrap); errors — `aria-describedby` / `aria-invalid` |
| Interactive | Focus visible; Tab order logical; Enter/Space on buttons — native |
| State | `aria-expanded`, `aria-selected`, `aria-disabled` / `disabled` — match the UI |
| Hiding | Visually hidden content for SR — repo utility class; `display: none` removes from the a11y tree |

```tsx
// ✅
<img src={player} alt={playerName} />
<img src={pattern} alt="Decorative card pattern" />

// ❌ empty or missing alt
<img src={pattern} alt="" />
<img src={player} />
```

### ARIA

- Native semantics first; ARIA only if the element is missing or insufficient
- Do not duplicate a role the tag already provides (`<button role="button">`)
- `aria-hidden="true"` — only on decorative nodes; do not hide interactive content inside

### Checklist before shipping a component

- [ ] Tags reflect block meaning (not “everything is a div”)
- [ ] Interactive — `button` / `a` / native control
- [ ] Icon buttons and textless interactive have an accessible name
- [ ] Every `<img>` has non-empty `alt`
- [ ] Focus and keyboard work without a mouse

## Custom hooks

If component logic is **complex** and **> 10 lines** — extract it out of the `*.tsx` body into a custom hook (not only for reuse: keep the component thin — orchestration + JSX).

| Put in a custom hook | Keep in the component / utils |
|----------------------|-------------------------------|
| Clusters of `useState` / `useReducer` + related handlers (> 10 lines) | Tiny one-off handlers |
| Derived state and sync that needs React APIs | Pure parsing / mapping → `utils/` |
| Subscription / lifecycle orchestration that owns state | Thin `useEffect` that calls a util |

- File: `useThing.ts` in `hooks/` or `Component/hooks/`
- Return an object of fields; callback stability — only when needed

```tsx
// ❌ heavy logic inline in the component
export const Book: FC = () => {
  const [page, setPage] = useState(0);
  // many handlers / derived values / effects…
  return <FlipBook … />;
};

// ✅
export const Book: FC = () => {
  const { page, goNext, goPrev } = useBookNavigation();
  return <FlipBook page={page} onNext={goNext} onPrev={goPrev} />;
};
```

## Performance

**Do not** add `React.memo`, `useMemo`, `useCallback` by default.

Add only if:

- neighboring code of the same pattern already does it, or
- there is a measurable problem / explicit request, or
- the repo clearly has no React Compiler and memoization is accepted by the team

Otherwise — plain functions and values.
