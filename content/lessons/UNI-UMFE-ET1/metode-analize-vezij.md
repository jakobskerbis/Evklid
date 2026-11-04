---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sredi 19. stoletja je Evropo prepredla mreža telegrafskih linij. Zemljevid te mreže je bil hkrati električno vezje: mesta so bila vozlišča, žice med njimi veje, v postajah so bile baterije in sprejemniki. Inženirji so morali vedeti, kolikšen tok bo pritekel do sprejemnika v oddaljenem mestu, ali je baterija dovolj močna in kaj se zgodi, ko se priključi nova postaja.

Gustav Kirchhoff je že leta 1845 kot študent zapisal pravili za tokove v vozliščih in napetosti v zankah. Pravili veljata za vsako vezje, a pri veliki mreži dasta veliko enačb. Francoski telegrafski inženir Léon Charles Thévenin je leta 1883 objavil izrek, s katerim lahko vso mrežo »za« izbranim sprejemnikom nadomestiš z enim virom in enim upornikom. Podobno ugotovitev je že prej zapisal Hermann von Helmholtz. Arthur Kennelly je leta 1899 objavil, kako trikot upornikov zamenjaš z zvezdo.

Te tri zamisli so še danes osnovno orodje elektrotehnika: z njimi izračunaš vsako enosmerno vezje, ne le tisto, ki se razstavi na zaporedne in vzporedne dele.

## Razlaga

Najprej vezje, ki ga bomo ves čas uporabljali. Nariši ga kot majhen zemljevid:

```
  +---R1---A---R2---+
  |        |        |
 (U1)      R3      (U2)
  |        |        |
  +--------D--------+
```

Levo je vir $U_1 = 12\,\mathrm{V}$ z upornikom $R_1 = 2\,\Omega$, desno vir $U_2 = 3\,\mathrm{V}$ z upornikom $R_2 = 2\,\Omega$, v sredini upornik $R_3 = 4\,\Omega$. Pozitivni pol obeh virov je zgoraj. Zaporedne in vzporedne vezave tu ne prepoznaš, ker sta vira na različnih vejah.

Na zemljevidu najprej poiščemo **vozlišča**: točke, kjer se stikajo vsaj tri žice. Tu sta dve, $A$ in $D$. Del vezja med dvema vozliščema, po katerem teče isti tok, je **veja**. **Zanka** je vsaka sklenjena pot po vejah, kot krožni izlet, ki se konča tam, kjer se je začel.

| Veja | Elementi | Pot | Tok |
|---|---|---|---|
| 1 | $U_1$, $R_1$ | $D \to A$ | $I_1$ |
| 2 | $U_2$, $R_2$ | $D \to A$ | $I_2$ |
| 3 | $R_3$ | $A \to D$ | $I_3$ |

Smeri tokov v tabeli smo izbrali sami. Če pride tok negativen, teče v nasprotni smeri, in to ni napaka.

**Kirchhoffova zakona v sliki.** V vozlišču se naboj ne nabira: kolikor toka priteče, toliko ga odteče (Kirchhoffov zakon za tokove, KZT). V vozlišču $A$ torej $I_1 + I_2 = I_3$. Po vsaki zanki je vsota napetosti enaka nič (zakon za napetosti, KZN), tako kot je po krožnem izletu vsota vzponov in spustov nič. Vezje z $n$ vozlišči in $b$ vejami da $n - 1$ neodvisnih vozliščnih enačb in $b - n + 1$ neodvisnih zančnih enačb. Pri nas je to $1$ in $2$.

**Metoda vozliščnih potencialov.** Eno vozlišče izberemo za **referenčno** in mu pripišemo potencial $0$, kot morski gladini na zemljevidu. Naj bo to $D$. Neznanka je potem samo potencial $V_A$. Tok vsake veje izrazimo z njim in Ohmovim zakonom, npr. $I_3 = \frac{V_A}{R_3}$. Ko izraze vstavimo v KZT, dobimo eno samo enačbo.

:::premisli
Koliko neznank bi imela metoda vozliščnih potencialov pri vezju s petimi vozlišči? In koliko pri vezju, kjer dve vozlišči povezuje deset vzporednih vej?
---
Pri petih vozliščih štiri (vsa razen referenčnega). Pri dveh vozliščih le eno, ne glede na to, koliko vzporednih vej ju povezuje; zančnih enačb bi bilo tam $10 - 2 + 1 = 9$.
:::

