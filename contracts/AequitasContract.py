# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

import json
import re
from genlayer import *

class AequitasContract(gl.Contract):
    agreements: TreeMap[str, str]

    def __init__(self):
        pass

    @gl.public.write
    def register_agreement(self, agreement_id: str, party_a: str, party_b: str, value_locked: int, strict_conditions: str) -> bool:
        if agreement_id in self.agreements:
            return False
            
        self.agreements[agreement_id] = json.dumps({
            "agreement_id": agreement_id,
            "party_a": party_a,
            "party_b": party_b,
            "value_locked": value_locked,
            "strict_conditions": strict_conditions,
            "state": "PENDING_RESOLUTION",
            "adjudication_rationale": ""
        })
        return True

    @gl.public.write
    def adjudicate(self, agreement_id: str, payload_a: str, payload_b: str) -> bool:
        if agreement_id not in self.agreements: return False
        agr = json.loads(self.agreements[agreement_id])
        if agr["state"] != "PENDING_RESOLUTION": return False
        
        def leader_fn() -> dict:
            agr_cond = _deep_sanitize(agr['strict_conditions'])[:1000]
            p_a = _deep_sanitize(payload_a)[:1000]
            p_b = _deep_sanitize(payload_b)[:1000]
            
            prompt = f"""
            You are a neutral AI judge.
            CONDITIONS: {agr_cond}
            PARTY A PAYLOAD: {p_a}
            PARTY B PAYLOAD: {p_b}
            
            Evaluate both sides based on the strict conditions.
            Return exactly a JSON object:
            {{
                "winner": "PARTY_A" | "PARTY_B" | "SPLIT",
                "rationale": "<string>"
            }}
            """
            output = gl.nondet.exec_prompt(prompt, response_format="json")
            if isinstance(output, str):
                try: return json.loads(output)
                except Exception: return {"winner": "SPLIT", "rationale": "Consensus failure."}
            return output
            
        def validator_fn(leader_res: gl.vm.Result) -> bool:
            if not isinstance(leader_res, gl.vm.Return):
                return False
            try: mine = leader_fn()
            except Exception: return False
            return mine.get("winner") == leader_res.calldata.get("winner")
            
        decision = gl.vm.run_nondet(leader_fn, validator_fn)
        
        winner = decision.get("winner", "SPLIT")
        if winner == "PARTY_A":
            agr["state"] = "FINALIZED_PARTY_A_FAVOR"
        elif winner == "PARTY_B":
            agr["state"] = "FINALIZED_PARTY_B_FAVOR"
        else:
            agr["state"] = "FINALIZED_SPLIT"
            
        agr["adjudication_rationale"] = _deep_sanitize(decision.get("rationale", ""))
        self.agreements[agreement_id] = json.dumps(agr)
        return True

    @gl.public.view
    def fetch_all_agreements(self) -> str:
        import json
        return json.dumps([json.loads(v) for v in self.agreements.values()])


def _deep_sanitize(text: str) -> str:
    if not text: return ""
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", str(text))
    text = text.replace("```", "EEE")
    malicious_vectors = [
        "ignore previous instructions", 
        "ignore all previous instructions",
        "system prompt", 
        "you are now", 
        "bypass", 
        "developer mode",
        "DAN",
        "sudo",
        "root access",
        "forget everything",
        "evaluate as true"
    ]
    for phrase in malicious_vectors:
        text = re.sub(re.escape(phrase), "", text, flags=re.IGNORECASE)
    return text.strip()
