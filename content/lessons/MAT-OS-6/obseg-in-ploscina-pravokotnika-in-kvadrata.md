---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za doma: vzemi pravokoten pekač, kos vrvice, ravnilo in nekaj kvadratnih keksov ali kock sladkorja. Najprej z vrvico obkroži rob pekača in vrvico izmeri z ravnilom. Nato dno pekača tesno pokrij s keksi in jih preštej.

Dobil si dve števili. Obe opisujeta isti pekač, pa vendar merita nekaj čisto drugega. Vrvica pove, koliko traku bi potreboval, da okrasiš rob torte iz tega pekača. Keksi povedo, koliko peki papirja gre na dno. Prvemu številu rečemo **obseg**, drugemu **ploščina**.

V kuhinji in drugje ju ljudje pogosto zamenjajo. Kupijo preveč traku ali premalo ploščic. Ko ju znaš ločiti in izračunati, take napake ne narediš.

## Razlaga

**Pravokotnik in kvadrat.** Pravokotnik ima štiri prave kote. Nasprotni stranici sta enako dolgi, zato sta dovolj dve dolžini: $a$ (dolžina) in $b$ (širina). Kvadrat je poseben pravokotnik: vse štiri stranice so enako dolge, vsaka meri $a$.

**Obseg je rob.** Obseg $o$ je dolžina poti okrog lika, torej vsota dolžin vseh stranic. To je tvoja vrvica. Pri pravokotniku greš po robu $a$, $b$, $a$, $b$:

$$o = a + b + a + b = 2 \cdot (a + b)$$

Pri kvadratu greš štirikrat po $a$, zato $o = 4 \cdot a$. Obseg je dolžina, zato ga merimo v $\text{mm}$, $\text{cm}$, $\text{m}$ ali $\text{km}$.

**Ploščina je notranjost.** Tu je prva velika razlika. Ploščina $p$ ne meri roba, ampak pove, koliko ploskve lik pokrije. To so tvoji keksi. Ploščino merimo s kvadratki: **kvadratni centimeter** ($1\,\text{cm}^2$) je ploščina kvadrata s stranico $1\,\text{cm}$. Podobno sta $1\,\text{mm}^2$ in $1\,\text{m}^2$.

**Zakaj množimo.** Pravokotnik $4\,\text{cm} \times 3\,\text{cm}$ si predstavljaj na kvadratni mreži:

:::risba mreža
opis: Pravokotnik 4 cm krat 3 cm na kvadratni mreži: 3 vrste po 4 kvadratke, skupaj 12 kvadratkov po 1 cm².
vrstic: 3
stolpcev: 4
spodaj: 4 cm
desno: 3 cm
:::

Vrste so $3$, v vsaki so $4$ kvadratki. Skupaj $3 \cdot 4 = 12$ kvadratkov, torej $12\,\text{cm}^2$. Na splošno je v pravokotniku $b$ vrst po $a$ kvadratkov:

$$p = a \cdot b$$

Pri kvadratu sta obe stranici $a$, zato $p = a \cdot a = a^2$. Zapis $a^2$ beremo »$a$ na kvadrat«.

Rob istega lika pa meri $4 + 3 + 4 + 3 = 14\,\text{cm}$. Število $14$ je druga količina kot $12$ in ima drugo enoto.

:::premisli
Zakaj ploščine ne dobimo s seštevanjem $4 + 3$, kot pri obsegu?
---
Vsota $4 + 3 = 7$ pove le, koliko kvadratkov je v eni vrsti in koliko v enem stolpcu. Notranjost ima $3$ cele vrste po $4$ kvadratke, zato je treba množiti: $3 \cdot 4 = 12$.
:::

**Razlike na enem mestu.**

| | obseg | ploščina |
|---|---|---|
| kaj meri | dolžino roba | velikost notranjosti |
| kako dobim | seštejem stranice | preštejem kvadratke |
| pravokotnik | $o = 2 \cdot (a + b)$ | $p = a \cdot b$ |
| kvadrat | $o = 4 \cdot a$ | $p = a^2$ |
| enota | $\text{cm}$, $\text{m}$ | $\text{cm}^2$, $\text{m}^2$ |

