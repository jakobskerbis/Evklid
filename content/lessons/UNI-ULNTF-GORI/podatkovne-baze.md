---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Lestvica nogometne lige v športni aplikaciji: klub, odigrane tekme, točke. Lestvica najboljših v spletni igri: vsak igralec ima vzdevek, raven in klan, vrstni red pa se osveži v trenutku, ko kdo zmaga.

Na videz dve različni stvari. V ozadju pa ista ideja: podatki so shranjeni v **tabelah**, vsaka vrstica opisuje eno stvar (klub, igralca), tabele pa so med seboj povezane s številkami. Ko tapneš »razvrsti po točkah«, aplikacija bazi pošlje kratek ukaz in dobi nazaj novo tabelo.

Preglednico že poznaš. Zakaj ni dovolj? Liga ima tisoče igralcev, več ljudi hkrati vnaša rezultate, isti podatek pa ne sme biti zapisan na treh mestih z različnimi vrednostmi. Za to skrbi **podatkovna baza**, za vprašanja nanjo pa jezik **SQL**.

## Razlaga

**Dve tabeli namesto ene.** Vzemimo majhno ligo. Prva tabela opisuje klube:

| id_kluba | ime | mesto |
|---|---|---|
| 1 | Zmaji | Ljubljana |
| 2 | Orli | Maribor |
| 3 | Risi | Celje |

Druga opisuje igralce in njihove gole v sezoni:

| id_igralca | ime | id_kluba | goli |
|---|---|---|---|
| 101 | Ana | 1 | 7 |
| 102 | Blaž | 2 | 12 |
| 103 | Cene | 1 | 3 |
| 104 | Dan | 3 | 9 |
| 105 | Eva | 2 | 5 |
| 106 | Filip | 1 | 10 |

Pri igralcu ni zapisano mesto kluba, ampak le številka kluba. Predstavljaj si puščico iz stolpca `id_kluba` v spodnji tabeli do istoimenskega stolpca v zgornji. Ana ima $1$, puščica kaže na Zmaje, Zmaji so iz Ljubljane.

:::premisli
Zakaj ne bi kar pri vsakem igralcu napisali še imena in mesta kluba? Kaj bi šlo narobe, ko se klub preseli?
---
Mesto bi bilo zapisano pri vsakem igralcu kluba posebej. Ob selitvi bi ga morali popraviti v več vrsticah; če bi eno spregledali, bi baza trdila dve različni stvari hkrati. Tako pa ga popravimo na enem mestu, v tabeli klubov.
:::

**Imena delov.** Tabeli v relacijskem modelu rečemo **relacija**. Vrstica je **zapis** (ena stvar iz sveta, npr. en igralec). Stolpec je **atribut** (ena lastnost, npr. goli). Vsak atribut ima **domeno**, to je nabor dovoljenih vrednosti: goli so cela števila od $0$ naprej, ime je besedilo.

**Ključi.** **Primarni ključ** je atribut (ali skupina atributov), ki vsak zapis enolično določi. V tabeli igralcev je to `id_igralca`: dva igralca se lahko imenujeta Ana, številke $101$ pa ima le eden. **Tuji ključ** je atribut, ki kaže na primarni ključ druge tabele. `id_kluba` v tabeli igralcev je tuji ključ. Baza ne dovoli vpisati igralca s številko kluba, ki je ni v tabeli klubov.

En klub ima več igralcev, vsak igralec pa en klub. Taki povezavi rečemo **ena proti mnogo** ($1 : N$). Tuji ključ je vedno na strani »mnogo«.

**Vprašanje bazi: SELECT.** Poizvedba v SQL ima ustaljeno obliko:

```sql
SELECT ime, goli
FROM Igralci
WHERE goli > 6
ORDER BY goli DESC;
```

Preberi jo od `FROM` naprej. `FROM` izbere tabelo. `WHERE` obdrži le vrstice, ki izpolnjujejo pogoj. `SELECT` pove, katere stolpce vidimo. `ORDER BY … DESC` jih razvrsti od največjega navzdol (`ASC` ali nič pomeni naraščajoče). Rezultat je spet tabela.

:::premisli
Koliko vrstic vrne zgornja poizvedba? Najprej napovej, nato preštej v tabeli.
---
Štiri: Blaž ($12$), Filip ($10$), Dan ($9$) in Ana ($7$). Cene ($3$) in Eva ($5$) pogoja $\text{goli} > 6$ ne izpolnita.
:::

**Povzemanje po skupinah.** Funkcije `COUNT`, `SUM`, `AVG`, `MIN` in `MAX` iz več vrstic naredijo eno število. `COUNT(*)` šteje vrstice, `SUM(goli)` sešteje gole. Z `GROUP BY id_kluba` baza vrstice najprej razdeli na kupčke, po enega za vsak klub, in funkcijo izračuna za vsak kupček posebej. `HAVING` nato izloči cele kupčke, `WHERE` pa posamezne vrstice še pred delitvijo.

