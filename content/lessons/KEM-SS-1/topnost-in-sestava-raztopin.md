---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dva hitra poskusa za doma. Kozarec napolni z mrzlo vodo iz pipe in ga pusti dve uri na mizi v topli sobi. Na stenah se naberejo drobni mehurčki, čeprav vode nisi segrel do vrelišča.

V drug kozarec nalij $100\,\mathrm{mL}$ vode in vanj po žličkah stresaj kuhinjsko sol. Prvih nekaj žličk izgine. Po petih ali šestih žličkah sol ostaja na dnu, pa naj mešaš še tako dolgo.

Oba poskusa kažeta isto: voda sprejme le omejeno količino snovi, trdne ali plinaste, in ta meja je odvisna od temperature. Ista meja pojasni, zakaj ribe v plitvem ribniku ob vročem poletnem popoldnevu lovijo zrak na površju in zakaj v solinah sol izkristalizira šele, ko izhlapi večina morske vode.

## Razlaga

**1. Masni delež in topnost: podobna, a ne enaka.** Masni delež $w$ že poznaš. Določiš ga sam: iz iste soli lahko pripraviš $1\,\%$ ali $10\,\%$ raztopino. **Topnost** $S$ pa je lastnost snovi. To je največja masa snovi, ki se pri dani temperaturi raztopi v $100\,\mathrm{g}$ vode. Za kuhinjsko sol pri $20\,^\circ\mathrm{C}$ je $S = 36{,}0\,\mathrm{g}$ na $100\,\mathrm{g}$ vode.

| | $w$ | $S$ |
|---|---|---|
| na kaj | raztopino | $100\,\mathrm{g}$ vode |
| določi | ti | snov in temperatura |
| vrednost | do meje | meja |

**2. Nasičena, nenasičena, prenasičena.** Raztopina, ki pri dani temperaturi vsebuje toliko topljenca, kot dopušča topnost, je **nasičena**. Dodana sol ostane na dnu. Raztopina z manj topljenca je **nenasičena** in še kaj raztopi.

**Prenasičena** raztopina vsebuje več topljenca, kot ga dopušča topnost. Nastane, ko vročo nasičeno raztopino ohladiš povsem mirno, brez prahu in tresljajev. Je nestabilna: en kristalček ali sunek sproži kristalizacijo. Tako delujejo zimske grelne blazinice z natrijevim acetatom. Ko upogneš kovinsko ploščico v njej, tekočina v nekaj sekundah zakristalizira in se segreje.

**3. Diagram topnosti.** Topnost trdnih snovi se s temperaturo navadno poveča. Graf topnosti v odvisnosti od temperature je **diagram topnosti**.

:::risba graf
opis: Diagram topnosti. Vodoravna os je temperatura od 0 do 80 stopinj Celzija, navpična os masa soli v gramih, ki se raztopi v 100 g vode, od 0 do 180. Krivulja kalijevega nitrata (polna) strmo narašča: 13 g pri 0 °C, 32 g pri 20 °C, 64 g pri 40 °C, 110 g pri 60 °C in 169 g pri 80 °C. Krivulja natrijevega klorida (črtkana) je skoraj vodoravna: od 36 g pri 0 °C do 38 g pri 80 °C. Krivulji se sekata pri približno 23 °C.
x: 0 .. 80 | 10 | t / °C
y: 0 .. 180 | 20 | g soli na 100 g vode
črta: 0; 13,3 -> 10; 20,9 -> 20; 31,6 -> 30; 45,8 -> 40; 63,9 -> 50; 85,5 -> 60; 110 -> 70; 138 -> 80; 169 | modra
črta: 0; 35,7 -> 20; 36 -> 40; 36,6 -> 60; 37,3 -> 80; 38,4 | oranžna
napis: 64; 150 | KNO_3 | levo | modra
napis: 70; 42 | NaCl | nad | oranžna
podnapis: Topnost KNO₃ (strma krivulja) in NaCl (skoraj vodoravna krivulja)
:::

