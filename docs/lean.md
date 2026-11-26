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
`{ id, najem, izid: proved|failed|rejected|timeout|napaka, sporocilo (≤ 2000 znakov), taktika, aksiomi, ms }`;
`POST …/utrip` (tudi vsak klic `naloga` je utrip; med delom vsako minuto). Najem velja 10 min, potekel gre nazaj v vrsto,
po 3 poskusih `timeout`; nepobrana naloga (ali najem, potekel pred več kot 24 h) po 24 h `timeout`; naloge se brišejo
po 7 dneh. Delavčev rok je vedno vsaj 60 s krajši od najema (`rokNaloge`: največ `rokMs − 60 s`, nastavitev `rokS`
največ 540 s), zato izid ne dobi 409; če ga vseeno (prenosnik je spal), ga delavec zavrže in dela naprej.
`napaka` ni izid trditve: delavec ni pripravljen (`lean.json` ali Lean manjka, Lean se ne zažene, napaka v glavi predloge, npr.
zastarel Mathlib, ali nobena vrstica `#print axioms` ni dala sporočila). Strežnik nalogo vrne v vrsto (po 3 poskusih
`timeout`), delavec počaka (30 s … 5 min). Dvojniki: ista trditev in vrsta v vrsti ali `proved` vrne obstoječo nalogo,
`failed` samo 1 h (`neuspehMs`), `rejected` in `timeout` nikoli.
Aplikacija bere `vrsta.rezultat(id)` ali `GET /api/lean/naloge/:id` (s prijavo, ko so računi vklopljeni; izid nosi tudi
shranjeno `trditev`) in iz izida dobi dokaz v skupnem zapisu z `dokazIzLean(n, { complete, zadovoljivo })`
(`docs/preverjanje.md`): samo `proved` je dokaz (`motor: "lean"`, `how: "formal"`, popolnost pove klicatelj, privzeto
`unknown` → največ »delno«). Izrek je vedno iz shranjene trditve naloge (ne iz klicateljevega besedila), `dokaz.izrek`
je natančno preverjeno besedilo (glava predloge + vrstica `theorem evklid_tK …`, `izrekDokaza` v `lean.mjs`), sha256 je
iz njega. Trditev s predpostavkami (`→`) je lahko prazno resnična (`∀ x : ℝ, x > 1 → x < 0 → x = 5` dokaže `linarith`),
zato je popolnost največ `unknown`, dokler klicatelj ne poda `zadovoljivo: true` (dokazan `example`, da se predpostavke
dajo izpolniti; L6). `failed`, `rejected` in `timeout` NISO »ne drži« (taktike le niso našle dokaza): dokaza ni, status
ostane, kot ga dajo drugi motorji. L6 mora dodati mejo nalog na učenca in prednost (vrsta ima zdaj samo skupno mejo
500; `vpisi` ni dostopen po HTTP).
`/healthz/stanje` → `leanDelavec` (`naVoljo`: utrip v zadnjih 3 min, število nalog po stanju).

**Okolje.** `EVKLID_LEAN_TOKEN`: dolg naključen žeton (najmanj 32 znakov; delavec ga ustvari ob prvem zagonu, j ga
vpiše na Render). Brez njega (ali krajši) so poti delavca 404. Primerjava v stalnem času (sha256 + `timingSafeEqual`).
Žeton se preveri najprej: pravilen žeton nikoli ne dobi 429 zaradi napačnih. Napačni žetoni: 10 na naslov v 15 min →
429; naslov je `clientIp` iz `server/gate.js` (s trust proxy `req.ip`, sicer vtičnica; glave `cf-connecting-ip` ne
beremo). Vseh klicev delavca največ 120 na minuto; telo največ 16 kB (413), pokvarjen JSON 400.

