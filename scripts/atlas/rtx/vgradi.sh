#!/usr/bin/env bash
# Vgradi spečene organe z j-jevega prenosnika (izhod/<organ>-<id>/) v public/3d/modeli/organi-3d/ (videz, j 10. 11.).
# Zagon (v korenu repozitorija): scripts/atlas/rtx/vgradi.sh <mapa izhod> <id naloge> <organ …>
#   npr. scripts/atlas/rtx/vgradi.sh /mnt/user-data/uploads/peka-rtx/izhod vz1 mozgani pljuca jetra ledvica oko srce
# Prenos v oblak naredi Claude z orodjem device_stage_files (ena mapa na organ; samo te datoteke, ne .delo.blend in PNG):
#   izhod\<organ>-<id>\{GOTOVO.txt, <organ>.peka.log, <organ>.glb, <organ>-telefon.glb, <organ>.vozlisca.json}
#   srce še izhod\srce-<id>\srce-volumen.png.
# Za vsak organ: preveri GOTOVO.txt, organi.mjs (dedup, kvantizacija, WebP po lestvici kakovosti do meje 6 MB / 1,9 MB),
# v <organ>.json vklopi »pbr« (prava osnovna barva iz peke, ORM, studio) in pri očesu izklopi teksture prozornih in s
# senčilnikom risanih tkiv; izpiše velikosti. Organ brez GOTOVO.txt preskoči (sedanji videz ostane).
set -euo pipefail
[ $# -ge 3 ] || { echo "Uporaba: $0 <mapa izhod> <id> <organ …>" >&2; exit 1; }
IZHOD=$1; ID=$2; shift 2
KOREN=$(cd "$(dirname "$0")/../../.." && pwd)
cd "$KOREN"
narejeni=()
for o in "$@"; do
  [[ "$o" =~ ^[a-z0-9-]+$ ]] || { echo "neveljavno ime: $o" >&2; exit 1; }
  m="$IZHOD/$o-$ID"
  if [ ! -f "$m/GOTOVO.txt" ]; then echo "$o: ni spečen (ni $m/GOTOVO.txt), preskočim"; continue; fi
  for f in "$o.glb" "$o-telefon.glb" "$o.vozlisca.json"; do [ -f "$m/$f" ] || { echo "$o: manjka $f" >&2; exit 1; }; done
  node scripts/atlas/organi.mjs "$m" "$o"
  node -e '
    const fs = require("fs"); const [pot, organ] = process.argv.slice(1);
    const j = JSON.parse(fs.readFileSync(pot, "utf8"));
    j.pbr = true;
    // oko: prozorna (roženica, leča, steklovina) in s senčilnikom risana tkiva (šarenica, mrežnica) brez pečene barve
    const brez = organ === "oko" ? ["roženica", "leča", "steklovina", "šarenica", "mrežnica"] : [];
    for (const t of brez) if (j.tkiva?.[t]) j.tkiva[t].tekstura = false;
    fs.writeFileSync(pot, JSON.stringify(j, null, 1) + "\n");
  ' "public/3d/modeli/organi-3d/$o.json" "$o"
  narejeni+=("$o")
done
echo "vgrajeni: ${narejeni[*]:-(nič)}"
for o in "${narejeni[@]}"; do
  for p in "" "-telefon"; do
    printf '%s%s.glb: %s B\n' "$o" "$p" "$(stat -c %s "public/3d/modeli/organi-3d/$o$p.glb")"
  done
done
[ ${#narejeni[@]} -eq 0 ] || node --disable-warning=ExperimentalWarning --test test/3d-organi-glb.test.js