Vsaka točka na krivulji pomeni nasičeno raztopino. Točka pod krivuljo je nenasičena raztopina. Točka nad krivuljo je prenasičena raztopina, ali pa nasičena raztopina, pod katero na dnu ležijo kristali.

Krivulja $\mathrm{KNO_3}$ je strma, krivulja $\mathrm{NaCl}$ skoraj ravna. Zato $\mathrm{KNO_3}$ čistijo s **prekristalizacijo**: raztopijo ga v vroči vodi, ohladijo in kristali izpadejo. Sol iz morja pa v solinah pridobivajo z izparevanjem vode, ker hlajenje pri njej skoraj nič ne pomaga.

:::premisli
V $100\,\mathrm{g}$ vode pri $60\,^\circ\mathrm{C}$ pripraviš nasičeno raztopino $\mathrm{KNO_3}$ in jo ohladiš na $20\,^\circ\mathrm{C}$. Koliko kristalov se izloči? Napovej z diagrama, nato primerjaj z $\mathrm{NaCl}$.
---
Pri $60\,^\circ\mathrm{C}$ je raztopljenih $110\,\mathrm{g}$, pri $20\,^\circ\mathrm{C}$ ostane raztopljenih le $31{,}6\,\mathrm{g}$. Izloči se $110\,\mathrm{g} - 31{,}6\,\mathrm{g} = 78{,}4\,\mathrm{g}$ kristalov. Pri $\mathrm{NaCl}$ bi se izločilo le dober gram.
:::

**4. Od topnosti do masnega deleža.** Nasičena raztopina vsebuje $S$ topljenca na $100\,\mathrm{g}$ vode, torej v $S + 100\,\mathrm{g}$ raztopine. Topljenec je del raztopine, zato ga prištejemo:

$$w = \frac{S}{S + 100\,\mathrm{g}}$$

Topnost lahko odčitaš z diagrama. Pri $60\,^\circ\mathrm{C}$ je topnost $\mathrm{KNO_3}$ $110\,\mathrm{g}$, zato ima nasičena raztopina $w = \dfrac{110}{210} = 0{,}524 = 52{,}4\,\%$.

**5. Zakaj se snov sploh raztopi: hidratacija.** Molekula vode je dipol: kisik je delno negativen, vodika delno pozitivna. Ko kristal $\mathrm{NaCl}$ pade v vodo, se molekule vode obrnejo k ionom na površini. Proti $\mathrm{Na^+}$ obrnejo kisik, proti $\mathrm{Cl^-}$ vodika. Ion obdajo z ovojem, ga izvlečejo iz kristala in ga nosijo po raztopini.

Temu pravimo **hidratacija**, ionu z ovojem vode pa **hidratiran ion**. Zapišemo ga z oznako $\mathrm{(aq)}$, na primer $\mathrm{Na^+(aq)}$. Tudi polarne molekule se hidratirajo: sladkor z vodo tvori vodikove vezi. Nepolarnega olja voda ne more obdati, zato se ne raztopi.

Raztapljanje ima tudi energijski račun. Za razbitje kristala je treba porabiti energijo (**mrežna energija**), pri hidrataciji ionov pa se energija sprosti (**hidratacijska energija**). Če se pri hidrataciji sprosti več energije, kot je porabi razbijanje kristala, se raztopina segreje, kot pri $\mathrm{NaOH}$. Če je razbijanje porabi več, se raztopina ohladi, kot pri $\mathrm{NH_4NO_3}$ v hladilnih vrečkah za prvo pomoč.

V nasičeni raztopini hidratacija ne preneha. Ioni se še vedno odcepljajo od kristala, a enako hitro se nanj vračajo. Zato se količina raztopljene soli ne spreminja več.

**6. Trije zapisi sestave za isti liter.** Poleg masnega deleža $w$ in množinske koncentracije $c$ uporabljamo še **masno koncentracijo** $\gamma$ (gama). To je masa topljenca v litru raztopine:

