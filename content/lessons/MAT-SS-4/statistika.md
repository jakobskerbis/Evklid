---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Razred je v aplikaciji za merjenje časa pred zaslonom zbral, koliko minut na dan vsak od desetih dijakov igra igrice na telefonu:

$$20,\ 30,\ 30,\ 40,\ 40,\ 40,\ 50,\ 60,\ 90,\ 400$$

Aplikacija izpiše povprečje $80$ minut. Sošolec Miha takoj sklene: »Torej polovica razreda igra več kot $80$ minut na dan.«

Preštej sam: več kot $80$ minut igrata le **dva** od desetih. Miha je zamenjal dve različni »sredini« podatkov. Ena sama vrednost ($400$ minut, nekdo je pozabil izklopiti igro) je povprečje potegnila navzgor, večine pa ni premaknila.

Statistika ti pove, katero število opiše podatke pošteno, kako so podatki razpršeni in kdaj lahko iz povprečja in razpršenosti napoveš delež, ne da bi preštel vse. Proizvajalci telefonov tako napovejo, koliko baterij bo zdržalo manj kot obljubljajo, in temu prilagodijo garancijo.

## Razlaga

**1. Dve sredini.** **Aritmetična sredina** $\bar x$ je vsota vseh podatkov, deljena z njihovim številom $N$:

$$\bar x = \frac{x_1 + x_2 + \dots + x_N}{N}$$

Za igrice: $\bar x = 800 : 10 = 80$ minut. Predstavljaj si, da bi vsi dijaki minute zložili na kup in jih razdelili na enake dele.

**Mediana** $\mathrm{Me}$ je srednji podatek, ko jih uredimo po velikosti. Pri sodem $N$ vzamemo povprečje srednjih dveh. Pri igricah sta na 5. in 6. mestu $40$ in $40$, zato je $\mathrm{Me} = 40$ minut. Polovica podatkov je pod mediano, polovica nad njo. To je trditev, ki jo je Miha pripisal povprečju.

Razlika med njima je v tem, kaj gledata. Aritmetična sredina upošteva *velikost* vsakega podatka, zato jo en skrajni podatek močno premakne. Mediana gleda le *vrstni red*: če $400$ zamenjamo s $4000$, ostane $40$.

Tretja mera je **modus** $\mathrm{Mo}$, najpogostejši podatek. Tu je to $40$.

:::premisli
Zadnji podatek ($400$) popravimo na $100$. Napovej, preden računaš: koliko sta zdaj aritmetična sredina in mediana?
---
Sredina pade z $80$ na $50$ minut (vsota je $500$), mediana ostane $40$. Mediana se ni spremenila, ker je $100$ še vedno največji podatek in vrstni red ostane enak.
:::

**2. Enaka sredina, različna razpršenost.** Dva modela telefona v petih dneh zdržita povprečno $20$ ur. Pri prvem so trajanja vsa blizu $20$, pri drugem nekega dne $14$ ur, drugega $26$. Sredina ju ne loči, zato potrebujemo mero razpršenosti.

Najpreprostejša je **variacijski razmik** $x_{\max} - x_{\min}$. Gleda pa le dva podatka. Boljši je **standardni odklon** $\sigma$, ki upošteva vse odklone $x_i - \bar x$. Odklonov ne smemo kar sešteti, ker se pozitivni in negativni vedno izničijo (njihova vsota je $0$). Zato jih kvadriramo, povprečimo in na koncu korenimo, da dobimo spet enoto podatkov:

$$\sigma^2 = \frac{(x_1 - \bar x)^2 + \dots + (x_N - \bar x)^2}{N}$$

$$\sigma = \sqrt{\sigma^2}$$

Količini $\sigma^2$ rečemo **varianca**. Večji $\sigma$ pomeni bolj razpršene podatke.

