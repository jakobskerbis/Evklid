---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Naredi poskus. Iz kartona izreži tri trakove, dolge $6\,\text{cm}$, $8\,\text{cm}$ in $10\,\text{cm}$. Konce spni s sponkami v trikotnik in ga postavi pokonci: dobiš preprosto stojalo za telefon. Poskusi ga stisniti v drugo obliko. Ne gre, trikotnik iz treh trakov je **tog**. Sošolec naj iz enako dolgih trakov naredi svojega. Položi ju drugega na drugega: natanko se prekrijeta.

Nato poskusi s trakovi $3\,\text{cm}$, $4\,\text{cm}$ in $8\,\text{cm}$. Konca krajših trakov se ne stakneta, trikotnika ni.

Iz poskusa sledita dve vprašanji. Koliko in katere mere moraš sošolcu poslati v sporočilu, da bo izdelal natanko tako stojalo? In kdaj trikotnik z danimi merami sploh obstaja? Odgovore dajo **izreki o skladnosti**, z njimi pa trikotnik tudi natančno **načrtaš** z ravnilom in šestilom.

## Razlaga

**1. Trije koti proti trem stranicam.** Iz lekcije o notranjih kotih veš, da je $\alpha + \beta + \gamma = 180^\circ$. Če sošolcu pošlješ samo kote, na primer $90^\circ$, $60^\circ$ in $30^\circ$, bo njegovo stojalo enake oblike, a lahko pol manjše ali dvakrat večje. Koti določijo obliko, velikosti pa ne. Tri stranice pa, kot je pokazal poskus, določijo oboje.

:::premisli
Sošolec ti pošlje dve stranici, $8\,\text{cm}$ in $10\,\text{cm}$, ne pa tretje. Napovej: ali lahko iz tega narediš natanko njegovo stojalo?
---
Ne. Trakova lahko spneš pod različnimi koti in vsakič dobiš drug trikotnik. Manjka še en podatek: tretja stranica ali kot med trakovoma.
:::

**2. Skladna trikotnika.** Trikotnika, ki se natanko prekrijeta (tudi po premiku, zasuku ali prezrcaljenju), sta **skladna**. Zapišemo $\triangle ABC \cong \triangle A'B'C'$. Skladna trikotnika imata enako dolge istoležne stranice in enako velike istoležne kote. **Istoležni** so tisti, ki se pri prekrivanju pokrijejo. Pri tem velja oznaka: stranica $a$ leži **nasproti** oglišča $A$, torej $a = BC$, $b = AC$, $c = AB$.

**3. Izreki o skladnosti.** Vseh šestih podatkov ni treba primerjati. Dovolj so trije, če so pravi:

| izrek | trikotnika se ujemata v … | primer |
|---|---|---|
| **sss** | vseh treh stranicah | $a$, $b$, $c$ |
| **sks** | dveh stranicah in kotu **med njima** | $b$, $c$, $\alpha$ |
| **ksk** | stranici in **obeh kotih ob njej** | $c$, $\alpha$, $\beta$ |
| **ssk** | dveh stranicah in kotu **nasproti daljše** | $a$, $b$, $\alpha$; $a > b$ |

Ti trije podatki **določajo** trikotnik: vsak trikotnik, ki ga načrtaš iz njih, je skladen z vsemi drugimi. Trije koti niso med izreki.

**4. Kot med stranicama ali nasproti.** Izreka sks in ssk sta si podobna, razlikujeta pa se v legi kota. Pri sks kot leži med danima stranicama in natanko določi razdaljo med njunima koncema. Pri ssk kot leži nasproti ene od stranic. Če je ta stranica krajša od druge, lahko nastaneta **dva različna** trikotnika (slika v razdelku »Drugače: Na sliki«). Zato mora biti kot nasproti daljše stranice.

