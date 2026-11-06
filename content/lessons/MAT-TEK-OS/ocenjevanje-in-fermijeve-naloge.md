---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tina stoji v vrsti pred blagajno. V košarici ima sedem izdelkov, v denarnici natanko $20$ €, kartice pa nima. Pred njo sta še dva kupca, kalkulatorja ni pri roki. Ali naj kaj vrne na polico?

Natančna vsota ji ne pomaga, ker je ne more izračunati dovolj hitro. Potrebuje **oceno**: hiter račun z okroglimi števili, ki zanesljivo pove »dovolj« ali »premalo«.

Ocenjevanje potrebuješ tudi na tekmovanjih. Pri nalogah tipa »Kateri odgovor je najbližji?« natančen račun vzame preveč časa, ocena pa pride do odgovora v pol minute. Za vprašanje, koliko denarja vsi Slovenci na leto porabijo za kruh, pa nihče nima podatka v glavi. Takim vprašanjem rečemo **Fermijeve naloge**, po fiziku Enricu Fermiju, ki je znal take ocene sestaviti iz nekaj preprostih predpostavk.

## Razlaga

### Tinin račun

Cene v Tinini košarici:

| Izdelek | Cena | Navzgor na pol evra |
|---|---|---|
| mleko (2 kosa) | $1{,}19$ € za kos | $1{,}50$ € za kos |
| kruh | $2{,}35$ € | $2{,}50$ € |
| sir | $4{,}79$ € | $5{,}00$ € |
| jabolka | $2{,}89$ € | $3{,}00$ € |
| kava | $3{,}49$ € | $3{,}50$ € |
| testenine | $1{,}45$ € | $1{,}50$ € |

Tina najprej poskusi grobo in vsako ceno zaokroži navzgor na cel evro: $2 + 2 + 3 + 5 + 3 + 4 + 2 = 21$. Dobi $21$ €, kar je več kot $20$ €. Odgovora pa še ne pozna: vsako ceno je povečala, zato je prava vsota lahko manjša.

Zato zaokroži bolj fino, navzgor na pol evra: $1{,}5 + 1{,}5 + 2{,}5 + 5 + 3 + 3{,}5 + 1{,}5 = 18{,}5$. Vsaka cena je manjša ali enaka svojemu zaokroženemu znesku. Prava vsota je zato največ $18{,}5$ €, in denarja je **zagotovo dovolj**. Natančna vsota je $17{,}35$ €.

Iz Tininega računa izluščimo tri pravila.

**1. Zaokrožuj v smer, ki te ščiti.** Če vse zaokrožiš navzgor, dobiš **zgornjo mejo**: prava vrednost ni večja od nje. Če vse zaokrožiš navzdol, dobiš **spodnjo mejo**. Pri vprašanju »ali je dovolj« potrebuješ zgornjo mejo. Če je ta pod zneskom v denarnici, si varen.

**2. Natančnost izberi glede na vprašanje.** Groba ocena $21$ € je bila preblizu meje $20$ €, zato ni odločila. Ko je ocena blizu meje, zaokroži bolj fino.

**3. Računaj z eno ali dvema veljavnima števkama.** **Veljavne števke** so števke od prve neničelne naprej. Število $0{,}49$ ima dve veljavni števki, $397$ tri. Ko ju zaokrožiš na eno veljavno števko, na $0{,}5$ in $400$, računaš na pamet.

:::premisli
Vrečka orehov z maso $0{,}24$ kg stane $3{,}89$ €. Ali kilogram orehov stane več ali manj kot $3{,}89$ €, in približno kolikokrat? Napovej, šele nato oceni ceno.
---
Več, ker je $0{,}24$ kg manj kot kilogram, in sicer približno 4-krat, ker je to skoraj četrt kilograma. Ocena: $4 : 0{,}25 = 16$ € za kilogram. Deljenje s številom, manjšim od 1, rezultat poveča.
:::

### Red velikosti

Pri tekmovalnih nalogah s ponujenimi odgovori so ti pogosto narazen za faktor $10$, na primer $20$, $200$, $2000$. Takrat zadošča ugotoviti **red velikosti**: ali je rezultat reda desetic, stotic ali tisočic.