**3. Kvartili in škatla z brki.** Mediana deli urejene podatke na dve polovici. Mediana spodnje polovice je **prvi kvartil** $Q_1$, mediana zgornje polovice **tretji kvartil** $Q_3$. Pri igricah je spodnja polovica $20, 30, 30, 40, 40$, torej $Q_1 = 30$; zgornja je $40, 50, 60, 90, 400$, torej $Q_3 = 60$.

**Škatla z brki** te podatke nariše na številsko premico:

:::risba skica
opis: Škatla z brki nad številsko premico. Levi brk se začne pri najmanjši vrednosti 20, škatla sega od prvega kvartila 30 do tretjega kvartila 60, mediana 40 je črta v škatli, desni brk sega do največje vrednosti 400. Premica je med 70 in 400 prekinjena.
območje: 0; -0,9 .. 9; 2,4
črta: 0,3; 0 -> 6,65; 0
črta: 6,6; -0,2 -> 6,8; 0,2
črta: 6,9; -0,2 -> 7,1; 0,2
črta: 6,85; 0 -> 8,8; 0 | puščica
črta: 0,5; -0,1 -> 0,5; 0,1
črta: 1,5; -0,1 -> 1,5; 0,1
črta: 2,5; -0,1 -> 2,5; 0,1
črta: 3,5; -0,1 -> 3,5; 0,1
črta: 4,5; -0,1 -> 4,5; 0,1
črta: 5,5; -0,1 -> 5,5; 0,1
črta: 6,5; -0,1 -> 6,5; 0,1
črta: 8,3; -0,1 -> 8,3; 0,1
napis: 1,5; -0,1 | 20 | pod
napis: 2,5; -0,1 | 30 | pod
napis: 3,5; -0,1 | 40 | pod
napis: 5,5; -0,1 | 60 | pod
napis: 8,3; -0,1 | 400 | pod
črta: 1,5; 0 -> 1,5; 0,85 | siva črtkano
črta: 2,5; 0 -> 2,5; 0,6 | siva črtkano
črta: 3,5; 0 -> 3,5; 0,6 | siva črtkano
črta: 5,5; 0 -> 5,5; 0,6 | siva črtkano
črta: 8,3; 0 -> 8,3; 0,85 | siva črtkano
pravokotnik: 2,5; 0,6 .. 5,5; 1,6
črta: 3,5; 0,6 -> 3,5; 1,6 | debelo
črta: 1,5; 1,1 -> 2,5; 1,1
črta: 5,5; 1,1 -> 6,65; 1,1
črta: 6,6; 0,9 -> 6,8; 1,3
črta: 6,9; 0,9 -> 7,1; 1,3
črta: 6,85; 1,1 -> 8,3; 1,1
črta: 1,5; 0,85 -> 1,5; 1,35
črta: 8,3; 0,85 -> 8,3; 1,35
napis: 1,5; 1,35 | min | nad
napis: 2,5; 1,6 | Q_1 | nad
napis: 3,5; 1,6 | Me | nad
napis: 5,5; 1,6 | Q_3 | nad
napis: 8,3; 1,35 | max | nad
podnapis: Premica je med 70 in 400 prekinjena.
:::

V škatli je srednja polovica podatkov. Njena širina $Q_3 - Q_1 = 30$ je **medkvartilni razmik**. Podatek, ki je od škatle oddaljen več kot $1{,}5$ te širine (tu nad $60 + 45 = 105$), označimo kot **osamelec**. Igralec s $400$ minutami je osamelec.

**4. Od histograma h krivulji.** Pri veliko podatkih jih združimo v razrede in narišemo **histogram**. Če višino stolpca izberemo tako, da je **ploščina** stolpca enaka deležu podatkov v razredu, je skupna ploščina vseh stolpcev $1$.

V simulaciji spodaj (Statistika: histogram in škatla z brki) postavi število podatkov na $300$ in razrede najprej na $5$, nato na $20$. Opazi, da se pri več podatkih in ožjih razredih vrhovi stolpcev poravnajo v gladko zvonasto obliko, škatla z brki pod njim pa je simetrična okoli mediane.

