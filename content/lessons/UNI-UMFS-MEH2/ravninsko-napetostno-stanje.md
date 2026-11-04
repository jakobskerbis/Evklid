---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi kos krede in ga zvij med prsti. Ne poči naravnost prečno. Poči po poševni vijačnici, približno pod $45^\circ$ glede na os.

Druga slika je z urgence. Smučar pade, vez se ne sprosti in smučka mu zasuka nogo. Na rentgenski sliki se lom golenice vije okrog kosti kot navoj vijaka. Ortopedi mu rečejo **spiralni zlom**.

Kreda in kost sta povsem različni snovi. Obremenitev pa je v obeh primerih ista: torzija. Iz torzije znaš izračunati strižno napetost na prečnem prerezu. Normalne napetosti, ki bi material trgala, tam ni. Zakaj se potem oba lomita, kot bi ju nekdo vlekel narazen, in to poševno?

Odgovor skriva ista ideja: napetost v točki je odvisna od tega, **kako obrnemo ploskev**, na kateri jo opazujemo. Ko to obvladaš, poiščeš smer, v kateri je material obremenjen najbolj. Tam napoveš lom kosti, vsadka ali strojnega dela.

## Razlaga

**1. Mamljiva ideja.** Pri osni obremenitvi si računal $\sigma = F/A$, pri torziji $\tau = T r / I_p$. Zato se zdi: v vsaki točki je ena napetost, tista iz formule. To ne drži. Formula da napetost samo na *prečnem* prerezu. Če isto točko prerežemo poševno, dobimo drugačno napetost.

**2. Popravek na palici v nategu.** Kito ali palico vlečemo tako, da je na prečnem prerezu $\sigma = 100\,\mathrm{MPa}$. V mislih jo prerežemo pod kotom $\varphi$ glede na prečni prerez. Sila se razstavi na del pravokotno na poševno ploskev in del vzdolž nje. Poševna ploskev je obenem večja, za faktor $1/\cos\varphi$. Dobimo $\sigma_\varphi = \sigma\cos^2\varphi$ in $\lvert\tau_\varphi\rvert = \sigma\sin\varphi\cos\varphi$:

| kot $\varphi$ | $\sigma_\varphi$ [MPa] | $\lvert\tau_\varphi\rvert$ [MPa] |
|---|---|---|
| $0^\circ$ | 100 | 0 |
| $30^\circ$ | 75 | 43,3 |
| $45^\circ$ | 50 | 50 |
| $60^\circ$ | 25 | 43,3 |
| $90^\circ$ | 0 | 0 |

Palica, ki jo »samo vlečemo«, ima v isti točki tudi strižne napetosti. Največje so na ploskvah pod $45^\circ$.

:::premisli
Kost v torziji ima na prečnem prerezu samo strig $\tau$. Napovej, kaj deluje na ploskvi pod $45^\circ$: strig, nateg ali oboje?
---
Čisti nateg velikosti $\tau$, striga tam ni (na pravokotni ploskvi pa tlak $-\tau$). Tabela kaže, da čisti nateg skriva strig pod $45^\circ$. Obratno čisti strig skriva nateg pod $45^\circ$. Zato kreda in golenica počita po vijačnici.
:::

**3. Ravninsko napetostno stanje.** Iz telesa izrežemo majhen kvadratni element v ravnini $xy$. Na ploskvi z normalo $x$ delujeta normalna napetost $\sigma_x$ in strižna napetost $\tau_{xy}$. Na ploskvi z normalo $y$ delujeta $\sigma_y$ in enaka $\tau_{xy}$. V smeri $z$ napetosti ni. Takemu stanju rečemo **ravninsko napetostno stanje**.

Tako je obremenjena površina kosti, tanke cevi ali posode, saj je zunanja ploskev prosta. Dogovor o predznakih: nateg je pozitiven. $\tau_{xy} > 0$ pomeni, da na ploskvi s pozitivno normalo $x$ strig kaže v smer $+y$.

**4. Transformacija napetosti.** Element zavrtimo za kot $\varphi$ v nasprotni smeri urnega kazalca. Iz ravnovesja klinastega kosa elementa sledi

