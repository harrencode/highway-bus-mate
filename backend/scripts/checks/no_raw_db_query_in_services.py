#!/usr/bin/env python3
"""
Architecture guard: services must never bypass the repository layer.

Calling db.query() directly inside a service couples business logic to the
ORM, defeats the repository abstraction, and makes the service untestable in
isolation. All data access must go through the injected repository instance.

Exits 1 (blocking commit) if any `db.query(...)` call-expression is found
inside app/services/**/*.py files.
"""
import ast
import sys
from pathlib import Path

SERVICES_DIR = Path("app/services")


def _is_db_query_call(node: ast.AST) -> bool:
    """Return True for the AST node that represents db.query(...)."""
    return (
        isinstance(node, ast.Call)
        and isinstance(node.func, ast.Attribute)
        and node.func.attr == "query"
        and isinstance(node.func.value, ast.Name)
        and node.func.value.id == "db"
    )


def _check_file(path: Path) -> list[str]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except SyntaxError:
        return []

    errors: list[str] = []
    for node in ast.walk(tree):
        if _is_db_query_call(node):
            assert isinstance(node, ast.Call)
            errors.append(
                f"{path}:{node.lineno}: services must not call db.query() directly "
                "— use the repository layer (self.user_repo.get(...), etc.)"
            )
    return errors


def main() -> int:
    errors: list[str] = []
    for path in SERVICES_DIR.rglob("*.py"):
        errors.extend(_check_file(path))

    if errors:
        print("\n[no-raw-db-query-in-services] Architecture violation(s) detected:\n")
        for error in errors:
            print(f"  {error}")
        print(
            "\n  Fix: replace db.query() calls with repository methods "
            "(self.<name>_repo.get(), .find(), .list(), etc.).\n"
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
