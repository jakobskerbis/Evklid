---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za na mizo: vzemi tri kocke Lego za spodnje nadstropje stolpca (rdečo, modro, rumeno) in dve za zgornje (belo, črno). Stolpec ima natanko dve kocki, eno spodaj in eno zgoraj. Koliko različnih stolpcev sestaviš?

Sestavljaj jih enega za drugim in jih postavi v vrsto. Ko misliš, da si končal, preveri, ali se kateri ponovi in ali je kateri manjkal. Če si delal po vrsti, imaš šest stolpcev.

Na tekmovanjih pogosto vprašajo »na koliko načinov …«. Odgovori so lahko na stotine ali tisoče, zato jih ne moremo sestaviti z rokami. Potrebujemo pravila, ki štejejo namesto nas, in red, s katerim nobene možnosti ne izpustimo in nobene ne štejemo dvakrat.

## Razlaga

**Opazi vzorec.** Ponovi poskus z različnim številom kock. Zapisuj, koliko barv imaš spodaj, koliko zgoraj in koliko stolpcev nastane:

| spodaj | zgoraj | stolpcev |
|---|---|---|
| $1$ | $2$ | $2$ |
| $2$ | $2$ | $4$ |
| $3$ | $2$ | $6$ |
| $3$ | $3$ | $9$ |

Vsaka spodnja kocka dobi enako število zgornjih. Zato se število stolpcev vsakič izide kot zmnožek obeh števil.

**Drevo možnosti.** Zakaj je tako, najlepše pokaže risba. Na levi nariši piko, to je **koren** drevesa. Iz nje nariši tri veje, za vsako spodnjo barvo eno. Iz konca vsake veje nariši še dve veji, za belo in črno. Na desni dobiš $3 \cdot 2 = 6$ končnih točk. Imenujemo jih **listi**. Vsaka pot od korena do lista je en stolpec.

Simulacija spodaj (»Drevo možnosti«) namesto kock uporablja oblačila: majice so kot spodnje kocke, hlače kot zgornje. Nastavi $3$ majice, $2$ hlače in $1$ par čevljev. Nato dodaj še en par čevljev in opazuj, kako se vsak list razcepi na dva.

**Pravilo produkta.** Odločitev sestavljamo v več korakih. Če ima prvi korak $a$ možnosti in ima drugi korak *pri vsaki* izbiri iz prvega $b$ možnosti, je vseh izidov $a \cdot b$. Pri več korakih množimo naprej.

:::premisli
Stolpcu iz treh spodnjih in dveh zgornjih barv dodaš še streho, ki je lahko ravna, dvokapna, piramida ali kupola. Koliko stolpcev zdaj dobiš? Napovej, preden izračunaš.
---
$24$. Vsak od $6$ dosedanjih stolpcev dobi $4$ različne strehe: $3 \cdot 2 \cdot 4 = 24$. V drevesu se vsak od šestih listov razcepi na štiri.
:::

**Pravilo vsote.** Strehe iz prejšnjega vprašanja zdaj pozabi: stolpec ima spet le dva dela. Zgoraj lahko namesto kocke postaviš tudi stožčasto streho. Imaš jih tri (zeleno, sivo, rjavo). Zgornji del je torej *ali* ena od $2$ kock *ali* ena od $3$ streh, nikoli oboje. Za zgornji del imaš $2 + 3 = 5$ možnosti.

Če se možnosti razdelijo v skupine, ki se ne prekrivajo, število vseh možnosti dobiš tako, da sešteješ skupine. Temu pravimo **pravilo vsote**. Ključna beseda je »ali«; pri pravilu produkta je ključna beseda »in nato«.

:::premisli
Sošolec izračuna vse stolpce kot $3 \cdot 2 \cdot 3 = 18$. Kje se zmoti?
---
Pri zgornjem delu ne izbiraš kocke *in* strehe, ampak eno *ali* drugo. Produkt $2 \cdot 3$ bi štel pare (kocka, streha), takih stolpcev pa ni. S tremi spodnjimi kockami je vseh stolpcev $3 \cdot 5 = 15$.
:::

**Sistematično naštevanje.** Včasih se veje drevesa ne razcepijo enako. Takrat pravilo produkta odpove in možnosti naštejemo, a po strogem redu.

Primer: v trgovini z gradbenim materialom plačaš $10$ € z bankovci po $5$ € ter kovanci po $2$ € in po $1$ €. Na koliko načinov? Začni pri največjem kosu in njegovo število zmanjšuj:

