---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Na zemljevid Slovenije zapiči deset bucik, v deset krajev, ki bi jih rad obiskal na poletnem potepu. Koliko je različnih vrstnih redov, v katerih jih lahko obiščeš? Več kot tri milijone – precej več, kot ima Slovenija prebivalcev. Če bi vsak dan preizkusil drug vrstni red, bi potreboval skoraj $10\,000$ let.

Deset krajev se ne zdi veliko, zato je rezultat na prvi pogled nemogoč. Pa ni: število možnosti ne raste s seštevanjem, ampak z množenjem. **Kombinatorika** je veda o štetju možnosti, ne da bi jih morali vse izpisati. Potrebuješ jo za načrtovanje poti, za kode in gesla, za razporede tekem in, takoj v naslednji temi, za verjetnost.

## Razlaga

**1. Drevo možnosti.** Iz Ljubljane v Maribor lahko greš z vlakom, avtobusom ali avtom. Iz Maribora v Gradec pa z vlakom ali avtobusom. Nariši drevo: iz začetne točke izhajajo tri veje (prevoz do Maribora), iz konca vsake veje še dve (prevoz do Gradca). Na koncu drevesa je $3 \cdot 2 = 6$ listov, vsak list je ena celotna pot.

To je **osnovni izrek kombinatorike** (pravilo produkta): če izbiro opraviš v več zaporednih korakih in ima prvi korak $m$ možnosti, drugi pa $n$ možnosti, je vseh izbir $m \cdot n$. Pri več korakih množiš naprej.

**2. Permutacije.** Obiskati želiš Bled, Bohinj in Kranjsko Goro, vsak kraj enkrat. Prvi kraj izbereš na $3$ načine, drugi na $2$ (enega si že obiskal), za tretjega ostane $1$. Drevo ima $3 \cdot 2 \cdot 1 = 6$ listov:

| 1. dan | 2. dan | 3. dan |
|---|---|---|
| Bled | Bohinj | Kr. Gora |
| Bled | Kr. Gora | Bohinj |
| Bohinj | Bled | Kr. Gora |
| Bohinj | Kr. Gora | Bled |
| Kr. Gora | Bled | Bohinj |
| Kr. Gora | Bohinj | Bled |

Vsaki razvrstitvi vseh $n$ različnih elementov v vrsto rečemo **permutacija**. Njihovo število je produkt vseh naravnih števil od $n$ navzdol, imenujemo ga **$n$ fakulteta** in pišemo $n!$:

$$P_n = n! = n \cdot (n-1) \cdots 2 \cdot 1$$

Dogovorimo se še, da je $0! = 1$ (nič elementov razvrstiš na en sam način: v prazno vrsto).

:::premisli
Seznamu treh krajev dodaš še Piran. Koliko vrstnih redov je zdaj? Napovej, preden množiš, in razloži, zakaj se število ne poveča le za nekaj.
---
$4! = 24$, štirikrat več kot prej. Piran lahko vstaviš na začetek, na konec ali v eno od dveh vmesnih mest vsakega od $6$ starih vrstnih redov: $6 \cdot 4 = 24$.
:::

**3. Variacije.** Pogosto ne razvrstiš vseh elementov, ampak jih izbereš le nekaj. Na voljo imaš $7$ krajev, čas pa le za $3$ dneve, vsak dan en kraj. Prvi dan izbiraš med $7$, drugi med $6$, tretji med $5$: skupaj $7 \cdot 6 \cdot 5 = 210$ načrtov. Urejeni izbor $k$ različnih elementov izmed $n$, pri katerem je **vrstni red pomemben**, je **variacija** $k$-tega razreda iz $n$ elementov (razred pove, koliko elementov izberemo):

$$V_n^k = n(n-1)\cdots(n-k+1) = \frac{n!}{(n-k)!}$$

Če se elementi smejo ponavljati (kot števke v kodi), je pri vsakem koraku spet vseh $n$ možnosti. To so **variacije s ponavljanjem**, oznaka $(p)$ pomeni »s ponavljanjem«:

$$^{(p)}V_n^k = n^k$$

**4. Kombinacije.** Zdaj te vrstni red ne zanima: le odločiš se, katere $3$ kraje od $7$ boš obiskal. V tabeli zgoraj je vseh $6$ vrstic en sam izbor, {Bled, Bohinj, Kr. Gora}. Tako vsak izbor treh krajev med $210$ variacijami nastopi $3! = 6$-krat. Izborov je torej $\frac{210}{6} = 35$.

Neurejeni izbor $k$ različnih elementov izmed $n$ je **kombinacija** $k$-tega razreda iz $n$ elementov. Število kombinacij je **binomski koeficient** $\binom{n}{k}$ (beri »$n$ nad $k$«):