**5. Kdaj trikotnik obstaja.** Za kote že poznaš pogoj: dva dana kota skupaj merita manj kot $180^\circ$. Za stranice velja **trikotniška neenakost**: krajši stranici sta skupaj daljši od najdaljše. Pri trakovih iz poskusa je $3 + 4 = 7 < 8$, zato se ne stakneta. Pri $c$ kot najdaljši stranici:

$$a + b > c$$

Zakaj je tako, pokaže konstrukcija sss. Oglišče $C$ je od $A$ oddaljeno $b$, od $B$ pa $a$. Zato leži hkrati na krožnici okoli $A$ s polmerom $b$ in na krožnici okoli $B$ s polmerom $a$:

:::risba skica
opis: Daljica AB dolžine 6. Okoli A je črtkana krožnica s polmerom 4, okoli B črtkana krožnica s polmerom 5. Krožnici se sekata v točki C nad daljico in v točki C' pod njo. Trikotnik ABC je narisan polno.
območje: -4,5; -5,5 .. 11,5; 5,5
enota: 19
krog: 0; 0 | 4 | črtkano siva
krog: 6; 0 | 5 | črtkano siva
lik: 0; 0 -> 6; 0 -> 2,25; 3,31 | modra zaprto
točka: 0; 0 | A | levo
točka: 6; 0 | B | desno
točka: 2,25; 3,31 | C | nad
točka: 2,25; -3,31 | C' | pod
napis: 3; 0 | c = 6 | pod
:::

Če je $a + b$ premalo v primerjavi s $c$, krožnici ne sežeta druga do druge, se ne sekata in trikotnika ni.

:::premisli
Dve stranici merita $3\,\text{cm}$ in $4\,\text{cm}$. Napovej, kako dolga je lahko tretja.
---
Več kot $4 - 3 = 1\,\text{cm}$ in manj kot $3 + 4 = 7\,\text{cm}$. Pri $7\,\text{cm}$ ali več je $3 + 4$ premalo, da bi se krajši stranici staknili nad najdaljšo. Pri $1\,\text{cm}$ ali manj je najdaljša stranica $4\,\text{cm}$, krajši pa skupaj merita največ $1 + 3 = 4\,\text{cm}$, kar je premalo. Pri točno $1\,\text{cm}$ ali $7\,\text{cm}$ se »trikotnik« splošči v daljico.
:::

**6. Kot, ki ni ob dani stranici.** Če sta dana $c$, $\alpha$ in $\gamma$, kota $\gamma$ ne moreš nanesti na daljico $AB$, ker leži nasproti nje. Najprej izračunaj tretji kot:

$$\beta = 180^\circ - \alpha - \gamma$$

Nato imaš stranico $c$ in oba kota ob njej, $\alpha$ in $\beta$, ter uporabiš izrek ksk.

**7. Postopek načrtovanja.** 1) **Skica:** prostoročno nariši trikotnik, oglišča $A$, $B$, $C$ v nasprotni smeri urnega kazalca, poudari dane podatke. 2) **Analiza:** kateri izrek velja in s katero stranico začneš. 3) **Obstoj:** trikotniška neenakost ali vsota kotov. 4) **Opis** korakov. 5) **Konstrukcija** z ostrim svinčnikom, ravnilom in šestilom; pomožnih črt ne briši. 6) **Diskusija:** koliko rešitev ima naloga. Trikotnik na drugi strani dane stranice je skladen s prvim, zato imajo podatki, ki ustrezajo izreku o skladnosti, eno samo rešitev.

**8. Koti s šestilom.** Kot $60^\circ$: okoli temena zariši lok, ki seka krak v točki $T$; okoli $T$ z istim polmerom zariši drugi lok. Poltrak skozi presečišče lokov oklepa s krakom $60^\circ$, saj teme, $T$ in presečišče tvorijo enakostranični trikotnik. Z razpolavljanjem dobiš $30^\circ$ iz $60^\circ$ in $45^\circ$ iz pravega kota.

