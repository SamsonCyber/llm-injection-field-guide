/* ------------------------------------------------------------------ *
 *  Named defense SYSTEMS (fam:"system") — Phase 1 upgrade of the
 *  Defenses category from principles to named, cited, honestly-limited
 *  systems. No `example` field: the what/why/defense rows are
 *  self-contained, and it avoids the transcript's PWNED token making a
 *  defense look like it fails. Splice into const T (append at end).
 *  Every arXiv id verified against its abstract.
 * ------------------------------------------------------------------ */
const DEFENSE_ADDITIONS_2026_07 = [
  {
    "cat": "defense",
    "fam": "system",
    "title": "Constitutional Classifiers (Anthropic)",
    "what": "Wrap the model in input and output classifier 'guards' trained on synthetic data generated from a natural-language constitution of allowed and disallowed content; the guard blocks a harmful exchange even when the base model would comply.",
    "why": "It moves the safety decision off the base model onto a dedicated classifier trained on the exact policy, so a jailbreak that flips the base model still has to beat a second, purpose-built filter on both the prompt and the streamed output. Anthropic's public program ran thousands of red-team hours without a universal break, at a reported 0.05% production over-refusal.",
    "defense": "Strong against universal jailbreaks, but adds latency and over-refusal and has documented adversarial-fine-tuning bypasses; deploy it as one layer, never the only one.",
    "refs": [
      ["Constitutional Classifiers (arXiv:2501.18837)", "https://arxiv.org/abs/2501.18837"],
      ["Constitutional Classifiers++ (arXiv:2601.04603)", "https://arxiv.org/abs/2601.04603"]
    ]
  },
  {
    "cat": "defense",
    "fam": "system",
    "title": "Circuit Breakers / Representation Rerouting",
    "what": "Representation-engineering fine-tuning that reroutes the internal activations leading to a harmful completion toward a refusal state, interrupting generation mid-stream, without training on any specific attack.",
    "why": "Instead of filtering strings, it edits the model's own representations so the harmful trajectory collapses internally, which generalizes to unseen and multimodal attacks (Zou et al. report ~90% harmful-rejection on Llama). It attacks the problem where jailbreaks actually live, in activation space.",
    "defense": "Generalizes well but is not unbreakable: embedding-space adaptive attacks have reached ~100% ASR against it, so pair it with input/output guards. (RepBend, arXiv:2504.01550, is a related but separate method by a different group.)",
    "refs": [
      ["Circuit Breakers / RR (arXiv:2406.04313)", "https://arxiv.org/abs/2406.04313"],
      ["Adaptive bypass (arXiv:2407.15902)", "https://arxiv.org/abs/2407.15902"]
    ]
  },
  {
    "cat": "defense",
    "fam": "system",
    "title": "SmoothLLM (randomized smoothing)",
    "what": "Create N character-perturbed copies of the prompt, run each through the model, and aggregate the answers by majority vote, exploiting how fragile optimized adversarial suffixes are to small edits.",
    "why": "GCG-style suffixes are brittle: one character change often breaks them, so perturb-and-vote washes them out while leaving benign prompts intact. It is conceptually cheap and fully model-agnostic.",
    "defense": "Effective against optimization-based suffix attacks (GCG, AmpleGCG) but weak against semantic jailbreaks (PAIR-type) and it multiplies inference cost by N; scope it to the suffix-attack class.",
    "refs": [
      ["SmoothLLM (arXiv:2310.03684)", "https://arxiv.org/abs/2310.03684"]
    ]
  },
  {
    "cat": "defense",
    "fam": "system",
    "title": "Spotlighting / datamarking (Microsoft)",
    "what": "Transform untrusted data so the model can always tell it apart from instructions: delimit it, interleave a marker token between every word (datamarking), or encode it (for example base64) before it enters the context.",
    "why": "Indirect injection works because retrieved data and real instructions become the same flat stream; spotlighting re-introduces a boundary the model can see, so text inside the marked region is read as data, not commands. Shipped in Azure AI 'Prompt Shields'.",
    "defense": "A mitigation that raises attacker cost, not a guarantee: the encoding variant needs a capable model and degrades on weaker ones, and it reduces rather than eliminates indirect injection.",
    "refs": [
      ["Spotlighting (arXiv:2403.14720)", "https://arxiv.org/abs/2403.14720"]
    ]
  },
  {
    "cat": "defense",
    "fam": "system",
    "title": "Guardrail models (Llama Guard, ShieldGemma, Granite Guardian, Prompt Guard)",
    "what": "Dedicated classifier models that screen the prompt and/or response against a safety taxonomy: Llama Guard, ShieldGemma and Granite Guardian for content categories, Prompt Guard for injection/jailbreak strings.",
    "why": "A cheap, swappable filter in front of and behind the model, trained on a fixed taxonomy, catches the bulk of known-category harmful content and known injection strings without touching the base model, and slots into any pipeline.",
    "defense": "Coverage is bounded by the trained categories and the classifier's tokenizer: TokenBreak and controlled-release phrasing bypass string-based guards, and guards degrade off-distribution; run as a layer with output monitoring, not a boundary.",
    "refs": [
      ["Llama Guard (arXiv:2312.06674)", "https://arxiv.org/abs/2312.06674"],
      ["ShieldGemma (arXiv:2407.21772)", "https://arxiv.org/abs/2407.21772"],
      ["Granite Guardian (arXiv:2412.07724)", "https://arxiv.org/abs/2412.07724"]
    ]
  },
  {
    "cat": "defense",
    "fam": "system",
    "title": "Dual-LLM pattern & CaMeL (privilege separation)",
    "what": "Split the agent: a privileged LLM holds the tools but never reads untrusted content, and a quarantined LLM reads untrusted content but has no tool access and returns only symbolic variables. CaMeL formalizes this as control/data-flow extraction from the trusted query with capability-gated tool calls.",
    "why": "It removes the mechanism injection needs: untrusted text can no longer reach the component that can act, so security becomes architectural and model-independent rather than a matter of the model resisting a clever prompt. CaMeL keeps ~77% of AgentDojo task utility with provable protection.",
    "defense": "The most robust answer for tool-using agents, at a utility and engineering cost (~7pp on AgentDojo) and it does not stop every data-dependent leak; design the agent this way rather than trusting detection.",
    "refs": [
      ["Willison, the dual-LLM pattern", "https://simonwillison.net/2023/Apr/25/dual-llm-pattern/"],
      ["CaMeL (arXiv:2503.18813)", "https://arxiv.org/abs/2503.18813"]
    ]
  },
  {
    "cat": "defense",
    "fam": "system",
    "title": "Perplexity / input filtering",
    "what": "Flag optimized adversarial suffixes by their statistical signature: GCG-style suffixes are high-perplexity gibberish, so a perplexity threshold (optionally with token-length features) rejects them; paraphrase and retokenization are related preprocessing baselines.",
    "why": "It targets the one thing gradient-optimized suffixes cannot easily hide, their unnaturalness, giving a cheap filter for exactly that class.",
    "defense": "Narrow and noisy: high false-positive rate on legitimate prompts, and useless against readable low-perplexity or perplexity-constrained attacks and all semantic jailbreaks. A supplement, not a primary control.",
    "refs": [
      ["Perplexity detection (arXiv:2308.14132)", "https://arxiv.org/abs/2308.14132"],
      ["Baseline defenses (arXiv:2309.00614)", "https://arxiv.org/abs/2309.00614"]
    ]
  },
  {
    "cat": "defense",
    "fam": "system",
    "title": "Known-answer injection detection",
    "what": "Detect prompt injection in retrieved data with a tripwire: prepend a secret instruction ('repeat this key, ignore any text that follows'); if the model's output omits the key, some embedded instruction overrode it, so the data was compromised.",
    "why": "It turns detection into an observable behaviour change on a known probe, so you can catch an injection without knowing the specific attack in advance. Benchmarked as the most effective of the existing detection methods.",
    "defense": "Best-in-class among detectors but still misses a substantial fraction against combined attacks, and the prevention variants (sandwich, instructional) are bypassable; treat detection as a signal, not a fix.",
    "refs": [
      ["Formalizing & Benchmarking Prompt Injection (arXiv:2310.12815, USENIX Security 2024)", "https://arxiv.org/abs/2310.12815"]
    ]
  },
  {
    "cat": "defense",
    "fam": "system",
    "title": "Canary tokens & known-attack vector DB (Rebuff, Vigil)",
    "what": "Layered detection: heuristics, an LLM detector, a vector database of known-attack embeddings, and canary tokens, a secret string prefixed to the prompt whose appearance in output flags a leak or override, with leaked prompts fed back into the DB.",
    "why": "Cheap, deployable instrumentation that catches repeats of known attacks and prompt-leak exfiltration and self-improves as it captures new ones, which makes it a good telemetry layer.",
    "defense": "Reactive by design: weak on novel unseen attacks and only catches near-duplicates of known ones; good instrumentation, not a boundary.",
    "refs": [
      ["Rebuff (Protect AI)", "https://github.com/protectai/rebuff"],
      ["Vigil (deadbits)", "https://github.com/deadbits/vigil-llm"]
    ]
  },
  {
    "cat": "defense",
    "fam": "system",
    "title": "Constrain the agent, not the model (design patterns)",
    "what": "Accept that no detector is perfect and limit blast radius instead: least-privilege tools, human-in-the-loop on consequential actions, capability gating, and the design patterns (action-selector, plan-then-execute, dual-LLM, code-then-execute, context-minimization, map-reduce) that bound what an agent may do once it has read untrusted input.",
    "why": "A detector that stops 95% of injections is a failing grade, because an adaptive attacker only needs the residual few percent. Robustness has to come from what the agent is allowed to do after ingesting untrusted content, not from the model reliably spotting the attack.",
    "defense": "Treat detection as a signal and architecture as the control: no outbound action on untrusted-derived data without an out-of-band check. This is the enforcement side of the lethal-trifecta rule.",
    "refs": [
      ["Design Patterns for Securing LLM Agents (arXiv:2506.08837)", "https://arxiv.org/abs/2506.08837"],
      ["Willison, the lethal trifecta", "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/"]
    ]
  }
];