$$C_n^k = \binom{n}{k} = \frac{n!}{k!\,(n-k)!}$$

:::premisli
Kaj je večje: $\binom{7}{3}$ ali $\binom{7}{4}$? Odgovori brez računanja.
---
Enaka sta, oba sta $35$. Ko izbereš $3$ kraje, ki jih boš obiskal, si s tem hkrati izbral $4$ kraje, ki jih ne boš. Vsakemu izboru treh ustreza natanko en izbor štirih.
:::

**5. Kako izbrati pravo formulo.** Pred računanjem odgovori na tri vprašanja.

| Vsi elementi? | Vrstni red pomemben? | Ponavljanje? | Formula |
|---|---|---|---|
| da | da | ne | $P_n = n!$ |
| ne | da | ne | $V_n^k$ |
| ne | da | da | $n^k$ |
| ne | ne | ne | $\binom{n}{k}$ |

V simulaciji spodaj (»Permutacije, variacije in kombinacije«) izberi način »Izbiranje«, nastavi $n = 5$ in $k = 3$, nato vklapljaj in izklapljaj stikalo »vrstni red je pomemben«. Opazi, da število pade s $60$ na $10$, natanko za faktor $3! = 6$.

**6. Pravilo vsote.** Doslej si izbiral eno *in* nato še drugo. Včasih pa izbereš le eno *ali* drugo: za vikend greš v gore (med $4$ kraji) ali na morje (med $3$ kraji). Izletov je $4 + 3 = 7$, ne $4 \cdot 3$. To je **pravilo vsote**: če se možnosti razdelijo na primere, ki se ne prekrivajo (noben izid ni v dveh primerih hkrati), in ima prvi primer $m$ možnosti, drugi pa $n$, je vseh možnosti $m + n$. Pravili se pogosto združita: gesel iz $2$ ali $3$ črk (izmed $26$, s ponavljanjem) je $26^2 + 26^3 = 676 + 17\,576 = 18\,252$.

**7. Permutacije s ponavljanjem.** Koliko različnih besed dobiš s premetavanjem črk besede ANA? Če bi bili črki A različni (A₁ in A₂), bi bilo $3! = 6$ razvrstitev. A₁NA₂ in A₂NA₁ pa sta ista beseda, zato smo vsako besedo šteli $2! = 2$-krat. Besed je $\frac{3!}{2!} = 3$: ANA, AAN, NAA. Če je med $n$ elementi $k_1$ enakih prve vrste, $k_2$ enakih druge vrste … in $k_r$ enakih zadnje vrste ($k_1 + k_2 + \dots + k_r = n$), je različnih razvrstitev

$$P_n^{k_1, k_2, \ldots, k_r} = \frac{n!}{k_1!\,k_2! \cdots k_r!}$$

## Rešeni primeri

### Primer 1 (lažji): pet krajev v enem izletu

Na izletu po Sloveniji obiščeš Bled, Bohinj, Kranjsko Goro, Piran in Postojno, vsak kraj enkrat. Na koliko načinov lahko določiš vrstni red?

**Podatki:** $n = 5$ različnih krajev, vsi so obiskani, vsak enkrat
**Iščemo:** število vrstnih redov $P_5$

:::formula
$P_n = n!$
:::

**Rešitev:**

1. Razvrščamo vse kraje in vrstni red je pomemben, zato gre za permutacije.
2. $P_5 = 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$.
3. Odgovor: vrstni red lahko določiš na $120$ načinov.

### Primer 2: tri prestolnice v treh dneh

Z vlakom potuješ po Evropi. Na zemljevidu imaš označenih $9$ prestolnic. Prve tri dni boš vsak dan v drugi prestolnici, nobene ne obiščeš dvakrat. Koliko je različnih načrtov za te tri dni?

**Podatki:** $n = 9$ prestolnic, $k = 3$ dnevi, vsak dan ena prestolnica, brez ponavljanja
**Iščemo:** število načrtov $V_9^3$

:::formula
$V_n^k = \frac{n!}{(n-k)!}$
:::

**Rešitev:**

1. Izbiramo le $3$ od $9$, vrstni red je pomemben (Dunaj prvi dan in Praga drugi ni isto kot obratno), ponavljanja ni: variacije brez ponavljanja.
2. $V_9^3 = 9 \cdot 8 \cdot 7 = 504$.
3. Odgovor: obstaja $504$ različnih načrtov.

### Primer 3 (težji): paket turistične agencije

