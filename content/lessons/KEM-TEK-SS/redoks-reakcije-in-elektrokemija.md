---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Baterija tvojega telefona ima napetost okoli $3{,}7\,\mathrm{V}$, alkalna baterija AA pa $1{,}5\,\mathrm{V}$. Člen iz cinka in bakra, ki ga sestaviš v šolskem laboratoriju, da $1{,}10\,\mathrm{V}$. Koliko takih členov moraš vezati zaporedno, da dosežeš vsaj napetost telefonske baterije?

Napetosti zaporedno vezanih členov se seštejejo. Trije dajo $3{,}30\,\mathrm{V}$, kar je premalo, štirje pa $4{,}40\,\mathrm{V}$. Ostane globlje vprašanje: zakaj da en litijev člen v telefonu več kot trikrat toliko kot cinkov-bakrov? Odgovor so standardni potenciali. Iz njih na tekmovanju napoveš, ali reakcija poteče, katera elektroda je anoda in kolikšna je napetost. Pred tem pa moraš znati urediti redoks enačbo, ker brez pravih koeficientov ne izračunaš ničesar.

## Razlaga

**1. Proton ali elektron.** Pri kislinah in bazah se prenaša proton: kislina ga odda, baza sprejme, moč kisline meri $K_\mathrm{a}$. Pri **redoks reakcijah** se prenašajo elektroni. **Reducent** elektrone odda in se pri tem **oksidira**: njegovo oksidacijsko število naraste. **Oksidant** elektrone sprejme in se **reducira**: oksidacijsko število pade. Kot ima kislina svojo konjugirano bazo, ima kovina cink svoj ion: par $\mathrm{Zn^{2+}/Zn}$ imenujemo **redoks par**. Moč takega para ne meri $K_\mathrm{a}$, ampak standardni potencial $E^\circ$.

**2. Urejanje: atomi in naboj.** Navadno enačbo urediš, ko se ujemajo atomi. Redoks enačba v ionski obliki mora izpolniti še dva pogoja: naboj je na obeh straneh enak in število oddanih elektronov je enako številu sprejetih. Enačba $\mathrm{Cu + Ag^+ \rightarrow Cu^{2+} + Ag}$ ima atome urejene, a levo je naboj $+1$, desno $+2$. Zato je napačna.

Zanesljiva pot je metoda polreakcij:

1. Določi oksidacijska števila in poišči, kaj se oksidira in kaj reducira.
2. Zapiši ločeno polreakcijo oksidacije in polreakcijo redukcije.
3. Uredi atome razen O in H.
4. V kislem uredi kisik z $\mathrm{H_2O}$, vodik pa z ioni $\mathrm{H^+}$.
5. Naboj izenači z elektroni.
6. Polreakciji pomnoži tako, da je elektronov enako, ju seštej in okrajšaj.
7. V bazičnem na obe strani dodaj toliko ionov $\mathrm{OH^-}$, kolikor je $\mathrm{H^+}$, in iz njiju nastane voda.

Tako na primer dobiš enačbo za permanganat, ki v bazičnem oksidira sulfit v sulfat, sam pa se reducira v $\mathrm{MnO_2}$: $\mathrm{2\,MnO_4^- + 3\,SO_3^{2-} + H_2O \rightarrow 2\,MnO_2 + 3\,SO_4^{2-} + 2\,OH^-}$. Na koncu vedno preveri atome in naboj: tu je naboj levo $-8$ in desno $-8$.

**3. Galvanski člen: ista reakcija, druga pot.** Cinkovo ploščico potopi v raztopino $\mathrm{CuSO_4}$. Na cinku se izloča rdečkasti baker, modra barva bledi, raztopina se segreje. Iz termokemije veš, da je reakcija eksotermna: energija gre v toploto. Zdaj reaktanta ločimo. Cink je v raztopini $\mathrm{ZnSO_4}$, baker v raztopini $\mathrm{CuSO_4}$, ploščici povezuje žica, raztopini pa **solni most**: cevka z raztopino soli, na primer $\mathrm{KNO_3}$. Elektroni morajo potovati po žici in na poti opravijo delo, na primer prižgejo diodo. Taki napravi rečemo **galvanski člen**.