**5. Normalna porazdelitev.** Zvonasta krivulja, ki jo vidiš, je graf **gostote normalne porazdelitve**. Primerjaj ju točko za točko:

| | histogram | normalna krivulja |
|---|---|---|
| podatki | končno mnogo | slučajna spremenljivka $X$ |
| delež | ploščina stolpcev | ploščina pod krivuljo |
| sredina | $\bar x$ | pričakovana vrednost $\mu$ |
| razpršenost | $\sigma$ podatkov | parameter $\sigma$ |

**Slučajna spremenljivka** $X$ je količina, katere vrednost je odvisna od naključja, npr. trajanje baterije naključno izbranega telefona. Njena **pričakovana vrednost** $\mu$ je povprečje, okoli katerega se vrednosti $X$ zbirajo na dolgi rok.

Ploščine pod krivuljo že znaš računati: to je določeni integral. Verjetnost, da je $X$ med $a$ in $b$, je ploščina pod gostoto $f$ od $a$ do $b$, ploščina pod celo krivuljo pa je $1$. Gostota je

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{(x - \mu)^2}{2\sigma^2}}$$

Iz predpisa razbereš lastnosti. Krivulja je simetrična glede na $x = \mu$ in tam doseže maksimum. Z odvodom bi našel **prevoja**, točki, v katerih je krivulja najbolj strma, pri $x = \mu - \sigma$ in $x = \mu + \sigma$. Večji $\sigma$ pomeni širšo krivuljo, a tudi nižjo.

:::premisli
Zakaj večji $\sigma$ ne more dati krivulje, ki je hkrati širša in enako visoka?
---
Ker bi bila ploščina pod njo večja od $1$. Vsa verjetnost skupaj je $1$, zato se krivulja, ko se razširi, mora tudi znižati.
:::

**6. Pravilo 68–95–99,7 in standardizacija.** Pri vsaki normalni porazdelitvi je približno $68\,\%$ vrednosti v intervalu $[\mu - \sigma, \mu + \sigma]$, $95\,\%$ v $[\mu - 2\sigma, \mu + 2\sigma]$ in $99{,}7\,\%$ v $[\mu - 3\sigma, \mu + 3\sigma]$.

Za druge meje vrednost $x$ pretvorimo v **standardizirano vrednost** $z$, ki pove, koliko standardnih odklonov je $x$ od $\mu$:

$$z = \frac{x - \mu}{\sigma}$$

Po standardizaciji ima vsaka normalna porazdelitev isto **standardno krivuljo** z $\mu = 0$ in $\sigma = 1$, zato zadošča ena tabela. V njej je $\Phi(z)$, ploščina pod standardno krivuljo od $0$ do $z$. Ker je polovica ploščine na vsaki strani $\mu$, velja $P(X < x) = 0{,}5 + \Phi(z)$ in $P(X > x) = 0{,}5 - \Phi(z)$. Za negativne $z$ velja $\Phi(-z) = -\Phi(z)$. (Nekatere tabele podajo ploščino od $-\infty$ do $z$; takrat je vrednost že za $0{,}5$ večja.)

## Rešeni primeri

### Primer 1 (lažji): obvestila na telefonu

Sedem dijakov je preštelo, koliko obvestil so dobili v eni uri: $3, 8, 5, 12, 5, 7, 2$. Izračunaj aritmetično sredino, mediano in modus.

**Podatki:** $N = 7$, podatki $3, 8, 5, 12, 5, 7, 2$ (število obvestil)
**Iščemo:** $\bar x$, $\mathrm{Me}$, $\mathrm{Mo}$

:::formula
$\bar x = \dfrac{x_1 + \dots + x_N}{N}$; mediana je srednji podatek urejenega niza; modus je najpogostejši podatek.
:::

