#!/usr/bin/env python3
"""Opt-in, no-overwrite Claude Code custom agent definition installer."""
from __future__ import annotations
import argparse
import json
import os
import sys
from pathlib import Path
from common import frontmatter, NAME_RE


def plan(source:Path,target:Path)->list[dict]:
    source=source.resolve(); target=target.resolve()
    reg=json.loads((source/'agents/registry.json').read_text(encoding='utf8'))
    result=[]
    directory=target/'.claude/agents'
    if (target/'.claude').is_symlink() or directory.is_symlink():
        raise ValueError('destination directory or its parent is a symlink')
    for role in reg['roles']:
        n=role['name']
        if not NAME_RE.fullmatch(n):raise ValueError('unsafe agent name: '+n)
        src=source/'agents'/f'{n}.md'
        if src.is_symlink() or not src.is_file():raise ValueError('missing/symlinked source agent: '+n)
        if frontmatter(src.read_text(encoding='utf8'))['name']!=n:raise ValueError('agent name mismatch: '+n)
        dst=directory/f'{n}.md'
        result.append({'agent':n,'source':str(src),'target':str(dst),'action':'SKIP_EXISTS' if dst.exists() or dst.is_symlink() else 'INSTALL'})
    return result


def install(root:Path,target:Path,apply:bool=False)->dict:
    target=target.resolve()
    if not target.is_dir():raise ValueError('target project directory does not exist')
    actions=plan(root,target)
    if apply:
        folder=target/'.claude/agents'
        folder.mkdir(parents=True,exist_ok=True)
        if folder.is_symlink():raise ValueError('agent directory symlink is prohibited')
        for i in actions:
            if i['action']!='INSTALL':continue
            dst=Path(i['target'])
            src=Path(i['source'])
            # O_EXCL prevents overwriting in races. No shell invocation.
            try:
                fd=os.open(dst,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o644)
            except FileExistsError:
                i['action']='SKIP_EXISTS';continue
            try:
                with os.fdopen(fd,'wb') as out: out.write(src.read_bytes())
                i['action']='INSTALLED'
            except BaseException:
                dst.unlink(missing_ok=True)
                raise
    return {'mode':'APPLY' if apply else 'DRY_RUN','actions':actions,
            'installed':sum(x['action']=='INSTALLED' for x in actions),
            'skipped':sum(x['action']=='SKIP_EXISTS' for x in actions)}

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--target',required=True,type=Path)
    p.add_argument('--source',type=Path,default=Path(__file__).resolve().parents[1])
    p.add_argument('--apply',action='store_true')
    a=p.parse_args()
    try:r=install(a.source,a.target,a.apply)
    except (OSError,ValueError,KeyError) as e:
        print('ERROR:',e,file=sys.stderr);return 2
    print(json.dumps(r,ensure_ascii=False,indent=2))
    return 0
if __name__=='__main__':sys.exit(main())
