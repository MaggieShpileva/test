#!/usr/bin/env python3
"""Project-rules review for the whole project (npm run rules:review).

Never edits source. Writes markdown under `.cursor/reviews/`.
Exit 0 when clean; exit 1 when automated findings exist (blocks git commit
via Husky / Cursor hook). Unexpected script failures still exit 0 (fail-open).
"""

from __future__ import annotations

import hashlib
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REVIEWS_DIR = ROOT / ".cursor" / "reviews"
CHECKLIST_PATH = ROOT / ".cursor" / "hooks" / "rules-review-checklist.md"
AUTO_REPORT_NAME = "project.auto.md"

# Token / palette sources — hardcoded colors here are expected.
COLOR_ALLOWLIST = (
    "src/styles/_colors.scss",
    "src/styles/_variables.scss",
    "src/styles/_typography.scss",
    "src/styles/_mixins.scss",
    "src/styles/index.scss",
    "src/styles/global-ui-scale.scss",
)

SKIP_DIR_NAMES = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "coverage",
    ".next",
    ".turbo",
    ".vite",
    "__pycache__",
    ".cursor",
}

REVIEW_SUFFIXES = {
    ".ts",
    ".tsx",
    ".scss",
    ".css",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
}

HEX_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b")
RGB_RE = re.compile(r"\brgba?\s*\(")
INTERFACE_RE = re.compile(r"^\s*export\s+interface\s+\w+", re.M)
DEEP_RELATIVE_RE = re.compile(r"""from\s+['"](?:\.\./){2,}""")
ASSET_IMPORT_RE = re.compile(
    r"""import\s+(\w+)\s+from\s+['"][^'"]+\.(png|jpe?g|gif|webp|svg)(?:\?[^'"]*)?['"]""",
    re.I,
)
RASTER_EXT = {".png", ".jpg", ".jpeg", ".gif", ".bmp"}


def log(message: str) -> None:
    sys.stderr.write(message.rstrip() + "\n")


def run_git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return ""
    return result.stdout


def is_reviewable_path(path: str) -> bool:
    norm = path.replace("\\", "/")
    if not norm or norm.startswith(".cursor/"):
        return False
    parts = norm.split("/")
    if any(part in SKIP_DIR_NAMES for part in parts[:-1]):
        return False
    suffix = Path(norm).suffix.lower()
    if suffix == ".scss" or suffix in REVIEW_SUFFIXES:
        return True
    return False


def list_project_files() -> list[str]:
    tracked = run_git("ls-files", "-z")
    if tracked:
        files = [p for p in tracked.split("\0") if p and is_reviewable_path(p)]
        return sorted(set(files))

    files: list[str] = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(ROOT).as_posix()
        if is_reviewable_path(rel):
            files.append(rel)
    return sorted(files)


def project_hash(files: list[str]) -> str:
    payload = "\n".join(files)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:12]


def read_file(path: str) -> str:
    try:
        return (ROOT / path).read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def is_color_allowlisted(path: str) -> bool:
    norm = path.replace("\\", "/")
    return any(norm.endswith(allow) or norm == allow for allow in COLOR_ALLOWLIST)


def check_raster_assets(files: list[str]) -> list[str]:
    findings: list[str] = []
    for path in files:
        lower = path.lower().replace("\\", "/")
        if "/assets/" not in lower and not lower.startswith("src/assets/"):
            continue
        ext = Path(path).suffix.lower()
        if ext in RASTER_EXT:
            findings.append(
                f"`{path}`: raster under assets should be `.webp` (found `{ext}`)"
            )
    return findings


def check_hardcoded_colors(files: list[str]) -> list[str]:
    findings: list[str] = []
    for path in files:
        if not path.endswith((".scss", ".css", ".module.scss")):
            continue
        if is_color_allowlisted(path):
            continue
        content = read_file(path)
        if not content:
            continue
        for match in HEX_RE.finditer(content):
            line = content[: match.start()].count("\n") + 1
            findings.append(
                f"`{path}:{line}`: hardcoded color `{match.group(0)}` — use tokens from `@styles`"
            )
        for match in RGB_RE.finditer(content):
            line = content[: match.start()].count("\n") + 1
            findings.append(
                f"`{path}:{line}`: hardcoded `rgb/rgba` — use tokens from `@styles`"
            )
    return findings


def check_asset_import_prefixes(files: list[str]) -> list[str]:
    findings: list[str] = []
    prefix_map = {
        "png": "PNG_",
        "jpg": "JPG_",
        "jpeg": "JPG_",
        "gif": "PNG_",
        "webp": "WEBP_",
        "svg": "SVG_",
    }
    for path in files:
        if not path.endswith((".ts", ".tsx")):
            continue
        content = read_file(path)
        if not content:
            continue
        for match in ASSET_IMPORT_RE.finditer(content):
            name, ext = match.group(1), match.group(2).lower()
            expected = prefix_map.get(ext)
            if expected and not name.startswith(expected):
                line = content[: match.start()].count("\n") + 1
                findings.append(
                    f"`{path}:{line}`: import `{name}` should use prefix `{expected}`"
                )
    return findings


