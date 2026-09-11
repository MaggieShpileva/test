# Auto Layout → CSS (from figma-use, for design → code)

Auto Layout / sizing concepts from [figma-use](https://github.com/figma/mcp-server-guide/tree/main/skills/figma-use) map to CSS Modules + flex. Do not copy Plugin API calls — only the meaning of the properties.

Examples use `var(--ui-scale)`; if the repo uses a different scale variable name, substitute it after discover.

## Container

| Figma | CSS |
|-------|-----|
| `layoutMode: HORIZONTAL` | `display: flex; flex-direction: row` |
| `layoutMode: VERTICAL` | `display: flex; flex-direction: column` |
| `itemSpacing` | `gap: calc(Npx * var(--ui-scale))` |
| `paddingLeft/Right/Top/Bottom` | `padding-*` with scale |
| `primaryAxisAlignItems` | main axis → `justify-content` |
| `counterAxisAlignItems` | cross axis → `align-items` |
| `layoutWrap: WRAP` | `flex-wrap: wrap` |
| `strokesIncludedInLayout` | account for border in box model (`box-sizing: border-box`) |

Related children in Auto Layout → one flex container. Do not place siblings with absolute coordinates “as in the export”.

## Child / frame sizing

Figma has two different enums (important not to mix when reading MCP/inspector):

- On a **child**: `layoutSizingHorizontal/Vertical` = `FIXED` | `HUG` | `FILL`
- On an **auto-layout frame**: `primaryAxisSizingMode` / `counterAxisSizingMode` = `FIXED` | `AUTO` (≈ HUG content)

| Figma sizing | CSS |
|--------------|-----|
| `FIXED` + width/height | `width` / `height`: `calc(Npx * var(--ui-scale))` (CSS scale var name — from repo discover) |
| `HUG` / axis `AUTO` | `width`/`height: fit-content` or omit (intrinsic); for text — natural size |
| `FILL` | in row: `flex: 1; min-width: 0`; in column: `flex: 1; min-height: 0` and/or `align-self: stretch` |
| Absolute-positioned child | `position: absolute` + insets; **not** `flex: 1` |

### Text (common gotcha from figma-use)

- Text with “FILL width” in UI → set an **explicit width** on the container + wrapping (`white-space` / `overflow-wrap`), otherwise on the web text behaves differently than a zero-width “thread” in Figma with wrong auto-resize.
- Line clamping: `line-height` must fit glyphs; verify with a screenshot (clipped descenders).

## Absolute vs Auto Layout

| When absolute is appropriate | When not |
|------------------------------|----------|
| Decor, corner badge, overlay inside a card, game hotspot | Main screen column, card list, header+content+footer |

MCP often returns `absolute` + `left/top` even for auto-layout. **Rebuild** as flex from the screenshot and section structure.

## Spacing scale

1. Map gap/padding to repo `$spacing-*` tokens.
2. If no nearest token — `calc(Npx * var(--ui-scale))`; if repeated — propose a token.
3. Do not convert spacing to rem/vw from the Tailwind export.

## Radius, stroke, clip

| Figma | CSS |
|-------|-----|
| `cornerRadius` / per-corner | `border-radius` (+ scale if that is the convention) |
| stroke weight / color | `border` / `outline`; color from tokens |
| `clipsContent` | `overflow: hidden` |
| opacity | `opacity` |

## Skeleton example

```scss
@use '@styles/index.scss' as *;

.card {
  display: flex;
  flex-direction: column;
  gap: calc(12px * var(--ui-scale));
  padding: calc(16px * var(--ui-scale));
  border-radius: calc(12px * var(--ui-scale));
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: calc(8px * var(--ui-scale));
}

.grow {
  flex: 1;
  min-width: 0;
}
```
