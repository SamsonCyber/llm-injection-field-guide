#!/usr/bin/env python3
"""Export field-guide.json with nested crosswalk for Garbleworks / MCP consumers.

Reads index.html const T + CATS and merges category defaults + per-title overrides
from crosswalk-block.js (same rules as xwData()). Writes:

  - field-guide.crosswalked.json  (here)
  - optional --out path (e.g. payload-mutator vendored copy)

Does not invent tool hooks: only titles present in XW_TECH/XW_BENCH get them.
"""
from __future__ import annotations

import argparse
import io
import json
import os
import re
import sys
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
HTML = HERE / "index.html"
BLOCK = HERE / "crosswalk-block.js"

OWASP_TITLES = {
    "LLM01": "Prompt Injection",
    "LLM02": "Sensitive Information Disclosure",
    "LLM03": "Supply Chain",
    "LLM04": "Data and Model Poisoning",
    "LLM05": "Improper Output Handling",
    "LLM06": "Excessive Agency",
    "LLM07": "System Prompt Leakage",
    "LLM08": "Vector and Embedding Weaknesses",
    "LLM09": "Misinformation",
    "LLM10": "Unbounded Consumption",
}


def extract_const(html: str, name: str):
    key = f"const {name} = "
    s = html.find(key)
    if s < 0:
        sys.exit(f"missing const {name}")
    s += len(key)
    e = html.find("\n];", s)
    if e < 0:
        sys.exit(f"no end for const {name}")
    return json.loads(html[s : e + 2])


def _parse_js_object_body(text: str, start: int) -> tuple[str, int]:
    """Return (object_literal_including_braces, end_index_after_object)."""
    i = text.find("{", start)
    if i < 0:
        raise ValueError("no {")
    depth = 0
    in_str = False
    esc = False
    quote = None
    j = i
    while j < len(text):
        c = text[j]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == quote:
                in_str = False
        else:
            if c in "\"'":
                in_str = True
                quote = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return text[i : j + 1], j + 1
        j += 1
    raise ValueError("unclosed object")


def parse_crosswalk_block(_js: str) -> tuple[dict, dict, dict]:
    """Parse XW_CAT, XW_TECH, XW_BENCH from crosswalk-block.js via Node helper."""
    import subprocess

    helper = HERE / "_parse_xw.mjs"
    if not helper.exists():
        sys.exit(f"missing {helper}")
    r = subprocess.run(
        ["node", str(helper)],
        capture_output=True,
        text=True,
        check=False,
        cwd=str(HERE),
    )
    if r.returncode != 0 or not r.stdout.strip():
        sys.exit(
            "export_crosswalked.py: node parse failed:\n"
            f"stdout={r.stdout[:500]!r}\nstderr={r.stderr[:500]!r}"
        )
    data = json.loads(r.stdout)
    return data["XW_CAT"], data["XW_TECH"], data["XW_BENCH"]


def merge_crosswalk(t: dict, xw_cat: dict, xw_tech: dict, xw_bench: dict) -> dict | None:
    cat = t.get("cat")
    if cat == "defense":
        return None
    base = xw_cat.get(cat)
    if base is None:
        # foundations or unknown: no default framework tags
        tech = xw_tech.get(t["title"])
        if not tech:
            return None
        d = dict(tech)
    else:
        d = dict(base)
        d.update(xw_tech.get(t["title"]) or {})
    if xw_bench.get(t["title"]):
        d["bench"] = xw_bench[t["title"]]

    out: dict = {}
    owasp = d.get("owasp")
    if owasp:
        out["owasp"] = owasp
        out["owasp_title"] = OWASP_TITLES.get(owasp, "")
    if d.get("atlas"):
        out["atlas"] = d["atlas"]
    if d.get("nist"):
        out["nist"] = d["nist"]
    if d.get("cwe"):
        out["cwe"] = d["cwe"]

    tools = {}
    for k in ("garak", "promptfoo", "pyrit", "strongreject"):
        if d.get(k):
            tools[k] = d[k]
    if tools:
        out["tools"] = tools

    if d.get("bench"):
        out["benchmarks"] = list(d["bench"])

    origin = d.get("origin")
    if origin and isinstance(origin, (list, tuple)) and len(origin) >= 1:
        out["origin"] = {
            "name": origin[0],
            "url": origin[1] if len(origin) > 1 else "",
        }
    if d.get("seen") is not None:
        out["first_seen"] = d["seen"]

    return out or None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--out",
        action="append",
        default=[],
        help="extra output path(s); always writes field-guide.crosswalked.json here",
    )
    args = ap.parse_args()

    html = HTML.read_text(encoding="utf-8")
    cats = extract_const(html, "CATS")
    techs = extract_const(html, "T")
    xw_cat, xw_tech, xw_bench = parse_crosswalk_block(BLOCK.read_text(encoding="utf-8"))

    enriched = []
    n_cw = n_tools = n_bench = n_origin = 0
    for t in techs:
        e = dict(t)
        cw = merge_crosswalk(t, xw_cat, xw_tech, xw_bench)
        if cw:
            e["crosswalk"] = cw
            n_cw += 1
            if cw.get("tools"):
                n_tools += 1
            if cw.get("benchmarks"):
                n_bench += 1
            if cw.get("origin"):
                n_origin += 1
        enriched.append(e)

    payload = {
        "_meta": {
            "version": "1.1.0",
            "generated": date.today().isoformat(),
            "source": "llm-injection-field-guide/index.html (const T) + crosswalk-block.js",
            "frameworks": "MITRE ATLAS v5.6.0 · OWASP LLM Top 10 2025 · NIST AI 100-2e2025 · CWE 4.20",
            "technique_count": len(enriched),
            "crosswalked": n_cw,
            "with_tool_hooks": n_tools,
            "with_benchmarks": n_bench,
            "with_origin": n_origin,
            "notes": (
                "Foundations and defense categories intentionally carry no default "
                "OWASP/ATLAS/CWE tags. Tool hooks exist only where a public probe is named."
            ),
        },
        "categories": cats,
        "techniques": enriched,
    }

    outs = [HERE / "field-guide.crosswalked.json"] + [Path(p) for p in args.out]
    text = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    for p in outs:
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8", newline="\n")
        print(f"wrote {p} ({len(enriched)} techniques, {n_cw} crosswalked, "
              f"{n_tools} tools, {n_bench} benches, {n_origin} origin)")


if __name__ == "__main__":
    main()
