# Predaja: nit »Izboljšaj inštruktorjev pedagoški prompt« (cmsg_011HYzNBAS5HRU1H7PcSE7JtCEvkWPNwYqvf8GrRNfM9ax)

Stanje 4. 11. 2026: delo je KONČANO, nit je zaključena. Ni odprtih PR-jev, ni opomnikov ali sprožilcev (nit jih ni ustvarila). Nova nit »Okno inštruktorja« nadaljuje od tod.

## Kaj je bilo narejeno
- PR #256 (https://github.com/jakobskerbis/Evklid/pull/256), ZDRUŽEN 1. 11. 07:42 UTC po j-jevi potrditvi (»Ja« na kartici). Stalni del `prompts/system_prompt.md` (nad `<!-- EVKLID:NASTAVITVE`) prenovljen po raziskavah o učenju; del pod vrstico, META in KARTICA nespremenjeni. Zapis sprememb z razlogi: `docs/spremembe-prompta.md` (razdelek 2026-11-01). Memorija: `evklid-prompt`.
- Novo v promptu: vrstica »Vedno« na vrhu; lestvica pomoči (4 stopničke) v načinu A; razdelek »Pedagoške situacije« (ne vem, spodrsljaj/napačna predstava, ugibanje, frustracija ob nalogi, napreden učenec, domača naloga za oddajo, časovna stiska, priprava na test, po testu, »zakaj se to učimo«, »v šoli delamo drugače«, vrnitev k temi, več vprašanj, učne težave, utrujenost, konec); pogoste napačne predstave po predmetih; ton po stopnji OŠ/SŠ/UNIVERZA; priznanje lastne napake; brez emojijev (razen 📌 in ščita); ščit se ne sproži ob mimobežnem »ignoriraj pravila«; dokaz na prošnjo je naloga; »reši vse, moram oddati« ni prošnja za način B.
- Pet neodvisnih pregledov (skladnost; pedagogika in jezik; preigravanje 12 situacij kot hitri model; strokovni pregled s Fable; končna skladnost). `npm test` 555/555, `preveri-aplikacijo.cjs` 0 težav.
- Test `test/prompt.test.js` varuje nove razdelke, njihov vrstni red in odsotnost emojijev v stalnem delu.

## j-jeve odločitve (ohrani jih)
- Prompt se SME spremeniti le s j-jevim pregledom pred združitvijo (stalno pravilo).
- 1. 11. 07:38: pravilo »ničelno predznanje teme« OSTANE; dodan je le stavek: kar učenec v pogovoru sam pokaže, da zna, inštruktor skrajša na opomnik (ne da bi moral reči »to znam«).
- 1. 11. 10:55: NE omejuj načina B (celotna rešitev) na starše/učitelje; učenec ga lahko vklopi sam (starši bi ga otrokom tako ali tako omogočili). Inštruktor je omejen na učenje prek razdelka Meje (le šolski predmeti, nič »za oddajo« brez razlage).
- Strošek: stalni del 28,8 → 39,5 tisoč znakov (~13,2 tisoč žetonov, predpomnjeno, ≈ +0,0004 $ na sporočilo, ≈ +7 % na pogovor). j je to sprejel. Če bo kdaj treba krajšati, najprej skrajšaj »Pedagoške situacije«.

## Odprto / za naslednjo nit
- Ponudba j-ju (1. 11.): če inštruktor po novem promptu kje ravna narobe, naj pošlje primer pogovora → popravek prompta (spet s pregledom pred združitvijo).
- Tedenski AI pregled prompta (vzorec pogovorov + ujete napake → predlog sprememb → test na 50 nalogah → PR, nikoli brez j-jeve potrditve) je v lasti niti AI proračuna (cmsg_011HYzNBAS5HRU1H7PcSE7JtCXhSZk46TY4tFKkVQPJUu3), gradi se po 4. 11., potrebuje API kredit (~5. 11.). Glej memorijo `evklid-tutor-accuracy`.
- Načrt delitve na stopnje (https://claude.ai/artifact/Nkb14LowXunGVjCkrvMAoA) predvideva »dodatek k promptu za stopnjo«; ton po stopnjah je zdaj že v promptu, zato bo tam morda potrebna le manjša dopolnitev ali nič.
- Nevneseni predlog pregledovalca (opcijsko): omilitev »ničelnega predznanja« je j zavrnil; ne predlagaj znova.

## Povezave
- PR #256: https://github.com/jakobskerbis/Evklid/pull/256
- Prompt: `prompts/system_prompt.md`; strežnik `server/prompt.js` (razdelitev v dva bloka, predpomnilnik), `server/meta.js`.
- Pravila besedil: `docs/besedila.md`; pregledi: `docs/pregled.md`; žetoni: `docs/token-rules.md` §6.
