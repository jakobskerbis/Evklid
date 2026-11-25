# Varovala za mladoletne in Anthropicove smernice

Stanje 19. 11. 2026 (točka 3 načrta izboljšav po zunanjem pregledu). Anthropicove smernice za organizacije, ki
mladoletnim omogočajo uporabo modelov prek API
([Responsible use … guidelines for organizations serving minors](https://support.claude.com/en/articles/9307344),
posodobljeno 16. 3. 2026), zahtevajo tri stvari: dodatne tehnične ukrepe za svoj primer uporabe, skladnost s
predpisi o varnosti otrok in varstvu podatkov (izjava o tem javno na spletni strani) in razkritje, da uporabnik
govori z AI in ne s človekom. Anthropic lahko predpiše »child-safety system prompt«, organizacije občasno
preverja in ob neizpolnjevanju lahko račun ustavi. Smernice same ne določajo starostne meje za »mladoletnega«.

Ta dokument vsako zahtevo poveže z delom kode ali pove, kaj manjka. Ni pravni nasvet.

## Primerjava

| Zahteva (smernice) | Kaj ima Evklid | Kje | Kaj manjka |
|---|---|---|---|
| Preverjanje starosti (primer ukrepa) | Datum rojstva ob registraciji; pod starostjo digitalne privolitve (SI 15 let, ZVOP-2 čl. 8) račun ustvari starš s potrjenim e-naslovom in da soglasje ob dodajanju profila. Plačilo samo polnoleten imetnik z vpisanim datumom rojstva. | `server/accounts/age.js`, `public/starsi.html` | Nič tehničnega. Izjava o preverjanju je samo v kodi, ne na javni strani (spodaj). |
| Moderacija in filtriranje vsebin (primer ukrepa) | (1) Lokalni zaznavalnik nujnih primerov brez AI; (2) kratek varnostni pregled vsakega sporočila s Haikujem (ZDRAVJE / STISKA / NASILJE / NEVARNOST / NE), odgovor je vedno potrjeno besedilo, ne besedilo AI; (3) meje v pozivu inštruktorja z oznakami `offtopic`, `unsafe`, `injection`, `distress`; (4) trojno preverjanje odgovorov, preden jih dobi drug učenec. | `public/nujno.js`, `server/nujno.js`, `prompts/system_prompt.md` (Meje), `server/meta.js`, `server/verify.js` | Zadnja meritev vdorov (20 poskusov, 0 uspehov) je simulacija brez pravega klica API; ponoviti s pravim modelom (točka 26 načrta). |
| Spremljanje in prijavljanje (primer ukrepa) | Gumb »Prijavi napako« pod vsakim odgovorom in v vsaki lekciji; oznake stiske s pregledom skrbnika v 24 urah in e-mailom brez vsebine; koda sporočila za iskanje posnetkov; dnevnik dostopov. | `server/reports.js`, `server/stiska-obvestilo.js`, `/api/admin/stiske`, `server/dnevnik-dostopov.js`, `docs/krizni-nacrt.md` | Javno število prijav in popravkov (točka 47). |
| Izobraževalni viri za mladoletne o varni rabi (primer ukrepa) | Opozorilo »Inštruktor se lahko zmoti, zato pomembne rezultate preveri«; poziv inštruktorja ob stiski predlaga pogovor z odraslo osebo in v nujnem primeru 112. | `public/i18n/sl.js` (`beta.tutor`), `prompts/system_prompt.md` | **Manjka:** kratka stran ali razdelek »Kako varno uporabljaš Evklid« (kaj AI zna in česa ne, ne deli osebnih podatkov, kdaj vprašaj odraslega, kam po pomoč: TOM 116 111, 112). |
| Skladnost s predpisi o varnosti otrok in varstvu podatkov, izjava na javni strani | Šifriranje pogovorov na ravni polja, roki hrambe, izvoz in izbris, privolitev staršev pod 15 let, ime otroka ne gre k ponudniku AI (`{{IME}}`, #845). Zasebnost za starše na `/zasebnost.html` in `/starsi.html` (Anthropic kot obdelovalec je naveden). | `server/zasebnost.js`, `server/crypto-polje.js`, `server/ime-oznaka.js`, `docs/varnost-podatkov.md` | **Manjka:** en odstavek na javni strani, ki to pove kot izjavo o skladnosti (GDPR, ZVOP-2, Anthropicove smernice). **Odprto pri pravniku:** pogoji uporabe (osnutek), DPIA, pogodbe o obdelavi (točke 2, 4, 18). |
| Razkritje, da gre za AI (obvezno) | V klepetu stalna opomba pod poljem za pisanje »Pogovarjaš se z umetno inteligenco (AI), ne s človekom« (vidna tudi na telefonu), znak »AI« v glavi in ob prvem pogovoru obvestilo z gumbom »Razumem«; za 1.–5. razred preprostejše besedilo. Javne strani Evklid opisujejo kot »AI inštruktor«, stran za starše in zasebnost pove, da odgovore pripravi AI podjetja Anthropic; odgovori API nosijo `ai_generated: true`. | `public/index.html` (`chat.aiNote`), `public/ai-oznaka/ai-oznaka.js`, `public/o-evklidu.html`, `public/starsi.html`, `server/ai-oznaka.js` | Nič tehničnega. Opozorilo v pasici testne različice (`beta.tutor`) govori o »Inštruktorju«, kar je v redu, ker opomba ob klepetu že pove, da je AI. |
| Child-safety system prompt (če ga Anthropic predpiše) | Ni ga še objavil za ta primer. Poziv ima lastne meje za mladoletne. | `prompts/system_prompt.md` | Ko ga Anthropic objavi, ga dodamo na začetek poziva (sprememba poziva gre j-ju kot kartica, `docs/spremembe-prompta.md`). |

## Naslednji koraki

1. Izjava o skladnosti: en odstavek na `/zasebnost.html` in `/starsi.html` (sprememba javnega besedila, kartica j-ju pred objavo).
2. Razdelek o varni rabi za učence: po pilotu ali prej, če ga j potrdi s kartico (nova vsebina v aplikaciji).
3. Ob vsakem novem Anthropicovem dokumentu za mladoletne (npr. »Child safety guidance for developers«) to tabelo posodobi.
