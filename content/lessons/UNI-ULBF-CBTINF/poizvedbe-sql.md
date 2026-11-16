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

**Podatki:** tabela `material` (stolpci `id`, `naziv`, `enota`, `cena`) s $5$ vrsticami, cene ($6{,}50$; $2{,}40$; $8{,}90$; $14{,}00$; $1{,}20$ €), meja $7$ €
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
6. Lopa: $40 \cdot 6{,}5 = 260$; $24 \cdot 2{,}4 = 57{,}6$; $4 \cdot 8{,}9 = 35{,}6$; $3 \cdot 14 = 42$.
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
- **Besedilo brez narekovajev.** `WHERE projekt = greda` baza razume kot primerjavo s *stolpcem* `greda`, ki ne obstaja. Besedilne vrednosti piši v enojnih narekovajih: `'greda'`.

## Povzetek

- `SELECT` izbere stolpce (tudi računane, z `AS`), `FROM` tabelo, `ORDER BY` uredi rezultat.
- `WHERE` filtrira posamezne vrstice; besedilo v enojnih narekovajih, decimalna pika.
- `JOIN … ON tuji_kljuc = primarni_kljuc` poveže vrstice dveh tabel; brez pravega pogoja dobiš vse kombinacije.
- `SUM`, `COUNT`, `AVG`, `MIN`, `MAX` z `GROUP BY` dajo eno vrstico na skupino; `HAVING` filtrira skupine.
- Vrstni red: `SELECT`, `FROM`, `JOIN … ON`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`.

## Za izpit

Znati moraš povedati:
- kaj so zapis, atribut, primarni in tuji ključ ter kako tuji ključ povezuje tabeli;
- kaj naredi vsak del poizvedbe (`SELECT`, `FROM`, `JOIN … ON`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`), v kakšnem vrstnem redu jih pišemo in v kakšnem jih baza izvede;
- razliko med `WHERE` in `HAVING` ter zakaj agregat ne sme biti v `WHERE`;
- da je `JOIN` izbor iz kartezičnega produkta z $N = n_A \cdot n_B$ pari in koliko vrstic vrne, če vsak tuji ključ kaže na natanko en zapis;
- kateri stolpci smejo biti v `SELECT` ob `GROUP BY` in zakaj;
- razliko med `JOIN` in `LEFT JOIN` ter kako `NULL` vpliva na primerjave, `COUNT(*)` in `COUNT(stolpec)`.

### Naloga 1

Sortni poskus ima dve tabeli (podatki so izmišljeni). Tabela `sorta`:

| id | ime | vrsta |
|---|---|---|
| 1 | Reska | pšenica |
| 2 | Savinja | pšenica |
| 3 | Sandra | ječmen |
| 4 | Zvezda | pšenica |
| 5 | Noni | oves |

Tabela `meritev` (`povrsina` v $\mathrm{m^2}$, `pridelek` v $\mathrm{kg}$; `sorta_id` je tuji ključ):

| parcela | sorta_id | povrsina | pridelek |
|---|---|---|---|
| P1 | 1 | 10 | 7,2 |
| P2 | 1 | 10 | 6,8 |
| P3 | 2 | 12 | 9,0 |
| P4 | 2 | 12 | 8,4 |
| P5 | 2 | 10 | 7,5 |
| P6 | 3 | 10 | 5,9 |
| P7 | 3 | 10 | 6,3 |
| P8 | 4 | 10 | 6,1 |

(a) Napiši poizvedbo, ki za vsako sorto pšenice z vsaj dvema parcelama izpiše ime, število parcel in pridelek v tonah na hektar ($1\,\mathrm{kg/m^2} = 10\,\mathrm{t/ha}$), urejeno od največjega pridelka navzdol. (b) Določi rezultat in povej, koliko vrstic oziroma skupin ostane po vsakem koraku. (c) Koliko vrstic vrne `sorta AS s LEFT JOIN meritev AS m ON m.sorta_id = s.id` in kaj v skupini sorte Noni vrneta `COUNT(*)` in `COUNT(m.pridelek)`?

**Rešitev:**

1. Ime in vrsta sta v `sorta`, površina in pridelek v `meritev`, zato potrebujemo `JOIN` s pogojem `m.sorta_id = s.id`.
2. »Pšenica« je lastnost posamezne vrstice, zato spada v `WHERE`. »Vsaj dve parceli« je lastnost skupine, zato spada v `HAVING`.
3. Pridelek sorte na hektar je skupni pridelek, deljen s skupno površino, krat $10$. Poizvedba:

```sql
SELECT s.ime, COUNT(*) AS parcel,
       SUM(m.pridelek) / SUM(m.povrsina) * 10 AS t_na_ha
FROM meritev AS m JOIN sorta AS s ON m.sorta_id = s.id
WHERE s.vrsta = 'pšenica'
GROUP BY s.ime
HAVING COUNT(*) >= 2
ORDER BY t_na_ha DESC;
```

