# Dnevni pregled prijav napak

j, 5. 11. 2026: prijave iz gumba »Prijavi napako« vsak dan samodejno pregleda Claude in za prave napake odpre PR.

## Strežnik (server/reports.js)

- `GET /api/prijave/izvoz` z glavo `Authorization: Bearer $EVKLID_EXPORT_TOKEN` (isti ključ kot
  `/api/kozmetika/export`, primerjava v stalnem času). Brez ključa ali z napačnim ključem 404, vedno
  `Cache-Control: no-store`. Privzeto vrne prijave, ki niso popravljene; `?stanje=all` tudi popravljene.
- Vsaka prijava: `id`, `kind` (`message` = odgovor inštruktorja, `lesson` = lekcija, `app` = skrbnik iz klepeta),
  `razlog`, `besedilo` (opomba učenca), `kontekst` (vprašanje in odgovor; lekcija, ime lekcije, korak; ali pogled),
  `stanje` (`open` | `in_review` | `fixed`), `pr`, `cas` (UTC).
- Izvoz nima `student_id`, `conversation_id`, kode sporočila, naprave, izrisanega HTML in zadnjih sporočil
  pogovora. V besedilih zamenja ime učenca (tudi posamezne besede), vzdevek v ligah, ime in e-naslov starša s
  `[ime]` in vsak e-naslov z `[e-naslov]`. Prosto besedilo lahko še vedno vsebuje kaj osebnega (npr. ime sošolca),
  zato ga nikoli ne prepisuj v PR, repozitorij ali poročilo.
- `POST /api/prijave/<kind>/<id>/stanje` z istim ključem in telesom `{"stanje":"in_review","pr":N}`,
  `{"stanje":"fixed"}` (lahko z `pr`) ali `{"stanje":"open"}` (pobriše `pr`). Druge vrednosti 400.
- Vsak izvoz in vsaka sprememba se zapišeta v dnevnik dostopov (`reports_export`, `report_status`).
- Skrbnik v Računu → Prijave napak vidi »V pregledu · PR #N«; prijava v pregledu šteje med odprte.
