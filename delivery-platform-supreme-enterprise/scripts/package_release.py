#!/usr/bin/env python3
"""Reproducible ZIP + TXT, no network. Excludes caches and hidden runner outputs."""
from __future__ import annotations
import argparse
import subprocess
import sys
import zipfile
from pathlib import Path
from validate_pack import validate
from build_manifest import manifest,verify
import json

EXCLUDED={'__pycache__','.pytest_cache','.DS_Store'}

def eligible(root:Path):
    for p in sorted(root.rglob('*')):
        if not p.is_file():continue
        if any(part in EXCLUDED or part.endswith('.pyc') for part in p.relative_to(root).parts):continue
        if p.is_symlink():raise ValueError('symlink rejected: '+str(p))
        yield p

def package(root:Path,out:Path)->dict:
    root=root.resolve();out=out.resolve();out.mkdir(parents=True,exist_ok=True)
    errors=validate(root)
    if errors:raise ValueError('validation errors: '+str(errors))
    result=subprocess.run([sys.executable,'-m','unittest','discover','-s',str(root/'scripts/tests'),'-v'],capture_output=True,text=True,timeout=120)
    if result.returncode:raise ValueError('test suite failed: '+result.stdout+result.stderr)
    mpath=root/'integrity-manifest.json'
    mpath.write_text(json.dumps(manifest(root),indent=2,ensure_ascii=False)+'\n',encoding='utf8')
    if verify(root,json.loads(mpath.read_text())):raise ValueError('integrity mismatch')
    zip_path=out/(root.name+'-v2.2.0.zip')
    txt_path=out/('DELIVERY_PLATFORM_SUPREME_ENTERPRISE_v2.2_COMPLETA.txt')
    paths=list(eligible(root))
    # Preserve top-level root name and exact relative paths.
    with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for p in paths:
            info=zipfile.ZipInfo(root.name+'/'+p.relative_to(root).as_posix(),(2026,10,15,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED
            info.external_attr=(0o644<<16)
            z.writestr(info,p.read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
    with txt_path.open('w',encoding='utf8') as f:
        f.write('DELIVERY PLATFORM SUPREME ENTERPRISE v2.2 — PACOTE CONSOLIDADO\n')
        f.write('Os arquivos abaixo são trechos individuais. Para executar scripts, descompacte o ZIP.\n')
        f.write(f'Arquivos incluídos: {len(paths)}\n\n')
        for p in paths:
            rel=p.relative_to(root).as_posix()
            f.write('\n'+'='*96+'\nARQUIVO: '+rel+'\n'+'='*96+'\n')
            f.write(p.read_text(encoding='utf8'))
            f.write('\n')
    with zipfile.ZipFile(zip_path) as z:
        if z.testzip():raise ValueError('bad ZIP CRC')
        if len(z.namelist())!=len(paths):raise ValueError('wrong ZIP file count')
    return {'zip':str(zip_path),'txt':str(txt_path),'files':len(paths),'tests':'PASS','structural_validation':'PASS'}

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);ap.add_argument('--outdir',type=Path,required=True);a=ap.parse_args()
    try:r=package(a.root,a.outdir)
    except (ValueError,OSError,subprocess.TimeoutExpired) as e:print(str(e),file=sys.stderr);return 2
    print(json.dumps(r,indent=2,ensure_ascii=False));return 0
if __name__=='__main__':sys.exit(main())
