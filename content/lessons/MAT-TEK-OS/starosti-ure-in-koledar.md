---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poišči v kuhinji uro s kazalci, lahko tudi stensko uro v razredu. Če ima zadaj kolešček za nastavljanje, z njim počasi zavrti minutni kazalec za en cel krog, od 3.00 do 4.00. Ves čas pa glej **urni** kazalec. Če koleščka ni, uro opazuj deset minut.

Urni kazalec ne skoči s trojke na štirico šele ob 4.00. Lezel je ves čas, počasi in enakomerno. Prav ta drobna podrobnost je past v mnogih tekmovalnih nalogah z uro.

V kuhinji čas štejemo na več načinov: minute peke, rok marmelade, leta babice, ki je zapisala recept. Take naloge so na tekmovanjih pogoste, ker so videti preproste. Vsaka pa se reši z enim ključnim opažanjem, ki ga boš v treh delih spodaj odkril sam.

## Razlaga

### Starosti: kaj se s časom ne spremeni

Mama Petra je stara 32 let, hči Lina 8. Skupaj vsako leto spečeta torto za Linin rojstni dan. Zapišimo, kako stari bosta:

| Čez let | Mama | Lina | Razlika |
|---|---|---|---|
| 0 | 32 | 8 | 24 |
| 4 | 36 | 12 | 24 |
| 16 | 48 | 24 | 24 |

Danes je mama 4-krat starejša od Line, čez 4 leta 3-krat, čez 16 let le še 2-krat. **Razmerje** starosti se torej spreminja. **Razlika** pa ostaja $24$ let, ker vsako leto obe postaneta za eno leto starejši.

To je ključ nalog o starostih: razlika starosti dveh oseb je **stalna**. Kadar naloga sprašuje »kdaj bo $k$-krat starejša«, si starost hčere predstavljaj kot 1 del. Mama ima takrat $k$ delov, razlika je $k - 1$ delov. Hči je takrat stara $\dfrac{\text{razlika}}{k - 1}$ let.

Drugo pravilo velja za skupine. Če je vseh $m$ oseb že rojenih, se v $n$ letih **vsota** njihovih starosti poveča za $m \cdot n$ let, saj vsak dobi $n$ let.

:::premisli
Ali bo mama Petra kdaj natanko $1{,}5$-krat starejša od Line? Napovej, ali bo Lina takrat mlajša ali starejša od 30 let, šele nato računaj.
---
Bo, in Lina bo takrat že starejša od 30 let. Razlika $24$ let je $1{,}5 - 1 = 0{,}5$ Linine starosti, zato je Lina stara $24 : 0{,}5 = 48$ let, mama pa $72$. Razmerje se s časom vedno bolj približuje 1, a ga nikoli ne doseže.
:::

### Ura: dva kazalca, dve hitrosti

Številčnica ima $360^\circ$ in 12 številk. Med sosednjima številkama je zato $360^\circ : 12 = 30^\circ$. Položaj kazalca merimo od dvanajstice v smeri vrtenja kazalcev.

Minutni kazalec naredi cel krog v 60 minutah, torej $360^\circ : 60 = 6^\circ$ na minuto.

Za urni kazalec si oglej meritve med 3.00 in 4.00, narejene z geotrikotnikom na številčnici:

| Ura | Minutni | Urni | Kot med njima |
|---|---|---|---|
| 3.00 | $0^\circ$ | $90^\circ$ | $90^\circ$ |
| 3.15 | $90^\circ$ | $97{,}5^\circ$ | $7{,}5^\circ$ |
| 3.30 | $180^\circ$ | $105^\circ$ | $75^\circ$ |
| 3.45 | $270^\circ$ | $112{,}5^\circ$ | $157{,}5^\circ$ |

Opaziš vzorec? V vsakih 15 minutah se urni kazalec premakne za $7{,}5^\circ$. To je $0{,}5^\circ$ na minuto oziroma $30^\circ$ na uro. Ob 3.15 kazalca zato **nista** prekrita, čeprav na prvi pogled oba kažeta na trojko.

Pravilo: ko ura kaže $h$ ur in $m$ minut, je

