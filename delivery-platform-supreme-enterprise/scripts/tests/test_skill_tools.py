"""Tests verify tooling correctness, not marketplace product behavior."""
from __future__ import annotations
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS=Path(__file__).resolve().parents[1]
ROOT=SCRIPTS.parent
sys.path.insert(0,str(SCRIPTS))
from common import digest,frontmatter,resolve_beneath
from validate_pack import validate
from inventory_agents import inventory
from install_claude_agents import install
from gate_check import evaluate,COMMON_CASES,ENTERPRISE_CASES,ARTIFACTS_ENTERPRISE,ARTIFACTS_BASE
from eval_runner import score,verify_catalogue
from build_manifest import manifest,verify
from evidence_ledger import append as ledger_append,verify as ledger_verify,GENESIS

class TestSkillValidation(unittest.TestCase):
    def test_frontmatter_skill_is_valid(self):
        h=frontmatter((ROOT/'SKILL.md').read_text())
        self.assertEqual(h['name'],ROOT.name)
    def test_full_package_structure_is_consistent(self):
        self.assertEqual(validate(ROOT),[])
    def test_reject_missing_frontmatter(self):
        with self.assertRaises(ValueError):frontmatter('Bad doc\n')
    def test_reject_path_traversal(self):
        with self.assertRaises(ValueError):resolve_beneath(ROOT,'../../etc/passwd')
        with self.assertRaises(ValueError):resolve_beneath(ROOT,'/etc/passwd')
    def test_registry_contains_48_unique_roles(self):
        r=json.loads((ROOT/'agents/registry.json').read_text())
        self.assertEqual(len(r['roles']),48)
        self.assertEqual(len({x['name'] for x in r['roles']}),48)
    def test_missing_reference_does_not_validate(self):
        with tempfile.TemporaryDirectory() as tmp:
            dest=Path(tmp)/ROOT.name
            shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('__pycache__'))
            (dest/'references/01-multiagent-governance.md').unlink()
            self.assertTrue(any('broken SKILL.md link' in e for e in validate(dest)))

