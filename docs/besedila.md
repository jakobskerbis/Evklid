# App text: how Evklid speaks

j (2026-10-30): no more clumsy wording anywhere in the app. English on purpose (agents read this).
Every new or changed UI string follows these rules; `test/besedila.test.js` checks the mechanical ones.
The bar for content (lessons, tasks) stays `docs/kakovost.md`; this file is about interface text.

## 1. Who we talk to, and how

- **Students and the account owner inside the app: `ti`** (tikanje). »Dokupiš«, »tvoj profil«, »Preveri e-naslov«.
- **Parents, teachers, schools and payers on their own pages: `vi`** (vikanje): the parent payment page
  (`payp.*`, `placaj.html`), parent pages (`starsi.*`), teacher and school pages (`tc.*`, `sole.*`, `orders.*`,
  `ucitelj.html`, `sole.html`) and e-mails to parents or schools.
- **Never both in one string or on one screen.** »Ko ga porabi, lahko tukaj dokupite … jih lahko dobiš« is the
  error this file exists for.
- Admin-only screens (`meter.*`, `admin.*`, `usage.*`, `pilot.*`, only j sees them) may name models, API, tokens.

## 2. Plain words, no machinery

- Students never read about models, model strength, tokens, API, servers, caches, routing, Sonnet/Opus/Haiku
  or Anthropic. Say what it means for them: »Število pogovorov je ocena, lahko jih je tudi več.«
- The tutor is »inštruktor« (»inštruktor AI« only where it must be clear it is not a person, e.g. payment
  and privacy texts). Pick one name per screen.
- Prefer the everyday word: »pogovor«, »naloga«, »tema«, »povezava«, not »seja«, »entiteta«, »zahtevek«.

## 3. Short and clear

- One idea per sentence. A hint or note is one or two sentences; a button is one to three words, a verb
  (»Shrani«, »Nadaljuj na plačilo«).
- Lead with what the reader can do or what happened, then the reason. »Plačilo je uspelo. Pogovori so
  pripisani.« not »Ker je bilo plačilo uspešno izvedeno, …«.
- No filler: »pravzaprav«, »seveda«, »enostavno«, »pač«, »oziroma« when »ali« works, »s strani«, »izvesti«,
  »na voljo je možnost, da …«.
- No passive bureaucratese (»se izvede«, »je bilo izvedeno«) where an active verb works.
- Natural word order; no calques from English (»naredi smisel«, »v primeru da«, »preko« → »prek«).

## 4. Form

- Slovenian quotes »…«, decimal comma, a space before units and »%«, »€« after the number (»5,00 €«).
- Ellipsis is one character »…«. No double spaces, no space before ».,:;!?«.
- Plurals use the `{ one, two, few, other }` object, never »pogovor(ov)«.
- Sentence case in titles and buttons (»Dodatni pogovori z inštruktorjem«), not Title Case.

## 5. Legal, payment and privacy texts

Wording may get clearer, the meaning may not change: what is promised, refunded, stored or shared stays the
same. Any such change is listed in the PR for j to see (keys `pay.*`, `payp.*`, `credit.*`, `gift.*`,
`priv.*`, `zasebnost.html`, terms).

## 6. Other languages

A key keeps its meaning in all 32 `public/i18n/ui/*.json`. When a Slovenian string changes meaning or drops
something (e.g. model talk), update every locale. A pure Slovenian style fix does not need new translations,
unless the translation has the same flaw.
