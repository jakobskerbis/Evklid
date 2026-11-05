---
name: evklid-formula-symbols
description: Tappable formulas in lessons: per-lesson :::simboli glossary overrides the general dictionary (j 2026-10-30), format, tools, backfill status
metadata:
  type: project
  modified: 2026-11-04T11:41:08.634Z
---

j (2026-10-30 17:01, thread "Make lesson formulas interactive"): all formulas in lessons/textbook tappable, showing parts and units (ρ → m/V). Tap cards existed since PR #154 (public/formula-info.js + formula-data.js dictionary), but meanings were context-blind (T in T = I/I_0 showed »temperatura«) and UNI lessons always used the MAT table.

Fix (branch claude/project-thread-c2rkae): each lesson ends with a hidden block
`:::simboli` / `<TeX symbol(s)> | ime | zveza TeX | enota (– = brez) | opomba` / `:::`
parsed by server/textbook.js parseLesson → lesson.symbols → withFormulaSubject(subject, fn, glossary). Order: lesson full key > dictionary full key > lesson base > dictionary base. Card shows »Kjer je« (other symbols of the relation with units). UNI lessons use topic subject (L.subject).
Checker warns »N oznak v formulah nima vrstice v :::simboli« for $$…$$ and :::formula symbols. `node scripts/simboli.js <files>` = compact digest for writers/reviewers; `--brez` lists lessons without a block. lesson-brief.js writer + reviewer briefs include the rule, so new lesson batches write the block.
Backfill: 340/372 lessons have a block (32 have no symbols), Opus writers + Opus content review. PR #232.
A row with several symbols (`t_1, t_2 | časa dveh opazovanj`) shows the whole group on the card, so plural/dual names are fine. j 30 Oct: tappable symbols are blue text with NO underline (clean look); the hover/open background must be centred on its glyph (fit() in formula-info.js strips KaTeX mspace/italic margin from the span); ui.css pointer-events rules keep fraction denominators tappable (KaTeX vlist/pstrut covered them).

Related: [[evklid-textbook]] [[evklid-textbook-features]]

4 Nov PR #284 merged (thread "Explain formula letters by topic" cmsg_011HYzNBAS5HRU1H7PcSE7JtF3c3ZUET66xkG8JwzAtoSy, which also owns all interactive-formula work since 4 Nov): every `## ` section of content/formulas/*.md has its own hidden :::simboli block (meaning per section + level, »poljubno število« for general letters); /api/formulas returns `sections`; `node scripts/formule-simboli.js` + test/pomen-crk.test.js require a row for every letter and forbid FIZ/KEM meanings on MAT sheets (lessons not checked for that: t = čas in maths word problems is legit). /api/topic returns subject + symbols → explanation/»Bistvo«, tasks of open topic (only in topic view) and tutor answers (chatRich: conversation subject + topic lesson glossary) use them. »Pokaži formulo« removed when every letter has a lesson row. Choice options: server optionsAreTex() auto-detects bare TeX; client renders $…$ parts; long options one column. Pretest feedback in card header, not toast. PR #288 (4 Nov): mobile has tappable letters too (RichText + FormulaCtx/useTopicFx, card = shared public/formula-card.js as bottom sheet; options noFx). Sketches (j spec /mnt/project-files/evklid/skice/naloga-skice-j-2026-11-01.md): component public/skice/skica.js + registry public/skice/index.js (»<sheet>|<card name>«), first sketch MAT-SS »Pravokotni trikotnik«. Mapping of all sketches to cards: /mnt/project-files/evklid/skice/kartice-za-skice.md; 11 missing cards added (#306, j »Dodaj vseh 11«).

Sketch spec chapters #306–#360 ALL MERGED (spec finished; odvod.js on »Definicija odvoda«, presek-stozca.js Three.js). Later (not in spec): Krogla sketch, apothem v_a in pyramid nets.
4 Nov PR #423 (j 13.23–13.26): one tappable mark per MEANING per page (formula-card.js claimMarks; web pages .msg/.fm-sec/dialog/.view, mobile = screen, chat msg own page); 2nd meaning of same letter = colour --fx-tone-1..3 (theme.js tonesOf, style.css). Meaning: ctx first, then sentence (rich.js sentenceAt) if it names exactly one; code carries variant s:FIZ:G:FIZ.0 (before, cards ignored ctx: G showed gibalna količina).