**Metoda zančnih tokov.** Zdaj si zamisli, da po vsakem »okencu« vezja kroži svoj tok: $I_a$ po levem, $I_b$ po desnem, oba v smeri urinega kazalca. V zunanjih vejah teče samo en zančni tok. V skupni veji z $R_3$ tečeta oba, v nasprotnih smereh, zato je tok tam $I_a - I_b$. Za vsako okence zapišemo KZN in dobimo dve enačbi z dvema neznankama. Metoda se splača, ko je okenc manj kot vozlišč brez referenčnega.

**Theveninov nadomestni vir.** Pogosto nas zanima tok le v eni veji, npr. v sprejemniku. Vse ostalo vezje si zamisli kot zaprto škatlo z dvema sponkama. Thévenin je pokazal, da se vsaka taka škatla iz upornikov in virov navzven obnaša kot en vir $U_\mathrm{Th}$ z zaporednim upornikom $R_\mathrm{Th}$:

- $U_\mathrm{Th}$ je napetost na **odprtih sponkah** (breme odklopljeno);
- $R_\mathrm{Th}$ je upornost med sponkama, ko vire »ugasnemo«: napetostni vir nadomestimo s kratkim stikom, tokovni vir s prekinitvijo.

Tok v bremenu $R_\mathrm{p}$ je potem

$$I_\mathrm{p} = \frac{U_\mathrm{Th}}{R_\mathrm{Th} + R_\mathrm{p}}$$

:::premisli
Sponki škatle kratko skleneš. Kolikšen tok steče in kaj iz tega lahko sklepaš o $R_\mathrm{Th}$, če znaš izmeriti le napetost odprtih sponk in tok kratkega stika?
---
Steče $I_k = \frac{U_\mathrm{Th}}{R_\mathrm{Th}}$, ker je $R_\mathrm{p} = 0$. Zato $R_\mathrm{Th} = \frac{U_\mathrm{Th}}{I_k}$: dve meritvi na sponkah zadoščata, notranjosti škatle ni treba poznati.
:::

**Zvezda in trikot.** Trije uporniki med tremi točkami $A$, $B$, $C$ so lahko vezani v **trikot** (vsak med dvema točkama) ali v **zvezdo** (vsak od ene točke do skupnega središča). Na zemljevidu je to razlika med tremi kraji, povezanimi s tremi cestami, in tremi kraji, ki imajo ceste do enega skupnega križišča. Vezji sta enakovredni, če je upornost med vsakima točkama enaka. Iz trikota v zvezdo:

$$R_A = \frac{R_{AB} R_{CA}}{R_{AB} + R_{BC} + R_{CA}}$$

V števcu sta upornika trikota, ki se stikata v $A$; $R_B$ in $R_C$ dobiš enako. Obratno, iz zvezde v trikot:

$$R_{AB} = R_A + R_B + \frac{R_A R_B}{R_C}$$

Pri treh enakih upornikih velja $R_Y = \frac{R_\Delta}{3}$. Zamenjava razdre **mostiček** (vezje, v katerem noben par upornikov ni ne zaporeden ne vzporeden) in vezje se razstavi na zaporedne in vzporedne dele.

## Rešeni primeri

### Primer 1: vozliščni potencial

Za vezje z zemljevida zgoraj izračunaj potencial vozlišča $A$ in tokove vseh vej.

**Podatki:** $U_1 = 12\,\mathrm{V}$, $U_2 = 3\,\mathrm{V}$, $R_1 = 2\,\Omega$, $R_2 = 2\,\Omega$, $R_3 = 4\,\Omega$, referenčno vozlišče $D$
**Iščemo:** $V_A$, $I_1$, $I_2$, $I_3$

:::formula
KZT v $A$: $\dfrac{U_1 - V_A}{R_1} + \dfrac{U_2 - V_A}{R_2} = \dfrac{V_A}{R_3}$
:::

**Rešitev:**

1. Veja 1: potencial na vrhu vira je $U_1$, na drugi strani $R_1$ pa $V_A$, zato $I_1 = \frac{U_1 - V_A}{R_1}$. Enako za vejo 2.
2. Vstavimo: $\frac{12 - V_A}{2} + \frac{3 - V_A}{2} = \frac{V_A}{4}$.
3. Pomnožimo s $4$, da se znebimo ulomkov: $24 - 2V_A + 6 - 2V_A = V_A$, torej $30 = 5V_A$ in $V_A = 6\,\mathrm{V}$.
4. Tokovi: $I_1 = (12 - 6)/2 = 3\,\mathrm{A}$, $I_2 = (3 - 6)/2 = -1{,}5\,\mathrm{A}$, $I_3 = 6/4 = 1{,}5\,\mathrm{A}$.
5. Preverimo KZT: $3 + (-1{,}5) = 1{,}5$. Drži.
6. Odgovor: $V_A = 6\,\mathrm{V}$. Skozi $R_3$ teče $1{,}5\,\mathrm{A}$. Tok $I_2$ je negativen: $1{,}5\,\mathrm{A}$ teče od $A$ v desni vir, ki se torej polni.