**Združevanje tabel: JOIN.** Ko potrebujemo podatke iz obeh tabel, ju združimo po ključu:

```sql
SELECT i.ime, k.mesto
FROM Igralci i JOIN Klubi k
  ON i.id_kluba = k.id_kluba;
```

Baza vsako vrstico igralca položi ob vrstico kluba z isto številko. Brez pogoja za povezavo (npr. `FROM Igralci, Klubi` brez `WHERE`) bi združila vsako vrstico z vsako.

**Spreminjanje podatkov.** `INSERT INTO` doda zapis, `UPDATE … SET … WHERE` spremeni obstoječe, `DELETE FROM … WHERE` jih izbriše. `WHERE` pri teh ukazih izbere vrstice, na katere ukaz deluje.

**Na koncu še simboli.** V teoriji relacijskega modela izbiro vrstic (`WHERE`) zapišemo s $\sigma$, izbiro stolpcev (`SELECT`) s $\pi$ in stik (`JOIN`) z $\bowtie$. Zgornja prva poizvedba je brez razvrščanja (relacijska algebra vrstnega reda ne pozna) $\pi_{\text{ime},\,\text{goli}}\big(\sigma_{\text{goli} > 6}(\text{Igralci})\big)$.

## Rešeni primeri

### Primer 1 (lažji): najboljši strelci

Trener želi seznam igralcev z vsaj $9$ goli, od najboljšega navzdol. Kaj vrne poizvedba?

**Podatki:** tabela `Igralci` s šestimi zapisi (zgoraj); pogoj: $\text{goli} \ge 9$; razvrstitev padajoče po golih
**Iščemo:** vrstice rezultata in njihov vrstni red

:::formula
`SELECT ime, goli FROM Igralci WHERE goli >= 9 ORDER BY goli DESC;`
:::

**Rešitev:**

1. `FROM`: vzamemo vseh $6$ vrstic tabele `Igralci`.
2. `WHERE`: ostanejo Blaž ($12$), Dan ($9$) in Filip ($10$), ker je pri njih $\text{goli} \ge 9$. Pri Danu velja enakost, zato ostane.
3. `SELECT`: obdržimo le stolpca `ime` in `goli`.
4. `ORDER BY goli DESC`: od največjega navzdol: $12$, $10$, $9$.
5. Odgovor: poizvedba vrne tri vrstice v vrstnem redu Blaž, Filip, Dan.

### Primer 2: igralci in goli po klubih

Vodstvo lige želi za vsak klub vedeti, koliko igralcev ima in koliko golov so skupaj dali.

**Podatki:** tabela `Igralci`; klub $1$: goli $7$, $3$, $10$; klub $2$: goli $12$, $5$; klub $3$: goli $9$
**Iščemo:** število igralcev in vsoto golov za vsak klub

:::formula
`SELECT id_kluba, COUNT(*), SUM(goli) FROM Igralci GROUP BY id_kluba;`
:::

**Rešitev:**

1. `GROUP BY` razdeli vrstice na tri kupčke, po enega za vsako vrednost `id_kluba`.
2. Klub $1$: `COUNT(*)` je $3$, `SUM(goli)` je $7 + 3 + 10 = 20$.
3. Klub $2$: `COUNT(*)` je $2$, `SUM(goli)` je $12 + 5 = 17$.
4. Klub $3$: `COUNT(*)` je $1$, `SUM(goli)` je $9$.
5. Preizkus: vseh igralcev je $3 + 2 + 1 = 6$, kar je število vrstic tabele.
6. Odgovor: rezultat ima tri vrstice: $(1, 3, 20)$, $(2, 2, 17)$ in $(3, 1, 9)$.

### Primer 3 (težji): obratno vprašanje z dvema tabelama

Novinar sprašuje: »Iz katerih mest so klubi, katerih igralci so skupaj dali več kot $15$ golov?« Sestavi poizvedbo in povej rezultat.

**Podatki:** tabeli `Klubi` in `Igralci` (zgoraj), povezani s tujim ključem `id_kluba`; meja: več kot $15$ golov na klub
**Iščemo:** poizvedbo SQL in mesta v rezultatu

:::formula
`SELECT k.mesto, SUM(i.goli)`
`FROM Igralci i JOIN Klubi k ON i.id_kluba = k.id_kluba`
`GROUP BY k.id_kluba, k.mesto HAVING SUM(i.goli) > 15;`
:::

**Rešitev:**

