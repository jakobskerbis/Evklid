---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Za visoko gredo na vrtu kupiš $8$ smrekovih desk po $6{,}50$ €, škatlo vijakov za $8{,}90$ € in $3\,\mathrm{m^2}$ geotekstila po $1{,}20$ €. Koliko plačaš? V preglednici bi zapisal tri vrstice in uporabil `SUM`: $8 \cdot 6{,}50 + 8{,}90 + 3 \cdot 1{,}20 = 64{,}50$ €.

Mizarska delavnica pa vodi tisoče artiklov in stotine projektov, cene v eni tabeli, porabe v drugi. Vprašanje »koliko stane material za vsak projekt?« bi v preglednici zahtevalo veliko ročnega kopiranja. V relacijski bazi ga zapišeš v jeziku **SQL** (Structured Query Language), baza pa odgovor izračuna sama.

## Razlaga

Delavnica ima dve **tabeli**. Vrstica je **zapis**, stolpec **atribut**. Stolpec `id` je **primarni ključ**: vsak material ima drugačen `id`. Imena tabel in stolpcev pišemo brez šumnikov (`kolicina`, ne `količina`).

Tabela `material`:

| id | naziv | enota | cena |
|---|---|---|---|
| 1 | deska | kos | 6,50 |
| 2 | letev | kos | 2,40 |
| 3 | vijaki | škatla | 8,90 |
| 4 | lazura | L | 14,00 |
| 5 | geotekstil | m² | 1,20 |

Tabela `poraba` (koliko česa gre v posamezen projekt):

| projekt | material_id | kolicina |
|---|---|---|
| greda | 1 | 8 |
| greda | 3 | 1 |
| greda | 5 | 3 |
| lopa | 1 | 40 |
| lopa | 2 | 24 |
| lopa | 3 | 4 |
| lopa | 4 | 3 |

Stolpec `material_id` je **tuji ključ**: kaže na `id` v tabeli `material`. Vrstica »greda, 3, 1« torej pomeni eno škatlo vijakov.

**Blok 1: SELECT in FROM.** Poizvedba je vprašanje bazi. `FROM` pove, iz katere tabele beremo, `SELECT` pa, katere stolpce želimo.

```sql
SELECT naziv, cena FROM material;
```

Rezultat je spet tabela s petimi vrsticami in dvema stolpcema; `SELECT *` vrne vse stolpce. Poizvedba podatkov ne spreminja.

*Preveri:* koliko vrstic in stolpcev vrne `SELECT enota FROM material;`? *(Pet vrstic, en stolpec.)*

**Blok 2: WHERE.** Z `WHERE` obdržimo le vrstice, ki izpolnjujejo pogoj. Baza pogoj preveri za vsako vrstico posebej, kot `IF` v vsaki vrstici preglednice.

```sql
SELECT naziv FROM material
WHERE cena > 5 AND enota = 'kos';
```

Primerjave so `=`, `<>` (različno), `<`, `>`, `<=`, `>=`; pogoje vežemo z `AND`, `OR` in `NOT`. Besedilo pišemo v enojnih narekovajih (`'kos'`), števila brez njih in z decimalno **piko** (`6.50`), kot v večini programskih jezikov.

*Preveri:* katere nazive vrne zgornja poizvedba? *(Samo `deska`: vijaki in lazura sta dražja od 5 €, a nimata enote `kos`.)*

**Blok 3: računani stolpci in ORDER BY.** V `SELECT` lahko računaš s stolpci in rezultatu daš ime z `AS`. `ORDER BY` uredi vrstice, `DESC` od največje navzdol.

```sql
SELECT projekt, kolicina * 2 AS dvojno
FROM poraba ORDER BY kolicina DESC;
```

*Preveri:* katera vrstica je v rezultatu prva? *(lopa z $40$ deskami, `dvojno` je $80$.)*

**Blok 4: JOIN.** V tabeli `poraba` ni ne imena ne cene, le `material_id`. Da bi izvedeli ceno, vrstice dveh tabel **združimo**:

```sql
SELECT poraba.projekt, material.naziv, poraba.kolicina, material.cena
FROM poraba JOIN material ON poraba.material_id = material.id;
```

`ON` pove, kateri vrstici spadata skupaj: tisti, kjer je `material_id` enak `id`. Vsaka od sedmih vrstic tabele `poraba` dobi ob sebi natanko eno vrstico iz tabele `material`. Prve tri vrstice rezultata:

