---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na nalepki na zadnji strani mikrovalovke piše $2450\,\mathrm{MHz}$. Vzemi ven vrtljivi krožnik, vanjo položi ploščo čokolade in jo za kakih $20\,\mathrm{s}$ vklopi. Čokolada se ne zmehča povsod enako, ampak v pegah, ki so med seboj razmaknjene približno $6\,\mathrm{cm}$.

Iz teh dveh števil, enega z nalepke in enega z ravnila, lahko izračunaš hitrost svetlobe. Potrebuješ samo tri ideje: kaj je nihanje, kako nihanje potuje kot valovanje in zakaj se valovanje v zaprti škatli ustavi v mirujoč vzorec.

Na tekmovanjih so naloge z nihali, vzmetmi in strunami stalnica. Večino jih rešiš z dvema formulama za nihajni čas, z zvezo med hitrostjo, valovno dolžino in frekvenco ter z enim pogojem za stoječe valovanje. Zvijača je skoraj vedno v tem, da prepoznaš, kaj niha in kaj ga vrača v ravnovesje.

## Razlaga

**1. Nihaj, nihajni čas, frekvenca.** Zajemalka, obešena na kavelj, se po sunku ziblje sem in tja okoli **ravnovesne lege**, kjer bi sicer mirovala. En **nihaj** je pot od ene skrajne lege do druge in nazaj. Čas enega nihaja je **nihajni čas** $t_0$. **Frekvenca** $\nu$ pove, koliko nihajev se zgodi v eni sekundi:

$$\nu = \frac{1}{t_0}$$

Enota frekvence je hertz, $1\,\mathrm{Hz} = 1\,\mathrm{s^{-1}}$. Največji odmik od ravnovesne lege je **amplituda** $A$.

*Preizkus:* metronom na kuhinjski polici naredi $50$ nihajev v $40\,\mathrm{s}$. Nihajni čas je $0{,}8\,\mathrm{s}$, frekvenca $1{,}25\,\mathrm{Hz}$.

**2. Sila, ki vrača.** Utež na vzmeti odmakneš za $x$. Vzmet jo vleče nazaj s silo

$$F = -k x$$

Tu je $k$ **koeficient vzmeti** v $\mathrm{N/m}$: koliko newtonov potrebuješ za raztezek $1\,\mathrm{m}$. Minus pove, da sila kaže proti ravnovesni legi. Kadar je vračajoča sila sorazmerna z odmikom, je nihanje **harmonično**. Zato nihajni čas ni odvisen od amplitude: dvakrat večji odmik da dvakrat večjo silo in utež dvakrat daljšo pot opravi v enakem času.

*Preizkus:* vzmet s $k = 200\,\mathrm{N/m}$ odmakneš za $3\,\mathrm{cm}$. Vleče s silo $6\,\mathrm{N}$ proti ravnovesni legi.

**3. Nihanje je senca kroženja.** Kroglica enakomerno kroži po krožnici s polmerom $A$. Njena senca na steni se giblje sem in tja po daljici dolžine $2A$, natanko kot utež na vzmeti. Kot, ki ga kroglica opiše v enem obratu, je $2\pi$, zato vpeljemo **krožno frekvenco**

$$\omega = \frac{2\pi}{t_0}$$

Iz lekcije o kroženju veš, da je pospešek kroglice $\frac{4\pi^2 A}{t_0^2}$, kar je ravno $\omega^2 A$, in kaže proti središču. Senca ima pospešek, ki je projekcija tega pospeška na vodoravno os. Odmik sence $x$ je projekcija polmera $A$, zato se pospešek skrči v enakem razmerju: $a = -\omega^2 x$, z minusom, ker kaže proti središču. Newtonov zakon za utež pa da $a = \frac{F}{m} = -\frac{k}{m}x$. Obe zvezi se ujemata, če je $\omega^2 = \frac{k}{m}$. Od tod:

