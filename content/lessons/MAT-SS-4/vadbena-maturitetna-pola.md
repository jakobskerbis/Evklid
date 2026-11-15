---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Uganka. Do konca pole imaš še $20$ minut, pred tabo pa so štiri naloge o vremenu. Za vsako veš, koliko točk prinese in koliko časa bi ti vzela:

| naloga | točke | čas |
|---|---|---|
| A: dež | $2$ | $3$ min |
| B: temperatura | $6$ | $10$ min |
| C: sneg | $8$ | $18$ min |
| D: veter | $3$ | $4$ min |

Pri nalogi C nisi čisto prepričan, da jo znaš. Katere naloge rešiš, da zbereš čim več točk? Poskusi, preden bereš naprej.

C prinese največ točk, a sama pobere $18$ minut. Nobena druga naloga ne gre več zraven, pa še ni gotovo, da jo rešiš do konca. A, B in D skupaj vzamejo $3 + 10 + 4 = 17$ minut in prinesejo $2 + 6 + 3 = 11$ točk. Najbogatejša naloga torej ni najboljša izbira.

Matura iz matematike ne meri samo tega, kaj znaš. Pišeš dve poli po $90$ minut, in kdor ima načrt, zbere več točk od sošolca z enakim znanjem, ki obtiči pri tretji nalogi. Tu dobiš ta načrt, na koncu pa ga preizkusiš na celi poli 1 in celi poli 2.

## Razlaga

**1. Zgradba pole.** Pola 1 traja $90$ minut in jo pišeš brez računala. Pola 2 traja prav tako $90$ minut, pri njej smeš uporabljati osnovno računalo. Vsaka pola prinese $40\,\%$ ocene, ustni izpit preostalih $20\,\%$. Obema je priložena **priloga s formulami**, list s formulami, ki jih ni treba znati na pamet. Oglej si jo že med letom, da boš na izpitu vedel, kaj na njej najdeš in česa ne.

Na osnovni ravni ima pola $60$ točk. Prvi del je $8$ **kratkih nalog** (vsaka do $3$ točke, skupaj $20$). Drugi del je $6$ **krajših strukturiranih nalog** (vsaka $5$ do $8$ točk, skupaj $40$). Strukturirana naloga ima dele a), b), c), ki se pogosto opirajo drug na drugega. Na višji ravni kratkih nalog ni: poleg šestih krajših strukturiranih rešuješ še $2$ **strukturirani nalogi** po $9$ do $11$ točk, spet skupaj $60$ točk.

**2. Koliko časa ima ena točka.** Razdeli čas pole tako, kot so razdeljene točke, in poglej, koliko minut pride na točko v vsakem delu:

| del | točke | min | min/točko |
|---|---|---|---|
| kratke | $20$ | $30$ | $1{,}5$ |
| krajše | $40$ | $60$ | $1{,}5$ |
| dve dolgi | $20$ | $30$ | $1{,}5$ |
| cela pola | $60$ | $90$ | $1{,}5$ |

(»Dve dolgi« sta strukturirani nalogi po $9$ do $11$ točk, ki ju imaš samo na višji ravni.)

V vsaki vrstici je enako: $90 : 60 = 1{,}5$. To je **pravilo minute in pol**. Naloga s $k$ točkami naj ti vzame približno

$$m = 1{,}5 \cdot k$$

minut. Kratka naloga s $3$ točkami ima torej $4{,}5$ minute, strukturirana s $7$ točkami $10{,}5$ minute.

Pravilo ima luknjo: ne pusti časa za pregled pole in za preverjanje. Pametneje je prvih $5$ minut nameniti pregledu, zadnjih $10$ pa preverjanju. Za reševanje ostane $90 - 15 = 75$ minut, to je $75 : 60 = 1{,}25$ minute na točko.

:::risba stolpci
opis: Stolpčni prikaz »Načrt pole na osnovni ravni«. Navpična os so minute od 0 do 50 po 5. Pregled pole 5 minut, kratke naloge 25 minut, strukturirane naloge 50 minut, preverjanje 10 minut.
podnapis: Načrt pole na osnovni ravni (skupaj 90 minut)
os: minute
korak: 5
stolpec: pregled | 5
stolpec: kratke | 25
stolpec: strukturirane | 50
stolpec: preverjanje | 10
:::

**3. Vrstni red.** Naloge na poli lahko rešuješ v poljubnem vrstnem redu. Prvih pet minut preleti vse in ob vsaki naredi znak: ✓ (vem, kako), ? (morda), ✗ (nimam ideje). Najprej reši naloge s ✓, nato tiste z ?, šele na koncu poskusi naloge z ✗.

Med reševanjem velja **pravilo preskoka**: če naloga porabi dvakrat več časa, kot ji ga da pravilo minute in pol, in konca še ne vidiš, zapiši, kar imaš, nalogo označi in pojdi naprej. To je naloga C iz uganke: ni prepovedana, samo na vrsto pride zadnja.

:::premisli
Kratke naloge prinesejo samo tretjino točk. Zakaj jih je vseeno pametno rešiti pred strukturiranimi?
---
Ker so točke v njih najbolj varne: so kratke, pogosto zahtevajo eno orodje, zato redko obtičiš. Ko jih imaš za sabo, veš, koliko časa ti ostane za dolge naloge, in pišeš brez strahu, da boš lahke točke izgubil zaradi ure.
:::

**4. Kako točkuje ocenjevalec.** Poglej, kako so točkovane tri rešitve iste kratke naloge »Reši enačbo $\log_3 (x - 1) = 2$« (2 točki). Točkovnik da $1$ točko za zapis $x - 1 = 3^2$ in $1$ točko za $x = 10$.

| dijak | zapis | točke |
|---|---|---|
| Ana | $x - 1 = 9$, zato $x = 10$ | $2$ |
| Bor | samo »$x = 10$« | do $1$ |
| Cene | $x - 1 = 3^2$, zato $x = 11$ | $1$ |

Kaj opaziš? Točke ne stojijo pri končnem številu, ampak pri **korakih**. Navodila na poli zahtevajo, da je pot do rezultata jasno zapisana z vmesnimi računi in sklepi, zato Bor s pravilnim rezultatom brez poti izgubi večino točk ali vse. Cene se je zmotil v zadnjem računu, a nastavek je pravilen in ga ocenjevalec točkuje.

Iz tega sledijo pravila za zapis:

- Zapiši nastavek (enačbo, formulo z vstavljenimi podatki), vmesne rezultate in sklep.
- Pri besedilni nalogi odgovori s stavkom in z enoto; odgovori na vprašanje, ki je postavljeno (»ob kateri uri«, ne »pri $t = 6$«).
- Na poli 2 zaokroži tako, kot zahteva naloga, in ne zaokrožuj vmesnih rezultatov.
- Če si nalogo rešil na dva načina, jasno prečrtaj tistega, ki naj se ne točkuje.

:::premisli
Pri delu a) dobiš napačen rezultat in ga uporabiš pri delu b). Napovej: ali si s tem izgubil vse točke dela b)?
---
Pogosto ne. Če je postopek pri b) pravilen in si napačni rezultat iz a) uporabil dosledno, ocenjevalec navadno prizna točke za postopek, izgubiš pa točko za končni rezultat. Zato tudi z napačnim a) vedno nadaljuj.
:::

**5. Iz besed v orodje.** Na poli 1 vsaka naloga poveže dve ali tri poglavja. Ključne besede iz prvih treh letnikov:

| v besedilu piše | orodje | zapis |
|---|---|---|
| presečišče | enačba | $f(x) = g(x)$ |
| $\log_a x$ | pogoj | $x > 0$ |
| natančno | krožnica | $\sin 60° = \tfrac{\sqrt{3}}{2}$ |
| pravokotna | produkt | $\vec a \cdot \vec b = 0$ |
| deljiv | ostanek | $p(a) = 0$ |
| pol | ulomek | $q(x) = 0$ |

Krajše oznake: »krožnica« je enotska krožnica, »produkt« skalarni produkt, »ostanek« izrek o ostanku (polinom $p$ je deljiv z $x - a$ natanko tedaj, ko je $p(a) = 0$), $q$ pa imenovalec racionalne funkcije.

**6. Preverjanje in ko obtičiš.** V zadnjih desetih minutah preveri rezultate na tri načine: vstavi rešitev v prvotno enačbo, preveri pogoje (koren, logaritem, imenovalec) in oceni smiselnost (čas in dolžina sta pozitivna, verjetnost je med $0$ in $1$). Pri nalogi, kjer ne veš naprej, zapiši podatke, formulo s priloge in nastavek; ena točka je pogosto prav za nastavek. Del b) je velikokrat rešljiv tudi brez dela a).

## Rešeni primeri

### Primer 1 (lažji): lokvanji, kratka naloga, 3 točke, pola 1

Lokvanji na ribniku pokrivajo $3\,\mathrm{m^2}$. Vsak teden se pokrita površina potroji. Po koliko tednih bodo lokvanji pokrivali $243\,\mathrm{m^2}$?

**Podatki:** začetna površina $P_0 = 3\,\mathrm{m^2}$, količnik $q = 3$ na teden, končna površina $P_n = 243\,\mathrm{m^2}$
**Iščemo:** število tednov $n$

:::formula
Površine po tednih so geometrijsko zaporedje: $P_n = P_0 \cdot q^n$
:::

**Rešitev:** (geometrijsko zaporedje + eksponentna enačba)

1. Besede »vsak teden se potroji« pomenijo geometrijsko zaporedje s $q = 3$, zato velja enačba $3 \cdot 3^n = 243$. Ocenjevalec: $1$ točka za nastavek.
2. Delimo s $3$: $3^n = 81 = 3^4$. Potenci z enako osnovo sta enaki, ko sta enaka eksponenta, zato $n = 4$. Ocenjevalec: $1$ točka.
3. Preverba: $3 \cdot 3^4 = 3 \cdot 81 = 243$.
4. Odgovor: lokvanji bodo pokrivali $243\,\mathrm{m^2}$ po $4$ tednih. Ocenjevalec: $1$ točka za odgovor s pravo enoto (tedni).

Dijak, ki zapiše zaporedje $3$, $9$, $27$, $81$, $243$ in prešteje štiri korake, prav tako dobi vse tri točke: točkuje se vsaka pravilna in jasno zapisana pot.

### Primer 2: jesenski dan, krajša strukturirana naloga, 7 točk, pola 1

Temperaturo zraka v jesenskem dnevu med 6. in 18. uro opisuje funkcija $T(t) = -\frac{1}{4}t^2 + 3t + 2$, kjer je $t$ čas v urah od 6. ure, $T$ pa temperatura v $°\mathrm{C}$.

a) Kolikšna je temperatura ob 6. in ob 18. uri? (1 točka)
b) Z odvodom določi, kdaj je najtopleje in koliko stopinj je takrat. (3 točke)
c) V katerem časovnem intervalu je topleje kot $10\,°\mathrm{C}$? (3 točke)

**Podatki:** $T(t) = -\frac{1}{4}t^2 + 3t + 2$ v $°\mathrm{C}$, $t \in [0, 12]$ v urah od 6. ure
**Iščemo:** $T(0)$ in $T(12)$; čas in vrednost največje temperature; interval, v katerem je $T > 10\,°\mathrm{C}$

:::formula
Največja vrednost: $T'(t) = 0$. Kvadratna neenačba: ničle, nato predznak.
:::

**Rešitev:** (odvod + kvadratna neenačba)