- urni kazalec pri $30^\circ \cdot h + 0{,}5^\circ \cdot m$,
- minutni kazalec pri $6^\circ \cdot m$.

Kot med kazalcema je razlika teh dveh položajev. Če je večja od $180^\circ$, vzemi $360^\circ$ minus razliko, saj naloge skoraj vedno sprašujejo po manjšem kotu. Ker je $6^\circ - 0{,}5^\circ = 5{,}5^\circ$, razliko na kratko zapišemo kot $|30 \cdot h - 5{,}5 \cdot m|$ stopinj.

V simulaciji spodaj »Kot med kazalcema ure« nastavi 3.00 in počasi dodajaj minute do 3.20. Opazuj, kako se kot najprej manjša, nekje med 3.15 in 3.20 pade na nič in nato spet raste. Zapomni si, kdaj: v Primeru 4 boš ta trenutek izračunal.

:::premisli
Minutni kazalec je hitrejši od urnega za $6^\circ - 0{,}5^\circ = 5{,}5^\circ$ na minuto. Zakaj se kazalca v 12 urah prekrijeta le 11-krat in ne 12-krat?
---
Da minutni kazalec ujame urnega še enkrat, mora pridobiti cel krog, $360^\circ$. To traja $360 : 5{,}5 = \dfrac{720}{11} \approx 65{,}5$ minute, torej več kot eno uro. V 12 urah ($720$ minut) to uspe le $11$-krat. Med 11.00 in 1.00 se kazalca prekrijeta samo enkrat, ob 12.00.
:::

### Koledar: računanje s sedmicami

Na kuhinjskem koledarju je vsak teden ena vrstica s sedmimi okenci. Če je 3. v mesecu ponedeljek, so ponedeljki tudi 10., 17., 24. in 31. Ti datumi se razlikujejo za $7$ ali za večkratnik števila $7$.

Za dan v tednu je torej pomemben le **ostanek** pri deljenju števila dni s $7$. Računanju samo z ostanki pri deljenju s $7$ rečemo **računanje po modulu 7**.

- Čez $n$ dni: poišči ostanek $n$ pri deljenju s $7$ in se za toliko dni pomakni naprej. Pri »pred $n$ dnevi« se za toliko dni pomakni nazaj.
- Navadno leto ima $365 = 52 \cdot 7 + 1$ dni. Isti datum se naslednje leto pomakne za **1** dan v tednu.
- Prestopno leto ima $366 = 52 \cdot 7 + 2$ dni. Pomik je **2** dni, če med obema datumoma leži 29. februar.
- Leto je prestopno, če je deljivo s $4$. Izjema so stoletja: leto 1900 ni bilo prestopno, 2000 pa je bilo, ker je deljivo s $400$.

V simulaciji spodaj »Dnevi v tednu (računanje po modulu 7)« prištevaj dneve. Opazi, da $7$, $14$ ali $70$ dni dan v tednu pustijo enak.

## Rešeni primeri

### Primer 1 (lažji): babica in vnukinja

Babica Marija je stara 67 let, vnukinja Ana 11. Skupaj pečeta piškote po babičinem receptu. Čez koliko let bo babica natanko 5-krat starejša od Ane?

**Podatki:** babica je stara $67$ let, Ana $11$ let; babica naj bo $5$-krat starejša
**Iščemo:** število let $x$ do takrat

:::formula
Razlika starosti je stalna. Ko je starejša oseba $k$-krat starejša, je mlajša stara $\dfrac{\text{razlika}}{k - 1}$.
:::

**Rešitev:**

1. Razlika: $67 - 11 = 56$ let. Ta ostane enaka za vedno.
2. Ko je babica 5-krat starejša, je razlika enaka $5 - 1 = 4$ Aninim starostim. Ana je takrat stara $56 : 4 = 14$ let.
3. Do takrat mine $14 - 11 = 3$ leta.
4. Preizkus: babica bo stara $67 + 3 = 70$ let in res je $5 \cdot 14 = 70$.
5. Odgovor: babica bo 5-krat starejša od Ane čez 3 leta.

### Primer 2: ko zavre voda

Ko voda za testenine zavre, kuhinjska ura kaže 2.48. Kolikšen je manjši kot med kazalcema?