$$t_0 = 2\pi\sqrt{\frac{m}{k}}$$

Iz kroženja dobiš brez dela tudi največjo hitrost $v_0 = \omega A$ (to je hitrost kroglice, $\frac{2\pi A}{t_0}$; senca jo doseže v ravnovesni legi) in največji pospešek $a_0 = \omega^2 A$ (v skrajni legi).

*Preizkus:* utež $0{,}20\,\mathrm{kg}$ na vzmeti z $k = 20\,\mathrm{N/m}$ niha z nihajnim časom $0{,}63\,\mathrm{s}$.

:::premisli
Na isto vzmet obesiš štirikrat težjo utež in jo odmakneš dvakrat dlje kot prej. Kolikokrat se spremeni nihajni čas?
---
Podvoji se. Masa je pod korenom: $\sqrt{4} = 2$. Amplituda nanj ne vpliva, ker večji odmik pomeni tudi večjo vračajočo silo.
:::

**4. Nihalo.** Majhna utež visi na vrvici dolžine $l$. Ko jo odmakneš za kot $\varphi$, jo vzdolž tira vleče komponenta teže $mg\sin\varphi$. Pri majhnih kotih (do približno $10°$) je $\sin\varphi \approx \frac{x}{l}$, kjer je $x$ odmik vzdolž loka. Vračajoča sila je tedaj $-\frac{mg}{l}x$: nihalo se obnaša kot vzmet s $k = \frac{mg}{l}$. Ko to vstaviš v formulo za vzmet, se masa okrajša:

$$t_0 = 2\pi\sqrt{\frac{l}{g}}$$

*Preizkus:* nihalo skrajšaš na četrtino dolžine. Nihajni čas se razpolovi.

| | vzmet | nihalo |
|---|---|---|
| sila | $-kx$ | $-\frac{mg}{l}x$ |
| $t_0$ | $2\pi\sqrt{m/k}$ | $2\pi\sqrt{l/g}$ |
| vpliv mase | da | ne |

**5. Valovanje.** Ko z žlico pocukaš gladino juhe, se motnja razširi po loncu. Delci juhe ne potujejo do roba, le nihajo na mestu; potuje oblika in z njo energija. To je **valovanje**. **Valovna dolžina** $\lambda$ je razdalja med sosednjima hriboma. V enem nihajnem času se val premakne natanko za $\lambda$, zato je **hitrost valovanja**

$$c = \lambda \nu$$

Pri **prečnem** valovanju delci nihajo pravokotno na smer širjenja (vrv, struna), pri **vzdolžnem** v smeri širjenja (zvok v zraku).

*Preizkus:* valovi na juhi imajo $\nu = 4\,\mathrm{Hz}$ in $\lambda = 3\,\mathrm{cm}$. Potujejo s hitrostjo $12\,\mathrm{cm/s}$.

**6. Stoječe valovanje.** Val, ki pride do vpetega konca strune, se odbije in vrne. Po struni tedaj potujeta dva enaka vala v nasprotnih smereh. Njuna vsota ne potuje: nekatere točke strune ves čas mirujejo, to so **vozli**; vmes so **hrbti**, kjer struna niha najbolj. Sosednja vozla sta razmaknjena za $\frac{\lambda}{2}$, prav tako sosednja hrbta.

:::risba graf
opis: Struna dolžine 1,2 m, vpeta na obeh koncih, niha v tretjem lastnem nihanju. Vodoravna os je lega od 0 do 1,2 m, navpična odmik. Polna in črtkana krivulja sta skrajni legi strune. Vozli so pri 0; 0,4; 0,8 in 1,2 m. Puščica od 0 do 0,4 m označuje polovico valovne dolžine, puščica od 0 do 0,8 m valovno dolžino 0,8 m.
x: 0 .. 1,2 | 0,2 | x [m]
y: -1,8 .. 1,8 | 1 | odmik
oznake: ne
f: sin(pi*x/0.4) | modra
f: -sin(pi*x/0.4) | modra črtkano
točka: 0; 0 | vozel | pod
točka: 0,4; 0 | vozel | pod
točka: 0,8; 0 | vozel | pod
točka: 1,2; 0 | vozel | pod
puščica: 0; 1,25 -> 0,4; 1,25 | λ/2 | nad | oranžna
puščica: 0; -1,45 -> 0,8; -1,45 | λ = 0,8 m | pod | oranžna
podnapis: Tretje lastno nihanje strune: štirje vozli, trije hrbti
:::