$$\gamma = \frac{m_\mathrm{t}}{V}$$

$m_\mathrm{t}$ je masa topljenca, enota za $\gamma$ je $\mathrm{g/L}$. Primerjaj s $c$: obe se nanašata na liter raztopine, razlikujeta se le v tem, ali topljenec štejemo v gramih ali v molih. Zato je $c = \gamma / M$.

Masni delež pa se nanaša na maso. Most med maso in prostornino raztopine je gostota $\rho$. Liter raztopine ima maso $\rho \cdot 1\,\mathrm{L}$, od tega je delež $w$ topljenec:

$$\gamma = w \cdot \rho$$

$$c = \frac{w \cdot \rho}{M}$$

Gostoto vstavi v $\mathrm{g/L}$: $1{,}025\,\mathrm{g/mL} = 1025\,\mathrm{g/L}$.

**7. Koncentriranje in mešanje.** Ko voda izhlapi, topljenec ostane: $w_1 m_1 = w_2 m_2$. To je isto pravilo kot pri redčenju, le da je zdaj $m_2$ manjša in $w_2$ večji. Ko zmešamo dve raztopini, se seštejeta masi topljenca in masi raztopin:

$$w = \frac{w_1 m_1 + w_2 m_2}{m_1 + m_2}$$

Čista voda ima $w = 0$, dodana trdna sol pa je kot »raztopina« z $w = 100\,\%$. Odstotkov ne seštevaš. Povprečje odstotkov je pravilno le, kadar sta masi raztopin enaki.

**8. Plini: ravno nasprotno kot trdne snovi.** Topnost plinov se z višjo temperaturo **zmanjša**. Topla voda ima več energije, molekule plina lažje uidejo iz nje. Mehurčki v kozarcu z začetka so zrak, ki ga je mrzla voda raztopila, topla pa ga ne more več zadržati.

| $t$ | kisik iz zraka v $1\,\mathrm{L}$ vode |
|---|---|
| $0\,^\circ\mathrm{C}$ | $14{,}6\,\mathrm{mg}$ |
| $10\,^\circ\mathrm{C}$ | $11{,}3\,\mathrm{mg}$ |
| $20\,^\circ\mathrm{C}$ | $9{,}1\,\mathrm{mg}$ |
| $30\,^\circ\mathrm{C}$ | $7{,}6\,\mathrm{mg}$ |

Zato postrvi živijo v mrzlih gorskih potokih, v toplem ribniku pa ribam poleti zmanjkuje kisika.

Večji tlak plina nad vodo topnost **poveča**: pri dvakrat večjem tlaku plina se raztopi približno dvakrat več plina. Temu pravimo Henryjev zakon. Gazirane pijače polnijo pod povečanim tlakom $\mathrm{CO_2}$. Ko odpreš plastenko, tlak pade in odvečni $\mathrm{CO_2}$ uhaja v mehurčkih.

:::premisli
Odpreš dve plastenki iste gazirane pijače: eno iz hladilnika, drugo, ki je stala na soncu. Iz katere bolj šumi in zakaj?
---
Iz tople. V obeh tlak ob odprtju pade, a topla pijača lahko zadrži manj $\mathrm{CO_2}$, zato ga iz nje uide več in hitreje. Hladna ostane gazirana dlje.
:::

## Rešeni primeri

### Primer 1: od topnosti do nasičene raztopine

Topnost natrijevega klorida pri $20\,^\circ\mathrm{C}$ je $36{,}0\,\mathrm{g}$ na $100\,\mathrm{g}$ vode. Kolikšen je masni delež $\mathrm{NaCl}$ v nasičeni raztopini? Koliko soli se največ raztopi v $250\,\mathrm{g}$ vode pri isti temperaturi?

**Podatki:** $S = 36{,}0\,\mathrm{g}$ na $100\,\mathrm{g}$ vode, $t = 20\,^\circ\mathrm{C}$, $m(\text{voda}) = 250\,\mathrm{g}$
**Iščemo:** masni delež $w$ nasičene raztopine in največjo maso soli $m_\mathrm{t}$ v $250\,\mathrm{g}$ vode

