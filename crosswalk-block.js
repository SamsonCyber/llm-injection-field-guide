/* ------------------------------------------------------------------ *
 *  Framework + tooling crosswalk.
 *  Attack techniques -> authoritative IDs (so the guide is citable in the
 *  language auditors/vendors use). A subset also carries the public tool
 *  probe that tests it + originator attribution.
 *  Foundations and defense categories have no default attack IDs.
 *  IDs verified against: MITRE ATLAS v5.6.0, OWASP Top 10 for LLM Apps
 *  2025, NIST AI 100-2e2025, CWE 4.20.  Category defaults, overridden
 *  per technique where a more specific mapping / tool / origin exists.
 * ------------------------------------------------------------------ */
const XW_OWASP = {
  LLM01:"Prompt Injection", LLM02:"Sensitive Information Disclosure",
  LLM03:"Supply Chain", LLM04:"Data and Model Poisoning",
  LLM05:"Improper Output Handling", LLM06:"Excessive Agency",
  LLM07:"System Prompt Leakage", LLM08:"Vector and Embedding Weaknesses",
  LLM09:"Misinformation", LLM10:"Unbounded Consumption"
};
const XW_TOOLURL = {
  garak:"https://github.com/NVIDIA/garak",
  promptfoo:"https://www.promptfoo.dev/docs/red-team/strategies/",
  pyrit:"https://azure.github.io/PyRIT/",
  strongreject:"https://github.com/dsbowen/strong_reject"
};
/* benchmark/leaderboard where the method is actually registered (verified;
   methods with no registry entry deliberately carry no chip) */
const XW_BENCHURL = {
  HarmBench:"https://www.harmbench.org/",
  StrongREJECT:"https://github.com/dsbowen/strong_reject",
  JailbreakBench:"https://jailbreakbench.github.io/",
  AdvBench:"https://github.com/llm-attacks/llm-attacks",
  AgentDojo:"https://agentdojo.spylab.ai/",
  InjecAgent:"https://github.com/uiuc-kang-lab/InjecAgent",
  HackAPrompt:"https://www.hackaprompt.com/",
  TensorTrust:"https://tensortrust.ai/",
  "In-the-Wild":"https://github.com/verazuo/jailbreak_llms",
  "Gray Swan":"https://app.grayswan.ai/arena"
};
/* category -> default {owasp, atlas, nist, cwe}
   foundations / defense: null (no attack-framework IDs on concept or blue-team cards;
   per-technique XW_TECH can still attach tools/origin if needed). */
const XW_CAT = {
  foundations:null,
  character:{owasp:"LLM01",atlas:"AML.T0068",nist:"Mismatched generalization",cwe:"CWE-1427"},
  encoding:{owasp:"LLM01",atlas:"AML.T0068",nist:"Mismatched generalization",cwe:"CWE-1427"},
  stego:{owasp:"LLM01",atlas:"AML.T0068",nist:"Mismatched generalization",cwe:"CWE-1427"},
  roleplay:{owasp:"LLM01",atlas:"AML.T0054",nist:"Jailbreaking (competing objectives)",cwe:"CWE-1427"},
  persuasion:{owasp:"LLM01",atlas:"AML.T0054",nist:"Jailbreaking (competing objectives)",cwe:"CWE-1427"},
  refusal:{owasp:"LLM01",atlas:"AML.T0054",nist:"Prefix injection / competing objectives",cwe:"CWE-1427"},
  structure:{owasp:"LLM01",atlas:"AML.T0051",nist:"Direct Prompt Injection",cwe:"CWE-1427"},
  multiturn:{owasp:"LLM01",atlas:"AML.T0054",nist:"Jailbreaking",cwe:"CWE-1427"},
  incontext:{owasp:"LLM01",atlas:"AML.T0054",nist:"Competing objectives",cwe:"CWE-1427"},
  semantic:{owasp:"LLM01",atlas:"AML.T0054",nist:"Mismatched generalization",cwe:"CWE-1427"},
  optimization:{owasp:"LLM01",atlas:"AML.T0043",nist:"Optimization-based attacks",cwe:"CWE-1427"},
  indirect:{owasp:"LLM01",atlas:"AML.T0051.001",nist:"Indirect Prompt Injection Attacks",cwe:"CWE-1427"},
  exfil:{owasp:"LLM02",atlas:"AML.T0057",nist:"Privacy Compromise",cwe:"CWE-1426"},
  extraction:{owasp:"LLM07",atlas:"AML.T0056",nist:"Prompt Extraction",cwe:"CWE-1427"},
  multimodal:{owasp:"LLM01",atlas:"AML.T0051",nist:"Direct Prompt Injection",cwe:"CWE-1427"},
  decoding:{owasp:"LLM01",atlas:"AML.T0054",nist:"Optimization-based attacks",cwe:"CWE-1427"},
  modellevel:{owasp:"LLM04",atlas:"AML.T0020",nist:"Model Poisoning",cwe:""},
  composition:{owasp:"LLM01",atlas:"AML.T0065",nist:"",cwe:"CWE-1427"},
  defense:null
};
/* per-technique overrides: tool hooks, originator attribution, first-seen,
   and sharper ID mappings than the category default. Keyed by exact title. */
