---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka, še brez teorije. Na mizi stojita dve stekleničici z enako nalepko: $0{,}10\,\mathrm{mol/L}$. V eni je klorovodikova kislina (HCl), v drugi ocetna kislina. Senzor pH pri HCl pokaže $1{,}00$, pri ocetni kislini $2{,}87$. Nato vsako raztopino razredčiš 10-krat. Pri HCl senzor zdaj kaže $2{,}00$.

Kaj pokaže pri ocetni kislini: $3{,}87$; $3{,}37$ ali spet $2{,}87$? Zapiši svojo napoved. Odgovor dobiš v razlagi.

Enaka vprašanja rešujejo v tovarnah elektronike. Steklo za zaslone telefonov matirajo, plasti silicijevega dioksida na čipih pa jedkajo z raztopinami fluorovodikove kisline (HF). Hitrost jedkanja je odvisna od pH. Ta mora ostati v ozkem pasu, čeprav se kislina med delom porablja. To nalogo opravi pufer. Na tekmovanjih zato pričakujejo, da znaš izračunati pH šibke kisline, pH pufra in vsako točko titracijske krivulje.

## Razlaga

**1. Močna kislina deluje kot reakcija, ki poteče do konca.** Pri stehiometriji si se naučil, da se omejitveni reaktant porabi v celoti. Enako se obnaša močna kislina v vodi: $\mathrm{HCl + H_2O \rightarrow H_3O^+ + Cl^-}$. Proton odda vsaka molekula, zato je koncentracija oksonijevih ionov kar enaka koncentraciji kisline.

$$\mathrm{pH} = -\log [\mathrm{H_3O^+}]$$

Za HCl s koncentracijo $0{,}10\,\mathrm{mol/L}$ je $\mathrm{pH} = 1{,}00$. Močne so tudi HBr, HI, $\mathrm{HNO_3}$, $\mathrm{HClO_4}$ in prva stopnja $\mathrm{H_2SO_4}$.

**2. Šibka kislina se ustavi v ravnotežju.** Ocetna kislina proton odda le majhnemu delu molekul: $\mathrm{CH_3COOH + H_2O \rightleftharpoons H_3O^+ + CH_3COO^-}$. Kislino na splošno označimo s HA, njeno **konjugirano bazo** (kar ostane po oddaji protona) pa z $\mathrm{A^-}$. Ravnotežno konstanto tega procesa imenujemo **konstanta kisline**:

$$K_\mathrm{a} = \frac{[\mathrm{H_3O^+}][\mathrm{A^-}]}{[\mathrm{HA}]}$$

Vode v izrazu ni, ker je v velikem prebitku. Večja $K_\mathrm{a}$ pomeni močnejšo kislino. Ker so vrednosti zelo majhne, pogosto uporabljamo $\mathrm{p}K_\mathrm{a}$; manjši $\mathrm{p}K_\mathrm{a}$ pomeni močnejšo kislino.

$$\mathrm{p}K_\mathrm{a} = -\log K_\mathrm{a}$$

Računamo s tabelo, ki jo že poznaš. Na začetku je kisline $c$, ionov nič. Disociira $x$ kisline, nastane $x$ ionov $\mathrm{H_3O^+}$ in $x$ ionov $\mathrm{A^-}$. V ravnotežju velja $K_\mathrm{a} = \dfrac{x^2}{c - x}$. Kadar je $x$ manj kot $5\,\%$ od $c$, smemo pisati $c - x \approx c$ in dobimo približek:

$$[\mathrm{H_3O^+}] \approx \sqrt{K_\mathrm{a} \cdot c}$$

Za ocetno kislino ($K_\mathrm{a} = 1{,}8 \cdot 10^{-5}$, $\mathrm{p}K_\mathrm{a} = 4{,}74$) s koncentracijo $0{,}10\,\mathrm{mol/L}$ je $[\mathrm{H_3O^+}] = 1{,}3 \cdot 10^{-3}\,\mathrm{mol/L}$ in $\mathrm{pH} = 2{,}87$. Disociiranih je le $1{,}3\,\%$ molekul. Temu deležu rečemo **stopnja disociacije** $\alpha = \dfrac{x}{c}$.

| | HCl | $\mathrm{CH_3COOH}$ |
|---|---|---|
| disociacija | popolna | $1{,}3\,\%$ |
| $[\mathrm{H_3O^+}]$ pri $0{,}10\,\mathrm{mol/L}$ | $0{,}10\,\mathrm{mol/L}$ | $1{,}3 \cdot 10^{-3}\,\mathrm{mol/L}$ |
| pH pri $0{,}10\,\mathrm{mol/L}$ | $1{,}00$ | $2{,}87$ |
| pH pri $0{,}010\,\mathrm{mol/L}$ | $2{,}00$ | $3{,}37$ |