:::risba skica
opis: Galvanski člen. Levo je čaša z raztopino ZnSO₄ in cinkovo ploščico, ki je anoda, negativni pol. Desno je čaša z raztopino CuSO₄ in bakreno ploščico, ki je katoda, pozitivni pol. Ploščici povezuje žica z voltmetrom. Puščica nad žico kaže, da elektroni tečejo od cinka k bakru. Čaši povezuje solni most.
območje: 0; -1 .. 12; 8,4
pravokotnik: 0,5; 0 .. 4,5; 3,5 | siva
pravokotnik: 7,5; 0 .. 11,5; 3,5 | siva
pravokotnik: 2,1; 1 .. 2,9; 5,5 | modra polno
pravokotnik: 9,1; 1 .. 9,9; 5,5 | oranžna polno
črta: 2,5; 5,5 -> 2,5; 6,8 -> 9,5; 6,8 -> 9,5; 5,5
krog: 6; 6,8 | 0,5 | siva
napis: 6; 6,8 | V | sredina
puščica: 3,2; 7,5 -> 5; 7,5 | e⁻ | nad
črta: 3,8; 2 -> 3,8; 4,7 -> 8,2; 4,7 -> 8,2; 2 | debelo
napis: 6; 4,1 | solni most | sredina
napis: 1,7; 5 | Zn | levo
napis: 10,3; 5 | Cu | desno
napis: 2,5; 0,5 | ZnSO_4 | sredina
napis: 9,5; 0,5 | CuSO_4 | sredina
napis: 2,5; -0,5 | anoda (−) | sredina
napis: 9,5; -0,5 | katoda (+) | sredina
:::

Elektroda, na kateri poteka oksidacija, je **anoda**: $\mathrm{Zn \rightarrow Zn^{2+} + 2\,e^-}$. V galvanskem členu je negativni pol, ker iz nje elektroni odhajajo v žico. Elektroda, na kateri poteka redukcija, je **katoda**: $\mathrm{Cu^{2+} + 2\,e^- \rightarrow Cu}$. Člen zapišemo z anodo levo: $\mathrm{Zn\,|\,Zn^{2+}\,||\,Cu^{2+}\,|\,Cu}$. Navpična črta je meja med kovino in raztopino, dvojna črta je solni most.

:::premisli
Zakaj člen brez solnega mostu takoj neha delovati, čeprav sta ploščici povezani z žico?
---
Ob anodi bi nastajali ioni $\mathrm{Zn^{2+}}$ in raztopina bi postala pozitivno nabita, ob katodi bi ionov $\mathrm{Cu^{2+}}$ zmanjkovalo in tam bi prevladali negativni ioni $\mathrm{SO_4^{2-}}$. Ta naboj bi ustavil nadaljnje prehajanje elektronov. Ioni iz solnega mostu potujejo v čaši in ohranjajo obe raztopini nevtralni, tako se krog sklene.
:::

**4. Standardni potencial.** Potenciala ene same elektrode ne moremo izmeriti, merimo le napetost med dvema. Zato vse elektrode primerjamo z isto: **standardna vodikova elektroda** ima po dogovoru $E^\circ = 0{,}00\,\mathrm{V}$. **Standardni potencial** $E^\circ$ redoks para je napetost člena iz tega para in vodikove elektrode pri $25\,\mathrm{°C}$, koncentracijah $1\,\mathrm{mol/L}$ in tlaku plinov $100\,\mathrm{kPa}$. Vrednosti so v tabelah, zapisane za redukcijo, na primer $\mathrm{Zn^{2+} + 2\,e^- \rightarrow Zn}$.

