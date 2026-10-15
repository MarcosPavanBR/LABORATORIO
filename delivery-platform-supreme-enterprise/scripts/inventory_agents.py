#!/usr/bin/env python3
"""Detect *definitions* without pretending an agent was started."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from common import frontmatter, NAME_RE


def inventory(root: Path, *, include_user=False, host_caps:dict|None=None, extra_agent_dirs:list[Path]|None=None) -> dict:
    root=root.resolve()
    found=[]
    agent_dirs=[root/'.claude/agents'] + list(extra_agent_dirs or [])
    if include_user:agent_dirs.append(Path.home()/'.claude/agents')
    for folder in agent_dirs:
        if not folder.is_dir():continue
        for f in sorted(folder.glob('*.md')):
            try:
                header=frontmatter(f.read_text(encoding='utf-8'))
                name=header['name']
                if name!=f.stem or not NAME_RE.fullmatch(name):continue
                found.append({'name':name,'path':str(f.resolve()),'type':'custom-agent-definition',
                              'definition_found':True,'runtime_available':False,'invoked':False})
            except (UnicodeError,ValueError,OSError):pass
    skills=[]
    for folder in [root/'.agents/skills',root/'.claude/skills']:
        if folder.is_dir():
            for path in sorted(folder.glob('*/SKILL.md')):
                try:
                    h=frontmatter(path.read_text(encoding='utf8'))
                    if h['name']==path.parent.name:
                        skills.append({'name':h['name'],'path':str(path),'type':'skill-definition'})
                except (UnicodeError,ValueError,OSError):pass
    reported=[]
    if host_caps:
        if not isinstance(host_caps,dict) or not isinstance(host_caps.get('executors'),list):
            raise ValueError('expected {"executors":[{"name":"...","available":true,"source":"runtime API"}]}')
        for item in host_caps['executors']:
            if not isinstance(item,dict) or not isinstance(item.get('name'),str):raise ValueError('invalid executor entry')
            reported.append({'name':item['name'],'runtime_available':item.get('available') is True,
                             'source':str(item.get('source','external declaration')),
                             'evidence':str(item.get('evidence','not independently verified')),
                             'invoked':False})
    return {'project_root':str(root),'custom_agent_definitions':found,'skill_definitions':skills,
            'host_executors_declared':reported,'note':'runtime declarations are user/host supplied; file discovery is NOT proof of execution'}

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--root',type=Path,required=True)
    ap.add_argument('--output',type=Path)
    ap.add_argument('--include-user',action='store_true')
    ap.add_argument('--host-capabilities-json',type=Path)
    ap.add_argument('--extra-agent-dir',type=Path,action='append',default=[],help='Additional local agent profile directory (e.g. plugin agents). Read-only.')
    a=ap.parse_args()
    caps=json.loads(a.host_capabilities_json.read_text()) if a.host_capabilities_json else None
    result=inventory(a.root,include_user=a.include_user,host_caps=caps,extra_agent_dirs=a.extra_agent_dir)
    text=json.dumps(result,indent=2,ensure_ascii=False)+'\n'
    if a.output:
        a.output.parent.mkdir(parents=True,exist_ok=True)
        a.output.write_text(text,encoding='utf-8')
    print(text,end='')
    return 0
if __name__=='__main__':sys.exit(main())