$$\sigma_\varphi = \sigma_s + \frac{\sigma_x - \sigma_y}{2}\cos 2\varphi + \tau_{xy}\sin 2\varphi$$

$$\tau_\varphi = -\frac{\sigma_x - \sigma_y}{2}\sin 2\varphi + \tau_{xy}\cos 2\varphi$$

kjer je $\sigma_s$ **srednja napetost**:

$$\sigma_s = \frac{\sigma_x + \sigma_y}{2}$$

V formulah nastopa $2\varphi$, ne $\varphi$. Ploskev, zavrtena za $90^\circ$, je spet stranica elementa. V formuli se tedaj $2\varphi$ poveča za $180^\circ$, zato člena s $\cos 2\varphi$ in $\sin 2\varphi$ zamenjata predznak. V vsoti se odštejeta: $\sigma_\varphi + \sigma_{\varphi + 90^\circ}$ vedno ostane $\sigma_x + \sigma_y$.

**5. Glavne napetosti.** Med vrtenjem se $\sigma_\varphi$ spreminja. Njeno največjo in najmanjšo vrednost imenujemo **glavni napetosti** $\sigma_1 \ge \sigma_2$, pripadajoči smeri pa **glavni smeri**. Odvod $\sigma_\varphi$ po $\varphi$ je natanko $2\tau_\varphi$. Ekstrem je torej tam, kjer striga ni: na glavnih ploskvah je $\tau_\varphi = 0$.

$$\sigma_{1,2} = \sigma_s \pm R$$

$$R = \sqrt{\left(\frac{\sigma_x - \sigma_y}{2}\right)^2 + \tau_{xy}^2}$$

$$\tan 2\varphi_0 = \frac{2\tau_{xy}}{\sigma_x - \sigma_y}$$

Kot $\varphi_0$ pove, za koliko je glavna smer zavrtena od osi $x$. Kadar je $\sigma_x > \sigma_y$, ta kot kaže na $\sigma_1$. Največja strižna napetost je $\tau_{\max} = R$. Deluje na ploskvah, ki so za $45^\circ$ zavrtene od glavnih smeri.

**6. Mohrov krog.** Obe formuli iz točke 4 skupaj opisujeta krog v ravnini $(\sigma, \tau)$. Nariši ga takole:

- vodoravna os je $\sigma$, navpična $\tau$, pozitivna **navzdol**;
- točka $X(\sigma_x,\ \tau_{xy})$ predstavlja ploskev z normalo $x$, točka $Y(\sigma_y,\ -\tau_{xy})$ ploskev z normalo $y$;
- daljica $XY$ je premer; njeno razpolovišče je središče $C$ pri $\sigma_s$, polmer je $R$;
- presečišči kroga z osjo $\sigma$ sta $\sigma_1$ (desno) in $\sigma_2$ (levo); najnižja in najvišja točka sta $\pm\tau_{\max}$;
- zasuk elementa za $\varphi$ je zasuk po krogu za $2\varphi$ v isti smeri.

Krog je zemljevid vseh ploskev skozi točko. Glavni napetosti in največji strig z njega preprosto prebereš.

:::premisli
Kreda pri zvijanju poči po vijačnici. Žilava jeklena palica v enaki torziji pa se odreže skoraj naravnost prečno. Kaj na Mohrovem krogu pojasni razliko?
---
Pri čistem strigu ima Mohrov krog središče v izhodišču in polmer $\tau$. Nateg $\sigma_1 = \tau$ deluje pod $45^\circ$, največji strig pa na prečnem prerezu. Kreda in kost sta krhki in slabi v nategu, zato počita pravokotno na $\sigma_1$, po vijačnici. Žilavo jeklo popusti zaradi striga, zato se odreže tam, kjer je strig največji.
:::

## Rešeni primeri

### Primer 1: glavne napetosti v steni golenice