**Rešitev:**

1. Vsota: $3 + 8 + 5 + 12 + 5 + 7 + 2 = 42$.
2. Sredina: $\bar x = 42 : 7 = 6$ obvestil.
3. Uredimo, ker mediana gleda vrstni red: $2, 3, 5, 5, 7, 8, 12$. Na 4. mestu (sredini sedmih) je $5$, torej $\mathrm{Me} = 5$.
4. Edini podatek, ki se ponovi, je $5$, zato $\mathrm{Mo} = 5$.
5. Odgovor: sredina je $6$ obvestil, mediana in modus pa $5$. Sredina je večja, ker jo dvigne $12$.

### Primer 2: katera baterija je zanesljivejša

Model A je v petih dneh zdržal $18, 20, 22, 19, 21$ ur, model B pa $14, 26, 20, 16, 24$ ur. Primerjaj standardna odklona.

**Podatki:** A: $18, 20, 22, 19, 21\,\mathrm{h}$; B: $14, 26, 20, 16, 24\,\mathrm{h}$; $N = 5$
**Iščemo:** $\sigma_A$ in $\sigma_B$

:::formula
$\sigma^2 = \dfrac{(x_1 - \bar x)^2 + \dots + (x_N - \bar x)^2}{N}$, $\sigma = \sqrt{\sigma^2}$
:::

**Rešitev:**

1. Sredini: $\bar x_A = 100 : 5 = 20\,\mathrm{h}$ in $\bar x_B = 100 : 5 = 20\,\mathrm{h}$. Sredina ju ne loči.
2. Za A zapišemo odklone v tabelo:

| $x_i$ | $x_i - \bar x$ | $(x_i - \bar x)^2$ |
|---|---|---|
| $18$ | $-2$ | $4$ |
| $20$ | $0$ | $0$ |
| $22$ | $2$ | $4$ |
| $19$ | $-1$ | $1$ |
| $21$ | $1$ | $1$ |

3. Vsota kvadratov je $10$, zato $\sigma_A^2 = 10 : 5 = 2$ in $\sigma_A = \sqrt{2} \approx 1{,}41\,\mathrm{h}$.
4. Za B so odkloni $-6, 6, 0, -4, 4$, kvadrati $36, 36, 0, 16, 16$, vsota $104$. Torej $\sigma_B^2 = 104 : 5 = 20{,}8$ in $\sigma_B \approx 4{,}56\,\mathrm{h}$.
5. Odgovor: obe bateriji zdržita povprečno $20\,\mathrm{h}$, a model A ima več kot trikrat manjši standardni odklon, zato je bolj predvidljiv.

### Primer 3 (težji): koliko baterij preseže $23$ ur

Trajanje baterije novega telefona je normalno porazdeljeno z $\mu = 20\,\mathrm{h}$ in $\sigma = 2\,\mathrm{h}$. Prodali so $5000$ telefonov. Približno koliko jih zdrži več kot $23\,\mathrm{h}$? Iz tabele: $\Phi(1{,}5) = 0{,}4332$.

**Podatki:** $\mu = 20\,\mathrm{h}$, $\sigma = 2\,\mathrm{h}$, $x = 23\,\mathrm{h}$, $5000$ telefonov, $\Phi(1{,}5) = 0{,}4332$
**Iščemo:** $P(X > 23)$ in število takih telefonov

:::formula
$z = \dfrac{x - \mu}{\sigma}$, $P(X > x) = 0{,}5 - \Phi(z)$
:::

**Rešitev:**

1. Standardiziramo: $z = \dfrac{23 - 20}{2} = 1{,}5$. Meja je $1{,}5$ standardnega odklona nad sredino.
2. $\Phi(1{,}5)$ je ploščina od sredine do meje. Desno od sredine je $0{,}5$, zato $P(X > 23) = 0{,}5 - 0{,}4332 = 0{,}0668$.
3. Delež pretvorimo v število: $0{,}0668 \cdot 5000 = 334$.
4. Odgovor: približno $334$ telefonov ($6{,}7\,\%$) zdrži več kot $23$ ur.