:::formula
$w = \dfrac{S}{S + 100\,\mathrm{g}}$; največja masa soli je sorazmerna z maso vode.
:::

**Rešitev:**

1. Masa nasičene raztopine iz $100\,\mathrm{g}$ vode: $36{,}0\,\mathrm{g} + 100\,\mathrm{g} = 136\,\mathrm{g}$, ker tudi sol prispeva k masi raztopine.
2. Delež soli v raztopini:

   $$w = \frac{36{,}0}{136} = 0{,}265 = 26{,}5\,\%$$
3. Vode je $2{,}5$-krat več kot $100\,\mathrm{g}$, zato raztopi $2{,}5$-krat več soli: $m_\mathrm{t} = 2{,}5 \cdot 36{,}0\,\mathrm{g} = 90{,}0\,\mathrm{g}$.
4. Odgovor: nasičena raztopina $\mathrm{NaCl}$ ima pri $20\,^\circ\mathrm{C}$ masni delež $26{,}5\,\%$; v $250\,\mathrm{g}$ vode se raztopi največ $90{,}0\,\mathrm{g}$ soli.

### Primer 2: morska voda v treh zapisih

Morsko vodo poenostavimo kot raztopino $\mathrm{NaCl}$ z masnim deležem $3{,}5\,\%$ in gostoto $1{,}025\,\mathrm{g/mL}$. Izračunaj masno in množinsko koncentracijo $\mathrm{NaCl}$.

**Podatki:** $w = 3{,}5\,\% = 0{,}035$, $\rho = 1{,}025\,\mathrm{g/mL} = 1025\,\mathrm{g/L}$, $M(\mathrm{NaCl}) = 58{,}44\,\mathrm{g/mol}$
**Iščemo:** masno koncentracijo $\gamma$ in množinsko koncentracijo $c$

:::formula
$\gamma = w \cdot \rho$, nato $c = \dfrac{\gamma}{M}$
:::

**Rešitev:**

1. Liter morske vode ima maso $1025\,\mathrm{g}$, zato gostoto pišemo v $\mathrm{g/L}$.
2. Masa soli v litru:

   $$\gamma = 0{,}035 \cdot 1025 = 35{,}9\,\mathrm{g/L}$$
3. Grame pretvorimo v mole, ker je $M$ masa enega mola:

   $$c = \frac{35{,}9}{58{,}44} = 0{,}614\,\mathrm{mol/L}$$
4. Odgovor: v morski vodi je $35{,}9\,\mathrm{g/L}$ oziroma $0{,}614\,\mathrm{mol/L}$ $\mathrm{NaCl}$.

### Primer 3: v solinah

V solinski bazen spustijo $1000\,\mathrm{kg}$ morske vode z $w(\mathrm{NaCl}) = 3{,}5\,\%$. Sonce in veter izparevata vodo. Koliko kilogramov vode mora izhlapeti, preden začne sol kristalizirati? Nasičena raztopina $\mathrm{NaCl}$ ima masni delež $26{,}5\,\%$ (Primer 1). Druge snovi v morski vodi zanemari.

**Podatki:** $m_1 = 1000\,\mathrm{kg}$, $w_1 = 0{,}035$, $w_2 = 0{,}265$ (nasičena raztopina)
**Iščemo:** maso vode, ki mora izhlapeti

:::formula
$w_1 m_1 = w_2 m_2$; izhlapela voda je $m_1 - m_2$.
:::

**Rešitev:**

1. Sol ne izhlapi, zato se njena masa ohrani: $m_\mathrm{t} = 0{,}035 \cdot 1000\,\mathrm{kg} = 35\,\mathrm{kg}$.
2. Sol začne kristalizirati, ko raztopina postane nasičena:

   $$m_2 = \frac{35\,\mathrm{kg}}{0{,}265} = 132{,}1\,\mathrm{kg}$$