Med hojo je v točki na sprednji steni golenice (os $x$ vzdolž kosti) $\sigma_x = 40\,\mathrm{MPa}$, $\sigma_y = 0$ in $\tau_{xy} = 15\,\mathrm{MPa}$. Določi glavni napetosti, glavno smer in največjo strižno napetost.

**Podatki:** $\sigma_x = 40\,\mathrm{MPa}$, $\sigma_y = 0\,\mathrm{MPa}$, $\tau_{xy} = 15\,\mathrm{MPa}$
**Iščemo:** $\sigma_1$, $\sigma_2$, kot $\varphi_0$ in $\tau_{\max}$

:::formula
$\sigma_{1,2} = \sigma_s \pm R$, $\sigma_s = \dfrac{\sigma_x + \sigma_y}{2}$

$R = \sqrt{\left(\dfrac{\sigma_x - \sigma_y}{2}\right)^2 + \tau_{xy}^2}$, $\tau_{\max} = R$

$\tan 2\varphi_0 = \dfrac{2\tau_{xy}}{\sigma_x - \sigma_y}$
:::

**Rešitev:**

1. Središče kroga: $\sigma_s = \dfrac{40 + 0}{2} = 20\,\mathrm{MPa}$.
2. Polmer: $R = \sqrt{20^2 + 15^2} = 25\,\mathrm{MPa}$, saj je $(40 - 0)/2 = 20$.
3. $\sigma_1 = 20 + 25 = 45\,\mathrm{MPa}$ in $\sigma_2 = 20 - 25 = -5\,\mathrm{MPa}$. Druga glavna napetost je tlačna, čeprav nobena od danih normalnih napetosti ni.
4. $\tan 2\varphi_0 = \dfrac{2 \cdot 15}{40} = 0{,}75$, torej $2\varphi_0 \approx 36{,}9^\circ$ in $\varphi_0 \approx 18{,}4^\circ$. Ker je $\sigma_x > \sigma_y$, ta smer pripada $\sigma_1$.
5. $\tau_{\max} = R = 25\,\mathrm{MPa}$, na ploskvah pod $45^\circ$ glede na glavni smeri.

Odgovor: $\sigma_1 = 45\,\mathrm{MPa}$ deluje v smeri, zavrteni za $18{,}4^\circ$ od osi kosti, $\sigma_2 = -5\,\mathrm{MPa}$ pravokotno nanjo, največji strig je $25\,\mathrm{MPa}$.

### Primer 2: napetost na poševni ploskvi ob vsadku

Ob vijaku kostne ploščice je $\sigma_x = 50\,\mathrm{MPa}$, $\sigma_y = 10\,\mathrm{MPa}$ in $\tau_{xy} = -20\,\mathrm{MPa}$. Kolikšni sta normalna in strižna napetost na ploskvi, katere normala je za $30^\circ$ zavrtena od osi $x$ v nasprotni smeri urnega kazalca?

**Podatki:** $\sigma_x = 50\,\mathrm{MPa}$, $\sigma_y = 10\,\mathrm{MPa}$, $\tau_{xy} = -20\,\mathrm{MPa}$, $\varphi = 30^\circ$
**Iščemo:** $\sigma_\varphi$ in $\tau_\varphi$

:::formula
$\sigma_\varphi = \sigma_s + \dfrac{\sigma_x - \sigma_y}{2}\cos 2\varphi + \tau_{xy}\sin 2\varphi$

$\tau_\varphi = -\dfrac{\sigma_x - \sigma_y}{2}\sin 2\varphi + \tau_{xy}\cos 2\varphi$
:::

**Rešitev:**

1. Pripravimo dele: $\sigma_s = 30\,\mathrm{MPa}$, $\dfrac{\sigma_x - \sigma_y}{2} = 20\,\mathrm{MPa}$, $2\varphi = 60^\circ$. Kot podvojimo, ker ga formula zahteva.
2. $\cos 60^\circ = 0{,}5$ in $\sin 60^\circ \approx 0{,}866$.
3. $\sigma_\varphi = 30 + 20 \cdot 0{,}5 - 20 \cdot 0{,}866 \approx 22{,}7\,\mathrm{MPa}$. Negativni strig zmanjša normalno napetost na tej ploskvi.
4. $\tau_\varphi = -20 \cdot 0{,}866 - 20 \cdot 0{,}5 \approx -27{,}3\,\mathrm{MPa}$.
5. Preverba z vsoto: na pravokotni ploskvi je $\sigma_{\varphi + 90^\circ} = 30 - 10 + 17{,}32 \approx 37{,}3\,\mathrm{MPa}$, vsota je $22{,}7 + 37{,}3 = 60\,\mathrm{MPa} = \sigma_x + \sigma_y$.

