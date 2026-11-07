---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1947 sta matematika Herman Goldstine in John von Neumann pisala navodila, kako naj se reševanje problemov pripravi za nov elektronski računalnik. Takratni stroji so ukaze izvajali po vrsti, a s skoki naprej in nazaj. Program, zapisan kot dolg seznam ukazov, je bil težko berljiv: kdo bi iz njega razbral, kje se kaj ponavlja? Zato sta postopek najprej narisala. Škatle so pomenile račune, puščice pot, posebna mesta pa odločitve. Tako sta v svojem poročilu predstavila **diagrame poteka** (angl. *flow diagrams*).

Beseda **algoritem** je še veliko starejša. Izhaja iz imena perzijskega učenjaka al-Hvarizmija iz 9. stoletja, čigar knjiga je Evropo naučila računati z indijsko-arabskimi številkami po natančnih korakih. Ideja je ostala ista: postopek, ki ga lahko izvede nekdo, ki ne razume problema, le natančno sledi navodilom. Danes je ta »nekdo« računalnik. Preden napišeš prvo vrstico programa, moraš znati postopek zapisati tako, da ne pušča dvoma.

## Razlaga

**Začnimo s primerom.** Merilnik v laboratoriju bere napetost omrežja in mora povedati, ali je v dovoljenem pasu $230\,\mathrm{V} \pm 10\,\%$, torej med $207\,\mathrm{V}$ in $253\,\mathrm{V}$. Postopek z besedami:

1. Preberi napetost $U$.
2. Če je $|U - 230| \le 23$, izpiši »v redu«.
3. Sicer izpiši »zunaj tolerance«.
4. Konec.

Kot diagram poteka:

```
     ( začetek )
          |
      / beri U /
          |
  < |U-230| <= 23 ? >
    da |       | ne
       v       v
 /"v redu"/ /"zunaj"/
       |       |
       +---+---+
           |
       ( konec )
```

Že iz tega primera vidiš vse dele, ki jih bomo zdaj natančno poimenovali.

**Definicija.** **Algoritem** je končno zaporedje natančno določenih korakov, ki iz vhodnih podatkov v končno mnogo korakih da izhodne podatke. Zahtevamo:
- **končnost**: za vsak dovoljen vhod se postopek ustavi;
- **določenost**: vsak korak je enoumen, ne dopušča izbire »po občutku«;
- **vhod in izhod**: nič ali več vhodnih podatkov in vsaj en rezultat;
- **izvedljivost**: vsak korak je dovolj preprost, da ga lahko izvedemo (z jasnim računom ali primerjavo).

Algoritem lahko zapišemo z naravnim jezikom, s **psevdokodo** (strukturiran zapis, podoben programu, a brez pravil določenega jezika), z **diagramom poteka** ali v programskem jeziku.

**Simboli diagrama poteka** (po standardu ISO 5807):
- zaobljen pravokotnik (ovalno): začetek in konec;
- pravokotnik: obdelava, na primer račun ali prireditev;
- paralelogram: vhod ali izhod podatkov;
- romb: odločitev, iz njega gresta dve puščici, »da« in »ne«;
- puščice: smer poteka; kjer se poti združijo, se združita puščici;
- krožec: priključek, ko se diagram nadaljuje drugje.

**Tri osnovne strukture.**
1. **Zaporedje**: koraki se izvedejo eden za drugim (zgornji koraki 1, 2).
2. **Odločitev (izbira)**: glede na pogoj se izvede ena od dveh vej. Veji se nato spet združita.
3. **Ponavljanje (zanka)**: skupina korakov se ponavlja, dokler velja pogoj. Pri zanki s **pogojem na začetku** se telo morda ne izvede niti enkrat. Pri zanki s **pogojem na koncu** se izvede vsaj enkrat.

**Izrek (Böhm in Jacopini, 1966).** Vsak algoritem, ki ga lahko zapišemo z diagramom poteka, lahko zapišemo samo z zaporedjem, odločitvijo in ponavljanjem (če smemo uvesti pomožne spremenljivke). Zato ne potrebujemo poljubnih skokov; to je podlaga **strukturiranega programiranja**.

:::premisli
Pri merilniku zamenjamo pogoj $|U - 230| \le 23$ s pogojem $|U - 230| < 23$. Pri kateri izmerjeni napetosti se rezultat spremeni?
---
Le na mejah, pri $U = 207\,\mathrm{V}$ in $U = 253\,\mathrm{V}$: prej »v redu«, zdaj »zunaj tolerance«. Mejni primeri so mesta, kjer se algoritmi najpogosteje zmotijo, zato jih vedno preizkusi.
:::