:::premisli
Rešitev uganke je $3{,}37$. Zakaj se pH ocetne kisline ob 10-kratnem redčenju dvigne le za $0{,}50$, pH kisline HCl pa za cel $1$?
---
Pri šibki kislini je $[\mathrm{H_3O^+}] \approx \sqrt{K_\mathrm{a} \cdot c}$. Če je $c$ 10-krat manjša, je $[\mathrm{H_3O^+}]$ manjša le $\sqrt{10} \approx 3{,}16$-krat, pH pa zraste za $\log 3{,}16 = 0{,}50$. Ravnotežje se ob redčenju premakne v desno: disociira večji delež molekul ($\alpha$ zraste z $1{,}3\,\%$ na $4{,}2\,\%$) in delno nadomesti izgubljene ione.
:::

**3. Baze in konjugirani pari.** Šibka baza B sprejme proton od vode: $\mathrm{B + H_2O \rightleftharpoons BH^+ + OH^-}$, njena konstanta je $K_\mathrm{b}$. Za kislino in njeno konjugirano bazo velja preprosta zveza, v kateri je $K_\mathrm{w} = [\mathrm{H_3O^+}][\mathrm{OH^-}]$ **ionski produkt vode**:

$$K_\mathrm{a} \cdot K_\mathrm{b} = K_\mathrm{w}$$

Pri $25\,\mathrm{°C}$ je $K_\mathrm{w} = 1{,}0 \cdot 10^{-14}$. Z oznako $\mathrm{pOH} = -\log [\mathrm{OH^-}]$ iz tega sledi $\mathrm{pH} + \mathrm{pOH} = 14{,}00$. Acetatni ion je torej šibka baza s $K_\mathrm{b} = \dfrac{1{,}0 \cdot 10^{-14}}{1{,}8 \cdot 10^{-5}} = 5{,}6 \cdot 10^{-10}$. To bo pomembno pri titraciji.

**4. Pufer proti čisti vodi.** V $1{,}0\,\mathrm{L}$ vode dodaj $0{,}010\,\mathrm{mol}$ HCl: pH pade s $7{,}00$ na $2{,}00$. Isto množino dodaj v $1{,}0\,\mathrm{L}$ raztopine, ki vsebuje $0{,}10\,\mathrm{mol}$ $\mathrm{CH_3COOH}$ in $0{,}10\,\mathrm{mol}$ $\mathrm{CH_3COO^-}$. Tu oksonijevi ioni ne ostanejo prosti. Acetat jih ujame: $\mathrm{CH_3COO^- + H_3O^+ \rightarrow CH_3COOH + H_2O}$. Reakcija poteče do konca, HCl je omejitveni reaktant. Ostane $0{,}11\,\mathrm{mol}$ kisline in $0{,}09\,\mathrm{mol}$ acetata.

Zmesi šibke kisline in njene konjugirane baze rečemo **pufer**. Kislinski del ujame dodani $\mathrm{OH^-}$, bazični del dodani $\mathrm{H_3O^+}$. Če izraz za $K_\mathrm{a}$ rešimo za $[\mathrm{H_3O^+}]$ in logaritmiramo, dobimo Henderson-Hasselbalchovo enačbo:

$$\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log \frac{n(\mathrm{A^-})}{n(\mathrm{HA})}$$

Ker sta obe snovi v isti prostornini, lahko namesto množin vstaviš koncentracije. Za naš pufer: pred dodatkom je $\mathrm{pH} = 4{,}74$, po dodatku pa $\mathrm{pH} = 4{,}74 + \log \frac{0{,}09}{0{,}11} = 4{,}65$. Sprememba je $0{,}09$ namesto $5$ enot. Pufer dobro deluje v območju $\mathrm{p}K_\mathrm{a} \pm 1$. Ko se ena od komponent porabi, se njegova zmogljivost konča.

:::premisli
Pufer s $\mathrm{pH} = 4{,}74$ razredčiš z vodo z $1\,\mathrm{L}$ na $10\,\mathrm{L}$. Napovej, kako se spremeni pH.
---
Skoraj nič se ne spremeni. Obe množini ostaneta enaki, razmerje $\frac{n(\mathrm{A^-})}{n(\mathrm{HA})}$ je še vedno $1$, zato je pH spet $4{,}74$. Pri šibki kislini brez baze bi pH ob takem redčenju zrasel za $0{,}5$. Šele pri zelo velikem redčenju začneta pomeniti disociacija kisline in ioni iz vode.
:::

**5. Titracijska krivulja: močna kislina proti šibki.** Pri titraciji v kislino po kapljicah dodajamo bazo znane koncentracije in merimo pH. **Točka ekvivalence** je trenutek, ko je dodane baze ravno toliko, kolikor je bilo kisline. Na sliki sta krivulji za $25{,}0\,\mathrm{mL}$ kisline s koncentracijo $0{,}100\,\mathrm{mol/L}$, titrirane z NaOH enake koncentracije.

