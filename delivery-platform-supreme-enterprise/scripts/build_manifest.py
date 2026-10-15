#!/usr/bin/env python3
"""Integrity report of distributable files, excluding manifest itself and build artifacts."""
from __future__ import annotations
import json
import sys
import argparse
from pathlib import Path
from common import digest

SKIP={'integrity-manifest.json','__pycache__','.DS_Store'}

def manifest(root:Path)->dict:
    root=root.resolve()
    files=[]
    for p in sorted(root.rglob('*')):
        if not p.is_file() or any(s in SKIP or s.endswith('.pyc') for s in p.relative_to(root).parts):continue
        if p.is_symlink():raise ValueError('symlink not allowed in release')
        files.append({'path':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':digest(p)})
    return {'schema_version':'1.0','algorithm':'sha256','files':files,
            'note':'integrity verification only, not a cryptographic signature or product security claim'}

def verify(root:Path,doc:dict)->list[str]:
    actual=manifest(root)
    listed={x['path']:x['sha256'] for x in doc['files']}
    now={x['path']:x['sha256'] for x in actual['files']}
    return [f'{k}: changed/missing/extra' for k in sorted(set(listed)|set(now)) if listed.get(k)!=now.get(k)]

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);ap.add_argument('--verify',action='store_true');a=ap.parse_args()
    p=a.root/'integrity-manifest.json'
    if a.verify:
        if not p.exists():raise SystemExit('missing manifest')
        errors=verify(a.root,json.loads(p.read_text()))
        print(json.dumps({'status':'FAIL' if errors else 'PASS','changes':errors},indent=2));return int(bool(errors))
    p.write_text(json.dumps(manifest(a.root),indent=2,ensure_ascii=False)+'\n',encoding='utf8')
    print(f'Generated {p}')
    return 0
if __name__=='__main__':sys.exit(main())