3. Razlika je izhlapela voda: $1000 - 132{,}1 = 867{,}9$, torej $867{,}9\,\mathrm{kg}$.
4. Odgovor: izhlapeti mora približno $868\,\mathrm{kg}$ vode, skoraj $87\,\%$ mase morske vode. Zato soline potrebujejo vroče in vetrovno poletje.

### Primer 4 – zdaj ti: slanica pred sneženjem

Pred napovedanim sneženjem cestarji pripravijo slanico za ceste. Zmešajo $300\,\mathrm{kg}$ slanice z masnim deležem soli $25\,\%$ in $200\,\mathrm{kg}$ slanice z masnim deležem $5\,\%$. Kolikšen je masni delež soli v zmesi?

**Podatki:** $m_1 = 300\,\mathrm{kg}$, $w_1 = 0{,}25$, $m_2 = 200\,\mathrm{kg}$, $w_2 = 0{,}05$
**Iščemo:** masni delež $w$ v zmesi

:::formula
$w = \dfrac{w_1 m_1 + w_2 m_2}{m_1 + m_2}$
:::

**Rešitev:**

1. Sol v prvi slanici: $0{,}25 \cdot 300\,\mathrm{kg} = 75\,\mathrm{kg}$.
2. Sol v drugi slanici: $0{,}05 \cdot 200\,\mathrm{kg} = 10\,\mathrm{kg}$.
3. Seštej sol, deli s skupno maso slanice in preveri:

:::premisli
Kolikšen je $w$ zmesi? Je bližje $25\,\%$ ali $5\,\%$ in zakaj?
---
$$w = \frac{85\,\mathrm{kg}}{500\,\mathrm{kg}} = 0{,}17 = 17\,\%$$

Bližje je $25\,\%$, ker je močnejše slanice več. Povprečje $15\,\%$ bi veljalo le pri enakih masah.
:::

## Pogoste napake

- **Topnost zamenjaš z masnim deležem.** »Topnost $\mathrm{NaCl}$ je $36\,\mathrm{g}$, torej ima nasičena raztopina $36\,\%$.« Topnost se nanaša na $100\,\mathrm{g}$ vode, masni delež na raztopino, ki ima $136\,\mathrm{g}$. Pravilno: $w = 26{,}5\,\%$. Obratno iz $w$ ne dobiš topnosti, če ga samo pomnožiš s $100$.
- **Odstotke povprečiš ali sešteješ.** $300\,\mathrm{kg}$ $25\,\%$ in $200\,\mathrm{kg}$ $5\,\%$ slanice ne dasta $15\,\%$ ali $30\,\%$. Seštej mase topljenca in mase raztopin, šele nato deli.
- **Dodana sol ne poveča mase raztopine.** Ko v raztopino streseš trdno sol, se poveča masa topljenca in tudi masa raztopine. Če prišteješ sol samo v števec, je rezultat prevelik.
- **Gostota v napačni enoti.** Z gostoto v $\mathrm{g/mL}$ dobiš tisočkrat premajhno koncentracijo ($0{,}000614$ namesto $0{,}614\,\mathrm{mol/L}$). Pred računom gostoto pretvori v $\mathrm{g/L}$.
- **Plini kot trdne snovi.** »V topli vodi se vse bolje raztaplja.« Za večino trdnih snovi to drži, za pline je obratno: topla voda zadrži manj kisika in $\mathrm{CO_2}$.

## Povzetek

- **Topnost** $S$ je največja masa snovi, ki se pri dani temperaturi raztopi v $100\,\mathrm{g}$ vode.
- **Nasičena** raztopina ima toliko topljenca, kot dopušča topnost; **nenasičena** manj; **prenasičena** več in je nestabilna.
- **Diagram topnosti**: točka na krivulji je nasičena raztopina, pod krivuljo nenasičena.
- Masni delež nasičene raztopine:

$$w = \frac{S}{S + 100\,\mathrm{g}}$$