### Primer 4 – zdaj ti

Za iste telefone ($\mu = 20\,\mathrm{h}$, $\sigma = 2\,\mathrm{h}$) izračunaj verjetnost, da baterija zdrži med $18$ in $24$ ur. Iz tabele: $\Phi(1) = 0{,}3413$, $\Phi(2) = 0{,}4772$.

**Podatki:** $\mu = 20\,\mathrm{h}$, $\sigma = 2\,\mathrm{h}$, $a = 18\,\mathrm{h}$, $b = 24\,\mathrm{h}$, $\Phi(1) = 0{,}3413$, $\Phi(2) = 0{,}4772$
**Iščemo:** $P(18 < X < 24)$

:::formula
$z = \dfrac{x - \mu}{\sigma}$, $P(a < X < b) = \Phi(z_b) - \Phi(z_a)$, $\Phi(-z) = -\Phi(z)$
:::

**Rešitev:**

1. $z_a = \dfrac{18 - 20}{2} = -1$ in $z_b = \dfrac{24 - 20}{2} = 2$.
2. Meji sta na različnih straneh sredine, zato bomo ploščini levo in desno od $\mu$ sešteli.
3. Izračunaj $\Phi(2) - \Phi(-1)$ sam, nato preveri:

:::premisli
Koliko je $P(18 < X < 24)$?
---
$\Phi(2) - \Phi(-1) = 0{,}4772 + 0{,}3413 = 0{,}8185$, torej približno $82\,\%$ baterij.
:::

## Pogoste napake

- **»Polovica je nad povprečjem.«** To velja za mediano, ne za sredino. Pri nesimetričnih podatkih ali osamelcih sta lahko zelo različni (igrice: $80$ proti $40$). Za »tipičnega« uporabnika pri osamelcih raje navedi mediano.
- **Mediana brez urejanja.** Srednji podatek neurejenega niza je naključen. Najprej podatke uredi po velikosti, šele nato poišči sredino.
- **Seštevanje odklonov brez kvadriranja.** Vsota odklonov $x_i - \bar x$ je vedno $0$, zato ne meri razpršenosti. Odklone kvadriraj, povpreči, na koncu koreni. Brez korena dobiš varianco, ne standardnega odklona.
- **$\Phi(z)$ kot končni odgovor.** $\Phi(z)$ je ploščina od sredine do $z$, ne od roba. Za $P(X < x)$ prištej $0{,}5$, za $P(X > x)$ odštej $\Phi(z)$ od $0{,}5$. Nariši krivuljo in pobarvaj iskano ploščino, preden računaš.
- **Deljenje z varianco.** V $z = \dfrac{x - \mu}{\sigma}$ deliš s standardnim odklonom. Če je dana varianca $\sigma^2 = 4$, je $\sigma = 2$.

## Povzetek

- Aritmetična sredina $\bar x$ je vsota podatkov, deljena z $N$; mediana $\mathrm{Me}$ je srednji podatek urejenega niza; modus $\mathrm{Mo}$ je najpogostejši podatek.
- Osamelec močno premakne sredino, mediane skoraj ne.
- Standardni odklon: $\sigma^2 = \frac{1}{N}\sum (x_i - \bar x)^2$, $\sigma = \sqrt{\sigma^2}$; $\sigma^2$ je varianca.
- Škatla z brki: min, $Q_1$, $\mathrm{Me}$, $Q_3$, max; medkvartilni razmik $Q_3 - Q_1$.
- Normalna porazdelitev: zvonasta, simetrična okoli $\mu$, ploščina pod krivuljo je verjetnost, cela ploščina je $1$.
- Pravilo $68$–$95$–$99{,}7\,\%$ za $\mu \pm \sigma$, $\mu \pm 2\sigma$, $\mu \pm 3\sigma$.
- $z = \frac{x - \mu}{\sigma}$; $P(X < x) = 0{,}5 + \Phi(z)$, $P(X > x) = 0{,}5 - \Phi(z)$.

