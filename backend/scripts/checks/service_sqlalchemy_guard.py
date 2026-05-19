#!/usr/bin/env python3
"""
Architecture guard: every public service method must handle SQLAlchemyError.

Service methods that touch the database must wrap their logic in
try/except SQLAlchemyError so that raw ORM errors never bubble up to
the HTTP layer as 500s without structured logging.

Required pattern in every non-dunder, non-private method of a *Service class:

    try:
        ...
    except AppException:
        raise
    except SQLAlchemyError as e:
        ...
        raise DatabaseException(...)

Exits 1 (blocking commit) if a public method in app/services/**/*.py
contains a `db` parameter but has no `except SQLAlchemyError` handler.
"""
import ast
import sys
from pathlib import Path

SERVICES_DIR = Path("app/services")


def _method_has_db_param(func: ast.FunctionDef | ast.AsyncFunctionDef) -> bool:
    return any(a.arg == "db" for a in func.args.args)


def _has_sqlalchemy_except(func: ast.FunctionDef | ast.AsyncFunctionDef) -> bool:
    for node in ast.walk(func):
        if not isinstance(node, ast.ExceptHandler):
            continue
        t = node.type
        # except SQLAlchemyError ...
        if isinstance(t, ast.Name) and t.id == "SQLAlchemyError":
            return True
        # except (SQLAlchemyError, ...) ...
        if isinstance(t, ast.Tuple):
            for elt in t.elts:
                if isinstance(elt, ast.Name) and elt.id == "SQLAlchemyError":
                    return True
    return False


def _check_file(path: Path) -> list[str]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except SyntaxError:
        return []

    errors: list[str] = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.ClassDef):
            continue
        if not node.name.endswith("Service"):
            continue
        for item in node.body:
            if not isinstance(item, ast.FunctionDef | ast.AsyncFunctionDef):
                continue
            if item.name.startswith("_"):
                continue  # skip private/dunder
            if not _method_has_db_param(item):
                continue
            if not _has_sqlalchemy_except(item):
                errors.append(
                    f"{path}:{item.lineno}: `{node.name}.{item.name}` has a `db` "
                    "parameter but no `except SQLAlchemyError` handler — add "
                    "SQLAlchemy error handling and raise DatabaseException"
                )
    return errors


def main() -> int:
    errors: list[str] = []
    for path in SERVICES_DIR.rglob("*.py"):
        errors.extend(_check_file(path))

    if errors:
        print("\n[service-sqlalchemy-guard] Missing SQLAlchemy error handling:\n")
        for error in errors:
            print(f"  {error}")
        print(
            "\n  Fix: wrap method body in try/except SQLAlchemyError and raise "
            "DatabaseException with a structured logger.error call.\n"
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