:::risba premica
opis: Lestvica standardnih potencialov od −1 do +1 V. Zn²⁺/Zn pri −0,76 V, Fe²⁺/Fe pri −0,44 V, 2H⁺/H₂ pri 0,00 V, Cu²⁺/Cu pri +0,34 V, Ag⁺/Ag pri +0,80 V. Levo so močnejši reducenti, desno močnejši oksidanti.
od: -1
do: 1
korak: 0,1
oznake: 0,5
točka: -0,76 | Zn | modra
točka: -0,44 | Fe | modra
točka: 0 | H₂ | siva
točka: 0,34 | Cu | oranžna
točka: 0,8 | Ag | oranžna
podnapis: E° v voltih: levo močnejši reducenti, desno močnejši oksidanti
:::

Lestvico bereš takole. Par z večjim $E^\circ$ ima močnejši oksidant (ion $\mathrm{Ag^+}$ rad sprejme elektron). Par z manjšim $E^\circ$ ima močnejši reducent (cink rad odda elektrone). V členu je zato katoda par z večjim potencialom, anoda par z manjšim:

$$\Delta E^\circ = E^\circ_\mathrm{katoda} - E^\circ_\mathrm{anoda}$$

Za cink in baker: $\Delta E^\circ = 0{,}34 - (-0{,}76) = 1{,}10$, torej $1{,}10\,\mathrm{V}$. Če je $\Delta E^\circ$ pozitivna, reakcija pri standardnih pogojih poteka sama od sebe. Čim večja je, tem več električnega dela opravi vsak preneseni elektron, saj je potencial energija na enoto naboja. Ko polreakcijo pomnožiš z 2, se prenese dvakrat več elektronov, energija na elektron pa ostane enaka. Zato $E^\circ$ nikoli ne množiš s koeficienti.

Zdaj razumeš telefon. Litij ima $E^\circ(\mathrm{Li^+/Li}) = -3{,}04\,\mathrm{V}$, najmanj od vseh kovin, zato je izjemno močan reducent in da veliko napetost. Prav zato bi burno reagiral z vodo. Litijevi akumulatorji imajo elektrolit v organskem topilu, elektrodi pa nista čisti kovini, zato je napetost člena okoli $3{,}7\,\mathrm{V}$.

:::premisli
Bakreno žico potopiš v raztopino $\mathrm{AgNO_3}$. Napovej, ali se bo kaj zgodilo, in izračunaj $\Delta E^\circ$.
---
Zgodi se. Baker ima manjši potencial, zato je anoda: $\Delta E^\circ = 0{,}80 - 0{,}34 = 0{,}46$, torej $0{,}46\,\mathrm{V} > 0$. Na žici rastejo srebrni kristalčki, raztopina postaja modra: $\mathrm{Cu + 2\,Ag^+ \rightarrow Cu^{2+} + 2\,Ag}$.
:::

## Rešeni primeri

### Primer 1 (lažji): člen nikelj-srebro

Sestavimo člen iz nikljeve elektrode v raztopini $\mathrm{Ni^{2+}}$ in srebrne elektrode v raztopini $\mathrm{Ag^+}$, oboje pri standardnih pogojih. Katera elektroda je anoda, kolikšna je standardna napetost in kakšna je skupna enačba?

**Podatki:** $E^\circ(\mathrm{Ni^{2+}/Ni}) = -0{,}26\,\mathrm{V}$, $E^\circ(\mathrm{Ag^+/Ag}) = +0{,}80\,\mathrm{V}$, standardni pogoji
**Iščemo:** anodo, $\Delta E^\circ$, urejeno skupno enačbo

:::formula
$\Delta E^\circ = E^\circ_\mathrm{katoda} - E^\circ_\mathrm{anoda}$
:::

**Rešitev:**