- Pretvorbe z gostoto v $\mathrm{g/L}$:

$$\gamma = w \cdot \rho \qquad c = \frac{\gamma}{M}$$

- Pri **izparevanju** in **mešanju** se masa topljenca ohrani.
- **Plini**: topnost se z višjo temperaturo zmanjša, z višjim tlakom plina poveča.
- **Hidratacija**: molekule vode obdajo ione in polarne molekule.

## Drugače: Na sliki

Tako je videti kristalček soli, ko ga razgradi voda. Vsak ion obda ovoj molekul vode.

:::risba skica
opis: Hidratirana iona. Levo je natrijev kation Na⁺, okoli njega štiri molekule vode, vse obrnjene s kisikovim atomom proti ionu, vodika gledata navzven. Desno je kloridni anion Cl⁻, okoli njega štiri molekule vode, ki so obrnjene z enim vodikovim atomom proti ionu, kisik je dlje.
območje: 0; 0 .. 11; 5,5
enota: 28
krog: 2,75; 2,75 | 0,5 | modra
napis: 2,75; 2,75 | Na^+ | sredina | debelo
napis: 2,75; 3,85 | O | sredina
napis: 2,3; 4,5 | H | sredina
napis: 3,2; 4,5 | H | sredina
napis: 2,75; 1,65 | O | sredina
napis: 2,3; 1 | H | sredina
napis: 3,2; 1 | H | sredina
napis: 1,65; 2,75 | O | sredina
napis: 1; 2,3 | H | sredina
napis: 1; 3,2 | H | sredina
napis: 3,85; 2,75 | O | sredina
napis: 4,5; 2,3 | H | sredina
napis: 4,5; 3,2 | H | sredina
krog: 8,25; 2,75 | 0,5 | oranžna
napis: 8,25; 2,75 | Cl^- | sredina | debelo
napis: 8,25; 3,85 | H | sredina
napis: 8,25; 4,45 | O | sredina
napis: 8,8; 4,75 | H | sredina
napis: 8,25; 1,65 | H | sredina
napis: 8,25; 1,05 | O | sredina
napis: 7,7; 0,75 | H | sredina
napis: 7,15; 2,75 | H | sredina
napis: 6,55; 2,75 | O | sredina
napis: 6,25; 3,3 | H | sredina
napis: 9,35; 2,75 | H | sredina
napis: 9,95; 2,75 | O | sredina
napis: 10,25; 2,2 | H | sredina
podnapis: Kisik (O) je delno negativen in gleda proti kationu, vodik (H) je delno pozitiven in gleda proti anionu.
:::

Diagram topnosti pa beri kot zemljevid. Krivulja je meja. Pod njo je še prostor za topljenec, na njej je raztopina polna, nad njo je preveč topljenca. Ko raztopino ohlajaš, se točka pomika vodoravno v levo. Ko doseže krivuljo, začnejo nastajati kristali.

## Drugače: Iz vsakdanjega življenja

- **Čaj s sladkorjem.** Sladkaj ga, dokler je vroč: v vroči vodi se sladkor raztopi hitreje in več ga gre vanjo.
- **Gazirana pijača.** Hrani jo zaprto in hladno. Zaprt zamašek drži tlak $\mathrm{CO_2}$, mraz poveča njegovo topnost.
- **Ribnik poleti.** V vročini topla voda zadrži manj kisika. Ribe se zbirajo pri površju in ob dotoku sveže vode.
- **Zimska grelna blazinica.** Prenasičena raztopina čaka na prvi kristalček. Ko kristalizacija steče, se sprosti toplota.
- **Kozarec vode na nočni omarici.** Zjutraj so na steklu mehurčki: voda se je segrela na sobno temperaturo in izpustila del raztopljenega zraka.

## Preveri se