Struna, vpeta na obeh koncih, ima na koncih vozla. Zato mora na njeno dolžino $L$ iti celo število polovic valovne dolžine: $L = n\frac{\lambda}{2}$, kjer je $n = 1, 2, 3, \ldots$ Od tod sledita valovna dolžina in frekvenca $n$-tega **lastnega nihanja**:

$$\lambda_n = \frac{2L}{n}$$

$$\nu_n = \frac{n c}{2L}$$

Pri $n = 1$ je to **osnovno nihanje** (osnovni ton), višja so njegovi večkratniki.

V simulaciji spodaj, »Stoječe valovanje na struni«, nastavi harmonik $n = 3$, nato spreminjaj dolžino strune. Opazuj, da so vozli vedno štirje, valovna dolžina je vedno $\frac{2}{3}$ dolžine strune, frekvenca pa raste, ko struno krajšaš. (Simulacija frekvenco piše s $f$, mi z $\nu$.)

*Preizkus:* pri drugem lastnem nihanju so trije vozli, eden je točno na sredini strune.

:::premisli
Kitaristka struno bolj napne, zato po njej valovanje potuje hitreje. Kaj se zgodi z valovno dolžino osnovnega nihanja in kaj s frekvenco?
---
Valovna dolžina ostane $2L$, ker jo določata le vpeta konca. Ker je $c$ večji, je $\nu_1 = \frac{c}{2L}$ večja: ton je višji.
:::

Tudi v mikrovalovki nastane stoječe valovanje, med kovinskima stenama. V hrbtih električno polje močno niha in segreva hrano, v vozlih skoraj nič. Zato se krožnik vrti, čokolada brez njega pa se stali v pegah, razmaknjenih za $\frac{\lambda}{2}$.

## Rešeni primeri

### Primer 1 (lažji): viseča tehtnica v shrambi

Ko na kuhinjsko vzmetno tehtnico obesiš vrečko moke z maso $1{,}0\,\mathrm{kg}$, se vzmet raztegne za $2{,}5\,\mathrm{cm}$. Vrečko malo povlečeš navzdol in spustiš. Kolikšen je nihajni čas?

**Podatki:** $m = 1{,}0\,\mathrm{kg}$, $\Delta x = 2{,}5\,\mathrm{cm} = 0{,}025\,\mathrm{m}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** nihajni čas $t_0$

:::formula
$k = \dfrac{mg}{\Delta x}$, $t_0 = 2\pi\sqrt{\dfrac{m}{k}}$
:::

**Rešitev:**

1. V ravnovesju vzmet drži težo, zato $k\,\Delta x = mg$: $k = \dfrac{1{,}0 \cdot 9{,}81}{0{,}025}\,\mathrm{N/m} = 392{,}4\,\mathrm{N/m}$.
2. $t_0 = 2\pi\sqrt{\dfrac{1{,}0}{392{,}4}}\,\mathrm{s} = 0{,}317\,\mathrm{s}$.
3. Bližnjica za tekmovanje: ker je $\frac{m}{k} = \frac{\Delta x}{g}$, velja $t_0 = 2\pi\sqrt{\frac{\Delta x}{g}}$. Mase sploh ne potrebuješ, le raztezek v ravnovesju.
4. Odgovor: vrečka niha z nihajnim časom približno $0{,}32\,\mathrm{s}$, to je okoli trije nihaji na sekundo.