1. a) $T(0) = 2$ in $T(12) = -36 + 36 + 2 = 2$, torej je ob 6. in ob 18. uri $2\,°\mathrm{C}$.
2. b) Odvod je $T'(t) = -\frac{1}{2}t + 3$. Enačba $-\frac{1}{2}t + 3 = 0$ da $t = 6$.
3. b) Pred $t = 6$ je odvod pozitiven, za njim negativen, zato je tam maksimum: $T(6) = -9 + 18 + 2 = 11$.
4. b) Čas $t = 6$ pomeni šest ur po 6. uri. Najtopleje je ob 12. uri, ko je $11\,°\mathrm{C}$.
5. c) Neenačba $-\frac{1}{4}t^2 + 3t + 2 > 10$; pomnožimo z $-4$ in obrnemo neenačaj: $t^2 - 12t + 32 < 0$.
6. c) Razcep $(t - 4)(t - 8)$ da ničli $4$ in $8$. Parabola je odprta navzgor, zato je negativna med ničlama: $4 < t < 8$.
7. c) Odgovor: topleje kot $10\,°\mathrm{C}$ je med 10. in 14. uro.

**Točkovanje:** a) $1$ točka; b) $1$ za odvod, $1$ za $t = 6$, $1$ za »ob 12. uri, $11\,°\mathrm{C}$«; c) $1$ za neenačbo $t^2 - 12t + 32 < 0$, $1$ za ničli $4$ in $8$, $1$ za interval od 10. do 14. ure.

Rok je pri b) napisal »$t = 6$, najtopleje je ob 6. uri«, pri c) pa je za odgovor zapisal samo $4 < t < 8$. Po tem točkovniku dobi $1 + 2 + 2 = 5$ od $7$ točk. Računal je pravilno, a obe zadnji točki je izgubil, ker ni odgovoril na vprašanje »kdaj«.

### Primer 3 (težji): vodostaj po nalivu, pola 1

Med nalivom se vodostaj reke spreminja s hitrostjo $v(t) = 6t - t^2$ centimetrov na uro, kjer je $t$ čas v urah od začetka naliva. Koliko časa vodostaj narašča in za koliko centimetrov se v tem času dvigne?

**Podatki:** hitrost spreminjanja vodostaja $v(t) = 6t - t^2$ v $\mathrm{cm/h}$, čas $t \geq 0$ v urah
**Iščemo:** trajanje naraščanja in dvig vodostaja $\Delta h$

:::formula
Vodostaj narašča, kjer je $v(t) > 0$. Dvig: $\Delta h = \int_a^b v(t)\,dt$
:::

**Rešitev:** (kvadratna funkcija + določeni integral)

1. Razcep $v(t) = t(6 - t)$ ima ničli $0$ in $6$. Parabola je odprta navzdol, zato je $v(t) > 0$ med ničlama. Vodostaj narašča $6$ ur.
2. Dvig je integral hitrosti po času: $\Delta h = \int_0^6 (6t - t^2)\,dt$. Že ta nastavek je na točkovniku vreden točko, tudi če bi se pri integriranju ustavil.
3. Primitivna funkcija je $3t^2 - \frac{t^3}{3}$.
4. Vstavi meji in zapiši odgovor sam, nato preveri:

:::premisli
Koliko je $\left[3t^2 - \frac{t^3}{3}\right]_0^6$ in za koliko se dvigne vodostaj?
---
$3 \cdot 36 - \frac{216}{3} = 108 - 72 = 36$, vodostaj se dvigne za $36\,\mathrm{cm}$. Smiselnost: največja hitrost je $v(3) = 9\,\mathrm{cm/h}$, v šestih urah torej manj kot $6 \cdot 9 = 54\,\mathrm{cm}$. Rezultat $36\,\mathrm{cm}$ je pod to mejo.
:::

## Pogoste napake

- **Reševanje po vrsti do konca.** »Naloga 3 je na vrsti, dokler je ne rešim.« Tako ti ura poje lahke točke na koncu pole. Popravek: pravilo preskoka; po dvojnem času nalogo označi in se vrni na koncu.
- **Samo rezultat.** »Rezultat je pravilen, torej dobim vse točke.« Točke stojijo pri korakih in brez zapisane poti lahko izgubiš večino točk ali vse. Popravek: zapiši nastavek, vmesne rezultate in sklep.
- **Odgovor na drugo vprašanje.** »Izračunal sem $t = 6$, to je odgovor.« Naloga sprašuje »ob kateri uri«, zato manjka zadnji korak. Popravek: pred odgovorom še enkrat preberi vprašanje in zapiši stavek z enoto.
- **Pozabljen pogoj.** Pri množenju z imenovalcem ali pri logaritmih lahko dobiš rešitev, ki prvotne enačbe ne reši. Popravek: vsako rešitev vstavi nazaj ali preveri pogoje.
- **»Brez a) ni b).«** Dijak ob napačnem ali manjkajočem a) obupa nad celo nalogo. Del b) je pogosto neodvisen, točke za postopek pa dobiš tudi z napačnim vmesnim rezultatom. Popravek: vedno poskusi vse dele.

## Povzetek

- Pola traja $90$ minut; pola 1 je brez računala, pola 2 z osnovnim računalom, obe imata prilogo s formulami.
- Osnovna raven: $8$ kratkih nalog (skupaj $20$ točk) in $6$ krajših strukturiranih (skupaj $40$); višja raven: $6$ krajših strukturiranih in $2$ strukturirani nalogi po $9$ do $11$ točk.
- Pravilo minute in pol: naloga s $k$ točkami ima približno $1{,}5 \cdot k$ minut; s $15$ minutami za pregled in preverjanje $1{,}25$ minute na točko.
- Najprej preleti polo, reši naloge, ki jih znaš, po dvojnem času preskoči in se vrni.
- Točke so za korake: nastavek, vmesni rezultat, rezultat, odgovor z enoto. Rezultat brez poti lahko izgubi večino točk ali vse.
- Preverjanje: vstavi nazaj, preveri pogoje, oceni smiselnost. Ko obtičiš, zapiši nastavek.

## Za maturo

Pola 1: $90$ minut, brez računala, s prilogo s formulami. Na osnovni ravni rešiš Naloge 1–14 ($60$ točk), na višji ravni Naloge 9–16 ($60$ točk). Za vsako točko imaš približno minuto in pol; ura naj teče, ko začneš.

### Naloga 1: kratka naloga, 2 točki, pola 1 (brez računala)

Reši enačbo $2^{3x - 1} = 4^{x + 1}$.

**Rešitev:** (potence + eksponentna enačba)

1. $4^{x + 1} = (2^2)^{x + 1} = 2^{2x + 2}$, zato dobimo enačbo $2^{3x - 1} = 2^{2x + 2}$.
2. Osnovi sta enaki, zato sta enaka eksponenta: enačba $3x - 1 = 2x + 2$ da $x = 3$.
3. Preverba: $2^8 = 256$ in $4^4 = 256$.
4. Odgovor: rešitev je $x = 3$.

**Točkovanje:** $1$ točka za zapis obeh strani s potenco z osnovo $2$, $1$ točka za $x = 3$.

### Naloga 2: kratka naloga, 3 točke, pola 1 (brez računala)

Izračunaj koordinate presečišč grafa funkcije $f(x) = x^2 - 2x - 3$ z grafom linearne funkcije $g(x) = x + 1$.

**Rešitev:** (linearna funkcija + kvadratna enačba)

1. V presečišču velja enačba $x^2 - 2x - 3 = x + 1$, torej $x^2 - 3x - 4 = 0$.
2. Razcep $(x - 4)(x + 1) = 0$ da $x_1 = 4$ in $x_2 = -1$.
3. $g(4) = 5$ in $g(-1) = 0$.
4. Odgovor: presečišči sta $A(4, 5)$ in $B(-1, 0)$.

**Točkovanje:** $1$ točka za enačbo $x^2 - 3x - 4 = 0$, $1$ točka za abscisi $4$ in $-1$, $1$ točka za obe točki.

### Naloga 3: kratka naloga, 2 točki, pola 1 (brez računala)

Izračunaj natančno vrednost izraza $\dfrac{\sin 120°}{1 - \cos 150°}$. Rezultat zapiši brez korena v imenovalcu.

**Rešitev:** (kotne funkcije poljubnega kota + koreni)

1. $\sin 120° = \sin 60° = \frac{\sqrt{3}}{2}$ in $\cos 150° = -\cos 30° = -\frac{\sqrt{3}}{2}$.
2. Izraz je $\dfrac{\frac{\sqrt{3}}{2}}{1 + \frac{\sqrt{3}}{2}} = \dfrac{\sqrt{3}}{2 + \sqrt{3}}$.
3. Razširimo z $2 - \sqrt{3}$: $\dfrac{\sqrt{3}\,(2 - \sqrt{3})}{4 - 3} = 2\sqrt{3} - 3$.
4. Odgovor: vrednost izraza je $2\sqrt{3} - 3$.

**Točkovanje:** $1$ točka za vrednosti $\sin 120°$ in $\cos 150°$, $1$ točka za racionaliziran rezultat $2\sqrt{3} - 3$.

### Naloga 4: kratka naloga, 3 točke, pola 1 (brez računala)

Polinom $p(x) = x^3 + ax^2 - 4x - 4$ je deljiv z $x - 2$. Določi $a$ in vse ničle polinoma $p$.

**Rešitev:** (polinomi + razstavljanje)

1. Polinom je deljiv z $x - 2$, zato velja enačba $p(2) = 0$: $8 + 4a - 8 - 4 = 0$, torej $a = 1$.
2. $p(x) = x^3 + x^2 - 4x - 4 = x^2(x + 1) - 4(x + 1) = (x + 1)(x^2 - 4)$.
3. $p(x) = (x + 1)(x - 2)(x + 2)$.
4. Odgovor: $a = 1$, ničle so $-2$, $-1$ in $2$.

**Točkovanje:** $1$ točka za $a = 1$, $1$ točka za razcep (ali Hornerjev algoritem), $1$ točka za vse tri ničle.

### Naloga 5: kratka naloga, 2 točki, pola 1 (brez računala)

V aritmetičnem zaporedju je $a_3 = 7$ in $a_8 = 22$. Izračunaj prvi člen in diferenco zaporedja.

**Rešitev:** (aritmetično zaporedje + sistem linearnih enačb)

1. Iz $a_n = a_1 + (n - 1)d$ dobimo sistem $a_1 + 2d = 7$ in $a_1 + 7d = 22$.
2. Odštejemo prvo enačbo od druge: $5d = 15$, $d = 3$; nato $a_1 = 7 - 6 = 1$.
3. Odgovor: $a_1 = 1$ in $d = 3$.

**Točkovanje:** $1$ točka za sistem enačb, $1$ točka za $a_1 = 1$ in $d = 3$.

### Naloga 6: kratka naloga, 3 točke, pola 1 (brez računala)

Za katere vrednosti parametra $m$ sta vektorja $\vec a = (m, 2, -1)$ in $\vec b = (m, m, 8)$ pravokotna?

**Rešitev:** (skalarni produkt + kvadratna enačba)

1. Vektorja sta pravokotna natanko tedaj, ko je $\vec a \cdot \vec b = 0$.
2. $\vec a \cdot \vec b = m^2 + 2m - 8$, zato rešujemo enačbo $m^2 + 2m - 8 = 0$.
3. Razcep $(m + 4)(m - 2) = 0$ da $m = -4$ ali $m = 2$.
4. Preverba za $m = 2$: $4 + 4 - 8 = 0$.
5. Odgovor: vektorja sta pravokotna za $m = -4$ in za $m = 2$.

**Točkovanje:** $1$ točka za pogoj $\vec a \cdot \vec b = 0$, $1$ točka za enačbo $m^2 + 2m - 8 = 0$, $1$ točka za obe rešitvi.

### Naloga 7: kratka naloga, 2 točki, pola 1 (brez računala)

Izračunaj limito $\lim\limits_{x \to 3} \dfrac{x^2 - 9}{x^2 - 3x}$.

**Rešitev:** (razstavljanje + limita funkcije)

1. Vstavljanje $x = 3$ da $\frac{0}{0}$, zato števec in imenovalec razstavimo: $\dfrac{(x - 3)(x + 3)}{x(x - 3)} = \dfrac{x + 3}{x}$ za $x \neq 3$.
2. $\lim\limits_{x \to 3} \dfrac{x + 3}{x} = \dfrac{6}{3} = 2$.
3. Odgovor: limita je $2$.

