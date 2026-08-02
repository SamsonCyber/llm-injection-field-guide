# Distribution playbook

Canonical URL baked into `index.html`, `README.md`, and BibTeX:

**https://samsoncyber.github.io/llm-injection-field-guide/**

That URL works only if the repo is owned by **SamsonCyber** and named **exactly `llm-injection-field-guide`**. Change owner or name, update every baked URL first.

---

## 1. Ship the repo + GitHub Pages

```powershell
cd path/to/llm-injection-field-guide

git init
git add -A
git commit -m "Dark Promptery v1.1.0 - 324 techniques, crosswalk, named defenses"

gh repo create SamsonCyber/llm-injection-field-guide `
 --public --source=. --remote=origin --push `
 --description "Mechanism-first field reference to 324 LLM prompt-injection and jailbreak techniques, crosswalked to OWASP/MITRE ATLAS/NIST/CWE."

gh api --method POST repos/SamsonCyber/llm-injection-field-guide/pages `
 -f "source[branch]=main" -f "source[path]=/"
```

If the Pages API fails (first push still settling), use the UI: **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**.

Topics:

```powershell
gh repo edit SamsonCyber/llm-injection-field-guide --add-topic `
 prompt-injection,llm-security,jailbreak,ai-red-teaming,adversarial-ml,owasp-llm,mitre-atlas,security
```

Verify: https://samsoncyber.github.io/llm-injection-field-guide/ (first deploy can take a minute).

## 2. Preview image (before awesome-list PRs)

1. Open the live page. Capture hero + cards with a crosswalk strip.
2. Save as `docs/preview.png`.
3. Add to `index.html` head: 
 `<meta property="og:image" content="https://samsoncyber.github.io/llm-injection-field-guide/docs/preview.png">`
4. Optional README hero: `![Dark Promptery](docs/preview.png)`

## 3. Awesome-list entry line

```markdown
- [Dark Promptery](https://samsoncyber.github.io/llm-injection-field-guide/) - Mechanism-first field reference: 324 prompt-injection and jailbreak techniques, each paired with a defense and cross-walked to OWASP LLM Top 10 / MITRE ATLAS / NIST / CWE plus tool hooks where a public probe exists.
```

Target lists (append under their resource/reference sections):

| List | Section hint |
|------|----------------|
| corca-ai/awesome-llm-security | Other Useful Resources |
| swisskyrepo/PayloadsAllTheThings | Prompt Injection → References |
| PromptLabs/Prompt-Hacking-Resources | Jailbreaks or Blogs |
| wearetyomsmnv/Awesome-LLMSecOps | Study resource |

PR body (one paragraph):

> Adds a browsable, mechanism-first reference of 324 prompt-injection/jailbreak techniques. Each entry has what/why/example/defense/sources and is cross-walked to OWASP LLM Top 10, MITRE ATLAS v5.6.0, NIST AI 100-2e2025 and CWE, with tool hooks (garak/promptfoo/PyRIT/StrongREJECT) and benchmark provenance. Defensive/educational, CC BY 4.0. Live: https://samsoncyber.github.io/llm-injection-field-guide/

## 4. Do not ship

- `runner/` and arena `target-memory-*.json` (engagement artifacts)
- `research-packets/` drafts
- `index.html.bak*` and other backups
- Competitive/gap internal specs listed in `.gitignore`