:::risba graf
opis: Dve titracijski krivulji, 25,0 mL kisline s koncentracijo 0,100 mol/L titriramo z NaOH s koncentracijo 0,100 mol/L. Vodoravna os: prostornina dodane NaOH od 0 do 50 mL. Navpična os: pH od 0 do 14. Črtkana krivulja za HCl se začne pri pH 1,00, raste počasi in pri 25 mL navpično skoči skozi pH 7. Debela polna krivulja za ocetno kislino se začne pri pH približno 2,9, pri 12,5 mL ima pH 4,74, pri 25 mL pH 8,72. Od približno 26 mL naprej se krivulji prekrivata in se bližata pH 12,5.
x: 0 .. 50 | 5 | V(NaOH) / mL
y: 0 .. 14 | 2 | pH
črta: 0; 1,00 -> 2; 1,07 -> 4; 1,14 -> 6; 1,21 -> 8; 1,29 -> 10; 1,37 -> 12,5; 1,48 -> 15; 1,60 -> 18; 1,79 -> 20; 1,95 -> 22; 2,19 -> 23; 2,38 -> 24; 2,69 -> 24,5; 3,00 -> 24,9; 3,70 -> 25; 7,00 -> 25,1; 10,30 -> 25,5; 11,00 -> 26; 11,29 -> 27; 11,59 -> 28; 11,75 -> 30; 11,96 -> 35; 12,22 -> 40; 12,36 -> 45; 12,46 -> 50; 12,52 | oranžna črtkano
črta: 0; 2,88 -> 2; 3,70 -> 4; 4,03 -> 6; 4,25 -> 8; 4,42 -> 10; 4,57 -> 12,5; 4,74 -> 15; 4,92 -> 18; 5,16 -> 20; 5,35 -> 22; 5,61 -> 23; 5,81 -> 24; 6,13 -> 24,5; 6,44 -> 24,9; 7,14 -> 25; 8,72 -> 25,1; 10,30 -> 25,5; 11,00 -> 26; 11,29 -> 27; 11,59 -> 28; 11,75 -> 30; 11,96 -> 35; 12,22 -> 40; 12,36 -> 45; 12,46 -> 50; 12,52 | modra debelo
točka: 12,5; 4,74 | pH = pK_a | nad levo
točka: 25; 8,72 | 8,72 | levo
točka: 25; 7 | 7,00 | desno
napis: 7; 6,2 | ocetna kislina | sredina
napis: 9; 0,5 | HCl | sredina
:::

Razlike med krivuljama razložiš z vsem, kar je zgoraj:

- **Začetek.** HCl ima $\mathrm{pH} = 1{,}00$, ocetna kislina okoli $2{,}9$, ker je šibka.
- **Pufrsko območje.** Pri ocetni kislini NaOH pretvarja kislino v acetat, zato nastaja pufer in krivulja je položna. Pri polovični nevtralizaciji ($12{,}5\,\mathrm{mL}$) sta $n(\mathrm{A^-})$ in $n(\mathrm{HA})$ enaki, zato je $\mathrm{pH} = \mathrm{p}K_\mathrm{a} = 4{,}74$. S krivulje torej odčitaš $\mathrm{p}K_\mathrm{a}$.
- **Točka ekvivalence.** Pri HCl ostane le NaCl, $\mathrm{pH} = 7{,}00$. Pri ocetni kislini ostane acetat s koncentracijo $0{,}0500\,\mathrm{mol/L}$ (prostornina se je podvojila). Acetat je šibka baza: $[\mathrm{OH^-}] = \sqrt{5{,}6 \cdot 10^{-10} \cdot 0{,}0500} = 5{,}3 \cdot 10^{-6}\,\mathrm{mol/L}$, $\mathrm{pOH} = 5{,}28$ in $\mathrm{pH} = 8{,}72$. Za to titracijo zato izberemo indikator, ki se obarva nad pH 8 (fenolftalein).
- **Za točko ekvivalence.** pH določa prebitni NaOH, zato se krivulji prekrivata.

## Rešeni primeri

### Primer 1 (lažji): pH raztopine HF

Matirano steklo za zaslone jedkajo z razredčeno fluorovodikovo kislino. Izračunaj pH raztopine HF s koncentracijo $0{,}10\,\mathrm{mol/L}$ in jo primerjaj s HCl enake koncentracije. $K_\mathrm{a}(\mathrm{HF}) = 6{,}8 \cdot 10^{-4}$.

**Podatki:** $c(\mathrm{HF}) = 0{,}10\,\mathrm{mol/L}$, $K_\mathrm{a} = 6{,}8 \cdot 10^{-4}$, za primerjavo $c(\mathrm{HCl}) = 0{,}10\,\mathrm{mol/L}$
**Iščemo:** pH raztopine HF

