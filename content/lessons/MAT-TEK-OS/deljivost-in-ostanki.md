---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Luka v knjigarni kupi $9$ enakih zvezkov. Prodajalka pogleda zaslon in reče: »Skupaj $47{,}35$ €.« Luka ne vzame kalkulatorja, vseeno pa takoj ve, da je znesek napačen. Nekdo se je pri vnosu zmotil.

Kako je to opazil tako hitro? Znesek v centih je $4735$. Če je $9$ zvezkov enakih, mora biti skupna cena deljiva z $9$. Luka je seštel števke: $4 + 7 + 3 + 5 = 19$. Vsota $19$ ni deljiva z $9$, zato tudi $4735$ ni. Pravilni znesek bi bil na primer $47{,}34$ €, kar je $9$ zvezkov po $5{,}26$ €.

Takšne bližnjice so jedro mnogih tekmovalnih nalog. Ugotoviti moraš, ali je ogromno število deljivo s $3$ ali $11$, katera števka manjka na računu ali s katero števko se konča $7^{2026}$. Takih števil ne izračunaš do konca, lahko pa opazuješ njihove **ostanke**.

## Razlaga

**Kovanci v zavitkih.** Blagajničarka ima $23$ kovancev po $1$ € in jih zlaga v zavitke po $5$. Na številski premici korakamo po pet:

:::risba premica
opis: Številska premica od 0 do 25. Štirje loki so koraki po pet: od 0 do 5, do 10, do 15 in do 20. Točka 23 leži 3 desno od 20.
od: 0
do: 25
oznake: 5
skok: 0 -> 5 | 5
skok: 5 -> 10 | 5
skok: 10 -> 15 | 5
skok: 15 -> 20 | 5
točka: 23 | 23 | oranžna
:::

Polnih zavitkov je $4$, od $20$ do $23$ pa ostanejo še $3$ kovanci. Zapišemo $23 = 4 \cdot 5 + 3$. Število $5$ je **delitelj**, $4$ je **količnik**, $3$ pa **ostanek**. Ostanek je vedno manjši od delitelja: če bi ostalo $5$ ali več kovancev, bi napolnili še en zavitek.

Če je ostanek $0$, pravimo, da je število **deljivo** z deliteljem. Število $20$ je deljivo s $5$, število $23$ pa ne.

**Ostanki se vrtijo v krogu.** Zapišimo števila v tabelo s štirimi stolpci. V vsakem stolpcu so števila z enakim ostankom pri deljenju s $4$:

| ostanek $0$ | ostanek $1$ | ostanek $2$ | ostanek $3$ |
|---|---|---|---|
| $0$ | $1$ | $2$ | $3$ |
| $4$ | $5$ | $6$ | $7$ |
| $8$ | $9$ | $10$ | $11$ |
| $12$ | $13$ | $14$ | $15$ |

Ko gremo v stolpcu za vrstico niže, prištejemo $4$ in ostanek se ne spremeni. Pri deljenju s $4$ so torej možni le štirje ostanki, $0$, $1$, $2$ in $3$, ki se ponavljajo v krogu.

**Ostanek vsote in produkta.** Ana kupi tri stvari po $17$ €, $23$ € in $38$ €. Plača s čim več bankovci po $5$ €, ostalo s kovanci po $1$ €. Koliko kovancev porabi? To je ostanek vsote pri deljenju s $5$.

Ni ji treba seštevati cen. Vsaka cena ima svoj ostanek: $17$ da $2$, $23$ da $3$, $38$ da $3$. Ostanki skupaj: $2 + 3 + 3 = 8$, kar da pri deljenju s $5$ ostanek $3$. Res: $17 + 23 + 38 = 78$ in $78 = 15 \cdot 5 + 3$.

Enako velja za produkt. Za $13$ stvari po $27$ € vzamemo ostanka $3$ in $2$: $3 \cdot 2 = 6$, to pa da ostanek $1$. Preverimo: $13 \cdot 27 = 351$ in $351 = 70 \cdot 5 + 1$.

Pravilo je preprosto: v vsoti in produktu smeš vsako število zamenjati z njegovim ostankom. Polni zavitki ne vplivajo na to, koliko kovancev ostane.

:::premisli
Brez množenja: s katero števko se konča $99 \cdot 101$? Zadnja števka je ostanek pri deljenju z $10$.
---
Z $9$. Ostanka pri deljenju z $10$ sta $9$ in $1$, $9 \cdot 1 = 9$. Res je $99 \cdot 101 = 9999$.
:::