1. Nikelj ima manjši potencial, zato je močnejši reducent in se oksidira: nikljeva elektroda je anoda, srebrna katoda.
2. $\Delta E^\circ = 0{,}80 - (-0{,}26) = 1{,}06$, torej $1{,}06\,\mathrm{V}$.
3. Polreakciji: $\mathrm{Ni \rightarrow Ni^{2+} + 2\,e^-}$ in $\mathrm{Ag^+ + e^- \rightarrow Ag}$. Drugo pomnožimo z 2, da je elektronov enako.
4. Skupaj: $\mathrm{Ni + 2\,Ag^+ \rightarrow Ni^{2+} + 2\,Ag}$. Potenciala srebra ne pomnožimo z 2, ker je energija na elektron enaka.
5. Odgovor: anoda je nikelj, $\Delta E^\circ = 1{,}06\,\mathrm{V}$, zapis člena je $\mathrm{Ni\,|\,Ni^{2+}\,||\,Ag^+\,|\,Ag}$.

### Primer 2: urejanje v kislem

Vsebnost vodikovega peroksida v razkužilu določajo s titracijo z raztopino kalijevega permanganata v kislem. Pri tem nastaneta ion $\mathrm{Mn^{2+}}$ in kisik. Uredi ionsko enačbo.

**Podatki:** reaktanta $\mathrm{MnO_4^-}$ in $\mathrm{H_2O_2}$, produkta $\mathrm{Mn^{2+}}$ in $\mathrm{O_2}$, kislo okolje
**Iščemo:** urejeno ionsko enačbo

:::formula
Število oddanih elektronov = število sprejetih elektronov; kisik urejamo z $\mathrm{H_2O}$, vodik z $\mathrm{H^+}$.
:::

**Rešitev:**

1. Oksidacijska števila: Mn pade s $+7$ na $+2$ (redukcija, 5 elektronov). Kisik v $\mathrm{H_2O_2}$ naraste z $-1$ na $0$; ker sta v molekuli dva atoma O, molekula odda 2 elektrona.
2. Redukcija: $\mathrm{MnO_4^- + 8\,H^+ + 5\,e^- \rightarrow Mn^{2+} + 4\,H_2O}$. Štiri atome O smo vezali v vodo, osem H smo dodali kot $\mathrm{H^+}$, naboj levo $-1 + 8 - 5 = +2$ je enak desnemu.
3. Oksidacija: $\mathrm{H_2O_2 \rightarrow O_2 + 2\,H^+ + 2\,e^-}$.
4. Najmanjši skupni večkratnik 5 in 2 je 10: redukcijo pomnožimo z 2, oksidacijo s 5.
5. Seštejemo: $\mathrm{2\,MnO_4^- + 16\,H^+ + 5\,H_2O_2 \rightarrow 2\,Mn^{2+} + 8\,H_2O + 5\,O_2 + 10\,H^+}$.
6. Okrajšamo $10\,\mathrm{H^+}$: $\mathrm{2\,MnO_4^- + 5\,H_2O_2 + 6\,H^+ \rightarrow 2\,Mn^{2+} + 5\,O_2 + 8\,H_2O}$.
7. Preizkus naboja: levo $2 \cdot (-1) + 6 = 4$, desno $2 \cdot 2 = 4$. Ujema se.
8. Odgovor: $\mathrm{2\,MnO_4^- + 5\,H_2O_2 + 6\,H^+ \rightarrow 2\,Mn^{2+} + 5\,O_2 + 8\,H_2O}$.

### Primer 3 (težji): jedkanje tiskanega vezja

Bakrene povezave na tiskanem vezju telefona izdelajo tako, da nezaščiteni baker raztopijo v raztopini $\mathrm{FeCl_3}$. a) Ali ioni $\mathrm{Fe^{3+}}$ pri standardnih pogojih raztapljajo baker? Ali raztapljajo tudi posrebrene kontakte? b) Koliko bakra največ raztopi $250\,\mathrm{mL}$ raztopine s $c(\mathrm{Fe^{3+}}) = 1{,}00\,\mathrm{mol/L}$?

