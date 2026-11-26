#!/bin/sh
# K-04: lažni »python«, ki se zažene (ready) in se ob prvi zahtevi sesuje (izhod 1, brez odgovora).
echo '{"ready":true}'
read -r vrstica
[ -n "$EVKLID_K04_DNEVNIK" ] && echo zahteva >> "$EVKLID_K04_DNEVNIK"
exit 1
