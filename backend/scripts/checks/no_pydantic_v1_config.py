#!/usr/bin/env python3
"""
Architecture guard: Pydantic models must use v2-style model_config.

The Pydantic v1 pattern `class Config:` inside a model is deprecated and
silently ignored in Pydantic v2. The correct replacement is:

    model_config = ConfigDict(...)

This check catches any `class Config:` class definition inside
app/schemas/**/*.py to prevent silent misconfiguration.

Exits 1 (blocking commit) if a `class Config` inner class is found in any
schema file.
"""
import ast
import sys
from pathlib import Path

SCHEMAS_DIR = Path("app/schemas")


def _check_file(path: Path) -> list[str]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except SyntaxError:
        return []

    errors: list[str] = []
    for node in ast.walk(tree):
        # Any class named "Config" inside a schema file is the v1 pattern.
        if isinstance(node, ast.ClassDef) and node.name == "Config":
            errors.append(
                f"{path}:{node.lineno}: found Pydantic v1 `class Config` — "
                "replace with `model_config = ConfigDict(...)` (Pydantic v2)"
            )
    return errors


def main() -> int:
    errors: list[str] = []
    for path in SCHEMAS_DIR.rglob("*.py"):
        errors.extend(_check_file(path))

    if errors:
        print("\n[no-pydantic-v1-config] Pydantic v1 pattern detected:\n")
        for error in errors:
            print(f"  {error}")
        print(
            "\n  Fix: remove `class Config` and use:\n"
            "       from pydantic import ConfigDict\n"
            "       model_config = ConfigDict(use_enum_values=True, ...)\n"
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