**Podatki:** $E^\circ(\mathrm{Fe^{3+}/Fe^{2+}}) = +0{,}77\,\mathrm{V}$, $E^\circ(\mathrm{Cu^{2+}/Cu}) = +0{,}34\,\mathrm{V}$, $E^\circ(\mathrm{Ag^+/Ag}) = +0{,}80\,\mathrm{V}$, $V = 250\,\mathrm{mL}$, $c(\mathrm{Fe^{3+}}) = 1{,}00\,\mathrm{mol/L}$, $M(\mathrm{Cu}) = 63{,}55\,\mathrm{g/mol}$
**Iščemo:** ali reakciji potečeta; največjo maso raztopljenega bakra $m(\mathrm{Cu})$

:::formula
$\Delta E^\circ = E^\circ_\mathrm{katoda} - E^\circ_\mathrm{anoda}$; $n = c \cdot V$; $m = n \cdot M$
:::

**Rešitev:**

1. Baker bi se oksidiral (anoda), $\mathrm{Fe^{3+}}$ bi se reduciral v $\mathrm{Fe^{2+}}$ (katoda): $\Delta E^\circ = 0{,}77 - 0{,}34 = 0{,}43$, torej $0{,}43\,\mathrm{V} > 0$. Reakcija poteče.
2. Za srebro: $\Delta E^\circ = 0{,}77 - 0{,}80 = -0{,}03$, torej $-0{,}03\,\mathrm{V} < 0$. Pri standardnih pogojih srebro ostane. Razlika je zelo majhna, zato se lahko pri drugih koncentracijah obrne.
3. Enačba: $\mathrm{Cu + 2\,Fe^{3+} \rightarrow Cu^{2+} + 2\,Fe^{2+}}$. En atom bakra odda 2 elektrona, vsak $\mathrm{Fe^{3+}}$ sprejme enega.
4. Množina oksidanta: $n(\mathrm{Fe^{3+}}) = 1{,}00 \cdot 0{,}250 = 0{,}250$, torej $0{,}250\,\mathrm{mol}$.
5. Zdaj ti: iz razmerja koeficientov izračunaj $n(\mathrm{Cu})$ in nato maso.

:::premisli
Koliko molov in gramov bakra raztopi raztopina?
---
Na 2 mola $\mathrm{Fe^{3+}}$ se raztopi 1 mol bakra: $n(\mathrm{Cu}) = \frac{0{,}250}{2} = 0{,}125$, torej $0{,}125\,\mathrm{mol}$. Masa: $m = 0{,}125 \cdot 63{,}55 = 7{,}94$, torej $7{,}94\,\mathrm{g}$ bakra.
:::

## Pogoste napake

- **Množenje potenciala s koeficientom.** Pri členu Ni|Ag nekdo izračuna $2 \cdot 0{,}80 + 0{,}26 = 1{,}86\,\mathrm{V}$. Napačno: $E^\circ$ je energija na enoto naboja in se z množenjem polreakcije ne spremeni. Pravilno je $1{,}06\,\mathrm{V}$.
- **Obrnjeno odštevanje.** $E^\circ_\mathrm{anoda} - E^\circ_\mathrm{katoda}$ da negativno napetost za reakcijo, ki v resnici poteka. Katoda je par z večjim potencialom, od nje odštej anodo.
- **Urejeni atomi, neurejen naboj.** $\mathrm{Cu + Ag^+ \rightarrow Cu^{2+} + Ag}$ ima enako atomov na obeh straneh, naboj pa ne. Pri vsaki ionski enačbi preveri tudi naboj.
- **»Oksidant se oksidira.«** Obratno: oksidant povzroči oksidacijo drugega, sam pa se reducira. Ion $\mathrm{Fe^{3+}}$ oksidira baker, sam postane $\mathrm{Fe^{2+}}$.
- **»Anoda je vedno pozitivna.«** Anoda je elektroda z oksidacijo. V galvanskem členu je negativni pol, pri elektrolizi pozitivni. Ne odloča lega na sliki, ampak smer elektronov: iz anode odhajajo.