**Točkovanje:** $1$ točka za razcep in krajšanje, $1$ točka za limito $2$.

### Naloga 8: kratka naloga, 3 točke, pola 1 (brez računala)

Iz števk $1$, $2$, $3$, $4$ in $5$ sestavljamo štirimestna števila, v katerih se nobena števka ne ponovi.

a) Koliko je vseh takih števil? (1 točka)
b) Koliko jih je deljivih s $4$? (2 točki)

**Rešitev:** (kombinatorika + deljivost)

1. a) Prvo števko izberemo na $5$ načinov, drugo na $4$, tretjo na $3$, četrto na $2$: $5 \cdot 4 \cdot 3 \cdot 2 = 120$.
2. b) Število je deljivo s $4$, če je s $4$ deljivo dvomestno število iz njegovih zadnjih dveh števk. Iz danih števk brez ponavljanja so to $12$, $24$, $32$ in $52$: štiri končnice.
3. b) Za vsako končnico prvi dve števki izberemo iz preostalih treh na $3 \cdot 2 = 6$ načinov, skupaj $4 \cdot 6 = 24$.
4. Odgovor: vseh števil je $120$, deljivih s $4$ jih je $24$.

**Točkovanje:** a) $1$ točka za $120$; b) $1$ točka za štiri končnice, $1$ točka za $24$.

### Naloga 9: krajša strukturirana naloga, 6 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = \log_2 (x + 2)$.

a) Zapiši definicijsko območje funkcije $f$ in izračunaj njeno ničlo. (2 točki)
b) Reši enačbo $\log_2 (x + 2) + \log_2 (x - 2) = 5$. (3 točke)
c) Za katere $x$ je $f(x) < 3$? (1 točka)

**Rešitev:** (logaritemska funkcija + kvadratna enačba + linearna neenačba)

1. a) Argument mora biti pozitiven: $x + 2 > 0$, zato $D_f = (-2, \infty)$.
2. a) Ničla: $\log_2 (x + 2) = 0$ pomeni $x + 2 = 1$, torej $x = -1$.
3. b) Pogoj za oba logaritma je $x > 2$. Vsota logaritmov je logaritem produkta: $\log_2 \big((x + 2)(x - 2)\big) = 5$, zato enačba $x^2 - 4 = 32$.
4. b) $x^2 = 36$, $x = 6$ ali $x = -6$. Rešitev $x = -6$ ne izpolni pogoja $x > 2$.
5. b) Preverba: $\log_2 8 + \log_2 4 = 3 + 2 = 5$.
6. c) Funkcija $\log_2$ je naraščajoča, zato iz $\log_2 (x + 2) < 3$ sledi $0 < x + 2 < 8$, torej $-2 < x < 6$.
7. Odgovor: $D_f = (-2, \infty)$, ničla $x = -1$; rešitev enačbe je $x = 6$; $f(x) < 3$ za $x \in (-2, 6)$.

**Točkovanje:** a) $1$ točka za definicijsko območje, $1$ točka za ničlo; b) $1$ točka za enačbo $x^2 - 4 = 32$, $1$ točka za $\pm 6$, $1$ točka za izločitev $-6$ in rešitev $x = 6$; c) $1$ točka za interval $(-2, 6)$.

### Naloga 10: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = \dfrac{2x^2 - 2}{x^2 - 4}$.

a) Izračunaj ničle, pole in začetno vrednost funkcije $f$. (3 točke)
b) Zapiši enačbo vodoravne asimptote in pokaži, da je graf funkcije ne seka. (2 točki)
c) Za katere $x$ je $f(x) = \frac{5}{2}$? (2 točki)

**Rešitev:** (razstavljanje + racionalna funkcija + racionalna enačba)

1. a) Razstavimo: $f(x) = \dfrac{2(x - 1)(x + 1)}{(x - 2)(x + 2)}$. Ničli sta $-1$ in $1$, pola sta $-2$ in $2$.
2. a) Začetna vrednost: $f(0) = \dfrac{-2}{-4} = \dfrac{1}{2}$.
3. b) Števec in imenovalec imata enako stopnjo, zato je vodoravna asimptota $y = \frac{2}{1} = 2$.
4. b) Presečišče z asimptoto bi rešilo enačbo $2x^2 - 2 = 2(x^2 - 4)$, torej $-2 = -8$, kar ne drži. Graf asimptote ne seka.
5. c) Pogoj je $x \neq \pm 2$. Enačbo $\frac{2x^2 - 2}{x^2 - 4} = \frac{5}{2}$ pomnožimo z $2(x^2 - 4)$: $4x^2 - 4 = 5x^2 - 20$, torej $x^2 = 16$.
6. c) Rešitvi $x = -4$ in $x = 4$ izpolnjujeta pogoj. Preverba: $f(4) = \frac{30}{12} = \frac{5}{2}$.
7. Odgovor: ničli $\pm 1$, pola $\pm 2$, začetna vrednost $\frac{1}{2}$; asimptota $y = 2$; $f(x) = \frac{5}{2}$ za $x = -4$ in $x = 4$.

**Točkovanje:** a) $1$ točka za ničli, $1$ točka za pola, $1$ točka za začetno vrednost; b) $1$ točka za $y = 2$, $1$ točka za utemeljitev; c) $1$ točka za enačbo $x^2 = 16$ (ali enakovredno), $1$ točka za obe rešitvi s preverjenim pogojem.

### Naloga 11: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = x^3 - 3x^2 - 9x + 5$.

a) Izračunaj stacionarni točki funkcije $f$ in določi njuno vrsto. (4 točke)
b) Zapiši intervale, na katerih funkcija $f$ narašča. (1 točka)
c) Zapiši enačbo tangente na graf funkcije $f$ v točki z absciso $x_0 = 0$. (2 točki)

**Rešitev:** (polinom + odvod + kvadratna enačba)

1. a) $f'(x) = 3x^2 - 6x - 9 = 3(x^2 - 2x - 3) = 3(x - 3)(x + 1)$; enačba $f'(x) = 0$ ima rešitvi $-1$ in $3$.
2. a) $f(-1) = -1 - 3 + 9 + 5 = 10$ in $f(3) = 27 - 27 - 27 + 5 = -22$.
3. a) Odvod je pozitiven za $x < -1$, negativen med $-1$ in $3$ ter pozitiven za $x > 3$. Točka $(-1, 10)$ je lokalni maksimum, $(3, -22)$ lokalni minimum.
4. b) Funkcija narašča na $(-\infty, -1)$ in na $(3, \infty)$.
5. c) $f(0) = 5$ in $f'(0) = -9$, zato je tangenta $y = -9x + 5$.
6. Odgovor: maksimum $(-1, 10)$, minimum $(3, -22)$; narašča na $(-\infty, -1)$ in $(3, \infty)$; tangenta $y = -9x + 5$.

**Točkovanje:** a) $1$ točka za odvod, $1$ točka za ničli odvoda, $1$ točka za ordinati $10$ in $-22$, $1$ točka za vrsto obeh točk; b) $1$ točka; c) $1$ točka za $f'(0) = -9$, $1$ točka za enačbo tangente.

### Naloga 12: krajša strukturirana naloga, 6 točk, pola 1 (brez računala)

Gozdar sadi mlade smreke v vrste. V prvo vrsto posadi $2$ smreki, v vsako naslednjo $3$ več kot v prejšnjo.

a) Koliko smrek posadi v deseto vrsto? (1 točka)
b) Pokaži, da je v prvih $n$ vrstah skupaj $\dfrac{n(3n + 1)}{2}$ smrek. (2 točki)
c) Gozdar ima $155$ sadik in porabi vse. Koliko vrst zasadi? (3 točke)

**Rešitev:** (aritmetično zaporedje + kvadratna enačba)

1. a) Števila smrek v vrstah so aritmetično zaporedje z $a_1 = 2$ in $d = 3$: $a_{10} = 2 + 9 \cdot 3 = 29$.
2. b) $S_n = \frac{n}{2}\big(2a_1 + (n - 1)d\big) = \frac{n}{2}(4 + 3n - 3) = \frac{n(3n + 1)}{2}$.
3. c) Enačba $\frac{n(3n + 1)}{2} = 155$ da $3n^2 + n - 310 = 0$.
4. c) Diskriminanta je $1 + 12 \cdot 310 = 3721 = 61^2$, zato $n = \frac{-1 \pm 61}{6}$: $n = 10$ ali $n = -\frac{31}{3}$.
5. c) Število vrst je naravno število, zato je $n = 10$. Preverba: $\frac{10 \cdot 31}{2} = 155$.
6. Odgovor: v deseti vrsti je $29$ smrek, s $155$ sadikami gozdar zasadi $10$ vrst.

**Točkovanje:** a) $1$ točka; b) $1$ točka za formulo za vsoto z vstavljenima $a_1$ in $d$, $1$ točka za poenostavitev; c) $1$ točka za kvadratno enačbo, $1$ točka za rešitvi, $1$ točka za izbiro $n = 10$ z odgovorom.

### Naloga 13: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dane so točke $A(1, 2, 0)$, $B(2, 3, 0)$ in $C(1, 3, 1)$.

a) Zapiši vektorja $\vec{AB}$ in $\vec{AC}$ ter izračunaj njuni dolžini. (2 točki)
b) Izračunaj kot $\alpha$ med vektorjema $\vec{AB}$ in $\vec{AC}$. (2 točki)
c) Pokaži, da je trikotnik $ABC$ enakostraničen. (1 točka)
d) Določi točko $D$, da bo štirikotnik $ABDC$ paralelogram. (2 točki)

**Rešitev:** (vektorji + skalarni produkt + kotne funkcije posebnih kotov)

1. a) $\vec{AB} = (1, 1, 0)$ in $\vec{AC} = (0, 1, 1)$; $|\vec{AB}| = |\vec{AC}| = \sqrt{2}$.
2. b) $\cos \alpha = \dfrac{\vec{AB} \cdot \vec{AC}}{|\vec{AB}|\,|\vec{AC}|} = \dfrac{1}{\sqrt{2} \cdot \sqrt{2}} = \dfrac{1}{2}$, zato je $\alpha = 60°$.
3. c) $\vec{BC} = (-1, 0, 1)$ in $|\vec{BC}| = \sqrt{2}$: vse tri stranice so dolge $\sqrt{2}$.
4. d) V paralelogramu $ABDC$ je $\vec{CD} = \vec{AB}$, zato $D = C + \vec{AB} = (2, 4, 1)$.
5. Odgovor: $\vec{AB} = (1, 1, 0)$, $\vec{AC} = (0, 1, 1)$, obe dolžini $\sqrt{2}$; $\alpha = 60°$; trikotnik je enakostraničen; $D(2, 4, 1)$.

**Točkovanje:** a) $1$ točka za vektorja, $1$ točka za dolžini; b) $1$ točka za $\cos \alpha = \frac{1}{2}$, $1$ točka za $60°$; c) $1$ točka; d) $1$ točka za $\vec{CD} = \vec{AB}$ (ali $\vec{BD} = \vec{AC}$), $1$ točka za $D(2, 4, 1)$.

### Naloga 14: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dan je izraz $\left(x^2 - \dfrac{2}{x}\right)^6$, $x \neq 0$.

a) Zapiši splošni člen razvoja tako, da spremenljivka $x$ v njem nastopa v eni sami potenci. (2 točki)
b) Izračunaj člen razvoja, ki ne vsebuje $x$. (2 točki)
c) Izračunaj koeficient pri $x^3$. (2 točki)
d) Izračunaj vsoto vseh koeficientov razvoja. (1 točka)

**Rešitev:** (binomski izrek + potence)