**Od kod pravila deljivosti.** Število razstavimo po mestih: $4735 = 4 \cdot 1000 + 7 \cdot 100 + 3 \cdot 10 + 5$.

- Desetice, stotice in tisočice so deljive z $10$, zato tudi z $2$ in s $5$. Ostanek pri $2$, $5$ in $10$ je zato odvisen le od **zadnje števke**.
- Število $100$ je deljivo s $4$ in s $25$, zato pri teh dveh deliteljih štejeta **zadnji dve števki**. Število $1000$ je deljivo z $8$, zato pri $8$ štejejo **zadnje tri števke**.
- Za $9$ in $3$ si pomagamo s tabelo ostankov:

| mesto | vrednost | ostanek pri $9$ |
|---|---|---|
| tisočice | $1000 = 999 + 1$ | $1$ |
| stotice | $100 = 99 + 1$ | $1$ |
| desetice | $10 = 9 + 1$ | $1$ |
| enice | $1$ | $1$ |

Vsaka števka torej k ostanku prispeva samo sebe. Ostanek števila pri deljenju z $9$ je enak ostanku njegove **vsote števk**. Ker je $9$ deljivo s $3$, isto velja tudi za $3$. To je Lukov trik iz uvoda.

- Za $11$ velja $10 = 11 - 1$: desetica je za $1$ manjša od večkratnika števila $11$, stotica $100 = 99 + 1$ za $1$ večja, tisočica $1000 = 1001 - 1$ spet za $1$ manjša. Števke zato izmenično prištevamo in odštevamo, od zadnje proti prvi. Pri $9284$: $4 - 8 + 2 - 9 = -11$, kar je deljivo z $11$. Res je $9284 = 844 \cdot 11$.

**Sestavljeni delitelji.** Število je deljivo s $6$, če je deljivo z $2$ in s $3$. Deljivo s $36$ je, če je deljivo s $4$ in z $9$. Pri tem morata biti delitelja **tuji** števili, torej brez skupnega delitelja, večjega od $1$.

:::premisli
Število je deljivo z $2$ in s $4$. Ali je zato zagotovo deljivo z $8$? Če ne, poišči protiprimer.
---
Ne. Primer je $12$: deljivo je z $2$ in s $4$, z $8$ pa ne. Števili $2$ in $4$ nista tuji. Vsak večkratnik števila $4$ je že sam po sebi sod, zato pogoj »deljivo z $2$« ne doda ničesar novega.
:::

**Zadnja števka potence.** Zadnja števka je ostanek pri deljenju z $10$. Po pravilu za produkt je zadnja števka potence odvisna samo od zadnje števke osnove. Potence števila $7$ po vrsti:

| $n$ | $7^n$ | zadnja števka |
|---|---|---|
| $1$ | $7$ | $7$ |
| $2$ | $49$ | $9$ |
| $3$ | $343$ | $3$ |
| $4$ | $2401$ | $1$ |
| $5$ | $16807$ | $7$ |

Ko se pojavi števka $1$, se krog začne znova. Zadnje števke tečejo v krogu dolžine $4$: $7, 9, 3, 1$.

V simulaciji spodaj, »Ostanki potenc in zadnja števka«, nastavi modul (to je delitelj) $m = 10$ in osnovo $a = 7$. Opazuj, da se puščice zaprejo v krog štirih ostankov. Nato preizkusi še $a = 4$ in $a = 5$. Pri $4$ je krog dolg samo $2$, pri $5$ pa se zadnja števka sploh ne spremeni.

**Na koncu še zapis.** Matematiki pišejo $a \equiv b \pmod{m}$ in berejo »$a$ je kongruentno $b$ po modulu $m$«. To pomeni le, da dasta $a$ in $b$ pri deljenju z $m$ enak ostanek. Na primer $23 \equiv 3 \pmod{5}$ in $7^5 \equiv 7 \pmod{10}$.

## Rešeni primeri

### Primer 1 (lažji): kovanci v zavitkih

V blagajni je $4528$ kovancev po $1$ cent. Zložimo jih v zavitke po $9$ kovancev. Koliko kovancev ostane?

**Podatki:** število kovancev $4528$, v zavitku $9$ kovancev
**Iščemo:** ostanek pri deljenju $4528$ z $9$

:::formula
Ostanek pri deljenju z $9$ je enak ostanku vsote števk pri deljenju z $9$.
:::