4. Kartezični produkt ima $8 \cdot 5 = 40$ parov; pogoj `ON` jih obdrži $8$, ker vsaka meritev kaže na natanko eno sorto.
5. `WHERE` izloči ječmen (P6 in P7): ostane $8 - 2 = 6$ vrstic.
6. `GROUP BY` naredi tri skupine: Reska ($2$ vrstici), Savinja ($3$), Zvezda ($1$).
7. `HAVING` izloči Zvezdo, ker ima eno samo parcelo: ostaneta $2$ skupini.
8. Reska: pridelek $7{,}2 + 6{,}8 = 14$, površina $10 + 10 = 20$, torej $\frac{14}{20} \cdot 10 = 7$ ton na hektar.
9. Savinja: pridelek $9 + 8{,}4 + 7{,}5 = 24{,}9$, površina $12 + 12 + 10 = 34$, torej $\frac{24{,}9}{34} \cdot 10 \approx 7{,}32$ tone na hektar.
10. Vzdevek `t_na_ha` v `ORDER BY` smemo uporabiti, ker se `ORDER BY` izvede za `SELECT`. Prva vrstica rezultata je Savinja ($3$ parcele, $7{,}32$), druga Reska ($2$ parceli, $7{,}00$).
11. `LEFT JOIN` obdrži vseh $8$ ujemanj in doda vrstico za sorto Noni, ki nima meritev: $8 + 1 = 9$ vrstic. V tej vrstici so stolpci tabele `meritev` enaki `NULL`.
12. V skupini Noni `COUNT(*)` vrne $1$, ker šteje vrstice; `COUNT(m.pridelek)` vrne $0$, ker vrednosti `NULL` izpusti.
13. Odgovor: (b) dve vrstici, Savinja s $3$ parcelami in približno $7{,}32\,\mathrm{t/ha}$ ter Reska z $2$ parcelama in $7{,}00\,\mathrm{t/ha}$; (c) $9$ vrstic, `COUNT(*)` je $1$, `COUNT(m.pridelek)` je $0$.

### Naloga 2

Natančno navedi logični vrstni red, v katerem baza izvede dele poizvedbe, in z njim utemelji: (a) zakaj agregat ne sme biti v `WHERE`, (b) zakaj vzdevka iz `SELECT` ne moreš uporabiti v `WHERE`, v `ORDER BY` pa lahko, (c) zakaj v `SELECT` ob `GROUP BY` ne sme biti stolpca, ki ni ne v `GROUP BY` ne v agregatu.

**Rešitev:**

1. Logični vrstni red je: `FROM` in `JOIN … ON`, nato `WHERE`, `GROUP BY`, `HAVING`, `SELECT` in na koncu `ORDER BY`. Pišemo jih drugače: `SELECT` je prvi.
2. (a) `WHERE` se izvede pred `GROUP BY` in preverja vsako vrstico posebej. Takrat skupin še ni, zato vsota ali število vrstic skupine ne obstaja. Pogoj z agregatom spada v `HAVING`, ki pride na vrsto po združevanju.
3. (b) Vzdevek nastane šele v `SELECT`. `WHERE` se izvede prej, zato imena še ne pozna; `ORDER BY` se izvede pozneje, zato ga lahko uporabi.
4. (c) Po `GROUP BY` je vsaka skupina ena vrstica rezultata. Stolpec iz `GROUP BY` ima v skupini eno samo vrednost, agregat iz vseh vrednosti izračuna eno. Drug stolpec ima v skupini lahko več različnih vrednosti (skupina »lopa« ima štiri nazive), zato ni določeno, katero izpisati.
5. Sklep: vsa tri pravila sledijo iz istega dejstva, da vsak del poizvedbe dobi tabelo, ki so jo pripravili deli pred njim.

### Naloga 3

Na tabeli `poraba` iz razlage primerjaj poizvedbi. Utemelji, ali vrneta isti rezultat, in rezultata izračunaj.

```sql
SELECT projekt, SUM(kolicina) FROM poraba
WHERE kolicina > 3 GROUP BY projekt;

SELECT projekt, SUM(kolicina) FROM poraba
GROUP BY projekt HAVING SUM(kolicina) > 3;
```

**Rešitev:**

1. Prva poizvedba pogoj preveri na vsaki vrstici pred združevanjem. Izpadejo vrstice s količino $1$ in $3$ pri gredi ter vrstica s količino $3$ pri lopi.
2. Greda: ostane samo vrstica z $8$ deskami, vsota je $8$.
3. Lopa: $40 + 24 + 4 = 68$.
4. Druga poizvedba najprej sešteje vse vrstice: greda $8 + 1 + 3 = 12$, lopa $40 + 24 + 4 + 3 = 71$.
5. `HAVING` nato preveri skupini: $12 > 3$ in $71 > 3$, zato ostaneta obe.
6. Odgovor: ne vrneta istega rezultata. Prva vrne greda $8$ in lopa $68$, druga greda $12$ in lopa $71$. `WHERE` spremeni, katere vrstice gredo v vsoto; `HAVING` vsot ne spremeni, le izbere skupine.