1. a) $\binom{6}{k} (x^2)^{6 - k} \left(-\frac{2}{x}\right)^k = \binom{6}{k} (-2)^k x^{12 - 3k}$ za $k = 0, 1, \ldots, 6$.
2. b) Brez $x$: enačba $12 - 3k = 0$ da $k = 4$; člen je $\binom{6}{4} \cdot 16 = 15 \cdot 16 = 240$.
3. c) Pri $x^3$: enačba $12 - 3k = 3$ da $k = 3$; koeficient je $\binom{6}{3} \cdot (-8) = 20 \cdot (-8) = -160$.
4. d) Vsoto koeficientov dobimo pri $x = 1$: $(1 - 2)^6 = 1$.
5. Odgovor: splošni člen $\binom{6}{k} (-2)^k x^{12 - 3k}$; člen brez $x$ je $240$; koeficient pri $x^3$ je $-160$; vsota koeficientov je $1$.

**Točkovanje:** a) $1$ točka za binomski izrek, $1$ točka za potenco $x^{12 - 3k}$; b) $1$ točka za $k = 4$, $1$ točka za $240$; c) $1$ točka za $k = 3$, $1$ točka za $-160$; d) $1$ točka.

### Naloga 15 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dani sta funkciji $f(x) = \sin x$ in $g(x) = \sin 2x$ na intervalu $[0, \pi]$.

a) Reši enačbo $\sin 2x = \sin x$ na intervalu $[0, \pi]$. (3 točke)
b) Na katerem delu intervala $[0, \pi]$ leži graf funkcije $g$ nad grafom funkcije $f$? (2 točki)
c) Izračunaj ploščino lika, ki ga grafa funkcij $f$ in $g$ omejujeta na intervalu $[0, \pi]$. (5 točk)

**Rešitev:** (kotne funkcije dvojnega kota + trigonometrijska enačba + določeni integral)

1. a) Z dvojnim kotom dobimo enačbo $2 \sin x \cos x = \sin x$, torej $\sin x\,(2 \cos x - 1) = 0$. Enačbe ne delimo s $\sin x$, ker bi izgubili rešitve.
2. a) Enačba $\sin x = 0$ da na $[0, \pi]$ rešitvi $x = 0$ in $x = \pi$, enačba $\cos x = \frac{1}{2}$ pa $x = \frac{\pi}{3}$.
3. b) Razlika je $g(x) - f(x) = \sin x\,(2 \cos x - 1)$. Na $(0, \pi)$ je $\sin x > 0$, zato ima razlika predznak izraza $2 \cos x - 1$: pozitiven za $0 < x < \frac{\pi}{3}$ in negativen za $\frac{\pi}{3} < x < \pi$.
4. b) Graf funkcije $g$ leži nad grafom funkcije $f$ na intervalu $\left(0, \frac{\pi}{3}\right)$.
5. c) Lik razdelimo na dva dela, $S = S_1 + S_2$. Pri tem je $S_1 = \int_0^{\pi/3} (\sin 2x - \sin x)\,dx$ in $S_2 = \int_{\pi/3}^{\pi} (\sin x - \sin 2x)\,dx$.
6. c) Primitivna funkcija za $\sin 2x - \sin x$ je $F(x) = -\frac{1}{2} \cos 2x + \cos x$, za $\sin x - \sin 2x$ pa $-F(x)$.
7. c) $F\left(\frac{\pi}{3}\right) = \frac{1}{4} + \frac{1}{2} = \frac{3}{4}$, $F(0) = -\frac{1}{2} + 1 = \frac{1}{2}$ in $F(\pi) = -\frac{1}{2} - 1 = -\frac{3}{2}$.
8. c) $S_1 = \frac{3}{4} - \frac{1}{2} = \frac{1}{4}$ in $S_2 = \frac{3}{4} + \frac{3}{2} = \frac{9}{4}$.
9. c) $S = \frac{1}{4} + \frac{9}{4} = \frac{5}{2}$.
10. Odgovor: rešitve enačbe so $0$, $\frac{\pi}{3}$ in $\pi$; graf $g$ leži nad grafom $f$ na $\left(0, \frac{\pi}{3}\right)$; ploščina lika je $\frac{5}{2}$.

**Točkovanje:** a) $1$ točka za $\sin x\,(2 \cos x - 1) = 0$, $1$ točka za $0$ in $\pi$, $1$ točka za $\frac{\pi}{3}$; b) $1$ točka za predznak razlike $g - f$, $1$ točka za interval $\left(0, \frac{\pi}{3}\right)$; c) $1$ točka za razdelitev na dva integrala s pravim vrstnim redom funkcij, $1$ točka za primitivno funkcijo, $1$ točka za $S_1 = \frac{1}{4}$, $1$ točka za $S_2 = \frac{9}{4}$, $1$ točka za $S = \frac{5}{2}$.

### Naloga 16 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dano je zaporedje s splošnim členom $a_n = \dfrac{2n + 1}{n + 3}$, $n \in \mathbb{N}$.

a) Izračunaj limito zaporedja. (2 točki)
b) Dokaži, da je zaporedje naraščajoče. (3 točke)
c) Pokaži, da je zaporedje omejeno, in zapiši natančno spodnjo mejo ter eno zgornjo mejo. (2 točki)
d) Od katerega člena naprej se členi zaporedja od limite razlikujejo za manj kot $0{,}01$? (3 točke)

**Rešitev:** (zaporedja + limita + ulomljeni izrazi in neenačba)

1. a) Števec in imenovalec delimo z $n$: $a_n = \dfrac{2 + \frac{1}{n}}{1 + \frac{3}{n}}$, zato je limita $2$.
2. b) $a_{n+1} - a_n = \dfrac{2n + 3}{n + 4} - \dfrac{2n + 1}{n + 3}$. Na skupnem imenovalcu $(n + 3)(n + 4)$ je števec $(2n + 3)(n + 3) - (2n + 1)(n + 4)$.
3. b) Števec je $(2n^2 + 9n + 9) - (2n^2 + 9n + 4) = 5$, zato je $a_{n+1} - a_n = \dfrac{5}{(n + 3)(n + 4)} > 0$ za vsak $n$.
4. c) Zaporedje narašča, zato je natančna (največja) spodnja meja prvi člen $a_1 = \frac{3}{4}$.
5. c) Zapis $a_n = 2 - \dfrac{5}{n + 3}$ pokaže, da je $a_n < 2$ za vsak $n$: $2$ je zgornja meja.
6. d) $|a_n - 2| = \dfrac{5}{n + 3}$, zahtevamo $\dfrac{5}{n + 3} < \dfrac{1}{100}$, torej $n + 3 > 500$ in $n > 497$.
7. d) Za $n = 497$ je razlika natanko $\frac{5}{500} = 0{,}01$, kar ni manj kot $0{,}01$.
8. Odgovor: limita je $2$; zaporedje narašča; $\frac{3}{4} \leq a_n < 2$; od $498.$ člena naprej je razlika do limite manjša od $0{,}01$.

**Točkovanje:** a) $1$ točka za postopek, $1$ točka za limito $2$; b) $1$ točka za razliko $a_{n+1} - a_n$, $1$ točka za števec $5$, $1$ točka za sklep; c) $1$ točka za spodnjo mejo $\frac{3}{4}$, $1$ točka za zgornjo mejo $2$ z utemeljitvijo; d) $1$ točka za neenačbo $\frac{5}{n + 3} < \frac{1}{100}$, $1$ točka za $n > 497$, $1$ točka za odgovor $498$.

Pola 2: $90$ minut, z osnovnim računalom (brez grafičnega in programirljivega) in s prilogo s formulami. Na osnovni ravni rešiš Naloge 17–30 ($60$ točk: $8$ kratkih za $20$ in $6$ krajših strukturiranih za $40$), na višji ravni Naloge 25–32 ($60$ točk). Vmesne rezultate hrani v računalu nezaokrožene, zaokroži šele končni rezultat, in to tako, kot zahteva naloga.

### Naloga 17: kratka naloga, 3 točke, pola 2 (z računalom)

Lestev, dolga $4{,}5\,\text{m}$, je prislonjena ob navpično steno. Njen spodnji konec je na vodoravnih tleh $1{,}4\,\text{m}$ od stene. Izračunaj kot med lestvijo in tlemi (zaokroži na desetinko stopinje) in višino, do katere seže lestev ob steni (zaokroži na centimeter).

**Rešitev:**

1. Lestev, tla in stena tvorijo pravokotni trikotnik s hipotenuzo $4{,}5\,\text{m}$ in kateto ob tleh $1{,}4\,\text{m}$ (trikotnik in Pitagorov izrek + kotne funkcije v pravokotnem trikotniku).
2. Kot $\alpha$ ob tleh: $\cos \alpha = \dfrac{1{,}4}{4{,}5} = 0{,}3111\ldots$, zato $\alpha = 71{,}873\ldots^\circ \approx 71{,}9^\circ$.
3. Višina: $h = \sqrt{4{,}5^2 - 1{,}4^2} = \sqrt{18{,}29} = 4{,}2766\ldots\,\text{m} \approx 4{,}28\,\text{m}$.
4. Odgovor: lestev oklepa s tlemi kot približno $71{,}9^\circ$ in seže do višine približno $4{,}28\,\text{m}$.

**Točkovanje:** 1 točka za zapis $\cos \alpha = \frac{1{,}4}{4{,}5}$ (ali enakovredno), 1 točka za kot $71{,}9^\circ$ in 1 točka za višino $4{,}28\,\text{m}$.

### Naloga 18: kratka naloga, 2 točki, pola 2 (z računalom)

Mesto je imelo leta $2020$ $12\,400$ prebivalcev, leta $2025$ pa $13\,900$. Predpostavi, da število prebivalcev raste eksponentno po zakonu $N(t) = 12\,400 \cdot a^t$, kjer je $t$ število let od leta $2020$. Izračunaj $a$ (zaokroži na pet decimalnih mest) in napovej število prebivalcev leta $2035$ (zaokroži na celo število).

**Rešitev:**

1. Iz $N(5) = 13\,900$ dobimo $12\,400 \cdot a^5 = 13\,900$, torej $a^5 = \dfrac{13\,900}{12\,400} = 1{,}12096\ldots$ (eksponentna funkcija + koreni).
2. $a = \sqrt[5]{1{,}12096\ldots} = 1{,}023101\ldots \approx 1{,}02310$.
3. Leto $2035$ je $t = 15$: $N(15) = 12\,400 \cdot a^{15} = 17\,466{,}3\ldots \approx 17\,466$.
4. Odgovor: $a \approx 1{,}02310$, leta $2035$ bo imelo mesto približno $17\,466$ prebivalcev.

**Točkovanje:** 1 točka za $a \approx 1{,}02310$; 1 točka za napoved $17\,466$ (sprejmemo tudi rezultat, dobljen z zaokroženim $a$).

### Naloga 19: kratka naloga, 3 točke, pola 2 (z računalom)

Kislost raztopine merimo s $\text{pH} = -\log c$, kjer je $c$ koncentracija vodikovih ionov v $\text{mol/l}$.

a) Izračunaj pH raztopine s koncentracijo $c = 3{,}2 \cdot 10^{-5}\,\text{mol/l}$. Rezultat zaokroži na dve decimalni mesti. (1 točka)

b) Raztopino razredčimo, da se pH poveča za $1{,}5$. Kolikokrat se zmanjša koncentracija in kolikšna je nova koncentracija? Faktor zaokroži na eno decimalno mesto, koncentracijo zapiši v obliki $a \cdot 10^{k}$ z $a$ na dve decimalni mesti. (2 točki)

**Rešitev:**