Odgovor: na poševni ploskvi je normalna napetost približno $22{,}7\,\mathrm{MPa}$, strižna pa približno $-27{,}3\,\mathrm{MPa}$.

### Primer 3: koliko zasuka prenese stisnjena kost

Steno golenice stiska teža telesa: $\sigma_x = -20\,\mathrm{MPa}$, $\sigma_y = 0$. Pri padcu zvijanje doda strig $\tau_{xy}$. Oslabljena kost poči, ko glavna natezna napetost doseže $\sigma_1 = 50\,\mathrm{MPa}$. Pri kolikšnem $\lvert\tau_{xy}\rvert$ se to zgodi? Ali tlak lom pospeši ali zavre?

**Podatki:** $\sigma_x = -20\,\mathrm{MPa}$, $\sigma_y = 0\,\mathrm{MPa}$, $\sigma_1 = 50\,\mathrm{MPa}$
**Iščemo:** $\lvert\tau_{xy}\rvert$ in primerjavo s kostjo brez tlaka

:::formula
$\sigma_1 = \sigma_s + R$, $R^2 = \left(\dfrac{\sigma_x - \sigma_y}{2}\right)^2 + \tau_{xy}^2$
:::

**Rešitev:**

1. $\sigma_s = \dfrac{-20 + 0}{2} = -10\,\mathrm{MPa}$. Tlak premakne središče kroga v levo.
2. Iz $\sigma_1 = \sigma_s + R$ dobimo $R = 50 + 10 = 60\,\mathrm{MPa}$.
3. $\tau_{xy}^2 = 60^2 - 10^2 = 3500$ (v $\mathrm{MPa}^2$), torej $\lvert\tau_{xy}\rvert = \sqrt{3500} \approx 59{,}2\,\mathrm{MPa}$.
4. Brez tlaka bi bil čisti strig s $\sigma_1 = \lvert\tau_{xy}\rvert$, kost bi počila že pri $50\,\mathrm{MPa}$. Razmerje $59{,}2 / 50 \approx 1{,}18$.
5. Ostaneta še druga glavna napetost in največji strig. Izračunaj ju sam.

:::premisli
Koliko sta $\sigma_2$ in $\tau_{\max}$ v trenutku loma?
---
$\sigma_2 = \sigma_s - R = -10 - 60 = -70\,\mathrm{MPa}$ in $\tau_{\max} = R = 60\,\mathrm{MPa}$. Tlak torej zavre natezni lom (kost prenese okrog $18\,\%$ več striga), poveča pa tlačno napetost in največji strig.
:::

## Pogoste napake

- **»Napetost v točki je ena številka.«** Kdor misli tako, vzame $\sigma = F/A$ za edino napetost. Ta velja le na prečnem prerezu. Na poševnih ploskvah so druge napetosti, tudi strig. Popravek: vedno vprašaj, na kateri ploskvi.
- **»Največja normalna napetost je kar večja izmed $\sigma_x$ in $\sigma_y$.«** Pri $\tau_{xy} \ne 0$ je $\sigma_1$ večja od obeh (v Primeru 1 je $45 > 40$). Popravek: izračunaj $\sigma_s + R$, ne izberi večje od danih.
- **Kot na krogu je kot na elementu.** Kdor na Mohrovem krogu odmeri $\varphi$ namesto $2\varphi$, dobi napačno ploskev. Popravek: na krogu je vsak kot podvojen, glavni smeri sta na elementu pravokotni, na krogu pa nasprotni.
- **»Na glavnih ploskvah je strig največji.«** Ravno obratno: tam je strig nič. Največji strig $\tau_{\max} = R$ deluje pod $45^\circ$ od glavnih smeri.
- **»Pri torziji ni normalne napetosti.«** Ni je samo na prečnem prerezu. Pod $45^\circ$ je nateg enak $\tau$, zato krhka kost poči spiralno.