Red velikosti najlepše vidiš v **znanstvenem zapisu** $a \cdot 10^n$, kjer je $1 \le a < 10$ in je $n$ celo število. Tako je $230\,000\,000 = 2{,}3 \cdot 10^8$ in $3500 = 3{,}5 \cdot 10^3$. Potenca $10^n$ pove red velikosti, število $a$ pa natančnejšo vrednost.

Pri množenju se eksponenti seštejejo: $10^3 \cdot 10^5 = 10^8$. V simulaciji spodaj »Red velikosti in znanstveni zapis« vpiši nekaj velikih števil in opazuj, kako se ob množenju z $10$ decimalna vejica premakne za eno mesto, eksponent pa zraste za $1$.

### Fermijeva naloga v štirih korakih

Isti način razmišljanja razširimo na vprašanja brez podatkov:

1. **Razbij** vprašanje na količine, ki jih znaš oceniti: koliko ljudi, kako pogosto, koliko stane ena stvar.
2. **Oceni** vsako količino z okroglim številom in zapiši predpostavko.
3. **Zmnoži ali deli**. Potence števila $10$ računaj posebej, števila pred njimi posebej.
4. **Preveri enoto in smisel.** Rezultat izrazi v razumni enoti in ga zaokroži na eno veljavno števko.

Rezultat je redko točen, a skoraj vedno pravega reda velikosti, čeprav je vsaka posamezna ocena malo zgrešena. Zakaj, odkrij sam.

:::premisli
V Fermijevi verigi je ena ocena dvakrat prevelika, druga dvakrat premajhna. Kaj se zgodi z rezultatom? Kaj pa, če sta obe dvakrat preveliki?
---
V prvem primeru se napaki izničita, ker je $2 \cdot \dfrac{1}{2} = 1$. V drugem je rezultat $4$-krat prevelik, kar je še vedno blizu pravega reda velikosti. Ena sama ocena, zgrešena za faktor $10$, pa rezultat premakne za cel red velikosti. Zato pazi predvsem na velike zgrešitve.
:::

### Razumne enote

Isti podatek je lahko jasen ali nerazumljiv, odvisno od enote. Zapis $230\,000\,000$ g je pravilen, a si ga nihče ne predstavlja. Zapis $230$ t pa takoj pove: to je tovor približno dvanajstih tovornjakov, ki nosijo po $20$ t. Izberi enoto, v kateri je število med približno $1$ in $1000$.

| Količina | Nerodno | Razumno |
|---|---|---|
| masa kovancev | $230\,000\,000$ g | $230$ t |
| pot iz Ljubljane do morja | $110\,000\,000$ mm | $110$ km |
| cena kilograma sira | $2014$ centov | $20{,}14$ € |

Pretvorbe, ki jih boš rabil: $1\,\text{t} = 1000\,\text{kg}$, $1\,\text{kg} = 1000\,\text{g}$, $1\,\text{km} = 1000\,\text{m}$ in $1$ € $= 100$ centov. V simulaciji spodaj »Pretvarjanje enot« preveri, kolikokrat se število poveča, ko preideš na manjšo enoto.

## Rešeni primeri

### Primer 1 (lažji): cena kilograma

V trgovini stane kos sira z maso $0{,}49$ kg $9{,}87$ €. Približno koliko stane kilogram tega sira?

**Podatki:** masa $0{,}49\,\text{kg}$, cena $9{,}87$ €
**Iščemo:** približno ceno enega kilograma

:::formula
cena kilograma $= \dfrac{\text{cena}}{\text{masa}}$; vsako število zaokroži na eno veljavno števko
:::

**Rešitev:**

1. Zaokrožimo: $9{,}87$ na $10$ in $0{,}49$ na $0{,}5$. Oba popravka sta majhna.
2. $10 : 0{,}5 = 20$, saj je pol kilograma polovica, cel kilogram pa stane dvakrat toliko.
3. Enota: evri za kilogram.
4. Odgovor: kilogram sira stane približno $20$ € (natančno $20{,}14$ €).

### Primer 2: kateri odgovor je najbližji

Kateri od števil $1$, $10$, $100$, $1000$ je najbližji vrednosti izraza $\dfrac{19{,}8 \cdot 0{,}51}{0{,}099}$?

**Podatki:** izraz $\dfrac{19{,}8 \cdot 0{,}51}{0{,}099}$; ponujeni odgovori $1$, $10$, $100$, $1000$
**Iščemo:** najbližji ponujeni odgovor