1. a) $\text{pH} = -\log\left(3{,}2 \cdot 10^{-5}\right) = 4{,}4948\ldots \approx 4{,}49$ (logaritem).
2. b) Če je $\text{pH}_2 = \text{pH}_1 + 1{,}5$, je $-\log c_2 = -\log c_1 + 1{,}5$, torej $\log \dfrac{c_1}{c_2} = 1{,}5$ in $\dfrac{c_1}{c_2} = 10^{1{,}5} = 31{,}62\ldots \approx 31{,}6$ (logaritem + potence z racionalnimi eksponenti).
3. b) $c_2 = \dfrac{3{,}2 \cdot 10^{-5}}{10^{1{,}5}} = 1{,}0119\ldots \cdot 10^{-6} \approx 1{,}01 \cdot 10^{-6}\,\text{mol/l}$ (znanstveni zapis).
4. Odgovor: pH je približno $4{,}49$; koncentracija se zmanjša približno $31{,}6$-krat, na približno $1{,}01 \cdot 10^{-6}\,\text{mol/l}$.

**Točkovanje:** a) 1 točka za $\text{pH} \approx 4{,}49$. b) 1 točka za faktor $10^{1{,}5} \approx 31{,}6$ in 1 točka za koncentracijo $1{,}01 \cdot 10^{-6}\,\text{mol/l}$.

### Naloga 20: kratka naloga, 2 točki, pola 2 (z računalom)

Maja je osem dni zapored štela sklece, ki jih je naredila: $12$, $15$, $11$, $18$, $14$, $16$, $13$, $19$. Izračunaj aritmetično sredino $\bar x$ in standardni odklon $\sigma$ teh osmih podatkov (vsoto kvadratov odklonov deli s številom podatkov $N = 8$; zaokroži na dve decimalni mesti) ter ugotovi, koliko podatkov leži na intervalu $(\bar x - \sigma, \bar x + \sigma)$.

**Rešitev:**

1. Vsota podatkov je $12 + 15 + 11 + 18 + 14 + 16 + 13 + 19 = 118$, zato $\bar x = \dfrac{118}{8} = 14{,}75$ (statistika).
2. Vsota kvadratov odklonov: $7{,}5625 + 0{,}0625 + 14{,}0625 + 10{,}5625 + 0{,}5625 + 1{,}5625 + 3{,}0625 + 18{,}0625 = 55{,}5$.
3. $\sigma = \sqrt{\dfrac{55{,}5}{8}} = \sqrt{6{,}9375} = 2{,}6339\ldots \approx 2{,}63$. Na računalu je to tipka $\sigma_x$; tipka $s_x$ deli z $N - 1 = 7$ in da $2{,}82$, kar tu ni iskani odklon.
4. Interval je $(12{,}12; 17{,}38)$ (realna števila in intervali). V njem ležijo podatki $13$, $14$, $15$ in $16$, torej $4$ podatki.
5. Odgovor: $\bar x = 14{,}75$, $\sigma \approx 2{,}63$, na intervalu so $4$ podatki.

**Točkovanje:** 1 točka za $\bar x = 14{,}75$ in $\sigma \approx 2{,}63$; 1 točka za interval in $4$ podatke. Z odklonom $2{,}82$ (deljenje z $N - 1$) bi bilo na intervalu $5$ podatkov, zato pazi, katero tipko uporabiš.

### Naloga 21: kratka naloga, 3 točke, pola 2 (z računalom)

Pravilni devetkotnik je včrtan v krog s polmerom $5\,\text{cm}$. Izračunaj dolžino stranice in ploščino devetkotnika ter kolikšen odstotek ploščine kroga pokriva devetkotnik. Vse rezultate zaokroži na dve decimalni mesti.

**Rešitev:**

1. Devetkotnik razdelimo na $9$ enakokrakih trikotnikov s krakoma $r = 5\,\text{cm}$ in kotom ob središču $\dfrac{360^\circ}{9} = 40^\circ$ (mnogokotniki in krog + kotne funkcije).
2. Stranica: višina na osnovnico razpolovi trikotnik, zato $\dfrac{a}{2} = r \sin 20^\circ$ in $a = 10 \sin 20^\circ = 3{,}4202\ldots \approx 3{,}42\,\text{cm}$.
3. Ploščina: $S = 9 \cdot \dfrac{r^2 \sin 40^\circ}{2} = \dfrac{225 \sin 40^\circ}{2} = 72{,}3136\ldots \approx 72{,}31\,\text{cm}^2$.
4. Delež: $\dfrac{S}{\pi r^2} = \dfrac{72{,}3136\ldots}{78{,}5398\ldots} = 0{,}920725\ldots \approx 92{,}07\,\%$.
5. Odgovor: stranica meri približno $3{,}42\,\text{cm}$, ploščina je približno $72{,}31\,\text{cm}^2$, devetkotnik pokriva približno $92{,}07\,\%$ kroga.

**Točkovanje:** 1 točka za stranico $3{,}42\,\text{cm}$ in po 1 točka za ploščino $72{,}31\,\text{cm}^2$ ter za delež $92{,}07\,\%$.

### Naloga 22: kratka naloga, 2 točki, pola 2 (z računalom)

V pravokotniku $ABCD$ s stranicama $|AB| = 8\,\text{cm}$ in $|BC| = 5\,\text{cm}$ naključno izberemo točko. Izračunaj verjetnost, da je točka od oglišča $A$ ali od oglišča $C$ oddaljena manj kot $3\,\text{cm}$. Rezultat zaokroži na štiri decimalna mesta.

**Rešitev:**

1. Točke, ki so od $A$ oddaljene manj kot $3\,\text{cm}$, tvorijo četrtino kroga s polmerom $3\,\text{cm}$ (kot pri oglišču je pravi); enako pri $C$ (krog + geometrijska verjetnost).
2. Četrtini se ne prekrivata, ker je diagonala $|AC| = \sqrt{89} \approx 9{,}43\,\text{cm}$ daljša od $3 + 3 = 6\,\text{cm}$. Ugodna ploščina je $2 \cdot \dfrac{\pi \cdot 3^2}{4} = \dfrac{9\pi}{2} = 14{,}137\ldots\,\text{cm}^2$.
3. $P = \dfrac{9\pi/2}{8 \cdot 5} = \dfrac{9\pi}{80} = 0{,}353429\ldots \approx 0{,}3534$.
4. Odgovor: verjetnost je približno $0{,}3534$.

**Točkovanje:** 1 točka za ugodno ploščino $\frac{9\pi}{2}\,\text{cm}^2$ (dve četrtini kroga), 1 točka za verjetnost $0{,}3534$.

### Naloga 23: kratka naloga, 3 točke, pola 2 (z računalom)

Dana je elipsa z enačbo $\dfrac{x^2}{16} + \dfrac{y^2}{9} = 1$. Točka $T$ leži na elipsi v prvem kvadrantu in ima absciso $2$. Izračunaj koordinate gorišč $F_1$ in $F_2$, razdalji $|F_1T|$ in $|F_2T|$ ter velikost kota $\angle F_1TF_2$. Razdalji zaokroži na dve decimalni mesti, kot na desetinko stopinje.

**Rešitev:**

1. $a = 4$, $b = 3$, $e = \sqrt{a^2 - b^2} = \sqrt{7}$, zato $F_1(-\sqrt{7}, 0)$ in $F_2(\sqrt{7}, 0)$ (elipsa).
2. $T$: $\dfrac{4}{16} + \dfrac{y^2}{9} = 1$ da $y^2 = \dfrac{27}{4}$ in $y = \dfrac{3\sqrt{3}}{2} \approx 2{,}598$, torej $T\left(2, \tfrac{3\sqrt{3}}{2}\right)$.
3. Razdalja med točkama: $|F_1T| = \sqrt{(2 + \sqrt{7})^2 + \tfrac{27}{4}} = 5{,}3228\ldots \approx 5{,}32$ in $|F_2T| = \sqrt{(2 - \sqrt{7})^2 + \tfrac{27}{4}} = 2{,}6771\ldots \approx 2{,}68$ (koordinatni sistem). Preverba: vsota je $8 = 2a$.
4. Natančno je $|F_1T|^2 + |F_2T|^2 = 2(4 + 7) + \tfrac{27}{2} = 35{,}5$ in $|F_1T| \cdot |F_2T| = 14{,}25$.
5. Kosinusni izrek v trikotniku $F_1TF_2$ z $|F_1F_2| = 2\sqrt{7}$: $\cos \varphi = \dfrac{|F_1T|^2 + |F_2T|^2 - 28}{2\,|F_1T|\,|F_2T|} = \dfrac{35{,}5 - 28}{28{,}5} = \dfrac{5}{19}$.
6. $\varphi = 74{,}742\ldots^\circ \approx 74{,}7^\circ$.
7. Odgovor: $F_1(-\sqrt{7}, 0)$, $F_2(\sqrt{7}, 0)$, $|F_1T| \approx 5{,}32$, $|F_2T| \approx 2{,}68$, kot meri približno $74{,}7^\circ$.

**Točkovanje:** 1 točka za gorišči, 1 točka za razdalji $5{,}32$ in $2{,}68$ ter 1 točka za kot $74{,}7^\circ$.

### Naloga 24: kratka naloga, 2 točki, pola 2 (z računalom)

Pločevinka valjaste oblike ima prostornino $0{,}5\,\text{l}$ in višino $11\,\text{cm}$. Izračunaj polmer osnovne ploskve (zaokroži na milimeter) in površino pločevinke (zaokroži na kvadratni centimeter).

**Rešitev:**

1. $0{,}5\,\text{l} = 500\,\text{cm}^3$ (pretvarjanje enot). Iz $V = \pi r^2 v$ dobimo $r = \sqrt{\dfrac{500}{11\pi}} = 3{,}8037\ldots\,\text{cm} \approx 3{,}8\,\text{cm}$ (prostornina valja + koreni).
2. $P = 2\pi r^2 + 2\pi r v = 90{,}90\ldots + 262{,}89\ldots = 353{,}80\ldots\,\text{cm}^2 \approx 354\,\text{cm}^2$.
3. Odgovor: polmer meri približno $3{,}8\,\text{cm}$, površina je približno $354\,\text{cm}^2$.

**Točkovanje:** 1 točka za polmer $3{,}8\,\text{cm}$ in 1 točka za površino $354\,\text{cm}^2$ (z zaokroženim $r = 3{,}8\,\text{cm}$ sprejmemo tudi $353\,\text{cm}^2$).

### Naloga 25: krajša strukturirana naloga, 7 točk, pola 2 (z računalom)

Zemljišče ima obliko trikotnika $ABC$ z $|AB| = 85\,\text{m}$, $|AC| = 62\,\text{m}$ in $\angle BAC = 58^\circ$.

a) Izračunaj dolžino stranice $BC$. Rezultat zaokroži na decimeter. (2 točki)

b) Izračunaj velikost kota $\angle ABC$. Rezultat zaokroži na desetinko stopinje. (2 točki)

c) Izračunaj ploščino zemljišča v arih ($1\,\text{a} = 100\,\text{m}^2$). Rezultat zaokroži na dve decimalni mesti. (2 točki)

d) Izračunaj razdaljo od oglišča $A$ do stranice $BC$. Rezultat zaokroži na decimeter. (1 točka)

**Rešitev:**

1. a) Kosinusni izrek: $a^2 = 62^2 + 85^2 - 2 \cdot 62 \cdot 85 \cos 58^\circ = 5483{,}65\ldots$, zato $a = |BC| = 74{,}0516\ldots\,\text{m} \approx 74{,}1\,\text{m}$ (sinusni in kosinusni izrek).
2. b) Kot $\beta$ leži nasproti stranice $b = 62\,\text{m}$, ki je krajša od $a$, zato je oster. Sinusni izrek: $\sin \beta = \dfrac{62 \sin 58^\circ}{a} = 0{,}71003\ldots$, torej $\beta = 45{,}237\ldots^\circ \approx 45{,}2^\circ$.
3. c) $S = \dfrac{b c \sin \alpha}{2} = \dfrac{62 \cdot 85 \cdot \sin 58^\circ}{2} = 2234{,}606\ldots\,\text{m}^2 \approx 22{,}35\,\text{a}$ (ploščina trikotnika + pretvarjanje enot).
4. d) Razdalja je višina na stranico $a$: $v_a = \dfrac{2S}{a} = \dfrac{4469{,}21\ldots}{74{,}0516\ldots} = 60{,}352\ldots\,\text{m} \approx 60{,}4\,\text{m}$.
5. Odgovor: $|BC| \approx 74{,}1\,\text{m}$, $\angle ABC \approx 45{,}2^\circ$, ploščina je približno $22{,}35\,\text{a}$, razdalja od $A$ do $BC$ je približno $60{,}4\,\text{m}$.

