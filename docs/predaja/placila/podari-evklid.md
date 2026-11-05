# »Podari Evklid« – predlog za j (4. 11. 2026)

Status: **predlog, čaka j-jevo odobritev. Koda šele po odobritvi.**

## V enem stavku
Kdor plača Evklid, lahko prostovoljno doda nekaj evrov. Iz tega sklada dobijo otroci iz družin z nižjimi dohodki brezplačno naročnino. Kdo je upravičen, odloči šola, mi pa ne vidimo nobenih podatkov o dohodkih.

## Kako deluje za kupca
1. Pri plačilu naročnine ali darilne kode je **neoznačeno** polje »Podari Evklid otroku, ki si ga ne more privoščiti«, z izbiro +2 € / +5 € / +10 € (1 mesec OŠ).
2. Na strani /sole in v Računu je tudi samostojen gumb »Podari mesec« za 9,99 €.
3. Na vidnem mestu je števec: »Podarjenih mesecev: 37 · že v uporabi: 29«. Tako vsak vidi, da denar res gre otrokom.

## Kako pride do otroka (brez podatkov o dohodkih)
- Šolska svetovalna služba ali razrednik dobi v Evklidu **kode »Podari«**, na primer 5 kod na šolo na trimesečje, a le toliko, kolikor jih sklad pokrije.
- Šola sama presodi, kdo jih potrebuje (npr. otroci s subvencionirano prehrano ali po presoji svetovalne službe). **Evklid tega nikoli ne vpraša in ne shrani.**
- Koda odpre 3 mesece naročnine za otrokovo stopnjo. Šola jo lahko podaljša, dokler je v skladu dovolj denarja.
- Na otrokovem profilu ni nobene oznake, tako da sošolci ne vidijo, kdo ima podarjeno naročnino.

## Denar in zakon
- Dokler j nima s.p., Evklid denarja ne more pobirati. Zato bi do takrat vse delovalo **samo v testnem načinu Stripe**, kot ostala plačila.
- To **ni donacija dobrodelni organizaciji**: ni davčne olajšave, za kupca je to nakup darila za neznanega prejemnika. Besedilo mora to jasno povedati, sicer zavaja. DDV in davek sta enaka kot pri navadni prodaji. Pred zagonom to potrdi računovodja.
- Ena »podarjena« OŠ mesečna naročnina stane j-ja okoli 2 $ AI, od 9,99 € pa ostane ~8,49 € neto. Sklad se torej pokrije sam, tudi če Evklid doda kakšen mesec od sebe.

## Možnost brez denarja (že zdaj)
Na pilotu (od 15. 11.) lahko vsaka pilotska šola dobi 2–3 kode »Podari« iz j-jevega proračuna za AI. 10 otrok × ~2 $ = **~20 $ na mesec**. Tako vidimo, ali šole kode res uporabljajo, še preden vzpostavimo sklad.

## Če j odobri: delo
En PR (~12 $, trojni pregled): tabela sklada in kode »Podari« (nadgradnja obstoječih darilnih kod `server/placila/darila.js`), polje pri plačilu, gumb »Podari mesec«, izdaja kod za šolo, števec ter besedila v sl + 32 jezikov. Splet in aplikacija hkrati.