### Primer 2: isto vezje z zančnimi tokovi

Isto vezje reši z metodo zančnih tokov in preveri rezultat iz primera 1.

**Podatki:** $U_1 = 12\,\mathrm{V}$, $U_2 = 3\,\mathrm{V}$, $R_1 = 2\,\Omega$, $R_2 = 2\,\Omega$, $R_3 = 4\,\Omega$; zančna tokova $I_a$ (levo) in $I_b$ (desno), oba v smeri urinega kazalca
**Iščemo:** $I_a$, $I_b$ in tok skozi $R_3$

:::formula
Levo okence: $U_1 = R_1 I_a + R_3 (I_a - I_b)$

Desno okence: $-U_2 = R_3 (I_b - I_a) + R_2 I_b$
:::

**Rešitev:**

1. Levo okence: vir $U_1$ prehodimo od minusa do plusa (napetost pridobimo), na uporih izgubljamo. Vstavimo: $12 = 6 I_a - 4 I_b$.
2. Desno okence: vir $U_2$ prehodimo od plusa do minusa, zato je na levi $-U_2$. Vstavimo: $-3 = -4 I_a + 6 I_b$.
3. Prvo enačbo pomnožimo s $3$, drugo z $2$ in ju seštejemo, da $I_b$ izpade: $36 - 6 = 10 I_a$, torej $I_a = 30/10 = 3\,\mathrm{A}$.
4. Iz druge enačbe: $6 I_b = -3 + 12 = 9$, torej $I_b = 9/6 = 1{,}5\,\mathrm{A}$.
5. Tok skozi $R_3$: $I_a - I_b = 3 - 1{,}5 = 1{,}5\,\mathrm{A}$, navzdol.
6. Odgovor: $I_a = 3\,\mathrm{A}$, $I_b = 1{,}5\,\mathrm{A}$, skozi $R_3$ teče $1{,}5\,\mathrm{A}$, enako kot v primeru 1. Desni zančni tok teče v smeri urinega kazalca skozi $U_2$ od plusa proti minusu, torej vir polni.

### Primer 3: telegrafska linija

Baterija v Ljubljani ima napetost $60\,\mathrm{V}$ (notranjo upornost zanemarimo). Linija do Celja ima upornost $400\,\Omega$. V Celju je med linijo in zemljo priključena naprava z upornostjo $600\,\Omega$. Od Celja do Maribora vodi linija z upornostjo $260\,\Omega$, v Mariboru je med linijo in zemljo sprejemnik. Kolikšen tok teče skozi sprejemnik z $100\,\Omega$ in kolikšen skozi sprejemnik s $400\,\Omega$?

**Podatki:** $U = 60\,\mathrm{V}$, $R_1 = 400\,\Omega$, $R_2 = 600\,\Omega$, $R_3 = 260\,\Omega$, $R_\mathrm{p} = 100\,\Omega$ ali $400\,\Omega$
**Iščemo:** tok skozi sprejemnik $I_\mathrm{p}$ za obe bremeni

:::formula
$U_\mathrm{Th} = U \dfrac{R_2}{R_1 + R_2}$, $R_\mathrm{Th} = \dfrac{R_1 R_2}{R_1 + R_2} + R_3$, $I_\mathrm{p} = \dfrac{U_\mathrm{Th}}{R_\mathrm{Th} + R_\mathrm{p}}$
:::

**Rešitev:**

1. Sprejemnik odklopimo. Skozi $R_3$ potem ne teče tok, zato je napetost v Mariboru enaka napetosti na napravi v Celju (delilnik): $U_\mathrm{Th} = 60 \cdot 600/1000 = 36\,\mathrm{V}$.
2. Baterijo nadomestimo s kratkim stikom. Iz Maribora vidimo $R_3$ zaporedno z vzporedno vezavo $R_1$ in $R_2$: $R_\mathrm{Th} = 240 + 260 = 500\,\Omega$, ker je $400 \cdot 600/1000 = 240$.
3. Sprejemnik s $100\,\Omega$: $I_\mathrm{p} = 36/600 = 0{,}06\,\mathrm{A}$.
4. Sprejemnik s $400\,\Omega$: $I_\mathrm{p} = 36/900 = 0{,}04\,\mathrm{A}$.
5. Odgovor: skozi sprejemnik teče $60\,\mathrm{mA}$ oziroma $40\,\mathrm{mA}$. Za drugo breme ni bilo treba znova reševati vsega vezja, le zadnji korak.

