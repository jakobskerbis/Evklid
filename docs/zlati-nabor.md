# Zlati nabor inštruktorja (P1-10)

j, 25. 11. 2026 (»tri najvišje prioritete«, predlog P1-10): en nabor z znanimi odgovori, s katerim se izmeri vsaka
sprememba poziva ali izbire modela, pred in po, slepo. Sprememba gre naprej samo, če ni slabša v nobenem merilu
(predlog P1-11). Zelen izid ni strokovna potrditev: ocenjujejo modeli, zato se vzorec odgovorov pregleda še ročno
(j ali učitelj).

## Sestava (78 javnih primerov, 103 sporočila)

| skupina | primerov | vir | merila |
|---|---|---|---|
| bio | 11 | nov, `test/fixtures/zlati-nabor/novi.json` | rezultat, trditve, celota, raven |
| kem | 11 | nov (številke preračuna `test/zlati-nabor.test.js`) | rezultat, trditve, celota, raven |
| predstave | 14 | nov: učenčev napačen rezultat z znano napačno predstavo (MAT, FIZ, KEM) | napaka, predstava, trditve, raven |
| astra | 10 | `test/fixtures/astra-vprasanja.json` | pricakovano, trditve, celota, raven + pedagogika 1–10 |
| pedagogika | 12 × 3 sporočila | `test/fixtures/pedagogika-12.json` | ne_izda, napaka, poenostavi, trditve, raven + pedagogika 1–10 |
| matura | 20 od 121 (vsak 8. v vsaki vrsti napake) | `test/fixtures/napacni-koraki-matura.json` | napaka, trditve, raven |
| preizkus3 | 30 od 150 (vsaka 5.), samo izrecno | `scripts/preizkus3-naloge.enc` | rezultat, trditve, celota, raven; **brez reference** |

Pomen meril je v `scripts/zlati-nabor-ocena.mjs` (`MERILA`). »Odgovor z napako« = NE pri rezultatu, trditvah ali
celoti (mera iz načrta: Preizkus 3 je imel 7 od 150, cilj največ 1).

Preizkus 3 nima uradnih rešitev v repozitoriju, zato ocenjevalec nalogo reši sam; vrstica v tabeli ima oznako »brez
reference« in ni enakovredna ostalim. Naloge in izid sta šifrirana s `PREIZKUS3_KLJUC`.

## Kako teče

1. Vsak primer gre skozi pravo aplikacijo (`server/app.js` v istem procesu, začasna baza, nov učenec), z vsemi
   varovali kot v produkciji; privzeto plačljivi paket (`think`), `--nacin chat` je brezplačni.
2. Pogovor slepo ocenita dva neodvisna ocenjevalca (`MODEL_DEEP`, Opus) z referenco; drugi dobi merila v obratnem
   vrstnem redu. Ocenjevalec ne ve, katera različica ali model je odgovoril. Ob razhajanju (merilo ali pedagogika za
   več kot 2) oceni še tretji, odloči večina; brez večine »neodločeno«.
3. Izid: `data/meri-zlati-nabor*.json` (prepisi, vse ocene, povzetek) in tabela v povzetku zagona. Pod tabelo je
   ujemanje prvih dveh ocenjevalcev (delež in Cohenov kapa): nizko ujemanje pomeni, da je merilo nejasno, ne da je
   inštruktor slab.

## Zagon

GitHub Actions > Meritev > Run workflow, skripta `scripts/meri-zlati-nabor.mjs`, max_usd `2`. Cel nabor ne gre v en
zagon po 2 $, zato v treh: argumenti `--del 1-3`, nato `--del 2-3` in `--del 3-3`. Ocena stroška celega nabora je
4–6 $ (aplikacija ~1–2 $, ocenjevalci ~3–4 $); prvi zagon jo potrdi. Pred vsakim sporočilom skripta rezervira
najslabši primer (~0,5 $), pred oceno štiri klice ocenjevalca; ob meji se ustavi in zapiše, kar je ocenjeno.

Drugi argumenti: `--skupine bio,kem` (izbor skupin; `preizkus3` samo izrecno), `--primeri id1,id2`, `--kandidat`
(kandidat poziva, izid z »-kandidat« v imenu), `--hkrati 3`. Brezplačno: `--suho` (izbor in rezerva), `--preizkus`
(preizkusni odgovori brez ključa).

## Primerjava pred in po (0 $)

```
node scripts/zlati-nabor-ocena.mjs --primerjaj data/meri-zlati-nabor-1-3.json data/meri-zlati-nabor-kandidat-1-3.json
```

Primerja samo skupne primere. Za vsako merilo izpiše število ocen NE prej in potem, poslabšane in izboljšane primere
ter povprečje pedagogike. Konča z »IZID: ni slabše v nobenem merilu« (izhod 0) ali s seznamom slabših meril (izhod 2).
Primerjati je smiselno le zagone z istim `--del`, istim načinom in isto skupino ocenjevalcev.
