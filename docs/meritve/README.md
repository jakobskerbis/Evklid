# Poročila meritev: enotna predloga (K-15)

Načrt dviga kakovosti po neodvisni reviziji (j odobril 26. 11. 2026): vsaka trditev o kakovosti Evklida
(pravilnost matematike, pedagogika, hitrost, dostopnost, varnost, stroški) mora imeti poročilo po tej predlogi.
Uspešen CI ni sam po sebi dokaz matematične ali pedagoške pravilnosti; samodejna ocena (program ali model) se
nikoli ne predstavlja kot strokovni pregled človeka.

Ime datoteke: `docs/meritve/<tema>-<LLLL-MM-DD>.md`, surovi izid poleg nje v `.json` z istim imenom. Meritev, ki
primerja »prej« in »potem«, ima obe številki v istem poročilu in z isto skripto na istem stroju.

## Predloga

```markdown
# <Kaj merimo> (<D. M. LLLL>)

## Povzetek
- Glavna številka: <vrednost> (cilj <cilj>, smer: nižje/višje je bolje), n = <število primerov>
- Pomeni: <ena poved, kaj to pove učencu ali j-ju>
- Ne pomeni: <ena poved, česa ta meritev ne dokazuje>

## Nabor
- Vir in različica: <datoteka, različica, sha256 ali commit>; delež uradnih virov (RIC, DMFA, ZOTKS): <x %>
- Kdo je določil pričakovani izid in kdaj: <človek / ločen model, pred zagonom kode>
- Skriti kontrolni del: <da, x % | ne>; ali so primeri iz istega vira kot razvoj: <da/ne>
- Sestava: <po predmetu, temi, ravni, vrsti napake>

## Metoda
- Ukaz: `<node scripts/… --json docs/meritve/….json>`
- Commit `main`: <polni SHA>; model(i) in nastavitve: <ime, temperatura, način>; stroj in okolje: <…>
- Ocenjevanje: <program / model / človek>; pri več ocenjevalcih ujemanje (Krippendorffov α ali κ): <…>

## Izidi
| Merilo | Vrednost | n | 95-% interval | Cilj | Prej |
|---|---|---|---|---|---|

## Napake in neuspehi
Vsak primer, ki ni dosegel cilja, z oznako in kratkim opisom; napačno potrjene trditve vedno naštete posebej.

## Omejitve
Kaj meritev ne zajame (naprave, jeziki, teme, velikost vzorca, isti model kot pisec, …).

## Stroški
Klicev API: <n>, cena: <$> (mesečna meja za plačljive meritve: 60 $, j 26. 11. 2026).
```

## Pravila

1. **n in interval.** Delež vedno z n; pri n < 30 ali deležu 0 % / 100 % še 95-% interval (Wilson ali »pravilo treh«:
   0 napak na n primerih pomeni največ ~3/n z 95-% gotovostjo).
2. **Neodvisnost.** Pričakovani izid je določen pred zagonom in ga ni napisal sistem, ki ga merimo. Inštruktor ne sme
   biti vir referenčnih odgovorov. Ocenjevalec model je naveden kot model, ne kot strokovnjak.
3. **Nepreverjeno je del rezultata.** Pri preverjanju matematike se poleg »napačno potrjenih« vedno poroča delež
   statusa »Nepreverjeno« (glavna metrika: 0 napačno potrjenih).
4. **Brez izbiranja.** Poročilo zajame vse primere nabora; izločeni primeri so našteti z razlogom.
5. **Ponovljivost.** Ukaz in commit zadoščata, da kdorkoli ponovi meritev; naključni del ima seme.
6. **Nadzorna plošča.** Glavno številko vpiše nit, ki je merila, v zbirko `data/kakovost/meritve` nadzorne plošče
   (polja `vrednost`, `cilj`, `n`, `metoda`, `vir` = pot do poročila, `smer`, `datum`).
