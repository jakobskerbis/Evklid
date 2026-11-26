# Lean: dokazano preverjanje vsebine

j, 25. 11. 2026: »Povsod, kjer bi pomagalo pri natančnosti, dodaj programsko preverjanje z Lean, tudi vmesni
koraki.« Lean je dokazovalnik: trditev velja šele, ko jo Lean dokaže. Dopolnjuje SymPy (`server/cas.js`), ki
računa; Lean dokazuje, tudi vsak vmesni korak (veriga `calc`).

## Načrt (odločitve j, 25. 11. 2026)

| PR | Kaj | Kje teče |
|---|---|---|
| L1 | projekt `lean/` (Lean 4.36.0, Mathlib v4.36.0), preverjanje v GitHubu, prvi primeri iz testnih zapiskov | GitHub |
| L2 | lekcije matematike: pravila, identitete, neenačbe, koraki rešenih primerov | GitHub |
| L3 | naše pole in tekmovalne rešitve, vsak korak; dokazne naloge v celoti | GitHub |
| L4 | generatorji Vadnice: vzorec nalog iz vsake vrste | GitHub |
| L5 | delavec na j-jevem prenosniku (Windows, prižgan 24/7): sam pobira dokaze z evklid.app (samo izhodna povezava), dobi samo matematično trditev, brez podatkov učenca | prenosnik |
| L6 | dokazi med učenjem, samo na gumb »Preveri z Lean« (tekmovanja, matura, faks): AI prevede korak v Lean, drug model preveri prevod, delavec dokaže; prenosnik ugasnjen → »ni preverjeno z Lean«; strošek največ 15 % mesečne meje AI učenca, nad tem dokupljen kredit | prenosnik |

Integrali, limite in enote ostanejo pri SymPy, kjer jih ta računa zanesljivo; Lean jih dokaže tam, kjer je
v Mathlibu pravilo (npr. `integral_pow`), sicer ne.

## Pravila

- Ena datoteka na vir (`lean/Evklid/<Vir>.lean`), uvožena v `lean/Evklid.lean`. Docstring vsake trditve pove
  vir (datoteka, primer) in trditev v besedah.
- Večkoračen račun je veriga `calc`: vsak korak iz vira je svoja vrstica, da Lean preveri tudi korake.
- Trditev s predpostavkami ima ob sebi `example`, ki pokaže, da se predpostavke dajo izpolniti. Sicer bi
  nasprotujoče si predpostavke »dokazale« karkoli (pregled L1: `∀ n, aₙ₊₁ = 2aₙ` velja tudi za n = 0).
- Prepovedano: `sorry`, `admit`, `axiom`, `native_decide`; `lake build --wfail` (vsako opozorilo je napaka) in
  vsaka datoteka v `Evklid/` mora biti uvožena v `Evklid.lean` (preveri `.github/workflows/lean.yml`).
- Trditev je zapisana tako, kot je v viru (ista števila, isti vrstni red). Lean dokaže samo to, kar je zapisano:
  napačen prevod je napačna trditev, zato pregledovalec primerja trditev z virom.

## Pregled (j, 25. 11. 2026: »Vse za Lean 4× preveri«)

Vsaka sprememba v `lean/` ima pred združitvijo štiri neodvisne preglede (več kot `docs/pregled.md`):

1. **Zvestoba viru A** – vsaka trditev pove natanko to, kar vir (ista števila, pogoji, obe smeri rešitev).
2. **Zvestoba viru B** – drug pregledovalec isto, neodvisno, brez branja poročila A.
3. **Napad** – poskusi iz predpostavk dokazati `False`, poišči oslabljene trditve, manjkajoče korake, prazne
   `example`, prevelike `maxHeartbeats`.
4. **Gradnja** – `lake build --wfail` od začetka, varovala v `lean.yml`, `scripts/lean-lekcije.mjs`, CI zelen.

## Lokalno

```
cd lean
lake exe cache get   # prevedeni Mathlib (~7 GB)
lake build           # preveri vse
```

Brez Leana na stroju preverjanje teče samo v GitHubu (`lean.yml`, ob spremembi `lean/`; L2 in L3 dodata lekcije
in pole). elan je zaklenjen na v4.4.0 s preverjenim sha256.
Ne zadrži objave na evklid.app.

## Lekcije (L2)

Ena datoteka na lekcijo: `lean/Evklid/Lekcije/<PODROCJE>/<ImeVCamelCase>.lean` (npr. `MAT-SS-4/binomski-izrek.md`
→ `Lekcije/MAT_SS_4/BinomskiIzrek.lean`, modul `Evklid.Lekcije.MAT_SS_4.BinomskiIzrek`), uvožena v
`lean/Evklid.lean`. Glava:

