# Preverjanje s kodo (SymPy)

j, 2026-11-11: »naredi najbolj napredno kodo za preverjanje enačb itd., da lahko odgovore inštruktorja vedno potrdimo s kodo«, »in tudi na ostalih mestih, kjer je relevantno«. Odločitev: vse, že za pilot.

## Kako dela

1. **Pravi računalniški algebrski sistem.** `server/cas/worker.py` (SymPy 1.14) teče kot en dolgoživ proces ob strežniku (`server/cas.js`, ~65 MB). Namesti ga `npm ci` sam (`scripts/namesti-sympy.cjs`, postinstall → mapa `.pylib`). Brez Pythona aplikacija dela naprej s preverjanjem, ki ga je imela prej; ob zagonu dnevnik pove `preverjanje s SymPy: deluje` ali `ni na voljo`.
2. **Skrit »račun za kodo«.** Inštruktor na konec odgovora doda blok `<<RACUN … >>` z vsemi računskimi trditvami v strojni obliki (`prompts/system_prompt.md`, »Račun za kodo«). Učenec ga ne vidi (`server/meta.js`). `server/racun.js` preveri vsako trditev.
3. **Napačna trditev** → en kratek »Popravek:« (isti postopek kot pri drugih najdbah, `server/live-check.js`); odgovor in kartice iz njega se ne shranijo za ponovno uporabo.

## Kaj koda preveri

| Ključna beseda | Kaj | Kako |
|---|---|---|
| `resi` | enačbe, sisteme, periodične rešitve (`k`) | vstavi vsako rešitev in poišče vse prave (ujame manjkajoče in odvečne) |
| `neenacba` | neenačbe | primerja množici (intervali, `U`, `x<…`) |
| `enako` | poenostavitve, razstavljanje, identitete | simbolno, sicer v 40 naključnih točkah |
| `odvod`, `integral`, `limita` | analiza | SymPy; nedoločeni integral z odvajanjem (konstanta poljubna) |
| `vrednost` | račune, ulomke, korene, vrste, matrike (`det`, `inv`) | točno; zaokrožen rezultat na toliko mest, kot jih je napisanih |
| `enote` | fizikalne račune | pretvori v osnovne enote SI, preveri enoto in vrednost |
| `kemija` | urejenost enačbe reakcije | atomi in naboj na obeh straneh (`public/graph/chemcore.js`) |
| `molska` | molsko maso | periodni sistem, dovoljeno 0,6 % (šolske tabele zaokrožajo) |

Trditev, ki je koda ne zna preveriti, ni napaka (šteje se kot nepreverjena).

## Kje

- **Klepet** (`server/app.js`): vsak odgovor z blokom. Števec v kv `racun_statistika` (odgovori, z blokom, potrjene, napake, nepreverjene po dnevih).
- **Lekcije**: blok na koncu lekcije, `node scripts/check-lesson.js` ga preveri (napačna trditev = napaka lekcije); pisci in pregledovalci dobijo navodilo v `scripts/lesson-brief.js`.
- **Skeniranje** (`server/scan.js` `verifyAiFull`): AI rešitev preverita numerika in SymPy; SymPy odloča, kadar se odloči.
- **Kartice iz zapiskov** (`server/zapiski.js`): model doda trditve `racun`; kartica z napačno trditvijo se ne shrani.

Kar ostane AI pregledu: dokazi in razlage z besedami, ki jih koda ne more preveriti.

## Varnost

Besedilo trditev piše model, zato ga worker bere samo z belim seznamom imen (brez pik, podčrtajev, narekovajev), vsak ukaz ima rok 6 s (Node 9 s, nato nov proces) in proces ima omejen pomnilnik. Izklop: `EVKLID_CAS=0`.
