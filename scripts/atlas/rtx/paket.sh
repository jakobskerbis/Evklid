#!/bin/sh
# Sestavi paket za peko na j-jevem prenosniku (Windows, Nvidia RTX) v <mapa>: peci.bat, NAVODILO.txt (CRLF),
# organi.txt (obstoječega ne prepiše) in koda/ (rtx.py, viri.json, peci.py, peka.py, izvozi-organe.py in vsi
# moduli scripts/atlas/, ki jih uvozi). Mape vhodi/, izhod/, blender/ na prenosniku ostanejo.
# Zagon: sh scripts/atlas/rtx/paket.sh <mapa> [organ …]   (organi gredo v organi.txt, sicer ostane, kar je)
set -e
TU=$(cd "$(dirname "$0")" && pwd); ATLAS=$(dirname "$TU")
CILJ=${1:?Uporaba: paket.sh <mapa> [organ …]}; shift
mkdir -p "$CILJ/koda"
crlf() { sed 's/\r$//; s/$/\r/' "$1" > "$2"; }
crlf "$TU/peci.bat" "$CILJ/peci.bat"
crlf "$TU/NAVODILO.txt" "$CILJ/NAVODILO.txt"
cp "$TU/rtx.py" "$TU/viri.json" "$ATLAS/peci.py" "$ATLAS/peka.py" "$ATLAS/izvozi-organe.py" "$CILJ/koda/"
for m in $(sed -n 's/^\(from\|import\) \([a-z_]*\).*/\2/p' "$ATLAS/izvozi-organe.py" "$ATLAS/peka.py" | sort -u); do
  [ -f "$ATLAS/$m.py" ] && cp "$ATLAS/$m.py" "$CILJ/koda/"
done
if [ $# -gt 0 ]; then
  { printf '# Organi za peko, en na vrstico (zapiše Claude).\r\n'; for o in "$@"; do printf '%s\r\n' "$o"; done; } > "$CILJ/organi.txt"
elif [ ! -f "$CILJ/organi.txt" ]; then
  printf '# Organi za peko, en na vrstico (zapiše Claude). Prazno: peci.bat vpraša.\r\n' > "$CILJ/organi.txt"
fi
ls -la "$CILJ" "$CILJ/koda"
