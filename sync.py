#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""sync.py — keep the field guide's derived files in lockstep with index.html.

index.html's `const CATS` / `const T` are hand-edited and are the single source of
truth. Running this regenerates everything downstream so nothing drifts:

  - field-guide.json  : the structured dataset (what agents/tools consume)
  - field-guide.md    : a plain-text Markdown digest of every technique
  - inside index.html : the <script type=application/ld+json>, the <noscript>
                        fallback, and the twitter:description meta (their counts)

It never touches const CATS / const T themselves.

Usage:
  python sync.py            regenerate and write (the normal case, run after editing)
  python sync.py --check    verify everything is in sync; exit 1 if not (no writes)
"""
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(HERE, "index.html")
JSON = os.path.join(HERE, "field-guide.json")
MD   = os.path.join(HERE, "field-guide.md")

ABSTRACT = ("A mechanism-first field reference to LLM prompt-injection and jailbreak "
    "techniques. Each entry states what the technique is, why it slips past safety "
    "training, a harmless canonical example, and the detection or defense that "
    "neutralises it. For authorised red-teaming, security research and detector work.")

# fields the render uses unguarded (a card breaks without them); why/example/refs/
# reading/internals/math/langs/field are optional (the render guards them).
REQUIRED = ("cat", "fam", "title", "what", "defense")


# ---------------------------------------------------------------- read + validate
def read_html():
    return io.open(HTML, encoding="utf-8").read()

def extract(html, name):
    key = "const %s = " % name
    s = html.find(key)
    if s == -1:
        sys.exit("sync.py: could not find `const %s =` in index.html" % name)
    s += len(key)
    e = html.find("\n];", s)
    if e == -1:
        sys.exit("sync.py: could not find the end (`\\n];`) of `const %s`" % name)
    try:
        return json.loads(html[s:e + 2])
    except Exception as ex:
        sys.exit("sync.py: `const %s` is not valid JSON — fix the syntax first.\n  %s" % (name, ex))

def validate(cats, techs):
    errs = []
    cat_ids = {c["id"] for c in cats}
    for c in cats:
        for k in ("id", "label", "group", "blurb"):
            if not c.get(k):
                errs.append("category %r missing %s" % (c.get("id", "?"), k))
    seen = set()
    for t in techs:
        title = t.get("title", "?")
        for k in REQUIRED:
            if k not in t:
                errs.append("technique %r missing required field %r" % (title, k))
        ex = t.get("example")  # optional, but if present must have in/out
        if ex is not None and not (isinstance(ex, dict) and "in" in ex and "out" in ex):
            errs.append("technique %r has an example but it is missing in/out" % title)
        if t.get("cat") not in cat_ids:
            errs.append("technique %r has unknown category %r" % (title, t.get("cat")))
        if title in seen:
            errs.append("duplicate technique title: %r" % title)
        seen.add(title)
        for field in ("refs", "reading"):
            for r in t.get(field, []) or []:
                if not (isinstance(r, list) and len(r) == 2):
                    errs.append("technique %r has a malformed %s entry: %r" % (title, field, r))
    return errs


# ---------------------------------------------------------------- builders
def _refline(pairs):
    out = []
    for r in pairs or []:
        label, url = r[0], (r[1] if len(r) > 1 else "")
        out.append(("[%s](%s)" % (label, url)) if url and url != "internal" else label)
    return " · ".join(out)

def build_json(cats, techs):
    return json.dumps({"categories": cats, "techniques": techs}, indent=1, ensure_ascii=False)

def build_md(cats, techs, by_cat):
    ncat, ntech = len(cats), len(techs)
    md = []
    md.append("<!-- generated from index.html by sync.py — do not edit; edit index.html -->\n")
    md.append("# Neural Net Dark Alchemy — LLM Prompt Injection & Jailbreak Field Guide\n")
    md.append("> " + ABSTRACT + "\n")
    md.append("**%d techniques across %d categories.** Machine-readable JSON: "
              "[`field-guide.json`](field-guide.json). Interactive page: `index.html`.\n" % (ntech, ncat))
    md.append("Every entry carries a **Detection / Defense**. Examples use harmless "
              "`I HAVE BEEN PWNED` / `<DISALLOWED_REQUEST>` placeholders, never operational content.\n")
    md.append("\n## Contents\n")
    for c in cats:
        n = len(by_cat.get(c["id"], []))
        md.append("- [%s](#%s) — %d technique%s" % (c["label"], c["id"], n, "s" if n != 1 else ""))
    md.append("")
    for c in cats:
        md.append('\n<a id="%s"></a>\n' % c["id"])
        md.append("## %s" % c["label"])
        md.append("*%s* — %s\n" % (c.get("group", ""), c.get("blurb", "")))
        for t in by_cat.get(c["id"], []):
            md.append("### %s  `%s`" % (t["title"], t.get("fam", "")))
            md.append("- **What:** %s" % t["what"])
            md.append("- **Why it works:** %s" % t["why"])
            if t.get("internals"):
                md.append("- **Model internals:** %s" % t["internals"])
            ex = t.get("example") or {}
            if ex.get("in") or ex.get("out"):
                md.append("- **Example:** _in:_ %s  →  _out:_ %s" % (ex.get("in", ""), ex.get("out", "")))
            md.append("- **Detection / Defense:** %s" % t["defense"])
            if t.get("refs"):
                md.append("- **Sources:** %s" % _refline(t["refs"]))
            if t.get("reading"):
                md.append("- **Go deeper:** %s" % _refline(t["reading"]))
            md.append("")
    return "\n".join(md)

def build_ldjson(cats, techs):
    ncat, ntech = len(cats), len(techs)
    kw = ["prompt injection", "LLM jailbreak", "AI red teaming", "adversarial machine learning",
          "LLM security", "indirect prompt injection", "agent security"] + [c["label"] for c in cats]
    ld = {
        "@context": "https://schema.org", "@type": "TechArticle",
        "headline": "Neural Net Dark Alchemy — LLM Prompt Injection & Jailbreak Field Guide",
        "description": ABSTRACT, "inLanguage": "en",
        "author": {"@type": "Person", "name": "SamsonCyber"},
        "url": "https://samsoncyber.github.io/llm-injection-field-guide/", "keywords": kw,
        "about": [{"@type": "Thing", "name": "Prompt injection"},
                  {"@type": "Thing", "name": "LLM jailbreaking"},
                  {"@type": "Thing", "name": "Adversarial machine learning"}],
        "hasPart": {"@type": "Dataset", "name": "LLM injection & jailbreak technique catalog",
            "description": "%d documented techniques across %d attack-layer categories, each with mechanism, canonical example and defense." % (ntech, ncat),
            "keywords": [c["label"] for c in cats],
            "distribution": {"@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": "field-guide.json"},
            "isAccessibleForFree": True},
    }
    return '<script type="application/ld+json">\n' + json.dumps(ld, ensure_ascii=False, indent=1) + '\n</script>'

def _hesc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def _links(pairs):
    out = []
    for r in pairs or []:
        label, url = _hesc(r[0]), (r[1] if len(r) > 1 else "")
        out.append('<a href="%s">%s</a>' % (_hesc(url), label) if url and url != "internal" else label)
    return " · ".join(out)

def build_noscript(cats, techs, by_cat):
    """Full zero-JS rendering of every technique inside <noscript> (browsers ignore it when
       JS runs, so the interactive page is unaffected). A single fetch of index.html therefore
       contains the entire guide with no JavaScript required."""
    ncat, ntech = len(cats), len(techs)
    p = ['<noscript>']
    p.append('<style>#ns{max-width:82ch;margin:40px auto;padding:0 22px;'
             'font-family:Georgia,"Times New Roman",serif;line-height:1.55}'
             '#ns h2{margin:2.2em 0 .2em;border-bottom:1px solid var(--edge);padding-bottom:.2em}'
             '#ns h3{margin:1.4em 0 .25em}#ns p{margin:.35em 0}'
             '#ns .m{color:var(--ink-3);font-size:.85em}#ns .lbl{color:var(--gold);font-weight:600}'
             '#ns a{color:var(--ref)}</style>')
    p.append('<div id="ns">')
    p.append('<h1>Neural Net Dark Alchemy</h1>')
    p.append('<p>A field reference of <b>%d LLM prompt-injection and jailbreak techniques</b> '
             'across <b>%d categories</b>. This is the no-JavaScript view (the interactive catalog, '
             'search and filters need JS). Machine-readable: '
             '<a href="field-guide.json">field-guide.json</a> &middot; '
             '<a href="field-guide.md">field-guide.md</a>.</p>' % (ntech, ncat))
    p.append('<p class="m">Jump to: ' + ", ".join(
        '<a href="#ns-%s">%s</a> (%d)' % (c["id"], _hesc(c["label"]), len(by_cat.get(c["id"], []))) for c in cats) + '.</p>')
    for c in cats:
        items = by_cat.get(c["id"], [])
        p.append('<h2 id="ns-%s">%s <span class="m">%s &middot; %d</span></h2>' % (
            c["id"], _hesc(c["label"]), _hesc(c.get("group", "")), len(items)))
        if c.get("blurb"):
            p.append('<p class="m">%s</p>' % _hesc(c["blurb"]))
        for t in items:
            p.append('<h3>%s <span class="m">[%s]</span></h3>' % (_hesc(t["title"]), _hesc(t.get("fam", ""))))
            p.append('<p><span class="lbl">What.</span> %s</p>' % _hesc(t["what"]))
            if t.get("why"):
                p.append('<p><span class="lbl">Why it works.</span> %s</p>' % _hesc(t["why"]))
            if t.get("internals"):
                p.append('<p><span class="lbl">Model internals.</span> %s</p>' % _hesc(t["internals"]))
            ex = t.get("example") or {}
            if ex.get("in") or ex.get("out"):
                p.append('<p><span class="lbl">Example.</span> <i>in:</i> %s &nbsp;&rarr;&nbsp; <i>out:</i> %s</p>' % (
                    _hesc(ex.get("in", "")), _hesc(ex.get("out", ""))))
            p.append('<p><span class="lbl">Detection / Defense.</span> %s</p>' % _hesc(t["defense"]))
            if t.get("refs"):
                p.append('<p class="m"><b>Sources:</b> %s</p>' % _links(t["refs"]))
            if t.get("reading"):
                p.append('<p class="m"><b>Go deeper:</b> %s</p>' % _links(t["reading"]))
    p.append('</div>')
    p.append('</noscript>')
    return "\n".join(p)

def build_twitter(ntech):
    return ('<meta name="twitter:description" content="' + str(ntech) +
            '+ LLM prompt-injection and jailbreak techniques, each with mechanism, example and defense. Machine-readable dataset at field-guide.json.">')


# ---------------------------------------------------------------- html refresh
def refresh_html(html, cats, techs, by_cat):
    ntech = len(techs)
    ld, ns, tw = build_ldjson(cats, techs), build_noscript(cats, techs, by_cat), build_twitter(ntech)

    if re.search(r'<script type="application/ld\+json">.*?</script>', html, re.S):
        html = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda m: ld, html, count=1, flags=re.S)
    else:  # bootstrap after twitter:card
        html = html.replace('<meta name="twitter:card" content="summary_large_image">\n',
                            '<meta name="twitter:card" content="summary_large_image">\n' + ld + '\n', 1)

    if "<noscript>" in html:
        html = re.sub(r'<noscript>.*?</noscript>', lambda m: ns, html, count=1, flags=re.S)
    else:  # bootstrap after <body>
        bi = html.find("<body>") + len("<body>")
        html = html[:bi] + "\n" + ns + "\n" + html[bi:]

    if re.search(r'<meta name="twitter:description"[^>]*>', html):
        html = re.sub(r'<meta name="twitter:description"[^>]*>', lambda m: tw, html, count=1)
    return html


# ---------------------------------------------------------------- main
def main():
    check = "--check" in sys.argv[1:]
    html = read_html()
    cats, techs = extract(html, "CATS"), extract(html, "T")

    errs = validate(cats, techs)
    if errs:
        print("sync.py: %d validation error(s) in index.html — nothing written:" % len(errs))
        for e in errs[:40]:
            print("  -", e)
        sys.exit(1)

    by_cat = {}
    for t in techs:
        by_cat.setdefault(t["cat"], []).append(t)

    new_json = build_json(cats, techs)
    new_md   = build_md(cats, techs, by_cat)
    new_html = refresh_html(html, cats, techs, by_cat)

    if check:
        stale = []
        try:
            cur = json.load(io.open(JSON, encoding="utf-8"))
            if cur != {"categories": cats, "techniques": techs}:
                stale.append("field-guide.json")
        except Exception:
            stale.append("field-guide.json")
        if (not os.path.exists(MD)) or io.open(MD, encoding="utf-8").read() != new_md:
            stale.append("field-guide.md")
        if new_html != html:
            stale.append("index.html (JSON-LD / noscript / twitter counts)")
        if stale:
            print("sync.py --check: OUT OF SYNC -> " + ", ".join(stale))
            print("  run `python sync.py` to regenerate.")
            sys.exit(1)
        print("sync.py --check: in sync (%d categories / %d techniques)" % (len(cats), len(techs)))
        sys.exit(0)

    io.open(JSON, "w", encoding="utf-8", newline="").write(new_json)
    io.open(MD, "w", encoding="utf-8", newline="\n").write(new_md)
    if new_html != html:
        io.open(HTML, "w", encoding="utf-8", newline="").write(new_html)

    print("sync.py: %d categories / %d techniques" % (len(cats), len(techs)))
    print("  field-guide.json  regenerated")
    print("  field-guide.md    regenerated")
    print("  index.html        JSON-LD / noscript / twitter counts refreshed"
          if new_html != html else "  index.html        counts already current")


if __name__ == "__main__":
    main()
