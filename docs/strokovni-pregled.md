# Strokovni pregled vsebine: vzorec, navodila in obrazec (N-06)

j, 25. 11. 2026 (kartica): »Vzorec zdaj, plačilo po 1. plačilu.« Vzorec in obrazec sta pripravljena zdaj; učitelje
povabi in plača j, šele po prvem plačilu uporabnika. Do takrat nobena vsebina Evklida ni strokovno pregledana in
učbenik to pove (oznaka »Brez pregleda učitelja«, N-03, `server/oznake-vsebine.js`).

## Namen

Neodvisna ocena človeka, ki jo AI ne more nadomestiti: koliko napak in pomanjkljivosti ostane v vsebini po
programskem preverjanju in treh pregledih AI. Rezultat je število in vrsta napak na vzorcu ter iz tega ocena za celoto,
ne pohvala.

## Vzorec (slepi izbor)

`node scripts/vzorec-ucitelji.mjs --md` (seme `77a3955` = commit main 25. 11. 2026, preden je bil vzorec izbran).
Vzorca ni izbral nihče na roko: ponovljivo naključje po plasteh izbere

| Del | Koliko | Iz česa |
|---|---|---|
| A. Lekcije | 32 | MAT SŠ 12 (3 na letnik), MAT OŠ 4, FIZ SŠ 6, FIZ OŠ 2, KEM SŠ 6, KEM OŠ 2 |
| B. Naloge Vadnice | 12 | MAT 6, FIZ 3, KEM 3; generator teme SŠ, raven 2 |
| C. Deli naših maturitetnih pol | 6 | MAT, FIZ, KEM po 2 |

Teža je na snovi, ki jo bodo uporabljali pilotni maturanti. Biologija, naravoslovje, tekmovanja in fakultetne lekcije
pridejo v naslednji krog. Izbor je zapisan v `docs/strokovni-pregled-vzorec.md` in velja ta zapis. Nove lekcije, napisane po izboru, v
vzorec ne pridejo (ponovni zagon skripte po dodanih lekcijah da drug izbor); za nov krog se izbere nov vzorec z novim
semenom (commit main tistega dne).

**Kaj je slepo.** Učitelj ne ve, katere lekcije so po njegovem mnenju »lahke«, ker jih ni izbral nihče. Vsebino vidi
kot učenec (povezave `https://evklid.app/ucbenik/<pot>/<tema>`), brez poročil AI pregledovalcev in brez naših
ocen. Pregledovalca ne vidita ocen drug drugega, dokler oba ne oddata obrazca.

## Kdo in koliko

- Dva učitelja: matematika (A1–A16, B1–B6, C1–C2) ter fizika in kemija (A17–A32, B7–B12, C3–C6); če je za FIZ in
  KEM na voljo vsak svoj učitelj, si delo razdelita po predmetu.
- Ocena časa: lekcija 20–30 min, naloga 3–5 min, del pole 5 min, skupaj 13–18 ur za oba. Ocena plačila
  500–1.050 € (2 × 10–15 ur × 25–35 €; ocena, ne tržna cena). Plačilo šele po prvem plačilu uporabnika (j).
- Pogoj: učitelj predmeta v gimnaziji (pri OŠ lekcijah zadošča učitelj OŠ), ni povezan z Evklidom.

## Navodila za učitelja

1. Odpri povezavo lekcije in jo preberi kot učbenik za dijaka. Preveri tudi vse rešene primere in vprašanja
   »Preveri se« (odgovori so za gumbom).
2. Za vsako napako zapiši mesto (razdelek ali primer), kaj je narobe in kako bi bilo prav. Razvrsti jo:
   - **kritična**: strokovno napačna trditev, napačen rezultat ali napačen odgovor v vprašanju; dijak bi se naučil
     narobe;
   - **večja**: nejasna ali zavajajoča razlaga, manjkajoč pogoj, neustrezna raven, napačen izraz;
   - **manjša**: jezik, oblika, zapis enote, zaokroževanje.
3. Oceni od 1 do 5: strokovna pravilnost, skladnost z učnim načrtom oziroma katalogom mature, primernost ravni,
   razumljivost za dijaka, kakovost rešenih primerov in vprašanj.
4. Sodba: **sprejeto** (brez kritičnih in večjih napak), **sprejeto s popravki** (napake, ki jih je mogoče
   popraviti) ali **zavrnjeno** (lekcijo je treba napisati znova).
5. Pri nalogah Vadnice in delih pol: ali je besedilo jasno, ali je odgovor pravilen in pravilno zaokrožen, ali je
   rešitev (točkovnik) pravilna.

Obrazec ima za vsak del vzorca eno vrstico s temi polji in seznam najdenih napak (Claude Doc »Obrazec za strokovni pregled vsebine Evklida«, https://claude.ai/artifact/WvkhE3oYGrxNLvb2BfkV8S; učitelj dobi kopijo ali izvoz v PDF/Word). Oddan obrazec je PDF ali preglednica.

## Kaj naredimo z rezultatom

- Vsako kritično in večjo napako popravimo v istem tednu (Opus popravi, drug Opus pregleda, učitelj potrdi
  popravek), po `docs/pregled.md`.
- Lekcija s sodbo »sprejeto« ali s potrjenimi popravki dobi v glavi `stanje: pregledano`, `pregledal: <ime>` in
  `pregledano: LLLL-MM-DD`; šele takrat učbenik pokaže »Strokovno pregledano« (N-03). Lekcija, ki je učitelj ni
  pregledal, te oznake nikoli ne dobi, tudi če je iz iste plasti kot pregledane.
- Poročilo: število napak po vrsti in plasti, delež lekcij s kritično napako z intervalom zaupanja. Pri 0 kritičnih
  napakah na 32 lekcijah je zgornja meja 95-odstotnega intervala za delež lekcij s kritično napako približno 9 %
  (pravilo treh: 3/32), zato tak rezultat ne pomeni »brez napak«, ampak »manj kot ~9 % lekcij«.
- Napake, ki jih je program ali AI spregledal, gredo v referenčni nabor preverjanja (N-01) kot primeri, ki jih mora
  preverjanje ujeti.