## Povzetek

- Redoks reakcija je prenos elektronov: reducent jih odda in se oksidira, oksidant jih sprejme in se reducira.
- Urejanje s polreakcijami: atomi razen O in H, nato O z $\mathrm{H_2O}$, H z $\mathrm{H^+}$, naboj z $\mathrm{e^-}$; elektronov mora biti enako. V bazičnem $\mathrm{H^+}$ nevtraliziraš z $\mathrm{OH^-}$. Preveri atome in naboj.
- Galvanski člen: anoda (oksidacija, negativni pol), katoda (redukcija, pozitivni pol), solni most ohranja raztopini nevtralni. Zapis: anoda | ion || ion | katoda.
- Standardni potenciali so merjeni proti vodikovi elektrodi ($0{,}00\,\mathrm{V}$). Večji $E^\circ$ pomeni močnejši oksidant, manjši močnejši reducent.
- $\Delta E^\circ = E^\circ_\mathrm{katoda} - E^\circ_\mathrm{anoda}$; reakcija poteka sama, če je $\Delta E^\circ > 0$. Potencialov ne množiš s koeficienti.

## Drugače: Na sliki

Lestvico potencialov si predstavljaj kot klanec za elektrone. Elektroni se sami od sebe »kotalijo« od para z nižjim potencialom k paru z višjim; ker so negativni, je zanje »navzdol« v smeri večjega potenciala. Dolžina skoka je napetost člena.

:::risba premica
opis: Lestvica potencialov od −1 do +1 V. Zn pri −0,76 V, Cu pri +0,34 V, Ag pri +0,80 V. Lok od −0,76 do 0,34 je označen z 1,10 V: tako dolg je skok elektronov v členu cink-baker.
od: -1
do: 1
korak: 0,1
oznake: 0,5
točka: -0,76 | Zn | modra
točka: 0,34 | Cu | oranžna
točka: 0,8 | Ag | oranžna
skok: -0,76 -> 0,34 | 1,10 V
podnapis: Daljši skok pomeni večjo napetost člena.
:::

Če želiš veliko napetost, izbereš para čim bolj narazen: levo močan reducent, desno močan oksidant. Litij pri $-3{,}04\,\mathrm{V}$ bi bil daleč levo od roba te slike, zato so litijevi členi tako »močni«. Skok iz desne proti levi bi šel v breg: taka reakcija sama ne poteka.

## Drugače: Iz vsakdanjega življenja

Če se z amalgamsko plombo dotakneš aluminijaste folije, začutiš kratek zbodljaj. Aluminij ($E^\circ = -1{,}66\,\mathrm{V}$) in kovine v plombi tvorijo galvanski člen, slina je elektrolit, živec v zobu pa zazna tok.

Potemnelo srebrno verižico očistiš tako, da jo v vroči raztopini sode bikarbone in soli položiš na aluminijasto folijo. Aluminij je močnejši reducent in ione srebra iz črne obloge reducira nazaj v srebro.

Tudi baterija v telefonu je galvanski člen. Ko se polni, polnilnik žene elektrone v nasprotno smer, kot bi tekli sami, in reakcijo obrne.

## Preveri se

