# Tedenske posodobitve kozmetike

j, 30. 10. 2026: »naj kozmetika in sorodni aspekti dobivajo tedenske update«, usklajeno s povratnimi
informacijami uporabnikov. Nove vrste iger vsak teden doda nit IGRE (docs/igre-smernice.md), dve uri za to
posodobitvijo. Ta dokument velja za avatarje, trgovino, Zbirke, vitrine in lestvice.

## Kdaj

Vsako sredo ob 02:13 UTC (samodejni tedenski zagon v niti o kozmetiki). Nove vrste iger doda nit IGRE okoli
04:13 UTC istega dne (docs/igre-smernice.md); oznako »Novo« za igre dela z istim `isNewDate` in `.gm-new`.

## Iz česa izhajamo

Evklid teče na Renderju (evklid.app, od 30. 10. 2026). Tedenska posodobitev prebere podatke z
`GET https://evklid.app/api/kozmetika/export` z glavo `Authorization: Bearer $EVKLID_EXPORT_TOKEN`
(ključ je v okolju Renderja in v skrivnostih okolja Claude; nikoli ga ne izpiši ali zapiši v repozitorij).
Brez ključa izvoz vidi samo skrbnik (prijavljen z naslovom iz `EVKLID_ADMIN_EMAILS` ali starš, označen kot skrbnik)
ali računalnik s strežnikom.

1. **Želje otrok** iz trgovine (»Kaj si želiš v trgovini?«): `wishes` v izvozu (besedilo, jezik, dan; brez imen
   in id-jev; v bazi tabela `feedback`, `kind = "cosmetics"`). Želje so prosto besedilo, zato jih nikoli ne
   objavi in ne prepisuj v repozitorij; v poročilu j-ju jih povzemi (npr. »3 otroci želijo pirate«). Strežnik
   jih izbriše po 90 dneh (`WISH_DAYS`, server/feedback.js; navedeno v public/zasebnost.html). Brez ključa izvoz
   vrne 404, odgovor ima `Cache-Control: no-store`.
2. **Kaj otroci nosijo in kupujejo**: `trends` v izvozu (prijavljen skrbnik jih vidi tudi na `GET /api/avatar/trends`).
   Samo števila: pod 3 učenci skupaj nič, predmetov z manj kot 3 učenci ni v seštevku.
3. Splošne povratne informacije (docs/povratne-informacije.md), kadar se dotikajo avatarja, lig ali Zbirk.

Če podatkov ni (ključ manjka, strežnik ni dosegljiv ali še ni želja), naredi posodobitev po spodnjem ravnovesju in
v poročilu povej, da podatkov ni bilo.

## Kaj dodamo vsak teden

- 4 do 6 novih predmetov, od tega:
  - vsaj 2 za kovance v trgovini (public/avatar.js, `it(...)` + risba; cena določi redkost),
  - vsaj 1 za znanje ali igre (public/zbirke.js: Pot znanja, zbirka predmeta ali `igre`; nikoli cena),
  - kadar želje to kažejo, nov lik (predal `kind`, odklene se samo z igrami).
    Izjema: zbirka »Smešni liki« (`smesni`, j 30. 10. 2026) ima like za XP, po znanih nesmiselnih »brainrot«
    likih, samo primerni (brez kletvic, nasilja, njihovih pesmi), največ legendarni.
- Če se izide, še eno manjšo izboljšavo (npr. nova kombinacija, popravek risbe, ki so jo otroci omenili).
- Vsak nov predmet dobi vrstico v `ADDED` (public/avatar.js) z datumom posodobitve: teden dni nosi oznako
  »Novo« in je v vrstici »Novo ta teden« v trgovini.

## Pravila, ki ostanejo

- Brez naključja (škatle presenečenja), brez časovno omejene ponudbe in odštevanja, brez pravega denarja.
  Predmet, ki pride, ostane za vedno (EU pravila za otroke; j-jev dokument »Kozmetika in personalizacija«,
  povzetek v glavi public/zbirke.js).
- Kozmični in večni predmeti samo za znanje in igre. Mitični v trgovini nad 1000 kovancev.
- Izvirne risbe, brez znamk in likov iz drugih iger. Risba v viewBox 0 0 100 100, unikatni `id` s `${u}`.
- Vsako novo besedilo vmesnika gre v public/i18n/sl.js in vseh 32 public/i18n/ui/*.json (imena predmetov
  imajo `sl` in `en` kar v vrstici).
- Trikratni pregled (docs/pregled.md): `npm test` + `node scripts/preveri-aplikacijo.cjs`, nato pregledovalec.
  Za pogled pokaži slike novih predmetov (Playwright) v svetli in temni temi.
- Največ 2 agenta hkrati (docs/token-rules.md).

## Vitrina v razredu in deljiva kartica (4. 11. 2026)

- **Vitrina v razredu** (server/vitrina.js, Lige → kartica razreda): samo v razredu, ki ga je odprl učitelj (ne v
  skupini prijateljev). Učenec vklopi »Pokaži mojo vitrino sošolcem« posebej za vsak razred; privzeto je izklopljeno
  in izstop iz razreda vklop pobriše. Sošolci vidijo samo vzdevek (kot na lestvici), avatar, XP in do 3 predmete
  iz vitrine (izbira je ista kot na profilu, »V vitrino«), v pogledu »Preglej« pa temo in datum (brez ure).
  Učitelj lahko vitrine v razredu izklopi (stran za učitelje); izklopa učenec ne more obiti. Poti so pod
  `/api/students/:id`, zato z računi veljata lastništvo profila in geslo profila. Brez klepeta.
- **Deljiva kartica** (public/deli-kartico.js, Zbirke → »Deli zbirko«): PNG nariše brskalnik (SVG → canvas), na
  strežnik ne gre nič. Na njej so avatar, do 3 predmeti iz vitrine z okvirjem redkosti, števila po zbirkah,
  stopnja passa in znak Evklid; nikoli ime, vzdevek, šola, razred, e-naslov ali id. Model kartice vzame samo
  dovoljena polja. Deli prek Web Share API z datoteko, sicer prenos.
- Nov predmet v vitrini ali na kartici ne potrebuje dodatne kode; nova polja v odgovoru `/api/students/:id/vitrina`
  ali v `shareCardModel` pa morajo skozi test/vitrina.test.js (seznam dovoljenih ključev).

## Poročilo j-ju

Kratko, v slovenščini: kaj je novega (s sliko), katere želje otrok so bile upoštevane in koliko jih je bilo.