Agencija sestavlja potovanje: izbere $3$ od $6$ obalnih krajev in $2$ od $4$ gorskih krajev. (a) Koliko različnih izborov krajev je mogočih? (b) Koliko različnih potovanj je, če je pomemben tudi vrstni red obiska vseh petih izbranih krajev?

**Podatki:** $6$ obalnih krajev, izbor $3$; $4$ gorski kraji, izbor $2$; skupaj $5$ krajev na potovanju
**Iščemo:** (a) število izborov, (b) število potovanj z vrstnim redom

:::formula
$\binom{6}{3} \cdot \binom{4}{2}$, nato pomnožimo s $P_5 = 5!$
:::

**Rešitev:**

1. Obalne kraje izbiramo brez vrstnega reda: $\binom{6}{3} = \frac{6 \cdot 5 \cdot 4}{3 \cdot 2 \cdot 1} = 20$.
2. Gorske prav tako: $\binom{4}{2} = \frac{4 \cdot 3}{2 \cdot 1} = 6$.
3. Izbor poteka v dveh korakih, zato po osnovnem izreku množimo: $20 \cdot 6 = 120$ izborov.
4. Vsakih pet izbranih krajev lahko razvrstimo na $5! = 120$ načinov.
5. Spet dva zaporedna koraka: $120 \cdot 120 = 14\,400$ potovanj.
6. Odgovor: (a) $120$ izborov krajev, (b) $14\,400$ različnih potovanj.

### Primer 4: zdaj ti

Na zemljevidu letalske družbe je vsako mesto povezano z vsakim drugim z natanko eno neposredno linijo. Linij je $45$. Koliko mest je na zemljevidu?

**Podatki:** vsak par mest povezuje ena linija, število linij je $45$
**Iščemo:** število mest $n$

:::formula
Število linij je število parov mest: $\binom{n}{2} = \frac{n(n-1)}{2}$
:::

**Rešitev:**

1. Linija je določena s parom mest; linija Ljubljana–Pariz je ista kot Pariz–Ljubljana, zato vrstni red ni pomemben: kombinacije.
2. Zapišemo enačbo $\frac{n(n-1)}{2} = 45$ in jo pomnožimo z $2$: $n(n-1) = 90$.
3. Poišči naravno število $n$, ki reši enačbo, in rezultat preveri.

:::premisli
Koliko je $n$?
---
$n = 10$, ker je $10 \cdot 9 = 90$. Preizkus: $\binom{10}{2} = \frac{10 \cdot 9}{2} = 45$. Kvadratna enačba $n^2 - n - 90 = 0$ ima še rešitev $n = -9$, ki ni smiselna.
:::

### Primer 5: besede iz črk besede POPOTNIK

Koliko različnih besed (tudi takih brez pomena) lahko sestaviš iz vseh osmih črk besede POPOTNIK?

**Podatki:** $n = 8$ črk; P nastopi $2$-krat, O $2$-krat, T, N, I in K po enkrat
**Iščemo:** število različnih razvrstitev črk

:::formula
$P_n^{k_1, k_2, \ldots, k_r} = \frac{n!}{k_1!\,k_2! \cdots k_r!}$
:::

**Rešitev:**

1. Razvrščamo vse črke, vrstni red je pomemben, nekatere črke so enake: permutacije s ponavljanjem.
2. Če bi bile vse črke različne, bi bilo $8! = 40\,320$ razvrstitev.
3. Zamenjava obeh P ali obeh O ne da nove besede, zato delimo z $2! \cdot 2! = 4$ (črka, ki nastopi enkrat, da $1! = 1$).
4. $\frac{8!}{2! \cdot 2!} = \frac{40\,320}{4} = 10\,080$.
5. Odgovor: sestaviš lahko $10\,080$ različnih besed.

## Pogoste napake

- **Vrstni red »na občutek«.** »Izbiram 3 kraje od 7, torej $7 \cdot 6 \cdot 5$.« Ta račun šteje Bled–Bohinj–Piran in Piran–Bohinj–Bled kot dva izbora. Vprašaj se: ali dobim nekaj drugega, če zamenjam dva izbrana elementa? Če ne, deli z $k!$ oziroma uporabi $\binom{n}{k}$.
- **Seštevanje namesto množenja.** V Primeru 3 bi kdo zapisal $20 + 6 = 26$. Seštevaš le, kadar izbereš eno ali drugo možnost; kadar izbiraš eno in drugo zaporedoma, množiš.
- **Ponavljanje, ki ga ni (ali ga je).** Ključavnica na kovčku s štirimi kolesci ima $10^4$ kod, ker se števke smejo ponoviti ($0007$ je dovoljena koda). Pri obiskih krajev pa kraja, ki si ga že obiskal, ne izbiraš znova, zato je možnosti vsakič ena manj.
- **$0! = 0$.** Potem bi bil $\binom{5}{5} = \frac{5!}{5! \cdot 0!}$ deljenje z nič. Velja $0! = 1$, zato je $\binom{5}{5} = 1$: vseh pet izbereš na en sam način.
- **Pozabljen $(n-k)!$ v binomskem koeficientu.** $\binom{7}{3} \ne \frac{7!}{3!} = 840$. Pravilno: $\frac{7!}{3! \cdot 4!} = 35$. V praksi je krajše: zgoraj $k$ padajočih faktorjev od $n$, spodaj $k!$.

