#!/usr/bin/env python3
"""
Architecture guard: every source module must have test coverage.

Enforced mappings
─────────────────
  app/services/<name>.py        → tests/services/test_<name>.py must exist
  app/repositories/<name>.py    → tests/repositories/test_<name>.py must exist
  app/api/v1/routes/<name>.py   → at least one file in tests/api/ must contain
                                  the route stem as a URL segment
                                  (e.g. "auth.py" → "/auth" in test content)

Exits 1 (blocking commit) if any source module lacks a corresponding test.
"""
import sys
from pathlib import Path

SERVICES_DIR = Path("app/services")
REPOS_DIR = Path("app/repositories")
ROUTES_DIR = Path("app/api/v1/routes")

TEST_SERVICES_DIR = Path("tests/services")
TEST_REPOS_DIR = Path("tests/repositories")
TEST_API_DIR = Path("tests/api")


def _source_files(directory: Path) -> list[Path]:
    return [
        p
        for p in directory.glob("*.py")
        if p.stem != "__init__"
        and not p.stem.startswith("_")
        and p.stem != "base"  # abstract base classes are covered by concrete subclass tests
    ]


def _check_strict(source_dir: Path, test_dir: Path, prefix: str = "test_") -> list[str]:
    """Service / repository check: test_{stem}.py must exist."""
    errors = []
    for src in _source_files(source_dir):
        expected = test_dir / f"{prefix}{src.stem}.py"
        if not expected.exists():
            errors.append(f"{src}: no corresponding test file found — " f"create {expected}")
    return errors


def _check_routes(routes_dir: Path, test_api_dir: Path) -> list[str]:
    """
    Route check: at least one test file in tests/api/ must reference the
    route stem as a URL path segment (e.g. "/auth", "/users", "/health").
    """
    errors = []
    # Collect all test file contents once
    test_contents = [
        p.read_text(encoding="utf-8") for p in test_api_dir.glob("test_*.py") if p.is_file()
    ]

    for src in _source_files(routes_dir):
        url_segment = f"/{src.stem}"  # e.g. "/auth", "/users"
        if not any(url_segment in content for content in test_contents):
            errors.append(
                f"{src}: no test file in {test_api_dir}/ references "
                f'the "{url_segment}" URL segment — add API tests for this route'
            )
    return errors


def main() -> int:
    errors: list[str] = []
    errors.extend(_check_strict(SERVICES_DIR, TEST_SERVICES_DIR))
    errors.extend(_check_strict(REPOS_DIR, TEST_REPOS_DIR))
    errors.extend(_check_routes(ROUTES_DIR, TEST_API_DIR))

    if errors:
        print("\n[test-coverage-required] Missing test coverage:\n")
        for error in errors:
            print(f"  {error}")
        print(
            "\n  Fix: add the required test file(s) before committing.\n"
            "  Every service, repository, and route module must have tests.\n"
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