:::formula
vsako število zaokroži na eno veljavno števko; deliti z $0{,}1$ pomeni množiti z $10$
:::

**Rešitev:**

1. Zaokrožimo: $19{,}8$ na $20$; $0{,}51$ na $0{,}5$ in $0{,}099$ na $0{,}1$.
2. Števec: $20 \cdot 0{,}5 = 10$.
3. Deljenje z $0{,}1$ je množenje z $10$: $10 \cdot 10 = 100$.
4. Vsako število smo spremenili le za nekaj odstotkov, ponujeni odgovori pa so narazen za faktor $10$. Izbira je zato varna.
5. Odgovor: najbližji je $100$. Natančna vrednost je $102$.

### Primer 3 (težji): milijon evrov v centih

Banka bi rada milijon evrov prepeljala v kovancih po 1 cent. En kovanec tehta $2{,}3$ g, tovornjak pa sme naložiti največ $20$ t. Koliko tehtajo vsi kovanci in koliko tovornjakov potrebujemo?

**Podatki:** znesek $1\,000\,000$ €; $1$ € $= 100$ centov; masa kovanca $2{,}3\,\text{g}$; nosilnost tovornjaka $20\,\text{t}$
**Iščemo:** maso vseh kovancev in število tovornjakov

:::formula
število kovancev = znesek v centih

masa = število kovancev $\cdot$ masa kovanca

$1\,\text{t} = 10^6\,\text{g}$
:::

**Rešitev:**

1. Število kovancev: $10^6 \cdot 100 = 10^8$, ker ima vsak evro 100 centov.
2. Masa v gramih: $10^8 \cdot 2{,}3\,\text{g} = 2{,}3 \cdot 10^8\,\text{g}$.
3. Pretvorba: $1\,\text{t} = 1000\,\text{kg} = 10^6\,\text{g}$. Zato je $2{,}3 \cdot 10^8\,\text{g} = 2{,}3 \cdot 10^2\,\text{t} = 230\,\text{t}$.
4. Tovornjaki: $230 : 20 = 11{,}5$. Polovice tovornjaka ni, ostanek tovora pa mora tudi nekam, zato zaokrožimo **navzgor**.
5. Odgovor: kovanci tehtajo približno $230$ t, potrebujemo $12$ tovornjakov.

### Primer 4 (zdaj ti): kruh za vso Slovenijo

Koliko evrov na leto porabijo vsa slovenska gospodinjstva za kruh? Uporabi te predpostavke: v Sloveniji živi približno $2 \cdot 10^6$ ljudi, v gospodinjstvu povprečno $2$ osebi, gospodinjstvo kupi en hleb na $2$ dni, hleb stane $2$ €, leto ima $365$ dni.

**Podatki:** prebivalcev $2 \cdot 10^6$; $2$ osebi na gospodinjstvo; $1$ hleb na $2$ dni; cena hleba $2$ €; $365$ dni na leto
**Iščemo:** letno porabo za kruh v evrih

:::formula
poraba = število gospodinjstev $\cdot$ poraba gospodinjstva na dan $\cdot$ število dni
:::

**Rešitev:**

1. Gospodinjstev je $2 \cdot 10^6 : 2 = 10^6$.
2. Eno gospodinjstvo na dan kupi pol hleba po $2$ €, torej porabi $1$ € na dan.
3. Vsa gospodinjstva skupaj porabijo $10^6$ € na dan.
4. Izračunaj sam porabo na leto, jo zaokroži na eno veljavno števko in zapiši v razumni enoti.

:::premisli
Koliko evrov na leto je to?
---
$365 \cdot 10^6$ € $= 3{,}65 \cdot 10^8$ €, zaokroženo $4 \cdot 10^8$ €. V razumni enoti: približno $400$ milijonov evrov na leto.
:::

## Pogoste napake