:::formula
$K_\mathrm{a} = \dfrac{x^2}{c - x}$ in $\mathrm{pH} = -\log x$, kjer je $x = [\mathrm{H_3O^+}]$
:::

**Rešitev:**

1. Najprej poskusimo s približkom: $x \approx \sqrt{6{,}8 \cdot 10^{-4} \cdot 0{,}10} = 8{,}2 \cdot 10^{-3}$, torej $8{,}2 \cdot 10^{-3}\,\mathrm{mol/L}$. To je $8{,}2\,\%$ od $c$, več kot $5\,\%$, zato približek tu ni dovolj natančen.
2. Enačbo pomnožimo s $c - x$ in jo uredimo v kvadratno: $x^2 + 6{,}8 \cdot 10^{-4}\,x - 6{,}8 \cdot 10^{-5} = 0$.
3. Diskriminanta je $D = (6{,}8 \cdot 10^{-4})^2 + 4 \cdot 6{,}8 \cdot 10^{-5} = 2{,}72 \cdot 10^{-4}$.
4. Pozitivna rešitev (negativna koncentracija nima smisla):

$$x = \frac{-6{,}8 \cdot 10^{-4} + \sqrt{2{,}72 \cdot 10^{-4}}}{2} = 7{,}9 \cdot 10^{-3}$$

5. $\mathrm{pH} = -\log (7{,}9 \cdot 10^{-3}) = 2{,}10$, ker je $[\mathrm{H_3O^+}] = 7{,}9 \cdot 10^{-3}\,\mathrm{mol/L}$.
6. Odgovor: raztopina HF ima $\mathrm{pH} = 2{,}10$, HCl enake koncentracije pa $1{,}00$. Oksonijevih ionov je v HF približno 13-krat manj, disociiranih je $7{,}9\,\%$ molekul.

### Primer 2: pufer v jedkalni kopeli

Pufrirana jedkalna raztopina za čipe vsebuje v $1{,}00\,\mathrm{L}$ raztopine $0{,}50\,\mathrm{mol}$ HF in $1{,}00\,\mathrm{mol}$ amonijevega fluorida $\mathrm{NH_4F}$ (vir ionov $\mathrm{F^-}$). $\mathrm{p}K_\mathrm{a}(\mathrm{HF}) = 3{,}17$. Kolikšen je pH raztopine? Kolikšen je pH, ko vanjo zaide $0{,}10\,\mathrm{mol}$ HCl (prostornina se ne spremeni)? Kaj bi ista množina HCl naredila v $1{,}00\,\mathrm{L}$ vode?

**Podatki:** $V = 1{,}00\,\mathrm{L}$, $n(\mathrm{HF}) = 0{,}50\,\mathrm{mol}$, $n(\mathrm{F^-}) = 1{,}00\,\mathrm{mol}$, $\mathrm{p}K_\mathrm{a} = 3{,}17$, $n(\mathrm{HCl}) = 0{,}10\,\mathrm{mol}$
**Iščemo:** pH pred dodatkom HCl in po njem; pH vode z enakim dodatkom

:::formula
$\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log \dfrac{n(\mathrm{F^-})}{n(\mathrm{HF})}$
:::

**Rešitev:**

1. Pred dodatkom: $\mathrm{pH} = 3{,}17 + \log \frac{1{,}00}{0{,}50} = 3{,}47$.
2. HCl najprej zreagira z bazičnim delom pufra, do konca: $\mathrm{F^- + H_3O^+ \rightarrow HF + H_2O}$. HCl je omejitveni reaktant.
3. Nove množine: $n(\mathrm{F^-}) = 1{,}00 - 0{,}10 = 0{,}90$ in $n(\mathrm{HF}) = 0{,}50 + 0{,}10 = 0{,}60$, obe v molih.
4. Po dodatku: $\mathrm{pH} = 3{,}17 + \log \frac{0{,}90}{0{,}60} = 3{,}35$.
5. V vodi ostane vsa HCl: $[\mathrm{H_3O^+}] = 0{,}10\,\mathrm{mol/L}$, $\mathrm{pH} = 1{,}00$.
6. Odgovor: kopel ima $\mathrm{pH} = 3{,}47$, po dodatku HCl pa $3{,}35$; pH se spremeni le za $0{,}12$. V vodi bi isti dodatek znižal pH s $7{,}00$ na $1{,}00$.

### Primer 3 (težji): kopel z izbranim pH

Za nanašanje niklja na kontakte polnilnega priključka potrebujejo acetatni pufer s $\mathrm{pH} = 4{,}50$. Na voljo je $1{,}00\,\mathrm{L}$ ocetne kisline s koncentracijo $0{,}200\,\mathrm{mol/L}$ in trden NaOH. Koliko gramov NaOH moraš raztopiti v kislini? Prostornina se ne spremeni.