**Sledilna tabela.** Algoritem preverimo tako, da ga »izvedemo na papirju«: za vsak korak zapišemo vrednosti vseh spremenljivk. Tabeli rečemo **sledilna tabela**. Program je pravilen šele, ko deluje za običajne vhode, mejne vhode in posebne primere (prazen vhod, ničla).

:::premisli
Zakaj zanka s pogojem na začetku ni primerna, če moramo podatek vsaj enkrat prebrati, preden ga lahko preverimo, in kako se tega rešimo brez zanke s pogojem na koncu?
---
Pogoja ni mogoče preveriti, preden obstaja podatek. Prvi podatek zato preberemo enkrat pred zanko, nato pa na koncu vsake ponovitve preberemo naslednjega. Tako je v Primeru 3.
:::

## Rešeni primeri

### Primer 1 (lažji): zaporedje, strošek porabe

Grelnik z močjo $P = 2000\,\mathrm{W}$ deluje $t = 1{,}5\,\mathrm{h}$. Elektrika stane $0{,}15$ € na $\mathrm{kWh}$. Zapiši algoritem, ki iz $P$ in $t$ izračuna porabljeno energijo in strošek, ter ga preveri.

**Podatki:** $P = 2000\,\mathrm{W}$, $t = 1{,}5\,\mathrm{h}$, cena $0{,}15$ €/kWh
**Iščemo:** algoritem (zaporedje korakov), energijo $E$ in strošek

:::formula
$E = \dfrac{P \cdot t}{1000}$ (v $\mathrm{kWh}$, ko je $P$ v W in $t$ v h), strošek $= E \cdot \text{cena}$
:::

**Rešitev:**

1. Algoritem je samo zaporedje: beri $P$, beri $t$, izračunaj $E$, izračunaj strošek, izpiši, konec. V diagramu: oval, dva paralelograma, dva pravokotnika, paralelogram, oval.
2. Deljenje s $1000$ je potrebno, ker je cena podana za kilovatno uro, moč pa v vatih.
3. Ročni izračun: $E = \frac{2000 \cdot 1{,}5}{1000} = 3\,\mathrm{kWh}$ in strošek $3 \cdot 0{,}15 = 0{,}45$ €.
4. Isti algoritem v Pythonu (decimalna pika namesto vejice):

```python
P = float(input())      # moč v W
t = float(input())      # čas v h
cena = 0.15             # €/kWh
E = P * t / 1000        # kWh
print(E, "kWh,", round(E * cena, 2), "€")
```

Za vhod `2000` in `1.5` program izpiše `3.0 kWh, 0.45 €`.

5. Odgovor: poraba je $3\,\mathrm{kWh}$, strošek $0{,}45$ €.

### Primer 2: odločitev, napetost v tolerančnem pasu

Algoritem merilnika iz razlage preveri za napetosti $241\,\mathrm{V}$, $207\,\mathrm{V}$ in $254\,\mathrm{V}$.

**Podatki:** pogoj $|U - 230| \le 23$; vhodi $U = 241$, $207$, $254\,\mathrm{V}$
**Iščemo:** izpis za vsak vhod in ali algoritem pravilno obravnava mejo

:::formula
Odločitev: če pogoj velja, veja »da«, sicer veja »ne«.
:::

**Rešitev:**

1. $U = 241$: $|241 - 230| = 11 \le 23$, veja »da«, izpis »v redu«.
2. $U = 207$: $|207 - 230| = 23 \le 23$, veja »da«, izpis »v redu«. To je mejni primer in pravilno spada v pas.
3. $U = 254$: $|254 - 230| = 24 > 23$, veja »ne«, izpis »zunaj tolerance«.
4. Program v Pythonu:

```python
U = float(input())
if abs(U - 230) <= 23:
    print("v redu")
else:
    print("zunaj tolerance")
```

Za vhode `241`, `207`, `254` izpiše `v redu`, `v redu`, `zunaj tolerance`.

5. Odgovor: izpisi so »v redu«, »v redu«, »zunaj tolerance«; meja $207\,\mathrm{V}$ je obravnavana pravilno, ker pogoj vsebuje $\le$.

