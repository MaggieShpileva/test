## Manual checklist

Review the **whole project** (source, styles, assets) — not only staged files. **Do not edit source files.**

| Check                                                                                                                                                              | Pass? |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| Raster images under `src/assets/` are `.webp` (SVG ok for icons)                                                                                                   |       |
| Asset imports use `WEBP_` / `PNG_` / `SVG_` / `JPG_` prefixes                                                                                                      |       |
| Asset filenames are kebab-case                                                                                                                                     |       |
| Colors / spacing / fonts come from `@styles` tokens, not local magic values                                                                                        |       |
| _(optional)_ Sizes use `calc(Npx * var(--ui-scale))` — only if the repo already has `--ui-scale` / `global-ui-scale`; skip if not                                  |       |
| Reuse existing `components/UI` primitives (`variant` / `className`) before adding new ones                                                                         |       |
| Domain UI lives in Feature; pages stay thin folder mounts                                                                                                          |       |
| Component folders use `Name/Name.tsx` + optional module + `index.ts`                                                                                               |       |
| `*.tsx` components stay ≤ 70 lines (split nested folders if needed)                                                                                                |       |
| `useEffect` callbacks longer than **10 lines** are extracted to `utils/` (or a custom hook if React state/lifecycle is needed)                                     |       |
| Large component logic (**> 10 lines**: state clusters, handlers, derived state) lives in custom hooks (`hooks/` / `Name/hooks/`), not inline in the component body |       |
| Prefer `type` over `interface` for props/DTOs                                                                                                                      |       |
| Path aliases instead of deep `../../../` imports                                                                                                                   |       |
| No API fetches inside UI primitives                                                                                                                                |       |

### Finding format

```md
| Severity | Location           | Finding                            |
| -------- | ------------------ | ---------------------------------- |
| medium   | src/foo/Bar.tsx:12 | Hardcoded `#fff` — use color token |
```
