# Pravilnost prepisa uradnih nalog v nabor inštruktorja (26. 11. 2026)

## Povzetek
- Glavna številka: 3 postavke s katerokoli napako od 83 v vzorcu (3,6 %; 95-% interval 1,2–10,1 %; cilj 0, nižje je
  bolje), n = 83. Na 80 postavkah vzorca, ki so v končnem naboru: 2 napaki v odgovoru (2,5 %, interval 0,7–8,7 %).
- Pomeni: besedilo uradnih nalog v naboru K-06/K-16 (`docs/nabor-instruktorja.md`) je na vzorcu prepisano brez napake;
  obe napaki v odgovoru sta bili obliki odgovora, ki ju je dodal prepisovalec in ju uradna navodila ne navajajo.
- Ne pomeni: da je nabor brez napak v odgovoru. Popravljeni sta le postavki iz vzorca. Pri 2,5 % je v 1.220 uradnih
  postavkah pričakovano še okoli 30 napak v odgovoru (po intervalu približno 8 do 106), večinoma iste vrste (dodana
  oblika). Nič od tega ni preveril človek.

## Nabor
- Vir in različica: prepisi 34 izpitnih rokov (58 pol) RIC: splošna matura 2021–2026 MAT OR, MAT VR 2023–2026, FIZ
  2025 (2 roka), KEM 2024–2025 (3 roki), BIO 2023 in 2025; NPZ MAT 6. in 9. razred 2022–2026. Prepisi so v zasebni mapi
  projekta (`k06-nabor/uradno/`, sha256 stika datotek po imenu po popravkih `0a4e8b69…6fb01d0`; sha256 pred popravki ni
  bil zapisan). V repozitoriju šifrirano (`test/fixtures/instruktor-nabor/`, sha256 v `sestava.json`).
- Vzorec: 5 % uporabnih postavk vsake datoteke, najmanj 2 na datoteko, vrstni red sha256(»vz1« + id), izbran pred
  preverjanjem: 83 od 1.272 uporabnih ob izbiri. Ker je najmanj 2 na datoteko, so majhne datoteke nadpovprečno
  zastopane; skupni delež je približek za cel nabor. 3 postavke vzorca niso v končnem naboru (2 ponovljena dela B
  pri VR, 1 izločena po tem preverjanju), zato za končni nabor velja n = 80.
- Kdo je določil pričakovani izid in kdaj: model Claude Fable je 26. 11. 2026 po prepisu vsako postavko primerjal z
  izvirnimi polami in uradnimi navodili za ocenjevanje RIC (PDF). Pričakovani izid je torej uradno besedilo, kot ga je
  prebral model.
- Skriti kontrolni del: vzorec je iz vseh prepisov, ne glede na razdelitev.

## Metoda
- Ukaz: `node scripts/nabor-vzorec.mjs --vzorec <mapa s prepisi>` (izbira) in
  `node scripts/nabor-vzorec.mjs --prestej <mapa s prepisi> <izidi preverjanja *.json>` (štetje in intervali). Ponovna
  izbira na današnjih prepisih da 82 enakih postavk: ena se zamenja, ker je bila `N261-401-2-1/7.a` po preverjanju
  izločena.
- Prepis: Claude Opus, ena pola na zagon, po pravilih `k06-nabor/OBLIKA-PREPISA.md` (odgovor samo iz navodil, negotovi
  odgovori označeni in izločeni).
- Preverjanje: Claude Fable, drug model iste družine (Claude) kot prepis, trije ločeni zagoni (matura MAT 34, NPZ MAT 20,
  FIZ/KEM/BIO 29). Štiri merila: besedilo, odgovor, rešljivost brez slike (opis slike ne izda odgovora), tema.
  Ocenjevalec je model, ne strokovnjak; en ocenjevalec na postavko, zato ujemanja ocenjevalcev ni.
- Commit `main`: 8fc9ec2584ad1b1209abdb58194669d40d07fdb1.

## Izidi
| Merilo | Napak | n | 95-% interval (Wilson) | Cilj |
|---|---|---|---|---|
| Katerakoli napaka | 3 | 83 | 1,2–10,1 % | 0 |
| Besedilo ni zvesto | 0 | 83 | 0,0–4,4 % | 0 |
| Odgovor se ne ujema z navodili | 2 | 83 | 0,7–8,4 % | 0 |
| Ni rešljivo ali opis slike izda odgovor | 1 | 83 | 0,2–6,5 % | 0 |
| Napačna tema | 0 | 83 | 0,0–4,4 % | 0 |
| Katerakoli napaka, samo postavke v končnem naboru | 2 | 80 | 0,7–8,7 % | 0 |

## Napake in neuspehi
- `N251-401-3-1/8.d` (odgovor): med sprejetimi oblikami je bila oblika, ki je navodila ne dovolijo (zahtevan je drug
  zapis). Odstranjena.
- `M252-421-1-2/5.4` (odgovor): k odgovoru je bil dodan pojasnjevalni dodatek, ki ga navodila ne navajajo. Odstranjen.
- `N261-401-2-1/7.a` (rešljivost): opis grafa izda odgovor na prvo podvprašanje. Postavka označena kot negotova in
  izločena.
- Opombe brez napake: več postavk združuje več neoštevilčenih podvprašanj v eno; pri nekaterih je del točk za risbo, ki
  je samodejno ni mogoče preveriti; konstante z lista konstant so pri nekaterih postavkah samo v opombi. Kaj mora
  zato upoštevati meritev inštruktorja, je v `docs/nabor-instruktorja.md` (Pravila za meritev).

## Omejitve
- Vzorec 83 postavk; meja velja samo za vrste napak, ki se v vzorcu lahko pokažejo.
- Dodane oblike odgovora (npr. pretvorba enote) so v prepisih zapisane skupaj z uradnimi, ločene samo v opombi
  postavke. Obe najdeni napaki sta te vrste, zato je to glavno tveganje v preostalem naboru. Ločitev na uradne in
  dodane oblike je naloga pred prvo meritvijo inštruktorja.
- Ocenjevalec je pri robnih primerih (opis slike, ki vsebuje odčitane vrednosti) presojal blago; delež »opis slike
  izda odgovor« je zato verjetno podcenjen. Celoten pregled opisov slik je naloga pred prvo meritvijo.
- Prepis in preverjanje sta oba modela iste družine (Claude). Človeški pregled vzorca je j premaknil na čas po prvem
  plačilu.

## Stroški
Klicev API Evklida: 0 (prepis in preverjanje sta tekla v razvojni seji, ne prek API aplikacije), cena v mesečni meji
plačljivih meritev: 0 $.
