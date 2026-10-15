#!/usr/bin/env python3
"""Fail-closed, deterministic product release gate. It verifies assertions/evidence files,
not their truth or independence; sign-off and system testing remain external tasks.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path
from common import resolve_beneath,digest

COMMON_CASES={
 'checkout-e2e','double-charge','ledger-balance','webhook-replay',
 'resource-authorization','state-machine','courier-acceptance-race',
 'reconciliation','restore-drill','rollback-drill','privacy-review',
 'incident-runbook','legal-review','cost-per-order'
}
ENTERPRISE_CASES={'access-review','vendor-risk','dr-tabletop','audit-trail-integrity','secret-rotation'}
GATES=('G0','G1','G2','G3','G4','G5','G6','G7','G8','G9','G10','G11')
REQUIRED_G9_PREREQUISITES={'G6','G7','G8','G11'}
CHECKS_BY_GATE={
 'G6':{'checkout-e2e','double-charge','ledger-balance','webhook-replay','state-machine','courier-acceptance-race','reconciliation'},
 'G7':{'resource-authorization','restore-drill','rollback-drill','privacy-review'},
 'G8':{'incident-runbook','cost-per-order','reconciliation'}
}
ARTIFACTS_BASE={'enterprise-readiness.md','compliance-matrix.csv','finops-budget.csv',
  'dr-plan.md','incident-response-playbook.md','security-findings.md'}
ARTIFACTS_ENTERPRISE=ARTIFACTS_BASE|{'access-review.csv','vendor-risk-register.csv'}
HEX64=re.compile(r'^[a-f0-9]{64}$')


def evaluate(doc:dict,project:Path)->dict:
    blockers=[]
    gate=doc.get('gate')
    if gate not in GATES:blockers.append('invalid gate')
    profile=doc.get('profile')
    if profile not in {'mvp','enterprise'}:blockers.append('profile must be mvp or enterprise')
    if not isinstance(doc.get('commit'),str) or not doc['commit'] or doc['commit']=='UNSET':blockers.append('missing product commit')
    try:
        p0=doc['p0_open'];p1=doc['p1_open']
        if type(p0)!=int or type(p1)!=int or p0<0 or p1<0:raise ValueError()
        if p0 or p1:blockers.append('P0/P1 findings unresolved')
    except (KeyError,ValueError,TypeError):blockers.append('missing/invalid P0-P1 counts')
    if gate in {'G6','G7','G8','G9','G11'}:
        checks=doc.get('critical_cases',[])
        if not isinstance(checks,list):checks=[]
        ids=[x.get('id') for x in checks if isinstance(x,dict)]
        if len(ids)!=len(set(ids)):blockers.append('duplicate critical case IDs')
        required=(CHECKS_BY_GATE.get(gate,COMMON_CASES | (ENTERPRISE_CASES if profile=='enterprise' else set())))
        for missing in sorted(required-set(ids)):blockers.append('missing critical case: '+missing)
        for row in checks:
            if not isinstance(row,dict):blockers.append('malformed critical case');continue
            ident=row.get('id','?')
            if row.get('status')!='PASS':blockers.append(f'{ident}: not PASS')
            if row.get('source') not in {'automated-test','signed-human-review','manual-observation'}:
                blockers.append(f'{ident}: evidence source not traceable')
            if not row.get('executed_by') or row.get('executed_by')=='NOT_INVOKED':
                blockers.append(f'{ident}: no executor identity')
            if not row.get('test_command') and row.get('source')=='automated-test':blockers.append(f'{ident}: no tested command')
            path=row.get('evidence_path')
            want=row.get('sha256','')
            if not isinstance(want,str) or not HEX64.fullmatch(want):
                blockers.append(f'{ident}: missing SHA-256');continue
            try:
                fp=resolve_beneath(project,path)
                if digest(fp)!=want:blockers.append(f'{ident}: hash mismatch')
            except (ValueError,FileNotFoundError,OSError):blockers.append(f'{ident}: missing/unsafe evidence')
        if gate=='G9':
            prior=doc.get('prerequisite_gates',[])
            if not isinstance(prior,list):prior=[]
            prior_ids=[x.get('gate') for x in prior if isinstance(x,dict)]
            if len(prior_ids)!=len(set(prior_ids)):blockers.append('duplicate prerequisite gates')
            for missing in sorted(REQUIRED_G9_PREREQUISITES-set(prior_ids)):blockers.append('missing prerequisite: '+missing)
            for pr in prior:
                if not isinstance(pr,dict):blockers.append('invalid prior');continue
                if pr.get('status')!='PASS':blockers.append(f"prerequisite {pr.get('gate')} not PASS")
                try:
                    evidence=resolve_beneath(project,pr.get('report_path'))
                    if digest(evidence)!=pr.get('sha256'):blockers.append(f"prerequisite {pr.get('gate')} hash mismatch")
                    try:
                        previous=json.loads(evidence.read_text(encoding='utf8'))
                        if previous.get('gate')!=pr.get('gate') or previous.get('profile')!=profile or previous.get('commit')!=doc.get('commit'):
                            blockers.append(f"prerequisite {pr.get('gate')} profile/commit/gate mismatch")
                        prior_result=evaluate(previous,project)
                        if prior_result['status']!='PASS':
                            blockers.append(f"prerequisite {pr.get('gate')} content is not PASS")
                    except (UnicodeError,ValueError):blockers.append(f"prerequisite {pr.get('gate')} content not valid JSON")
                except (ValueError,FileNotFoundError,OSError):blockers.append(f"prerequisite {pr.get('gate')} missing evidence")
        artifact_names=(ARTIFACTS_ENTERPRISE if profile=='enterprise' else ARTIFACTS_BASE) if gate in {'G9','G11'} else set()
        art=doc.get('artifacts',[])
        if not isinstance(art,list):art=[]
        known={Path(x).name:x for x in art if isinstance(x,str)}
        for name in sorted(artifact_names):
            if name not in known:blockers.append('missing required artifact: '+name)
            else:
                try:resolve_beneath(project,known[name])
                except (ValueError,FileNotFoundError,OSError):blockers.append('missing/unsafe artifact: '+known[name])
        if gate in {'G9','G11'}:
            approval=doc.get('human_approval',{})
            if not isinstance(approval,dict) or approval.get('approved') is not True or not all(approval.get(k) for k in ('approver','timestamp','scope')):
                blockers.append('missing explicit human approval with approver/time/scope')
    return {'gate':gate,'profile':profile,'status':'BLOCKED' if blockers else 'PASS',
        'blocking_reasons':sorted(set(blockers)),
        'notice':'File and assertion checks only: this does not prove real independent execution or certification.'}


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--report',required=True,type=Path)
    p.add_argument('--project-root',required=True,type=Path)
    p.add_argument('--out',type=Path)
    args=p.parse_args()
    try:
        result=evaluate(json.loads(args.report.read_text(encoding='utf8')),args.project_root.resolve())
    except (OSError,ValueError,json.JSONDecodeError) as ex:
        result={'status':'BLOCKED','blocking_reasons':['invalid report: '+str(ex)]}
    content=json.dumps(result,indent=2,ensure_ascii=False)+'\n'
    if args.out:
        args.out.parent.mkdir(parents=True,exist_ok=True)
        args.out.write_text(content,encoding='utf8')
    print(content,end='')
    return 0 if result['status']=='PASS' else 2
if __name__=='__main__':sys.exit(main())