### Primer 2: hitrost svetlobe iz čokolade

Mikrovalovka deluje s frekvenco $2450\,\mathrm{MHz}$. Razdalja med sosednjima stopljenima pegama na čokoladi je $6{,}1\,\mathrm{cm}$. Kolikšna je hitrost mikrovalov?

**Podatki:** $\nu = 2450\,\mathrm{MHz} = 2{,}45 \cdot 10^9\,\mathrm{Hz}$, $d = 6{,}1\,\mathrm{cm} = 0{,}061\,\mathrm{m}$
**Iščemo:** hitrost valovanja $c$

:::formula
$\lambda = 2d$, $c = \lambda \nu$
:::

**Rešitev:**

1. Pege so v hrbtih stoječega valovanja, sosednja hrbta pa sta narazen za $\frac{\lambda}{2}$. Torej $\lambda = 2 \cdot 0{,}061\,\mathrm{m} = 0{,}122\,\mathrm{m}$.
2. $c = 0{,}122\,\mathrm{m} \cdot 2{,}45 \cdot 10^9\,\mathrm{Hz} \approx 2{,}99 \cdot 10^8\,\mathrm{m/s}$.
3. Odgovor: mikrovalovi potujejo s približno $3{,}0 \cdot 10^8\,\mathrm{m/s}$, kar je hitrost svetlobe; mikrovalovi so elektromagnetno valovanje kot svetloba.

### Primer 3 (težji): kje pritisniti struno

Prazna kitarska struna je dolga $0{,}65\,\mathrm{m}$ in v osnovnem nihanju zveni s frekvenco $110\,\mathrm{Hz}$. Kje jo moraš pritisniti na ubiralko, da bo osnovni ton imel $165\,\mathrm{Hz}$? Kolikšna je frekvenca tretjega lastnega nihanja prazne strune in koliko vozlov ima?

**Podatki:** $L = 0{,}65\,\mathrm{m}$, $\nu_1 = 110\,\mathrm{Hz}$, želena frekvenca $\nu' = 165\,\mathrm{Hz}$, $n = 3$
**Iščemo:** nihajočo dolžino $L'$, mesto pritiska, $\nu_3$ in število vozlov

:::formula
$\nu_n = \dfrac{n c}{2L}$; za osnovno nihanje $c = 2L\nu_1$
:::

**Rešitev:**

