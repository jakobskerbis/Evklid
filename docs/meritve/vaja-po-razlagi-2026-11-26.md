# Gumb »Podobna naloga«: prava tema in pravilne naloge (26. 11. 2026)

## Povzetek
- Glavna številka: gumbi z vsaj eno težavo (napačna tema gumba ali naloga, ki ni na temi ali ima napačen ali dvoumen
  odgovor): 0 od 52 po popravkih tega PR (0–6,9 %; cilj 0, nižje je bolje); prej 9 od 56 (16,1 %, 8,7–27,8 %).
  n = 200 primerov, 52 gumbov, 156 nalog.
- Pomeni: na tem naboru gumb po popravkih ne odpre napačne teme in vse naloge zanj so na temi in pravilne po oceni
  neodvisnega reševalca (model). Popravki generatorjev veljajo tudi za Vadnico.
- Ne pomeni: da je gumb varen na novih primerih. Popravki so narejeni na napakah tega nabora, zato številka po
  popravku ni neodvisna ocena; za oceno je potreben nov, ločen nabor (približno 100 primerov iz druge seje). Gumb se
  pokaže skoraj samo, ko inštruktor napiše ime teme (48 od 52 gumbov). Nič od tega ni preveril človek.

## Nabor
- Vir in različica: `test/fixtures/instruktor-vaja/primeri.json` (200 primerov: nastavitve učenca, besedilo, ki ga
  inštruktor napiše v `<<ODPRI vaja="…">>`, sprejemljive teme). Brez uradnih virov (gumb odpira samo naloge iz
  generatorjev).
- Kdo je določil pričakovani izid in kdaj: model Claude Opus 26. 11. 2026 pred prvim zagonom kode, samo iz kataloga
  tem in lastnega znanja, brez branja kode. Navodilo je dovoljevalo le teme učenčeve poti; teme nižjih razredov se
  zato štejejo posebej (j 26. 11.: ponovitev iz nižjega letnika iste šole da, OŠ za dijaka ne).
- Ali so primeri iz istega vira kot razvoj: da. Popravki tega PR so narejeni na napakah tega nabora.
- Sestava: MAT 90, FIZ 40, KEM 35, BIO 35; vse poti OŠ in SŠ; vrste: ime teme 50, parafraza 40, podtema 40, dvoumno
  25, splošno 20, drug predmet 15, drug razred 10. 41 primerov nima sprejemljive teme.
- Skriti kontrolni del: ne.
- Naloge: za vsak gumb tri naloge (ravni 1, 2, 3), kot jih da aplikacija (`generateTask`, učenčev razred, seme iz
  id-ja primera). Zajetih je 52 generatorjev od 376, ki imajo temo OŠ ali SŠ (od 704 vseh).

## Metoda
- Ukaz: `node scripts/meri-vaja-po-razlagi.mjs --json izid.json --naloge naloge.json` (teme, samopreverba kode,
  naloge za reševanje brez odgovorov in ločen ključ). Lokalno, brez klicev API.
- »Prej« je isti skript na istem naboru, s `server/vaja-po-razlagi.js` in generatorji iz `main` c71794b9c2547cbd13f838501ada995ed6676f3f
  (`git checkout c71794b -- server/vaja-po-razlagi.js server/practice/generators public/sim/bio-data.js`).
- »Potem«: glava tega PR (commit s tem poročilom), Node 22.23.
- Ocenjevanje teme gumba: program (primerjava s sprejemljivimi temami). Ocenjevanje nalog: model Claude Fable je
  naloge rešil sam, brez ključa (168 prej, nato 16 spremenjenih), in za vsako ocenil, ali je na temi in ali je
  besedilo nedvoumno. Odstopanja je ob kodi generatorja preveril Claude (avtor PR), ne človek. En ocenjevalec, zato
  ujemanja ni.

## Izidi
| Merilo | Potem | n | 95-% interval | Cilj | Prej |
|---|---|---|---|---|---|
| Gumbi z vsaj eno težavo | 0 | 52 gumbov | 0,0–6,9 % | 0 | 9 od 56 (8,7–27,8 %) |
| Gumb z napačno temo učenčeve poti | 0 | 52 | 0,0–6,9 % | 0 | 1 od 56 (0,3–9,4 %) |
| Gumb na temo nižjega razreda | 1 (SŠ 3 → SŠ 2, dovoljeno) | 52 | | po j-jevi kartici | 3 (od tega 2 OŠ za dijaka) |
| Gumb, kjer v nalogi ni sprejemljive teme | 1 (isti V090) | 41 | 0,4–12,6 % | 0 razen ponovitve | 4 od 41 (3,9–22,5 %) |
| Pokritost: pravilen gumb, kjer tema obstaja | 51 (32,1 %) | 159 | 25,3–40,3 % | višje je bolje | 52 |
| Naloge s težavo (ni na temi, napačen ali dvoumen odgovor) | 0 | 156 nalog | 0,0–2,4 % | 0 | 13 od 168 (4,6–12,8 %) |
| Koda ne sprejme svojega odgovora | 0 | 149 | | 0 | 0 |