- dva bankovca po $5$ €: ostane $0$ €, $1$ način;
- en bankovec: ostane $5$ €, kovancev po $2$ € je $0$, $1$ ali $2$, ostalo dopolnijo kovanci po $1$ €: $3$ načini;
- brez bankovca: kovancev po $2$ € je od $0$ do $5$: $6$ načinov.

Skupaj je $1 + 3 + 6 = 10$ načinov. Ker so skupine ločene po številu bankovcev, smo uporabili pravilo vsote. Ker smo v vsaki skupini šli po vrsti, nismo ničesar izpustili.

## Rešeni primeri

### Primer 1 (lažji): stoli iz delavnice

Mizar izdeluje stole iz $4$ vrst lesa. Vsak stol polakira z enim od $3$ lakov in mu da eno od $2$ oblik naslona. Koliko različnih stolov lahko izdela?

**Podatki:** $4$ vrste lesa, $3$ laki, $2$ obliki naslona; pri stolu izbere eno od vsakega
**Iščemo:** število različnih stolov

:::formula
Pravilo produkta: $a \cdot b \cdot c$
:::

**Rešitev:**

1. Prvi korak je les: $4$ možnosti.
2. Za vsak les so $3$ laki, torej $4 \cdot 3 = 12$ kombinacij lesa in laka.
3. Vsaka od teh dobi še $2$ naslona: $12 \cdot 2 = 24$.
4. Odgovor: mizar lahko izdela $24$ različnih stolov.

### Primer 2: ograja iz treh desk

Ograja ima tri deske v vrsti. Vsako pobarvaš z eno od $4$ barv. Sosednji deski ne smeta biti iste barve. Na koliko načinov lahko pobarvaš ograjo?

**Podatki:** $3$ deske v vrsti, $4$ barve, sosednji deski različnih barv
**Iščemo:** število barvanj

:::formula
Pravilo produkta, barvamo od leve proti desni: $4 \cdot 3 \cdot 3$
:::

**Rešitev:**

1. Prva deska: $4$ možnosti, ker je nič ne omejuje.
2. Druga deska: vse barve razen barve prve, torej $3$ možnosti.
3. Tretja deska mora biti drugačna le od druge. Prvo barvo lahko ponovi, zato ima spet $3$ možnosti.
4. Vsaka veja drevesa se na vsakem koraku razcepi enako, zato smemo množiti: $4 \cdot 3 \cdot 3 = 36$.
5. Odgovor: ograjo lahko pobarvaš na $36$ načinov.

### Primer 3 (težji): trikotni okvirji

Iz letvic s celimi dolžinami v decimetrih sestavljaš trikotne okvirje z obsegom $15\,\mathrm{dm}$. Okvirja, ki se razlikujeta le po vrstnem redu stranic, štejemo kot enega. Koliko različnih okvirjev lahko narediš?

**Podatki:** stranice $a$, $b$, $c$ so cela števila (v dm), $a + b + c = 15$; vrstni red ni pomemben
**Iščemo:** število različnih trikotnikov

:::formula
Uredi stranice $a \le b \le c$. Trikotnik obstaja, če je $a + b > c$.
:::

**Rešitev:**

1. Ker vrstni red ni pomemben, vsak trikotnik zapišemo le enkrat, z urejenimi stranicami $a \le b \le c$.
2. Meje za $c$: ker je $a + b = 15 - c$, iz $a + b > c$ sledi $15 - c > c$, torej $c \le 7$. Ker je $c$ največja, je vsota $15$ kvečjemu $3c$: $3c \ge 15$ in $c \ge 5$.
3. $c = 5$: $a + b = 10$ in $b \le 5$, samo $(5, 5, 5)$. To je $1$ trikotnik.
4. $c = 6$: $a + b = 9$ in $b \le 6$: $(4, 5, 6)$ in $(3, 6, 6)$. To sta $2$ trikotnika.
5. $c = 7$: $a + b = 8$ in $b \le 7$: $(4, 4, 7)$, $(3, 5, 7)$, $(2, 6, 7)$, $(1, 7, 7)$. To so $4$ trikotniki.
6. Skupine so ločene po največji stranici, zato seštejemo: $1 + 2 + 4 = 7$.
7. Odgovor: narediš lahko $7$ različnih okvirjev.

### Primer 4 – zdaj ti: koda za garažo

