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
6. Android: poteg za nazaj (sistemska kretnja) zapre okno ali se vrne na prejšnji zaslon, ne zapusti aplikacije.
7. Temni način sistema: besedilo, formule in grafi ostanejo berljivi.
8. Dolga rešitev v klepetu (npr. »Daj mi celo rešitev« pri kvadratni enačbi): formule se ne odrežejo, vodoravno se pomakne samo formula.

## iPad (Safari)

1. Pokončno in ležeče: učbenik, klepet, kalkulator, laboratorij in 3D svet se odprejo brez prekrivanja.
2. Split View (pol in tretjina zaslona) in Slide Over: postavitev sledi širini okna, nič ni odrezano.
3. **Apple Pencil:** risanje v skenerju in kalkulatorju (če je platno), pritisk, dlan na zaslonu ne riše, pisanje vmesnih korakov.
   Scribble (pisanje z roko v polja za vnos, npr. klepet): besedilo pride v polje.
4. **Zunanja tipkovnica in sledilna ploščica:** najprej v Nastavitve → Safari vklopi »Pritisni tabulator za označevanje
   vsakega elementa« (sicer Tab skače samo med polji; ali uporabi Option + Tab). Tab premika viden fokus, Enter pošlje,
   Esc zapre okno, kazalec nad gumbi.
5. Stage Manager in okno, ki mu spremeniš velikost: postavitev sledi širini okna.
6. Iz poskusa ali 3D modela »Vprašaj inštruktorja« in nazaj: vrne se na isto mesto in v isto stanje.

## Bralnik zaslona

1. VoiceOver (iPhone/iPad) in TalkBack (Android): zavihki, gumbi kalkulatorja in formule v klepetu imajo smiselna imena;
   ko inštruktor odgovori, bralnik odgovor prebere (živo območje).
2. Povečava 200 %: Safari (iPhone/iPad) aA → 200 %; Chrome na Androidu Nastavitve → Dostopnost → Velikost besedila;
   računalnik Ctrl/Cmd + do 200 % in še 400 % pri širini 1280 px (preoblikovanje, WCAG 1.4.10). Nič se ne prekriva,
   ni vodoravnega drsenja strani. (Sistemska velikost besedila v iOS spletnih strani ne poveča.)

## Zapisi

| Datum | Naprava in sistem | Točke | Kdo | Ugotovitve |
|---|---|---|---|---|