- **Lažna natančnost.** Kdor Fermijev rezultat zapiše kot $365\,000\,000$ €, se dela, da ga pozna na evro natančno. Predpostavke so le približne, zato zapiši $4 \cdot 10^8$ € ali »približno 400 milijonov evrov«.
- **Meja v napačni smeri.** Če pri vprašanju »ali je dovolj« vse cene zaokrožiš navzdol, dobiš spodnjo mejo. Ta ne pove ničesar o tem, ali je denarja dovolj, saj je prava vsota lahko večja. Za »dovolj« potrebuješ zgornjo mejo.
- **»Deljenje vedno zmanjša.«** Kdor misli tako, oceni $10 : 0{,}5$ kot $5$. Deljenje s številom, manjšim od $1$, rezultat poveča: $10 : 0{,}5 = 20$, in deliti z $0{,}1$ pomeni množiti z $10$.
- **Pozabljena pretvorba enot.** Če pozabiš, da je evro 100 centov ali da je kilogram 1000 gramov, zgrešiš red velikosti za faktor $100$ ali $1000$. Enote piši ob vsakem številu.
- **Zaokroževanje po pravilu tam, kjer ni smiselno.** $11{,}5$ tovornjaka ali $4{,}4$ plastenke ne zaokrožiš kar po pravilu. Ko mora vse priti zraven, zaokrožiš navzgor.

## Povzetek

- Ocena je hiter račun z zaokroženimi števili, navadno z eno ali dvema veljavnima števkama.
- Vse navzgor da zgornjo mejo, vse navzdol spodnjo. Za »ali je dovolj« rabiš zgornjo mejo.
- Red velikosti pove potenca v znanstvenem zapisu $a \cdot 10^n$, $1 \le a < 10$. Pri izbiri med odgovori, ki so narazen za faktor 10, zadošča.
- Fermijeva naloga: razbij, oceni vsak del, zmnoži, preveri enoto in smisel. Napake se delno izničijo.
- Rezultat zapiši v razumni enoti in z eno veljavno števko. Pri štetju stvari, ki morajo vse priti zraven, zaokroži navzgor.

## Drugače: Z analogijo

Predstavljaj si stolpnico, v kateri vsako nadstropje pomeni en red velikosti. V pritličju so enice, v prvem nadstropju desetice, v drugem stotice, v osmem stotine milijonov. Ocena ne vpraša, v katerem stanovanju živi število, ampak v katerem nadstropju.

Množenje z $10^n$ je vožnja z dvigalom za $n$ nadstropij navzgor. Ko v Fermijevi nalogi $10^6$ evrov na dan pomnožiš s $365 = 3{,}65 \cdot 10^2$ dnevi, se pelješ $6 + 2 = 8$ nadstropij visoko.

Napaka za faktor $2$ te pusti v istem nadstropju ali v sosednjem stanovanju. Napaka za faktor $10$ pa te odpelje v napačno nadstropje. Zato ocena dopušča majhne netočnosti, ne dopušča pa pozabljene pretvorbe centov v evre.

## Drugače: Bolj natančno

**Meje namesto ene številke.** Če vsako ceno zaokrožiš navzgor in navzdol, dobiš dve vsoti, med katerima zagotovo leži prava. Pri Tini je spodnja meja (vse navzdol na pol evra) $1 + 1 + 2 + 4{,}5 + 2{,}5 + 3 + 1 = 15$ €, zgornja $18{,}5$ €. Prava vsota $17{,}35$ € res leži vmes.

**Kako se napake širijo.** Pri množenju se relativne napake približno seštejejo. Če so trije faktorji vsak lahko za $20\,\%$ preveliki, je produkt lahko prevelik za faktor $1{,}2^3 \approx 1{,}7$. Če so vsi za $20\,\%$ premajhni, je produkt približno $0{,}5$-krat prava vrednost. V praksi se napake delno izničijo in rezultat je bližje.

**Sredina na logaritemski lestvici.** Če veš le, da je odgovor med $10$ in $1000$, najboljša ocena ni $505$, ampak $100$. Od $10$ do $100$ je faktor $10$ in od $100$ do $1000$ tudi. Tako je tvoja ocena največ za faktor $10$ zgrešena v obe smeri.

**Veljavne števke.** Rezultat ne more biti natančnejši od najslabšega podatka. Če je predpostavka »$2$ osebi na gospodinjstvo« zaokrožena na eno veljavno števko, ima tudi končni rezultat smiselno le eno.

## Preveri se