### Primer 4: zdaj ti – mostiček

Med sponkama $A$ in $D$ je mostiček: $R_{AB} = 20\,\Omega$, $R_{BC} = 30\,\Omega$, $R_{CA} = 50\,\Omega$ tvorijo trikot, od $B$ do $D$ je $14\,\Omega$, od $C$ do $D$ pa $5\,\Omega$. Kolikšna je upornost med $A$ in $D$?

**Podatki:** $R_{AB} = 20\,\Omega$, $R_{BC} = 30\,\Omega$, $R_{CA} = 50\,\Omega$, $R_{BD} = 14\,\Omega$, $R_{CD} = 5\,\Omega$
**Iščemo:** nadomestno upornost $R_{AD}$

:::formula
$R_A = \dfrac{R_{AB} R_{CA}}{\Sigma}$, $R_B = \dfrac{R_{AB} R_{BC}}{\Sigma}$, $R_C = \dfrac{R_{BC} R_{CA}}{\Sigma}$, $\Sigma = R_{AB} + R_{BC} + R_{CA}$
:::

**Rešitev:**

1. Noben par ni ne zaporeden ne vzporeden, zato trikot $ABC$ zamenjamo z zvezdo. Vsota: $20 + 30 + 50 = 100$.
2. $R_A = 20 \cdot 50/100 = 10\,\Omega$, $R_B = 20 \cdot 30/100 = 6\,\Omega$, $R_C = 30 \cdot 50/100 = 15\,\Omega$.
3. Od $A$ gre $R_A$ do središča $S$. Od $S$ do $D$ vodita dve poti: skozi $R_B$ in $14\,\Omega$ ter skozi $R_C$ in $5\,\Omega$. Dokončaj sam, nato preveri:

:::premisli
Kolikšna je $R_{AD}$?
---
Poti od $S$ do $D$: $6 + 14 = 20\,\Omega$ in $15 + 5 = 20\,\Omega$. Vzporedno: $10\,\Omega$. Zaporedno z $R_A$: $R_{AD} = 10 + 10 = 20\,\Omega$.
:::

## Pogoste napake

Večina napak pri teh metodah ne izvira iz algebre, ampak iz slike vezja.

- **Negativen tok je »napaka«.** Študent ob $I_2 = -1{,}5\,\mathrm{A}$ začne iskati napako ali spremeni predznak. Smer smo izbrali sami. Minus pove le, da tok teče v nasprotni smeri od puščice.
- **Skupna veja z enim tokom.** V KZN za levo okence zapiše $R_3 I_a$ namesto $R_3 (I_a - I_b)$. V skupni veji tečeta oba zančna tokova. Popravek: pri vsakem uporu se vprašaj, katera okenca ga delijo.
- **Preveč vozliščnih enačb.** Zapiše KZT za vsa vozlišča, tudi referenčno, in dobi odvisen sistem. Neodvisnih je le $n - 1$.
- **$R_\mathrm{Th}$ z delujočim virom.** Upornost med sponkama izračuna tako, da vir pusti v vezju ali ga prekine namesto kratko sklene. Napetostni vir ima idealno nič notranje upornosti, zato ga nadomesti kratek stik.
- **Napačen par v formuli za zvezdo.** Za $R_A$ vzame upornika, ki se ne stikata v $A$ (npr. $R_{BC} R_{CA}$). Popravek: v števcu sta tista dva, ki »objemata« oglišče $A$.

## Povzetek

- Vozlišče: stik vsaj treh žic; veja: pot med vozliščema z istim tokom; zanka: sklenjena pot.
- KZT: v vozlišču je vsota tokov nič; KZN: po zanki je vsota napetosti nič. Neodvisnih enačb: $n - 1$ vozliščnih, $b - n + 1$ zančnih.
- Vozliščna metoda: referenčni potencial $0$, neznanke so potenciali ostalih vozlišč, tokove vej izrazimo z Ohmovim zakonom.
- Zančna metoda: vsako okence ima svoj tok; v skupni veji je tok razlika zančnih tokov.
- Thevenin: del vezja z dvema sponkama $\to$ $U_\mathrm{Th}$ (odprte sponke) in $R_\mathrm{Th}$ (napetostni viri kratko sklenjeni); $I_\mathrm{p} = \frac{U_\mathrm{Th}}{R_\mathrm{Th} + R_\mathrm{p}}$.
- Trikot $\to$ zvezda: $R_A = \frac{R_{AB} R_{CA}}{\Sigma}$; pri enakih upornikih $R_Y = R_\Delta / 3$.
- Negativen rezultat pomeni le nasprotno smer toka.

