# Employer Checker: local development tasks.

port := env("PORT", "8000")
url := "http://localhost:" + port

# List available recipes
default:
    @just --list

# Serve the site from ./public
serve:
    @echo "Serving {{url}} (Ctrl+C to stop)"
    python3 -m http.server {{port}} --bind 127.0.0.1 --directory public

# Serve the site and open it in the default browser
dev query="":
    #!/usr/bin/env bash
    set -euo pipefail
    python3 -m http.server {{port}} --bind 127.0.0.1 --directory public &
    server=$!
    trap 'kill $server 2>/dev/null' EXIT INT TERM
    for _ in $(seq 50); do
        curl -sf -o /dev/null "{{url}}/" && break
        sleep 0.1
    done
    target="{{url}}/"
    if [ -n "{{query}}" ]; then
        target="$target?q=$(python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1]))' "{{query}}")"
    fi
    echo "Opening $target (Ctrl+C to stop)"
    xdg-open "$target" >/dev/null 2>&1 || open "$target" >/dev/null 2>&1 || true
    wait $server

# Regenerate icons and the Open Graph image (requires Pillow)
assets:
    python3 scripts/generate_assets.py

# Validate manifest, JSON-LD and sitemap, and check that referenced local files exist
check:
    #!/usr/bin/env python3
    import json, re, sys, xml.dom.minidom
    from pathlib import Path
    public = Path("public")
    html = (public / "index.html").read_text()
    json.loads((public / "manifest.webmanifest").read_text())
    json.loads(re.search(r'application/ld\+json">(.*?)</script>', html, re.S).group(1))
    xml.dom.minidom.parse(str(public / "sitemap.xml"))
    refs = set(re.findall(r'(?:href|src)="/([^"]+)"', html))
    refs |= {i["src"].lstrip("/") for i in json.loads((public / "manifest.webmanifest").read_text())["icons"]}
    missing = sorted(r for r in refs if not (public / r).is_file())
    if missing:
        sys.exit("Missing files: " + ", ".join(missing))
    if re.search(r"[Ѐ-ӿ]", re.search(r"<title>(.*?)</title>", html).group(1)):
        sys.exit("Cyrillic characters found in <title>")
    print(f"OK: {len(refs)} local references, manifest, JSON-LD and sitemap are valid")