**Ista enota za obe stranici.** Preden računaš, morata biti $a$ in $b$ v isti enoti. Pekač, dolg $0{,}4\,\text{m}$ in širok $25\,\text{cm}$, najprej zapiši kot $40\,\text{cm}$ in $25\,\text{cm}$.

**V simulaciji spodaj** (»Obseg in ploščina pravokotnika«) nastavi pravokotnik $4 \times 3$, nato obe stranici podvoji na $8 \times 6$. Opazuj, kolikokrat se poveča obseg in kolikokrat ploščina.

:::premisli
Napovej, preden pogledaš: pravokotnik $4\,\text{cm} \times 3\,\text{cm}$ povečamo na $8\,\text{cm} \times 6\,\text{cm}$. Kolikokrat večji je obseg in kolikokrat večja ploščina?
---
Obseg se podvoji: s $14\,\text{cm}$ na $28\,\text{cm}$, ker je vsaka stranica dvakrat daljša. Ploščina pa je štirikrat večja: z $12\,\text{cm}^2$ na $48\,\text{cm}^2$. Vrst je dvakrat več in vsaka vrsta je dvakrat daljša.
:::

**Obratna naloga.** Včasih poznaš ploščino in eno stranico. Ker je $p = a \cdot b$, drugo stranico dobiš z deljenjem: $b = p : a$. Če poznaš obseg pravokotnika in eno stranico, najprej izračunaš $a + b = o : 2$, nato odšteješ znano stranico.

## Rešeni primeri

### Primer 1: deska za rezanje

Deska za rezanje je pravokotnik, dolg $30\,\text{cm}$ in širok $20\,\text{cm}$. Okrog roba želiš nalepiti zaščitni trak, zgornjo ploskev pa pokriti s folijo. Koliko traku in koliko folije potrebuješ?

**Podatki:** $a = 30\,\text{cm}$, $b = 20\,\text{cm}$
**Iščemo:** obseg $o$ (trak) in ploščino $p$ (folija)

:::formula
$o = 2 \cdot (a + b)$, $\quad p = a \cdot b$
:::

**Rešitev:**

1. Trak gre po robu, zato računamo obseg: $o = 2 \cdot (30 + 20) = 2 \cdot 50 = 100\,\text{cm}$.
2. Folija pokrije ploskev, zato računamo ploščino: $p = 30 \cdot 20 = 600\,\text{cm}^2$.
3. Odgovor: potrebuješ $100\,\text{cm}$ traku in $600\,\text{cm}^2$ folije.

### Primer 2: kvadratni prtiček

Kvadratni kuhinjski prtiček ima stranico $32\,\text{cm}$. Babica želi okrog roba prišiti čipko. Koliko metrov čipke potrebuje in kolikšna je ploščina prtička?

**Podatki:** $a = 32\,\text{cm}$, kvadrat
**Iščemo:** obseg $o$ v metrih in ploščino $p$

:::formula
$o = 4 \cdot a$, $\quad p = a^2$, $\quad 1\,\text{m} = 100\,\text{cm}$
:::

**Rešitev:**

1. Čipka gre po robu, vse štiri stranice so enake: $o = 4 \cdot 32 = 128\,\text{cm}$.
2. V metre pretvarjamo iz manjše enote v večjo, zato delimo s $100$: $128\,\text{cm} = 1{,}28\,\text{m}$.
3. Ploščina: $p = 32 \cdot 32 = 1024\,\text{cm}^2$.
4. Odgovor: babica potrebuje $1{,}28\,\text{m}$ čipke, prtiček ima ploščino $1024\,\text{cm}^2$.

### Primer 3: neznana širina pekača

Dno pravokotnega pekača ima ploščino $1200\,\text{cm}^2$. Pekač je dolg $40\,\text{cm}$. Kako širok je? Koliko traku potrebuješ za okras roba torte iz tega pekača?