| projekt | naziv | kolicina | cena |
|---|---|---|---|
| greda | deska | 8 | 6,50 |
| greda | vijaki | 1 | 8,90 |
| greda | geotekstil | 3 | 1,20 |

Ker sta v poizvedbi dve tabeli, pred ime stolpca napišemo ime tabele s piko (`poraba.projekt`), da baza ve, od kod je stolpec. Krajše je z vzdevkom: po `FROM poraba AS p JOIN material AS m` pišemo kar `p.projekt` in `m.cena`.

:::premisli
Kaj bi dobil, če bi tabeli našteli brez pogoja, `FROM poraba, material`? Koliko vrstic bi bilo?
---
Vsaka vrstica tabele `poraba` bi se združila z vsako vrstico tabele `material`, tudi z napačnimi materiali: $7 \cdot 5 = 35$ vrstic. Pogoj `ON` iz teh $35$ parov obdrži le $7$ pravih.
:::

**Blok 5: združevanje.** Agregatne funkcije poznaš iz preglednic: `SUM`, `COUNT`, `AVG`, `MIN`, `MAX`. Brez dodatkov stisnejo vse vrstice v eno samo:

```sql
SELECT SUM(kolicina) FROM poraba;
```

Rezultat je ena vrstica z vrednostjo $83$. Pogosto pa želimo vsoto **za vsako skupino**. `GROUP BY projekt` razdeli vrstice v skupine z enakim projektom; za vsako skupino nastane ena vrstica rezultata.

```sql
SELECT projekt, SUM(kolicina) AS kosov
FROM poraba GROUP BY projekt;
```

Dobiš greda $12$ in lopa $71$. `HAVING` nato obdrži le skupine, ki izpolnjujejo pogoj, npr. `HAVING SUM(kolicina) > 20` pusti samo lopo.

*Preveri:* kaj vrne `SELECT projekt, MAX(kolicina) FROM poraba GROUP BY projekt;`? *(Dve vrstici: greda $8$, lopa $40$.)*

:::premisli
Zakaj ne moremo napisati `WHERE SUM(kolicina) > 20`, ampak potrebujemo `HAVING`?
---
`WHERE` preverja posamezne vrstice, še preden jih baza razvrsti v skupine. Takrat vsota skupine še ne obstaja. `HAVING` pride na vrsto po združevanju in preverja cele skupine.
:::

Vrstni red delov v poizvedbi je vedno enak: `SELECT … FROM … JOIN … ON … WHERE … GROUP BY … HAVING … ORDER BY`. Dele, ki jih ne potrebuješ, izpustiš.

## Rešeni primeri

### Primer 1: poceni material (lažji)

Za manjše popravilo iščeš material, ki stane manj kot $7$ €. Izpiši naziv in ceno, od najcenejšega navzgor.

**Podatki:** tabela `material` (stolpci `id`, `naziv`, `enota`, `cena`; $5$ vrstic, cene $6{,}50$, $2{,}40$, $8{,}90$, $14{,}00$, $1{,}20$ €), meja $7$ €
**Iščemo:** poizvedbo in njen rezultat

:::formula
`SELECT stolpci FROM tabela WHERE pogoj ORDER BY stolpec;`
:::

**Rešitev:**

1. Stolpca sta `naziv` in `cena`, tabela je `material`.
2. Pogoj velja za posamezno vrstico, zato spada v `WHERE`: `cena < 7`.
3. Poizvedba: `SELECT naziv, cena FROM material WHERE cena < 7 ORDER BY cena;`
4. Pregled vrstic: deska ($6{,}50$) da, letev ($2{,}40$) da, vijaki ($8{,}90$) ne, lazura ($14{,}00$) ne, geotekstil ($1{,}20$) da.
5. Ureditev naraščajoče, ker `ORDER BY` brez `DESC` ureja od najmanjše vrednosti.
6. Odgovor: rezultat ima tri vrstice, geotekstil $1{,}20$ €, letev $2{,}40$ € in deska $6{,}50$ €.

### Primer 2: strošek postavk za gredo

Za vsako postavko visoke grede izpiši naziv materiala, količino in strošek postavke.

**Podatki:** tabeli `material` in `poraba` iz razlage; povezava `poraba.material_id = material.id`; projekt `'greda'`
**Iščemo:** poizvedbo in tabelo s stolpci `naziv`, `kolicina`, `strosek`