## Drugače: Z analogijo

Električni potencial si predstavljaj kot nadmorsko višino na planinskem zemljevidu. Referenčno vozlišče je morska gladina. Napetost med dvema točkama je višinska razlika.

- Vir je žičnica: ljudi dvigne za stalno višino $U$.
- Upornik je pešpot navzdol: višina pada, in bolj ko je pot »uporna«, večji padec potrebuje isti tok ljudi.
- KZN: kdor gre na krožni izlet in se vrne na izhodišče, je skupaj prav toliko spustil, kot se je dvignil.
- KZT: na razpotju se pohodniki razdelijo, nihče ne izgine.

Vozliščna metoda vpraša, na kateri višini je vsako razpotje. Zančna metoda spremlja skupine pohodnikov, ki krožijo po posameznih krožnih poteh. Thevenin pove, da je za obiskovalca enega razgledišča vsa pokrajina za njim enakovredna eni žičnici in eni poti. Zvezda in trikot sta dve mreži poti, ki med tremi kočami dasta enak »napor«.

## Drugače: Iz vsakdanjega življenja

Pred dolgo vožnjo zaženeš avto s prižganimi lučmi. Luči za trenutek potemnijo. Akumulator se navzven obnaša kot Theveninov vir: brez bremena ima okoli $12{,}6\,\mathrm{V}$, njegova notranja upornost je le kakšna stotinka ohma.

Zaganjalnik pa potegne nekaj sto amperov. Pri $200\,\mathrm{A}$ in $0{,}01\,\Omega$ se na notranji upornosti izgubi $2\,\mathrm{V}$, zato na sponkah ostane le okoli $10{,}6\,\mathrm{V}$ in luči svetijo šibkeje. Ko motor teče, tok pade in napetost se vrne. Enako opaziš pri starem powerbanku: brez telefona kaže polno napetost, ob polnjenju pa ta pade, ker je njegova $R_\mathrm{Th}$ narasla.

## Preveri se

? Katera trditev **ne** sodi med pravila za izračun Theveninove upornosti $R_\mathrm{Th}$?
- Breme med sponkama odklopimo.
~ To sodi zraven: $R_\mathrm{Th}$ je upornost vezja »za« sponkama, brez bremena.
- Idealni napetostni vir nadomestimo s kratkim stikom.
~ To sodi zraven: idealni napetostni vir nima notranje upornosti.
+ Napetostni vir pustimo delovati in izmerimo napetost na sponkah.
- Idealni tokovni vir nadomestimo s prekinitvijo.
~ To sodi zraven: idealni tokovni vir ima neskončno notranjo upornost.
> Z delujočim virom izmerimo napetost odprtih sponk, to je $U_\mathrm{Th}$, ne $R_\mathrm{Th}$. Za $R_\mathrm{Th}$ vire ugasnemo.

? Trikot ima $R_{AB} = 10\,\Omega$, $R_{BC} = 20\,\Omega$, $R_{CA} = 30\,\Omega$. Kolikšen je upornik $R_A$ enakovredne zvezde?
- $3{,}3\,\Omega$
~ To je $\frac{R_{AB} R_{BC}}{60}$, to je $R_B$. Za $R_A$ vzameš upornika, ki se stikata v $A$.
+ $5\,\Omega$
- $10\,\Omega$
~ To je $\frac{R_{BC} R_{CA}}{60} = R_C$: v števcu je upornik nasproti $A$.
- $40\,\Omega$
~ To je vsota $R_{AB} + R_{CA}$. Upornika množimo in delimo z vsoto vseh treh.
> $R_A = \frac{R_{AB} R_{CA}}{R_{AB} + R_{BC} + R_{CA}} = \frac{10 \cdot 30}{60} = 5\,\Omega$.

