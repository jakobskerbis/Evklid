#!/bin/sh
# K-04: lažni »python«, ki se zažene (ready) in se ob prvi zahtevi sesuje (izhod 1, brez odgovora).
echo '{"ready":true}'
read -r vrstica
exit 1