? Na risbi je galvanski člen iz kovin X in Y. Puščica nad žico kaže smer elektronov. Katera trditev je pravilna?
:::risba skica
opis: Galvanski člen. Levo čaša s kovino X v raztopini njenih ionov, desno čaša s kovino Y v raztopini njenih ionov. Ploščici povezuje žica z voltmetrom, čaši solni most. Puščica nad žico kaže, da elektroni tečejo od desne elektrode Y k levi elektrodi X.
območje: 0; -0,5 .. 12; 8,4
pravokotnik: 0,5; 0 .. 4,5; 3,5 | siva
pravokotnik: 7,5; 0 .. 11,5; 3,5 | siva
pravokotnik: 2,1; 1 .. 2,9; 5,5 | modra polno
pravokotnik: 9,1; 1 .. 9,9; 5,5 | oranžna polno
črta: 2,5; 5,5 -> 2,5; 6,8 -> 9,5; 6,8 -> 9,5; 5,5
krog: 6; 6,8 | 0,5 | siva
napis: 6; 6,8 | V | sredina
puščica: 8,8; 7,5 -> 7; 7,5 | e⁻ | nad
črta: 3,8; 2 -> 3,8; 4,7 -> 8,2; 4,7 -> 8,2; 2 | debelo
napis: 1,7; 5 | X | levo
napis: 10,3; 5 | Y | desno
:::
- X je anoda, ker je na levi strani.
~ Lega na risbi ne odloča. Anodo prepoznaš po tem, da elektroni iz nje odhajajo v žico.
+ Y je anoda: na njej poteka oksidacija, elektroni iz nje odhajajo v žico.
- X je anoda, ker elektroni tečejo vanjo.
~ Elektroni tečejo v katodo, kjer jih sprejme oksidant. V X torej poteka redukcija.
> Elektroni odhajajo iz Y, torej Y oddaja elektrone in se oksidira: Y je anoda in negativni pol, X katoda. Y ima manjši standardni potencial kot X.

? Pri členu Ni|Ag polreakcijo srebra pomnožimo z 2. Zakaj standardnega potenciala srebra ne pomnožimo z 2?
- Ker je srebro katoda, potencial katode pa se nikoli ne množi; množi se le potencial anode.
~ Pravilo ni odvisno od elektrode. Ne množiš nobenega potenciala, ne katode ne anode.
- Pomnožiti bi ga morali, zato je prava napetost $1{,}86\,\mathrm{V}$.
~ $2 \cdot 0{,}80 + 0{,}26 = 1{,}86$ je tipična napaka. Izmerjena napetost tega člena je $1{,}06\,\mathrm{V}$.
+ Ker je potencial energija na enoto naboja: dvakrat več elektronov prenese dvakrat več energije, energija na elektron pa ostane enaka.
> Potencial je intenzivna količina, kot temperatura: dve enaki skodelici čaja nista dvakrat bolj vroči. Množenje z 2 spremeni množino snovi in naboja, ne pa napetosti.

? Člen je sestavljen iz bakrene elektrode ($E^\circ(\mathrm{Cu^{2+}/Cu}) = +0{,}34\,\mathrm{V}$) in neznane kovine M v raztopini ionov $\mathrm{M^{2+}}$. Kovina M je anoda, izmerjena standardna napetost je $0{,}78\,\mathrm{V}$. Kolikšen je $E^\circ(\mathrm{M^{2+}/M})$ v voltih?
= -0,44 V | 0,01
~ 0,44 | Pozabil si na predznak. Anoda ima manjši potencial kot katoda, ta pa je $+0{,}34\,\mathrm{V}$, zato mora biti $E^\circ$ kovine M negativen.
~ 1,12 | Tako dobiš, če M obravnavaš kot katodo. M je anoda: $E^\circ_\mathrm{anoda} = E^\circ_\mathrm{katoda} - \Delta E^\circ$.
> $0{,}78 = 0{,}34 - E^\circ(\mathrm{M})$, torej $E^\circ(\mathrm{M}) = -0{,}44\,\mathrm{V}$. To je železo.