**Rešitev:**

1. Seštejemo števke, ker vsako mesto prispeva samo svojo števko: $4 + 5 + 2 + 8 = 19$.
2. Postopek ponovimo na $19$: $1 + 9 = 10$, in še enkrat: $1 + 0 = 1$.
3. Preverimo z množenjem: $9 \cdot 503 = 4527$, do $4528$ manjka še $1$.
4. Odgovor: ostane $1$ kovanec.

### Primer 2: zadnja števka vsote potenc

S katero števko se konča število $2^{2026} + 3^{2026}$?

**Podatki:** osnovi $2$ in $3$, eksponent $2026$
**Iščemo:** zadnjo števko vsote

:::formula
Zadnje števke potenc tečejo v krogu. Položaj v krogu določa ostanek eksponenta pri deljenju z dolžino kroga.
:::

**Rešitev:**

1. Zadnje števke potenc števila $2$: $2, 4, 8, 6$, potem spet $2$. Krog ima dolžino $4$.
2. Zadnje števke potenc števila $3$: $3, 9, 7, 1$, potem spet $3$. Tudi ta krog ima dolžino $4$.
3. Eksponent razdelimo na cele kroge: $2026 = 4 \cdot 506 + 2$. Po $506$ polnih krogih smo na drugem mestu v krogu.
4. Na drugem mestu je pri $2^n$ števka $4$, pri $3^n$ pa števka $9$.
5. Zadnja števka vsote je zadnja števka števila $4 + 9 = 13$, torej $3$.
6. Odgovor: število $2^{2026} + 3^{2026}$ se konča s $3$.

### Primer 3 (težji): zbrisane števke na računu

Šola kupi $36$ enakih nahrbtnikov. Na računu sta se zbrisali dve števki. Ostalo je $2\square7\square$ €, znesek je cel. En nahrbtnik stane več kot $70$ €. Koliko stane en nahrbtnik?

**Podatki:** $36$ enakih nahrbtnikov, znesek $\overline{2a7b}$ €, cena nahrbtnika večja od $70$ €
**Iščemo:** števki $a$ in $b$ ter ceno enega nahrbtnika

:::formula
$36 = 4 \cdot 9$, števili $4$ in $9$ sta tuji. Znesek mora biti deljiv s $4$ (zadnji dve števki) in z $9$ (vsota števk).
:::

**Rešitev:**

1. Najprej pogoj za $4$, ker vključuje samo eno neznanko: $\overline{7b}$ mora biti deljivo s $4$. Med števili od $70$ do $79$ sta to le $72$ in $76$, torej je $b = 2$ ali $b = 6$.
2. Pri $b = 2$ je vsota števk $2 + a + 7 + 2 = 11 + a$. Deljiva z $9$ je le pri $a = 7$. Znesek je $2772$ €.
3. Pri $b = 6$ je vsota števk $2 + a + 7 + 6 = 15 + a$. Deljiva z $9$ je le pri $a = 3$. Znesek je $2376$ €.
4. Ceni: $2772 : 36 = 77$ in $2376 : 36 = 66$.
5. Nahrbtnik stane več kot $70$ €, zato drugi znesek odpade.
6. Odgovor: na računu je $2772$ €, en nahrbtnik stane $77$ €.

### Primer 4 – zdaj ti

Kakšen ostanek da produkt $2026 \cdot 2027 \cdot 2028$ pri deljenju z $9$?

**Podatki:** faktorji $2026$, $2027$, $2028$, delitelj $9$
**Iščemo:** ostanek produkta pri deljenju z $9$

:::formula
V produktu smeš vsak faktor zamenjati z njegovim ostankom; ostanek pri $9$ dobiš iz vsote števk.
:::

**Rešitev:**

1. Vsota števk števila $2026$ je $10$, ostanek je $1$.
2. Pri $2027$ je vsota števk $11$, ostanek $2$. Pri $2028$ je vsota $12$, ostanek $3$.
3. Zdaj zmnoži ostanke in dokončaj sam.

:::premisli
Kolikšen je ostanek produkta $2026 \cdot 2027 \cdot 2028$ pri deljenju z $9$?
---
$1 \cdot 2 \cdot 3 = 6$, ker je $6$ manjše od $9$, je to že ostanek. Ostanek je $6$.
:::

## Pogoste napake