V simulaciji spodaj (»Konstrukcije trikotnikov«) izberi konstrukcijo sss in skrajšaj eno stranico. Opazuj, pri kateri dolžini se loka nehata sekati.

## Rešeni primeri

### Primer 1: kje je telefon

Oddajnika mobilnega omrežja $A$ in $B$ sta $6\,\text{km}$ narazen. Omrežje iz signala oceni, da je telefon od $A$ oddaljen $4\,\text{km}$, od $B$ pa $5\,\text{km}$. Na zemljevidu, kjer $1\,\text{cm}$ pomeni $1\,\text{km}$, načrtaj, kje je lahko telefon.

**Podatki:** $AB = 6\,\text{km}$, $AC = 4\,\text{km}$, $BC = 5\,\text{km}$, merilo $1\,\text{cm}$ za $1\,\text{km}$; na zemljevidu $c = 6\,\text{cm}$, $b = 4\,\text{cm}$, $a = 5\,\text{cm}$ (telefon je oglišče $C$)
**Iščemo:** lego oglišča $C$ (izrek sss)

:::formula
Trikotniška neenakost: $a + b > c$, kjer je $c$ najdaljša stranica.
:::

**Rešitev:**

1. Obstoj: najdaljša je $c = 6\,\text{cm}$, $a + b = 5 + 4 = 9\,\text{cm} > 6\,\text{cm}$. Trikotnik obstaja.
2. Načrtamo $AB = 6\,\text{cm}$.
3. Okoli $A$ zarišemo lok s polmerom $b = 4\,\text{cm}$, ker je $b = AC$.
4. Okoli $B$ zarišemo lok s polmerom $a = 5\,\text{cm}$, ker je $a = BC$.
5. Loka se sekata v dveh točkah, $C$ nad daljico in $C'$ pod njo. Trikotnika $ABC$ in $ABC'$ sta skladna (zrcalna).
6. Odgovor: trikotnik je po izreku sss en sam, telefon pa je lahko na dveh mestih, zrcalno glede na $AB$. Da omrežje ugotovi, na katerem, potrebuje še tretji oddajnik.

### Primer 2: dve stranici in kot med njima

Načrtaj trikotnik $ABC$ z $b = 4\,\text{cm}$, $c = 5\,\text{cm}$ in $\alpha = 60^\circ$. Kot konstruiraj s šestilom.

**Podatki:** $b = 4\,\text{cm}$, $c = 5\,\text{cm}$, $\alpha = 60^\circ$; kot s šestilom
**Iščemo:** konstrukcijo trikotnika $ABC$

:::formula
Izrek sks: kot $\alpha$ je pri $A$, med stranicama $b = AC$ in $c = AB$.
:::

**Rešitev:**

1. Analiza: kot $\alpha$ leži pri $A$, kjer se stikata $b$ in $c$, torej med danima stranicama. To je izrek sks, rešitev je ena.
2. Načrtamo $c = AB = 5\,\text{cm}$.
3. V $A$ konstruiramo $60^\circ$: lok okoli $A$ seka $AB$ v $T$, lok z istim polmerom okoli $T$ seka prvi lok v $S$. Poltrak $AS$ je krak kota.
4. Na krak od $A$ nanesemo $b = 4\,\text{cm}$ in dobimo $C$. Povežemo $C$ z $B$.
5. Odgovor: dobimo en trikotnik; z merjenjem je $a \approx 4{,}6\,\text{cm}$.

### Primer 3: kot nasproti dane stranice

Načrtaj trikotnik $ABC$ s $c = 6\,\text{cm}$, $\alpha = 45^\circ$ in $\gamma = 75^\circ$. Kota konstruiraj s šestilom.

**Podatki:** $c = 6\,\text{cm}$, $\alpha = 45^\circ$, $\gamma = 75^\circ$; kota s šestilom
**Iščemo:** kot $\beta$ in konstrukcijo trikotnika $ABC$

