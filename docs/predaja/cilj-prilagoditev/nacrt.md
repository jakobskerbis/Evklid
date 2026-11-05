# Evklid se prilagodi cilju učenca – načrt (1. 11. 2026)

Gradnja šele po ponastavitvi v sredo, 4. 11. Ena aplikacija, enak videz in barve na spletu in telefonu. Spremeni se le, kaj je na domačem zaslonu in v kakšnem vrstnem redu.

## Kaj že obstaja
Evklid ob novem profilu že vpraša za cilj (`public/goal-data.js`): sprotno učenje, test, NPZ (OŠ), matura (SŠ), tekmovanje, izpit (faks). Cilj se spremeni v Nastavitvah. Zdaj vpliva le na odštevanje do datuma, opomnik in inštruktorja. Na izgled domačega zaslona še ne vpliva.

## Kaj dodamo (en PR, splet + aplikacija skupaj)
1. **Vrstni red domačega zaslona po cilju** (ena tabela v `goal-data.js`, brez novih zaslonov):
   - Sprotno / test (OŠ): Učna pot, pomoč pri domači nalogi (Skeniraj), Igre, Laboratorij.
   - NPZ / matura: Pripravljenost in pretekle pole, poskusni izpit s časom, Učna pot.
   - Tekmovanje: Tekmovalni trening, pretekle tekmovalne pole, poskusno tekmovanje s časom, težje naloge.
   - Izpit (faks): Učbenik predmeta, naloge po poglavjih, poskusni izpit.
2. **Težavnost vaj**: pri cilju tekmovanje Učna pot privzeto ponudi težjo različico naloge.
3. **Nič se ne skrije**: vse ostalo ostane dosegljivo v meniju in na zavihku Jaz.
4. **Test**: za vsak cilj preveri vrstni red razdelkov; ročni pregled na telefonu in računalniku.

## Usklajevanje
Igre, laboratorij in tekmovanja gradijo svoje niti; ta nit spreminja le vrstni red in poudarek, ne njihove vsebine. Cena paketa se ne spreminja glede na cilj.

## Ocena
Majhna sprememba, približno 8–12 $ (en PR, trojni pregled po `docs/pregled.md`).