:::formula
`SELECT … FROM tabela1 AS a JOIN tabela2 AS b ON a.tuji_kljuc = b.id WHERE pogoj;`
:::

**Rešitev:**

1. Naziv in cena sta v `material`, količina v `poraba`, zato potrebujemo `JOIN`.
2. Strošek je računan stolpec: `p.kolicina * m.cena AS strosek`.
3. Poizvedba:

```sql
SELECT m.naziv, p.kolicina, p.kolicina * m.cena AS strosek
FROM poraba AS p JOIN material AS m ON p.material_id = m.id
WHERE p.projekt = 'greda';
```

4. `JOIN` da $7$ vrstic, `WHERE` obdrži $3$.
5. Stroški: deska $8 \cdot 6{,}50 = 52{,}00$, vijaki $1 \cdot 8{,}90 = 8{,}90$, geotekstil $3 \cdot 1{,}20 = 3{,}60$.
6. Odgovor: deska $8$ kosov za $52{,}00$ €, vijaki $1$ škatla za $8{,}90$ € in geotekstil $3\,\mathrm{m^2}$ za $3{,}60$ €. Skupaj je to $64{,}50$ €, kot v uvodu.

### Primer 3: dragi projekti (težji)

Vodja delavnice želi tabelo z enim stolpcem za projekt in drugim za skupni strošek, a samo za projekte, dražje od $100$ €. Rezultat naj bo videti tako: `lopa | 395.20`. Napiši poizvedbo.

**Podatki:** tabeli `material` in `poraba`; meja $100$ €; želeni stolpci `projekt`, `skupaj`
**Iščemo:** poizvedbo, ki vrne natanko ta rezultat

:::formula
`SELECT skupina, SUM(izraz) AS ime FROM … JOIN … ON … GROUP BY skupina HAVING pogoj_na_skupino;`
:::

**Rešitev:**

1. Cene potrebujemo pri vsaki vrstici porabe, zato najprej `JOIN` kot v primeru 2.
2. »Za vsak projekt« pomeni `GROUP BY p.projekt`; skupni strošek je `SUM(p.kolicina * m.cena)`.
3. Pogoj »dražji od 100 €« velja za skupino, ne za vrstico, zato gre v `HAVING`.
4. Poizvedba:

```sql
SELECT p.projekt, SUM(p.kolicina * m.cena) AS skupaj
FROM poraba AS p JOIN material AS m ON p.material_id = m.id
GROUP BY p.projekt
HAVING SUM(p.kolicina * m.cena) > 100;
```

5. Preverimo z računom. Greda: $52 + 8{,}9 + 3{,}6 = 64{,}5$, zato jo `HAVING` izloči.
6. Lopa: $40 \cdot 6{,}5 = 260$, $24 \cdot 2{,}4 = 57{,}6$, $4 \cdot 8{,}9 = 35{,}6$, $3 \cdot 14 = 42$.
7. Vsota lope: $260 + 57{,}6 + 35{,}6 + 42 = 395{,}2$.
8. Odgovor: poizvedba vrne eno vrstico, lopa s skupnim stroškom $395{,}20$ €.

### Primer 4 – zdaj ti

Koliko desk (material z `id` $1$) porabijo vsi projekti skupaj in v koliko projektih se deske pojavijo?

**Podatki:** tabela `poraba`; material `material_id = 1`
**Iščemo:** skupno količino desk in število vrstic z deskami

:::formula
`SELECT SUM(kolicina), COUNT(*) FROM poraba WHERE material_id = 1;`
:::

**Rešitev:**

1. Pogoj velja za vsako vrstico posebej, zato je v `WHERE`; `GROUP BY` ni potreben, ker želimo eno vrstico.
2. `WHERE` obdrži vrstici »greda, 1, 8« in »lopa, 1, 40«.
3. Izračunaj obe vrednosti sam, nato preveri:

:::premisli
Kaj vrne poizvedba?
---
Eno vrstico: `SUM(kolicina)` je $8 + 40 = 48$ desk, `COUNT(*)` pa $2$ (dva projekta).
:::

## Pogoste napake