1. Mesto je v tabeli `Klubi`, goli v tabeli `Igralci`, zato potrebujemo `JOIN` po `id_kluba`.
2. Po stiku ima vsaka od šestih vrstic tudi mesto, npr. Ana – $7$ – Ljubljana.
3. `GROUP BY k.id_kluba, k.mesto` sešteje gole po klubih; mesto je zraven, da ga lahko izpišemo, `id_kluba` pa loči dva kluba iz istega mesta. Vsote: Ljubljana $20$, Maribor $17$, Celje $9$ (kot v primeru 2).
4. Pogoj velja za vsoto skupine, zato spada v `HAVING`, ne v `WHERE`; `WHERE` vidi le posamezne vrstice, ko vsot še ni.
5. `HAVING SUM(i.goli) > 15` obdrži Ljubljano ($20$) in Maribor ($17$), Celje ($9$) izpade.
6. Odgovor: poizvedba vrne Ljubljano z $20$ goli in Maribor s $17$ goli.

### Primer 4: zdaj ti

Koliko golov je v povprečju dal igralec kluba iz Ljubljane?

**Podatki:** tabeli `Klubi` in `Igralci`; pogoj: $\text{mesto} = $ Ljubljana
**Iščemo:** povprečno število golov na igralca

:::formula
`SELECT AVG(i.goli) FROM Igralci i JOIN Klubi k`
`ON i.id_kluba = k.id_kluba WHERE k.mesto = 'Ljubljana';`
:::

**Rešitev:**

1. `JOIN` vsakemu igralcu pripiše mesto njegovega kluba.
2. `WHERE` obdrži le vrstice z mestom Ljubljana: Ana, Cene in Filip.
3. Seštej njihove gole in deli s številom igralcev, nato preveri:

:::premisli
Koliko vrne `AVG(i.goli)`?
---
Vsota je $20$, igralci so trije, povprečje je $\dfrac{20}{3} \approx 6{,}67$ gola na igralca.
:::

## Pogoste napake

- **Vsota v `WHERE`.** `WHERE SUM(goli) > 15` sproži napako. `WHERE` filtrira posamezne vrstice, preden jih baza združi v skupine, zato vsot še ne pozna. Pogoj za skupino napiši v `HAVING`.
- **Tabeli brez pogoja za povezavo.** Kdor napiše `FROM Igralci, Klubi` brez pogoja, misli, da bo baza sama uganila povezavo. Dobi pa vsako vrstico z vsako: $6 \cdot 3 = 18$ vrstic namesto $6$. Vedno poveži tuji ključ s primarnim.
- **`COUNT` namesto `SUM`.** `COUNT(goli)` prešteje vrstice (igralce), ne golov. Za skupno število golov uporabi `SUM(goli)`.
- **Vrstni red izvajanja.** Ker je `SELECT` napisan prvi, se zdi, da se izvede prvi. Baza pa logično dela v redu `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `SELECT`, `ORDER BY`. Zato v `WHERE` ne moreš uporabiti imena, ki ga stolpcu daš šele v `SELECT` (npr. `SUM(goli) AS skupaj`).
- **`UPDATE` ali `DELETE` brez `WHERE`.** Ni »samo prve vrstice«: ukaz deluje na vse vrstice tabele. Najprej s `SELECT … WHERE` preveri, katere vrstice boš spremenil.

## Povzetek

- Relacijska baza hrani podatke v tabelah (relacijah); vrstica je zapis, stolpec atribut z dovoljeno domeno.
- Primarni ključ enolično določi zapis; tuji ključ kaže na primarni ključ druge tabele in tako poveže tabeli ($1 : N$).
- Vsak podatek je zapisan enkrat, zato ga popravimo na enem mestu.
- Poizvedba: `SELECT` stolpci `FROM` tabela `WHERE` pogoj za vrstice `GROUP BY` skupine `HAVING` pogoj za skupine `ORDER BY` razvrstitev.
- Logični vrstni red: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY`.
- `JOIN … ON` poveže tabeli po ključu; brez pogoja za povezavo dobimo vse pare vrstic.
- `COUNT` šteje vrstice, `SUM` sešteva vrednosti.

## Drugače: Z analogijo

Pomisli na garderobo pred tekmo. Jakno oddaš, dobiš listek s številko $57$. Listek jakne ne vsebuje, le kaže nanjo. Garderoberka po številki najde pravi obešalnik.

- Obešalnik s številko je zapis v tabeli `Klubi`; številka na obešalniku je **primarni ključ**: dva obešalnika nimata iste.
- Listek v tvojem žepu je **tuji ključ**: le številka, ki kaže drugam.
- Več ljudi bi lahko imelo listke za isti obešalnik, če bi bil to skupni obešalnik ekipe. To je povezava $1 : N$.
- Listek s številko $999$, ko je obešalnikov le $200$, je neveljaven. Tudi baza zavrne tuji ključ, ki ne kaže na obstoječ zapis.

`JOIN` je garderoberka, ki za vsak listek prinese pravo jakno. Brez navodila »po številki« bi ti pokazala vse jakne.

