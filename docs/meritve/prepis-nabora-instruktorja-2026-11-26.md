# Pravilnost prepisa uradnih nalog v nabor inštruktorja (26. 11. 2026)

## Povzetek
- Glavna številka: 2 postavki z napako v odgovoru od 83 (2,4 %; cilj 0, nižje je bolje), n = 83
- Pomeni: uradne naloge v naboru K-06/K-16 (`docs/nabor-instruktorja.md`) so prepisane zvesto; napak v besedilu na
  vzorcu ni bilo, obe napaki v odgovoru sta bili dodani obliki, ki ju uradna navodila ne navajajo (popravljeni).
- Ne pomeni: da je vsaka od 1.220 uradnih postavk brez napake (zgornja meja 95-% intervala za napake v odgovoru je
  8,4 %), niti da je kaj preveril človek.

## Nabor
- Vir in različica: prepisi 37 pol RIC (matura 2021–2026 MAT OR/VR, FIZ, KEM, BIO; NPZ 6 in 9 MAT 2022–2026) v zasebni
  mapi projekta `k06-nabor/uradno/`; v repozitoriju šifrirano (`test/fixtures/instruktor-nabor/`, sha256 v `sestava.json`).
- Vzorec: 5 % uporabnih postavk vsake datoteke, najmanj 2 na datoteko, izbira po sha256(»vz1« + id) pred preverjanjem
  (83 od 1.272).
- Kdo je določil pričakovani izid: izvirne pole in uradna navodila za ocenjevanje RIC (PDF).
- Skriti kontrolni del: vzorec je iz vseh prepisov, ne glede na razdelitev.

## Metoda
- Prepis: Claude Opus, ena pola na zagon, po pravilih `k06-nabor/OBLIKA-PREPISA.md` (odgovor samo iz navodil, negotovi
  odgovori označeni in izločeni).
- Preverjanje: Claude Fable (drug model kot prepis), trije ločeni zagoni (matura MAT 34, NPZ MAT 20, FIZ/KEM/BIO 29),
  vsako postavko primerja s stranmi pole in navodil; štiri merila: besedilo, odgovor, rešljivost brez slike (opis slike
  ne izda odgovora), tema. Ocenjevalec je model, ne strokovnjak; ujemanja ocenjevalcev ni (en ocenjevalec na postavko).
- Commit `main`: 8fc9ec2584ad1b1209abdb58194669d40d07fdb1.

## Izidi
| Merilo | Napak | n | 95-% interval (Wilson) | Cilj |
|---|---|---|---|---|
| Besedilo ni zvesto | 0 | 83 | 0,0–4,4 % | 0 |
| Odgovor se ne ujema z navodili | 2 | 83 | 0,7–8,4 % | 0 |
| Ni rešljivo ali opis slike izda odgovor | 1 | 83 | 0,2–6,5 % | 0 |
| Napačna tema | 0 | 83 | 0,0–4,4 % | 0 |

## Napake in neuspehi
- `N251-401-3-1/8.d`: med sprejetimi odgovori je bil »1,8«, navodila zahtevajo zapis s stotini (1,80 €). Odstranjeno.
- `M252-421-1-2/5.4`: odgovor je imel dodatek »(organske snovi)«, ki ga navodila ne navajajo. Odstranjeno.
- `N261-401-2-1/7.a`: opis grafa izda odgovor na prvo podvprašanje. Postavka označena kot negotova in izločena.
- Opombe brez napake: več postavk združuje več neoštevilčenih podvprašanj v eno; pri nekaterih je del točk za risbo, ki
  je samodejno ni mogoče preveriti (meritev oceni samo besedilni del); konstante z lista konstant so pri nekaterih
  postavkah samo v opombi, zato jih mora meritev dodati v besedilo naloge.

## Omejitve
- Vzorec 83 postavk; meja velja samo za vrste napak, ki se v vzorcu lahko pokažejo.
- Prepisovalci so po lastni presoji v nekaj primerih dodali enakovredne oblike odgovora (npr. pretvorbo enote); te so
  označene v opombi postavke, ne pa ločene od uradnih oblik.
- Prepis in preverjanje sta oba modela iste družine (Claude). Človeški pregled vzorca je j premaknil na čas po prvem
  plačilu.

## Stroški
Klicev API Evklida: 0 (prepis in preverjanje sta tekla v razvojni seji, ne prek API aplikacije), cena v mesečni meji
plačljivih meritev: 0 $.