? Katera ocena izstopa, ker ni smiselna?
- Srednje veliko jabolko tehta približno $200$ g.
~ Število $200$ se morda zdi veliko, a srednje jabolko res tehta okoli $150$ do $250$ g.
- Hleb kruha stane približno $2$ €.
~ To je običajna cena hleba, zato ocena ne izstopa.
+ Kilogram jabolk stane približno $200$ €.
- Liter mleka stane približno $1$ €.
~ Mleko res stane okoli evra za liter, ocena je smiselna.
> Kilogram jabolk stane nekaj evrov, ne nekaj sto. Ocena je zgrešena za približno dva reda velikosti.

? Kateri od števil $20$, $200$, $2000$, $20\,000$ je najbližji vrednosti izraza $\dfrac{0{,}52 \cdot 397}{0{,}098}$?
- $20$
~ Deljenje z $0{,}1$ si naredil kot deljenje z $10$. Deljenje s številom, manjšim od 1, rezultat poveča.
- $200$
~ Izračunal si le števec $0{,}5 \cdot 400 = 200$ in pozabil deliti z $0{,}098$.
+ $2000$
- $20\,000$
~ Število $0{,}098$ si zaokrožil na $0{,}01$ namesto na $0{,}1$. Prva neničelna števka je na mestu desetink.
> $0{,}52 \cdot 397 \approx 0{,}5 \cdot 400 = 200$, nato $200 : 0{,}1 = 2000$. Natančna vrednost je približno $2107$.

? Tina vse cene v košarici zaokroži **navzdol** na pol evra in dobi $15$ €. V denarnici ima $20$ €. Kaj lahko zanesljivo sklepa?
- Denarja je zagotovo dovolj.
~ Navzdol zaokrožena vsota je spodnja meja. Prava vsota je večja, lahko tudi več kot $20$ €.
+ Prava vsota je vsaj $15$ €, ali je denarja dovolj, pa še ne ve.
- Denarja je zagotovo premalo.
~ Za ta sklep bi morala spodnja meja preseči $20$ €. $15$ € je pod mejo.
> Zaokroževanje navzdol da spodnjo mejo. Za odločitev »dovolj« Tina potrebuje zgornjo mejo, torej vse cene navzgor.

? Luka oceni, koliko tehta $1000$ € v kovancih po 10 centov, če en kovanec tehta približno $4$ g. Korak 1: $1000$ € je $10\,000$ kovancev. Korak 2: $10\,000 \cdot 4\,\text{g} = 40\,000\,\text{g}$. Korak 3: $40\,000\,\text{g} = 400\,\text{kg}$. Kateri korak je napačen?
- Korak 1
~ $1000$ € je $100\,000$ centov, kar je $10\,000$ kovancev po 10 centov. Korak je pravilen.
- Korak 2
~ $10\,000 \cdot 4 = 40\,000$, korak je pravilen.
+ Korak 3
- Noben, rezultat je pravilen.
~ $400$ kg bi tehtalo $100\,000$ takih kovancev. Preveri pretvorbo gramov v kilograme.
> $1\,\text{kg} = 1000\,\text{g}$, zato je $40\,000\,\text{g} = 40\,\text{kg}$. Luka je delil s $100$ namesto s $1000$.

? Za razredno zabavo kupuješ sok v plastenkah po $1{,}5$ l. Vsak od $22$ učencev bo popil $0{,}3$ l. Koliko plastenk kupiš?
- $4$
~ $6{,}6 : 1{,}5 = 4{,}4$ si zaokrožil po pravilu navzdol. S štirimi plastenkami ($6$ l) bi soka zmanjkalo.
+ $5$
- $4{,}4$
~ Plastenke ne kupiš po delih. Število kosov mora biti celo.
- $7$
~ To je število litrov ($6{,}6$ l, zaokroženo), ne plastenk. Ena plastenka ima $1{,}5$ l.
> Potrebuješ $22 \cdot 0{,}3 = 6{,}6$ l, kar je $6{,}6 : 1{,}5 = 4{,}4$ plastenke. Ker mora soka biti dovolj za vse, zaokrožiš navzgor na $5$.

:::simboli
a | število pred potenco v znanstvenem zapisu | | | $1 \le a < 10$
n | eksponent potence števila 10 | | | celo število; $10^n$ pove red velikosti
\text{cena} | cena kosa sira | | € | cena kilograma je $\dfrac{\text{cena}}{\text{masa}}$
\text{masa} | masa kosa sira | | kg
:::