? Raztopino $80\,\mathrm{g}$ $\mathrm{KNO_3}$ v $100\,\mathrm{g}$ vode pri $60\,^\circ\mathrm{C}$ počasi ohlajaš. Z diagrama odčitaj, pri kateri temperaturi približno začnejo nastajati kristali.
:::risba graf
opis: Diagram topnosti kalijevega nitrata. Temperatura od 0 do 80 stopinj Celzija, masa soli na 100 g vode od 0 do 180 g. Krivulja gre skozi 13 g pri 0 °C, 32 g pri 20 °C, 64 g pri 40 °C, 86 g pri 50 °C, 110 g pri 60 °C in 169 g pri 80 °C. Črtkana vodoravnica je pri 80 g.
x: 0 .. 80 | 10 | t / °C
y: 0 .. 180 | 20 | g soli na 100 g vode
črta: 0; 13,3 -> 10; 20,9 -> 20; 31,6 -> 30; 45,8 -> 40; 63,9 -> 50; 85,5 -> 60; 110 -> 70; 138 -> 80; 169 | modra
črta: 0; 80 -> 80; 80 | črtkano
napis: 5; 80 | 80 g | nad
napis: 64; 150 | KNO_3 | levo | modra
:::
- pri $60\,^\circ\mathrm{C}$
~ Pri $60\,^\circ\mathrm{C}$ je topnost $110\,\mathrm{g}$, več kot $80\,\mathrm{g}$: raztopina je takrat še nenasičena.
+ pri približno $48\,^\circ\mathrm{C}$
- pri približno $20\,^\circ\mathrm{C}$
~ Pri $20\,^\circ\mathrm{C}$ je topnost le okoli $32\,\mathrm{g}$. Kristali nastajajo že prej, takoj ko krivulja pade pod $80\,\mathrm{g}$.
> Kristali se začnejo izločati, ko raztopina postane nasičena: tam, kjer vodoravnica pri $80\,\mathrm{g}$ seka krivuljo, to je pri približno $48\,^\circ\mathrm{C}$.

? Ribnik vsebuje približno $2000\,\mathrm{m^3}$ vode. V vročem tednu se segreje z $10\,^\circ\mathrm{C}$ na $30\,^\circ\mathrm{C}$. Topnost kisika je pri $10\,^\circ\mathrm{C}$ $11{,}3\,\mathrm{mg/L}$, pri $30\,^\circ\mathrm{C}$ $7{,}6\,\mathrm{mg/L}$. Oceni, koliko kilogramov kisika lahko največ uide iz vode, če je bila na začetku nasičena.
= 7,4 kg | 0,4
~ 7400 | To so grami. $3{,}7\,\mathrm{mg/L} \cdot 2\,000\,000\,\mathrm{L} = 7\,400\,000\,\mathrm{mg} = 7{,}4\,\mathrm{kg}$.
~ 22,6 | Uporabil si vso topnost pri $10\,^\circ\mathrm{C}$. Uide le razlika med topnostma.
~ 0,0074 | $1\,\mathrm{m^3}$ je $1000\,\mathrm{L}$, ne $1\,\mathrm{L}$.
> Uide razlika: $11{,}3 - 7{,}6 = 3{,}7\,\mathrm{mg}$ na liter. $2000\,\mathrm{m^3} = 2\,000\,000\,\mathrm{L}$, torej $7\,400\,000\,\mathrm{mg} = 7{,}4\,\mathrm{kg}$ kisika.

? Zakaj ribe v plitvem ribniku ob vročem poletnem popoldnevu pogosto plavajo tik pod površjem in lovijo zrak?
- Ker se v topli vodi kisik bolje raztaplja in ga je v globini preveč.
~ Tako se obnaša večina trdnih snovi. Pri plinih je obratno: s temperaturo topnost pada.
+ Ker topla voda raztopi manj kisika kot hladna, zato ga ribam v vodi zmanjkuje.
- Ker je poleti tlak zraka nad ribnikom veliko večji.
~ Tlak zraka se s temperaturo skoraj ne spreminja, večji tlak pa bi topnost kisika celo povečal.
> Topnost plinov se z višjo temperaturo zmanjša: pri $30\,^\circ\mathrm{C}$ je v litru vode le $7{,}6\,\mathrm{mg}$ kisika, pri $10\,^\circ\mathrm{C}$ pa $11{,}3\,\mathrm{mg}$.