**Podatki:** ura kaže $h = 2$ in $m = 48$; urni kazalec se premakne za $30^\circ$ na uro in $0{,}5^\circ$ na minuto; minutni za $6^\circ$ na minuto
**Iščemo:** manjši kot med kazalcema

:::formula
urni: $30^\circ \cdot h + 0{,}5^\circ \cdot m$

minutni: $6^\circ \cdot m$

manjši kot je največ $180^\circ$
:::

**Rešitev:**

1. Urni kazalec: $30^\circ \cdot 2 + 0{,}5^\circ \cdot 48 = 84^\circ$. Je skoraj na trojki, ker je ura skoraj tri.
2. Minutni kazalec: $6^\circ \cdot 48 = 288^\circ$.
3. Razlika: $288^\circ - 84^\circ = 204^\circ$. To je več kot $180^\circ$, zato smo dobili večji kot.
4. Manjši kot: $360^\circ - 204^\circ = 156^\circ$.
5. Odgovor: kazalca oklepata kot $156^\circ$.

### Primer 3 (težji): rok marmelade

Teta Vera je marmelado skuhala v soboto, 14. avgusta. Na kozarec je napisala: »Najboljše v 100 dneh.« Na kateri dan v tednu in katerega datuma se teh 100 dni izteče?

**Podatki:** začetek je sobota, 14. avgust; čas $100$ dni; avgust ima $31$ dni, september $30$, oktober $31$
**Iščemo:** dan v tednu in datum

:::formula
dan v tednu: ostanek števila $100$ pri deljenju s $7$

datum: odštevaj dneve po mesecih
:::

**Rešitev:**

1. $100 = 14 \cdot 7 + 2$. Ostanek je $2$, ker 14 celih tednov dneva v tednu ne spremeni.
2. Sobota in še 2 dni: nedelja, ponedeljek. Torej ponedeljek.
3. Datum: do konca avgusta je še $31 - 14 = 17$ dni. Ostane $100 - 17 = 83$ dni.
4. September porabi 30 dni: $83 - 30 = 53$. Oktober porabi 31 dni: $53 - 31 = 22$. Ostalih 22 dni pade v november.
5. Odgovor: rok se izteče v ponedeljek, 22. novembra.

### Primer 4 (zdaj ti): piškoti v pečici

Mama da piškote v pečico ob 3.00. Ven jih vzame, ko se kazalca na kuhinjski uri prvič prekrijeta. Koliko minut po 3.00 je to?

**Podatki:** začetek ob 3.00; urni kazalec je takrat pri $90^\circ$, minutni pri $0^\circ$; minutni se premakne za $6^\circ$ na minuto, urni za $0{,}5^\circ$ na minuto
**Iščemo:** čas $m$ v minutah do prvega prekrivanja

:::formula
Minutni kazalec dohiteva urnega za $6^\circ - 0{,}5^\circ = 5{,}5^\circ$ na minuto.

Kazalca sta prekrita, ko velja $5{,}5 \cdot m = 90$.
:::

**Rešitev:**

1. Ob 3.00 je minutni kazalec $90^\circ$ za urnim.
2. Vsako minuto se razmik zmanjša za $5{,}5^\circ$, zato iščemo $m$, pri katerem je $5{,}5 \cdot m = 90$.
3. Reši enačbo sam in rezultat zapiši v minutah in sekundah.

:::premisli
Koliko je $m$?
---
$m = 90 : 5{,}5 = \dfrac{180}{11} = 16\tfrac{4}{11}$ minute, to je približno 16 minut in 22 sekund. Piškoti gredo ven malo po 3.16. Ne ob 3.15: takrat je urni kazalec še $7{,}5^\circ$ pred minutnim.
:::

## Pogoste napake