const XW_TECH = {
  "Base64 + decode-and-execute":{garak:"encoding",promptfoo:"base64",pyrit:"Base64Converter",strongreject:"base64"},
  "Classical ciphers (ROT13 / Caesar / Atbash)":{garak:"encoding",promptfoo:"rot13",pyrit:"ROT13Converter",strongreject:"rot_13"},
  "Homoglyph substitution":{promptfoo:"homoglyph",pyrit:"HomoglyphConverter"},
  "Leetspeak / 1337":{promptfoo:"leetspeak",pyrit:"LeetspeakConverter"},
  "Morse, Braille, Pig Latin, transport encodings":{promptfoo:"morse"},
  "Unicode tag characters (U+E0000 block)":{garak:"smuggling",origin:["Rehberger, ASCII Smuggling","https://embracethered.com/blog/posts/2025/sneaky-bits-and-ascii-smuggler/"],seen:2024},
  "Zero-width binary (“sneaky bits”)":{garak:"smuggling",origin:["Rehberger, Sneaky Bits","https://embracethered.com/blog/posts/2025/sneaky-bits-and-ascii-smuggler/"],seen:2025},
  "Variation-selector byte channel":{garak:"smuggling"},
  "ArtPrompt (ASCII-art masking)":{origin:["Jiang et al. (arXiv:2402.11753)","https://arxiv.org/abs/2402.11753"],seen:2024},
  "CipherChat / SelfCipher":{origin:["Yuan et al. (arXiv:2308.06463)","https://arxiv.org/abs/2308.06463"],seen:2023},
  "CodeChameleon (personalized encryption)":{origin:["Lv et al. (arXiv:2402.16717)","https://arxiv.org/abs/2402.16717"],seen:2024},
  "FlipAttack (character/word reversal)":{origin:["Liu et al. (arXiv:2410.02832)","https://arxiv.org/abs/2410.02832"],seen:2024},
  "Glitch / Anomalous Tokens (SolidGoldMagikarp)":{garak:"glitch",origin:["Rumbelow & Watkins, SolidGoldMagikarp","https://www.lesswrong.com/posts/aPeJE8bSo6rAFoLqg/solidgoldmagikarp-plus-prompt-generation"],seen:2023},
  "TokenBreak (classifier tokenizer manipulation)":{origin:["HiddenLayer, TokenBreak","https://www.hiddenlayer.com/innovation-hub/research"],seen:2025},
  "DAN (Do Anything Now)":{garak:"dan",promptfoo:"jailbreak:composite",origin:["r/ChatGPTJailbreak community","https://en.wikipedia.org/wiki/Prompt_injection"],seen:2022},
  "Grandma Exploit (emotional-appeal role-play)":{garak:"grandma"},
  "Persuasive Adversarial Prompts (PAP)":{origin:["Zeng et al. (arXiv:2401.06373)","https://arxiv.org/abs/2401.06373"],strongreject:"pap_evidence_based",seen:2024},
  "Prefix Injection":{strongreject:"prefix_injection",origin:["Wei et al. (arXiv:2307.02483)","https://arxiv.org/abs/2307.02483"],seen:2023},
  "Refusal suppression & length forcing":{strongreject:"refusal_suppression",origin:["Wei et al. (arXiv:2307.02483)","https://arxiv.org/abs/2307.02483"],seen:2023},
  "Style Injection":{strongreject:"style_injection"},
  "Distractor Instructions":{strongreject:"distractors"},
  "Payload Splitting (Kang et al.)":{origin:["Kang et al. (arXiv:2302.05733)","https://arxiv.org/abs/2302.05733"],strongreject:"auto_payload_splitting",seen:2023},
  "GODMODE / Liberation State-Flag Injection":{origin:["Pliny (elder-plinius), L1B3RT4S","https://github.com/elder-plinius/L1B3RT4S"],seen:2024},
  "Policy Puppetry (policy-file framing)":{origin:["HiddenLayer","https://www.hiddenlayer.com/research/novel-universal-bypass-for-all-major-llms"],seen:2025},
  "Crescendo / multi-turn escalation":{origin:["Russinovich et al., Microsoft (arXiv:2404.01833)","https://arxiv.org/abs/2404.01833"],pyrit:"CrescendoOrchestrator",promptfoo:"crescendo",seen:2024},
  "Many-shot jailbreaking":{origin:["Anil et al., Anthropic","https://www.anthropic.com/research/many-shot-jailbreaking"],seen:2024},
  "Skeleton Key":{origin:["Microsoft MSRC","https://www.microsoft.com/en-us/security/blog/2024/06/26/mitigating-skeleton-key-a-new-type-of-generative-ai-jailbreak-technique/"],pyrit:"SkeletonKeyOrchestrator",promptfoo:"jailbreak",seen:2024},
  "Bad Likert Judge":{origin:["Unit 42","https://unit42.paloaltonetworks.com/multi-turn-technique-jailbreaks-llms/"],promptfoo:"likert",seen:2025},
  "Deceptive Delight":{origin:["Unit 42","https://unit42.paloaltonetworks.com/jailbreak-llms-through-camouflage-distraction/"],seen:2024},
  "Echo Chamber":{origin:["NeuralTrust","https://neuraltrust.ai/blog/echo-chamber-context-poisoning-jailbreak"],seen:2025},
  "ActorAttack":{origin:["Ren et al. (arXiv:2410.10700)","https://arxiv.org/abs/2410.10700"],seen:2024},
  "GCG, adversarial suffix":{origin:["Zou et al. (arXiv:2307.15043)","https://arxiv.org/abs/2307.15043"],garak:"gcg",atlas:"AML.T0043.000",cwe:"CWE-1039",seen:2023},
  "PAIR (Prompt Automatic Iterative Refinement)":{origin:["Chao et al. (arXiv:2310.08419)","https://arxiv.org/abs/2310.08419"],pyrit:"PAIROrchestrator",promptfoo:"jailbreak",atlas:"AML.T0043.001",seen:2023},
  "TAP (Tree of Attacks with Pruning)":{origin:["Mehrotra et al. (arXiv:2312.02119)","https://arxiv.org/abs/2312.02119"],garak:"tap",pyrit:"TreeOfAttacksWithPruningOrchestrator",promptfoo:"tree",seen:2023},
  "GPTFuzzer":{origin:["Yu et al. (arXiv:2309.10253)","https://arxiv.org/abs/2309.10253"],seen:2023},
  "AutoDAN (genetic-algorithm prompt fuzzing)":{origin:["Liu et al. (arXiv:2310.04451)","https://arxiv.org/abs/2310.04451"],seen:2023},
  "AutoDAN-Turbo, self-discovering agent":{origin:["Liu et al. (arXiv:2410.05295)","https://arxiv.org/abs/2410.05295"],seen:2024},
  "Best-of-N (BoN) Jailbreaking":{origin:["Hughes et al. (arXiv:2412.03556)","https://arxiv.org/abs/2412.03556"],promptfoo:"best-of-n",strongreject:"bon",seen:2024},
  "BEAST (BEAm Search-based adversarial attack)":{origin:["Sadasivan et al. (arXiv:2402.15570)","https://arxiv.org/abs/2402.15570"],seen:2024},
  "ReNeLLM (nested prompt rewriting)":{origin:["Ding et al. (arXiv:2311.08268)","https://arxiv.org/abs/2311.08268"],strongreject:"renellm",seen:2023},
  "COLD-Attack":{origin:["Guo et al. (arXiv:2402.08679)","https://arxiv.org/abs/2402.08679"],seen:2024},
  "AmpleGCG":{origin:["Liao & Sun (arXiv:2404.07921)","https://arxiv.org/abs/2404.07921"],seen:2024},
  "AdvPrompter":{origin:["Paulus et al. (arXiv:2404.16873)","https://arxiv.org/abs/2404.16873"],seen:2024},
  "AutoPrompt":{origin:["Shin et al. (arXiv:2010.15980)","https://arxiv.org/abs/2010.15980"],atlas:"AML.T0043.000",seen:2020},
  "PGD for LLMs (Projected Gradient Descent)":{atlas:"AML.T0043.000",cwe:"CWE-1039"},
  "GOAT (Generative Offensive Agent Tester)":{origin:["Meta (arXiv:2410.01606)","https://arxiv.org/abs/2410.01606"],garak:"goat",promptfoo:"goat",seen:2024},
  "Rainbow Teaming (quality-diversity search)":{origin:["Samvelyan et al. (arXiv:2402.16822)","https://arxiv.org/abs/2402.16822"],seen:2024},
  "Indirect Prompt Injection via Retrieved Content":{origin:["Greshake et al. (arXiv:2302.12173)","https://arxiv.org/abs/2302.12173"],garak:"latentinjection",atlas:"AML.T0051.001",seen:2023},
  "RAG Knowledge-Base Poisoning (PoisonedRAG)":{origin:["Zou et al. (arXiv:2402.07867)","https://arxiv.org/abs/2402.07867"],atlas:"AML.T0070",seen:2024},
  "MCP Tool-Description / Manifest Poisoning":{origin:["Invariant Labs","https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks"],seen:2025},
  "MCP Rug-Pull (Deferred Tool Redefinition)":{origin:["Invariant Labs","https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks"],seen:2025},
  "Confused-Deputy in LLM Agents":{owasp:"LLM06"},
  "Cross-Plugin Request Forgery (CPRF)":{owasp:"LLM06"},
  "Tool-Result Poisoning (Injection via Tool Output)":{atlas:"AML.T0053"},
  "Autonomous-Agent Goal Hijacking":{owasp:"LLM06",atlas:"AML.T0053"},
  "Rules File Backdoor (coding-agent config injection)":{origin:["Pillar Security","https://www.pillar.security/blog/new-vulnerability-in-github-copilot-and-cursor-how-hackers-can-weaponize-code-agents"],atlas:"AML.T0051.001",seen:2025},
  "Multi-Agent Prompt Infection (AI worm / Morris II)":{origin:["Cohen et al., Morris II (arXiv:2403.02817)","https://arxiv.org/abs/2403.02817"],atlas:"AML.T0061",seen:2024},
  "JudgeDeceiver (LLM-as-judge injection)":{origin:["Shi et al. (arXiv:2403.17710)","https://arxiv.org/abs/2403.17710"],seen:2024},
  "Agent-Environment Injection (pop-ups / hidden DOM)":{origin:["Zhang et al. (arXiv:2411.02391)","https://arxiv.org/abs/2411.02391"],seen:2024},
  "Zero-Click Exfiltration via Markdown Image Rendering":{origin:["Rehberger, Embrace The Red","https://embracethered.com/blog/posts/2025/sneaky-bits-and-ascii-smuggler/"],garak:"xss",atlas:"AML.T0067",seen:2023},
  "Hyperlink / URL Exfiltration":{origin:["Willison, prompt-injection series","https://simonwillison.net/series/prompt-injection/"],garak:"xss"},
  "Exfiltration via Tool Calls":{origin:["Willison, the lethal trifecta","https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/"],atlas:"AML.T0025",seen:2025},
  "ASCII / Unicode-Tag Smuggling in Retrieved Content":{origin:["Rehberger, ASCII Smuggling","https://embracethered.com/blog/posts/2025/sneaky-bits-and-ascii-smuggler/"],garak:"smuggling",seen:2024},
  "spAIware (Persistent Memory Exfiltration)":{origin:["Rehberger, spAIware","https://embracethered.com/blog/posts/2025/spaiware-and-chatgpt-command-and-control-via-prompt-injection-zombai/"],seen:2024},
  "ANSI Terminal-Escape Injection (Terminal DiLLMa)":{origin:["Rehberger, Terminal DiLLMa","https://embracethered.com/blog/posts/2024/terminal-dillmas-prompt-injection-ansi-sequences/"],garak:"ansiescape",atlas:"AML.T0067",seen:2024},
  "System-Prompt Leaking / Extraction":{garak:"sysprompt_extraction",atlas:"AML.T0056",owasp:"LLM07"},
  "Prompt Stealing Attacks":{origin:["Sha & Zhang (arXiv:2402.19733)","https://arxiv.org/abs/2402.19733"],seen:2024},
  "Training-Data Extraction via Divergence":{origin:["Nasr et al. (arXiv:2311.17035)","https://arxiv.org/abs/2311.17035"],atlas:"AML.T0024.000",owasp:"LLM02",nist:"Training Data Extraction",seen:2023},
  "Lethal Trifecta Exploitation":{origin:["Willison, the lethal trifecta","https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/"],seen:2025},
  "FigStep (Typographic Image Jailbreak)":{origin:["Gong et al. (arXiv:2311.05608)","https://arxiv.org/abs/2311.05608"],garak:"visual_jailbreak",seen:2023},
  "Visual Adversarial Examples (Universal Image Jailbreak)":{origin:["Qi et al. (arXiv:2306.13213)","https://arxiv.org/abs/2306.13213"],atlas:"AML.T0043",seen:2023},
  "Image-Based Prompt Injection (Text-in-Image)":{garak:"visual_jailbreak"},
  "Adversarial Audio Jailbreaks (AdvWave)":{origin:["Kang et al. (arXiv:2412.08608)","https://arxiv.org/abs/2412.08608"],garak:"audio",seen:2024},
  "Assistant Response Prefilling Attack":{origin:["Andriushchenko et al. (arXiv:2404.02151)","https://arxiv.org/abs/2404.02151"],seen:2024},
  "Generation Exploitation (Decoding-Parameter Sweep)":{origin:["Huang et al. (arXiv:2310.06987)","https://arxiv.org/abs/2310.06987"],seen:2023},
  "Weak-to-Strong Jailbreaking":{origin:["Zhao et al. (arXiv:2401.17256)","https://arxiv.org/abs/2401.17256"],seen:2024},
  "H-CoT (Chain-of-Thought Hijacking)":{origin:["Kuo et al. (arXiv:2502.12893)","https://arxiv.org/abs/2502.12893"],seen:2025},
  "Harmful Fine-Tuning (few-shot safety removal)":{origin:["Qi et al. (arXiv:2310.03693)","https://arxiv.org/abs/2310.03693"],atlas:"AML.T0018",seen:2023},
  "Sleeper Agents (deceptive-alignment backdoor)":{origin:["Hubinger et al., Anthropic (arXiv:2401.05566)","https://arxiv.org/abs/2401.05566"],atlas:"AML.T0018.000",seen:2024},
  "Refusal-Direction Ablation / Abliteration":{origin:["Arditi et al. (arXiv:2406.11717)","https://arxiv.org/abs/2406.11717"],seen:2024},
  "RLHF Preference-Data Poisoning (universal backdoor)":{atlas:"AML.T0020",origin:["Rando & Tramèr (arXiv:2311.14455)","https://arxiv.org/abs/2311.14455"],seen:2023},
  "Instruction-Tuning Data Poisoning":{atlas:"AML.T0020"},
  "AgentPoison (backdoored agent memory / RAG)":{origin:["Chen et al. (arXiv:2407.12784)","https://arxiv.org/abs/2407.12784"],atlas:"AML.T0043.004",seen:2024},
  "MathPrompt (symbolic-math encoding)":{origin:["Bethany et al. (arXiv:2409.11445)","https://arxiv.org/abs/2409.11445"],seen:2024},
  "Adversarial Poetry":{origin:["deepteam (Confident AI)","https://www.trydeepteam.com/docs/red-teaming-adversarial-attacks"],seen:2025},
  "Multilingual / low-resource pivot":{strongreject:"translation",origin:["Yong et al. (arXiv:2310.02446)","https://arxiv.org/abs/2310.02446"],seen:2023},
  "Past-tense & syntax reformulation":{garak:"phrasing",origin:["Andriushchenko & Flammarion (arXiv:2407.11969)","https://arxiv.org/abs/2407.11969"],seen:2024}
};
/* technique -> benchmarks that REGISTER it (verified against each benchmark's
   attack list; methods absent from all of them carry no entry, not a guess) */