**Varnost (najpomembnejše).** Lean zna izvajati programe (`#eval`, `run_cmd`, `elab`/`macro`/`syntax`, `initialize`,
`IO`, `attribute [implemented_by]`, `open … in`, `set_option`, `#exit`). Zato Lean nikoli ne dobi besedila z ukazom:

1. Naloga nosi samo trditev. Datoteko sestavi delavec sam iz stalne predloge (`scripts/lean-delavec/lean.mjs`):
   `import Mathlib`, `set_option autoImplicit false`, `open Real`, nato preverba tipov (`set_option pp.explicit true in
   … pp.notation false … pp.proofs true … #check (<trditev> : Prop)`, glej »Tipi«), nato za vsako taktiko (`norm_num`, `simp`, `ring`,
   `ring_nf`, `linarith`, `nlinarith`, `positivity`, `omega`, `decide`, `field_simp`; brez `polyrith`, ki rabi omrežje, in
   brez `native_decide`) ena vrstica `theorem evklid_tK : <trditev> := by intros; <taktika>` in `#print axioms evklid_tK`.
2. Filter (`scripts/lean-delavec/trditev.mjs`, isti na strežniku ob vpisu in na delavcu pred zagonom) je bel seznam,
   ne seznam prepovedanih besed: ena vrstica do 1000 znakov v obliki NFC; samo znaki z belega seznama (brez `#`, `@`,
   `"`, `'`, `` ` ``, `;`, `$`, `\`, `«»`, `⟨⟩`, `·`, `∏`, samostojne `.`, nevidnih in podobnih znakov drugih pisav); brez
   `:=`, `--`, `/-`, `-/`, `_`; uravnoteženi oklepaji; `!` samo v `∃!` (`x!`, `Nat.foo!` sta imeni in zavrnjena).
   Imena: ena črka s števkami ali indeksi (`x`, `x_1`, `a₁`) ali ime z izrecnega belega seznama (`BESEDE`: `fun`,
   `deriv`, `sqrt`, `sin` …; `IMENA`: `Real.sqrt`, `Nat.Prime`, `Nat.gcd`, `Finset.range` …), ne predpone. Vsako ime na
   seznamu je izbrano tako, da ne zna sestaviti ogromnega števila: ni `Nat.pow`, `shiftLeft`, `factorial`, `choose`,
   `iterate`, `repeat`, `fib`, `rpow`, `List.…`. Ukaz Lean se vedno začne z znakom (`#`, `@[`, `/--`) ali besedo
   (`open`, `def`, `elab` …), tudi po napaki razčlenjevanja; nobena dovoljena beseda ga ne začne, zato `by`, `show`,
   `IO`, `Lean.…`, `_root_` ne pridejo skozi. Ker so imena kratka ali matematična, trditev ne more nositi imen ali
   besedila učenca.
   Števila in pomnilnik (Lean računa velika števila z GMP, ki ne pogleda meje `-M`): število največ 12 števk, za njim ne
   sme biti črka, `_` ali pika (`0x…`, `0b…`, `1e5`, `2.5e3`, `2x`; Lean bi `1e999999999999` prebral kot 10^…); decimalno
   število `0.5` je dovoljeno. Eksponent za `^` je celo število ≤ 1000, spremenljivka ali oklepaj s spremenljivko,
   celimi števili in `+ - *` (`x ^ (n + 1)`, `x ^ (2 * n)`; števila skupaj ∏(1 + število) ≤ 1001, zato ne
   `(1000 * n + 1000)` ali `(1000*1000*1000)`) ali `(p/q : ℝ)` (`x ^ (1/2 : ℝ)`; `rpow` se ne računa); nobena potenca
   potence (`a^b^c`, `(a^b)^c`, `(a^b)²`, `x²²`). `fun` je dovoljen samo kot argument `deriv` (`deriv (fun x : ℝ => x ^ 2) 3`),
   v njegovem telesu je eksponent samo število (sicer `(fun n : ℕ => 2^n) 999999999999` ali `deriv (fun x : ℝ => 2^x)
   999999999999` izračuna ogromno potenco); največ dva `deriv` in dve vsoti `∑`; meje `Finset.range`, `Finset.Icc` …
   in `Fin` so število ≤ 100, spremenljivka ali oklepaj s takimi in `+`, `-`. Te meje NISO popolne: priča v `∃`
   (`∃ n : ℕ, n = 999999999999 ∧ ∑ i ∈ Finset.range n, i = 0`; `simp` jo vstavi z `exists_eq_left`) jih obide. Pravo
   varovalo sta trda meja pomnilnika in rok (3., (b)); test to preveri z lažnim Leanom (izid `timeout`).
   **Tipi.** Lean števila brez tipa privzame v ℕ, kjer je `2 - 3 = 0` in `7 / 2 = 3` (tudi ∑-indeks in `{x | …}` sta
   ℕ), in ima »smetne« vrednosti `x / 0 = 0`, `0⁻¹ = 0`, `x % 0 = x`, `Real.sqrt (-4) = 0`, `Real.log 0 = 0`. Šolsko
   napačne trditve bi bile »dokazane«. Tipov iz besedila ni mogoče zanesljivo uganiti (pregledi so našli ∑-indeks,
   `↑`, `(7 / 2) ^ n`, množice …), zato jih preveri **Lean sam**: prva vrstica za glavo predloge elaborira trditev z
   izpisom vseh implicitnih argumentov (`pp.explicit`, brez zapisov `∑`/`↑` in skrajšav `⋯`), delavec izpis prebere
   (`preveriElaboracijo` v `lean.mjs`) in vrne `rejected` z razlogom, če vsebuje odštevanje v ℕ (`@HSub.hSub Nat`),
   deljenje v ℕ ali ℤ (`@HDiv.hDiv Nat`/`Int`), ostanek (`@HMod.hMod`, vsak tip), `Nat.sub`/`div`/`mod`/`pred`,
   `Int.div`/`ediv`/`emod`/`tdiv`/`tmod`/`fdiv`/`fmod`/`bdiv`/`bmod`/`toNat`, računanje v `Fin` (po modulu), `Float`
   (`0.5` brez tipa) ali `⋯`. `Nat.cast` takega izraza (`((n - 1 : ℕ) : ℝ)`) vsebuje operacijo v ℕ in je zavrnjen.
   Brez izpisa tipov izid nikoli ni `proved`; `rejected` iz preverbe velja tudi, če Lean pozneje preseže rok.
   Preverjeno z resničnim Leanom na vseh primerih iz pregledov PR #1172 (`∑ i ∈ Finset.range 4, (i - 2) = 1`,
   `(7 / 2) ^ n`, `7 / 2 + 0 ^ n`, `(7 / 2 = 3) = (x = x)`, `∀ n : ℕ, n = 999999999999 → (2:ℕ)^n % 7 = 1` … →
   `rejected`; `↑(7 / 2)` ob `x : ℝ` Lean elaborira v ℝ kot 3,5, zato ni zavrnjen, a tudi ni dokazan).
   Filter besedila zato zahteva samo: tip pri vsaki vezavi `∀`/`∃`/`fun` (`∀ x : ℝ, …`, `∀ (x : ℝ) (n : ℕ), …`; ne
   `∀ x, …`, `∀ x > 0, …`, `∃ x ∈ S, …`, `∀ x : _, …`) in v množici (`{x : ℝ | …}`, ne `{x | …}`: `{x | x + 3 = 1} = ∅`
   je v ℕ resnična brez odštevanja) ter delitelj (`/`, `%`, osnova `⁻¹`), ki je izraz s spremenljivko (`x / (x + 1)`,
   `(x ^ 2 + 1)⁻¹`), število ≠ 0 ali `(število ≠ 0 : tip)`: `x / 0.0`, `x / (1 - 1)`, `(0:ℝ)⁻¹` so zavrnjeni, ker
   preverba tipov deljenja v ℝ ne zavrne. `Real.sqrt 16 = 4`, `Nat.gcd 12 18 = 6`, `Nat.Prime 7`, `1 + 1 = 2` so
   dovoljeni (tip pove Lean). Namerno NI zavrnjeno (L6 mora zapisati predpostavke `x ≠ 0`, `x ≥ 0`, drug model to
   preveri): deljenje v ℝ z izrazom, ki je lahko 0 (`∀ x : ℝ, x / x ≤ 1` »drži«), `Real.sqrt` in `Real.log`
   negativnega ali 0 (Lean: 0). Pripisan ℕ z odštevanjem (`∀ n : ℕ, n - 1 ≤ n`) je zdaj zavrnjen; L6 piše
   `(n : ℝ) - 1` ali ℤ. Preverba elaborira `(<trditev> : Prop)`, izrek isto besedilo kot svoj tip (ista elaboracija,
   pričakovan tip `Prop` oziroma `Sort`).