def check_type_not_interface(files: list[str]) -> list[str]:
    findings: list[str] = []
    for path in files:
        if not path.endswith((".ts", ".tsx")):
            continue
        content = read_file(path)
        for match in INTERFACE_RE.finditer(content or ""):
            line = content[: match.start()].count("\n") + 1
            findings.append(
                f"`{path}:{line}`: prefer `type` over `interface` for props/DTOs"
            )
    return findings


def check_deep_relative_imports(files: list[str]) -> list[str]:
    findings: list[str] = []
    for path in files:
        if not path.endswith((".ts", ".tsx")):
            continue
        content = read_file(path)
        for match in DEEP_RELATIVE_RE.finditer(content or ""):
            line = content[: match.start()].count("\n") + 1
            findings.append(
                f"`{path}:{line}`: deep relative import — use path aliases"
            )
    return findings


def check_feature_ui_layer(files: list[str]) -> list[str]:
    """Heuristic: leaf primitives under Feature that look like UI atoms."""
    findings: list[str] = []
    ui_ish = re.compile(
        r"/(Button|Input|Modal|Badge|Checkbox|Radio|Switch|Tooltip|Spinner)/"
        r"\1\.tsx$"
    )
    for path in files:
        norm = path.replace("\\", "/")
        if "/components/Feature/" not in norm:
            continue
        if ui_ish.search(norm):
            findings.append(
                f"`{path}`: looks like a reusable UI primitive under Feature — "
                "prefer `components/UI` or reuse an existing primitive"
            )
    return findings


def collect_findings(files: list[str]) -> list[str]:
    findings: list[str] = []
    findings.extend(check_raster_assets(files))
    findings.extend(check_hardcoded_colors(files))
    findings.extend(check_asset_import_prefixes(files))
    findings.extend(check_type_not_interface(files))
    findings.extend(check_deep_relative_imports(files))
    findings.extend(check_feature_ui_layer(files))

    seen: set[str] = set()
    uniq: list[str] = []
    for item in findings:
        if item not in seen:
            seen.add(item)
            uniq.append(item)
    return uniq


def build_review(hash_id: str, files: list[str], findings: list[str]) -> str:
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    file_lines = "\n".join(f"- `{p}`" for p in files) or "- (none)"
    if findings:
        finding_lines = "\n".join(f"- [ ] {f}" for f in findings)
        verdict = "Needs attention"
    else:
        finding_lines = "- No automated findings."
        verdict = "Pass (automated checks)"

    checklist = ""
    if CHECKLIST_PATH.exists():
        checklist = CHECKLIST_PATH.read_text(encoding="utf-8").strip()

    return f"""# Project rules review

- **Project hash:** `{hash_id}`
- **When:** {now}
- **Author:** cli
- **Scope:** whole project
- **Files scanned:** {len(files)}
- **Verdict:** {verdict}
- **Mode:** review only (no source edits; exit 1 on findings)

## Scanned files

{file_lines}

## Automated findings

{finding_lines}

## Manual checklist (LLM / reviewer)

{checklist or "_Checklist file missing._"}

## Notes

- Do **not** apply fixes in this pass — only record findings.
- Exit code `1` when findings exist (blocks `git commit`).
- Fix only if the user explicitly asks after reading this review.
"""


def findings_preview(findings: list[str], *, limit: int = 12) -> str:
    preview = "\n".join(f"- {f}" for f in findings[:limit]) or "- none"
    if len(findings) > limit:
        preview += f"\n- …and {len(findings) - limit} more"
    return preview


def persist_auto_report(report: str) -> Path:
    REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    auto_path = REVIEWS_DIR / AUTO_REPORT_NAME
    auto_path.write_text(report, encoding="utf-8")
    return auto_path


def run_review() -> int:
    files = list_project_files()
    if not files:
        log("No reviewable project files found — rules review skipped.")
        return 0

    hash_id = project_hash(files)
    findings = collect_findings(files)
    report = build_review(hash_id, files, findings)
    auto_path = persist_auto_report(report)
    preview = findings_preview(findings)

    rel = auto_path.relative_to(ROOT).as_posix()
    log(
        f"Project rules review written to `{rel}` "
        f"({len(files)} file(s), {len(findings)} finding(s)). "
        "No source edits."
    )
    if findings:
        log("Automated findings:\n" + preview)
        log(f"Commit blocked — fix findings or see `{rel}`.")
        return 1

    log("No automated findings — OK.")
    return 0


def main() -> int:
    return run_review()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        log(f"Rules review failed: {exc}")
        raise SystemExit(0) from exc
