#!/usr/bin/env python3
"""Cursor beforeShellExecution hook: run rules review on git commit.

Blocks the commit when automated findings exist; always writes
`.cursor/reviews/project.auto.md`.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

HOOKS_DIR = Path(__file__).resolve().parent
ROOT = HOOKS_DIR.parents[1]
REVIEW_SCRIPT = HOOKS_DIR / "rules-review.py"
REPORT_REL = ".cursor/reviews/project.auto.md"


def run_review() -> tuple[int, str]:
    if not REVIEW_SCRIPT.is_file():
        return 0, ""
    result = subprocess.run(
        [sys.executable, str(REVIEW_SCRIPT)],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    stderr = (result.stderr or "").strip()
    if stderr:
        sys.stderr.write(stderr + "\n")
    return result.returncode, stderr


def deny_payload(stderr: str) -> dict[str, str]:
    preview = stderr[-1500:] if stderr else f"See `{REPORT_REL}`."
    return {
        "permission": "deny",
        "user_message": (
            f"Rules review found issues — commit blocked. "
            f"Report: `{REPORT_REL}`.\n{preview}"
        ),
        "agent_message": (
            f"git commit blocked by project rules review. "
            f"Read `{REPORT_REL}`, fix the findings, then commit again."
        ),
    }


def main() -> int:
    try:
        sys.stdin.read()
    except OSError:
        pass

    try:
        code, stderr = run_review()
    except Exception as exc:
        sys.stderr.write(f"Rules review hook failed: {exc}\n")
        sys.stdout.write(json.dumps({"permission": "allow"}))
        sys.stdout.write("\n")
        return 0

    if code != 0:
        sys.stdout.write(json.dumps(deny_payload(stderr)))
    else:
        sys.stdout.write(json.dumps({"permission": "allow"}))
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