3. Lean teče neposredno (`lean.exe`, ne `lake`): ob namestitvi (kot skrbnik) `zazeni.bat` v `projekt\` požene
   `lake env node delavec.mjs --shrani-lean orodja\lean.json`, ki zapiše absolutno pot do Leana (`LEAN`) in `LEAN_PATH`
   (Windows nima `printenv`, zato Node). Delavec kot `evklid-lean` nato zažene samo ta `lean` z `LEAN_PATH` iz
   `lean.json` (v `orodja\`, samo branje za `evklid-lean`): med delom ni ne `lake` ne `git` (lake bi kot drug uporabnik
   klical git na mapah skrbnika in pisal v `projekt\`). Preizkušeno na Linuxu: `lean` z `LEAN_PATH` iz
   `lake env printenv LEAN_PATH`, praznim okoljem in cwd v začasni mapi dokaže predlogo (`norm_num`, ~20 s).
   Rok: privzeto 240 s, največ 540 s in vsaj 60 s pod najemom; nato se ubije celo drevo procesov (Windows
   `taskkill /T /F`, Linux lastna skupina procesov in `kill(-pid, SIGKILL)`; če proces po 30 s še drži izhod, delavec
   vseeno nadaljuje, izbris začasne mape ob `EBUSY` ne pokvari izida). Pomnilnik: `-M` (privzeto 6144 MB, Lean sam
   preverja ob dodeljevanju) in **trda meja** `trdaMejaMB`: Windows `omeji.ps1` (PowerShell `Add-Type` s P/Invoke:
   Job Object z `JOB_OBJECT_LIMIT_PROCESS_MEMORY`, `KILL_ON_JOB_CLOSE`, `DIE_ON_UNHANDLED_EXCEPTION`; PowerShell se
   dá v Job in nato s `CreateProcess` zažene Lean, ki je zato v istem Jobu; brez uspešno nastavljenega Joba se Lean ne
   zažene), z `JOB_OBJECT_LIMIT_JOB_MEMORY` (isti znesek za ves Job) in `ActiveProcessLimit` 3 (PowerShell, Lean in morda
   `conhost`; Lean ne zaganja otrok, zato luknja ne more zagnati drugih procesov), privzeto 10240 MB zasedenega
   pomnilnika (da 16 GB prenosnik ne začne zamenjevati na disk). `omeji.ps1` bere ukaz z
   `[string[]](ConvertFrom-Json …)` (PowerShell 5.1 da seznam po cevi kot en objekt) in ob izhodu 125/126 izpiše,
   kateri klic Win32 ni uspel; izid `napaka` nosi izhodno kodo in konec stderr. Okolje za PowerShell in `Add-Type`
   (`csc.exe`): poleg `PATH`, `SystemRoot`, `TEMP` … še `windir`, `SystemDrive`, `ComSpec`, `PSModulePath`,
   `PROCESSOR_ARCHITECTURE`, `NUMBER_OF_PROCESSORS` (brez skrivnosti); Linux `sh -c 'ulimit -v …; exec lean …'` (RLIMIT_AS),
   privzeto 24576 MB, ker naslovni prostor vključuje preslikane `.olean` Mathliba (izmerjeno: VmPeak 14,6 GB, RSS
   5,4 GB pri `import Mathlib`). Ob prekoračitvi GMP ali Lean ne dobi pomnilnika in Lean se konča (preizkušeno na
   Linuxu: `Nat.shiftLeft 1 4294967295` pod mejo 7 GB → »GNU MP: Cannot allocate memory«, izhod 134); izid je
   `timeout` s sporočilom »Lean je presegel mejo pomnilnika«. Nižja prioriteta, očiščeno okolje (brez žetona) v začasni
   mapi, ki se nato izbriše. Omrežja Lean ne rabi; na Windows ga pravilo požarnega zidu »Evklid Lean brez omrezja«
   blokira (izhodne povezave `lean.exe`). Ob vsakem zagonu delavec enkrat preizkusi Lean na `(2:ℝ) + 2 = 4`
   (dnevnik »preizkus Lean: …«, `stanje.json` → `preizkus`), kot `evklid-lean` in z isto mejo.
4. Izid je `proved` le, če v vrstici izreka ni napake ne opozorila o `sorry` in `#print axioms` našteje samo
   `propext`, `Classical.choice`, `Quot.sound` (izpis `lean --json`). Strežnik `proved` sprejme le z znano taktiko in
   dovoljenimi aksiomi. Sporočilo gre na strežnik brez poti na disku in uporabniškega imena.

