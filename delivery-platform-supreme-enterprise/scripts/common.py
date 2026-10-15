"""Shared deterministic, dependency-free helpers for the skill tooling."""
from __future__ import annotations
import hashlib
import json
import re
from pathlib import Path

NAME_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')


def frontmatter(text: str) -> dict[str, str]:
    """Minimal YAML *header* inspection; not a general YAML parser.

    Only reads top-level scalar keys required for validation. The tools never
    interpret YAML as executable instructions. Description can be multiline.
    """
    if not text.startswith('---\n'):
        raise ValueError('missing opening YAML frontmatter')
    match = re.search(r'^---\s*$', text[4:], flags=re.MULTILINE)
    if not match:
        raise ValueError('missing closing YAML frontmatter')
    raw = text[4:4+match.start()]
    result: dict[str,str] = {}
    for line in raw.splitlines():
        m = re.match(r'^([a-z][a-z0-9_-]*):(?:\s*(.*))?$', line)
        if m:
            result[m.group(1)] = (m.group(2) or '').strip().strip('"\'')
    if 'name' not in result or 'description' not in result:
        raise ValueError('missing required name or description')
    return result


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as file:
        for block in iter(lambda:file.read(1024*1024),b''):
            h.update(block)
    return h.hexdigest()


def strict_json(path: Path):
    return json.loads(path.read_text(encoding='utf-8'))


def resolve_beneath(root: Path, relative: str, *, require_file: bool = True) -> Path:
    """Reject path traversal, absolute paths, and symlink escape."""
    if not isinstance(relative,str) or not relative or '\\' in relative:
        raise ValueError('invalid relative path')
    p = Path(relative)
    if p.is_absolute() or '..' in p.parts:
        raise ValueError('path traversal or absolute path')
    root = root.resolve()
    result = (root/p).resolve()
    if not result.is_relative_to(root):
        raise ValueError('resolved path outside root')
    if require_file and not result.is_file():
        raise FileNotFoundError(relative)
    return result