Koda ključavnice na garaži ima $3$ ali $4$ števke. Vsaka števka je od $1$ do $6$ in se lahko ponavlja. Zadnja števka mora biti soda. Koliko različnih kod obstaja?

**Podatki:** dolžina $3$ ali $4$; števke $1$ do $6$ s ponavljanjem; zadnja števka soda ($2$, $4$ ali $6$)
**Iščemo:** število vseh kod

:::formula
Pravilo vsote po dolžini, znotraj vsake dolžine pravilo produkta
:::

**Rešitev:**

1. Kode razdelimo na trimestne in štirimestne. Skupini se ne prekrivata, zato ju bomo na koncu sešteli.
2. Trimestne: prvi dve števki imata po $6$ možnosti, zadnja $3$, torej $6 \cdot 6 \cdot 3 = 108$.
3. Štirimestne izračunaj sam, nato obe skupini seštej.

:::premisli
Koliko je štirimestnih kod in koliko vseh skupaj?
---
Štirimestnih je $6 \cdot 6 \cdot 6 \cdot 3 = 648$. Vseh kod je $108 + 648 = 756$.
:::

## Pogoste napake

- **Seštevanje namesto množenja.** »Imam $4$ vrste lesa, $3$ lake in $2$ naslona, torej $9$ stolov.« Tako šteješ posamezne sestavine, ne stolov. Vsak les gre z vsakim lakom, zato se možnosti množijo: $24$.
- **Množenje namesto seštevanja.** Pri »kocka *ali* streha« nekateri računajo $2 \cdot 3 = 6$. Produkt šteje pare, a para tu ni, ker postaviš le en kos. Pri »ali« z ločenimi skupinami seštevaj.
- **Prestroga ali preohlapna omejitev.** Pri ograji, kjer sosednji deski ne smeta biti enaki, nekateri računajo $4 \cdot 3 \cdot 2 = 24$, kot da morajo biti vse tri različne. Drugi pa omejitev pozabijo in dobijo $4 \cdot 4 \cdot 4$. Pri vsakem koraku vprašaj: od česa *točno* se mora razlikovati?
- **Neurejeno naštevanje.** Kdor trikotnike našteva na pamet, $(3, 5, 7)$ in $(5, 3, 7)$ šteje dvakrat ali kakšnega izpusti. Uredi $a \le b \le c$ in pojdi po največji stranici.
- **Pozabljen pogoj.** Trojica $(1, 3, 5)$ ima obseg $9$, a ni trikotnik, ker je $1 + 3 < 5$. Najprej zapiši vse pogoje, šele nato štej.

## Povzetek

- **Pravilo produkta:** odločitev v korakih, kjer ima vsak korak pri vsaki prejšnji izbiri enako število možnosti; števila zmnožimo.
- **Pravilo vsote:** možnosti razdelimo v skupine, ki se ne prekrivajo (»ali«); števila seštejemo.
- **Drevo možnosti:** koren, veje za vsak korak, listi so izidi. Če se veje na vsaki ravni razcepijo enako, šteješ z množenjem.
- Pri omejitvi (npr. sosednji različni) za vsak korak preveri, koliko možnosti *ostane*.
- **Sistematično naštevanje:** uredi elemente (npr. $a \le b \le c$), začni pri največjem in pojdi po vrsti; tako ne izpustiš ničesar in ničesar ne šteješ dvakrat.

## Drugače: Korak za korakom s številkami

Vzemimo ograjo s štirimi deskami in tremi barvami (rdeča R, modra M, zelena Z), sosednji deski različni.

1. Prva deska: $3$ možnosti. Na tej točki imamo $3$ začetke ograje: R, M, Z.
2. Druga deska: pri R sta možni M in Z, podobno pri ostalih. Začetkov je $3 \cdot 2 = 6$: RM, RZ, MR, MZ, ZR, ZM.
3. Tretja deska: vsak od $6$ začetkov se nadaljuje na $2$ načina, torej $6 \cdot 2 = 12$.
4. Četrta deska: spet $2$ možnosti, $12 \cdot 2 = 24$.

Vsakič, ko dodamo desko, se število podvoji. Zato je pri $n$ deskah barvanj $3 \cdot 2 \cdot 2 \cdots 2$, z $n - 1$ dvojkami.

## Drugače: Kot zgodba

Ana gradi ptičjo hišico. Najprej izbere steno. V škatli ima tri barve: rdečo, modro in rumeno. Ko se odloči za rdečo, gre k polici s strehami. Tam čakata dve: lesena in pločevinasta.