**Omejen uporabnik (odločitev j 26. 11. 2026).** Na Windows ves delavec (Node in Lean) teče kot lokalni standardni
uporabnik `evklid-lean`, ne kot j: opravilo »Evklid Lean delavec« v Razporejevalniku opravil (ob vklopu, »zaženi, če
je uporabnik prijavljen ali ne«, brez časovne meje, tudi na bateriji). To je najzanesljivejša pot: `runas /savecred`
bi shranil geslo, ki ga lahko uporabi vsak j-jev program, Node pa ne zna zagnati otroka kot drug uporabnik.
`uporabnik.ps1` ob vsaki namestitvi da uporabniku novo naključno geslo, ki ga nihče ne pozna (shrani ga samo
Razporejevalnik), ga skrije s prijavnega zaslona in ga ne da med skrbnike. Pravice: `zazeni.bat` takoj po povišanju,
PRED kopiranjem in prenosi, ustvari `C:\Evklid`, mu da lastnika Administratorji (`/setowner *S-1-5-32-544`, tudi
`lean-delavec`, če že obstaja) in odstrani podedovane pravice (C:\ sicer da »Authenticated Users« spreminjanje):
SYSTEM, skrbniki in j polno, Uporabniki samo branje te mape (brez dedovanja). `uporabnik.ps1` nato
`C:\Evklid\lean-delavec` (zunaj j-jevega profila in OneDrive, kratka pot za MAX_PATH) da lastnika Administratorji in
pravice brez dedovanja: SYSTEM, skrbniki in j polno, `evklid-lean` samo branje in zagon, pisanje samo v `delo\`
(dnevnik, stanje, začasne datoteke). Preden skrbnik spremeni pravice, `uporabnik.ps1` v `delo\` izbriše vse povezave
(junction, simbolne povezave; brisanje povezave ne briše cilja), da `icacls` ne sledi podtaknjeni povezavi. Lean zato ne
more brati `C:\Users\<j>` (tja ima dostop samo lastnik) in ne more spremeniti delavca, Leana, Mathliba ali `lean.json`.
Bere pa lahko, kar lahko bere vsak uporabnik računalnika (npr. `C:\Program Files`), in `nastavitve.json` (žeton, glej
(c)). Ustavitev in posodobitev: `ustavi.bat` oziroma `zazeni.bat` opravilo najprej izklopi (sicer se ob napaki znova
zažene), nato `schtasks /End` (konča samo `cmd.exe`) in `taskkill /F /T /FI "USERNAME eq evklid-lean"` (Node, Lean,
PowerShell), zato po posodobitvi ne tečeta dva delavca. Opravila, ki bi jih `evklid-lean` registriral sam
(standardni uporabnik to sme), `uporabnik.ps1` izbriše pred spremembo pravic (vsa opravila tega uporabnika, nato
`taskkill /FI`; naše opravilo registrira znova na koncu), da noben njegov proces ne tekmuje z brisanjem povezav in
`icacls`. Odstranitev: NAVODILA.md, razdelek »Odstranitev« (opravilo,
profil `C:\Users\evklid-lean` (`Remove-CimInstance` na `Win32_UserProfile`), uporabnik, pravilo požarnega zidu,
`rmdir /s /q C:\Evklid`, ki povezav ne sledi).

**Preostala tveganja (pošteno).** (a) Varovalo pred kodo v trditvi je filter; če bi imel luknjo, bi program tekel kot
`evklid-lean` (brez j-jevih datotek, glej zgoraj) brez omrežja za `lean.exe` (požarni zid; Node delavca omrežje ima).
Na Linuxu `linuxUid` v `nastavitve.json`. (b) Pomnilnik: filter ne more dokazati, da noben dovoljen zapis ne zasede
veliko pomnilnika (npr. `simp`, ki razpiše vsoto, ali odvod produkta), zato je pravo varovalo trda meja (Job Object,
`ulimit -v`). Ta omeji Lean (proces in ves Job, 10 GB), ne celega prenosnika: na 16 GB prenosniku se lahko prenosnik
nekaj minut upočasni. Filter in preverbo tipov prestanejo in jih ustavita samo trda meja ali rok: priča v `∃`
(`∃ n : ℕ, n = 999999999999 ∧ ∑ i ∈ Finset.range n, i = 0`, `∃ n : ℕ, n = 999999999999 ∧ 2 ^ n = 0`). **Ni preizkušeno na Windows**: `omeji.ps1` (struktura `JOBOBJECT_EXTENDED_LIMIT_INFORMATION`,
dedovanje stdout/stderr v Lean, ali se Mathlib naloži pod 10 GB zasedenega pomnilnika, ali `ActiveProcessLimit` 3 zadošča; če Lean `.olean` prebere v
pomnilnik namesto preslikave, je treba `trdaMejaMB` povečati) in nič od zagona kot `evklid-lean` (ACL, požarni zid,
`taskkill /FI`, Lean z `LEAN_PATH` iz mape skrbnika). Preizkus ob zagonu delavca to pokaže v `dnevnik.txt`
(»preizkus Lean: proved«); pred spojitvijo naj ga j enkrat preveri (NAVODILA, »Kako vidim, da dela«). Preizkušeno na
Linuxu: Lean neposredno z `LEAN_PATH`, `ulimit -v`, zavrnitev velikih števil, lažen Lean v testih. (c) Kdor ima žeton,
lahko pošilja izide (lažen `proved`) ali bere trditve; žeton je samo na Renderju in v `nastavitve.json` na prenosniku
(bere ga tudi Lean kot `evklid-lean`, a brez omrežja ga ne pošlje). (d) Kdor ima dostop do strežnika, lahko v vrsto
vpiše karkoli; zato delavec trditev preveri še enkrat. (e) Mathlib in njegove taktike so koda, ki ji zaupamo (kot pri
`lake build`); napaka v Mathlibu ali Leanu (npr. elaborator, ki ga sproži dovoljen zapis) bi bila zunaj filtra. Namestitev
prenese elan, Lean in Mathlib (`lake exe cache get`) z interneta; Node, Git in elan so preverjeni s SHA-256 v
`zazeni.bat`, orodjarna Leana in prevedeni Mathlib (`.olean`, ki nosijo tudi kodo za `initialize`) pa nimata pripete
kontrolne vsote: zaupamo GitHubu in strežniku predpomnilnika Mathliba. (f) Trde povezave (hard link) v `delo\` niso
odstranjene; `icacls` na `delo\` bi spremenil pravice datoteke, na katero kaže taka povezava (Windows za trdo
povezavo zahteva pravico pisanja na cilj, zato je to nizko tveganje). (g) Napačen prevod koraka v Lean (L6) da
pravilen dokaz napačne trditve; zato L6 prevod preveri drug model.

**Namestitev.** `scripts/lean-delavec/zazeni.bat` (dvoklik): najprej preveri, da je mapa razpakirana (`delavec.mjs`,
`omeji.ps1`, `projekt\lean-toolchain`; sicer sporočilo »MAPA NI RAZPAKIRANA«), vpraša za skrbnika, zaščiti
`C:\Evklid` (zgoraj), ustavi starega delavca, se skopira v `C:\Evklid\lean-delavec` (`robocopy`, brez
`nastavitve.json`, `orodja\`, `delo\`, `.lake\`), Node v24.22.3, MinGit 2.51.0 in elan v4.4.0 (vsi s SHA-256; elan,
Lean in predpomnilnik Mathliba v `orodja\`, ne v profilu), Lean in Mathlib iz `scripts/lean-delavec/projekt/` (iste
različice kot `lean/`, test to preveri), `lake exe cache get` znova, kadar se `lean-toolchain` ali `lake-manifest.json`
razlikujeta od shranjenih v `orodja\mathlib-rev.txt`, `orodja\lean.json` (zgoraj, 3.), žeton v `nastavitve.json`,
`uporabnik.ps1` (uporabnik, pravice, požarni zid, opravilo), pokrov na polnilcu »ne naredi nič« (`powercfg`), zagon
opravila. Git in lake rabi samo namestitev (kot skrbnik). Opravilo zažene `zazeni.bat delavec` (zanka; če se Node
konča, po 30 s znova). Delavec se nikoli ne ustavi sam (napaka → dnevnik, premor 30 s do 5 min), piše
`delo\stanje.json` (atomarno; začasna datoteka se ob napaki izbriše) in `delo\dnevnik.txt` (vrtenje pri 1 MB, 3 stare
kopije) in drži Windows budne (`SetThreadExecutionState`, kot `rtx.py` v `docs/3d.md`). V `zazeni.bat` ni blokov v
oklepajih s potmi (`)` v imenu mape bi jih pokvaril). Linux (razvoj): v projektu z Mathlibom
`lake env node scripts/lean-delavec/delavec.mjs --shrani-lean scripts/lean-delavec/orodja/lean.json`.

**Modul.** `server/lean-vrsta.js` je nov: noben obstoječ modul nima vrste za zunanjega delavca z lastnim žetonom
(`server/cas.js` zaganja SymPy na strežniku, `server/preverjevalniki.js` samo poroča stanje). Testi:
`test/lean-vrsta.test.js` (filter z vsemi primeri iz pregledov PR #1172; preverba tipov: tabela trditev → filter →
izpis Leana (skrajšan resnični izpis) → izid za vse primere iz pregledov; resničen Lean, kadar je nastavljen
`EVKLID_LEAN_E2E=<lean.json>`; lean.json, ukaz s trdo mejo; zanka delavca z
lažnim Leanom in strežnikom: dokaz, `LEAN_PATH`, `ulimit -v`, cwd, okolje brez žetona, meja pomnilnika → `timeout`,
napaka zagona, zastarel Mathlib, rok ubije drevo procesov, 409, nedosegljiv strežnik, premor; vrstni red zaščit v
Windows skriptah).