**Točkovanje:** a) 1 točka za nastavek s kosinusnim izrekom, 1 točka za $74{,}1\,\text{m}$; b) 1 točka za nastavek s sinusnim izrekom (ali kosinusnim), 1 točka za $45{,}2^\circ$; c) 1 točka za $S \approx 2234{,}6\,\text{m}^2$, 1 točka za $22{,}35\,\text{a}$; d) 1 točka za $60{,}4\,\text{m}$.

### Naloga 26: krajša strukturirana naloga, 6 točk, pola 2 (z računalom)

Temperatura čaja v skodelici se ravna po zakonu $T(t) = 22 + 68 \cdot e^{-kt}$, kjer je $T$ temperatura v $^\circ\text{C}$ in $t$ čas v minutah. Po $10$ minutah ima čaj $60\,^\circ\text{C}$.

a) Kolikšna je bila začetna temperatura čaja? (1 točka)

b) Izračunaj konstanto $k$. Rezultat zaokroži na štiri decimalna mesta. (2 točki)

c) Po koliko minutah se čaj ohladi na $40\,^\circ\text{C}$? Rezultat zaokroži na desetinko minute. (2 točki)

d) Izračunaj hitrost spreminjanja temperature ob času $t = 0$. Rezultat zaokroži na dve decimalni mesti. (1 točka)

**Rešitev:**

1. a) $T(0) = 22 + 68 \cdot e^0 = 90\,^\circ\text{C}$ (eksponentna funkcija).
2. b) $22 + 68 e^{-10k} = 60$ da $e^{-10k} = \dfrac{38}{68}$, logaritmiramo: $-10k = \ln \dfrac{38}{68}$ (logaritemska enačba).
3. b) $k = \dfrac{1}{10} \ln \dfrac{68}{38} = 0{,}058192\ldots \approx 0{,}0582$.
4. c) $22 + 68 e^{-kt} = 40$ da $e^{-kt} = \dfrac{18}{68}$, torej $t = \dfrac{\ln \frac{68}{18}}{k} = \dfrac{1{,}32913\ldots}{0{,}058192\ldots} = 22{,}84\ldots \approx 22{,}8$ minute.
5. d) $T'(t) = -68k\, e^{-kt}$, zato $T'(0) = -68k = -3{,}957\ldots \approx -3{,}96\,^\circ\text{C/min}$ (odvod).
6. Odgovor: začetna temperatura je $90\,^\circ\text{C}$; $k \approx 0{,}0582$; na $40\,^\circ\text{C}$ se čaj ohladi po približno $22{,}8$ minute; na začetku se ohlaja s hitrostjo približno $3{,}96\,^\circ\text{C}$ na minuto ($T'(0) \approx -3{,}96$).

**Točkovanje:** a) 1 točka za $90\,^\circ\text{C}$; b) 1 točka za enačbo $e^{-10k} = \frac{38}{68}$ z logaritmiranjem, 1 točka za $k \approx 0{,}0582$; c) 1 točka za $t = \frac{1}{k}\ln\frac{68}{18}$, 1 točka za $22{,}8$ minute; d) 1 točka za $T'(0) \approx -3{,}96\,^\circ\text{C/min}$.

### Naloga 27: krajša strukturirana naloga, 7 točk, pola 2 (z računalom)

Prečni prerez namakalnega kanala opisuje parabola $y = 0{,}08x^2 - 2$ med njenima ničlama (enote na obeh oseh so metri, os $x$ je gladina vode, ko je kanal poln). Kanal je dolg $250\,\text{m}$.

a) Izračunaj širino kanala ob gladini in njegovo največjo globino. (1 točka)

b) Z določenim integralom izračunaj ploščino prečnega prereza kanala. Rezultat zaokroži na dve decimalni mesti. (3 točke)

c) Koliko kubičnih metrov vode je v polnem kanalu? Rezultat zaokroži na kubični meter. (1 točka)

d) Izračunaj kot, ki ga brežina kanala oklepa z vodoravnico na robu kanala. Rezultat zaokroži na desetinko stopinje. (2 točki)

**Rešitev:**

1. a) $0{,}08x^2 - 2 = 0$ da $x^2 = 25$ in $x = \pm 5$. Širina je $10\,\text{m}$, največja globina pa $|y(0)| = 2\,\text{m}$ (kvadratna funkcija).
2. b) Parabola leži med ničlama pod osjo $x$, zato $S = \int_{-5}^{5} \left(2 - 0{,}08x^2\right) dx$ (določeni integral).
3. b) $S = \left[2x - \dfrac{0{,}08x^3}{3}\right]_{-5}^{5} = 2\left(10 - \dfrac{10}{3}\right) = \dfrac{40}{3} = 13{,}333\ldots\,\text{m}^2 \approx 13{,}33\,\text{m}^2$.
4. c) Kanal je pokončna prizma s prerezom kot osnovno ploskvijo: $V = S \cdot 250 = 3333{,}3\ldots\,\text{m}^3 \approx 3333\,\text{m}^3$ (prostornina prizme).
5. d) Na robu $x = 5$: $y' = 0{,}16x$ in $y'(5) = 0{,}8$. Naklonski kot tangente: $\tan \varphi = 0{,}8$, $\varphi = 38{,}659\ldots^\circ \approx 38{,}7^\circ$ (odvod + naklonski kot premice). Zaradi simetrije je kot na levem robu enak.
6. Odgovor: širina $10\,\text{m}$, globina $2\,\text{m}$; prerez meri približno $13{,}33\,\text{m}^2$; v kanalu je približno $3333\,\text{m}^3$ vode; brežina oklepa z vodoravnico kot približno $38{,}7^\circ$.

**Točkovanje:** a) 1 točka za širino $10\,\text{m}$ in globino $2\,\text{m}$; b) 1 točka za integral z mejama $-5$ in $5$ in pravim predznakom, 1 točka za primitivno funkcijo, 1 točka za $13{,}33\,\text{m}^2$; c) 1 točka za $3333\,\text{m}^3$; d) 1 točka za $y'(5) = 0{,}8$ in 1 točka za kot $38{,}7^\circ$.

### Naloga 28: krajša strukturirana naloga, 6 točk, pola 2 (z računalom)

V vrečki je $20$ enako velikih semen paradižnika: $14$ semen rdeče sorte in $6$ semen rumene sorte. Na slepo vzameš hkrati $4$ semena. Vse verjetnosti zaokroži na štiri decimalna mesta.

a) Izračunaj verjetnost, da so vsa štiri semena rdeče sorte. (2 točki)

b) Izračunaj verjetnost, da je med njimi natanko eno seme rumene sorte. (2 točki)

c) Izračunaj verjetnost, da sta med njimi vsaj dve semeni rumene sorte. (2 točki)

**Rešitev:**

1. a) Vseh izbir $4$ semen od $20$ je $\binom{20}{4} = 4845$, ugodnih $\binom{14}{4} = 1001$ (kombinacije + matematična verjetnost).
2. a) $P(A) = \dfrac{1001}{4845} = 0{,}20660\ldots \approx 0{,}2066$.
3. b) Rumeno seme izberemo na $6$ načinov, tri rdeča na $\binom{14}{3} = 364$ načinov: $P(B) = \dfrac{6 \cdot 364}{4845} = \dfrac{2184}{4845} = 0{,}45077\ldots \approx 0{,}4508$.
4. c) Nasprotni dogodek je »največ eno rumeno seme«, to je vsota nezdružljivih dogodkov $A$ in $B$ (nasprotni dogodek + vsota dogodkov).
5. c) $P(C) = 1 - \dfrac{1001 + 2184}{4845} = \dfrac{1660}{4845} = 0{,}34262\ldots \approx 0{,}3426$.
6. Odgovor: a) $0{,}2066$; b) $0{,}4508$; c) $0{,}3426$.

**Točkovanje:** a) 1 točka za $\binom{20}{4}$ in $\binom{14}{4}$, 1 točka za $0{,}2066$; b) 1 točka za $6 \cdot \binom{14}{3}$ ugodnih izbir, 1 točka za $0{,}4508$; c) 1 točka za $1 - P(A) - P(B)$, 1 točka za $0{,}3426$.

### Naloga 29: krajša strukturirana naloga, 7 točk, pola 2 (z računalom)

Pokončni stožec ima stranico $s = 20\,\text{cm}$. Višino stožca označi s $h$.

a) Izrazi prostornino stožca kot funkcijo spremenljivke $h$ in zapiši, za katere $h$ ima naloga smisel. (2 točki)

b) Izračunaj $h$, pri katerem je prostornina stožca največja, in utemelji, da gre za maksimum. Rezultat zaokroži na dve decimalni mesti. (3 točke)

c) Izračunaj največjo prostornino (zaokroži na kubični centimeter) in kot ob vrhu osnega preseka tega stožca (zaokroži na desetinko stopinje). (2 točki)

**Rešitev:**

1. a) V osnem preseku višina $h$, polmer $r$ in stranica $s$ tvorijo pravokotni trikotnik s hipotenuzo $s$. Pitagorov izrek: $r^2 = 400 - h^2$ (Pitagorov izrek + stožec).
2. a) $V(h) = \dfrac{\pi r^2 h}{3} = \dfrac{\pi}{3}\left(400h - h^3\right)$ za $0 < h < 20$.
3. b) $V'(h) = \dfrac{\pi}{3}\left(400 - 3h^2\right) = 0$ da $h^2 = \dfrac{400}{3}$ in $h = \dfrac{20}{\sqrt{3}} = 11{,}547\ldots \approx 11{,}55\,\text{cm}$ (odvod, ekstremalni problem).
4. b) Za $h < \frac{20}{\sqrt{3}}$ je $V'(h) > 0$, za $h > \frac{20}{\sqrt{3}}$ je $V'(h) < 0$, funkcija torej najprej narašča, nato pada, zato je to maksimum.
5. c) $r^2 = 400 - \dfrac{400}{3} = \dfrac{800}{3}$, $r = 16{,}329\ldots\,\text{cm}$, $V = \dfrac{\pi}{3} \cdot \dfrac{800}{3} \cdot \dfrac{20}{\sqrt{3}} = 3224{,}53\ldots\,\text{cm}^3 \approx 3225\,\text{cm}^3$.
6. c) Polovica kota ob vrhu: $\tan \dfrac{\varphi}{2} = \dfrac{r}{h} = \sqrt{2}$, $\dfrac{\varphi}{2} = 54{,}735\ldots^\circ$, torej $\varphi = 109{,}47\ldots^\circ \approx 109{,}5^\circ$ (kotne funkcije v pravokotnem trikotniku).
7. Odgovor: $V(h) = \frac{\pi}{3}(400h - h^3)$ za $0 < h < 20$; največja prostornina je pri $h \approx 11{,}55\,\text{cm}$ in znaša približno $3225\,\text{cm}^3$; kot ob vrhu osnega preseka meri približno $109{,}5^\circ$.

**Točkovanje:** a) 1 točka za $r^2 = 400 - h^2$, 1 točka za $V(h)$ z definicijskim območjem $0 < h < 20$; b) 1 točka za odvod, 1 točka za $h \approx 11{,}55\,\text{cm}$ in 1 točka za utemeljitev maksimuma; c) 1 točka za $3225\,\text{cm}^3$, 1 točka za kot $109{,}5^\circ$.