:::formula
$\beta = 180^\circ - \alpha - \gamma$, nato izrek ksk ($c$, $\alpha$, $\beta$).
:::

**Rešitev:**

1. Analiza: ob stranici $c = AB$ ležita $\alpha$ (pri $A$) in $\beta$ (pri $B$). Kot $\gamma$ je nasproti $c$, zato ga na $AB$ ne moremo nanesti.
2. Načrtamo $AB = 6\,\text{cm}$.
3. V $A$ načrtamo pravokotnico na $AB$ in pravi kot razpolovimo: dobimo krak kota $45^\circ$.
4. Izračunaj $\beta$, preveri obstoj in dokončaj konstrukcijo, nato primerjaj:

:::premisli
Koliko meri $\beta$ in kako dokončaš trikotnik?
---
$\beta = 180^\circ - 45^\circ - 75^\circ = 60^\circ$. Ker je $\alpha + \beta = 105^\circ < 180^\circ$, trikotnik obstaja. V $B$ konstruiraš $60^\circ$ na isto stran $AB$; kraka se sekata v $C$. Preizkus s kotomerom: kot pri $C$ meri $75^\circ$. Izmeriš še $a \approx 4{,}4\,\text{cm}$ in $b \approx 5{,}4\,\text{cm}$.
:::

## Pogoste napake

- **Stranica na napačnem mestu.** Pri sss učenec okoli $A$ zariše lok s polmerom $a$, ker je $a$ »pri« črki $A$. Stranica $a$ leži nasproti $A$: $a = BC$. Lok okoli $A$ ima polmer $b$, okoli $B$ polmer $a$.
- **Kot ni med danima stranicama.** Pri $b$, $c$, $\alpha$ učenec nanese $\alpha$ v $B$. Kot $\alpha$ je vedno pri $A$, kjer se stikata $b$ in $c$. Pomaga skica s podatki.
- **Neobstoječ trikotnik.** Učenec riše s stranicami $3$, $4$ in $8\,\text{cm}$ in loka se ne sekata. Ni preveril, da je $3 + 4 = 7 < 8$. Preveri pred risanjem.
- **Kot nasproti stranice nanesen ob njej.** Pri $c$, $\alpha$, $\gamma$ učenec nanese $\gamma$ v $B$. Najprej izračunaj $\beta = 180^\circ - \alpha - \gamma$, nato uporabi ksk.
- **Trije koti kot dovolj podatkov.** Učenec misli, da koti $50^\circ$, $60^\circ$, $70^\circ$ določajo en trikotnik, ker so podatki trije. Brez stranice je takih trikotnikov neskončno, različno velikih.

## Povzetek

- Skladna trikotnika se natanko prekrijeta: $\triangle ABC \cong \triangle A'B'C'$.
- Izreki o skladnosti: sss; sks (kot med stranicama); ksk (oba kota ob stranici); ssk (kot nasproti daljše stranice). Trije koti trikotnika ne določajo.
- Stranica $a$ leži nasproti oglišča $A$: $a = BC$, $b = AC$, $c = AB$.
- Obstoj: krajši stranici skupaj daljši od najdaljše; dva kota skupaj manj kot $180^\circ$.
- Kot nasproti dane stranice: najprej $\beta = 180^\circ - \alpha - \gamma$, nato ksk.
- Postopek: skica, analiza, obstoj, opis, konstrukcija, diskusija.

## Drugače: Na sliki

Zakaj pri ssk kot leži nasproti **daljše** stranice? Vzemimo $c = 6\,\text{cm}$, $\alpha = 30^\circ$ in $a = 4\,\text{cm}$, ki je krajša od $c$. V $A$ nanesemo kot $30^\circ$, okoli $B$ zarišemo krožnico s polmerom $a$:

