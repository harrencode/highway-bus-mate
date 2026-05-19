#!/usr/bin/env python3
"""
Architecture guard: route handlers must never raise exceptions directly.

All exception logic belongs in the service layer. Routes should only call
services and return responses. Violations mean the service layer has been
bypassed, which breaks the layered exception-handling contract.

Exits 1 (blocking commit) if any `raise ExceptionType(...)` is found inside
app/api/**/routes/**/*.py files.
"""
import ast
import sys
from pathlib import Path

ROUTES_DIR = Path("app/api")


def _check_file(path: Path) -> list[str]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except SyntaxError:
        # Syntax errors are caught by other hooks; skip here.
        return []

    errors: list[str] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Raise) and node.exc is not None:
            errors.append(
                f"{path}:{node.lineno}: route handlers must not raise exceptions "
                "directly — move exception logic to the service layer"
            )
    return errors


def main() -> int:
    errors: list[str] = []
    for path in ROUTES_DIR.rglob("*.py"):
        if "routes" in path.parts:
            errors.extend(_check_file(path))

    if errors:
        print("\n[no-raise-in-routes] Architecture violation(s) detected:\n")
        for error in errors:
            print(f"  {error}")
        print("\n  Fix: raise exceptions inside the service layer, not in route handlers.\n")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