### Primer 3 (težji, izpitna raven): zanka z mejnikom

Merilna postaja pošilja meritve temperature, ki so nenegativne. Konec niza označi negativno število (**mejnik**). Nariši diagram poteka algoritma, ki izpiše povprečje in največjo meritev. Poskrbi za primer, ko meritev ni. Sledi algoritmu za vhod $12$, $7$, $15$, $9$, $-1$.

**Podatki:** vhod $12$, $7$, $15$, $9$, $-1$ (mejnik $-1$); meritve $x \ge 0$
**Iščemo:** diagram poteka, sledilno tabelo, izpis

:::formula
Pred zanko: $\text{vsota} = 0$, $n = 0$, beri $x$. Zanka, dokler $x \ge 0$: prištej, povečaj $n$, posodobi največjo, beri $x$. Po zanki: če $n = 0$, »ni meritev«, sicer izpiši $\frac{\text{vsota}}{n}$ in največjo.
:::

**Rešitev:**

1. Diagram:

```
      ( začetek )
           |
   [ vsota=0, n=0 ]
           |
       / beri x /
           |
    +-> < x >= 0 ? > -ne-+
    |      | da          |
    | [vsota=vsota+x]    |
    | [n = n + 1    ]    |
    | [max posodobi ]    |
    |  / beri x /        |
    +------+             |
                         v
       < n = 0 ? > <-----+
      da |     | ne
         v     v
 /ni meritev/ /vsota/n, max/
```

2. Prvo meritev beremo pred zanko, ker je pogoj zanke odvisen od nje. Na koncu telesa beremo naslednjo.
3. Sledilna tabela (vrednosti po vsakem prehodu zanke):

- $x = 12$: vsota $12$, $n = 1$, največja $12$;
- $x = 7$: vsota $19$, $n = 2$, največja $12$;
- $x = 15$: vsota $34$, $n = 3$, največja $15$;
- $x = 9$: vsota $43$, $n = 4$, največja $15$;
- $x = -1$: pogoj ne velja, izhod iz zanke.

4. $n = 4 \neq 0$, zato izpiše povprečje $\frac{43}{4} = 10{,}75$ in največjo vrednost $15$.
5. Posebni primer: če je že prvi vhod $-1$, zanka se ne izvede, $n = 0$. Brez odločitve po zanki bi algoritem delil z nič.
6. Program, ki smo ga zagnali:

```python
vsota = 0
n = 0
najvecja = None
x = float(input())
while x >= 0:
    vsota = vsota + x
    n = n + 1
    if najvecja is None or x > najvecja:
        najvecja = x
    x = float(input())
if n == 0:
    print("ni meritev")
else:
    print(vsota / n, najvecja)
```

Za vhod `12 7 15 9 -1` (vsak v svoji vrstici) izpiše `10.75 15.0`, za vhod `-1` pa `ni meritev`.

7. Odgovor: povprečje je $10{,}75$, največja meritev $15$; pri praznem nizu algoritem izpiše »ni meritev«.

### Primer 4 – zdaj ti: Evklidov algoritem

Največji skupni delitelj dveh naravnih števil izračuna Evklidov algoritem: dokler $b \neq 0$, izračunaj ostanek $r$ pri deljenju $a$ z $b$, nato $a \leftarrow b$, $b \leftarrow r$. Ko je $b = 0$, je rezultat $a$. Sledi mu za $a = 252$, $b = 198$.

**Podatki:** $a = 252$, $b = 198$; zanka s pogojem $b \neq 0$
**Iščemo:** sledilno tabelo in največji skupni delitelj $D$

:::formula
$r = a \bmod b$, nato $a \leftarrow b$, $b \leftarrow r$; ustavi se pri $b = 0$, $D = a$
:::

**Rešitev:**

1. Prvi prehod: $252 = 1 \cdot 198 + 54$, torej $r = 54$; nova $a = 198$, $b = 54$.
2. Drugi prehod: $198 = 3 \cdot 54 + 36$, torej $r = 36$; nova $a = 54$, $b = 36$.
3. Nadaljuj sam, dokler $b$ ne postane $0$.

:::premisli
Kolikšen je $D$ in po koliko prehodih zanke se algoritem ustavi? Zakaj se gotovo ustavi?
---
Tretji prehod: $54 = 1 \cdot 36 + 18$, $r = 18$. Četrti: $36 = 2 \cdot 18 + 0$, $r = 0$. Po štirih prehodih je $b = 0$ in $D = 18$. Algoritem se ustavi, ker je ostanek vedno manjši od $b$, zato $b$ v vsakem prehodu strogo pade, naravna števila pa ne morejo padati v nedogled.
:::