- **Agregat v WHERE.** Napišeš `WHERE SUM(kolicina) > 20`, ker »pogoj je pogoj«. Baza javi napako: `WHERE` dela z vrsticami pred združevanjem, ko vsote še ni. Pogoj na skupino spada v `HAVING`.
- **JOIN brez pravega pogoja.** Izpustiš `ON` ali napišeš `ON p.material_id = p.material_id`, ker je pogoj »samo formalnost«. Dobiš vse kombinacije vrstic ($7 \cdot 5 = 35$) in vsote so napihnjene. Vedno poveži tuji ključ s primarnim ključem druge tabele.
- **Stolpec, ki ni ne v GROUP BY ne v agregatu.** `SELECT projekt, naziv, SUM(...) … GROUP BY projekt` se zdi smiseln, a skupina »lopa« ima štiri nazive in baza ne ve, katerega izpisati. V `SELECT` so le stolpci iz `GROUP BY` in agregati.
- **Besedilo brez narekovajev.** `WHERE projekt = greda` baza razume kot primerjavo z *stolpcem* `greda`, ki ne obstaja. Besedilne vrednosti piši v enojnih narekovajih: `'greda'`.

## Povzetek

- `SELECT` izbere stolpce (tudi računane, z `AS`), `FROM` tabelo, `ORDER BY` uredi rezultat.
- `WHERE` filtrira posamezne vrstice; besedilo v enojnih narekovajih, decimalna pika.
- `JOIN … ON tuji_kljuc = primarni_kljuc` poveže vrstice dveh tabel; brez pravega pogoja dobiš vse kombinacije.
- `SUM`, `COUNT`, `AVG`, `MIN`, `MAX` z `GROUP BY` dajo eno vrstico na skupino; `HAVING` filtrira skupine.
- Vrstni red: `SELECT`, `FROM`, `JOIN … ON`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`.

## Drugače: Na sliki

Poizvedba iz primera 3 kot delo na mizi:

1. **JOIN kot sponka.** Na levi je kup listkov `poraba`, na desni kup `material`. Vsakemu listku porabe poiščeš listek materiala z isto številko in ju speneš. Dobiš $7$ spetih parov; spodaj so štirje od njih.

```
greda | 1 | 8   ──  1 | deska  | 6,50
greda | 3 | 1   ──  3 | vijaki | 8,90
lopa  | 2 | 24  ──  2 | letev  | 2,40
lopa  | 4 | 3   ──  4 | lazura | 14,00
```

2. **GROUP BY kot predali.** Spete pare razvrstiš v predala: »greda« ($3$ pari) in »lopa« ($4$ pari).
3. **Agregat kot listek na predalu.** Za vsak predal izračunaš eno število, vsoto stroškov, in ga zapišeš na predal: $64{,}5$ in $395{,}2$.
4. **HAVING kot sito na predalih.** Obdržiš le predal, katerega listek kaže več kot $100$.

`WHERE` bi delovalo že pri koraku 1, na posameznih listkih, preden so v predalih.

## Drugače: Bolj natančno

**Logični vrstni red.** Baza dele izvede v drugem vrstnem redu, kot jih napišemo: `FROM` in `JOIN`, nato `WHERE`, `GROUP BY`, `HAVING`, `SELECT` in na koncu `ORDER BY`. Zato vzdevka iz `SELECT` (npr. `skupaj`) v `WHERE` še ne moreš uporabiti, v `ORDER BY` pa ga lahko.

**JOIN kot izbor iz kartezičnega produkta.** Kartezični produkt tabel $A$ in $B$ vsebuje vse pare vrstic. Če ima $A$ $n_A$ vrstic in $B$ $n_B$ vrstic, je parov

$$N = n_A \cdot n_B$$

Notranji `JOIN` (`INNER JOIN`) obdrži tiste pare, za katere je pogoj `ON` resničen. Če vsaka vrstica tabele `poraba` kaže na natanko en obstoječ material, ima rezultat toliko vrstic kot `poraba`.

**LEFT JOIN in NULL.** `LEFT JOIN` obdrži tudi vrstice brez ujemanja; manjkajoči stolpci dobijo `NULL` (ni podatka). Primerjava `cena = NULL` ni nikoli resnična, pišemo `cena IS NULL`. `SUM`, `AVG` in `COUNT(stolpec)` vrednosti `NULL` izpustijo, `COUNT(*)` jih šteje, tako kot `COUNT` v preglednici izpusti prazne celice.

## Preveri se

? Katera tabela je rezultat poizvedbe `SELECT projekt, COUNT(*) FROM poraba GROUP BY projekt;`?
- Ena vrstica s številom $7$.
~ Tak rezultat bi dal `COUNT(*)` brez `GROUP BY`. Z `GROUP BY` dobiš eno vrstico na projekt.
+ Dve vrstici: greda $3$, lopa $4$.
- Sedem vrstic, v vsaki število $1$.
~ `GROUP BY` vrstice z istim projektom združi; ne ostanejo posamezne vrstice.
- Dve vrstici: greda $12$, lopa $71$.
~ To so vsote količin (`SUM(kolicina)`). `COUNT(*)` šteje vrstice.
> Vrstice se razdelijo v dve skupini; v gredi so $3$ vrstice, v lopi $4$.

? Gradbena trgovina ima tabelo `material` z $2000$ vrsticami in tabelo `poraba` s $50\,000$ vrsticami; vsaka vrstica porabe kaže na natanko en obstoječ material. Koliko vrstic približno vrne `poraba JOIN material ON poraba.material_id = material.id`?
- Okoli $100$ milijonov.
~ To je kartezični produkt $2000 \cdot 50\,000$, ki ga dobiš brez pogoja `ON`.
+ Okoli $50\,000$.
- Okoli $2000$.
~ `JOIN` ne zmanjša porabe na en zapis na material; vsak material se lahko pojavi v mnogo vrsticah.
- Okoli $52\,000$.
~ `JOIN` vrstic ne sešteje kot dva kupa; združi jih v pare.
> Vsaka vrstica porabe dobi natanko en par, zato ima rezultat toliko vrstic kot `poraba`.

? Zakaj `SELECT projekt FROM poraba WHERE SUM(kolicina) > 20 GROUP BY projekt;` javi napako?
- Ker `SUM` v SQL ne obstaja, samo v preglednicah.
~ `SUM` je standardna agregatna funkcija v SQL.
- Ker mora biti `WHERE` za `GROUP BY`.
~ `WHERE` je res pred `GROUP BY`; težava ni v vrstnem redu, ampak v tem, kaj `WHERE` sme preverjati.
+ Ker `WHERE` preverja posamezne vrstice pred združevanjem, ko vsota skupine še ne obstaja; potreben je `HAVING`.
> Pravilno: `… GROUP BY projekt HAVING SUM(kolicina) > 20;`

? Rezultat je tabela s stolpcema `projekt` in `skupaj`: greda $12$, lopa $71$. Katera poizvedba ga je dala?
- `SELECT projekt, COUNT(kolicina) AS skupaj FROM poraba GROUP BY projekt;`
~ `COUNT` šteje vrstice ($3$ in $4$), ne sešteva količin.
- `SELECT SUM(kolicina) AS skupaj FROM poraba;`
~ Brez `GROUP BY` dobiš eno vrstico z vsoto $83$ in brez stolpca `projekt`.
+ `SELECT projekt, SUM(kolicina) AS skupaj FROM poraba GROUP BY projekt;`
- `SELECT projekt, AVG(kolicina) AS skupaj FROM poraba GROUP BY projekt;`
~ `AVG` vrne povprečje: za gredo $4$, za lopo $17{,}75$.
> Greda: $8 + 1 + 3 = 12$, lopa: $40 + 24 + 4 + 3 = 71$.

? Semenska banka ima tabelo `vzorec` s stolpcema `sorta` in `kalivost`. Izpisati želiš povprečno kalivost po sortah, a samo za sorte z več kot $3$ vzorci. Kateri del poizvedbe izloči sorte s premalo vzorci?
- `WHERE COUNT(*) > 3`
~ `WHERE` ne sme vsebovati agregata, ker deluje pred združevanjem v skupine.
- `ORDER BY COUNT(*) > 3`
~ `ORDER BY` vrstice le uredi, nobene ne izloči.
+ `HAVING COUNT(*) > 3`
> Poizvedba: `SELECT sorta, AVG(kalivost) FROM vzorec GROUP BY sorta HAVING COUNT(*) > 3;` `HAVING` filtrira skupine po združevanju.

:::simboli
N | število vrstic kartezičnega produkta | N = n_A \cdot n_B | – | vsi pari vrstic
n_A | število vrstic tabele $A$ | | – |
n_B | število vrstic tabele $B$ | | – |
:::
