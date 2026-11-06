#!/bin/sh
# Sestavi paket za peko na j-jevem prenosniku (Windows, Nvidia RTX) v <mapa>: peci.bat, NAVODILO.txt (CRLF),
# organi.txt (obstoječega ne prepiše) in koda/ (rtx.py, viri.json, peci.py, peka.py, izvozi-organe.py in vsi
# moduli scripts/atlas/, ki jih uvozi). Mape vhodi/, izhod/, blender/ na prenosniku ostanejo.
# Zagon: sh scripts/atlas/rtx/paket.sh <mapa> [organ …]   (organi gredo v organi.txt, sicer ostane, kar je)
# koda/ in koda-nova/ dobita manifest.json (različica = RAZLICICA ali git commit, SHA-256 vsake datoteke): rtx.py v
# načinu čakanja izvaja samo kodo, ki ustreza manifestu; posodobitev na prenosniku = koda-nova/ + naloga.txt z »koda«.
set -e
TU=$(cd "$(dirname "$0")" && pwd); ATLAS=$(dirname "$TU")
CILJ=${1:?Uporaba: paket.sh <mapa> [organ …]}; shift
rm -rf "$CILJ/koda"; mkdir -p "$CILJ/koda"
crlf() { sed 's/\r$//; s/$/\r/' "$1" > "$2"; }
crlf "$TU/peci.bat" "$CILJ/peci.bat"
crlf "$TU/NAVODILO.txt" "$CILJ/NAVODILO.txt"
cp "$TU/rtx.py" "$TU/viri.json" "$ATLAS/peci.py" "$ATLAS/peka.py" "$ATLAS/izvozi-organe.py" "$CILJ/koda/"
# vsi lokalni moduli, ki jih koda uvozi, prehodno in tudi znotraj funkcij (»    from srce_geometrija import …«):
# ponavljamo, dokler se seznam ne neha večati
while :; do
  pred=$(ls "$CILJ/koda" | wc -l)
  for m in $(sed -n 's/^[[:space:]]*\(from\|import\) \([a-z_]*\).*/\2/p' "$CILJ"/koda/*.py | sort -u); do
    [ -f "$ATLAS/$m.py" ] && [ ! -f "$CILJ/koda/$m.py" ] && cp "$ATLAS/$m.py" "$CILJ/koda/"
  done
  [ "$(ls "$CILJ/koda" | wc -l)" -eq "$pred" ] && break
done
RAZL=${RAZLICICA:-$(git -C "$ATLAS" rev-parse --short HEAD 2>/dev/null || echo r)$(git -C "$ATLAS" diff --quiet HEAD -- . 2>/dev/null || echo -s)}
python3 - "$CILJ/koda" "$RAZL" <<'EOF'
import hashlib, json, os, sys
mapa, razl = sys.argv[1:]
dat = {f: hashlib.sha256(open(os.path.join(mapa, f), "rb").read()).hexdigest() for f in sorted(os.listdir(mapa)) if f != "manifest.json"}
json.dump({"razlicica": razl, "datoteke": dat}, open(os.path.join(mapa, "manifest.json"), "w"), indent=1)
EOF
rm -rf "$CILJ/koda-nova"; cp -r "$CILJ/koda" "$CILJ/koda-nova"
echo "različica kode: $RAZL (veja $(git -C "$ATLAS" rev-parse --abbrev-ref HEAD 2>/dev/null))"
if [ $# -gt 0 ]; then
  { printf '# Organi za peko, en na vrstico (zapiše Claude).\r\n'; for o in "$@"; do printf '%s\r\n' "$o"; done; } > "$CILJ/organi.txt"
elif [ ! -f "$CILJ/organi.txt" ]; then
  printf '# Organi za peko, en na vrstico (zapiše Claude). Prazno: peci.bat vpraša.\r\n' > "$CILJ/organi.txt"
fi
ls -la "$CILJ" "$CILJ/koda"
