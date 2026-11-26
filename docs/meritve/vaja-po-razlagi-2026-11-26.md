# Gumb »Podobna naloga«: prava tema in pravilne naloge (26. 11. 2026)

## Povzetek
- Glavna številka: 11 od 156 nalog za gumbe ima napako (9 ni na temi, 2 odgovora sta napačna ali dvoumna; 7,1 %,
  95-% interval 4,0–12,2 %; cilj 0, nižje je bolje), n = 156 nalog iz 52 gumbov na 200 primerih. Gumbov z napačno temo
  je po popravku v tem PR 0 od 52 (0–6,9 %); pred popravkom 1 od 54 in 3 teme iz nižjega razreda.
- Pomeni: izbira teme je po popravku varna, naloge nekaterih generatorjev pa niso na temi, na katero kažejo (v
  Vadnici enako kot pri gumbu). Merilo K-08 (0 napak na 200 primerih) ni doseženo, zato gumb ostane izklopljen.
- Ne pomeni: da so vse naloge v Vadnici pravilne. Preverjenih je 52 od 463 generatorjev, odgovore je preveril model
  (ne človek, ne SymPy).

## Nabor
- Vir in različica: `test/fixtures/instruktor-vaja/primeri.json` (200 primerov: nastavitve učenca, besedilo, ki ga
  inštruktor napiše v `<<ODPRI vaja="…">>`, sprejemljive teme). Brez uradnih virov (gumb odpira samo naloge iz
  generatorjev, zato uradnih rešitev za to meritev ni).
- Kdo je določil pričakovani izid in kdaj: model Claude Opus 26. 11. 2026 pred prvim zagonom kode, samo iz kataloga
  tem in lastnega znanja, brez branja kode. Navodilo je dovoljevalo le teme učenčeve poti; zato se teme nižjih
  razredov štejejo posebej.
- Sestava: MAT 90, FIZ 40, KEM 35, BIO 35; vse poti OŠ in SŠ; vrste: ime teme 50, parafraza 40, podtema 40, dvoumno
  25, splošno 20, drug predmet 15, drug razred 10. 41 primerov nima sprejemljive teme (vsak gumb bi bil napačen).
- Skriti kontrolni del: ne.
- Naloge: za vsak gumb tri naloge (ravni 1, 2, 3), kot jih da aplikacija (`generateTask`, učenčev razred, seme iz
  id-ja primera).

## Metoda
- Ukaz: `node scripts/meri-vaja-po-razlagi.mjs --json izid.json --naloge naloge.json` (teme, samopreverba kode,
  naloge za reševanje brez odgovorov in ločen ključ). Lokalno, brez klicev API.
- Commit `main`: c71794b9c2547cbd13f838501ada995ed6676f3f, s popravki tega PR.
- Ocenjevanje teme gumba: program (primerjava s sprejemljivimi temami). Ocenjevanje nalog: model Claude Fable je vseh
  168 nalog (pred popravkom; 156 jih ostane) rešil sam, brez ključa, in za vsako ocenil, ali je na temi in ali je
  besedilo nedvoumno. Odstopanja sem preveril ročno ob kodi generatorja. En ocenjevalec, zato ujemanja ni.

## Izidi
| Merilo | Vrednost | n | 95-% interval | Cilj | Prej |
|---|---|---|---|---|---|
| Gumb z napačno temo učenčeve poti | 0 | 52 gumbov | 0,0–6,9 % | 0 | 1 od 54 |
| Gumb na temo nižjega razreda | 1 (SŠ 3 → SŠ 2) | 52 | | po j-jevi kartici | 3 (od tega 2 OŠ za dijaka) |
| Gumb, kjer ni sprejemljive teme | 0 | 41 | 0,0–8,6 % | 0 | 1 |
| Pokritost: pravilen gumb, kjer tema obstaja | 51 (32 %) | 159 | 25,3–39,7 % | višje je bolje | 52 |
| Naloga ni na temi gumba | 9 | 156 nalog | 3,1–10,6 % | 0 | |
| Odgovor napačen ali dvoumen | 2 | 156 | 0,4–4,6 % | 0 | |
| Koda ne sprejme svojega odgovora | 0 | 149 s številskim, izbirnim ali ulomkovnim odgovorom | | 0 | |

Pokritost po vrsti: ime teme 48 od 50, parafraza 0 od 40, podtema 0 od 40. Gumb se pokaže skoraj samo, kadar
inštruktor napiše ime teme.

## Napake in neuspehi
Teme gumbov (popravljeno v tem PR, `server/vaja-po-razlagi.js`):
- `V123` »elektrika« (OŠ 9, FIZ) → Elektromagnet: koren iskanja je za oba »elekt«. Zdaj mora vsaka beseda ustrezati
  celi besedi imena teme (do sklona natančno). Isto pravilo odstrani še `V145` (pravilen gumb le po naključju korena).
- `V130` »lom svetlobe« (SŠ 2) → OŠ 8 Lom svetlobe in `V157` »kovine« (SŠ 4) → OŠ 8 Kovine: iskanje je zajelo tudi OŠ.
  Zdaj samo tema iste šole (j-jeva kartica, priporočena možnost).
- `V090` »logaritem« (SŠ 3) → SŠ 2 Logaritem: ponovitev iz nižjega letnika iste šole, ostane.

Naloge (generatorji, niso popravljeni v tem PR; veljajo tudi za Vadnico):
- `pospesek` pri temah Prosti pad (OŠ 9) in Prosti pad in navpični met (SŠ 1): vseh 6 nalog je splošno pospešeno
  gibanje (avto, kolesar), nobena ni prosti pad. Teme nimajo drugega generatorja.
- `ulomki-racunanje` pri temi Seštevanje in odštevanje ulomkov: `V005/2` je množenje ulomkov.
- `dod-fiz-ss-stojece-pojmi` pri temi Stoječe valovanje: `V099/2` je potujoče valovanje.
- `kvadratni-koren`: `V060/1` je »Izračunaj 20²« (kvadriranje; mejno, del snovi poglavja).
- `dod-fiz-ss-plinska-enacba` (`V097/3`): koda računa s T = t + 273 K in zahteva tri decimalke; učenec, ki računa s
  273,15 K, dobi 1,291 kg/m³ in ga preverjanje zavrne. Ista pretvorba je v več generatorjih FIZ.
- `bio-ss-3-imunski-sistem` (`V173/2`): »Solna kislina v želodcu« ima dve zagovorljivi možnosti (Pregrada in
  Nespecifična obramba).
- `V009/2` se sklicuje na graf: naloga ima sliko, reševalec je ni videl. Ni napaka.

## Omejitve
- Sprejemljive teme in ocene nalog je dal model (Opus oziroma Fable), ne učitelj; robne primere (npr. `V060/1`) bi
  učitelj lahko ocenil drugače.
- Merjena je izbira teme iz besedila, ki ga bo pisal inštruktor; kako pogosto in s kakšnim besedilom ga bo res pisal,
  bo znano šele s pravilom v pozivu (profil B).
- Odgovori nalog niso preračunani s SymPy (PV-10); 7 nalog ima besedilni odgovor, ki ga koda ne samopreveri.
- Naloge so iz 52 generatorjev; drugi generatorji iste teme (pri temah z več generatorji) niso zajeti.

## Stroški
Klicev API Evklida: 0 (primere in reševanje sta naredila modela v razvojni seji). Cena v mesečni meji plačljivih
meritev: 0 $.