## Povzetek

- Osnovni izrek: pri zaporednih izbirah z $m$ in $n$ možnostmi je vseh izbir $m \cdot n$.
- Permutacije (vsi elementi, vrstni red pomemben): $P_n = n!$; $0! = 1$.
- Variacije ($k$ od $n$, vrstni red pomemben): $V_n^k = \frac{n!}{(n-k)!}$; s ponavljanjem $n^k$.
- Kombinacije ($k$ od $n$, vrstni red ni pomemben): $C_n^k = \binom{n}{k} = \frac{n!}{k!\,(n-k)!} = \frac{V_n^k}{k!}$.
- Velja $\binom{n}{k} = \binom{n}{n-k}$.
- Pravilo vsote: izbereš eno *ali* drugo iz primerov, ki se ne prekrivajo ($m$ in $n$ možnosti), vseh možnosti je $m + n$.
- Permutacije s ponavljanjem ($n$ elementov, $k_1, \ldots, k_r$ enakih po vrstah): $P_n^{k_1, \ldots, k_r} = \frac{n!}{k_1! \cdots k_r!}$.
- Pred računanjem vprašaj: vsi ali le nekateri? Je vrstni red pomemben? Je ponavljanje dovoljeno?

## Drugače: Z analogijo

Misli na **fotografijo** in na **nahrbtnik**.

Ko se trije prijatelji postavijo za fotografijo pred Triglavom, je pomembno, kdo stoji levo in kdo desno: Ana–Bor–Cene je druga slika kot Cene–Bor–Ana. To so permutacije in variacije. Ko pa iste tri stvari zložiš v nahrbtnik, je vseeno, katero si dal noter prvo: v nahrbtniku je le »kup«. To so kombinacije.

Vsak nahrbtnik s $k$ stvarmi lahko »fotografiraš« na $k!$ načinov. Zato je fotografij $k!$-krat več kot nahrbtnikov: $V_n^k = k! \cdot \binom{n}{k}$.

## Drugače: Iz vsakdanjega življenja

Navigacijska aplikacija, ki išče najkrajšo pot skozi več postaj, ne more preizkusiti vseh vrstnih redov. Za $15$ postaj bi jih bilo več kot bilijon ($15! \approx 1{,}3 \cdot 10^{12}$). Zato uporablja pametne bližnjice, ki hitro najdejo dobro, ne nujno najboljše rešitve.

Letališča imajo tričrkovne oznake, na primer LJU za Ljubljano. Črke se smejo ponavljati in vrstni red je pomemben, zato je oznak lahko $26^3 = 17\,576$: dovolj za vsa večja letališča na svetu.

Ko s prijatelji izbirate, katere $3$ od $7$ znamenitosti v Rimu boste obiskali v enem dnevu, imate $\binom{7}{3} = 35$ možnosti. Ko pa izbor razporedite na jutro, popoldne in večer, jih je $210$.

## Preveri se

? Na zemljevidu Evrope je $12$ mest. Izbereš $4$ in jih označiš z enako zeleno zastavico. Kaj je en tak izbor?
- Permutacija $12$ elementov.
~ Permutacija razvrsti vse elemente. Tu izbereš le $4$ od $12$ in jih ne razvrščaš.
- Variacija $4$. razreda iz $12$ elementov.
~ Variacija upošteva vrstni red. Zastavice so enake, zato zamenjava dveh mest ne da novega izbora.
+ Kombinacija $4$. razreda iz $12$ elementov.
> Izbiramo $4$ od $12$ brez vrstnega reda in brez ponavljanja: to je kombinacija. Vseh izborov je $\binom{12}{4}$.

