#!/bin/bash
# Izriše vse ikone vej drevesa »3D svet« v vseh slogih in jih pretvori v public/3d/ikone-drevo/<slog>/<id>.webp.
#   BLENDER=<pot do blenderja> scripts/3d-ikone-drevo/izrisi.sh [slogi, privzeto vsi] [vzorci, privzeto 112]
# Že izrisane ikone preskoči (--preskoci), zato ga lahko po prekinitvi samo poženeš znova.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
SLOGI=${1:-cist,antik,renesansa,bagdad,indija,egipt}
VZORCI=${2:-112}
DELO=${IKONE_DELO:-$ROOT/.ikone-drevo}
mkdir -p "$DELO/telo"
for f in koza okostje organi zile; do
  [ -f "$DELO/telo/$f.glb" ] || npx -y @gltf-transform/cli@4.1.1 copy "$ROOT/public/3d/modeli/telo/$f.glb" "$DELO/telo/$f.glb"
done
export IKONE_GLB="$ROOT/public/3d/modeli" IKONE_TELO="$DELO/telo"
"${BLENDER:-blender}" -b -P "$ROOT/scripts/3d-ikone-drevo/ikone.py" -- --slog "$SLOGI" --izhod "$DELO/png" \
  --vzorci "$VZORCI" --velikost 640 --preskoci
for s in ${SLOGI//,/ }; do
  python3 "$ROOT/scripts/3d-ikone-drevo/v-webp.py" "$DELO/png/$s" "$ROOT/public/3d/ikone-drevo/$s"
done