Ana pomisli: »Če bi izbrala modro steno, bi pred isto polico stala spet z dvema strehama. Pri rumeni prav tako.« Vsaka stena ima svojo pot do vsake strehe, zato je hišic $3 \cdot 2 = 6$.

Naslednji dan sosed Bor ponudi še tri strehe iz slame. Ana zdaj pri polici ne izbira več med dvema, ampak med petimi strehami: dvema starima *ali* tremi slamnatimi. Za vsako steno ima torej $2 + 3 = 5$ streh, vseh hišic pa je $3 \cdot 5 = 15$.

## Preveri se

? Okvir za sliko je lahko v eni od $2$ barv, steklo pa ene od $3$ vrst. Katero drevo prikazuje vse možne slike?
- Koren s $5$ vejami.
~ Pet vej bi pomenilo, da izbereš okvir *ali* steklo. Ti izbereš oboje, zato drevo potrebuje dve ravni.
+ Koren z $2$ vejama, vsaka se razcepi na $3$.
- Koren z $2$ vejama, le prva se razcepi na $3$.
~ Vsak okvir gre z vsakim steklom, zato se mora razcepiti vsaka veja, ne le prva.
> Prva raven so okvirji ($2$), druga stekla ($3$ pri vsakem okvirju). Drevo ima $2 \cdot 3 = 6$ listov.

? Koda ima $4$ števke od $1$ do $9$, ki se smejo ponavljati. Približno koliko kod je?
- okoli $36$
~ To je $9 + 9 + 9 + 9$. Števke se ne seštevajo: vsaka nova števka pomnoži število kod z $9$.
- okoli $730$
~ To je $9 \cdot 9 \cdot 9 = 729$, kar velja za trimestne kode. Štirimestna doda še en faktor $9$.
+ okoli $6500$
- okoli $60\,000$
~ To bi veljalo za kode s petimi števkami ($9^5 = 59\,049$). Pri štirih so štirje faktorji $9$.
> $9 \cdot 9 \cdot 9 \cdot 9 = 6561$, kar je približno $6500$.

? Tri deske v vrsti barvaš s $4$ barvami, sosednji deski morata biti različni. Zakaj je barvanj $4 \cdot 3 \cdot 3$ in ne $4 \cdot 3 \cdot 2$?
- Ker se zadnja deska vedno pobarva enako kot prva.
~ Tretja deska *sme* dobiti barvo prve, ni pa nujno. Ima $3$ možnosti, ena od njih je barva prve.
+ Ker mora biti tretja deska različna le od druge, ne tudi od prve.
- Ker ima vsaka deska po $3$ barve, prva pa še eno več.
~ To je naključno ujemanje števil. Zadnji faktor je $3$, ker izključimo samo barvo sosednje deske.
> Faktor $2$ bi veljal, če bi morale biti vse tri deske različne. Tu prepovemo le barvo sosednje.

? Mizar iz $5$ vrst lesa naredi $30$ različnih omar. Vsako vrsto lesa kombinira z vsako barvo laka. Koliko barv laka ima?
- $25$
~ To je $30 - 5$. Les in lak se kombinirata, zato se njuni števili množita, ne seštevata.
- $150$
~ To je $30 \cdot 5$. Iščeš faktor, ki s $5$ da $30$, zato deliš.
+ $6$
> Po pravilu produkta je $5 \cdot x = 30$, torej $x = 6$ barv laka.

? Koliko različnih trikotnikov s celimi stranicami ima obseg $9$? Trikotnika, ki se razlikujeta le po vrstnem redu stranic, sta enaka.
- $7$
~ Upošteval si tudi trojice, kot je $(1, 3, 5)$, kjer je $1 + 3 < 5$. Taka trojica ni trikotnik.
+ $3$
- $10$
~ Tako dobiš, če $(2, 3, 4)$, $(3, 2, 4)$ in podobne šteješ posebej. Vrstni red stranic tu ni pomemben.
> Z urejenimi stranicami $a \le b \le c$ in pogojem $a + b > c$ dobiš $(3, 3, 3)$, $(2, 3, 4)$ in $(1, 4, 4)$.

:::simboli
a | število možnosti prvega koraka | | | pri trikotniku: najkrajša stranica
b | število možnosti drugega koraka | | | pri trikotniku: srednja stranica
c | število možnosti tretjega koraka | | | pri trikotniku: najdaljša stranica, c < a + b
:::