**Podatki:** $p = 1200\,\text{cm}^2$, $a = 40\,\text{cm}$
**Iščemo:** širino $b$ in obseg $o$

:::formula
$b = p : a$, nato $o = 2 \cdot (a + b)$
:::

**Rešitev:**

1. Ploščina je $a \cdot b$, zato neznano stranico dobimo z deljenjem: $b = 1200 : 40 = 30\,\text{cm}$.
2. Preverimo: $40 \cdot 30 = 1200$, drži.
3. Zdaj poznamo obe stranici: $o = 2 \cdot (40 + 30) = 2 \cdot 70 = 140\,\text{cm}$.
4. Odgovor: pekač je širok $30\,\text{cm}$, za rob potrebuješ $140\,\text{cm}$ traku.

### Primer 4: zdaj ti

Nad kuhinjskim pultom bodo obložili pas stene, dolg $3\,\text{m}$ in visok $60\,\text{cm}$. Ploščice so kvadratne, s stranico $20\,\text{cm}$. Koliko ploščic potrebujejo?

**Podatki:** $a = 3\,\text{m}$, $b = 60\,\text{cm}$, ploščica: kvadrat s stranico $20\,\text{cm}$
**Iščemo:** število ploščic

:::formula
število ploščic v vrsti $\cdot$ število vrst (ali: ploščina pasu $:$ ploščina ploščice)
:::

**Rešitev:**

1. Obe dolžini v isto enoto: $3\,\text{m} = 300\,\text{cm}$.
2. V eno vrsto gre $300 : 20 = 15$ ploščic.
3. Vrst je $60 : 20 = 3$.
4. Izračunaj sam, nato preveri:

:::premisli
Koliko ploščic skupaj? Zakaj enako dobiš, če ploščino pasu deliš s ploščino ene ploščice?
---
$15 \cdot 3 = 45$ ploščic. Enako dobiš s ploščinami, ker vsaka ploščica pokrije enako velik kos stene: pas meri $300 \cdot 60 = 18000\,\text{cm}^2$, ploščica $20 \cdot 20 = 400\,\text{cm}^2$, in $18000 : 400 = 45$.
:::

## Pogoste napake

- **Zamenjava obsega in ploščine.** »Za peki papir izračunam obseg.« Papir pokrije dno, ne roba. Pred računom se vprašaj: iščem rob (trak, ograja, čipka) ali notranjost (papir, folija, ploščice)?
- **Seštevanje samo dveh stranic.** »Obseg $6 \times 4$ je $10\,\text{cm}$.« Tako greš le po pol roba. Stranic so štiri: $o = 2 \cdot (6 + 4) = 20\,\text{cm}$.
- **Napačna enota.** »Ploščina je $24\,\text{cm}$.« Ploščino merimo s kvadratki, zato je enota $\text{cm}^2$. Obseg pa je dolžina in ima enoto $\text{cm}$.
- **Enak obseg, enaka ploščina.** »Pekača z enakim robom sprejmeta enako testa.« Ne drži: $20 \times 20$ in $30 \times 10$ imata oba obseg $80\,\text{cm}$, ploščini pa $400\,\text{cm}^2$ in $300\,\text{cm}^2$.
- **Pri obratni nalogi odštevanje.** »Ploščina $600$, stranica $30$, druga je $600 - 30$.« Ploščina je produkt stranic, zato drugo stranico dobiš z deljenjem: $600 : 30 = 20$.

## Povzetek

- Obseg je dolžina roba, vsota vseh stranic. Pravokotnik: $o = 2 \cdot (a + b)$. Kvadrat: $o = 4 \cdot a$. Enote: $\text{mm}$, $\text{cm}$, $\text{m}$, $\text{km}$.
- Ploščina pove, koliko kvadratkov pokrije lik. Pravokotnik: $p = a \cdot b$. Kvadrat: $p = a^2$. Enote: $\text{mm}^2$, $\text{cm}^2$, $\text{m}^2$.
- Pred računom obe stranici zapiši v isti enoti.
- Neznana stranica: $b = p : a$ ali $b = o : 2 - a$.
- Če podvojiš obe stranici, se obseg podvoji, ploščina pa poveča štirikrat.
- Enak obseg ne pomeni enake ploščine.
- Pri besedilni nalogi najprej odloči: rob (obseg) ali notranjost (ploščina)?

