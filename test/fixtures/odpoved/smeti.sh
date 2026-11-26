#!/bin/sh
# K-04: lažni »python«, ki se zažene (ready), nato na vsako zahtevo vrne nerazumljiv izpis (ne JSON, napačen id).
echo '{"ready":true}'
while read -r vrstica; do
  [ -n "$EVKLID_K04_DNEVNIK" ] && echo zahteva >> "$EVKLID_K04_DNEVNIK"
  echo "Traceback (most recent call last):"
  echo '{"id":-1,"ok":true,"how":"symbolic"}'
done
