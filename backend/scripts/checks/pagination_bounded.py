#!/usr/bin/env python3
"""
Architecture guard: paginated route endpoints must cap the `limit` parameter.

An unbounded `limit` Query param lets callers request arbitrarily large result
sets, which can exhaust memory and database resources. Every `limit` parameter
that uses FastAPI's Query() must include an `le=` upper bound.

Pattern checked (AST-based, handles multi-line signatures):
  limit: int = Query(...)   — must contain  le=<number>  somewhere in the call.

Exits 1 (blocking commit) if a `limit` Query param without `le=` is found
in any app/api/**/routes/**/*.py file.
"""
import ast
import sys
from pathlib import Path

ROUTES_DIR = Path("app/api")


def _query_call_has_le(call: ast.Call) -> bool:
    """Return True when the Query(...) call contains a `le=` keyword argument."""
    return any(kw.arg == "le" for kw in call.keywords)


def _check_file(path: Path) -> list[str]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except SyntaxError:
        return []

    errors: list[str] = []

    for node in ast.walk(tree):
        # We're looking for function definitions (sync or async).
        if not isinstance(node, ast.FunctionDef | ast.AsyncFunctionDef):
            continue

        args = node.args
        # Combine positional + keyword-only args together with their defaults.
        # defaults are right-aligned against args.args.
        all_args = args.args + args.kwonlyargs
        defaults = (
            [None] * (len(args.args) - len(args.defaults))
            + list(args.defaults)
            + list(args.kw_defaults)
        )

        for arg, default in zip(all_args, defaults):
            if arg.arg != "limit":
                continue
            if default is None:
                continue
            # default must be a Query(...) call
            if not (
                isinstance(default, ast.Call)
                and isinstance(default.func, ast.Name)
                and default.func.id == "Query"
            ):
                continue
            # Found `limit: ... = Query(...)` — check for le= keyword
            if not _query_call_has_le(default):
                errors.append(
                    f"{path}:{arg.col_offset and node.lineno}: "
                    f"function `{node.name}` has `limit = Query(...)` "
                    "without an `le=` upper bound — add e.g. `le=1000` to "
                    "prevent unbounded pagination"
                )

    return errors


def main() -> int:
    errors: list[str] = []
    for path in ROUTES_DIR.rglob("*.py"):
        if "routes" in path.parts:
            errors.extend(_check_file(path))

    if errors:
        print("\n[pagination-bounded] Unbounded pagination detected:\n")
        for error in errors:
            print(f"  {error}")
        print(
            "\n  Fix: add an upper bound to the limit Query param, e.g.:\n"
            "       limit: int = Query(default=100, ge=1, le=1000)\n"
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