## Pogoste napake

- **Romb z eno samo puščico.** Odločitev ima vedno dve izhodni poti, »da« in »ne«. Če ena manjka, diagram za nekatere vhode ne pove, kaj storiti; to krši določenost.
- **Pogoj zanke na napačnem mestu.** Kdor podatek prebere šele v telesu zanke, nato pa ga prišteje, ne da bi preveril pogoj, prišteje tudi mejnik. Pri vhodu iz Primera 3 bi dobil vsoto $42$ in $n = 5$.
- **Pozabljen posebni primer.** Povprečje praznega niza bi pomenilo deljenje z nič. Vsak algoritem preveri tudi za najmanjši mogoči vhod.
- **»Postopek, ki deluje za moje primere, je algoritem.«** Končnost mora veljati za *vsak* dovoljen vhod. Zanka, katere pogoj se nikoli ne spremeni, teče v nedogled.
- **Zamenjana $<$ in $\le$.** Mejni primeri (tu $207\,\mathrm{V}$) se pri napačni primerjavi uvrstijo napačno. Preizkusi vrednosti tik pod mejo, na meji in tik nad njo.

## Povzetek

- Algoritem: končno zaporedje natančno določenih, izvedljivih korakov z vhodom in izhodom, ki se za vsak dovoljen vhod ustavi.
- Zapisi: naravni jezik, psevdokoda, diagram poteka, program.
- Simboli: oval (začetek/konec), pravokotnik (obdelava), paralelogram (vhod/izhod), romb (odločitev z dvema izhodoma), puščice.
- Tri strukture: zaporedje, odločitev, ponavljanje (pogoj na začetku ali na koncu); po izreku Böhma in Jacopinija zadoščajo za vsak algoritem.
- Preverjanje: sledilna tabela za običajne, mejne in posebne vhode.

## Za izpit

Znati moraš povedati:
- definicijo algoritma in štiri zahtevane lastnosti;
- pomen simbolov diagrama poteka;
- tri osnovne strukture ter razliko med zanko s pogojem na začetku in na koncu;
- izrek Böhma in Jacopinija in kaj pomeni za programiranje;
- kako s sledilno tabelo preveriš algoritem in zakaj preizkusiš mejne primere.

### Naloga 1

Enačba $x^3 - x - 2 = 0$ ima ničlo na intervalu $[1, 2]$, ker je $f(1) = -2 < 0$ in $f(2) = 4 > 0$. **Bisekcija**: dokler je dolžina intervala vsaj $0{,}1$, izračunaj sredino $s$; če imata $f(a)$ in $f(s)$ različna predznaka (ali je $f(s) = 0$), postavi $b \leftarrow s$, sicer $a \leftarrow s$. Na koncu izpiši sredino intervala. (a) Opiši diagram poteka. (b) Sestavi sledilno tabelo za $a = 1$, $b = 2$. (c) Za koliko se lahko približek najbolj razlikuje od prave ničle?

**Rešitev:**

1. (a) Diagram: oval, prireditev $a = 1$, $b = 2$; romb zanke »$b - a \ge 0{,}1$?«; v telesu pravokotnik $s = \frac{a + b}{2}$ in romb »$f(a) \cdot f(s) \le 0$?« z vejama $b = s$ in $a = s$, ki se združita in vrneta na pogoj zanke; po izhodu paralelogram z izpisom $\frac{a + b}{2}$, oval. Odločitev je gnezdena v zanki.
2. (b) Prvi prehod: $s = 1{,}5$, $f(1{,}5) = 3{,}375 - 1{,}5 - 2 = -0{,}125 < 0$, isti predznak kot $f(1)$, zato $a = 1{,}5$.
3. Drugi: $s = 1{,}75$, $f(1{,}75) = 5{,}359375 - 1{,}75 - 2 = 1{,}609375 > 0$, zato $b = 1{,}75$.
4. Tretji: $s = 1{,}625$, $f(1{,}625) \approx 0{,}666 > 0$, zato $b = 1{,}625$.
5. Četrti: $s = 1{,}5625$, $f(1{,}5625) \approx 0{,}252 > 0$, zato $b = 1{,}5625$. Dolžina je $1{,}5625 - 1{,}5 = 0{,}0625 < 0{,}1$, zanka se konča.
6. Izpis: $\frac{1{,}5 + 1{,}5625}{2} = 1{,}53125$. Program v Pythonu (zagnan) da isto zaporedje sredin $1{,}5$; $1{,}75$; $1{,}625$; $1{,}5625$ in približek $1{,}53125$.
7. (c) Ničla leži v zadnjem intervalu, sredina je od vsake točke intervala oddaljena največ za polovico dolžine: $\frac{0{,}0625}{2} = 0{,}03125$.
8. Odgovor: po štirih prehodih je približek $1{,}53125$, napaka največ $0{,}03125$ (prava ničla je okoli $1{,}5214$).