? Na sponke Theveninovega vira priključujemo vse večje breme $R_\mathrm{p}$. Kaj se zgodi z napetostjo na bremenu?
- Pada proti nič, ker večji upor zmanjša tok.
~ Tok res pada, a napetost na bremenu je $R_\mathrm{p} I_\mathrm{p}$. Pada proti nič, ko gre $R_\mathrm{p}$ proti nič.
- Ostane enaka $U_\mathrm{Th}$ pri vsakem bremenu.
~ Ne, ker na $R_\mathrm{Th}$ teče tok in na njej se izgubi del napetosti.
+ Narašča in se približuje $U_\mathrm{Th}$.
> Večji $R_\mathrm{p}$ pomeni manjši tok, zato manjši padec na $R_\mathrm{Th}$. Pri zelo velikem bremenu je vezje skoraj odprto in napetost je skoraj $U_\mathrm{Th}$.

? Študent rešuje vezje z zemljevida z zančnimi tokovi. (1) Izbere $I_a$ in $I_b$ v smeri urinega kazalca. (2) Levo okence: $U_1 = R_1 I_a + R_3 I_a$. (3) Desno okence: $-U_2 = R_3 (I_b - I_a) + R_2 I_b$. (4) Reši sistem dveh enačb. Kateri korak je napačen?
- Korak 1
~ Smer zančnih tokov izberemo poljubno; urni kazalec je običajna izbira.
+ Korak 2
- Korak 3
~ Ta enačba je pravilna: v skupni veji je $I_b - I_a$, vir $U_2$ prehodimo od plusa do minusa.
- Korak 4
~ Dve okenci dasta dve neodvisni enačbi, to je pravo število.
> V skupni veji z $R_3$ tečeta oba zančna tokova v nasprotnih smereh. Pravilno: $U_1 = R_1 I_a + R_3 (I_a - I_b)$.

? Powerbank brez bremena kaže $5{,}0\,\mathrm{V}$. Ko polni telefon s tokom $1{,}0\,\mathrm{A}$, kaže $4{,}8\,\mathrm{V}$. Kolikšna je njegova notranja (Theveninova) upornost?
- $4{,}8\,\Omega$
~ To je $\frac{4{,}8\,\mathrm{V}}{1\,\mathrm{A}}$, upornost telefona, ne powerbanka.
- $5{,}0\,\Omega$
~ Napetost odprtih sponk deljena s tokom bremena ni $R_\mathrm{Th}$; tako bi dobil $R_\mathrm{Th} + R_\mathrm{p}$.
+ $0{,}2\,\Omega$
- $0{,}02\,\Omega$
~ Napaka v decimalkah: $\frac{0{,}2\,\mathrm{V}}{1{,}0\,\mathrm{A}}$ je $0{,}2\,\Omega$.
> Na notranji upornosti se izgubi $5{,}0 - 4{,}8 = 0{,}2\,\mathrm{V}$, zato $R_\mathrm{Th} = \frac{0{,}2\,\mathrm{V}}{1{,}0\,\mathrm{A}} = 0{,}2\,\Omega$.

:::simboli
U_1, U_2 | napetosti virov | | V
R_1, R_2, R_3 | upornosti vej | | Ω
V_A | potencial vozlišča $A$ | | V | glede na referenčno vozlišče $D$
I_1, I_2, I_3 | tokovi vej | | A | smer izberemo sami
I_a, I_b | zančna tokova | | A | v smeri urinega kazalca
U | napetost baterije | | V
U_\mathrm{Th} | Theveninova napetost | | V | napetost odprtih sponk
R_\mathrm{Th} | Theveninova upornost | R_\mathrm{Th} = \frac{U_\mathrm{Th}}{I_k} | Ω | viri ugasnjeni
A | vozlišče oz. točka $A$ | | | v zvezdi in trikotu oglišče
I_k | tok kratkega stika | I_k = \frac{U_\mathrm{Th}}{R_\mathrm{Th}} | A
R_\mathrm{p} | upornost bremena | | Ω
I_\mathrm{p} | tok skozi breme | I_\mathrm{p} = \frac{U_\mathrm{Th}}{R_\mathrm{Th} + R_\mathrm{p}} | A
R_{AB}, R_{BC}, R_{CA} | uporniki trikota | | Ω
R_A, R_B, R_C | uporniki zvezde | R_A = \frac{R_{AB} R_{CA}}{\Sigma} | Ω
\Sigma | vsota upornikov trikota | \Sigma = R_{AB} + R_{BC} + R_{CA} | Ω
R_Y | upornik zvezde (enaki uporniki) | R_Y = \frac{R_\Delta}{3} | Ω
R_\Delta | upornik trikota (enaki uporniki) | | Ω
:::