**Podatki:** $V = 1{,}00\,\mathrm{L}$, $c(\mathrm{CH_3COOH}) = 0{,}200\,\mathrm{mol/L}$, želeni $\mathrm{pH} = 4{,}50$, $\mathrm{p}K_\mathrm{a} = 4{,}74$, $M(\mathrm{NaOH}) = 40{,}00\,\mathrm{g/mol}$
**Iščemo:** maso $m(\mathrm{NaOH})$

:::formula
$\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log \dfrac{n(\mathrm{A^-})}{n(\mathrm{HA})}$, nato $m = n \cdot M$
:::

**Rešitev:**

1. Vprašanje je obrnjeno: pH poznamo, iščemo razmerje. $\log \frac{n(\mathrm{A^-})}{n(\mathrm{HA})} = 4{,}50 - 4{,}74 = -0{,}24$.
2. Razmerje je $10^{-0{,}24} = 0{,}575$.
3. Pufer naredimo z delno nevtralizacijo. Vsak mol NaOH pretvori mol kisline v acetat: $\mathrm{CH_3COOH + OH^- \rightarrow CH_3COO^- + H_2O}$. Če dodamo $y$ molov NaOH, je $n(\mathrm{A^-}) = y$ in $n(\mathrm{HA}) = 0{,}200 - y$.
4. Velja torej $\dfrac{y}{0{,}200 - y} = 0{,}575$. Izračunaj $y$ in maso NaOH sam, nato preveri.

:::premisli
Koliko je $y$ in koliko gramov NaOH potrebuješ?
---
$y = 0{,}575 \cdot (0{,}200 - y)$, torej $1{,}575\,y = 0{,}115$ in $y = 0{,}0730\,\mathrm{mol}$. Masa: $m = 0{,}0730 \cdot 40{,}00 = 2{,}92$, torej $2{,}92\,\mathrm{g}$ NaOH. Preizkus: $4{,}74 + \log \frac{0{,}0730}{0{,}127} = 4{,}50$.
:::

## Pogoste napake

- **»Šibka kislina ima $[\mathrm{H_3O^+}] = c$.«** Tako sklepaš, če šibko kislino obravnavaš kot močno. Disociira le majhen del molekul, zato potrebuješ $K_\mathrm{a}$. Ocetna kislina $0{,}10\,\mathrm{mol/L}$ nima pH $1{,}00$, ampak $2{,}87$.
- **Približek brez preizkusa.** $\sqrt{K_\mathrm{a} \cdot c}$ velja le, če je $x$ manj kot $5\,\%$ od $c$. Pri HF $0{,}10\,\mathrm{mol/L}$ to ne drži, zato rešiš kvadratno enačbo.
- **Dodana kislina naravnost v Henderson-Hasselbalchovo enačbo.** Dodani HCl ne smeš kar prišteti h kislini ali vstaviti kot $[\mathrm{H_3O^+}]$. Najprej izvedi reakcijo s konjugirano bazo (kot pri omejitvenem reaktantu), šele nato vstavi nove množine.
- **»V točki ekvivalence je pH vedno 7.«** To velja le za močno kislino in močno bazo. Pri šibki kislini v točki ekvivalence ostane njena konjugirana baza, zato je pH nad 7. Pri pH = $\mathrm{p}K_\mathrm{a}$ je polovična nevtralizacija, ne točka ekvivalence.
- **»Pufer je nevtralen« ali »pufer zdrži vse«.** pH pufra je blizu $\mathrm{p}K_\mathrm{a}$ in je lahko kisel ali bazičen. Ko se ena komponenta porabi, pufer ne deluje več.

## Povzetek

- Močna kislina disociira popolnoma: $[\mathrm{H_3O^+}] = c$, $\mathrm{pH} = -\log c$.
- Šibka kislina je v ravnotežju s konstanto $K_\mathrm{a}$; $[\mathrm{H_3O^+}] \approx \sqrt{K_\mathrm{a} \cdot c}$, če je disociiranih manj kot $5\,\%$, sicer kvadratna enačba. Ob 10-kratnem redčenju se pH dvigne le za $0{,}5$.
- Za konjugirani par velja $K_\mathrm{a} \cdot K_\mathrm{b} = K_\mathrm{w} = 1{,}0 \cdot 10^{-14}$.
- Pufer je zmes šibke kisline in njene konjugirane baze: $\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log \frac{n(\mathrm{A^-})}{n(\mathrm{HA})}$. Dodano močno kislino ali bazo najprej stehiometrično odštej oziroma prištej.
- Titracija šibke kisline z NaOH: pri polovični nevtralizaciji $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$, v točki ekvivalence je pH nad 7 (računaš ga s $K_\mathrm{b}$ konjugirane baze).

## Drugače: Na sliki

Stolpci kažejo pufer iz razlage pred dodatkom $0{,}010\,\mathrm{mol}$ HCl in po njem.

