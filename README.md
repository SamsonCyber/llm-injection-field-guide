# Dark Promptery

### A mechanism-first field reference to LLM prompt-injection and jailbreak techniques

![version](https://img.shields.io/badge/version-1.1.0-e0a63c)
![license](https://img.shields.io/badge/license-CC%20BY%204.0-3f8f52)
![techniques](https://img.shields.io/badge/techniques-324-5b8cc4)
![defenses](https://img.shields.io/badge/defenses-31-6bbf7b)
![build](https://img.shields.io/badge/build-none%20(single%20file)-8a8f9c)

**324 techniques in 20 categories** (293 attack-side + 31 blue-team). Every attack has a defense field. Attack cards map to OWASP / MITRE ATLAS / NIST / CWE where applicable.

A subset lists public tool probes (garak / promptfoo / PyRIT / StrongREJECT), benchmark tags, and originator links. One self-contained HTML page for authorized red-teaming, detection engineering, and security research.

**► Live: https://samsoncyber.github.io/llm-injection-field-guide/**

---

## What this is

Shallow taxonomies name a few classes. Payload dumps list strings without mechanism. Survey PDFs are hard to search mid-assessment. This guide is a **browsable, searchable catalog**. Each technique states:

- **What** it is (the mechanism)
- **Why** it slips past safety training
- a **technique-accurate example** (real DAN/AIM/Skeleton Key shape, real encodings, real multi-turn structure) with eval objectives such as system-prompt leak, canary dump, or lab-framed reverse-shell answer keys
- the **detection / defense** that neutralizes it
- **sources** to the primary research

Attack cards carry a **crosswalk strip** where applicable: framework IDs, tool probes when a public harness names the method, benchmarks that register it, and the researcher who originated it. Foundations (theory) and pure defense cards are not tagged as OWASP LLM01 by default.

## Highlights

- **324 techniques / 20 categories:** single-codepoint Unicode tricks through agent-level indirect injection, optimization attacks, multimodal, model-level, and supply-chain.
- **A defense field on every attack,** plus a blue-team section of **31** defense entries (Constitutional Classifiers, Circuit Breakers, SmoothLLM, Spotlighting, guardrail models, Dual-LLM / CaMeL, and more), each with its documented limitation.
- **Framework crosswalk:** attack techniques mapped to **OWASP LLM Top 10 (2025)**, **MITRE ATLAS (v5.6.0)**, **NIST AI 100-2e2025**, and **CWE 4.20**. Foundations stay untagged so auditor IDs stay meaningful.
- **Tool hooks (subset):** when a public probe exists, the card names the **garak** / **promptfoo** / **PyRIT** / **StrongREJECT** invocation. Missing chip means no verified hook, not "untestable."
- **Benchmark provenance:** tags only registries that actually contain the method (HarmBench, StrongREJECT, JailbreakBench, AgentDojo, HackAPrompt, and others). Methods in no registry carry no tag.
- **Originator attribution:** a large subset credits the researcher who coined the method, with a link.
- **Zero build:** one `index.html`. Dark and light themes, live search (technique, mechanism, codepoint, framework ID, or tool name), KaTeX math, self-contained SVG diagrams.

## Who it's for

Red-teamers and pentesters scoping an engagement, detection engineers building filters, AI-safety researchers, and anyone learning how instruction-following becomes an attack surface. Read it top-to-bottom as a course, or search it as a reference during an assessment.

## Scope & ethics

Defensive and educational material for **authorized** red-teaming, security research, and detector development. Examples show the real shape of each technique with standard eval objectives (system-prompt extraction, canary tokens, lab-scoped payload answer keys). No CBRN. Know your rules of engagement. Licensed for reuse with attribution (see below).

Quantitative ASR figures on cards are **paper-reported, point-in-time** numbers (judge, dataset, and model build matter). Re-test on your target; do not treat catalog ASR as a standing leaderboard.

## Use it

- **Online:** open the live link above.
- **Offline:** clone and open `index.html` in any modern browser. No server, no dependencies, no build step. (The page loads fonts and KaTeX from a CDN for polish; it renders fully without them.)

```bash
git clone https://github.com/SamsonCyber/llm-injection-field-guide.git
cd llm-injection-field-guide
# open index.html
```

## How it's built

`index.html` is the single source of truth for technique text (`const CATS` / `const T`). After edits:

```bash
python sync.py                 # regenerates field-guide.json, field-guide.md, noscript/JSON-LD counts
python export_crosswalked.py   # merges crosswalk-block.js → field-guide.crosswalked.json
```

| File | Role |
|---|---|
| `index.html` | the published page (data + render + styles, self-contained) |
| `crosswalk-block.js` | framework IDs, tool hooks, benchmark provenance, attribution (source of truth for the crosswalk) |
| `field-guide.json` | structured export of `const T` (no nested crosswalk) |
| `field-guide.crosswalked.json` | same + nested `crosswalk` for MCP / harness consumers |
| `coverage-map.json` | reference-axis superset check vs the 18-family arsenal |
| `sync.py` / `export_crosswalked.py` | regenerators |

See [CONTRIBUTING.md](CONTRIBUTING.md) for the entry schema and how to add a technique.

## Cite as

> SamsonCyber. "Dark Promptery: A Field Reference to LLM Prompt-Injection and Jailbreak Techniques," v1.1.0, 2026. https://samsoncyber.github.io/llm-injection-field-guide/ (CC BY 4.0).

```bibtex
@misc{nnda110,
  author       = {SamsonCyber},
  title        = {Dark Promptery: A Field Reference to LLM Prompt-Injection and Jailbreak Techniques},
  year         = {2026},
  version      = {1.1.0},
  howpublished = {\url{https://samsoncyber.github.io/llm-injection-field-guide/}},
  note         = {CC BY 4.0}
}
```

## Contributing

New techniques, sharper defenses, corrected attributions, and additional framework/tool mappings are welcome. The entry schema and rules (defensive-only, benign examples, cite a primary source, credit the originator) are in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**. See [LICENSE](LICENSE). You may share and adapt the material for any purpose, including commercially, if you give appropriate credit: *SamsonCyber, Dark Promptery, https://samsoncyber.github.io/llm-injection-field-guide/*.

## Acknowledgements

The field guide catalogs and attributes the work of the researchers who built this field, among them Simon Willison (the term "prompt injection", the "lethal trifecta"), Kai Greshake et al. (indirect prompt injection), Johann Rehberger / Embrace The Red (spAIware, ASCII smuggling, Terminal DiLLMa), and Sander Schulhoff / HackAPrompt, and it maps to the frameworks maintained by OWASP, MITRE, and NIST, and the tools maintained by NVIDIA (garak), promptfoo, and Microsoft (PyRIT). Full per-technique citations are in the page itself.