- **»Razmerje starosti ostane enako.«** Če je mama danes 4-krat starejša, čez 10 let ni več 4-krat starejša. Vsako leto obema prišteješ 1, ne pomnožiš ju. Stalna je razlika, zato računaj z njo.
- **Urni kazalec »stoji« na polni uri.** Ob 3.15 nekdo reče, da je kot $0^\circ$, ker oba kazalca kažeta na trojko. Urni kazalec pa se je v 15 minutah premaknil za $7{,}5^\circ$. Za vsako minuto mu prištej $0{,}5^\circ$.
- **Večji kot namesto manjšega.** Razlika položajev je lahko več kot $180^\circ$; ob 2.48 je $204^\circ$. Naloga skoraj vedno misli manjši kot, zato razliko odštej od $360^\circ$.
- **Pomik v napačno smer ali napačno prestopno leto.** Pri vprašanju »kateri dan je *bil*« se pomakneš nazaj, ne naprej. Pomik za 2 dni velja le, če vmes leži 29. februar.
- **Vsota starosti z nekom, ki se še ni rodil.** Če se vsota starosti štirih oseb v 5 letih poveča za manj kot $4 \cdot 5 = 20$, eden od njih takrat še ni bil rojen. Šteti smeš le leta, ki jih je kdo res preživel.

## Povzetek

- Razlika starosti dveh oseb je stalna, razmerje se s časom približuje 1. Ko je ena $k$-krat starejša, je mlajša stara $\dfrac{\text{razlika}}{k-1}$.
- V $n$ letih se vsota starosti $m$ oseb poveča za $m \cdot n$, če so vse že rojene.
- Minutni kazalec: $6^\circ$ na minuto. Urni kazalec: $30^\circ$ na uro in $0{,}5^\circ$ na minuto.
- Kot ob $h$ urah in $m$ minutah: $|30 \cdot h - 5{,}5 \cdot m|$ stopinj; če je več kot $180^\circ$, vzemi $360^\circ$ minus to.
- Kazalca se prekrijeta vsakih $\dfrac{720}{11}$ minute, 11-krat v 12 urah.
- Dan v tednu čez $n$ dni določa ostanek $n$ pri deljenju s $7$. Navadno leto premakne datum za 1 dan, prestopno za 2.

## Drugače: Korak za korakom s številkami

**Kot med kazalcema ob 8.20.**

1. Urni kazalec, cele ure: $30^\circ \cdot 8 = 240^\circ$.
2. Urni kazalec, dodatek za minute: $0{,}5^\circ \cdot 20 = 10^\circ$. Skupaj $240^\circ + 10^\circ = 250^\circ$.
3. Minutni kazalec: $6^\circ \cdot 20 = 120^\circ$.
4. Razlika: $250^\circ - 120^\circ = 130^\circ$.
5. Ali je več kot $180^\circ$? Ni, zato je kot $130^\circ$.

**Oče je star 41 let, sin 9. Kdaj bo oče 3-krat starejši?**

1. Razlika: $41 - 9 = 32$.
2. Razlika je $3 - 1 = 2$ sinovi starosti.
3. Sin bo takrat star $32 : 2 = 16$ let.
4. To bo čez $16 - 9 = 7$ let. Preizkus: oče bo star $41 + 7 = 48$ let, in $3 \cdot 16 = 48$.

**Danes je sreda. Kateri dan bo čez 45 dni?**

1. $45 = 6 \cdot 7 + 3$.
2. Sreda in še 3 dni: četrtek, petek, sobota.

## Drugače: Kot zgodba

Po kuhinjski uri lezeta dva polža. Minutni polž je hiter: v eni minuti preleze $6^\circ$. Urni polž je zaspan: v minuti naredi le $0{,}5^\circ$, v celi uri pa en sam predalček med dvema številkama.

Ob 3.00 zaspani polž počiva na trojki, hitri pa na dvanajstici, $90^\circ$ za njim. Hitri ga začne loviti in ga vsako minuto dohiti za $5{,}5^\circ$. Po četrt ure pride do trojke in se razveseli, a zaspani se je medtem odplazil še $7{,}5^\circ$ naprej. Ujame ga šele malo po 3.16.

Na mizi pod uro se babica in vnukinja dogovarjata o torti. Vsako leto dobita na torti po eno svečko več. Babica ima zato vedno 56 svečk več kot vnukinja. Ko je vnukinja upihnila eno samo svečko, je imela babica $57$ svečk, torej je bila 57-krat starejša. Ko bo vnukinja upihnila 14 svečk, jih bo babica 70, in bo le še 5-krat starejša. Razlika ostane, razmerje se topi.