```
/-
vir: content/lessons/MAT-SS-4/binomski-izrek.md
sha256: <sha256sum lekcije>
Ni v Leanu: <kaj iz lekcije ni dokazano in zakaj, npr. »risba«, »simulacija«, »statistični podatki iz ankete«>
-/
module

public import Mathlib
```

Kaj se dokaže (vse, kar je v Mathlibu dokazljivo):

1. vsako pravilo ali identiteto iz `:::formula`, `$$…$$` in razlage, v splošni obliki (s pogoji, ki jih navaja
   lekcija, npr. `n ≠ -1`);
2. vsak rešen primer (`### Primer`) kot verigo `calc` z vmesnimi koraki natanko tako, kot so zapisani; rešitev
   enačbe ali neenačbe kot `↔` (množica rešitev, ne samo ena smer);
3. vsako vrstico bloka `<<RACUN`, ki jo Mathlib zna (resi, neenacba, enako, vrednost, odvod, integral, kjer gre);
4. pravilni odgovor vsakega `:::kviz` / »Preveri se«, kjer je matematičen.

`scripts/lean-lekcije.mjs` (in `.github/workflows/lean-lekcije.yml`) javi, ko se lekcija spremeni po dokazu.
Napake v lekciji, ki jih Lean najde, se ne popravljajo v Leanu: popravi se lekcija (po `content/lessons/README.md`
in pregledu Opus), dokaz ostane za pravilno trditev.

## Delavec na prenosniku (L5)

Strežnik ima vrsto nalog (`server/lean-vrsta.js`, tabela `lean_naloge`); delavec na j-jevem prenosniku
(`scripts/lean-delavec/`, navodila za j: `scripts/lean-delavec/NAVODILA.md`) jih pobira z izhodno povezavo. Na
prenosniku nič ne posluša. L5 sam ne kliče AI in nima gumba; to doda L6.

**Odločitve j (25.–26. 11. 2026) za L6:** samo na gumb »Preveri z Lean« (tekmovanja, matura, faks), nikoli samodejno;
strošek AI (prevod v Lean in drugi model) na učenca največ 15 % njegove mesečne meje AI (`docs/stroski-ai.md`), nad tem
iz dokupljenega kredita (obstoječi dokup); prenosnik ugasnjen ali počasen → »ni preverjeno z Lean«, aplikacija dela naprej.

**Potek.** `vrsta.vpisi(trditev, vrsta)` (samo ta dva argumenta, tretji vrže napako; `vrsta` iz `VRSTE` v
`public/preverjanje/trditev.js`) → `{ id }`; ista trditev in vrsta vrne obstoječo nalogo. Delavec:
`POST /api/lean/delavec/naloga` → `{ id, trditev, najem, rokMs }` ali 204; `POST …/rezultat`
`{ id, najem, izid: proved|failed|rejected|timeout, sporocilo (≤ 2000 znakov), taktika, aksiomi, ms }`;
`POST …/utrip` (tudi vsak klic `naloga` je utrip; med delom vsako minuto). Najem velja 10 min, potekel gre nazaj v vrsto,
po 3 poskusih `timeout`; nepobrana naloga po 24 h `timeout` (»delavec ni bil dosegljiv«); naloge se brišejo po 7 dneh.
Aplikacija bere `vrsta.rezultat(id)` ali `GET /api/lean/naloge/:id` (s prijavo, ko so računi vklopljeni) in iz izida
dobi dokaz v skupnem zapisu z `dokazIzLean(n, trditev, { complete })` (`docs/preverjanje.md`): samo `proved` je dokaz
(`motor: "lean"`, `how: "formal"`, popolnost pove klicatelj, privzeto `unknown` → največ »delno«). `failed`, `rejected`
in `timeout` NISO »ne drži« (taktike le niso našle dokaza): dokaza ni, status ostane, kot ga dajo drugi motorji.
`/healthz/stanje` → `leanDelavec` (`naVoljo`: utrip v zadnjih 3 min, število nalog po stanju).

**Okolje.** `EVKLID_LEAN_TOKEN`: dolg naključen žeton (najmanj 32 znakov; delavec ga ustvari ob prvem zagonu, j ga
vpiše na Render). Brez njega (ali krajši) so poti delavca 404. Primerjava v stalnem času (sha256 + `timingSafeEqual`),
napačni žetoni: 10 na IP v 15 min → 429; vseh klicev delavca največ 120 na minuto; telo največ 16 kB (413), pokvarjen
JSON 400.

**Varnost (najpomembnejše).** Lean zna izvajati programe (`#eval`, `run_cmd`, `elab`/`macro`/`syntax`, `initialize`,
`IO`, `attribute [implemented_by]`, `open … in`, `set_option`, `#exit`). Zato Lean nikoli ne dobi besedila z ukazom:

