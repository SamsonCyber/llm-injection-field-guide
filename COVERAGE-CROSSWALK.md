# Coverage Crosswalk: the field guide vs the 18-family arsenal

**Claim under test:** Neural Net Dark Alchemy (this field guide) is a *strict superset* of the competitor's 18-family arsenal.

**Verdict:** True, and provable, on exactly one axis. False on two others. Stating it without naming the axis is how the claim gets rebutted in one line ("cool doc, but theirs actually runs"). This file scopes it so it survives contact.

Companion machine-checkable data: `coverage-map.json`. The conformance check there asserts every one of their families maps to at least one field-guide entry that actually exists; it currently PASSes with zero families unmapped.

---

## The three axes (say which one you mean)

| Axis | What it measures | Who leads | Strict superset? |
|---|---|---|---|
| **Reference** | Documented technique families, a defense for each, framework crosswalk | Field guide (**324** entries / 20 categories vs 18 families) | **Yes, airtight** |
| **Execution** | Techniques an agent can fire at a live target | Competitor (agent picks family, drives garak + promptfoo) | No, arguably a subset today |
| **Boundary measurement** | Mapping the compliance frontier with a validated judge + benign control class | Competitor (refusal-frontier) | No, not built |

The coverage feature is a claim about the **reference axis only**. On that axis the margin is not close: their entire arsenal is 18 families, and it lands inside 13 of our 20 categories, leaving 7 whole categories plus 3 meta-layers with zero representation on their side.

The honest footnote, up front: on execution and boundary measurement, they are ahead. They built the runner we mapped, and they implemented our own benchmark-rigor lesson (independent oracle, label the cheat-paths) as refusal-frontier before we did. Coverage is our moat; it is not a capability claim.

---

## Part 1 — every one of their families lands inside ours

Each of their 17 named families (they count it as 18) maps to at least one field-guide category, most to an exact-named entry, several to an entire category of ours.

| Their family | Our subsuming category | Exact-named entry we already carry | Relation |
|---|---|---|---|
| Refusal suppression | `refusal` Refusal Manipulation (9 entries) | **Refusal suppression & length forcing** | superset |
| Prefill | `decoding` + `incontext` | **Assistant Response Prefilling Attack** | superset |
| Format-hijack | `refusal` + `structure` + `decoding` | Style Injection / Model Chat-Format Forgery | superset |
| Divider / mode-switch | `structure` + `roleplay` + `refusal` | **Divider injection** | superset |
| Fake-system-state | `structure` | Semantic frame (fake system message) / Policy Puppetry | superset |
| Persona | `roleplay` Role-Play & Persona (whole category) | DAN / STAN / AIM / Developer Mode | superset |
| Fictional-frame | `roleplay` | DeepInception / Simulation Framing | superset |
| CoT-channel | `decoding` + `modellevel` | **H-CoT (Chain-of-Thought Hijacking)** | superset |
| Parseltongue encodings | `encoding` Encoding & Ciphers (whole category) + `character` | Bijection learning / CipherChat / Leetspeak | superset |
| Invisible-Unicode stego | `stego` Steganographic Channels (whole category) | Unicode tag chars / Zero-width binary / SNOW | superset |
| Homoglyph / glitch | `character` Character & Unicode | **Homoglyph substitution** + **Glitch / Anomalous Tokens** | superset |
| Length coercion | `refusal` + `decoding` + `structure` | Minimum-Length Padding / OverThink / Context Window Overflow | superset |
| Cross-modal agentic injection | `indirect` + `multimodal` (two whole categories, ~30 entries) | Indirect Injection via Retrieved Content / Image-Scaling (Anamorpher) | superset |
| Crescendo | `multiturn` Multi-Turn Escalation (whole category) | **Crescendo / multi-turn escalation** | superset |
| Prompt-extraction | `extraction` Prompt Extraction (whole category) | **System-Prompt Leaking** + PLeak + LM Inversion | superset |
| Payload-splitting | `encoding` + `structure` + `multiturn` | **Payload Splitting (Kang et al.)** | superset |
| Stacked composition | `composition` Composition Strategy (whole category) | **Multi-tactic composition beats single tactics** | equivalent + superset |