### Naloga 2

Natančno navedi lastnosti algoritma. Nato utemelji, ali je naslednji postopek algoritem za vsako naravno število $x$: »Dokler $x \neq 1$: če je $x$ sod, $x \leftarrow \frac{x}{2}$, sicer $x \leftarrow 3x + 1$. Izpiši število korakov.«

**Rešitev:**

1. Lastnosti: končnost (ustavi se za vsak dovoljen vhod), določenost (vsak korak enoumen), vhod in izhod, izvedljivost (vsak korak je preprost račun).
2. Določenost in izvedljivost veljata: deljenje z $2$, množenje s $3$ in prištevanje $1$ so enoumni računi, pogoj sod ali lih je jasen.
3. Vhod je $x$, izhod število korakov.
4. Končnost: za $x = 6$ dobimo $6, 3, 10, 5, 16, 8, 4, 2, 1$, torej $8$ korakov. Zagnani program da za $x = 7$ rezultat $16$ in za $x = 27$ rezultat $111$.
5. Da se postopek ustavi za *vsako* naravno število, pa ni dokazano. To je znana odprta Collatzova domneva; računalniško so jo preverili za zelo velika števila, dokaza ni.
6. Sklep: za vsak vhod, ki ga preizkusimo, se postopek ustavi, zato je algoritem za te vhode. Kot algoritem za vse naravne $x$ ga lahko štejemo šele, ko bo končnost dokazana. Primer pokaže, da končnost ni samoumevna in da je preizkus nekaj primerov ne dokaže.

## Drugače: Z analogijo

Algoritem je kot recept za kuharja, ki ne zna kuhati, a natančno bere. »Sol po okusu« ni algoritem, ker kuhar ne ve, koliko je to. »Dodaj $5\,\mathrm{g}$ soli« je. »Mešaj, dokler se omaka ne zgosti« je zanka s pogojem; »če je testo prelepljivo, dodaj žlico moke« je odločitev. Diagram poteka je recept, narisan kot zemljevid: vidiš, kje se pot razcepi in kje se vrne nazaj.

Navigacija v avtu dela enako. Na vsakem križišču preveri pogoj (»sem že na cilju?«, »je cesta zaprta?«) in izbere vejo. Če cilj ni dosegljiv, mora to povedati, ne pa krožiti v nedogled; to je končnost.

## Drugače: Uporaba v stroki

**Krmiljenje naprav.** Pred programiranjem mikrokrmilnika ali krmilnika PLC inženir postopek pogosto nariše kot diagram poteka ali stanj: »beri senzor, če je temperatura nad mejo, vklopi ventilator, počakaj, ponovi«. Diagram pregleda sodelavec, ki programskega jezika ne pozna, na primer tehnolog.

**Merilni sistemi.** Programi za zajem podatkov (na primer v laboratorijskih okoljih z grafičnim programiranjem) so dobesedno narisani diagrami: bloki za branje, obdelavo in odločitve, povezani z žicami. Zanka z mejnikom ali s časovnim pogojem je osnova vsakega zajema.

**Dokumentacija in standardi.** Pri varnostno pomembnih sistemih (medicinske naprave, avtomobilska elektronika) mora biti vsaka odločitev v programu dokumentirana in preizkušena za obe veji. Diagram poteka pokaže, koliko poti skozi program obstaja in koliko testov je treba.

## Drugače: Bolj natančno

**Število korakov.** Algoritma za isti problem se lahko zelo razlikujeta v hitrosti. Iskanje največjega skupnega delitelja s preizkušanjem vseh števil od $\min(a, b)$ navzdol potrebuje za $252$ in $198$ kar $181$ preizkusov (od $198$ navzdol do $18$), Evklidov algoritem pa le $4$ prehode. Število prehodov Evklidovega algoritma raste sorazmerno s številom števk, ne z velikostjo števil.

