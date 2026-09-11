# Validate UI against Figma

Adaptation of validation practices from [figma-use](https://github.com/figma/mcp-server-guide/tree/main/skills/figma-use) (Incremental Workflow / screenshot checks sections) for **design → code**.

## When to check

1. After each major screen **section**  
2. Before shipping the whole screen  
3. After spacing / typography / image fixes  

Tool: MCP `get_screenshot` on the source node (+ neighboring ones if needed). Compare with your UI (dev / story / screenshot).

## What to catch (typical misses)

| Symptom | Common cause |
|---------|--------------|
| Clipped text / descenders | Small `line-height`, fixed height, `overflow: hidden` |
| Overlaps | Absolute dump instead of flex; missing `min-width: 0` on FILL |
| “Empty” images | MCP asset not downloaded / still a remote URL; wrong `src`; slot without size |
| Non-webp raster | Exported png/jpg left in `assets/` — convert to `.webp` and use `WEBP_` |
| Giant icon | `height: auto` / no fixed width+height slot |
| Wrong font / weight | Inter or Regular instead of Medium |
| Gaps / crowding | Gap/padding not from mockup; ignored Auto Layout spacing |
| Wrong button variant | Default component props in code not checked |
| Modal “not like the mock” | Existing repo Modal/BottomModal not reused |

## Font (from discover-product-font / figma-use)

1. Before layout, lock the family from the repo (`@font-face`, Typography).  
2. After — visually compare letterforms with the Figma screenshot.  
3. Wrong font with an otherwise “successful” layout = **fail**, not a nit.

## Incremental order (mirrors figma-use)

```
1. Discover repo (tokens, UI, font)
2. get_design_context
3. Feature skeleton (section containers)
4. Section N → styles/assets → screenshot check
5. Next section
6. Final screenshot + skill checklist
```

Do not build a large screen as one unchecked diff.

## Error recovery (MCP)

1. **STOP** on error — read the message first.  
2. No `node-id` → ask for a URL with a node.  
3. Timeout → smaller node / child frame.  
4. Do not replace a full `get_design_context` with “guess from one screenshot” while MCP still responds.