? Katera neenakost med $P_4$, $\binom{7}{3}$, $V_7^3$ in $7^3$ je pravilna?
+ $P_4 < \binom{7}{3} < V_7^3 < 7^3$
- $\binom{7}{3} < P_4 < V_7^3 < 7^3$
~ Kombinacij je manj kot variacij, a ne manj od $P_4$: $\binom{7}{3} = 35$, $P_4 = 4! = 24$.
- $P_4 < V_7^3 < \binom{7}{3} < 7^3$
~ Kombinacij nikoli ni več kot variacij: vsak izbor da $k!$ vrstnih redov, zato je $V_7^3 = 6 \cdot \binom{7}{3}$.
> $P_4 = 24$, $\binom{7}{3} = 35$, $V_7^3 = 210$, $7^3 = 343$. S ponavljanjem je možnosti največ, ker se izbira nikoli ne zmanjša.

? Prijatelj ima načrt za obisk $6$ krajev in pravi: »Če dodam sedmi kraj, bo vrstnih redov komaj kaj več.« Koliko jih je v resnici?
- Za $1$ več.
~ Novega kraja ne dobiš le kot novo možnost, lahko ga vstaviš na katero koli mesto v vsakem starem vrstnem redu.
- Dvakrat več.
~ Novi kraj ima v vsakem starem vrstnem redu $7$ možnih mest, ne $2$.
+ Sedemkrat več.
- Za $7$ več.
~ Faktor $7$ množi, ne prišteva: iz vsakega od $720$ starih vrstnih redov nastane $7$ novih.
> $6! = 720$, $7! = 7 \cdot 6! = 5040$. Novi kraj lahko vstaviš na $7$ mest v vsakem od starih vrstnih redov.

? Ključavnica na kovčku ima $4$ kolesca, na vsakem so števke od $0$ do $9$. Koliko različnih kod lahko nastaviš?
- $5040$
~ To je $10 \cdot 9 \cdot 8 \cdot 7$, kot da se števke ne smejo ponavljati. Koda $1111$ pa je povsem dovoljena.
- $210$
~ To je $\binom{10}{4}$, kot da vrstni red ni pomemben. Koda $1234$ ni ista kot $4321$.
+ $10\,000$
- $40$
~ To je $4 \cdot 10$, seštevanje možnosti kolesc. Kolesca so zaporedne izbire, zato možnosti množiš.
> Vsako kolesce ima $10$ možnosti, vrstni red je pomemben in ponavljanje je dovoljeno: $10^4 = 10\,000$ kod.

? Iz skupine $10$ popotnikov izberejo tri: prvi nosi zemljevid, drugi kompas, tretji GPS-napravo. Na koliko načinov lahko razdelijo naloge?
- $120$
~ To je $\binom{10}{3}$. Naloge so različne, zato je pomembno, kdo nosi kaj: vrstni red šteje.
+ $720$
- $1000$
~ To je $10^3$, kot da bi isti popotnik lahko nosil vse tri stvari. Tu so to trije različni ljudje.
- $30$
~ To je $10 \cdot 3$. Pri vsaki nalogi izbiraš izmed preostalih popotnikov in možnosti množiš.
> Izbiramo $3$ od $10$, vrstni red je pomemben, brez ponavljanja: $V_{10}^3 = 10 \cdot 9 \cdot 8 = 720$.

:::simboli
n | število vseh elementov | | | v primerih število krajev
k | število izbranih elementov (razred) | | | $k \le n$
P_n | število permutacij $n$ elementov | P_n = n! | | $n! = n \cdot (n-1) \cdots 1$, $0! = 1$
V_n | število variacij $V_n^k$ ($k$ od $n$, vrstni red pomemben) | V_n^k = \frac{n!}{(n-k)!} | | razred $k$ je zapisan zgoraj
p | oznaka »s ponavljanjem« v $^{(p)}V_n^k$ | ^{(p)}V_n^k = n^k | | elementi se smejo ponavljati
C_n | število kombinacij $C_n^k$ ($k$ od $n$, vrstni red ni pomemben) | C_n^k = \binom{n}{k} = \frac{n!}{k!\,(n-k)!} | | $\binom{n}{k}$ beremo »$n$ nad $k$«
P_5 | število vrstnih redov petih krajev | P_5 = 5! | |
m | število možnosti prvega koraka oziroma primera | | |
k_1, k_2, k_r | število enakih elementov posamezne vrste | | | $k_1 + k_2 + \dots + k_r = n$
:::

<<RACUN
vrednost: 4+3 | 7
vrednost: 26^2+26^3 | 18252
vrednost: factorial(3)/factorial(2) | 3
vrednost: factorial(8) | 40320
vrednost: factorial(8)/(factorial(2)*factorial(2)) | 10080
vrednost: factorial(6)/factorial(3)^2*factorial(4)/factorial(2)^2 | 120
resi: n*(n-1)/2=45 | n | -9, 10
>>
