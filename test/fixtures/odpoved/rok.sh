#!/bin/sh
# K-04: lažni »python«, ki se zažene (ready), nato ne odgovori nikoli (zataknjen SymPy; strežnik ga ubije ob roku).
echo '{"ready":true}'
# zahteva prispe, odgovora ni
read -r vrstica
[ -n "$EVKLID_K04_DNEVNIK" ] && echo zahteva >> "$EVKLID_K04_DNEVNIK"
exec sleep 100000