## Drugače: Na sliki

Nariši na karirast papir dva pekača, en kvadratek naj pomeni $1\,\text{cm}$ (pomanjšano):

:::risba mreža
opis: Pekač A na karirastem papirju: pravokotnik 6 krat 2 kvadratka, skupaj 12 kvadratkov.
vrstic: 2
stolpcev: 6
spodaj: 6 cm
desno: 2 cm
podnapis: pekač A: 6 × 2
:::

:::risba mreža
opis: Pekač B na karirastem papirju: kvadrat 4 krat 4 kvadratke, skupaj 16 kvadratkov.
vrstic: 4
stolpcev: 4
spodaj: 4 cm
desno: 4 cm
barva: oranžna
podnapis: pekač B: 4 × 4
:::

S prstom obkroži rob vsakega. Pri A narediš $6 + 2 + 6 + 2 = 16$ korakov, pri B $4 + 4 + 4 + 4 = 16$ korakov. Robova sta enako dolga.

Zdaj preštej kvadratke. A jih ima $12$, B pa $16$. Kvadratni pekač sprejme več testa, čeprav ima enako dolg rob.

Obseg torej šteješ **po robu** (daljice), ploščino **znotraj** (kvadratke).

## Drugače: Iz vsakdanjega življenja

**Rob: ograja, okvir, trak.** Okrog slike $40\,\text{cm} \times 25\,\text{cm}$ želiš nalepiti okrasni trak. Potrebuješ $2 \cdot (40 + 25) = 130\,\text{cm}$ traku. Kako velika je slika znotraj, te ne zanima.

**Notranjost: parket, barva, preproga.** Soba meri $4\,\text{m} \times 3\,\text{m}$. Za parket potrebuješ $4 \cdot 3 = 12\,\text{m}^2$. Za letvice ob steni pa bi računal obseg, $14\,\text{m}$.

Ista soba, dve števili, dve enoti. V trgovini zato prodajajo letvice v metrih, parket pa v kvadratnih metrih.

## Drugače: Bolj natančno

**Zakaj enota $\text{cm}^2$?** Ploščino merimo s kvadrati s stranico $1\,\text{cm}$. Ko množimo dolžino z dolžino, se zmnoži tudi enota: $\text{cm} \cdot \text{cm} = \text{cm}^2$.

**Kvadrat kot poseben pravokotnik.** Če v formulah za pravokotnik postaviš $b = a$, dobiš $o = 2 \cdot (a + a) = 4 \cdot a$ in $p = a \cdot a = a^2$. Novih pravil si ni treba zapomniti.

**Pretvarjanje enot ploščine.** Ker je $1\,\text{m} = 100\,\text{cm}$, je kvadrat s stranico $1\,\text{m}$ sestavljen iz $100$ vrst po $100$ kvadratnih centimetrov: $1\,\text{m}^2 = 100 \cdot 100\,\text{cm}^2 = 10000\,\text{cm}^2$. Pretvornik za ploščino ni $100$, ampak $10000$.

## Preveri se

? Pladenj meri $6\,\text{cm} \times 4\,\text{cm}$ (pomanjšan model). Kateri zapis se ujema z njim?
- $o = 24\,\text{cm}$, $p = 20\,\text{cm}^2$
~ Zamenjal si obseg in ploščino: $24$ je število kvadratkov, $20$ pa dolžina roba.
- $o = 10\,\text{cm}$, $p = 24\,\text{cm}^2$
~ $10$ je vsota samo dveh stranic. Rob ima štiri stranice: $2 \cdot (6 + 4)$.
+ $o = 20\,\text{cm}$, $p = 24\,\text{cm}^2$
- $o = 20\,\text{cm}^2$, $p = 24\,\text{cm}$
~ Števili sta pravi, enoti pa zamenjani. Obseg je dolžina ($\text{cm}$), ploščina se meri s kvadratki ($\text{cm}^2$).
> $o = 2 \cdot (6 + 4) = 20\,\text{cm}$, $p = 6 \cdot 4 = 24\,\text{cm}^2$.