1. Hitrost valovanja določa napetost strune, ki se s pritiskom ne spremeni: $c = 2 \cdot 0{,}65 \cdot 110\,\mathrm{m/s} = 143\,\mathrm{m/s}$.
2. Pri pritisnjeni struni niha le del $L'$: $L' = \dfrac{c}{2\nu'} = \dfrac{143}{2 \cdot 165}\,\mathrm{m} = 0{,}433\,\mathrm{m}$.
3. Pritisniti moraš $0{,}65\,\mathrm{m} - 0{,}433\,\mathrm{m} = 0{,}217\,\mathrm{m}$ od zgornjega konca strune, to je pri tretjini dolžine.
4. Tretje lastno nihanje: $\nu_3 = 3\nu_1 = 330\,\mathrm{Hz}$. Na struno gredo tri polovice valovne dolžine, zato ima $3 + 1 = 4$ vozle, vključno s koncema.
5. Odgovor: struno pritisneš $21{,}7\,\mathrm{cm}$ od zgornjega konca; tretje lastno nihanje ima $330\,\mathrm{Hz}$ in $4$ vozle.

Obrat, ki ga je vredno opaziti: frekvenca je obratno sorazmerna z dolžino, zato razmerje $\frac{165}{110} = \frac{3}{2}$ takoj pove $L' = \frac{2}{3}L$.

### Primer 4: zdaj ti – kuhinjska ura v poletni vročini

Stenska ura v kuhinji ima nihalo z nihajnim časom natanko $2{,}00\,\mathrm{s}$. Poleti se palica nihala podaljša za $1{,}0\,\mathrm{mm}$. Za koliko sekund ura zaostane v enem dnevu?

**Podatki:** $t_0 = 2{,}00\,\mathrm{s}$, $\Delta l = 1{,}0\,\mathrm{mm} = 0{,}0010\,\mathrm{m}$, $g = 9{,}81\,\mathrm{m/s^2}$, en dan $= 86\,400\,\mathrm{s}$
**Iščemo:** dnevni zaostanek ure

:::formula
$l = \dfrac{g t_0^2}{4\pi^2}$; pri majhni spremembi: relativna sprememba $t_0$ je polovica relativne spremembe $l$
:::

**Rešitev:**

1. Dolžina nihala: $l = \dfrac{9{,}81 \cdot 2{,}00^2}{4\pi^2}\,\mathrm{m} = 0{,}994\,\mathrm{m}$.
2. Relativni podaljšek: $\dfrac{\Delta l}{l} = \dfrac{0{,}0010}{0{,}994} \approx 1{,}0 \cdot 10^{-3}$. Ker je $t_0$ sorazmeren s $\sqrt{l}$, se nihajni čas podaljša za polovico tega deleža (preveri: $\sqrt{1{,}001} \approx 1{,}0005$).
3. Izračunaj sam, nato preveri:

:::premisli
Za koliko se podaljša nihajni čas in koliko ura zaostane v $86\,400\,\mathrm{s}$?
---
Relativno se $t_0$ podaljša za $\frac{1}{2} \cdot \frac{0{,}0010}{0{,}994} \approx 5{,}03 \cdot 10^{-4}$. Ura šteje nihaje, vsak traja malo dlje, zato v dnevu zaostane za približno $86\,400\,\mathrm{s} \cdot 5{,}03 \cdot 10^{-4} \approx 43{,}5\,\mathrm{s}$, torej skoraj tri četrt minute.
:::

## Pogoste napake

- **»Težja utež na nihalu niha počasneje.«** Težja utež res čuti večjo težo, a ima tudi večjo vztrajnost; masa se v $t_0 = 2\pi\sqrt{l/g}$ okrajša. Pri vzmeti je drugače: tam vračajočo silo določa $k$, ne teža, zato je $t_0$ odvisen od mase.
- **Koren pozabljen ali obrnjen.** Kdor misli, da štirikrat težja utež na vzmeti niha štirikrat počasneje, je pozabil koren. Kdor računa $2\pi\sqrt{k/m}$ ali $2\pi\sqrt{g/l}$, je obrnil ulomek. Preveri enoto: $\sqrt{\mathrm{kg}/(\mathrm{N/m})}$ in $\sqrt{\mathrm{m}/(\mathrm{m/s^2})}$ data sekunde.
- **Razdalja med vozloma je $\lambda$.** Ni: sosednja vozla (ali sosednja hrbta) sta narazen za $\frac{\lambda}{2}$. Zato pri mikrovalovki razmik peg podvojiš, pri struni pa $\lambda_n = \frac{2L}{n}$ in ne $\frac{L}{n}$.
- **Napetost strune spremeni valovno dolžino.** Pri vpeti struni $\lambda$ določata le konca. Napetost spremeni hitrost $c$ in s tem frekvenco.
- **Večja amplituda, daljši nihajni čas.** Pri harmoničnem nihanju je $t_0$ neodvisen od amplitude; pri nihalu to velja za majhne kote.

## Povzetek

- Frekvenca $\nu = \frac{1}{t_0}$, krožna frekvenca $\omega = \frac{2\pi}{t_0}$.
- Harmonično nihanje: vračajoča sila $F = -kx$. Je projekcija enakomernega kroženja: $v_0 = \omega A$, $a_0 = \omega^2 A$.
- Utež na vzmeti: $t_0 = 2\pi\sqrt{m/k}$; za navpično vzmet tudi $t_0 = 2\pi\sqrt{\Delta x/g}$.
- Matematično nihalo pri majhnih kotih: $t_0 = 2\pi\sqrt{l/g}$, neodvisno od mase in amplitude.
- Valovanje: $c = \lambda\nu$.
- Stoječe valovanje: vozli in hrbti, sosednja vozla narazen za $\frac{\lambda}{2}$. Struna, vpeta na obeh koncih: $\lambda_n = \frac{2L}{n}$, $\nu_n = \frac{nc}{2L}$.

## Drugače: Na sliki

Nihanje je senca kroženja. Kroglica kroži s krožno frekvenco $\omega$, njena senca na vodoravni osi pa niha med $-A$ in $A$.

:::risba skica
opis: Krožnica s polmerom A s središčem v izhodišču. Kroglica na krožnici je pri kotu 60 stopinj. Črtkana navpična črta jo poveže s senco na vodoravni osi pri x = A/2. Puščica od kroglice proti središču označuje radialni pospešek.
območje: -3; -3 .. 3; 3
enota: 40
krog: 0; 0 | 2 | modra
črta: -2,8; 0 -> 2,8; 0 | siva
črta: 1; 1,73 -> 1; 0 | črtkano
točka: 1; 1,73 | kroglica | desno | polno
točka: 1; 0 | senca | pod | oranžna polno
puščica: 1; 1,73 -> 0,4; 0,69 | a | levo | rdeča
napis: 2; -0,3 | A | pod
napis: -2; -0,3 | −A | pod
:::

- Kadar je kroglica na skrajni levi ali desni, senca miruje (obrat), pospešek sence pa je največji, $\omega^2 A$.
- Kadar je kroglica na vrhu, gre senca skozi ravnovesno lego z največjo hitrostjo $\omega A$, pospeška pa nima.
- En obrat kroglice je en nihaj sence. Zato je nihajni čas obeh enak.

Na sliki stoječega valovanja v razlagi preberi pravilo, ki velja tudi za pege v mikrovalovki: med sosednjima vozloma je pol vala, cel val obsega dva sosednja hrbta.

## Drugače: Bolj natančno

- **Hitrost valovanja na struni** je $c = \sqrt{F/\mu}$, kjer je $F$ sila, ki struno napenja, $\mu$ pa masa na enoto dolžine. Štirikrat večja sila podvoji $c$ in s tem frekvenco tona.
- **Fizično nihalo.** Togo telo, ki niha okoli osi na razdalji $d$ od težišča, ima nihajni čas $t_0 = 2\pi\sqrt{J/(mgd)}$, kjer je $J$ vztrajnostni moment glede na os. Za točkasto utež je $J = ml^2$, $d = l$, in dobiš znano formulo. Zajemalka na kavlju je fizično nihalo.
- **Dve vzmeti.** Vzporedno vezani vzmeti delujeta kot $k_1 + k_2$; zaporedno vezani kot $\frac{k_1 k_2}{k_1 + k_2}$, ker se raztezka seštejeta, sila pa je v obeh enaka.
- **Epruveta, ki piska.** Ko pihneš čez rob epruvete, je zrak v njej cev, zaprta na enem koncu: na dnu je vozel, ob odprtini hrbet. Na dolžino gre lih večkratnik četrtine vala, $L = (2n - 1)\frac{\lambda}{4}$. Bolj ko je epruveta polna, krajši je zračni steber in višji ton. (Steklenica z ozkim vratom zveni drugače: tam zrak v vratu niha kot utež na vzmeti.)
- **Energija.** Pri nihanju na vzmeti se prožnostna energija $\frac{1}{2}kx^2$ pretaka v kinetično. V skrajni legi je vsa prožnostna, $\frac{1}{2}kA^2 = \frac{1}{2}mv_0^2$, kar spet da $v_0 = \omega A$.

## Preveri se

? Z risbe odčitaj valovno dolžino stoječega valovanja na struni.
:::risba graf
opis: Struna dolžine 0,9 m, vpeta na obeh koncih. Polna in črtkana krivulja sta skrajni legi strune. Na struni je pet vozlov, pri 0; 0,225; 0,45; 0,675 in 0,9 m, ter štirje hrbti.
x: 0 .. 0,9 | 0,15 | x [m]
y: -1,5 .. 1,5 | 1 | odmik
oznake: ne
f: sin(pi*x/0.225) | modra
f: -sin(pi*x/0.225) | modra črtkano
točka: 0; 0 | | pod
točka: 0,225; 0 | | pod
točka: 0,45; 0 | | pod
točka: 0,675; 0 | | pod
točka: 0,9; 0 | | pod
:::
= 0,45 m | 0,01
~ 0,9 | To je dolžina strune. Valovna dolžina je enaka dolžini strune le pri drugem lastnem nihanju.
~ 0,225 | To je razdalja med sosednjima vozloma, torej polovica valovne dolžine.
~ 1,8 | To je $2L$, valovna dolžina osnovnega nihanja. Na risbi so štirje hrbti, torej $n = 4$.
> Štirje hrbti pomenijo $n = 4$: $\lambda = \frac{2L}{n} = \frac{2 \cdot 0{,}9\,\mathrm{m}}{4} = 0{,}45\,\mathrm{m}$, kar sta dva sosednja razmika med vozli.

? Zakaj je nihajni čas matematičnega nihala neodvisen od mase uteži?
- Ker na lahko in težko utež deluje enaka teža.
~ Teža ni enaka: težja utež čuti večjo težo. Ključno je, da ima tudi sorazmerno večjo vztrajnost.
+ Ker sta vračajoča sila in vztrajnost obe sorazmerni z maso, zato se masa okrajša.
- Ker ni res: težja utež niha počasneje, a razlika je majhna.
~ To je napačna vsakdanja predstava. V $t_0 = 2\pi\sqrt{l/g}$ mase ni, poskus to potrdi.
- Ker nihalo nima koeficienta vzmeti.
~ Nihalo se obnaša kot vzmet s $k = \frac{mg}{l}$. Ta $k$ je odvisen od mase, a ga deliš z maso.
> Vračajoča sila je $-\frac{mg}{l}x$, pospešek pa $\frac{F}{m} = -\frac{g}{l}x$. Masa se okrajša, zato $t_0 = 2\pi\sqrt{l/g}$.

? Kolikokrat moraš povečati maso uteži na isti vzmeti, da se nihajni čas podvoji?
- $2$-krat
~ Pozabil si koren: $t_0$ je sorazmeren s $\sqrt{m}$, zato dvakratna masa podaljša $t_0$ le za faktor $\sqrt{2}$.
- $\sqrt{2}$-krat
~ Koren si uporabil v napačno smer. Da se $\sqrt{m}$ podvoji, mora biti $m$ štirikrat večja.
+ $4$-krat
- Nihajni čas je neodvisen od mase.
~ To velja za nihalo, ne za vzmet: pri vzmeti vračajočo silo določa $k$, ne teža.
> $t_0 = 2\pi\sqrt{m/k}$: $2 = \sqrt{4}$, zato potrebuješ štirikratno maso.

? Lonec visi na kavlju na vrvici, dolgi $40\,\mathrm{cm}$, in malo zaniha. Oceni nihajni čas v sekundah (lonec obravnavaj kot točkasto utež).
= 1,27 s | 0,05
~ 0,20 | Pozabil si faktor $2\pi$: $\sqrt{l/g} = 0{,}20\,\mathrm{s}$ je šele del formule.
~ 31 | Ulomek pod korenom si obrnil. Pravilno je $\sqrt{l/g}$, kar da sekunde.
> $t_0 = 2\pi\sqrt{\frac{0{,}40\,\mathrm{m}}{9{,}81\,\mathrm{m/s^2}}} \approx 1{,}27\,\mathrm{s}$.

? Razvrsti nihala od najkrajšega do najdaljšega nihajnega časa ($g_\mathrm{Luna} = 1{,}62\,\mathrm{m/s^2}$).
1. utež $1\,\mathrm{kg}$ na vzmeti s $k = 100\,\mathrm{N/m}$
2. nihalo dolžine $0{,}25\,\mathrm{m}$ na Zemlji
3. nihalo dolžine $1{,}0\,\mathrm{m}$ na Zemlji
4. utež $1\,\mathrm{kg}$ na vzmeti s $k = 4\,\mathrm{N/m}$
5. nihalo dolžine $1{,}0\,\mathrm{m}$ na Luni
> Nihajni časi so po vrsti $0{,}63\,\mathrm{s}$; $1{,}00\,\mathrm{s}$; $2{,}01\,\mathrm{s}$; $3{,}14\,\mathrm{s}$ in $4{,}94\,\mathrm{s}$. Na Luni je $g$ manjši, zato nihalo niha počasneje.

<<RACUN
vrednost: 40/50 | 0.8
vrednost: 50/40 | 1.25
vrednost: 200*0.03 | 6
vrednost: 2*pi*sqrt(0.2/20) | 0.63
vrednost: 4*3 | 12
vrednost: 1.0*9.81/0.025 | 392.4
vrednost: 2*pi*sqrt(1.0/392.4) | 0.317
vrednost: 2*0.061 | 0.122
vrednost: 0.122*2.45*10^9 | 2.99*10^8
vrednost: 2*0.65*110 | 143
vrednost: 143/(2*165) | 0.433
vrednost: 0.65-0.433 | 0.217
vrednost: 3*110 | 330
vrednost: 9.81*2^2/(4*pi^2) | 0.994
vrednost: 0.5*0.0010/0.994 | 5.03*10^-4
vrednost: 86400*5.03*10^-4 | 43.5
vrednost: 2*0.9/4 | 0.45
vrednost: 2*pi*sqrt(0.40/9.81) | 1.27
vrednost: 2*pi*sqrt(1/1.62) | 4.94
>>

:::simboli
t_0 | nihajni čas | t_0 = \frac{1}{\nu} | s
\nu | frekvenca | \nu = \frac{1}{t_0} | Hz
\nu_n | frekvenca $n$-tega lastnega nihanja strune | \nu_n = \frac{n c}{2L} | Hz
\nu_1 | frekvenca osnovnega nihanja | \nu_1 = \frac{c}{2L} | Hz
\nu' | želena frekvenca osnovnega tona | | Hz
A | amplituda | | m | največji odmik od ravnovesne lege
F | vračajoča sila vzmeti | F = -kx | N
k | koeficient vzmeti | k = \frac{mg}{\Delta x} | N/m
x | odmik od ravnovesne lege | | m
\Delta x | raztezek vzmeti v ravnovesju | | m
m | masa uteži | | kg
\omega | krožna frekvenca | \omega = \frac{2\pi}{t_0} | s^{-1}
l | dolžina nihala | l = \frac{g t_0^2}{4\pi^2} | m
g | težni pospešek | | m/s^2
\lambda | valovna dolžina | \lambda = \frac{c}{\nu} | m
\lambda_n | valovna dolžina $n$-tega lastnega nihanja | \lambda_n = \frac{2L}{n} | m
c | hitrost valovanja | c = \lambda \nu | m/s
L | dolžina strune | | m
L' | dolžina nihajočega dela pritisnjene strune | L' = \frac{c}{2\nu'} | m
n | zaporedna številka lastnega nihanja | | – | $n = 1, 2, 3, \ldots$
d | razdalja med sosednjima pegama | d = \frac{\lambda}{2} | m
:::