### Naloga 30: krajša strukturirana naloga, 7 točk, pola 2 (z računalom)

Banka obrestuje vloge z letno obrestno mero $3{,}2\,\%$ (obrestno obrestovanje).

a) Na banko vložiš $8000\,\text{€}$ in pustiš obresti pripisovati letno. Koliko imaš na računu po $6$ letih? Rezultat zaokroži na cent. (1 točka)

b) Izračunaj konformno mesečno obrestno mero. Rezultat v odstotkih zaokroži na štiri decimalna mesta. (2 točki)

c) Po koliko celih letih se vloga iz a) prvič vsaj podvoji, če se obresti pripisujejo letno? (2 točki)

d) Namesto enkratne vloge vsak mesec na koncu meseca vložiš $100\,\text{€}$, obresti se pripisujejo mesečno po konformni obrestni meri iz b). Koliko imaš na računu takoj po $72$. vlogi? Rezultat zaokroži na cent. (2 točki)

**Rešitev:**

1. a) $K_6 = 8000 \cdot 1{,}032^6 = 9664{,}2503\ldots \approx 9664{,}25\,\text{€}$ (obrestni račun).
2. b) Mesečni obrestovalni faktor $r_{12}$ mora izpolniti $r_{12}^{12} = 1{,}032$, zato $r_{12} = \sqrt[12]{1{,}032} = 1{,}0026283\ldots$ (koreni).
3. b) $p_k = (r_{12} - 1) \cdot 100\,\% \approx 0{,}2628\,\%$.
4. c) Zahtevamo $1{,}032^n \ge 2$, logaritmiramo: $n \ge \dfrac{\ln 2}{\ln 1{,}032} = 22{,}0056\ldots$ (logaritem). Ker je $n$ celo število, je $n = 23$. Preverba: $1{,}032^{22} \approx 1{,}9996 < 2$; $1{,}032^{23} \approx 2{,}0636 \ge 2$.
5. d) Prva vloga se obrestuje $71$ mesecev, zadnja $0$, zato je stanje vsota geometrijskega zaporedja s prvim členom $100$ in količnikom $r_{12}$: $S_{72} = 100 \cdot \dfrac{r_{12}^{72} - 1}{r_{12} - 1}$ (geometrijsko zaporedje).
6. d) $r_{12}^{72} = 1{,}032^6 = 1{,}20803\ldots$, zato $S_{72} = 100 \cdot \dfrac{0{,}20803\ldots}{0{,}0026283\ldots} = 7914{,}939\ldots \approx 7914{,}94\,\text{€}$.
7. Odgovor: a) $9664{,}25\,\text{€}$; b) $p_k \approx 0{,}2628\,\%$; c) po $23$ letih; d) $7914{,}94\,\text{€}$.

**Točkovanje:** a) 1 točka za $9664{,}25\,\text{€}$; b) 1 točka za $r_{12} = \sqrt[12]{1{,}032}$, 1 točka za $0{,}2628\,\%$; c) 1 točka za $n \ge \frac{\ln 2}{\ln 1{,}032} \approx 22{,}01$ in 1 točka za odgovor $23$ let; d) 1 točka za vsoto geometrijskega zaporedja, 1 točka za $7914{,}94\,\text{€}$.

### Naloga 31 (višja raven): strukturirana naloga, 10 točk, pola 2 (z računalom)

Dani sta krožnica $K$ z enačbo $x^2 + y^2 - 6x - 4y - 12 = 0$ in premica $p$ z enačbo $x - 3y + 8 = 0$.

a) Izračunaj koordinate središča $S$ in polmer krožnice $K$. (2 točki)

b) Izračunaj presečišči $A$ in $B$ premice $p$ s krožnico $K$ (točka $A$ naj ima večjo absciso). (2 točki)

c) S skalarnim produktom izračunaj središčni kot $\angle ASB$ (zaokroži na stotinko stopinje) in ploščino manjšega krožnega odseka, ki ga premica $p$ odreže od kroga (zaokroži na dve decimalni mesti). (3 točke)

d) Zapiši enačbo tangente $t$ na krožnico $K$ v točki $A$ in izračunaj kot med tangento $t$ in premico $p$ (zaokroži na stotinko stopinje). Primerjaj ga s kotom iz c). (3 točke)

**Rešitev:**

1. a) Dopolnimo do popolnih kvadratov: $(x - 3)^2 - 9 + (y - 2)^2 - 4 - 12 = 0$, torej $(x - 3)^2 + (y - 2)^2 = 25$ (krožnica).
2. a) $S(3, 2)$, $r = 5$.
3. b) Iz $p$: $x = 3y - 8$. Vstavimo: $(3y - 11)^2 + (y - 2)^2 = 25$ da $10y^2 - 70y + 100 = 0$ oziroma $y^2 - 7y + 10 = 0$ (sistem + kvadratna enačba).
4. b) $y_1 = 5$, $y_2 = 2$, zato $A(7, 5)$ in $B(-2, 2)$.
5. c) $\vec{SA} = (4, 3)$, $\vec{SB} = (-5, 0)$, $\cos \varphi = \dfrac{\vec{SA} \cdot \vec{SB}}{|\vec{SA}|\,|\vec{SB}|} = \dfrac{-20}{25} = -0{,}8$, torej $\varphi = 143{,}130\ldots^\circ \approx 143{,}13^\circ$ (skalarni produkt).
6. c) Odsek je izsek brez trikotnika $ASB$: $S_o = \dfrac{r^2}{2}(\varphi - \sin \varphi)$ s $\varphi$ v radianih, $\varphi = 2{,}49809\ldots$ in $\sin \varphi = 0{,}6$ (krog + krožne funkcije).
7. c) $S_o = 12{,}5 \cdot (2{,}49809\ldots - 0{,}6) = 31{,}226\ldots - 7{,}5 = 23{,}726\ldots \approx 23{,}73$ kvadratnih enot.
8. d) Tangenta v $A$ je pravokotna na $\vec{SA} = (4, 3)$: $4(x - 7) + 3(y - 5) = 0$, torej $t\colon 4x + 3y - 43 = 0$.
9. d) Smerna koeficienta: $k_t = -\dfrac{4}{3}$, $k_p = \dfrac{1}{3}$. $\tan \delta = \left|\dfrac{k_p - k_t}{1 + k_p k_t}\right| = \left|\dfrac{\frac{5}{3}}{\frac{5}{9}}\right| = 3$, zato $\delta = 71{,}565\ldots^\circ \approx 71{,}57^\circ$ (kot med premicama).
10. d) $\dfrac{143{,}130\ldots^\circ}{2} = 71{,}565\ldots^\circ$: kot med tangento in tetivo je polovica središčnega kota nad isto tetivo.
11. Odgovor: a) $S(3, 2)$, $r = 5$; b) $A(7, 5)$, $B(-2, 2)$; c) $\angle ASB \approx 143{,}13^\circ$, odsek meri približno $23{,}73$ kvadratnih enot; d) $t\colon 4x + 3y - 43 = 0$, kot med $t$ in $p$ je približno $71{,}57^\circ$, kar je polovica središčnega kota.

**Točkovanje:** a) 1 točka za zapis $(x - 3)^2 + (y - 2)^2 = 25$, 1 točka za $S(3, 2)$ in $r = 5$; b) 1 točka za kvadratno enačbo $y^2 - 7y + 10 = 0$ (ali enakovredno), 1 točka za $A(7, 5)$ in $B(-2, 2)$; c) 1 točka za formulo za odsek s kotom v radianih, 1 točka za $\varphi \approx 143{,}13^\circ$ in 1 točka za $23{,}73$; d) 1 točka za enačbo tangente, 1 točka za kot $71{,}57^\circ$ in 1 točka za ugotovitev, da je kot polovica središčnega kota.

### Naloga 32 (višja raven): strukturirana naloga, 10 točk, pola 2 (z računalom)

Koncentracijo zdravila v krvi $t$ ur po zaužitju opisuje funkcija $c(t) = 10t \cdot e^{-0{,}5t}$ (v $\text{mg/l}$), $t \ge 0$.

a) Kdaj je koncentracija največja in koliko znaša? Utemelji, da gre za maksimum. Koncentracijo zaokroži na dve decimalni mesti. (3 točke)

b) Zdravilo deluje, dokler je koncentracija vsaj $2\,\text{mg/l}$. Pokaži, da koncentracija pade pod to mejo nekje med $t = 7$ in $t = 8$, in interval z dvema korakoma bisekcije zoži. Vrednosti funkcije zaokroži na tri decimalna mesta. (3 točke)

c) Povprečna koncentracija v prvih $6$ urah je $\bar c = \dfrac{1}{6} \int_0^6 c(t)\,dt$. Izračunaj jo. Rezultat zaokroži na dve decimalni mesti. (4 točke)

**Rešitev:**

1. a) Odvod produkta: $c'(t) = 10e^{-0{,}5t} + 10t \cdot (-0{,}5)e^{-0{,}5t} = 10e^{-0{,}5t}(1 - 0{,}5t)$ (eksponentna funkcija + odvod).
2. a) Ker je $e^{-0{,}5t} > 0$, je $c'(t) = 0$ natanko pri $t = 2$. Za $t < 2$ je $c'(t) > 0$, za $t > 2$ je $c'(t) < 0$, zato je pri $t = 2$ maksimum.
3. a) $c(2) = 20e^{-1} = 7{,}3575\ldots \approx 7{,}36\,\text{mg/l}$.
4. b) Za $t > 2$ funkcija pada. $c(7) = 70e^{-3{,}5} \approx 2{,}114 > 2$ in $c(8) = 80e^{-4} \approx 1{,}465 < 2$. Funkcija $c(t) - 2$ je zvezna in na krajiščih $[7, 8]$ zamenja predznak, zato ima vmes ničlo (zvezne funkcije in bisekcija).
5. b) $c(7{,}5) \approx 1{,}764 < 2$, zato ničla leži na $[7; 7{,}5]$. $c(7{,}25) \approx 1{,}932 < 2$, zato ničla leži na $[7; 7{,}25]$.
6. c) Per partes z $u = t$, $dv = e^{-0{,}5t}\,dt$, $v = -2e^{-0{,}5t}$: $\int t e^{-0{,}5t}\,dt = -2te^{-0{,}5t} + 2\int e^{-0{,}5t}\,dt = -2te^{-0{,}5t} - 4e^{-0{,}5t} + C$ (integracija per partes).
7. c) $\int_0^6 t e^{-0{,}5t}\,dt = \left[-2te^{-0{,}5t} - 4e^{-0{,}5t}\right]_0^6 = -16e^{-3} + 4 = 3{,}2034\ldots$ (določeni integral).
8. c) $\bar c = \dfrac{1}{6} \cdot 10 \cdot 3{,}2034\ldots = 5{,}3390\ldots \approx 5{,}34\,\text{mg/l}$.
9. Odgovor: a) največja koncentracija je $2$ uri po zaužitju in znaša približno $7{,}36\,\text{mg/l}$; b) koncentracija pade pod $2\,\text{mg/l}$ med $7$ in $7{,}25$ ure po zaužitju; c) povprečna koncentracija v prvih šestih urah je približno $5{,}34\,\text{mg/l}$.

**Točkovanje:** a) 1 točka za odvod, 1 točka za $t = 2$ z utemeljitvijo maksimuma, 1 točka za $7{,}36\,\text{mg/l}$; b) 1 točka za $c(7)$ in $c(8)$ z utemeljitvijo (zveznost, sprememba predznaka), 1 točka za prvi korak bisekcije, 1 točka za interval $[7; 7{,}25]$; c) 1 točka za izbiro $u$ in $dv$, 1 točka za primitivno funkcijo, 1 točka za vrednost integrala $4 - 16e^{-3}$, 1 točka za $\bar c \approx 5{,}34\,\text{mg/l}$.

### Ustno vprašanje 1