const XW_BENCH = {
  "GCG, adversarial suffix":["HarmBench","StrongREJECT","JailbreakBench","AdvBench"],
  "PAIR (Prompt Automatic Iterative Refinement)":["HarmBench","StrongREJECT","JailbreakBench"],
  "TAP (Tree of Attacks with Pruning)":["HarmBench"],
  "AutoDAN (genetic-algorithm prompt fuzzing)":["HarmBench"],
  "AutoPrompt":["HarmBench"],
  "GBDA (Gradient-based Distributional Attack)":["HarmBench"],
  "Persuasive Adversarial Prompts (PAP)":["HarmBench","StrongREJECT"],
  "Authority Endorsement":["StrongREJECT"],
  "Evidence-Based Persuasion":["StrongREJECT"],
  "Logical Appeal":["StrongREJECT"],
  "Misrepresentation / False Pretext":["StrongREJECT"],
  "Best-of-N (BoN) Jailbreaking":["StrongREJECT"],
  "ReNeLLM (nested prompt rewriting)":["StrongREJECT"],
  "Payload Splitting (Kang et al.)":["StrongREJECT","HackAPrompt"],
  "Prefix Injection":["StrongREJECT","HackAPrompt"],
  "Refusal suppression & length forcing":["StrongREJECT","HackAPrompt"],
  "Style Injection":["StrongREJECT"],
  "Distractor Instructions":["StrongREJECT"],
  "Base64 + decode-and-execute":["StrongREJECT"],
  "Classical ciphers (ROT13 / Caesar / Atbash)":["StrongREJECT"],
  "Adversarial Poetry":["StrongREJECT"],
  "Multilingual / low-resource pivot":["StrongREJECT"],
  "DAN (Do Anything Now)":["In-the-Wild","JailbreakBench","StrongREJECT","HarmBench"],
  "Persona / DAN / authority framing":["In-the-Wild","HarmBench"],
  "AIM (Always Intelligent and Machiavellian)":["StrongREJECT","In-the-Wild"],
  "Developer Mode":["StrongREJECT","In-the-Wild"],
  "STAN (Strive To Avoid Norms)":["In-the-Wild"],
  "DUDE":["In-the-Wild"],
  "Indirect Prompt Injection via Retrieved Content":["AgentDojo","InjecAgent","Gray Swan"],
  "Tool-Result Poisoning (Injection via Tool Output)":["AgentDojo","InjecAgent"],
  "Autonomous-Agent Goal Hijacking":["AgentDojo","InjecAgent"],
  "System-Prompt Leaking / Extraction":["TensorTrust","HackAPrompt"]
};
function xwData(t){
  if(t.cat==="defense") return null;
  const base=XW_CAT[t.cat]; if(!base) return null;
  const d=Object.assign({},base,XW_TECH[t.title]||{});
  if(XW_BENCH[t.title]) d.bench=XW_BENCH[t.title];
  return d;
}
function xwHtml(t){
  const d=xwData(t); if(!d) return "";
  const b=[];
  if(d.owasp) b.push(`<a class="xw-b owasp" title="OWASP ${esc(d.owasp)}: ${esc(XW_OWASP[d.owasp]||"")} (2025)" href="https://genai.owasp.org/llm-top-10/" target="_blank" rel="noopener">${esc(d.owasp)}</a>`);
  if(d.atlas){const base=d.atlas.split(".").slice(0,2).join(".");b.push(`<a class="xw-b atlas" title="MITRE ATLAS" href="https://atlas.mitre.org/techniques/${esc(base)}" target="_blank" rel="noopener">${esc(d.atlas)}</a>`);}
  if(d.nist) b.push(`<span class="xw-b nist" title="NIST AI 100-2e2025">${esc(d.nist)}</span>`);
  if(d.cwe){const n=d.cwe.replace("CWE-","");b.push(`<a class="xw-b cwe" title="MITRE CWE 4.20" href="https://cwe.mitre.org/data/definitions/${esc(n)}.html" target="_blank" rel="noopener">${esc(d.cwe)}</a>`);}
  const tools=[];
  ["garak","promptfoo","pyrit","strongreject"].forEach(k=>{if(d[k])tools.push(`<a class="xw-chip" href="${safeUrl(XW_TOOLURL[k])}" target="_blank" rel="noopener"><b>${esc(k)}</b> ${esc(d[k])}</a>`);});
  const origin=d.origin?`<a class="xw-origin" href="${safeUrl(d.origin[1])}" target="_blank" rel="noopener">${esc(d.origin[0])}</a>`:"";
  const seen=d.seen?`<span class="xw-seen">first seen ${esc(String(d.seen))}</span>`:"";
  let h=`<div class="row xwalk"><span class="k">Crosswalk</span><div class="xw">`;
  h+=`<div class="xw-line"><span class="xw-lbl">Maps to</span><span class="xw-badges">${b.join("")}</span></div>`;
  if(tools.length) h+=`<div class="xw-line"><span class="xw-lbl">Test with</span><span class="xw-tools">${tools.join("")}</span></div>`;
  if(d.bench&&d.bench.length){const bc=d.bench.map(n=>`<a class="xw-bench-chip" href="${safeUrl(XW_BENCHURL[n]||"#")}" target="_blank" rel="noopener">${esc(n)}</a>`).join("");h+=`<div class="xw-line"><span class="xw-lbl">Benchmarked in</span><span class="xw-bench">${bc}</span></div>`;}
  if(origin||seen) h+=`<div class="xw-line"><span class="xw-lbl">Origin</span><span class="xw-orig">${origin}${origin&&seen?' &middot; ':''}${seen}</span></div>`;
  h+=`</div></div>`;
  return h;
}
function xwSearch(t){
  const d=xwData(t); if(!d) return "";
  return [d.owasp,d.atlas,d.nist,d.cwe,d.bench&&d.bench.join(" "),d.garak&&"garak "+d.garak,d.promptfoo&&"promptfoo "+d.promptfoo,d.pyrit&&"pyrit "+d.pyrit,d.strongreject&&"strongreject "+d.strongreject,d.origin&&d.origin[0]].filter(Boolean).join(" ").toLowerCase();
}