:::risba stolpci
opis: Štirje stolpci, množine v molih. Pred dodatkom HCl: CH₃COOH 0,10 mol in CH₃COO⁻ 0,10 mol. Po dodatku 0,010 mol HCl: CH₃COOH 0,11 mol in CH₃COO⁻ 0,09 mol.
os: n / mol
korak: 0,02
stolpec: HA prej | 0,10
stolpec: A⁻ prej | 0,10
stolpec: HA potem | 0,11
stolpec: A⁻ potem | 0,09
:::

Dodani oksonijevi ioni ne ostanejo v raztopini. Vsak pretvori en acetatni ion v molekulo kisline. En stolpec zato malo zraste, drugi malo pade. pH je odvisen le od razmerja stolpcev, $\frac{0{,}09}{0{,}11} = 0{,}82$, in to je še vedno blizu $1$. Pufer se »pokvari« šele, ko je eden od stolpcev skoraj prazen.

Tudi titracijsko krivuljo lahko bereš kot sliko teh stolpcev. Na začetku je samo stolpec HA, pri $12{,}5\,\mathrm{mL}$ sta stolpca enaka ($\mathrm{pH} = \mathrm{p}K_\mathrm{a}$), v točki ekvivalence ostane samo stolpec $\mathrm{A^-}$.

## Drugače: Iz vsakdanjega življenja

Tvoja kri je pufer. Ogljikova kislina in hidrogenkarbonatni ioni držijo pH krvi pri $7{,}4$. Ko med tekom mišice izločajo kisline, jih hidrogenkarbonat ujame, nastali $\mathrm{CO_2}$ pa izdihaš. Zato se pH krvi skoraj ne spremeni, čeprav nastaja precej kisline.

Podobno deluje pH-senzor v laboratoriju ali v pametnem akvariju: umerjajo ga s pufri s pH $4{,}01$ in $7{,}00$. Če na senzorju ostane kapljica prejšnje raztopine, na primer baze, se pH pufra komaj spremeni. Razredčena HCl z enakim pH bi ob isti kapljici pokazala opazno drugo vrednost.

Kis je šibka kislina. Zato ga lahko ješ v solati, enako koncentrirane klorovodikove kisline pa ne.

## Preveri se

? Katera trditev je pravilna?
- Šibka kislina ima vedno višji pH kot močna kislina, ne glede na koncentraciji.
~ pH je odvisen tudi od koncentracije. Ocetna kislina $0{,}10\,\mathrm{mol/L}$ ima pH $2{,}87$, HCl $1{,}0 \cdot 10^{-4}\,\mathrm{mol/L}$ pa pH $4{,}00$.
+ $K_\mathrm{a}$ je pri stalni temperaturi stalna, stopnja disociacije pa z redčenjem narašča.
- Večja $K_\mathrm{a}$ pomeni šibkejšo kislino.
~ Obratno: večja $K_\mathrm{a}$ pomeni več ionov v ravnotežju, torej močnejšo kislino. Šibkejša kislina ima večji $\mathrm{p}K_\mathrm{a}$.
- V raztopini močne kisline je vzpostavljeno ravnotežje, v katerem je približno polovica molekul disociirana.
~ Močna kislina disociira popolnoma, zato je $[\mathrm{H_3O^+}] = c$. Ravnotežje z delno disociacijo je značilno za šibke kisline.
> $K_\mathrm{a}$ je ravnotežna konstanta in se z redčenjem ne spremeni. Delež disociiranih molekul $\alpha$ pa raste: pri ocetni kislini z $1{,}3\,\%$ ($0{,}10\,\mathrm{mol/L}$) na $4{,}2\,\%$ ($0{,}010\,\mathrm{mol/L}$).

? Poišči napako v rešitvi. Naloga: $1{,}0\,\mathrm{L}$ pufra vsebuje $0{,}10\,\mathrm{mol}$ $\mathrm{CH_3COOH}$ in $0{,}10\,\mathrm{mol}$ $\mathrm{CH_3COO^-}$ ($\mathrm{p}K_\mathrm{a} = 4{,}74$). Dodamo $0{,}020\,\mathrm{mol}$ NaOH. Kolikšen je pH?
Rešitev: (1) Pred dodatkom je $\mathrm{pH} = 4{,}74 + \log 1 = 4{,}74$. (2) NaOH je močna baza, zato je $[\mathrm{OH^-}] = 0{,}020\,\mathrm{mol/L}$. (3) $\mathrm{pOH} = 1{,}70$, zato $\mathrm{pH} = 12{,}30$.
- Napaka je v koraku (1): pred dodatkom pH ni enak $\mathrm{p}K_\mathrm{a}$.
~ Korak (1) je pravilen: pri enakih množinah kisline in baze je $\log 1 = 0$ in $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$.
+ Napaka je v koraku (2): NaOH najprej zreagira s kislino v pufru, zato $\mathrm{OH^-}$ ne ostane prost.
- Napaka je v koraku (3): iz $\mathrm{pOH} = 1{,}70$ sledi $\mathrm{pH} = 1{,}70$.
~ Korak (3) je zapisan pravilno, $\mathrm{pH} = 14{,}00 - \mathrm{pOH}$. Napačen je že vhodni podatek iz koraka (2).
> $\mathrm{CH_3COOH + OH^- \rightarrow CH_3COO^- + H_2O}$: ostane $0{,}08\,\mathrm{mol}$ kisline in $0{,}12\,\mathrm{mol}$ acetata, $\mathrm{pH} = 4{,}74 + \log \frac{0{,}12}{0{,}08} = 4{,}92$. Pufer je spremembo skoraj v celoti ujel.