## Povzetek

- Napetost v točki je odvisna od ploskve; ravninsko stanje opišejo $\sigma_x$, $\sigma_y$ in $\tau_{xy}$.
- Transformacija: $\sigma_\varphi$ in $\tau_\varphi$ sta odvisni od $2\varphi$; vsota normalnih napetosti na pravokotnih ploskvah je stalna.
- Glavni napetosti: $\sigma_{1,2} = \sigma_s \pm R$, na glavnih ploskvah ni striga, smer da $\tan 2\varphi_0 = 2\tau_{xy}/(\sigma_x - \sigma_y)$.
- Največji strig: $\tau_{\max} = R$, pod $45^\circ$ od glavnih smeri.
- Mohrov krog: središče $\sigma_s$, polmer $R$, točki $X(\sigma_x, \tau_{xy})$ in $Y(\sigma_y, -\tau_{xy})$; zasuk $\varphi$ na elementu je $2\varphi$ na krogu.
- Čisti strig ima $\sigma_1 = \tau$ pod $45^\circ$: zato spiralni zlom kosti.

## Drugače: Kot zgodba

V steni golenice živi drobcen kvadratek kosti. Ves dan ga stiska teža telesa, malo ga upogiba hoja. Svoje počutje opiše s tremi številkami: koliko ga vlečejo ali tiščijo levo in desno, koliko gor in dol in koliko ga strižejo.

Nekega dne si ga ogleda biomehaničarka in ga v mislih zavrti. Pri vsakem kotu ji kvadratek pove drugačne številke. A ko si jih vriše v diagram, opazi, da vse ležijo na istem krogu. Kvadratek se v resnici ni spremenil; spremenil se je le pogled.

Na dveh mestih kroga kvadratek reče: »Zdaj me nič ne striže, samo vlečejo ali tiščijo.« To sta glavni smeri. Pri smučarskem padcu se krog razširi okrog ničle. V eni od glavnih smeri, poševno na kost, ga začnejo vleči tako močno, da poči. Razpoka se nadaljuje od kvadratka do kvadratka, vsakič poševno, in obkroži kost kot vijačnica.

## Drugače: Korak za korakom s številkami

Stanje $\sigma_x = 50\,\mathrm{MPa}$, $\sigma_y = -30\,\mathrm{MPa}$, $\tau_{xy} = 30\,\mathrm{MPa}$ rešimo samo z Mohrovim krogom.

1. Nariši os $\sigma$ vodoravno in os $\tau$ navzdol.
2. Vriši $X(50,\ 30)$ in $Y(-30,\ -30)$.
3. Središče je razpolovišče: $\sigma_s = \dfrac{50 - 30}{2} = 10\,\mathrm{MPa}$.
4. Polmer je razdalja od $C$ do $X$: $R = \sqrt{40^2 + 30^2} = 50\,\mathrm{MPa}$.
5. Preberi presečišči: $\sigma_1 = 10 + 50 = 60\,\mathrm{MPa}$, $\sigma_2 = 10 - 50 = -40\,\mathrm{MPa}$.
6. Kot od $X$ do $\sigma_1$ na krogu: $\tan 2\varphi_0 = \dfrac{30}{40} = 0{,}75$, torej $2\varphi_0 \approx 36{,}9^\circ$. Na elementu je glavna smer zavrtena za $18{,}4^\circ$ v isti smeri.
7. Najnižja točka kroga: $\tau_{\max} = 50\,\mathrm{MPa}$.
8. Preverba: $\sigma_1 + \sigma_2 = 20\,\mathrm{MPa} = \sigma_x + \sigma_y$.

## Drugače: Bolj natančno

