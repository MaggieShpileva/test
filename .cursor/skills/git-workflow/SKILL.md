---
name: git-workflow
description: "Conventional Commits format (feat, fix, chore). Use when writing commit messages, creating commits, or reviewing commit style."
disable-model-invocation: false
---

# Git — Conventional Commits

```
<type>: <subject>
```

## Types

| type | When |
|------|------|
| `feat` | new feature |
| `fix` | bug |
| `chore` | dependencies, config, routine |
| `docs` | documentation |
| `style` | code formatting (not CSS) |
| `refactor` | no behavior change |
| `perf` | performance |
| `build` / `ci` | build / CI |
| `revert` | revert |

## Subject rules

1. Imperative; no trailing period
2. No leading capital (if that is the repo `git log` style)
3. ~50–72 characters
4. Language — **same as repo `git log`** (often English)

```bash
feat: add Modal component
fix: fix disabled state styles
chore: update dependencies
```

Before committing — checks from [linting-formatting](../linting-formatting/SKILL.md).  
Commit only when the user asks; do not use `--no-verify` without an explicit request.
