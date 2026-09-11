---
name: project-rules-review
description: "Whole-project review against project rules (webp, tokens, UI reuse, extract large logic to hooks). Never auto-fix. Writes a report; exit 1 / blocks git commit when findings exist. Run via npm run rules:review or when the user asks to review the project."
disable-model-invocation: false
---

# Project rules review

Use when the user asks to review the project against conventions, or after they run `npm run rules:review`.

Never edits source. Writes a report under `.cursor/reviews/`. Exit `0` when clean; exit `1` when automated findings exist (blocks commit via Husky / Cursor hook).

Runs from:

- **CLI** `npm run rules:review` → `python3 .cursor/hooks/rules-review.py` (scans the whole project, writes `project.auto.md`)
- **On commit** — Cursor `beforeShellExecution` (matcher `git commit`) via `.cursor/hooks/on-git-commit-review.py` → `deny` if findings
- **On commit** — Husky `.husky/pre-commit` (`npm run rules:review`), when `.husky/` exists at install time

Related: [coding-standards](../coding-standards/SKILL.md), [project-conventions](../project-conventions/SKILL.md), [react-feature-ui](../react-feature-ui/SKILL.md).

## Hard rules

1. **Do not edit source files** in this pass.
2. **Do not** run formatters/linters with `--fix` to “clean findings”.
3. **Only** write / update the review markdown under `.cursor/reviews/`.
4. Keep product copy and unrelated files untouched.
5. Review the **whole project** (tracked source / styles / assets) — not only staged files.

## Steps

1. If present, read the automated draft
   (`.cursor/reviews/project.auto.md`).
2. Inspect the project (start from the scanned file list in the draft).
3. Apply the checklist in `.cursor/hooks/rules-review-checklist.md`.
4. Write the final review to **exactly**:

```text
.cursor/reviews/project.md
```

5. Tell the user the verdict in one short paragraph + a findings table.

## Report template

```md
# Project rules review

- **Project hash:** `<hash>`
- **Verdict:** Pass | Needs attention
- **Mode:** review only (no source edits; exit 1 on findings)
- **Scope:** whole project

## Findings

| Severity | Location  | Finding     |
| -------- | --------- | ----------- |
| low      | path:line | description |

## Notes

Optional context. No fix commits in this pass.
```

## Severity

| Level  | When                                                                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| high   | Wrong layer (UI vs Feature), broken a11y pattern, non-webp raster added to assets                                                                      |
| medium | Hardcoded colors, missing asset prefixes, deep relative imports, `interface` for props, logic/`useEffect` > 10 lines left inline instead of utils/hook |
| low    | Naming nits, optional token opportunities, style order                                                                                                 |

If there are no issues, write an empty findings table and `Verdict: Pass`.
