# Contributing

Thanks for helping keep this the most complete, accurate, and *honest* reference in the space. New techniques, sharper defenses, corrected attributions, and additional framework/tool/benchmark mappings are all welcome.

## Ground rules

1. **Defensive and educational only.** This is a resource for authorized red-teaming and detection. Examples must be technique-accurate (real DAN/AIM/Skeleton Key/Crescendo shape, real encodings, real multi-turn structure), not meme canaries. Prefer real eval objectives: system-prompt extraction, `CANARY_a7f3e91c` dump, lab-framed reverse-shell answer keys, tool/exfil patterns. No CBRN or indiscriminate dual-use recipes.
2. **Cite a primary source.** Prefer the paper (arXiv), the vendor disclosure, or the original repo. No claim without a link.
3. **Credit the originator.** Attribution is the currency of this field. If a technique has a named inventor, credit them in the crosswalk `origin` field with a URL.
4. **Do not fabricate mappings.** Only tag a benchmark if the method is *actually registered* in it; only assign a framework ID you can defend. When unsure, leave it to the category default.

## Adding a technique

Technique entries live in the `T` array inside `index.html`. Each is a plain object:

```js
{
 "cat": "indirect", // one of the 20 category ids (see below)
 "fam": "agent", // free-text family tag shown as a chip
 "title": "Short, specific name",
 "what": "The mechanism, in one or two sentences.",
 "why": "Why it slips past safety training. Name the research + a concrete finding.",
 "internals": "Optional: deeper model-internals note.",
 "example": {
 "in": "Realistic attacker-supplied prompt for this technique (accurate shape).",
 "out": "What a successful model reply looks like for that objective."
 },
 "defense": "The concrete detection/defense that neutralizes it.",
 "refs": [ ["Author, Title (arXiv:XXXX.XXXXX)", "https://arxiv.org/abs/XXXX.XXXXX"] ],
 "reading": [ ["Optional further reading", "https://…"] ]
}
```

**Category ids:** `foundations, character, encoding, stego, roleplay, persuasion, refusal, structure, multiturn, incontext, semantic, optimization, indirect, exfil, extraction, multimodal, decoding, modellevel, composition, defense`.

New entries render in their category section automatically; array order is display order within a section. For a batch, drop the objects into an `*-additions-*.js` file and splice them at the end of `T` (see `additions-2026-07.js` for the pattern).

### Defense entries

Blue-team entries use `"cat": "defense"`. Use `"fam": "system"` for a **named system** (a specific tool/method) and include its **documented limitation** honestly in the `defense` field. Named systems omit the `example` field (a success transcript would misrepresent a defense that blocks).

## Adding crosswalk data

The crosswalk (framework IDs, tool hooks, benchmark provenance, attribution) is defined in `crosswalk-block.js`, which is spliced into `index.html`.

- **`XW_CAT`** - per-category defaults `{owasp, atlas, nist, cwe}`. Rarely needs editing.
- **`XW_TECH`** - per-technique overrides keyed by exact title: sharper IDs, tool hooks (`garak`, `promptfoo`, `pyrit`, `strongreject`), `origin: [name, url]`, `seen: year`.
- **`XW_BENCH`** - technique → array of benchmarks that register it. Only the ones that actually do.

Verified reference IDs as of v1.1.0: MITRE ATLAS **v5.6.0**, OWASP LLM Top 10 **2025**, NIST **AI 100-2e2025**, CWE **4.20**.

> **Keys must match a technique title exactly.** A mistyped key silently never applies. The validation below catches this.

## Validate before you PR

The page is a single file; validate that it still compiles and renders:

```bash
# 1) every inline <script> must compile (parse-only)
node -e 'const fs=require("fs");const h=fs.readFileSync("index.html","utf8");
 [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(m=>new Function(m[1]));
 console.log("compiles OK")'

# 2) full DOM render with jsdom (catches runtime errors + counts cards/strips)
npm i jsdom # once
# then run a render check that builds the DOM and asserts 0 JS errors
```

A crosswalk unit test (every `XW_TECH` / `XW_BENCH` key matches a real title; strips render; defenses stay empty) and a jsdom render harness are the recommended checks - mirror them in your PR description with the counts you observed.

## Style

Match the surrounding voice: crisp `what`, mechanism-first `why` that names the research, concrete `defense`. No throat-clearing, no marketing. Two-sentence entries beat five-sentence ones.
