#!/bin/sh
# Stisne surove GLB iz izvozi-z-anatomy.py za splet (meshopt + kvantizacija, brez združevanja struktur).
# Zagon: sh scripts/atlas/stisni.sh <surova mapa> <public/atlas/modeli>
# Orodje: @gltf-transform/cli (MIT), samo za pripravo, ni odvisnost aplikacije.
set -e
src="$1"; dst="$2"; mkdir -p "$dst"
for f in "$src"/*.glb; do
  n=$(basename "$f")
  npx --yes @gltf-transform/cli@4 dedup "$f" /tmp/atlas-$n
  npx --yes @gltf-transform/cli@4 meshopt /tmp/atlas-$n "$dst/$n" --level medium
  rm -f /tmp/atlas-$n
done
ls -la "$dst"