class TestAgentDiscoveryAndInstall(unittest.TestCase):
    def test_no_fake_runtime_agent_when_only_definition_exists(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);d=root/'.claude/agents';d.mkdir(parents=True)
            (d/'foo.md').write_text('---\nname: foo\ndescription: sample\n---\n# foo')
            r=inventory(root)
            self.assertEqual(len(r['custom_agent_definitions']),1)
            self.assertFalse(r['custom_agent_definitions'][0]['runtime_available'])
            self.assertFalse(r['custom_agent_definitions'][0]['invoked'])
    def test_plugin_extra_agent_directory(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            plugin=root/'plugin/agents';plugin.mkdir(parents=True)
            (plugin/'expert.md').write_text('---\nname: expert\ndescription: sample\n---\n# expert')
            report=inventory(root,extra_agent_dirs=[plugin])
            self.assertEqual(report['custom_agent_definitions'][0]['name'],'expert')
            self.assertFalse(report['custom_agent_definitions'][0]['runtime_available'])
    def test_host_report_is_distinct_from_filesystem(self):
        with tempfile.TemporaryDirectory() as tmp:
            r=inventory(Path(tmp),host_caps={'executors':[{'name':'runtime-agent','available':True,'source':'trusted-test-host'}]})
            self.assertEqual(r['custom_agent_definitions'],[])
            self.assertTrue(r['host_executors_declared'][0]['runtime_available'])
            self.assertFalse(r['host_executors_declared'][0]['invoked'])
    def test_installer_dry_run_creates_no_files(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);d=install(ROOT,root)
            self.assertEqual(d['installed'],0)
            self.assertEqual(len(d['actions']),48)
            self.assertFalse((root/'.claude/agents').exists())
    def test_installer_apply_all_without_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            a=install(ROOT,root,True)
            self.assertEqual(a['installed'],48)
            agent=root/'.claude/agents/dps-orchestrator.md'
            original=agent.read_bytes()
            b=install(ROOT,root,True)
            self.assertEqual(b['installed'],0)
            self.assertEqual(b['skipped'],48)
            self.assertEqual(agent.read_bytes(),original)
    def test_installer_blocks_symlink_escape(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);outside=root/'outside';outside.mkdir()
            target=root/'target';target.mkdir();(target/'.claude').symlink_to(outside)
            with self.assertRaises(ValueError):install(ROOT,target,True)

class TestReleaseGate(unittest.TestCase):
    def test_empty_release_is_blocked(self):
        with tempfile.TemporaryDirectory() as tmp:
            r=evaluate({'gate':'G9','profile':'enterprise','commit':'UNSET','p0_open':0,'p1_open':0},Path(tmp))
            self.assertEqual(r['status'],'BLOCKED')
            self.assertTrue(any('human approval' in x for x in r['blocking_reasons']))
    def test_p0_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            r=evaluate({'gate':'G9','profile':'mvp','commit':'abc','p0_open':1,'p1_open':0},Path(tmp))
            self.assertTrue(any('P0/P1' in x for x in r['blocking_reasons']))
    def test_missing_sha_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            r=evaluate({'gate':'G11','profile':'mvp','commit':'abc','p0_open':0,'p1_open':0,
                         'critical_cases':[{'id':'checkout-e2e','status':'PASS'}]},Path(tmp))
            self.assertTrue(any('missing SHA-256' in x for x in r['blocking_reasons']))
    def build_mock(self,root:Path,gate='G11',profile='mvp'):
        # Synthetic evidence only: demonstrates the validator's mechanical behavior.
        evidence=root/'logs/test.txt';evidence.parent.mkdir(parents=True,exist_ok=True)
        evidence.write_text('Synthetic proof only, not a real test',encoding='utf8')
        names=COMMON_CASES|(ENTERPRISE_CASES if profile=='enterprise' else set())
        checks=[{'id':n,'status':'PASS','source':'automated-test','executed_by':'fixture-runner',
                 'test_command':'echo synthetic','evidence_path':'logs/test.txt','sha256':digest(evidence)} for n in names]
        artifact_names=ARTIFACTS_ENTERPRISE if profile=='enterprise' else ARTIFACTS_BASE
        artifacts=[]
        for name in artifact_names:
            path=root/'output'/name;path.parent.mkdir(exist_ok=True)
            path.write_text('synthetic fixture')
            artifacts.append('output/'+name)
        ledger=None
        if profile=='enterprise':
            lp=root/'output/evidence-ledger.jsonl'
            for c in checks:
                ledger_append(lp,{'id':c['id'],'gate':gate,'status':'PASS','commit':'0123456',
                                  'executed_by':'fixture-runner','sha256':c['sha256']})
            st=ledger_verify(lp)
            ledger={'path':'output/evidence-ledger.jsonl','entries':st['entries'],'head':st['head']}
        prior=[]
        if gate=='G9':
            for name in ('G6','G7','G8','G11'):
                path=root/'output'/f'gate-{name.lower()}.json'
                sub=self.build_mock(root,name,profile)
                path.write_text(json.dumps(sub))
                prior.append({'gate':name,'status':'PASS','report_path':str(path.relative_to(root)),'sha256':digest(path)})
        report={'gate':gate,'profile':profile,'commit':'0123456','p0_open':0,'p1_open':0,
                 'critical_cases':checks,'prerequisite_gates':prior,'artifacts':artifacts,
                 'human_approval':{'approved':True,'approver':'fixture-reviewer','timestamp':'2026-10-15T01:00Z',
                                   'scope':'test-fixture-only'}}
        if ledger:report['ledger']=ledger
        return report
    def test_valid_fixture_mechanically_passes_g11_not_product_cert(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);report=self.build_mock(p)
            self.assertEqual(evaluate(report,p)['status'],'PASS')
    def test_valid_fixture_mechanically_passes_g9_not_product_cert(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);report=self.build_mock(p,'G9','enterprise')
            self.assertEqual(evaluate(report,p)['status'],'PASS')
    def test_tampered_evidence_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);report=self.build_mock(p,'G11')
            (p/'logs/test.txt').write_text('tampered')
            self.assertEqual(evaluate(report,p)['status'],'BLOCKED')
    def test_declared_gate_pass_with_failing_content_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);report=self.build_mock(p,'G9')
            path=p/'output/gate-g6.json';path.write_text('{"gate":"G6","status":"FAIL","commit":"0123456","profile":"mvp"}')
            for g in report['prerequisite_gates']:
                if g['gate']=='G6':g['sha256']=digest(path)
            r=evaluate(report,p)
            self.assertTrue(any('content is not PASS' in x for x in r['blocking_reasons']))

