# Ročni preizkus na pravih napravah

j, 25. 11. 2026 (zunanji pregled UX/UI): samodejni del je `node scripts/preveri-aplikacijo.cjs --naprave`
(`scripts/posnetki-naprave.cjs`, v GitHub Actions »Posnetki naprav«). Tega, kar Playwright ne zna, ne štejemo
kot preizkušeno, dokler ga nekdo ne preveri na napravi. Rezultat zapiši v tabelo na dnu (datum, naprava, kdo).

Uporabi testni račun, ne računa učenca. Pravih osebnih podatkov ne vpisuj.

## iPhone (Safari) in Android (Chrome)

1. Odpri klepet in tapni v polje: tipkovnica ne prekrije polja in gumba Pošlji; po zaprtju ni praznega pasu.
2. Zavrti napravo v ležečo lego in nazaj: stanje (pogovor, naloga, kalkulator) ostane.
3. Spodnja vrstica in glava ne gresta pod zarezo ali domačo črto (varna območja).
4. Povečava s prsti na grafu in v 3D svetu dela, stran pa se pri tem ne poveča.
5. Plavajoči inštruktor: povleci ga čez vsebino; nikjer ne zakrije gumba, ki ga potrebuješ.
6. Dolga rešitev v klepetu (npr. »Daj mi celo rešitev« pri kvadratni enačbi): formule se ne odrežejo, vodoravno se pomakne samo formula.

## iPad (Safari)

1. Pokončno in ležeče: učbenik, klepet, kalkulator, laboratorij in 3D svet se odprejo brez prekrivanja.
2. Split View (pol in tretjina zaslona) in Slide Over: postavitev sledi širini okna, nič ni odrezano.
3. **Apple Pencil:** risanje v skenerju in kalkulatorju (če je platno), pritisk, dlan na zaslonu ne riše, pisanje vmesnih korakov.
4. **Zunanja tipkovnica in sledilna ploščica:** Tab premika viden fokus, Enter pošlje, Esc zapre okno, kazalec nad gumbi.
5. Iz poskusa ali 3D modela »Vprašaj inštruktorja« in nazaj: vrne se na isto mesto in v isto stanje.

## Bralnik zaslona

1. VoiceOver (iPhone/iPad) in TalkBack (Android): zavihki, gumbi kalkulatorja in formule v klepetu imajo smiselna imena.
2. Povečava besedila 200 % (nastavitve sistema): nič se ne prekriva, ni vodoravnega drsenja strani.

## Zapisi

| Datum | Naprava in sistem | Točke | Kdo | Ugotovitve |
|---|---|---|---|---|