Naloge so v gručah (tri na gumb, več gumbov ima isti generator), zato je odločilna enota gumb, ne naloga. Pokritost
po vrsti: ime teme 48 od 50, parafraza 0 od 40, podtema 0 od 40; za parafraze, podteme, splošne in druge predmete je
preizkušena samo pot »brez gumba«.

## Napake in neuspehi
Teme gumbov (popravljeno v `server/vaja-po-razlagi.js`):
- `V123` »elektrika« (OŠ 9, FIZ) → Elektromagnet: koren iskanja je za oba »elekt«. Zdaj mora vsaka beseda ustrezati
  celi besedi imena teme (do sklona natančno, brez strešic kot pri iskanju). Isto pravilo odstrani še `V145`
  (»elektrokemijski členi«, pravilen gumb le po naključju korena).
- `V130` »lom svetlobe« (SŠ 2) → OŠ 8 in `V157` »kovine« (SŠ 4) → OŠ 8: zdaj samo tema iste šole.
- `V090` »logaritem« (SŠ 3) → SŠ 2 Logaritem: ponovitev iz nižjega letnika iste šole, ostane (pripeto v testu).

Naloge (popravljeno v generatorjih; velja tudi za Vadnico):
- `pospesek` pri temah Prosti pad (OŠ 9) in Prosti pad in navpični met (SŠ 1): vseh 6 nalog je bilo splošno
  pospešeno gibanje (avto, kolesar). Zdaj prosti pad (hitrost, pot, čas padca; pri SŠ višina navpičnega meta).
- `ulomki-racunanje`: pri Seštevanju in odštevanju ulomkov je bilo tudi množenje (`V005/2`). Zdaj po temi.
- `krog`: pri Obsegu in ploščini kroga je bil krožni lok (`V008/3`). Zdaj lok in izsek samo pri svoji temi.
- `kvadratni-koren`: pri Kvadratnem korenu »Izračunaj 20²« (`V060/1`). Zdaj pri korenu koren, pri kvadratu kvadrat.
- `dod-fiz-ss-stojece-pojmi`: pri Stoječem valovanju potujoče valovanje (`V099/2`). Zdaj odboj in struna pri stoječem,
  potujoče valovanje in lom pri temi Valovanje.
- `dod-fiz-ss-plinska-enacba` (`V097/3`) in `dod-fiz-ss-toplotni-stroji`: koda je računala s T = t + 273 K in
  zahtevala tri decimalke, zato je preverjanje zavrnilo učenca, ki računa s 273,15 K. Zdaj sprejme oba rezultata.
  Enaka pretvorba je še v drugih generatorjih FIZ in KEM (skupaj 59 mest), ki niso bili v vzorcu.
- `s3-imunost` (`V173/2`): »Solna kislina v želodcu« je imela dva zagovorljiva odgovora, ker so pregrade del
  nespecifične obrambe. Kategoriji sta zdaj »pregrada (prva obrambna linija)« in »nespecifična obramba v telesu
  (druga linija)«.
- Reševalec je po popravku označil `V008/3` (π ali 3,14) in `V097/3` (273 ali 273,15 K) kot nejasni, ker se rezultata
  pri zahtevanem zaokroževanju razlikujeta; preverjanje sprejme oba, zato nista šteta kot napaka.
- Dvomljivo, ne šteto kot napaka: `V173/1` (serum: imunizacija ali specifična obramba), `V136/1–3` (Stehiometrija v SŠ 1
  ima molsko maso in masni delež, brez računa po enačbi reakcije).

## Omejitve
- Številka »potem« ni neodvisna (popravki na istem naboru); pred odločitvijo o vklopu je potreben nov nabor.
- Sprejemljive teme in ocene nalog je dal model (Opus oziroma Fable), ne učitelj; pisec primerov, reševalec, avtor
  generatorjev in inštruktor so vsi Claude, zato so njihove slepe pege lahko enake.
- Ena naloga na raven ne pove, kako pogosto generator, ki ne upošteva teme, zaide; to bi pokazalo 100 semen na par
  (tema, generator) za vse generatorje z več temami.
- Merjena je izbira teme iz besedila, ki ga bo pisal inštruktor; kako pogosto in s kakšnim besedilom ga bo res pisal,
  bo znano šele s pravilom v pozivu (profil B).
- Odgovori nalog niso preračunani s SymPy (PV-10); 7 nalog ima odgovor s koeficienti (urejanje enačb), ki ga koda ne
  samopreveri; reševalec se je z vsemi 7 ujemal.

## Stroški
Klicev API Evklida: 0 (primere in reševanje so naredili modeli v razvojni seji). Cena v mesečni meji plačljivih
meritev: 0 $.