Iz elementa izrežemo klin. Poševna ploskev ima površino $A$ in normalo pod kotom $\varphi$ od osi $x$, ploskev z normalo $x$ ima površino $A\cos\varphi$, ploskev z normalo $y$ pa $A\sin\varphi$. Ravnovesje sil v smeri normale poševne ploskve da

$$\sigma_\varphi A = \sigma_x A\cos^2\varphi + \sigma_y A\sin^2\varphi + 2\tau_{xy} A\sin\varphi\cos\varphi$$

Z $\cos^2\varphi = \tfrac{1}{2}(1 + \cos 2\varphi)$, $\sin^2\varphi = \tfrac{1}{2}(1 - \cos 2\varphi)$ in $2\sin\varphi\cos\varphi = \sin 2\varphi$ dobimo formulo za $\sigma_\varphi$ iz točke 4. Ravnovesje v smeri poševne ploskve na enak način da $\tau_\varphi$.

Obe formuli kvadriramo in seštejemo, pa se kot izloči:

$$\left(\sigma_\varphi - \sigma_s\right)^2 + \tau_\varphi^2 = R^2$$

To je krog s središčem $(\sigma_s, 0)$ in polmerom $R$: Mohrov krog. Odvod

$$\frac{\mathrm{d}\sigma_\varphi}{\mathrm{d}\varphi} = -(\sigma_x - \sigma_y)\sin 2\varphi + 2\tau_{xy}\cos 2\varphi = 2\tau_\varphi$$

pokaže, da ima $\sigma_\varphi$ ekstrem natanko tam, kjer je $\tau_\varphi = 0$.

## Preveri se

? Biomehanik na steni stegnenice poišče smeri, v katerih na ploskvi elementa ni strižne napetosti. Kako imenujemo normalni napetosti v teh smereh?
- Največji strižni napetosti
~ Na teh ploskvah strig ni največji, ampak enak nič. Največji strig deluje pod $45^\circ$ od njih.
+ Glavni napetosti
- Srednji napetosti
~ Srednja napetost $\sigma_s$ je središče Mohrovega kroga, ne presečišče z osjo.
- Napetosti na prečnem prerezu
~ Prečni prerez je le ena od ploskev; na njem je strig pri splošnem stanju različen od nič.
> Na glavnih ploskvah je $\tau_\varphi = 0$, normalna napetost pa doseže največjo ($\sigma_1$) ali najmanjšo ($\sigma_2$) vrednost.

? Za $\sigma_x = 30\,\mathrm{MPa}$, $\sigma_y = -10\,\mathrm{MPa}$, $\tau_{xy} = 15\,\mathrm{MPa}$ razvrsti po velikosti $\sigma_1$, $\sigma_x$ in $\tau_{\max}$.
- $\sigma_x > \sigma_1 > \tau_{\max}$
~ Če je $\tau_{xy} \ne 0$, je $\sigma_1$ vedno večja od $\sigma_x$; $\sigma_x$ ni največja normalna napetost.
- $\tau_{\max} > \sigma_1 > \sigma_x$
~ $\tau_{\max} = R$, $\sigma_1 = \sigma_s + R$; pri pozitivni $\sigma_s$ je $\sigma_1$ večja od $R$.
+ $\sigma_1 > \sigma_x > \tau_{\max}$
> $\sigma_s = 10\,\mathrm{MPa}$, $R = \sqrt{20^2 + 15^2} = 25\,\mathrm{MPa}$, torej $\sigma_1 = 35\,\mathrm{MPa} > \sigma_x = 30\,\mathrm{MPa} > \tau_{\max} = 25\,\mathrm{MPa}$.

? Kaj se zgodi z Mohrovim krogom, če $\tau_{xy}$ povečamo, $\sigma_x$ in $\sigma_y$ pa ostaneta enaki?
- Središče se premakne v desno.
~ Središče je $\sigma_s = (\sigma_x + \sigma_y)/2$ in od striga ni odvisno.
- Polmer se poveča natanko za toliko, kot se je povečal $\tau_{xy}$.
~ $R$ je hipotenuza, $\sqrt{(\ldots)^2 + \tau_{xy}^2}$, zato ne raste za enak znesek kot $\tau_{xy}$.
+ Središče ostane, polmer se poveča.
- Krog ostane enak, zasuka se le točka $X$.
~ Točka $X$ se premakne stran od osi, zato se poveča razdalja do središča, torej polmer.
> $\sigma_s$ je odvisna samo od normalnih napetosti, $R$ pa raste s $\tau_{xy}$. Zato $\sigma_1$ zraste, $\sigma_2$ pa pade.