1. Naloga nosi samo trditev. Datoteko sestavi delavec sam iz stalne predloge (`scripts/lean-delavec/lean.mjs`):
   `import Mathlib`, `set_option autoImplicit false`, `open Real`, nato za vsako taktiko (`norm_num`, `simp`, `ring`,
   `ring_nf`, `linarith`, `nlinarith`, `positivity`, `omega`, `decide`, `field_simp`; brez `polyrith`, ki rabi omrežje, in
   brez `native_decide`) ena vrstica `theorem evklid_tK : <trditev> := by intros; <taktika>` in `#print axioms evklid_tK`.
2. Filter (`scripts/lean-delavec/trditev.mjs`, isti na strežniku ob vpisu in na delavcu pred zagonom) je bel seznam,
   ne seznam prepovedanih besed: ena vrstica do 1000 znakov v obliki NFC; samo znaki z belega seznama (brez `#`, `@`,
   `"`, `'`, `` ` ``, `;`, `$`, `\`, `«»`, `⟨⟩`, nevidnih in podobnih znakov drugih pisav); brez `:=`, `--`, `/-`, `-/`;
   uravnoteženi oklepaji; imena so samo ena črka s števkami ali indeksi (`x`, `x_1`, `a₁`), besede z belega seznama
   (`fun`, `deriv`, `sqrt`, `sin` …) ali imena s predpono `Real.`, `Nat.`, `Int.`, `Rat.`, `Complex.`, `Finset.`, `Set.`,
   `Polynomial.`. Ukaz Lean se vedno začne z znakom (`#`, `@[`, `/--`) ali besedo (`open`, `def`, `elab` …), tudi po
   napaki razčlenjevanja; nobena dovoljena beseda ga ne začne, zato `by`, `show`, `IO`, `Lean.…`, `_root_` ne pridejo
   skozi. Ker so imena kratka ali matematična, trditev ne more nositi imen ali besedila učenca.
3. Lean teče z rokom (privzeto 240 s, nato `taskkill /T /F` oz. SIGKILL), mejo pomnilnika (`-M`, privzeto 6144 MB),
   nižjo prioriteto, z očiščenim okoljem (brez žetona) v začasni mapi, ki se nato izbriše; omrežja ne rabi.
4. Izid je `proved` le, če v vrstici izreka ni napake ne opozorila o `sorry` in `#print axioms` našteje samo
   `propext`, `Classical.choice`, `Quot.sound` (izpis `lean --json`). Strežnik `proved` sprejme le z znano taktiko in
   dovoljenimi aksiomi. Sporočilo gre na strežnik brez poti na disku in uporabniškega imena.

**Preostala tveganja (pošteno).** (a) Na Windows Lean teče kot j-jev uporabnik, ne kot omejen uporabnik (Node tega
brez dodatnih orodij ne zna; na Linuxu `linuxUid` v `nastavitve.json`). Varovalo je filter: če bi imel luknjo, bi
lahko trditev zagnala program z j-jevimi pravicami. (b) Mathlib in njegove taktike so koda, ki ji zaupamo (kot pri
`lake build`); napaka v Mathlibu ali Leanu (npr. elaborator, ki ga sproži dovoljen zapis) bi bila zunaj filtra.
(c) Kdor ima žeton, lahko pošilja izide (lažen `proved`) ali bere trditve; žeton je samo na Renderju in v
`nastavitve.json` na prenosniku. (d) Kdor ima dostop do strežnika, lahko v vrsto vpiše karkoli; zato delavec trditev
preveri še enkrat. (e) Lean prenese elan, Lean in Mathlib (`lake exe cache get`) z interneta; Node, Git in elan so
preverjeni s SHA-256 v `zazeni.bat`, Lean in Mathlib preveri elan/lake po svoje. (f) Napačen prevod koraka v Lean
(L6) da pravilen dokaz napačne trditve; zato L6 prevod preveri drug model.

**Namestitev.** `scripts/lean-delavec/zazeni.bat` (dvoklik): Node v24.22.3, MinGit 2.51.0 in elan v4.4.0 (vsi s
SHA-256), Lean in Mathlib iz `scripts/lean-delavec/projekt/` (iste različice kot `lean/`, test to preveri),
`lake exe cache get`, žeton v `nastavitve.json`, nato delavec v zanki (če se konča, po 30 s znova). Delavec se nikoli
ne ustavi sam (napaka → dnevnik, premor 30 s do 5 min), piše `stanje.json` (atomarno) in `dnevnik.txt` (vrtenje pri
1 MB, 3 stare kopije) in drži Windows budne (`SetThreadExecutionState`, kot `rtx.py` v `docs/3d.md`).

**Modul.** `server/lean-vrsta.js` je nov: noben obstoječ modul nima vrste za zunanjega delavca z lastnim žetonom
(`server/cas.js` zaganja SymPy na strežniku, `server/preverjevalniki.js` samo poroča stanje). Testi:
`test/lean-vrsta.test.js`.