## Drugače: Na sliki

Nariši zvonasto krivuljo in pod njo navpične črte pri $\mu$, $\mu \pm \sigma$, $\mu \pm 2\sigma$. Ploščino razdeli na pasove:

| Pas | Delež |
|---|---|
| pod $\mu - 2\sigma$ | $2{,}3\,\%$ |
| $\mu - 2\sigma$ do $\mu - \sigma$ | $13{,}6\,\%$ |
| $\mu - \sigma$ do $\mu$ | $34{,}1\,\%$ |
| $\mu$ do $\mu + \sigma$ | $34{,}1\,\%$ |
| $\mu + \sigma$ do $\mu + 2\sigma$ | $13{,}6\,\%$ |
| nad $\mu + 2\sigma$ | $2{,}3\,\%$ |

Med $\mu$ in $\mu + \sigma$ je $34{,}1\,\%$, med $\mu + \sigma$ in $\mu + 2\sigma$ še $13{,}6\,\%$, naprej le še $2{,}3\,\%$. Vsaka naloga z normalno porazdelitvijo je vprašanje, kateri pas pobarvati. $\Phi(z)$ je vedno pas od sredine do $z$; od tam dodaš ali odvzameš polovico ($0{,}5$).

## Drugače: Iz vsakdanjega življenja

Spletna trgovina piše: »Povprečna ocena aplikacije $4{,}1$.« Pod njo so ocene: veliko petic, nekaj enic. Povprečje skrije, da so ljudje razdeljeni.

- **Mediana** odgovori: »Kakšno oceno da tipičen uporabnik?«
- **Standardni odklon** odgovori: »Se uporabniki strinjajo?« Majhen $\sigma$ pomeni, da so vsi dali približno enako oceno.
- **Škatla z brki** pokaže oboje na eni sliki.

Pri izdelkih, ki jih tovarna dela v velikih količinah (trajanje baterije, masa telefona, čas polnjenja), so odstopanja posledica mnogih majhnih vplivov. Takrat je porazdelitev skoraj normalna in iz $\mu$ in $\sigma$ napoveš, koliko izdelkov bo zunaj obljubljene meje.

## Preveri se

? Katera trditev o normalni porazdelitvi je pravilna?
- Krivulja doseže maksimum pri $x = \mu + \sigma$.
~ Pri $\mu \pm \sigma$ sta prevoja. Maksimum je na sredini, pri $x = \mu$.
+ Ploščina pod celotno krivuljo je $1$.
- Krivulja seka os $x$ v točkah $\mu \pm 3\sigma$.
~ Zunaj $\mu \pm 3\sigma$ je le še $0{,}3\,\%$ ploščine, a krivulja osi $x$ nikoli ne doseže, saj je $e^{\ldots} > 0$.
> Ploščina pod gostoto je verjetnost, vse vrednosti skupaj imajo verjetnost $1$.

? Število aplikacij na telefonih petih dijakov: $9, 4, 13, 7, 7$. Kolikšna je mediana?
- $13$
~ To je srednji podatek neurejenega niza. Najprej uredi: $4, 7, 7, 9, 13$.
- $8$
~ To je aritmetična sredina ($40 : 5$), ne mediana.
+ $7$
> Urejeno: $4, 7, 7, 9, 13$; na srednjem, 3. mestu je $7$.