:::risba skica
opis: Daljica AB dolžine 6, iz A poltrak pod kotom 30 stopinj. Okoli B črtkana krožnica s polmerom 4 seka poltrak v dveh točkah, C₁ bližje A in C₂ dlje od A. Obe točki sta z B povezani z daljico.
območje: -1; -4,5 .. 10,5; 6
enota: 26
krog: 6; 0 | 4 | črtkano siva
črta: 0; 0 -> 6; 0 | debelo
črta: 0; 0 -> 9,5; 5,48 | modra
črta: 6; 0 -> 2,21; 1,28 | oranžna
črta: 6; 0 -> 6,79; 3,92 | oranžna
točka: 0; 0 | A | levo
točka: 6; 0 | B | pod
točka: 2,21; 1,28 | C_1 | nad
točka: 6,79; 3,92 | C_2 | levo
napis: 1,3; 0,35 | 30° | desno
:::

Krožnica seka krak v **dveh** točkah. Trikotnika $ABC_1$ in $ABC_2$ imata enake tri podatke, a nista skladna: kot pri $C_1$ je top, pri $C_2$ pa oster. Če je $a$ daljša od $c$, na primer $7\,\text{cm}$, krožnica seka krak le v eni točki in trikotnik je en sam. Če je $a$ krajša od $3\,\text{cm}$, kolikor je $B$ oddaljena od kraka, krožnica kraka ne doseže in trikotnika ni.

## Drugače: Iz vsakdanjega življenja

Stojalo za telefon iz poskusa ostane trdno, ker je trikotnik iz treh danih stranic tog (izrek sss). Okvir iz štirih trakov se brez težav nagne. Zato so ostrešja, žerjavi, mostovi in okvirji koles sestavljeni iz trikotnikov.

Zložljivo stojalo za tablico ima dve nogi stalne dolžine in tečaj med njima. Ko tečaj nastaviš na izbrani kot, je razdalja med koncema nog natanko določena: to je izrek sks. Isti kot vedno da isto razdaljo, zato stojalo vsakič stoji enako.

Izrek ksk uporabljajo geodeti in mornarji: poznajo razdaljo med dvema točkama in z obeh izmerijo kot proti oddaljenemu stolpu. Tako vedo, kje stolp stoji, ne da bi šli do njega.

## Preveri se

? Na skici so označeni dani podatki. Po katerem izreku so določili trikotnik?
:::risba skica
opis: Trikotnik ABC. Stranica AB je označena s c = 5 cm, stranica AC z b = 4 cm, kot pri oglišču A s 60 stopinjami. Drugi podatki niso označeni.
območje: -1,5; -1 .. 6; 4,2
enota: 40
lik: 0; 0 -> 5; 0 -> 2; 3,46 | modra zaprto
točka: 0; 0 | A | levo
točka: 5; 0 | B | desno
točka: 2; 3,46 | C | nad
napis: 2,5; 0 | c = 5 cm | pod
napis: 1; 1,9 | b = 4 cm | levo
napis: 0,6; 0,3 | 60° | desno
:::
- sss
~ Tretja stranica ni dana; namesto nje je dan kot.
+ sks
- ksk
~ Pri ksk je dana ena stranica in dva kota ob njej. Tu sta dani dve stranici in en kot.
- ssk
~ Pri ssk kot leži nasproti ene od stranic. Kot $60^\circ$ je pri $A$, kjer se stikata obe dani stranici, torej med njima.
> Kot $\alpha = 60^\circ$ leži pri oglišču $A$, med stranicama $b$ in $c$: to je izrek sks.

? Načrtaj trikotnik z $b = 6\,\text{cm}$, $c = 8\,\text{cm}$ in $\alpha = 90^\circ$ (stojalo iz poskusa). Izmeri stranico $a$.
= 10 cm | 0,2
~ 14 | Stranici si seštel. Po trikotniški neenakosti je $a$ krajša od $b + c$.
~ 2 | To je razlika $c - b$. Stranica $a$ je daljša od nje.
> Pri pravem kotu med $6\,\text{cm}$ in $8\,\text{cm}$ izmeriš $a = 10\,\text{cm}$, kar je ravno tretji trak iz poskusa: isti podatki sks dajo isti trikotnik.