## Drugače: Na sliki

Poizvedba iz primera 3 kot delo na mizi:

1. **JOIN kot sponka.** Na levi je kup listkov `poraba`, na desni kup `material`. Vsakemu listku porabe poiščeš listek materiala z isto številko in ju speneš. Dobiš $7$ spetih parov; spodaj so štirje od njih.

:::risba skica
opis: Štirje speti pari listkov. Levo so listki tabele poraba (projekt, številka materiala, količina), desno listki tabele material (številka, naziv, cena). Črta veže listka z isto številko materiala: greda, 1, 8 z 1, deska, 6,50; greda, 3, 1 s 3, vijaki, 8,90; lopa, 2, 24 z 2, letev, 2,40; lopa, 4, 3 s 4, lazura, 14,00.
območje: 0; 0 .. 20; 10
napis: 4; 9,2 | poraba
napis: 16,1; 9,2 | material
pravokotnik: 0,5; 6,8 .. 7,5; 8,2 | ozadje
pravokotnik: 12,3; 6,8 .. 19,9; 8,2 | ozadje
črta: 7,5; 7,5 -> 12,3; 7,5 | debelo
napis: 4; 7,5 | greda, 1, 8
napis: 16,1; 7,5 | 1, deska, 6,50
pravokotnik: 0,5; 4,8 .. 7,5; 6,2 | ozadje
pravokotnik: 12,3; 4,8 .. 19,9; 6,2 | ozadje
črta: 7,5; 5,5 -> 12,3; 5,5 | debelo
napis: 4; 5,5 | greda, 3, 1
napis: 16,1; 5,5 | 3, vijaki, 8,90
pravokotnik: 0,5; 2,8 .. 7,5; 4,2 | ozadje
pravokotnik: 12,3; 2,8 .. 19,9; 4,2 | ozadje
črta: 7,5; 3,5 -> 12,3; 3,5 | debelo
napis: 4; 3,5 | lopa, 2, 24
napis: 16,1; 3,5 | 2, letev, 2,40
pravokotnik: 0,5; 0,8 .. 7,5; 2,2 | ozadje
pravokotnik: 12,3; 0,8 .. 19,9; 2,2 | ozadje
črta: 7,5; 1,5 -> 12,3; 1,5 | debelo
napis: 4; 1,5 | lopa, 4, 3
napis: 16,1; 1,5 | 4, lazura, 14,00
podnapis: Listka z isto številko materiala sta speta v par.
:::

2. **GROUP BY kot predali.** Spete pare razvrstiš v predala: »greda« ($3$ pari) in »lopa« ($4$ pari).
3. **Agregat kot listek na predalu.** Za vsak predal izračunaš eno število, vsoto stroškov, in ga zapišeš na predal: $64{,}5$ in $395{,}2$.
4. **HAVING kot sito na predalih.** Obdržiš le predal, katerega listek kaže več kot $100$.

`WHERE` bi delovalo že pri koraku 1, na posameznih listkih, preden so v predalih.

## Drugače: Bolj natančno

**Logični vrstni red.** Baza dele izvede v drugem vrstnem redu, kot jih napišemo: `FROM` in `JOIN`, nato `WHERE`, `GROUP BY`, `HAVING`, `SELECT` in na koncu `ORDER BY`. Zato vzdevka iz `SELECT` (npr. `skupaj`) v `WHERE` še ne moreš uporabiti, v `ORDER BY` pa ga lahko.

**JOIN kot izbor iz kartezičnega produkta.** Kartezični produkt tabel $A$ in $B$ vsebuje vse pare vrstic. Če ima $A$ $n_A$ vrstic in $B$ $n_B$ vrstic, je parov

$$N = n_A \cdot n_B$$

Notranji `JOIN` (`INNER JOIN`) obdrži tiste pare, za katere je pogoj `ON` resničen. Če vsaka vrstica tabele `poraba` kaže na natanko en obstoječ material, ima rezultat toliko vrstic kot `poraba`.

**LEFT JOIN in NULL.** `LEFT JOIN` obdrži tudi vrstice brez ujemanja; manjkajoči stolpci dobijo `NULL` (ni podatka). Primerjava `cena = NULL` ni nikoli resnična, pišemo `cena IS NULL`. `SUM`, `AVG` in `COUNT(stolpec)` vrednosti `NULL` izpustijo, tako kot `COUNT` v preglednici izpusti prazne celice; `COUNT(*)` pa šteje vse vrstice, tudi tiste z `NULL`.

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