**Leaf-level check (2026-07-12):** `coverage-map.json` `subsumes.entries` use exact live titles. **104/104** leaf strings match `const T` after rename pass; **Mousetrap** dropped (gap-analysis conf:low, not catalogued). Family-level rule remains: ≥1 existing entry per competitor family (PASS, 0 unmapped).

One nuance worth stating rather than hiding. "Parseltongue" and "stacked composition" are *composite* families, a named cocktail (leet + symbol + emoji) and a stacking strategy. We carry every ingredient and the strategy entry (`Family diversity & layer ordering`), but we do not name their specific branded cocktail as one entry. That is a composition *instance*, subsumed by the Composition Strategy category, not a missing technique. Call it covered, not enumerated.

---

## Part 2 — what makes the superset *strict* (the classes they carry zero of)

Seven of our twenty categories have no representative in their 18-family taxonomy, plus three meta-layers.

| Ours-only category | Entries (live) | Why an 18-family prompt arsenal has none |
|---|---|---|
| Foundations | 33 | Theory / mechanism. Their project's stated stance is "doesn't lecture." |
| Persuasion & Social | 6 | PAP / authority / foot-in-the-door, folded under persona on their side. |
| Optimization & Automated | 36 | GCG / PAIR / TAP / AutoDAN / GPTFuzzer / BEAST / GOAT + Fun-Tuning / Neural Exec / IRIS. Their runner can *fire* some through garak; their arsenal *enumerates* none. |
| Data Exfiltration | 10 | Markdown-image zero-click / CamoLeak / spAIware / lethal-trifecta / ANSI-terminal. Extraction is not exfil. |
| Decoding & Inference | 14 | Generation-exploitation sweep / constrained decoding / Flowbreaking / OverThink. |
| Model-Level & Supply-Chain | 28 | Fine-tuning / LoRA-strip / RLHF-poison / sleeper agents / abliteration / BadEdit / ShadowLogic / subliminal / weight-extraction / 250-doc pretraining poison. Outside a prompt-attack arsenal entirely. |
| Defenses (Blue Team) | 31 | The whole blue team, their explicit non-goal. StruQ / SecAlign / Instruction Hierarchy / ISE / Task Shield. |

Meta-layers they also lack: the OWASP/ATLAS/NIST/CWE crosswalk, benchmark provenance tags, originator attribution, and per-technique garak/promptfoo/PyRIT/StrongREJECT hooks.

That last meta-layer is the important one, and it is the bridge to Part 3.

---

## Part 3 — the synthesis: coverage is a routing table, not a trophy

Where a public probe exists, the field guide names the garak / promptfoo / PyRIT / StrongREJECT invocation. That subset is a routing table into those tools; it is not a claim that every one of the 324 cards has a harness hook (today: see `_meta.with_tool_hooks` on the crosswalked export).

Their agent's action space today is 18 families. Ours is **324** catalogued techniques (293 attack-side + 31 defense). Wire the two together and:

- their runner gains our coverage (its action space becomes our map),
- our coverage gains execution (the reference axis stops being the only axis we win).

That is the whole competitive picture in one move. They built the executor; we hold the routing table the executor should consume. The `coverage-map.json` `execution` field on each family is the first draft of that wiring (which of Garbleworks / garak / promptfoo / manual actually fires each family today), which doubles as the honest gap ledger: everywhere it says `manual` or points only at a doc, that is a technique we document but cannot yet fire.

---

## How to keep this claim true as both sides change

`coverage-map.json` is regenerable and checkable, not a one-time assertion:

1. **Conformance test.** Load every technique title from `field-guide.json` into a set. For each family in `map[]`, assert its `subsumes.entries` intersect that set. Any family with an empty intersection breaks the superset and gets reported, not glossed. (Current result: PASS, 0 unmapped.)
2. **Re-run on their release.** When the arsenal adds a family, add a row. If we cannot subsume it, that is a real gap and a work item, surfaced mechanically instead of discovered in an argument.
3. **Track the execution axis separately.** The `execution` flags are the roadmap: convert `manual` to a real invocation and the two axes converge. This is the lane that meets Garble's Garbleworks / Gray Swan work in the middle.

**Bottom line for anyone quoting the coverage feature:** say "strict superset *as a documented, defended, framework-mapped reference*." That version is backed by a passing check. The unscoped version invites the one rebuttal we cannot answer yet, which is that theirs runs and ours, on its own, reads.
