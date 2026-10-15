#!/usr/bin/env python3
"""Scenario catalogue validator and *heuristic* response scorer (not a true LLM benchmark)."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path


def verify_catalogue(cases:list[dict])->list[str]:
    issues=[];seen=set()
    if len(cases)<30:issues.append('need at least 30 cases')
    for case in cases:
        cid=case.get('id')
        if not cid or cid in seen:issues.append('missing/duplicate case ID')
        seen.add(cid)
        for field in ('prompt','risk','review_focus','required_signals'):
            if not case.get(field):issues.append(f'{cid}: missing {field}')
    return issues

def score(cases:list[dict],responses:dict)->dict:
    result=[]
    for case in cases:
        response=responses.get(case['id'],{})
        body=response.get('response','') if isinstance(response,dict) else ''
        lower=body.casefold()
        missing=[s for s in case['required_signals'] if s.casefold() not in lower]
        unsafe=[s for s in case.get('prohibited_signals',[]) if s.casefold() in lower]
        supported=bool(response.get('evidence_paths')) if isinstance(response,dict) else False
        status='NOT_RUN' if not body else 'FAIL_HEURISTIC' if missing or unsafe else 'NEEDS_HUMAN_REVIEW'
        result.append({'case_id':case['id'],'status':status,'missing_signals':missing,
                       'prohibited_signals_found':unsafe,'evidence_paths_supplied':supported,
                       'note':'String matching is weak; human review + executed product tests required.'})
    return {'type':'heuristic-only','cases_total':len(result),
        'not_run':sum(x['status']=='NOT_RUN' for x in result),
        'requires_manual_review':sum(x['status']=='NEEDS_HUMAN_REVIEW' for x in result),
        'failed_heuristic':sum(x['status']=='FAIL_HEURISTIC' for x in result),
        'results':result}

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--catalogue',type=Path,default=Path(__file__).resolve().parents[1]/'evals/scenarios.json')
    p.add_argument('--responses-json',type=Path)
    p.add_argument('--output',type=Path)
    a=p.parse_args()
    cases=json.loads(a.catalogue.read_text(encoding='utf8'))
    errors=verify_catalogue(cases)
    if errors:print(json.dumps({'status':'INVALID_CATALOGUE','errors':errors},indent=2));return 2
    if not a.responses_json:
        print(json.dumps({'status':'CATALOGUE_VALID','cases':len(cases),'executed':False},indent=2));return 0
    result=score(cases,json.loads(a.responses_json.read_text(encoding='utf8')))
    payload=json.dumps(result,indent=2,ensure_ascii=False)+'\n'
    if a.output:
        a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(payload,encoding='utf8')
    print(payload,end='');return 0 if not result['failed_heuristic'] and not result['not_run'] else 2
if __name__=='__main__':sys.exit(main())