? Maja je izračunala delež baterij, ki zdržijo **manj** kot $23\,\mathrm{h}$ ($\mu = 20\,\mathrm{h}$, $\sigma = 2\,\mathrm{h}$): »$z = 1{,}5$, $\Phi(1{,}5) = 0{,}4332$, torej $43{,}32\,\%$.« Kje je napaka?
- $z$ bi moral biti $\dfrac{23 - 20}{4} = 0{,}75$.
~ V imenovalcu je standardni odklon $\sigma = 2$, ne varianca $\sigma^2 = 4$.
- Odgovor bi moral biti $0{,}5 - 0{,}4332 = 6{,}68\,\%$.
~ To je delež baterij, ki zdržijo **več** kot $23\,\mathrm{h}$. Maja išče manj.
+ Pozabila je prišteti levo polovico: pravilno je $0{,}5 + 0{,}4332 = 93{,}32\,\%$.
> $\Phi(z)$ šteje le od sredine do $z$. Vse baterije pod sredino ($50\,\%$) tudi zdržijo manj kot $23\,\mathrm{h}$.

? Oba modela imata $\mu = 20\,\mathrm{h}$, model A ima $\sigma = 1\,\mathrm{h}$, model B $\sigma = 3\,\mathrm{h}$. Pri katerem je verjetnost, da baterija zdrži več kot $23\,\mathrm{h}$, večja?
- Pri A, ker je bolj zanesljiv.
~ Zanesljiv pomeni, da so vrednosti blizu $20$. Zato A redko pride do $23$ ($z = 3$).
- Enaka je, ker je $\mu$ enak.
~ Sredina je enaka, razpršenost ne. Meja $23$ je pri A $3\sigma$, pri B le $1\sigma$ od sredine.
+ Pri B.
> Pri B je $z = 1$, $P = 0{,}5 - 0{,}3413 \approx 16\,\%$; pri A je $z = 3$, $P \approx 0{,}13\,\%$.

? Mobilni operater objavi: »Povprečni uporabnik porabi $12\,\mathrm{GB}$ na mesec.« Večina porabi okoli $3\,\mathrm{GB}$, nekaj jih gleda filme in porabi več sto. Katero število bolje opiše tipičnega uporabnika?
- Aritmetična sredina, ker upošteva vse uporabnike.
~ Prav zato jo nekaj velikih porabnikov potegne navzgor, daleč od večine.
+ Mediana.
- Variacijski razmik.
~ Razmik meri razpršenost (največji minus najmanjši), ne tipične vrednosti.
> Mediana gleda le vrstni red, zato je osamelci ne premaknejo; polovica uporabnikov porabi manj od nje.

:::simboli
\bar x | aritmetična sredina | \bar x = \frac{x_1 + \dots + x_N}{N} | | povprečje podatkov
x_1, x_2, x_N, x_i | podatki | | |
N | število podatkov | | |
\mathrm{Me} | mediana | | | srednji podatek urejenega niza
\mathrm{Mo} | modus | | | najpogostejši podatek
Q_1 | prvi kvartil | | | mediana spodnje polovice podatkov
Q_3 | tretji kvartil | | | mediana zgornje polovice podatkov
\sigma | standardni odklon | | | $\sigma^2$ je varianca, povprečje kvadratov odklonov
\mu | pričakovana vrednost | | | sredina normalne porazdelitve
x | vrednost slučajne spremenljivke | | |
e | Eulerjevo število | | | $e \approx 2{,}718$
f | gostota normalne porazdelitve | | | ploščina pod njo je verjetnost
z | standardizirana vrednost | z = \frac{x - \mu}{\sigma} | – | število standardnih odklonov od $\mu$
\Phi | ploščina pod standardno krivuljo od $0$ do $z$ | | – | vrednost iz tabele
P | verjetnost | | – |
X | slučajna spremenljivka | | |
a, b | meji intervala | | |
z_a, z_b | standardizirani meji | | – |
\sigma_A, \sigma_B | standardna odklona modelov A in B | | h |
\bar x_A, \bar x_B | povprečni trajanji baterij | | h |
:::
