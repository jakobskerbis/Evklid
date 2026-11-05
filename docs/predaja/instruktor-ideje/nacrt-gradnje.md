# Načrt gradnje: posebni inštruktor (j izbral 4 Nov 14:27)

Izbira (artifact https://claude.ai/artifact/1CkGziSWgrntTLdygMoqGw, db izbira/ideje): 1, 2, 3, 4, 6, 7, 8, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 24, 25, 26, 27, 30.
Seznam idej: 30-idej.md v tej mapi.

Ključno: inštruktor danes ne more odpreti orodij aplikacije. Obstajajo pa vstopi: public/laboratorij.js openLabExperiment(key), public/uci-se.js open3d(id), public/graph/plot.js, igre (public/games), Naše pole (server/our-papers.js), učbenik. Strojni bloki se razčlenijo v server/meta.js (KARTICA, IZBIRE), prikaz v public/app.js ~1983.

## Paketi (vsak svoj PR, trojni pregled; spremembe prompta čakajo na j)
A. Inštruktor odpre orodja: 1 poskus z vrednostmi, 4 del v 3D, 6 povezave med predmeti v 3D, 7 graf v klepetu, 11 skica, 21 naloge NPZ/mature na temo, 25 povezava na učbenik in formulo, 26 igra za temo. En mehanizem: orodje za iskanje vsebine + blok <<ODPRI …>> (gumb/vdelava pod odgovorom).
B. Skupaj v Laboratoriju: 2 inštruktor vidi stanje poskusa in vodi, 3 napovej-opazuj-razloži. Gradi na A.
C. Pravilnost in diagnostika: 8 preverjanje računov z lastnim rešilnikom (public/scan/verify.js), 14 vzorec napačnega razumevanja → 3 naloge, 15 lestvica gotovosti, 19 namerna napaka.
D. Pozna učenca: 12 spomin čez pogovore, 13 načrt pred testom + vprašanje po testu (urnik), 16 naloge po interesih (public/interests.js).
E. Novi načini in ljudje: 20 izpitna simulacija, 22 naloga iz fotografije resničnega sveta, 24 glasovni pogovor (server/govor.js), 27 tedenski izziv za ligo, 30 učiteljeva pravila.

Vrstni red: A → C → D → B → E.
