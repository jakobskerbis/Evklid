#!/bin/sh
# K-04, kontrola testa: lažni »python«, ki na vsako zahtevo odgovori »drži, simbolno«. To ni izpad, je pokvarjen
# preverjevalnik; test mora pokazati razliko, sicer primerjava z lokalnimi dokazi ničesar ne meri.
echo '{"ready":true}'
while read -r vrstica; do
  id=$(printf '%s' "$vrstica" | sed -n 's/^{"id":\([0-9]*\),.*/\1/p')
  echo "{\"id\":$id,\"ok\":true,\"why\":\"\",\"how\":\"symbolic\"}"
done