**Meje algoritmov.** Alan Turing je leta 1936 dokazal, da ne obstaja algoritem, ki bi za vsak program in vhod odločil, ali se program ustavi (problem ustavitve). Zato končnosti ne moremo vedno preveriti samodejno; pri Collatzovem postopku je niti ročno še ne znamo dokazati.

**Pomožne spremenljivke.** Izrek Böhma in Jacopinija zahteva, da smemo uvesti pomožne spremenljivke. Diagram s skoki iz sredine ene zanke v drugo prevedemo v strukturirano obliko tako, da uvedemo zastavico (na primer `konec = True`) in jo preverimo v pogojih zank.

## Preveri se

? Kateri element ne sodi med simbole diagrama poteka?
- romb
~ Romb je odločitev z dvema izhodoma.
- paralelogram
~ Paralelogram pomeni vhod ali izhod podatkov.
+ krog z napisom »po občutku«
- zaobljen pravokotnik
~ Ta označi začetek ali konec.
> Korak »po občutku« krši določenost; vsak korak algoritma mora biti enoumen.

? Algoritem: $s = 0$; za $k$ od $1$ do $4$: $s \leftarrow s + k^2$; izpiši $s$. Kaj izpiše?
- $10$
~ To je vsota $1 + 2 + 3 + 4$, brez kvadriranja.
- $16$
~ To je le zadnji člen $4^2$, ne vsota.
+ $30$
- $100$
~ To je kvadrat vsote $(1 + 2 + 3 + 4)^2$.
> $1 + 4 + 9 + 16 = 30$.

? Kaj se zgodi, če v Primeru 3 izpustimo zadnji korak telesa zanke »beri $x$«?
- Algoritem izpiše povprečje vseh meritev.
~ Brez novega branja se $x$ ne spremeni, zato zanka ne gre naprej po nizu.
+ Zanka se nikoli ne konča, ker se pogoj $x \ge 0$ ne spremeni.
- Algoritem takoj izpiše »ni meritev«.
~ Prvi $x = 12$ izpolni pogoj, zato zanka začne in $n$ ni nič.
> Telo zanke mora spreminjati količino v pogoju, sicer je zanka neskončna in algoritem ni končen.

? Sledilna tabela Evklidovega algoritma za $a = 84$, $b = 36$: (1) $r = 12$, $a = 36$, $b = 12$; (2) $r = 0$, $a = 12$, $b = 0$; (3) izpis $D = 0$. Kateri korak je napačen?
- korak 1, ker je $84 \bmod 36 = 48$
~ $84 = 2 \cdot 36 + 12$, ostanek je $12$, korak 1 je pravilen.
- korak 2, ker bi se moral algoritem ustaviti že prej
~ Pri $b = 12 \neq 0$ zanka še teče; korak 2 je pravilen.
+ korak 3, ker je rezultat $a = 12$, ne $b$
> Ko je $b = 0$, je največji skupni delitelj v $a$: $D = 12$.

? Termostat v rastlinjaku vsako minuto izmeri temperaturo. Če je pod $18\,°\mathrm{C}$, vklopi grelec, sicer ga izklopi. Katera struktura opisuje to delovanje?
- samo zaporedje
~ Zaporedje ne izbira med dvema možnostma in se ne ponavlja.
- samo odločitev
~ Odločitev bi se izvedla le enkrat; termostat pa meri vsako minuto.
+ zanka, v kateri je odločitev
- dve zaporedni zanki
~ Ponavljanje je eno; v njem je izbira med vklopom in izklopom.
> Ponavljanje meritve vsako minuto je zanka, izbira vklopa ali izklopa je odločitev znotraj nje.

:::simboli
P | moč grelnika | | W
t | čas delovanja | | h
E | porabljena energija | E = \frac{P \cdot t}{1000} | kWh
U | izmerjena napetost | | V
n | število meritev | | –
r | ostanek pri deljenju | r = a \bmod b | –
a, b | števili v Evklidovem algoritmu
D | največji skupni delitelj
s | sredina intervala | s = \frac{a + b}{2}
x | meritev (vhodni podatek) | | | negativna vrednost je mejnik
k | števec zanke | | –
:::
