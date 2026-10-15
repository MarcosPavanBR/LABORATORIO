#!/usr/bin/env python3
"""Structural pack validation. Does not assert product readiness or execute LLMs."""
from __future__ import annotations
import argparse
import csv
import json
import re
import sys
from pathlib import Path
from common import NAME_RE, frontmatter, resolve_beneath

REQUIRED_SCRIPTS=['validate_pack.py','inventory_agents.py','install_claude_agents.py','gate_check.py','eval_runner.py','package_release.py','build_manifest.py','common.py']
REQS=['references','agents','templates','workflows','evals','scripts','examples']


def validate(root: Path) -> list[str]:
    errs=[]
    root=root.resolve()
    for item in ('SKILL.md','README.md','sources.md',*REQS):
        if not (root/item).exists(): errs.append('missing '+item)
    if errs: return errs
    try:
        text=(root/'SKILL.md').read_text(encoding='utf-8')
        hdr=frontmatter(text)
        if hdr['name'] != root.name: errs.append('frontmatter name must match root folder')
        if not NAME_RE.fullmatch(hdr['name']) or len(hdr['name'])>64: errs.append('invalid skill name')
        if not hdr.get('description'): errs.append('empty description')
        if len(text.splitlines())>500: errs.append('SKILL.md exceeds 500 lines; move content into references')
        # Check only explicitly linked local file paths in Markdown code spans.
        for candidate in re.findall(r'`((?:references|scripts|templates|workflows|evals|agents)/[A-Za-z0-9_./*-]+)`', text):
            if '*' in candidate: continue
            try: resolve_beneath(root,candidate)
            except (ValueError,FileNotFoundError): errs.append('broken SKILL.md link: '+candidate)
    except (ValueError,UnicodeError) as e: errs.append('SKILL.md: '+str(e))
    for n in REQUIRED_SCRIPTS:
        if not (root/'scripts'/n).is_file(): errs.append('missing scripts/'+n)
    for p in root.rglob('*'):
        if p.is_symlink(): errs.append('unexpected symlink: '+str(p.relative_to(root)))
    try:
        registry=json.loads((root/'agents/registry.json').read_text(encoding='utf8'))
        roles=registry['roles']
        if registry.get('count') != len(roles) or len(roles)!=48: errs.append('registry count mismatch (expected 48)')
        role_names=[r['name'] for r in roles]
        if len(set(role_names)) != len(role_names): errs.append('duplicate agent names')
        names=[p.stem for p in (root/'agents').glob('*.md')]
        if set(names)!=set(role_names): errs.append('registry <> agents filenames mismatch')
        for name in names:
            p=root/'agents'/f'{name}.md'
            h=frontmatter(p.read_text(encoding='utf8'))
            if h['name']!=name: errs.append('agent name mismatch: '+name)
            if not NAME_RE.fullmatch(name): errs.append('invalid agent name: '+name)
    except Exception as e: errs.append('agent registry/definitions invalid: '+str(e))
    for folder in ('templates','evals'):
        for p in (root/folder).glob('*.json'):
            try: json.loads(p.read_text(encoding='utf8'))
            except Exception as e: errs.append(f'json error {p.name}: {e}')
    for p in (root/'templates').glob('*.csv'):
        try:
            with p.open(encoding='utf-8-sig',newline='') as f:
                head=next(csv.reader(f),None)
                if not head or len(head)<2: errs.append('CSV missing header: '+p.name)
        except Exception as e: errs.append('CSV: '+str(e))
    for name in ('25-gate-evidence-contract.md','26-skill-supply-chain-and-host.md'):
        if not (root/'references'/name).is_file():errs.append('missing advanced reference '+name)
    try:
        scenarios=json.loads((root/'evals/scenarios.json').read_text())
        ids=[s['id'] for s in scenarios]
        if len(ids)<30 or len(set(ids))!=len(ids):errs.append('eval catalog: fewer than 30 unique cases')
        for s in scenarios:
            if not all(s.get(k) for k in ('id','prompt','required_signals','review_focus','risk')):
                errs.append('missing fields in eval '+s.get('id','?'))
    except Exception as e:errs.append('eval catalog invalid: '+str(e))
    return sorted(set(errs))


def main():
    a=argparse.ArgumentParser()
    a.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
    args=a.parse_args()
    errors=validate(args.root)
    if errors:
        print(json.dumps({'status':'FAIL','issues':errors},ensure_ascii=False,indent=2))
        return 1
    print(json.dumps({'status':'PASS','scope':'pack structure ONLY','agents':48,'eval_min':30,'root':str(args.root.resolve())},ensure_ascii=False,indent=2))
    return 0
if __name__=='__main__':sys.exit(main())