Na steni visi koledar s sedmimi stolpci. Po sedmih korakih v desno si spet v istem stolpcu, zato koledar zanima samo ostanek pri deljenju s 7.

## Preveri se

? Kateri par »ura → manjši kot med kazalcema« je pravilen?
- 6.15 → $90^\circ$
~ Urni kazalec se je v 15 minutah premaknil za $7{,}5^\circ$ od šestice. Pravi kot je $97{,}5^\circ$.
+ 9.00 → $90^\circ$
- 12.30 → $180^\circ$
~ Ob 12.30 urni kazalec ni več na dvanajstici, ampak $15^\circ$ naprej. Kot je $165^\circ$.
- 3.15 → $0^\circ$
~ Oba kazalca kažeta na trojko le na prvi pogled. Urni je $7{,}5^\circ$ naprej od trojke, zato je kot $7{,}5^\circ$.
> Ob 9.00 je urni kazalec pri $270^\circ$, minutni pri $0^\circ$. Razlika $270^\circ$ je več kot $180^\circ$, zato je manjši kot $360^\circ - 270^\circ = 90^\circ$.

? Kuhinjska ura kaže 1.05. Približno kolikšen je manjši kot med kazalcema?
- Natanko $0^\circ$, kazalca sta prekrita.
~ Minutni kazalec je točno na enki, urni pa se je v 5 minutah premaknil za $2{,}5^\circ$ naprej.
+ Le nekaj stopinj.
- Približno $30^\circ$.
~ $30^\circ$ je razmik med dvema številkama. Tu sta oba kazalca pri enki.
> Minutni kazalec je pri $30^\circ$, urni pri $30^\circ + 2{,}5^\circ = 32{,}5^\circ$. Kot je le $2{,}5^\circ$.

? Zakaj se razlika starosti mame in hčere nikoli ne spremeni?
- Ker se razmerje njunih starosti ne spremeni.
~ Razmerje se spreminja: mama, ki je danes 4-krat starejša, bo čez leta le še 2-krat starejša.
+ Ker vsako leto obe postaneta za natanko eno leto starejši.
- Ker je mama vedno starejša od hčere.
~ To drži, a pove le, da je razlika pozitivna, ne pa, da je ves čas enaka.
> Vsako leto obema prišteješ $1$, zato se razlika ohrani. Razmerje pa se manjša proti $1$.

? Novo leto, 1. januar 2027, je v petek. Na kateri dan v tednu je bil 1. januar 2026?
- sobota
~ Pomaknil si se naprej namesto nazaj. Iščemo dan, ki je bil leto dni prej.
+ četrtek
- sreda
~ Pomik za 2 dni velja le, če vmes leži 29. februar. Leto 2026 ni prestopno, ker 2026 ni deljivo s 4.
> Leto 2026 ima $365 = 52 \cdot 7 + 1$ dni, zato je pomik le 1 dan. Za nazaj: dan pred petkom je četrtek.

? Danes je vsota starosti mame, očeta in njunih dveh otrok 80 let. Pred 5 leti je bila vsota starosti vseh, ki so takrat že živeli, 63 let. Koliko je star mlajši otrok?
- 3 leta
~ Vzel si, da so pred 5 leti živeli vsi štirje: $80 - 20 = 60$, in razliko $63 - 60$ prebral kot starost. Pred 5 leti pa so živeli le trije.
+ 2 leti
- Podatki so protislovni, ker bi morala biti vsota pred 5 leti 60.
~ $60$ bi veljalo, če bi bili pred 5 leti rojeni vsi štirje. Mlajši otrok takrat še ni bil rojen.
> Če bi pred 5 leti živeli vsi štirje, bi bila vsota $80 - 20 = 60$, ne $63$. Torej so takrat živeli le trije; danes so skupaj stari $63 + 15 = 78$ let. Mlajši otrok je star $80 - 78 = 2$ leti, kar je manj kot 5 in se ujema.

:::simboli
k | kolikokrat je starejša oseba starejša | | | razlika starosti je k − 1 delov
h | število ur, ki jih kaže ura | | | od 0 do 12
m | število minut, ki jih kaže ura | | | drugje: število oseb
:::