? Senzor pH v laboratoriju umerijo s pufrom s pH $4{,}01$, ne z raztopino HCl s koncentracijo $1{,}0 \cdot 10^{-4}\,\mathrm{mol/L}$, ki ima pH $4{,}00$. Zakaj?
- Ker HCl kot močna kislina vedno pokaže pH 0.
~ pH močne kisline je $-\log c$. Pri $1{,}0 \cdot 10^{-4}\,\mathrm{mol/L}$ je to $4{,}00$, ne $0$.
+ Ker se pH pufra ob sledovih kisline ali baze, ki ostanejo na senzorju ali v posodi, skoraj ne spremeni, pH tako razredčene HCl pa se opazno spremeni.
- Ker je pufer nevtralen in zato ne poškoduje senzorja.
~ Pufer ni nujno nevtralen: ta ima pH $4{,}01$. Njegov pH je blizu $\mathrm{p}K_\mathrm{a}$ izbrane kisline.
> Raztopina HCl s pH $4{,}00$ vsebuje zelo malo ionov $\mathrm{H_3O^+}$, zato jo vsaka primes premakne. Pufer ima v zalogi kislinski in bazični del, ki ujameta dodane ione, zato je pH stalen.

? $25{,}0\,\mathrm{mL}$ ocetne kisline s koncentracijo $0{,}100\,\mathrm{mol/L}$ ($\mathrm{p}K_\mathrm{a} = 4{,}74$) titriramo z NaOH s koncentracijo $0{,}100\,\mathrm{mol/L}$. Kolikšen je pH, ko dodamo $15{,}0\,\mathrm{mL}$ NaOH?
= 4,92 | 0,02
~ 4,56 | Razmerje si obrnil. V števcu je baza: $\log \frac{n(\mathrm{A^-})}{n(\mathrm{HA})} = \log \frac{1{,}5}{1{,}0}$.
~ 4,74 | To je pH pri polovični nevtralizaciji ($12{,}5\,\mathrm{mL}$). Pri $15{,}0\,\mathrm{mL}$ je acetata več kot kisline.
~ 12,57 | NaOH ni ostal prost: z ocetno kislino je zreagiral in nastal je pufer.
> $n(\mathrm{HA})_0 = 2{,}50\,\mathrm{mmol}$, $n(\mathrm{OH^-}) = 1{,}50\,\mathrm{mmol}$. Ostane $1{,}00\,\mathrm{mmol}$ kisline, nastane $1{,}50\,\mathrm{mmol}$ acetata. $\mathrm{pH} = 4{,}74 + \log 1{,}5 = 4{,}92$.

