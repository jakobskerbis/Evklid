# Urnik učenca

Učenec (Jaz → Urnik, na računalniku zavihek »Urnik«) vpiše svoje ure v tednu in datume testov, kolokvijev, izpitov, ustnih spraševanj in oddaj. Urnik je zaseben: vidi ga samo učenec (in starš na njegovi napravi); lige, učitelj in drugi učenci ga ne vidijo. Izbriše se z učencem in je v izvozu podatkov računa.

## Vnos

- **Ročno**: Dodaj uro (predmet, dan, šolska ura ali čas, učilnica) in Dodaj test (vrsta, predmet, datum, ura, snov). Šolska ura izpolni čase po običajnem zvoncu (1. ura 8.20–9.05 …), učenec jih lahko popravi.
- **Fotografija urnika**: model (privzeto `EVKLID_MODEL_DEEP`, nastavljivo s `EVKLID_SCHEDULE_MODEL`) prebere ure in datume; aplikacija pokaže predogled, učenec odkljuka, kar ni njegovo, in šele nato shrani. Brez API ključa ta del ne deluje (sporočilo).
- **Koledar .ics**: povezava (https ali webcal; samo javni naslovi, največ 3 MB) ali datoteka. Ponavljajoča se srečanja postanejo ure v tednu, posamezni kolokviji/testi/izpiti postanejo datumi, enkratni dogodki (npr. sprejem brucev) odpadejo. Povezan koledar se da osvežiti (gumb »Osveži«); ure, ki jih je učenec ob uvozu odkljukal (druge skupine vaj), se ne vrnejo.
- **Urnik UL FMF** (za študente): izbira letnika s strani urnik.fmf.uni-lj.si (seznam se prebere s strani, sicer vgrajen seznam); izvoz zajame cel semester z vajami po skupinah in kolokviji. »Moja skupina vaj« v predogledu odkljuka druge skupine.
- **Inštruktor v klepetu**: orodji `get_schedule` / `change_schedule` (»v petek pišem kontrolno iz ulomkov«). Povzetek (danes, jutri, testi v 30 dneh) je v dinamičnem delu prompta.

## Uporaba

- Kartica na Učni poti: »Danes imaš …« (po zadnji uri »Jutri imaš …«), naslednja ura s potjo v aplikaciji ima gumb **Ponovi pred uro** (po uri **Utrdi po uri**): 5 nalog (`progress.startClass`): snov, ki se je učenec zdaj uči, prepletena z nazadnje osvojenimi temami.
- **Priprava na test se nastavi sama** iz najbližjega testa (v 30 dneh, predmet z učno potjo): sklopi, ki jih je učenec izbral pri testu, sicer zadnja dva začeta sklopa. Ročno nastavljena priprava ima prednost; ko test izbrišeš ali mine, samodejna priprava odpade (`test_plans.event_id`).
- **Opomnik**: test danes ali jutri je poudarjen na Učni poti z gumbom »Pripravi se«. Če učenec vklopi »Obvestilo dan pred testom«, dobi še obvestilo naprave ob odprtju aplikacije (prava potisna obvestila pri zaprti aplikaciji pridejo z gostovanjem).

## Koda

`server/schedule.js` (preverjanje, .ics, FMF, branje fotografije, pogled, prompt, Priprava na test), `server/schedule-api.js` (HTTP), `public/schedule.js` + `public/schedule.css` (vmesnik), `public/settings-registry.js` (`SCHEDULE_SETTINGS`, `schedule_reminders`), testi v `test/schedule.test.js`.
