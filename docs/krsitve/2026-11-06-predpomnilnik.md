# Evidenca kršitve: osebni podatki v shranjenih odgovorih inštruktorja (6. 11. 2026)

Notranji zapis po čl. 33(5) GDPR (dejstva, posledice, ukrepi). Upravljavec odloča o prijavi (j).

## Kaj
Prvi odgovor inštruktorja na vprašanje se shrani (`answer_cache`) in ga dobijo drugi učenci z enakim prvim
vprašanjem in enakimi nastavitvami (predmet, raven, jezik …). Ključ pa ni poznal teh podatkov iz prompta:
- zanimanja iz kotička, tudi lastno zanimanje kot prosto besedilo (do 40 znakov, npr. ime ljubljenčka ali kluba),
- cilj učenca z datumom,
- šibke točke (v prostem pogovoru),
- urnik in teste (dan, ura, predmet in datum testa),
- rezultate iz Vadnice in pogovorov (npr. »12 od 12 nalog pravilno«), stopnjo in začetni test teme.

Ime učenca je bilo zamenjano z {{IME}} samo v točni obliki: ime brez strešic (»Ziga«) ali prečrkovano v drugo
pisavo (»Зала« pri pogovoru v ruščini) je ostalo v odgovoru (pregled #484 B; obstajalo od uvedbe predpomnilnika).

Prompt inštruktorju naroča, naj primere vzame iz zanimanj, in mu da teste. Če jih je omenil v prvem odgovoru,
je ta odgovor (po trojnem preverjanju pravilnosti) lahko dobil otrok iz drugega računa. Ime učenca je bilo
zamenjano z {{IME}} (z izjemo zgoraj). Ni bilo: imen, e-naslovov, datumov rojstva, šole ali razreda.

## Od kdaj do kdaj
- Zanimanja v promptu od 29. 10. 2026 (`aa4598cc`, kotiček zanimanj), urnik in testi od 29. 10. 2026 (`762eb143`).
- Na evklid.app od namestitve teh sprememb do namestitve PR #484.
- Ugotovljeno 6. 11. 2026 (stalni iskalec napak). Popravek: PR #484.

## Kdo je lahko videl
- Učenec drugega računa, ki je kot prvo sporočilo novega pogovora poslal enako besedilo pri enakih nastavitvah,
  v 30 dneh po nastanku odgovora. Odgovor se mu je shranil v lastni pogovor (`messages`), dokler ga ne izbriše.
- Anonimni obiskovalci ne (klepet potrebuje profil).

## Ocena
j je potrdil (6. 11. 2026): v produkcijski bazi so v tem času samo njegovi in testni računi. Podatki tretjih
oseb torej niso bili razkriti drugim računom, tveganje za pravice in svoboščine ni verjetno.
- Prijava Informacijskemu pooblaščencu (čl. 33(1)): ni potrebna.
- Obvestilo posameznikom (čl. 34): ni potrebno.
- Zapis v to evidenco (čl. 33(5)): da.

## Ukrepi
- Učenec z zanimanji, ciljem, urnikom ali testi, šibkimi točkami (prost pogovor), lastnimi rezultati ali jezikom
  v nelatinični pisavi odgovora ne shrani za druge in ne vzame shranjenega (`server/app.js` hasPersonalPrompt, PR #484).
- Ime se išče tudi brez strešic in naglasov (`server/reports.js` genericAnswer).
- Enkratni izbris vseh starih shranjenih odgovorov ob prvem zagonu (`server/db.js`, kv `answer_cache_personal_purge`).
- `test/zasebnost-predpomnilnik.test.js` in `test/zasebnost-predpomnilnik-luknje.test.js` padeta, če se uhajanje vrne.