- **Vsota števk za vsak delitelj.** »Vsota števk števila $13$ je $4$, torej je $13$ deljivo s $4$.« Trik z vsoto števk deluje samo za $3$ in $9$, ker le pri njiju da $10$ ostanek $1$. Za $4$ glej zadnji dve števki.
- **Za $4$ samo zadnja števka.** »Število $14$ se konča s $4$, zato je deljivo s $4$.« Zadnja števka zadošča le pri $2$, $5$ in $10$. Pri $4$ odloča število iz zadnjih dveh števk: $14$ ni deljivo s $4$, $114$ tudi ne, $124$ pa je.
- **Množenje deliteljev, ki nista tuja.** »Deljivo s $4$ in s $6$, torej deljivo s $24$.« Število $12$ je deljivo s $4$ in s $6$, s $24$ pa ne. Pravilo »deljivo z obema, torej s produktom« velja samo za tuja delitelja, na primer $3$ in $8$.
- **Ostanek $0$ v krogu potenc.** »$100 = 4 \cdot 25 + 0$, ostanek je $0$, torej je zadnja števka števila $2^{100}$ prva v krogu, $2$.« Ostanek $0$ pomeni, da smo končali cel krog in stojimo na **zadnjem** mestu. Pravilna zadnja števka je $6$.
- **Krog potenc z napačno dolžino.** Učenec vzame ostanek eksponenta pri deljenju z $10$, ker »gre za zadnjo števko«. Dolžina kroga je odvisna od osnove (pri $7$ je $4$, pri $4$ je $2$). Vedno najprej izpiši nekaj potenc in poišči, kdaj se ponovijo.

## Povzetek

- Pri deljenju z $d$ je ostanek eno od števil $0, 1, \dots, d - 1$. Število je deljivo z $d$, če je ostanek $0$.
- V vsoti in produktu smeš vsako število zamenjati z njegovim ostankom.
- Pravila: $2$, $5$, $10$ zadnja števka; $4$, $25$ zadnji dve; $8$ zadnje tri; $3$, $9$ vsota števk (da tudi ostanek); $11$ izmenična vsota števk.
- Deljivost s sestavljenim številom preveri s tujima faktorjema: $6 = 2 \cdot 3$, $36 = 4 \cdot 9$, $72 = 8 \cdot 9$.
- Zadnja števka je ostanek pri $10$. Zadnje števke potenc tečejo v krogu (pri $2$, $3$, $7$, $8$ dolžine $4$). Eksponent deli z dolžino kroga; ostanek $0$ pomeni zadnje mesto v krogu.
- Zapis $a \equiv b \pmod{m}$ pomeni: $a$ in $b$ dasta pri deljenju z $m$ enak ostanek.

## Drugače: Z analogijo

Ostanki delujejo kot dnevi v tednu. Danes je ponedeljek. Kateri dan bo čez $100$ dni?

Nihče ne šteje sto dni na prste. Vsakih $7$ dni je spet ponedeljek, zato polni tedni ne štejejo. Ker je $100 = 14 \cdot 7 + 2$, je dan isti kot čez $2$ dni: sreda.

Pri tem smo naredili natanko to, kar delamo z ostanki:

- Dan v tednu je ostanek pri deljenju s $7$, pri $0$ smo spet na ponedeljku.
- »Čez $100$ dni« in »čez $2$ dni« sta za koledar ista stvar, tako kot sta $100$ in $2$ isti ostanek.
- Zadnja števka potence je kot urni kazalec, ki vedno znova obkroži isto številčnico. Pri $7^n$ ima številčnica samo štiri oznake: $7, 9, 3, 1$.

## Drugače: Iz vsakdanjega življenja

Pri blagajni se ostanki srečujejo vsak dan.

- **Plačilo z bankovci po $10$ €.** Za znesek $87$ € daš $8$ bankovcev, ostanek $7$ € pa v kovancih. Ta ostanek je ravno zadnja števka. Zato je pri deljivosti z $10$, $5$ in $2$ pomembna samo zadnja števka: polni bankovci so že »razdeljeni«.
- **Jajca po $6$.** Trgovina dobi $500$ jajc in jih pakira po $6$. Vsota števk $5 + 0 + 0 = 5$ da pri $3$ ostanek $2$. Ostanek pri $6$ mora pri $3$ dati isto, zato je $2$ ali $5$. Sodo število $500$ ne more dati lihega ostanka $5$, torej ostaneta $2$ jajci. Res: $6 \cdot 83 = 498$.
- **Kontrola računa.** Ko blagajna sešteje cene, lahko ostanek vsote pri $9$ primerjaš z ostankom, ki ga dobiš iz posameznih cen. Če se ne ujemata, je nekje napaka.