? Nasičena raztopina kalijevega klorida ima pri $20\,^\circ\mathrm{C}$ masni delež $25{,}4\,\%$. Kolikšna je topnost $\mathrm{KCl}$ pri tej temperaturi (v gramih na $100\,\mathrm{g}$ vode)?
= 34,0 g | 0,3
~ 25,4 | To je masni delež, preračunan na $100\,\mathrm{g}$ raztopine, ne na $100\,\mathrm{g}$ vode.
~ 74,6 | To je masa vode v $100\,\mathrm{g}$ raztopine. Topnost je masa soli na $100\,\mathrm{g}$ vode.
> V $100\,\mathrm{g}$ raztopine je $25{,}4\,\mathrm{g}$ $\mathrm{KCl}$ in $74{,}6\,\mathrm{g}$ vode. Na $100\,\mathrm{g}$ vode: $S = \dfrac{25{,}4}{74{,}6} \cdot 100\,\mathrm{g} = 34{,}0\,\mathrm{g}$.

? Pred zmrzaljo v $400\,\mathrm{kg}$ slanice z masnim deležem soli $10\,\%$ stresejo še $50\,\mathrm{kg}$ soli in jo raztopijo. Kolikšen je nov masni delež soli?
- $22{,}5\,\%$
~ Sol si prištel k topljencu, ne pa tudi k masi raztopine. Nova masa raztopine je $450\,\mathrm{kg}$.
+ $20\,\%$
- $11{,}1\,\%$
~ Upošteval si samo dodano sol in pozabil na $40\,\mathrm{kg}$ soli, ki je bila v slanici že prej.
> Soli je $40\,\mathrm{kg} + 50\,\mathrm{kg} = 90\,\mathrm{kg}$, slanice $400\,\mathrm{kg} + 50\,\mathrm{kg} = 450\,\mathrm{kg}$. $w = \dfrac{90}{450} = 0{,}20 = 20\,\%$.

<<RACUN
vrednost: 110-31.6 | 78.4
vrednost: 36/136 | 0.265
vrednost: 110/210 | 0.524
vrednost: 2.5*36 | 90
molska: NaCl | 58.44
vrednost: 0.035*1025 | 35.9
vrednost: 35.9/58.44 | 0.614
vrednost: 0.035*1000 | 35
vrednost: 35/0.265 | 132.1
vrednost: 1000-132.1 | 867.9
vrednost: (0.25*300+0.05*200)/(300+200) | 0.17
vrednost: (11.3-7.6)*2000*1000/10^6 | 7.4
vrednost: 25.4/74.6*100 | 34.0
vrednost: (0.10*400+50)/(400+50) | 0.20
vrednost: 90/400 | 0.225
vrednost: 50/450 | 0.111
>>

:::simboli
S | topnost (masa snovi, ki se raztopi v $100\,\mathrm{g}$ vode) | | g | velja za nasičeno raztopino pri dani temperaturi
w | masni delež topljenca | w = \frac{m_\mathrm{t}}{m} | – | v odstotkih pomnožimo s $100$
\gamma | masna koncentracija | \gamma = \frac{m_\mathrm{t}}{V} | g/L |
m_\mathrm{t} | masa topljenca | | g |
V | prostornina raztopine | | L |
\rho | gostota raztopine | | g/L | vstavi v $\mathrm{g/L}$, ne v $\mathrm{g/mL}$
c | množinska koncentracija | c = \frac{\gamma}{M} | mol/L |
M | molska masa topljenca | | g/mol |
w_1, w_2 | masna deleža pred spremembo in po njej (ali dveh raztopin) | | – |
m_1, m_2 | masi raztopin pred spremembo in po njej (ali dveh raztopin) | | kg |
m | masa raztopine | | g |
:::