? Zakaj koti $50^\circ$, $60^\circ$ in $70^\circ$ ne določajo enega samega trikotnika?
- Ker njihova vsota ni $180^\circ$.
~ Seštej: $50^\circ + 60^\circ + 70^\circ = 180^\circ$, tak trikotnik obstaja.
- Ker trikotnik s takimi koti ni mogoč.
~ Vsota je $180^\circ$ in noben kot ni prevelik, zato obstaja.
+ Ker imajo lahko trikotniki s temi koti različno dolge stranice.
- Ker trije podatki nikoli ne zadoščajo.
~ Pri sss, sks, ksk in ssk zadoščajo trije pravi podatki; med njimi je vedno vsaj ena stranica.
> Koti določijo obliko, ne velikosti. Trikotnik s temi koti je lahko majhen ali velik, vsi pa niso skladni.

? Dve stranici trikotnika merita $4\,\text{cm}$ in $7\,\text{cm}$. Koliko centimetrov največ meri tretja, če je njena dolžina celo število centimetrov?
= 10 cm
~ 11 | Pri $4 + 7 = 11$ se trikotnik splošči v daljico. Tretja mora biti krajša od vsote.
~ 3 | To je razlika $7 - 4$, spodnja meja. Vprašanje sprašuje po največji dolžini.
> Tretja stranica mora biti krajša od $4 + 7 = 11\,\text{cm}$, zato je največja cela dolžina $10\,\text{cm}$.

? Oddajnika $A$ in $B$ sta $8\,\text{km}$ narazen. Omrežje oceni, da je telefon $3\,\text{km}$ od $A$ in $4\,\text{km}$ od $B$. Kaj sledi?
- Telefon je na dveh mestih, zrcalno glede na $AB$.
~ To velja, ko se krožnici sekata. Tu se ne, ker je $3 + 4 < 8$.
- Telefon leži na daljici $AB$.
~ Tako bi bilo pri $3 + 4 = 8$. Tu je vsota manjša.
+ Takega položaja ni, ena od ocen je napačna.
- Telefon je na natanko enem mestu.
~ Ena sama lega bi pomenila, da se krožnici dotikata. Ne dotikata se, saj je $3 + 4 < 8$.
> $3 + 4 = 7 < 8$: krožnici okoli $A$ in $B$ se ne sekata, trikotnik ne obstaja. Omrežje mora razdaljo izmeriti znova.

:::simboli
A, B, C | oglišča trikotnika | | |
a | stranica nasproti oglišča $A$ | | cm | $a = BC$
b | stranica nasproti oglišča $B$ | | cm | $b = AC$
c | stranica nasproti oglišča $C$ | | cm | $c = AB$; najdaljša v $a + b > c$
\alpha | notranji kot pri oglišču $A$ | | °
\beta | notranji kot pri oglišču $B$ | \beta = 180^\circ - \alpha - \gamma | °
\gamma | notranji kot pri oglišču $C$ | | °
:::

<<RACUN
vrednost: 5+4 | 9
vrednost: 180-45-75 | 60
vrednost: 45+60 | 105
vrednost: sqrt(4^2+5^2-2*4*5*cos(60°)) | 4.6
vrednost: 6*sin(45°)/sin(75°) | 4.4
vrednost: 6*sin(60°)/sin(75°) | 5.4
vrednost: sqrt(6^2+8^2) | 10
vrednost: 3+4 | 7
vrednost: 4+7 | 11
vrednost: 7-4 | 3
vrednost: 50+60+70 | 180
vrednost: 6*sin(30°) | 3
>>