:::premisli
Definiraj logaritem in pojasni, zakaj logaritem negativnega števila ni definiran.
---
Za $a > 0$, $a \neq 1$ in $x > 0$ je $\log_a x$ tisti eksponent $y$, za katerega velja $a^y = x$. Potenca $a^y$ s pozitivno osnovo je pozitivna za vsak realni $y$, zato nobena potenca ni enaka negativnemu številu ali $0$. Zato je logaritem definiran samo za pozitivne argumente, in zato pri logaritemskih enačbah vedno preverimo pogoj, da je argument pozitiven.
:::

### Ustno vprašanje 2

:::premisli
Kdaj ima racionalna funkcija vodoravno asimptoto in kako jo določiš?
---
Racionalna funkcija je količnik dveh polinomov. Če je stopnja števca manjša od stopnje imenovalca, je vodoravna asimptota $y = 0$. Če sta stopnji enaki, je asimptota $y = \frac{a}{b}$, kjer sta $a$ in $b$ vodilna koeficienta števca in imenovalca. Če je stopnja števca večja, vodoravne asimptote ni; pri stopnji, večji za $1$, je asimptota poševna premica. Graf vodoravno asimptoto lahko tudi seka, kar preverimo z enačbo $f(x) = \frac{a}{b}$.
:::

### Ustno vprašanje 3

:::premisli
Izpelji formulo za vsoto prvih $n$ členov aritmetičnega zaporedja.
---
Vsoto zapišemo dvakrat, enkrat od prvega člena naprej in enkrat od zadnjega nazaj: $S_n = a_1 + a_2 + \dots + a_n$ in $S_n = a_n + a_{n-1} + \dots + a_1$. Seštejemo istoležne člene: vsak par ima vsoto $a_1 + a_n$, ker se en člen poveča za $d$, ko se drugi zmanjša za $d$. Parov je $n$, zato $2S_n = n(a_1 + a_n)$ in $S_n = \frac{n}{2}(a_1 + a_n)$. Z $a_n = a_1 + (n - 1)d$ dobimo še $S_n = \frac{n}{2}\big(2a_1 + (n - 1)d\big)$.
:::

## Drugače: Korak za korakom s številkami

Načrt za polo na višji ravni, izračunan po korakih:

1. Točke: šest krajših strukturiranih nalog prinese $40$ točk, dve dolgi $20$, skupaj $60$.
2. Čas za reševanje: od $90$ minut odšteješ $5$ za pregled in $10$ za preverjanje, ostane $75$ minut.
3. Minut na točko: $75 : 60 = 1{,}25$.
4. Krajše strukturirane naloge: $40 \cdot 1{,}25 = 50$ minut, dve dolgi nalogi $20 \cdot 1{,}25 = 25$ minut.
5. Ena dolga naloga z $10$ točkami ima $10 \cdot 1{,}25 = 12{,}5$ minute.
6. Pravilo preskoka: ko ta naloga preseže dvojni čas, torej $25$ minut, jo označiš in greš naprej.

Na osnovni ravni je račun enak, le da je prvi del $8$ kratkih nalog: $20 \cdot 1{,}25 = 25$ minut, kar je natanko stolpec »kratke« na sliki v razlagi.

## Drugače: Kot zgodba

Junijsko jutro, nad šolo se zbirajo nevihtni oblaki. Neža odpre polo 1 in najprej ne piše ničesar. Pet minut lista, ob naloge riše kljukice in vprašaje. Pri nalogi o vektorjih nariše križec.

Kratke naloge reši v pol ure. Pri limiti se zmoti, a pri preverjanju z vstavljanjem števila blizu $3$ napako opazi in jo popravi. Pri strukturirani nalogi o temperaturi izračuna $t = 6$, nato se ustavi in prebere vprašanje še enkrat: »kdaj«. Pripiše »ob 12. uri«.

Ko zunaj zagrmi, ji ostane petnajst minut. Vrne se k vektorjem. Celotne rešitve ne vidi, zapiše pa pogoj za pravokotnost in enačbo. Dve točki od treh. Sošolka, ki je reševala po vrsti, je pri vektorjih obtičala dvajset minut in zadnjih dveh nalog ni niti prebrala.

## Preveri se

? Katera trditev o poli 1 na osnovni ravni drži?
- Traja $120$ minut, ker je brez računala.
~ Obe poli trajata $90$ minut; brez računala so le števila v nalogah lepša.
- Kratke naloge prinesejo skupaj $40$ točk.
~ Zamenjal si dela: kratke naloge prinesejo $20$ točk, krajše strukturirane $40$.
+ Traja $90$ minut, ima $60$ točk in prilogo s formulami.
- Formul ni treba poznati, ker so vse v prilogi.
~ Priloga ima le del formul; drugo moraš znati sam, zato si jo oglej že pred izpitom.
> Pola 1 traja $90$ minut, prinese $60$ točk ($8$ kratkih nalog za $20$ točk in $6$ krajših strukturiranih za $40$), računalo ni dovoljeno, priloga s formulami je priložena.

? Na poli s $60$ točkami in $90$ minutami si $5$ minut vzameš za pregled in $10$ za preverjanje. Koliko minut ti ostane za eno točko?
= 1,25 | 0,01
~ 1,5 | To je pravilo minute in pol brez rezerve; najprej odštej $15$ minut za pregled in preverjanje.
~ 0,8 | Delil si točke s časom ($60 : 75$), to je število točk na minuto, ne minut na točko.
> Za reševanje ostane $90 - 15 = 75$ minut, $75 : 60 = 1{,}25$ minute na točko.

? Dijak je rešil enačbo $\frac{x^2 + 2x}{x - 1} = \frac{3}{x - 1}$ takole: (1) pomnožil je obe strani z $x - 1$: $x^2 + 2x = 3$; (2) uredil: $x^2 + 2x - 3 = 0$; (3) rešil: $x = 1$ ali $x = -3$; (4) odgovor: rešitvi sta $1$ in $-3$. Kje je napaka?
- V koraku (1), z izrazom $x - 1$ ne smemo množiti.
~ Množenje z imenovalcem je pravilen korak; napaka nastane šele, ker dijak ni preveril pogoja $x \neq 1$.
- V koraku (3), ker ima enačba $x^2 + 2x - 3 = 0$ drugačni rešitvi.
~ Razcep $(x - 1)(x + 3) = 0$ da ravno $1$ in $-3$; računsko je korak (3) pravilen.
+ V koraku (4): pri $x = 1$ je imenovalec enak $0$, zato $x = 1$ ni rešitev.
- Nikjer, rešitev je popolna.
~ Z množenjem z imenovalcem lahko dobiš lažno rešitev; brez preverbe pogoja ostane napačen odgovor.
> Množenje z imenovalcem lahko doda rešitev. Pogoj $x \neq 1$ izloči $x = 1$; preverba za $x = -3$: obe strani sta enaki $-\frac{3}{4}$. Edina rešitev je $x = -3$.

? Luka je meril, koliko minut je porabil za prve štiri kratke naloge. Naloga 1 in Naloga 4 sta vredni po $2$ točki, Naloga 2 in Naloga 3 po $3$ točke. Pri kateri nalogi je najbolj prekoračil čas po pravilu minute in pol?
:::risba stolpci
opis: Stolpčni prikaz »Lukov čas pri kratkih nalogah«. Navpična os so minute od 0 do 14 po 2. Naloga 1: 3 minute, Naloga 2: 14 minut, Naloga 3: 4 minute, Naloga 4: 5 minut.
podnapis: Lukov čas pri kratkih nalogah (v minutah)
os: minute
korak: 2
stolpec: Naloga 1 | 3
stolpec: Naloga 2 | 14
stolpec: Naloga 3 | 4
stolpec: Naloga 4 | 5
:::
- Naloga 1
~ Za $2$ točki ima $3$ minute in jih je porabil natanko toliko.
+ Naloga 2
- Naloga 3
~ Za $3$ točke ima $4{,}5$ minute, porabil je $4$, torej je bil celo hitrejši.
- Naloga 4
~ $5$ minut je več od $3$, a le za $2$ minuti; pri Nalogi 2 je razlika veliko večja.
> Naloga 2 ima po pravilu $1{,}5 \cdot 3 = 4{,}5$ minute, Luka je porabil $14$, več kot trikrat toliko. Po pravilu preskoka bi jo moral označiti že po $9$ minutah.

? (brez računala) Alge na jezeru vsakih $5$ dni podvojijo pokrito površino. Danes pokrivajo $3\,\mathrm{m^2}$. Čez koliko dni bodo pokrivale $48\,\mathrm{m^2}$?
= 20 dni
~ 4 | To je število podvojitev ($2^4 = 16$); vsaka traja $5$ dni.
~ 80 | Pomnožil si faktor $16$ s $5$; podvojitev je samo $4$, ker je $2^4 = 16$.
> Enačba $3 \cdot 2^{t/5} = 48$ da $2^{t/5} = 16 = 2^4$, torej $\frac{t}{5} = 4$ in $t = 20$ dni.

:::simboli
m | čas za nalogo | m = 1{,}5 \cdot k | min | pravilo minute in pol
k | število točk naloge | | – |
P_0 | začetna pokrita površina | | m^2 |
P_n | pokrita površina po $n$ tednih | P_n = P_0 \cdot q^n | m^2 |
q | količnik (kolikokrat se površina poveča v tednu) | | – |
n | število tednov | | – |
T | temperatura zraka | T(t) = -\frac{1}{4}t^2 + 3t + 2 | °C |
T' | odvod temperature po času | | °C/h |
t | čas v urah | | h |
v | hitrost spreminjanja vodostaja | v(t) = 6t - t^2 | cm/h |
\Delta h | dvig vodostaja | \Delta h = \int_a^b v(t)\,dt | cm |
a, b | meji integrala (začetni in končni čas) | | h |
d | oznaka diferenciala v integralu ($dt$) | | |
:::

<<RACUN
resi: 3*3^n=243 | n | 4
odvod: -t^2/4+3*t+2 | t | -t/2+3
vrednost: -(6^2)/4+3*6+2 | 11
neenacba: -t^2/4+3*t+2>10 | t | (4, 8)
resi: 6*t-t^2=0 | t | 0, 6
integral: 6*t-t^2 | t | 0 | 6 | 36
vrednost: 75/60 | 1.25
resi: (x^2+2*x)/(x-1)=3/(x-1) | x | -3
resi: 3*2^(t/5)=48 | t | 20
resi: 2^(3*x-1)=4^(x+1) | x | 3
resi: x^2-2*x-3=x+1 | x | -1, 4
vrednost: sin(120°)/(1-cos(150°)) | 2*sqrt(3)-3
resi: x^3+x^2-4*x-4=0 | x | -2, -1, 2
resi: a+2*d=7, a+7*d=22 | a, d | a=1, d=3
resi: m^2+2*m-8=0 | m | -4, 2
limita: (x^2-9)/(x^2-3*x) | x | 3 | 2
vrednost: 5*4*3*2 | 120
resi: (x+2)*(x-2)=32 | x | -6, 6
resi: (2*x^2-2)/(x^2-4)=5/2 | x | -4, 4
odvod: x^3-3*x^2-9*x+5 | x | 3*x^2-6*x-9
resi: 3*x^2-6*x-9=0 | x | -1, 3
resi: 3*n^2+n-310=0 | n | -31/3, 10
vrednost: factorial(6)/(factorial(4)*factorial(2))*(-2)^4 | 240
vrednost: factorial(6)/(factorial(3)*factorial(3))*(-2)^3 | -160
integral: sin(2*x)-sin(x) | x | 0 | pi/3 | 1/4
integral: sin(x)-sin(2*x) | x | pi/3 | pi | 9/4
limita: (2*n+1)/(n+3) | n | oo | 2
enako: (2*n+3)/(n+4)-(2*n+1)/(n+3) | 5/((n+3)*(n+4))
>>