? Deska za rezanje meri $38\,\text{cm} \times 21\,\text{cm}$. Približno kolikšna je njena ploščina?
- približno $60\,\text{cm}^2$
~ To je vsota dveh stranic. Ploščino dobiš z množenjem, ne s seštevanjem.
- približno $120\,\text{cm}^2$
~ To je približno obseg deske ($118\,\text{cm}$), torej dolžina roba, ne ploščina.
+ približno $800\,\text{cm}^2$
- približno $8000\,\text{cm}^2$
~ Pri oceni si dodal eno ničlo preveč. Zaokroži na $40$ in $20$ in ju zmnoži.
> Zaokrožimo: $40 \cdot 20 = 800$. Natančno: $38 \cdot 21 = 798\,\text{cm}^2$.

? Kvadratni pekač $20\,\text{cm} \times 20\,\text{cm}$ in pravokotni $30\,\text{cm} \times 10\,\text{cm}$ imata enak obseg, $80\,\text{cm}$. Zakaj gre v kvadratnega več testa?
- Ker ima kvadrat več stranic kot pravokotnik.
~ Oba imata štiri stranice. Odloča notranjost, ne število stranic.
+ Ker je njegova ploščina večja: $400\,\text{cm}^2$ namesto $300\,\text{cm}^2$.
- Ne gre, pri enakem obsegu je tudi ploščina enaka.
~ Enak rob ne pomeni enake notranjosti. Preštej kvadratke: $20 \cdot 20 = 400$, $30 \cdot 10 = 300$.
- Ker je stranica $30\,\text{cm}$ predolga za pečico.
~ Velikost pečice ne vpliva na to, koliko testa sprejme pekač. Primerjaj ploščini dna.
> Količino testa določa ploščina dna. Pri enakem obsegu ima kvadrat večjo ploščino kot podolgovat pravokotnik.

? Dno pekača ima ploščino $600\,\text{cm}^2$, pekač je dolg $30\,\text{cm}$. Kako širok je?
- $570\,\text{cm}$
~ Odštel si. Ploščina je produkt stranic, zato drugo stranico dobiš z deljenjem.
+ $20\,\text{cm}$
- $270\,\text{cm}$
~ Tako bi računal pri obsegu ($600 : 2 - 30$). Tu je $600$ ploščina, ne obseg.
- $18000\,\text{cm}$
~ Pomnožil si, namesto da bi delil. Iščemo stranico, ki s $30$ da $600$.
> $b = p : a = 600 : 30 = 20\,\text{cm}$. Preizkus: $30 \cdot 20 = 600$.

? Kvadratni kolač s stranico $24\,\text{cm}$ razrežemo na kvadratne koščke s stranico $6\,\text{cm}$. Koliko koščkov dobimo?
- $4$
~ To je le ena vrsta koščkov. Vrst je tudi $4$.
- $8$
~ Seštel si koščke ob dveh robovih. Notranjost ima $4$ vrste po $4$ koščke, zato množimo.
+ $16$
- $24$
~ $24$ je dolžina stranice v centimetrih, ne število koščkov.
> Ob stranici gredo $24 : 6 = 4$ koščki, vrst je $4$, skupaj $4 \cdot 4 = 16$. S ploščinami: $576 : 36 = 16$.

:::simboli
o | obseg lika | o = 2 \cdot (a + b) | | kvadrat: o = 4 · a
p | ploščina lika | p = a \cdot b | | kvadrat: p = a²
a | dolžina pravokotnika (stranica kvadrata) | |
b | širina pravokotnika | b = p : a |
:::