## Preveri se

? Pri katerem od teh deliteljev ugotovimo deljivost **ne** samo po zadnji števki?
- $2$
~ Pri $2$ zadošča zadnja števka, ker so desetice, stotice … vse deljive z $2$.
- $5$
~ Pri $5$ zadošča zadnja števka ($0$ ali $5$), ker je $10$ deljivo s $5$.
+ $4$
- $10$
~ Pri $10$ odloča samo zadnja števka: biti mora $0$.
> Število $10$ ni deljivo s $4$, $100$ pa je. Zato pri $4$ odloča število iz zadnjih dveh števk. Pri $2$, $5$ in $10$ zadošča zadnja.

? S katero števko se konča $7^{2026}$?
- $7$
~ To je prva števka v krogu. Do nje bi prišli, če bi dal eksponent ostanek $1$ pri deljenju s $4$.
+ $9$
- $1$
~ Števka $1$ je na zadnjem mestu kroga, kamor pridemo pri ostanku $0$. Tu je ostanek $2$.
- $3$
~ To je tretja števka v krogu. Verjetno si napačno izračunal ostanek eksponenta.
> Zadnje števke potenc števila $7$ tečejo v krogu $7, 9, 3, 1$. Ker je $2026 = 4 \cdot 506 + 2$, smo na drugem mestu: zadnja števka je $9$.

? Števke števila $5381$ premešamo v $1835$. Kaj se zgodi z ostankom pri deljenju z $9$?
- Spremeni se, ker je novo število drugačno.
~ Število je drugačno, vsota števk pa ostane $17$. Prav vsota števk določa ostanek pri $9$.
+ Ostane enak, ker se vsota števk ne spremeni.
- Ostane enak, enako pa velja tudi za ostanek pri deljenju s $4$.
~ Pri $4$ štejeta zadnji dve števki, te pa so se zamenjale. $5381$ da pri $4$ ostanek $1$, $1835$ pa $3$.
> Vsako mesto prispeva k ostanku pri $9$ le svojo števko, zato vrstni red števk ne vpliva na ostanek. Obe števili dasta ostanek $8$.

? Tina išče zadnjo števko števila $2^{100}$. Kateri korak je napačen? (1) Zadnje števke tečejo v krogu $2, 4, 8, 6$. (2) $100 = 4 \cdot 25$, ostanek je $0$. (3) Ostanek $0$ pomeni prvo mesto v krogu, zato je zadnja števka $2$.
- Korak (1)
~ Krog je pravilen: $2, 4, 8, 16, 32, \dots$ imajo zadnje števke $2, 4, 8, 6, 2, \dots$
- Korak (2)
~ Račun je pravilen: $100$ je deljivo s $4$.
+ Korak (3)
- Noben korak ni napačen.
~ Preveri na majhnem primeru: $2^4 = 16$. Eksponent $4$ da ostanek $0$, zadnja števka pa je $6$, ne $2$.
> Ostanek $0$ pomeni, da smo prehodili cele kroge in stojimo na zadnjem mestu kroga. Zadnja števka števila $2^{100}$ je $6$.

? Maja je kupila $6$ enakih majic po ceni s celimi centi. Kateri od teh zneskov je lahko pravilen?
- $36{,}26$ €
~ Ne zadošča, da se znesek konča s $6$. Vsota števk $3 + 6 + 2 + 6 = 17$ ni deljiva s $3$.
+ $27{,}36$ €
- $33{,}33$ €
~ Vsota števk $12$ je deljiva s $3$, vendar je $3333$ liho število, zato ni deljivo z $2$.
- $23{,}45$ €
~ Število $2345$ je liho, vsota števk $14$ pa ni deljiva s $3$. Ne izpolni nobenega od pogojev.
> Znesek v centih mora biti deljiv s $6$, torej z $2$ in s $3$. Število $2736$ je sodo, vsota števk je $18$. Ena majica stane $4{,}56$ €.

:::simboli
n | eksponent potence | | | pri $7^n$ zadnja števka ponavlja krog
m | modul (delitelj) | | | v zapisu $a \equiv b \pmod{m}$
a, b | celi števili, ki ju primerjamo po ostanku | | | v primeru z nahrbtniki neznani števki; v simulaciji je $a$ osnova potence
d | delitelj | | | ostanek je eno od števil $0, 1, \dots, d - 1$
:::