## Drugače: Iz vsakdanjega življenja

V aplikaciji fantazijske lige izbiraš igralce. Vsak tvoj klik je del poizvedbe:

| tvoj klik | del poizvedbe |
|---|---|
| odpreš seznam igralcev | `FROM Igralci` |
| »samo branilci« | `WHERE pozicija = 'branilec'` |
| »pokaži ime in točke« | `SELECT ime, tocke` |
| »razvrsti po točkah« | `ORDER BY tocke DESC` |
| »povprečje po klubih« | `GROUP BY klub` z `AVG(tocke)` |

Aplikacija za vsak tvoj klik sestavi tak ukaz, ga pošlje bazi na strežniku in ti pokaže vrnjeno tabelo. Ko izbereš igralca v svojo ekipo, aplikacija izvede `INSERT` v tabelo, ki povezuje tvojo ekipo z igralci prek dveh tujih ključev.

## Preveri se

? V tabeli `Igralci` stolpec `id_kluba` vsebuje številke, ki se pojavijo kot `id_kluba` v tabeli `Klubi`. Kaj je `id_kluba` v tabeli `Igralci`?
- primarni ključ tabele `Igralci`
~ Primarni ključ mora biti v svoji tabeli enoličen, številka kluba pa se pri igralcih ponavlja (trije igralci imajo $1$).
+ tuji ključ
- domena
~ Domena je nabor dovoljenih vrednosti atributa, ne atribut sam.
- relacija
~ Relacija je cela tabela, ne en stolpec.
> Atribut, ki kaže na primarni ključ druge tabele, je tuji ključ. Povezuje igralca z njegovim klubom.

? V kakšnem logičnem vrstnem redu baza obdela dele poizvedbe `SELECT … FROM … WHERE … ORDER BY …`?
- `SELECT`, `FROM`, `WHERE`, `ORDER BY`
~ To je vrstni red zapisa, ne izvajanja. Stolpce lahko izbereš šele, ko veš, iz katere tabele in katerih vrstic.
+ `FROM`, `WHERE`, `SELECT`, `ORDER BY`
- `WHERE`, `FROM`, `SELECT`, `ORDER BY`
~ Pogoja ni mogoče preveriti, preden je izbrana tabela z vrsticami.
> Najprej tabela (`FROM`), nato izbira vrstic (`WHERE`), nato stolpcev (`SELECT`) in na koncu razvrstitev (`ORDER BY`).

? Kaj se zgodi, če izvedeš `UPDATE Igralci SET goli = 0;` brez `WHERE`?
- Spremeni se le prva vrstica tabele.
~ SQL nima »privzete prve vrstice«. Brez pogoja ukaz velja za vse vrstice.
- Baza javi napako, ker manjka `WHERE`.
~ `WHERE` je neobvezen; ukaz se izvede brez opozorila.
+ Vsi igralci dobijo $0$ golov.
> Brez `WHERE` ukaz deluje na vse vrstice tabele. Zato pred `UPDATE` ali `DELETE` s `SELECT` preveri, katere vrstice boš zadel.

? Kaj vrne `SELECT SUM(goli) FROM Igralci WHERE goli < 10;` za tabelo igralcev iz lekcije?
- $4$
~ To je število igralcev z manj kot $10$ goli (`COUNT`), ne vsota golov.
- $34$
~ Tu je zraven tudi Filip z $10$ goli, a pogoj $< 10$ desetice ne vključuje.
+ $24$
- $46$
~ To je vsota vseh golov, kot da `WHERE` ne bi bilo.
> Pogoj izpolnijo Ana, Cene, Dan in Eva: $7 + 3 + 9 + 5 = 24$.

? Tabela `Igralci` ima $6$ vrstic, tabela `Klubi` $3$. Koliko vrstic vrne `SELECT * FROM Igralci, Klubi;` brez pogoja za povezavo?
- $6$
~ Baza ne ugane povezave sama; brez pogoja ne ujema igralcev s klubi.
- $9$
~ Vrstice se ne seštejejo, ampak vsaka vrstica ene tabele dobi par z vsako vrstico druge.
+ $18$
- $3$
~ Rezultat ni manjši od nobene od tabel; vsak igralec se pojavi z vsakim klubom.
> Brez pogoja dobimo vse pare: $6 \cdot 3 = 18$ vrstic. Šele `ON i.id_kluba = k.id_kluba` jih zmanjša na $6$ pravih.

:::simboli
\sigma | izbira vrstic (selekcija) | | | v SQL WHERE
\pi | izbira stolpcev (projekcija) | | | v SQL SELECT
N | »mnogo« v povezavi ena proti mnogo ($1 : N$) | | | tuji ključ je na strani »mnogo«; stik tabel ($\bowtie$) je v SQL JOIN
\text{goli} | število golov igralca | | – | stolpec tabele Igralci
:::