class TestEvidenceLedger(unittest.TestCase):
    REC={'id':'checkout-e2e','gate':'G6','status':'PASS','commit':'abc1234',
         'executed_by':'ci-runner','sha256':'a'*64}
    def make(self,tmp,n=3):
        lp=Path(tmp)/'ledger.jsonl'
        for i in range(n):ledger_append(lp,dict(self.REC,id=f'case-{i}'))
        return lp
    def test_empty_ledger_is_genesis(self):
        with tempfile.TemporaryDirectory() as tmp:
            lp=Path(tmp)/'l.jsonl';lp.write_bytes(b'')
            r=ledger_verify(lp)
            self.assertTrue(r['ok']);self.assertEqual(r['head'],GENESIS);self.assertEqual(r['entries'],0)
    def test_chain_links_and_head_changes(self):
        with tempfile.TemporaryDirectory() as tmp:
            lp=self.make(tmp);r=ledger_verify(lp)
            self.assertTrue(r['ok']);self.assertEqual(r['entries'],3);self.assertEqual(len(set(r['chain'])),3)
            before=r['head'];ledger_append(lp,self.REC)
            self.assertNotEqual(ledger_verify(lp)['head'],before)
    def test_edit_in_the_middle_is_detected(self):
        with tempfile.TemporaryDirectory() as tmp:
            lp=self.make(tmp);lines=lp.read_text().splitlines()
            lines[1]=lines[1].replace('case-1','case-X');lp.write_text('\n'.join(lines)+'\n')
            r=ledger_verify(lp);self.assertFalse(r['ok'])
            self.assertTrue(any('entry_hash mismatch' in e for e in r['errors']))
    def test_deleting_or_reordering_is_detected(self):
        with tempfile.TemporaryDirectory() as tmp:
            lp=self.make(tmp);lines=lp.read_text().splitlines()
            lp.write_text('\n'.join([lines[0],lines[2]])+'\n')
            self.assertFalse(ledger_verify(lp)['ok'])
            lp.write_text('\n'.join([lines[1],lines[0],lines[2]])+'\n')
            self.assertFalse(ledger_verify(lp)['ok'])
    def test_rewritten_entry_with_fixed_hash_still_breaks_next_link(self):
        import evidence_ledger as el
        with tempfile.TemporaryDirectory() as tmp:
            lp=self.make(tmp);rows=[json.loads(x) for x in lp.read_text().splitlines()]
            rows[0]['record']['status']='FAIL';rows[0]['entry_hash']=el.entry_hash(rows[0])
            lp.write_text('\n'.join(json.dumps(x) for x in rows)+'\n')
            self.assertTrue(any('prev_hash' in e for e in ledger_verify(lp)['errors']))
    def test_missing_trailing_newline_and_duplicate_keys_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            lp=self.make(tmp,1);lp.write_bytes(lp.read_bytes().rstrip(b'\n'))
            self.assertFalse(ledger_verify(lp)['ok'])
            lp.write_text('{"seq":1,"seq":1}\n');self.assertFalse(ledger_verify(lp)['ok'])
    def test_append_rejects_bad_records_and_invalid_ledger(self):
        with tempfile.TemporaryDirectory() as tmp:
            lp=Path(tmp)/'l.jsonl'
            for bad in (dict(self.REC,sha256='nothex'),dict(self.REC,status='MAYBE'),
                        dict(self.REC,commit='UNSET'),dict(self.REC,executed_by='NOT_INVOKED'),{}):
                with self.assertRaises(ValueError):ledger_append(lp,bad)
            self.assertFalse(lp.exists() and lp.stat().st_size>0)
            ledger_append(lp,self.REC);lp.write_text(lp.read_text().replace('ci-runner','someone'))
            with self.assertRaises(ValueError):ledger_append(lp,self.REC)
    def test_enterprise_gate_requires_ledger(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);report=self.build(p)
            del report['ledger']
            self.assertTrue(any('missing evidence ledger' in x for x in evaluate(report,p)['blocking_reasons']))
    build_mock=TestReleaseGate.build_mock
    def build(self,p,gate='G11'):
        return self.build_mock(p,gate,'enterprise')
    def test_valid_ledger_passes_even_after_it_grows(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);report=self.build(p)
            ledger_append(p/'output/evidence-ledger.jsonl',self.REC)
            self.assertEqual(evaluate(report,p)['status'],'PASS')
    def test_tail_truncation_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);report=self.build(p)
            lp=p/'output/evidence-ledger.jsonl';lines=lp.read_text().splitlines()
            lp.write_text('\n'.join(lines[:-2])+'\n')
            self.assertTrue(any('truncation' in x for x in evaluate(report,p)['blocking_reasons']))
    def test_history_rewrite_blocks(self):
        import evidence_ledger as el
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);report=self.build(p)
            lp=p/'output/evidence-ledger.jsonl';rows=[json.loads(x) for x in lp.read_text().splitlines()]
            prev=GENESIS
            for r in rows:   # attacker rebuilds a self-consistent chain
                r['record']['executed_by']='attacker';r['prev_hash']=prev;r['entry_hash']=el.entry_hash(r);prev=r['entry_hash']
            lp.write_text('\n'.join(json.dumps(x) for x in rows)+'\n')
            self.assertTrue(any('differs from pinned head' in x for x in evaluate(report,p)['blocking_reasons']))
    def test_case_not_anchored_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);report=self.build(p)
            report['critical_cases'][0]['sha256']='b'*64
            reasons=evaluate(report,p)['blocking_reasons']
            self.assertTrue(any('not anchored in evidence ledger' in x for x in reasons))
    def test_g9_enterprise_still_passes_with_ledgers(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);self.assertEqual(evaluate(self.build(p,'G9'),p)['status'],'PASS')
    def test_mvp_without_ledger_is_unchanged(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);report=self.build_mock(p,'G11','mvp')
            self.assertNotIn('ledger',report);self.assertEqual(evaluate(report,p)['status'],'PASS')

class TestEvalsAndIntegrity(unittest.TestCase):
    def test_eval_catalogue_is_well_formed(self):
        cases=json.loads((ROOT/'evals/scenarios.json').read_text())
        self.assertGreaterEqual(len(cases),30)
        self.assertEqual(verify_catalogue(cases),[])
    def test_eval_runner_does_not_make_fake_passes(self):
        cases=json.loads((ROOT/'evals/scenarios.json').read_text())
        r=score(cases,{})
        self.assertEqual(r['not_run'],len(cases))
        self.assertEqual(r['requires_manual_review'],0)
    def test_heuristic_does_not_certify_good_response(self):
        cases=json.loads((ROOT/'evals/scenarios.json').read_text())
        case=cases[0]
        sample=' '.join(case['required_signals'])
        r=score([case],{case['id']:{'response':sample,'evidence_paths':[]}})
        self.assertEqual(r['results'][0]['status'],'NEEDS_HUMAN_REVIEW')
    def test_manifest_detects_changed_files(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);(p/'readme.txt').write_text('before')
            baseline=manifest(p)
            self.assertEqual(verify(p,baseline),[])
            (p/'readme.txt').write_text('after')
            self.assertTrue(verify(p,baseline))

if __name__=='__main__':unittest.main()
