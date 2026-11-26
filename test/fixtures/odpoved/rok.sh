#!/bin/sh
# K-04: lažni »python«, ki se zažene (ready), nato ne odgovori nikoli (zataknjen SymPy; strežnik ga ubije ob roku).
echo '{"ready":true}'
exec sleep 100000