? Odpadno tiskano vezje telefona vsebuje približno $2{,}0\,\mathrm{g}$ bakra. Oceni, koliko mililitrov raztopine $\mathrm{FeCl_3}$ s $c(\mathrm{Fe^{3+}}) = 1{,}0\,\mathrm{mol/L}$ potrebuješ vsaj, da ves baker raztopiš ($M(\mathrm{Cu}) = 63{,}55\,\mathrm{g/mol}$).
= 63 mL | 3
~ 31 | Pozabil si, da en atom bakra potrebuje dva iona $\mathrm{Fe^{3+}}$: $\mathrm{Cu + 2\,Fe^{3+} \rightarrow Cu^{2+} + 2\,Fe^{2+}}$.
> $n(\mathrm{Cu}) = \frac{2{,}0}{63{,}55} = 0{,}031\,\mathrm{mol}$, $n(\mathrm{Fe^{3+}}) = 0{,}063\,\mathrm{mol}$, $V = \frac{0{,}063}{1{,}0} = 0{,}063\,\mathrm{L}$, torej približno $63\,\mathrm{mL}$.

? Nosilec antene je iz jekla (železa), prevlečenega s cinkom. Prevleka se opraska in železo pride v stik z vlažnim zrakom. Kaj se zgodi? $E^\circ(\mathrm{Zn^{2+}/Zn}) = -0{,}76\,\mathrm{V}$, $E^\circ(\mathrm{Fe^{2+}/Fe}) = -0{,}44\,\mathrm{V}$.
- Na mestu praske takoj zarjavi železo, ker je izpostavljeno zraku.
~ Železo je v stiku s cinkom, ki je močnejši reducent. Elektrone oddaja cink, zato železo ostane zaščiteno.
+ Oksidira se cink, ker ima manjši potencial; železo ostane zaščiteno, dokler je cinka dovolj.
- Ne zgodi se nič, ker se elektroni med kovinama, ki se dotikata, izenačijo.
~ Kovini v stiku z vlago tvorita galvanski člen. Elektroni tečejo od cinka k železu, kjer se reducira kisik.
> Cink ($-0{,}76\,\mathrm{V}$) je anoda, železo ($-0{,}44\,\mathrm{V}$) katoda. Cink se »žrtvuje«, zato pocinkano železo ne rjavi niti na mestu praske.

<<RACUN
vrednost: 4*1.10 | 4.40
vrednost: 3*1.10 | 3.30
vrednost: 0.34-(-0.76) | 1.10
vrednost: 0.80-(-0.26) | 1.06
vrednost: 0.80-0.34 | 0.46
vrednost: 0.77-0.34 | 0.43
vrednost: 0.77-0.80 | -0.03
vrednost: 0.250/2*63.55 | 7.94
vrednost: 2.0/63.55*2/1.0*1000 | 62.9
resi: 0.34-x=0.78 | x | -0.44
kemija: Zn + Cu2+ -> Zn2+ + Cu
kemija: Ni + 2 Ag+ -> Ni2+ + 2 Ag
kemija: Cu + 2 Ag+ -> Cu2+ + 2 Ag
kemija: 2 MnO4- + 5 H2O2 + 6 H+ -> 2 Mn2+ + 5 O2 + 8 H2O
kemija: 2 MnO4- + 3 SO3^2- + H2O -> 2 MnO2 + 3 SO4^2- + 2 OH-
kemija: Cu + 2 Fe3+ -> Cu2+ + 2 Fe2+
>>

:::simboli
\Delta E | standardna napetost člena $\Delta E^\circ$ | \Delta E^\circ = E^\circ_\mathrm{katoda} - E^\circ_\mathrm{anoda} | V | pozitivna: reakcija poteka sama od sebe
E | standardni potencial elektrode: $E^\circ_\mathrm{katoda}$ (par, ki se reducira), $E^\circ_\mathrm{anoda}$ (par, ki se oksidira) | | V | katoda ima večji potencial
n | množina | n = c \cdot V | mol |
c | množinska koncentracija ionov $\mathrm{Fe^{3+}}$ | | mol/L |
V | prostornina raztopine | | L |
m | masa raztopljenega bakra | m = n \cdot M | g |
M | molska masa bakra | | g/mol |
:::
