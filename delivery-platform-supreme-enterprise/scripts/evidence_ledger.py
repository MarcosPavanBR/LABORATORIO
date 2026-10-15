#!/usr/bin/env python3
"""Append-only evidence ledger with chained SHA-256 hashes (JSONL, stdlib only).

Each line is one entry:
    {"seq": N, "timestamp": ..., "prev_hash": <hash of entry N-1 or 64 zeros>,
     "record": {...evidence...}, "entry_hash": sha256(canonical JSON of the other fields)}

What this gives you: TAMPER-EVIDENCE. Editing, deleting or reordering an entry
breaks every later hash. Removing entries from the END is only detected when a
gate report pins `entries` and `head` (see gate_check.py).

What it does NOT give you: authorship or non-repudiation. Whoever can write both
the ledger and the report can rebuild the whole chain. For real non-repudiation,
anchor `head` outside the project (signed git tag/commit, trusted CI artifact,
external timestamp) or sign it with an asymmetric key. See references/25.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

try:  # POSIX advisory lock; on other platforms the ledger is single-writer.
    import fcntl
except ImportError:  # pragma: no cover
    fcntl = None

GENESIS = '0' * 64
HEX64 = re.compile(r'^[a-f0-9]{64}$')
ENTRY_KEYS = {'seq', 'timestamp', 'prev_hash', 'record', 'entry_hash'}
REQUIRED_RECORD = ('id', 'gate', 'status', 'commit', 'executed_by', 'sha256')
STATUSES = {'PASS', 'FAIL', 'WARN', 'NOT_RUN'}


def canonical(obj) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode('utf-8')


def entry_hash(entry: dict) -> str:
    body = {k: v for k, v in entry.items() if k != 'entry_hash'}
    return hashlib.sha256(canonical(body)).hexdigest()


def _no_duplicate_keys(pairs):
    out = {}
    for key, value in pairs:
        if key in out:
            raise ValueError('duplicate JSON key: ' + key)
        out[key] = value
    return out


def validate_record(record) -> list[str]:
    if not isinstance(record, dict):
        return ['record must be a JSON object']
    errors = []
    for key in REQUIRED_RECORD:
        if not isinstance(record.get(key), str) or not record[key]:
            errors.append(f'record.{key} missing or not a non-empty string')
    if record.get('status') not in STATUSES:
        errors.append('record.status must be one of ' + ', '.join(sorted(STATUSES)))
    if isinstance(record.get('sha256'), str) and not HEX64.fullmatch(record['sha256']):
        errors.append('record.sha256 must be 64 lowercase hex characters')
    if record.get('commit') in {'UNSET', 'NOT_INVOKED'} or record.get('executed_by') == 'NOT_INVOKED':
        errors.append('record has placeholder commit/executor')
    return errors


def verify(path: Path) -> dict:
    """Return {ok, entries, head, chain, records, errors}. Missing file = invalid."""
    result = {'ok': False, 'entries': 0, 'head': GENESIS, 'chain': [], 'records': [], 'errors': []}
    try:
        raw = Path(path).read_bytes()
    except OSError as ex:
        result['errors'].append(f'cannot read ledger: {ex}')
        return result
    if raw and not raw.endswith(b'\n'):
        result['errors'].append('incomplete final line (missing newline)')
    errors = result['errors']
    prev = GENESIS
    lines = raw.split(b'\n')
    if lines and lines[-1] == b'':
        lines.pop()
    for index, line in enumerate(lines):
        where = f'line {index + 1}'
        try:
            entry = json.loads(line.decode('utf-8'), object_pairs_hook=_no_duplicate_keys)
        except (UnicodeError, ValueError) as ex:
            errors.append(f'{where}: invalid JSON ({ex})')
            break
        if not isinstance(entry, dict) or set(entry) != ENTRY_KEYS:
            errors.append(f'{where}: unexpected entry structure')
            break
        if entry['seq'] != index + 1 or type(entry['seq']) is not int:
            errors.append(f'{where}: seq out of order (expected {index + 1})')
        if entry['prev_hash'] != prev:
            errors.append(f'{where}: prev_hash does not match previous entry')
        if not isinstance(entry['entry_hash'], str) or entry_hash(entry) != entry['entry_hash']:
            errors.append(f'{where}: entry_hash mismatch (content altered)')
        try:
            datetime.fromisoformat(str(entry['timestamp']))
        except ValueError:
            errors.append(f'{where}: invalid timestamp')
        for problem in validate_record(entry['record']):
            errors.append(f'{where}: {problem}')
        prev = entry['entry_hash'] if isinstance(entry['entry_hash'], str) else prev
        result['chain'].append(entry['entry_hash'])
        result['records'].append(entry['record'])
        if errors:
            break
    result['entries'] = len(result['chain'])
    result['head'] = result['chain'][-1] if result['chain'] else GENESIS
    result['ok'] = not errors
    return result


def append(path: Path, record: dict, now: datetime | None = None) -> dict:
    """Append one record. Fail-closed: refuses to extend an invalid ledger."""
    problems = validate_record(record)
    if problems:
        raise ValueError('; '.join(problems))
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'ab+') as handle:
        if fcntl:
            fcntl.flock(handle, fcntl.LOCK_EX)
        state = verify(path)
        if not state['ok']:
            raise ValueError('ledger invalid, refusing to append: ' + '; '.join(state['errors'][:3]))
        stamp = (now or datetime.now(timezone.utc)).isoformat(timespec='seconds')
        entry = {'seq': state['entries'] + 1, 'timestamp': stamp,
                 'prev_hash': state['head'], 'record': record}
        entry['entry_hash'] = entry_hash(entry)
        handle.seek(0, 2)
        handle.write(canonical(entry) + b'\n')
        handle.flush()
        try:
            os.fsync(handle.fileno())
        except OSError:  # pragma: no cover
            pass
    return {'seq': entry['seq'], 'entry_hash': entry['entry_hash']}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest='cmd', required=True)
    add = sub.add_parser('append', help='append an evidence record (JSON file or - for stdin)')
    add.add_argument('--ledger', required=True, type=Path)
    add.add_argument('--record', required=True)
    chk = sub.add_parser('verify', help='verify the whole chain')
    chk.add_argument('--ledger', required=True, type=Path)
    chk.add_argument('--expect-head')
    chk.add_argument('--expect-entries', type=int)
    hd = sub.add_parser('head', help='print entries and head hash to pin in a gate report')
    hd.add_argument('--ledger', required=True, type=Path)
    args = parser.parse_args()
    try:
        if args.cmd == 'append':
            text = sys.stdin.read() if args.record == '-' else Path(args.record).read_text(encoding='utf-8')
            print(json.dumps(append(args.ledger, json.loads(text)), indent=2))
            return 0
        state = verify(args.ledger)
        if args.cmd == 'head':
            print(json.dumps({'entries': state['entries'], 'head': state['head']}, indent=2))
            return 0 if state['ok'] else 2
        errors = list(state['errors'])
        if args.expect_entries is not None and state['entries'] < args.expect_entries:
            errors.append('ledger shorter than pinned entries (truncation?)')
        if args.expect_head and args.expect_entries:
            if state['entries'] >= args.expect_entries and state['chain'][args.expect_entries - 1] != args.expect_head:
                errors.append('pinned head does not match ledger history')
        elif args.expect_head and state['head'] != args.expect_head:
            errors.append('head does not match expected head')
        print(json.dumps({'status': 'PASS' if not errors else 'BLOCKED', 'entries': state['entries'],
                          'head': state['head'], 'errors': errors}, indent=2, ensure_ascii=False))
        return 0 if not errors else 2
    except (OSError, ValueError) as ex:
        print(json.dumps({'status': 'BLOCKED', 'errors': [str(ex)]}, indent=2, ensure_ascii=False))
        return 2


if __name__ == '__main__':
    sys.exit(main())
