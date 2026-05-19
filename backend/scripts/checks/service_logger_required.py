#!/usr/bin/env python3
"""
Architecture guard: service files must declare a module-level logger.

Every service module must have:

    logger = logging.getLogger(__name__)

This ensures that all error paths have a named logger available and that
structured log records are attributed to the correct module.

Exits 1 (blocking commit) if any app/services/**/*.py file defines a
*Service class but does not have a module-level `logger = logging.getLogger`
assignment.
"""
import ast
import sys
from pathlib import Path

SERVICES_DIR = Path("app/services")


def _has_service_class(tree: ast.Module) -> bool:
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef) and node.name.endswith("Service"):
            return True
    return False


def _has_module_logger(tree: ast.Module) -> bool:
    """Return True when the module top-level contains logger = logging.getLogger(...)."""
    for node in tree.body:
        if not isinstance(node, ast.Assign):
            continue
        # Must assign to a name called `logger`
        targets = [t for t in node.targets if isinstance(t, ast.Name) and t.id == "logger"]
        if not targets:
            continue
        # Value must be logging.getLogger(...)
        val = node.value
        if (
            isinstance(val, ast.Call)
            and isinstance(val.func, ast.Attribute)
            and val.func.attr == "getLogger"
            and isinstance(val.func.value, ast.Name)
            and val.func.value.id == "logging"
        ):
            return True
    return False


def _check_file(path: Path) -> list[str]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except SyntaxError:
        return []

    if not _has_service_class(tree):
        return []

    if not _has_module_logger(tree):
        return [
            f"{path}: service module has no module-level logger — add "
            "`logger = logging.getLogger(__name__)` at the top of the file"
        ]
    return []


def main() -> int:
    errors: list[str] = []
    for path in SERVICES_DIR.rglob("*.py"):
        errors.extend(_check_file(path))

    if errors:
        print("\n[service-logger-required] Missing module-level logger:\n")
        for error in errors:
            print(f"  {error}")
        print(
            "\n  Fix: add the following line near the top of the service file:\n"
            "       import logging\n"
            "       logger = logging.getLogger(__name__)\n"
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
