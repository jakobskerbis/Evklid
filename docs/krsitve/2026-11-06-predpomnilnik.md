# Evidenca kršitve: osebni podatki v shranjenih odgovorih inštruktorja (6. 11. 2026)

Notranji zapis po čl. 33(5) GDPR (dejstva, posledice, ukrepi). Upravljavec odloča o prijavi (j).

## Kaj
Prvi odgovor inštruktorja na vprašanje se shrani (`answer_cache`) in ga dobijo drugi učenci z enakim prvim
vprašanjem in enakimi nastavitvami (predmet, raven, jezik …). Ključ pa ni poznal teh podatkov iz prompta:
- zanimanja iz kotička, tudi lastno zanimanje kot prosto besedilo (do 40 znakov, npr. ime ljubljenčka ali kluba),
- cilj učenca z datumom,
- šibke točke (v prostem pogovoru),
- urnik in teste (dan, ura, predmet in datum testa).

Prompt inštruktorju naroča, naj primere vzame iz zanimanj, in mu da teste. Če jih je omenil v prvem odgovoru,
je ta odgovor (po trojnem preverjanju pravilnosti) lahko dobil otrok iz drugega računa. Ime učenca je bilo
že prej zamenjano z {{IME}}. Ni bilo: imen, e-naslovov, datumov rojstva, šole ali razreda.

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
- Zanimanja, lastno zanimanje, cilj in šibke točke so del ključa; z vnesenim urnikom ali testi se odgovor ne shrani
  in ne vzame iz predpomnilnika (`server/app.js`, PR #484).
- Enkratni izbris vseh starih shranjenih odgovorov ob prvem zagonu (`server/db.js`, kv `answer_cache_personal_purge`).
- `test/zasebnost-predpomnilnik.test.js` pade, če se uhajanje vrne.
- Ostaja (nizka občutljivost): število pravilnih nalog (`student_results`) je v promptu, v ključu le zahtevnost.