? Na sliki sta titracijski krivulji dveh šibkih kislin A in B. Obe imata koncentracijo $0{,}100\,\mathrm{mol/L}$ in prostornino $25{,}0\,\mathrm{mL}$, titriramo ju z NaOH s koncentracijo $0{,}100\,\mathrm{mol/L}$. Primerjaj kislini. Katera trditev je pravilna?
:::risba graf
opis: Titracijski krivulji dveh šibkih kislin, vodoravna os prostornina NaOH od 0 do 50 mL, navpična os pH od 0 do 14. Polna krivulja A se začne pri pH 2,5, pri 12,5 mL ima pH 4,0, pri 25 mL pH 8,35. Črtkana krivulja B se začne pri pH 4,0, pri 12,5 mL ima pH 7,0, pri 25 mL pH 9,85. Po 26 mL se krivulji prekrivata.
x: 0 .. 50 | 5 | V(NaOH) / mL
y: 0 .. 14 | 2 | pH
črta: 0; 2,51 -> 2; 3,00 -> 5; 3,41 -> 8; 3,68 -> 12,5; 4,00 -> 17; 4,33 -> 20; 4,60 -> 22; 4,87 -> 24; 5,38 -> 24,5; 5,69 -> 25; 8,35 -> 25,5; 11,00 -> 26; 11,29 -> 28; 11,75 -> 30; 11,96 -> 35; 12,22 -> 40; 12,36 -> 45; 12,46 -> 50; 12,52 | modra debelo
črta: 0; 4,00 -> 2; 5,94 -> 5; 6,40 -> 8; 6,67 -> 12,5; 7,00 -> 17; 7,33 -> 20; 7,60 -> 22; 7,87 -> 24; 8,38 -> 24,5; 8,69 -> 25; 9,85 -> 25,5; 11,00 -> 26; 11,29 -> 28; 11,75 -> 30; 11,96 -> 35; 12,22 -> 40; 12,36 -> 45; 12,46 -> 50; 12,52 | oranžna črtkano
točka: 12,5; 4 | A | pod
točka: 12,5; 7 | B | nad
:::
- Kislina B je močnejša, ker ima njena krivulja višje vrednosti pH.
~ Višji pH na začetku pomeni manj ionov $\mathrm{H_3O^+}$, torej šibkejšo kislino.
+ $K_\mathrm{a}$ kisline B je približno $1 \cdot 10^{-7}$, ker je pri $12{,}5\,\mathrm{mL}$ njen pH $7{,}0$.
- V točki ekvivalence imata obe kislini pH 7, ker sta porabili enako NaOH.
~ Enaka je le prostornina NaOH v točki ekvivalence ($25\,\mathrm{mL}$). pH je nad 7 in je višji pri šibkejši kislini B ($9{,}85$ proti $8{,}35$).
- Kislina A ima $\mathrm{p}K_\mathrm{a} = 2{,}5$, ker se njena krivulja začne pri pH $2{,}5$.
~ Začetni pH ni $\mathrm{p}K_\mathrm{a}$. $\mathrm{p}K_\mathrm{a}$ odčitaš pri polovični nevtralizaciji: za A je to $4{,}0$.
> Pri polovični nevtralizaciji je $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$. Za B je $\mathrm{p}K_\mathrm{a} = 7{,}0$, torej $K_\mathrm{a} = 10^{-7}$; za A je $K_\mathrm{a} = 10^{-4}$. A je močnejša, B šibkejša, zato ima B višji začetni pH in višji pH v točki ekvivalence.

<<RACUN
vrednost: sqrt(1.8e-5*0.10) | 0.00134
vrednost: -log(0.00134, 10) | 2.87
vrednost: -log(sqrt(1.8e-5*0.010), 10) | 3.37
vrednost: sqrt(6.8e-4*0.10) | 0.0082
vrednost: (6.8e-4)^2+4*6.8e-5 | 2.72e-4
resi: x^2+6.8e-4*x-6.8e-5=0 | x | 0.00791, -0.00859
vrednost: -log(0.0079, 10) | 2.10
vrednost: 3.17+log(1.00/0.50, 10) | 3.47
vrednost: 3.17+log(0.90/0.60, 10) | 3.35
vrednost: 4.74+log(0.09/0.11, 10) | 4.65
vrednost: 10^(4.50-4.74) | 0.575
resi: y/(0.200-y)=0.575 | y | 0.0730
vrednost: 0.0730*40.00 | 2.92
vrednost: 1.0e-14/1.8e-5 | 5.6e-10
vrednost: sqrt(5.6e-10*0.0500) | 5.3e-6
vrednost: 14+log(sqrt(5.56e-10*0.0500), 10) | 8.72
vrednost: sqrt(1.8e-5*0.010)/0.010 | 0.042
vrednost: 4.74+log(1.00/1.50, 10) | 4.56
vrednost: 4.74+log(1.50/1.00, 10) | 4.92
kemija: CH3COOH + OH- -> CH3COO- + H2O
kemija: F- + H3O+ -> HF + H2O
>>

:::simboli
\mathrm{pH} | pH | \mathrm{pH} = -\log [\mathrm{H_3O^+}] | – |
K_\mathrm{a} | konstanta kisline | K_\mathrm{a} = \frac{[\mathrm{H_3O^+}][\mathrm{A^-}]}{[\mathrm{HA}]} | – | večja $K_\mathrm{a}$ pomeni močnejšo kislino
\mathrm{p}K_\mathrm{a} | negativni logaritem konstante kisline | \mathrm{p}K_\mathrm{a} = -\log K_\mathrm{a} | – | manjši $\mathrm{p}K_\mathrm{a}$ pomeni močnejšo kislino
c | začetna koncentracija kisline | | mol/L |
K_\mathrm{b} | konstanta baze | K_\mathrm{b} = \frac{K_\mathrm{w}}{K_\mathrm{a}} | – |
K_\mathrm{w} | ionski produkt vode | | – | $1{,}0 \cdot 10^{-14}$ pri $25\,\mathrm{°C}$
x | ravnotežna koncentracija oksonijevih ionov | x = [\mathrm{H_3O^+}] | mol/L |
m | masa NaOH | m = n \cdot M | g |
n | množina snovi | | mol |
\alpha | stopnja disociacije | \alpha = \frac{x}{c} | – | delež molekul kisline, ki odda proton
M | molska masa | | g/mol |
:::