? V točki je $\sigma_x = 60\,\mathrm{MPa}$, $\sigma_y = 20\,\mathrm{MPa}$, $\tau_{xy} = 15\,\mathrm{MPa}$. Kolikšna je $\sigma_1$?
- $60\,\mathrm{MPa}$
~ To je največja dana napetost. Zaradi striga je $\sigma_1$ večja.
- $75\,\mathrm{MPa}$
~ Strig se ne prišteje kar k $\sigma_x$; prispeva k polmeru kroga.
+ $65\,\mathrm{MPa}$
- $55\,\mathrm{MPa}$
~ To je $\sigma_s + \tau_{xy}$. Prišteti moraš polmer $R$, ne samo strig.
> $\sigma_s = 40\,\mathrm{MPa}$, $R = \sqrt{20^2 + 15^2} = 25\,\mathrm{MPa}$, $\sigma_1 = 40 + 25 = 65\,\mathrm{MPa}$.

? Pri smučarskem padcu je v steni golenice čisti strig $\tau_{xy} = 35\,\mathrm{MPa}$. Kolikšna je največja natezna napetost in kje deluje?
- $0$, ker pri torziji ni normalne napetosti
~ Normalne napetosti ni le na prečnem prerezu. Na poševnih ploskvah je.
- $17{,}5\,\mathrm{MPa}$ pod $45^\circ$
~ Polovica velja za strig v palici pod nategom. Pri čistem strigu je polmer kroga kar $\tau_{xy}$.
+ $35\,\mathrm{MPa}$ pod $45^\circ$ na os kosti
- $35\,\mathrm{MPa}$ na prečnem prerezu
~ Na prečnem prerezu deluje strig, ne nateg. Glavna smer je zavrtena za $45^\circ$.
> Pri čistem strigu je $\sigma_s = 0$ in $R = \tau_{xy}$, torej $\sigma_1 = 35\,\mathrm{MPa}$, $\tan 2\varphi_0 \to \infty$, $\varphi_0 = 45^\circ$. Zato krhka kost poči spiralno.

:::simboli
\sigma_\varphi | normalna napetost na zavrteni ploskvi | | MPa | ploskev zavrtena za $\varphi$
\tau_\varphi | strižna napetost na zavrteni ploskvi | | MPa |
\sigma_x | normalna napetost v smeri $x$ | | MPa | nateg pozitiven
\sigma_y | normalna napetost v smeri $y$ | | MPa | nateg pozitiven
\tau_{xy} | strižna napetost v ravnini $xy$ | | MPa | pozitivna v smeri $+y$ na ploskvi $+x$
\varphi | kot zasuka ploskve | | ° | v nasprotni smeri urnega kazalca
\sigma_s | srednja napetost (središče Mohrovega kroga) | \sigma_s = \frac{\sigma_x + \sigma_y}{2} | MPa |
R | polmer Mohrovega kroga | R = \sqrt{\left(\frac{\sigma_x - \sigma_y}{2}\right)^2 + \tau_{xy}^2} | MPa |
\sigma_1, \sigma_2, \sigma_{1,2} | glavni napetosti | \sigma_{1,2} = \sigma_s \pm R | MPa | $\sigma_1 \ge \sigma_2$
\varphi_0 | kot glavne smeri od osi $x$ | \tan 2\varphi_0 = \frac{2\tau_{xy}}{\sigma_x - \sigma_y} | ° |
\tau_{\max} | največja strižna napetost | \tau_{\max} = R | MPa | pod $45^\circ$ od glavnih smeri
A | površina poševne ploskve klina | | m^2 |
:::
