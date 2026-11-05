# Brief: extract the STRUCTURE (never the text) of Slovenian national exam papers (RIC)

Other agents will write completely new practice papers with the same shape for Evklid (Slovenian AI STEM tutor app, repo /home/user/Evklid). Copyright rule from the owner: RIC papers are »vse pravice pridržane«; we never copy, store or commit their text. You read them only to describe their shape in your own words. Downloads go only to /tmp/claude-0/-home-user-Evklid/c92b5c82-a2fd-5a5c-a1b4-eeb69e57bb18/scratchpad/ric/ (never into the repo); name files uniquely by paper id (e.g. ric/MATURA-FIZ-2024-p1.pdf) because other agents share the folder.

Download with `curl -sSL -o <file> "<url>"`. Read text with `node /tmp/claude-0/-home-user-Evklid/c92b5c82-a2fd-5a5c-a1b4-eeb69e57bb18/scratchpad/dump.mjs <pdf>` (lines per page; pipe through grep/sed to keep context small). The cover page gives duration, allowed tools and total points; the scoring guide (navodila za ocenjevanje) gives points per part when the paper does not. Older papers may have different layouts or file kinds; if a URL fails or a file is not a PDF, say so.

Look at existing examples first: `content/exam-papers/structures/MATURA-FIZ-2025-spomladanski.json` (multi-pola, choice), `.../POKLICNA-MAT-2026-spomladanski.json` (sections, choose), `.../NPZ9-MAT-2024-redni.json` (single pola).

For each paper write /home/user/Evklid/content/exam-papers/structures/<id>.json:
{
 "id": "<id>", "points": <what one candidate can score>, "minutes": <total minutes>,
 "maxListed": <sum of all listed tasks, only when candidates choose a subset>,
 "choice": "<own words, e.g. v poli 2 kandidat izbere 3 od 6 nalog>",   // only when choosing
 "polas": [{"pola": 1, "minutes": 90, "calculator": false, "points": 40}, …],   // only for more than one izpitna pola
 "tools": "<allowed tools, own words>",
 "sections": {"A": "<own short description>"},   // only when sections exist
 "tasks": [
  {"pola": 1, "section": "A", "n": 1, "points": [1, 2], "format": ["open", "fill"], "topic": "<own words: content and kind of each part>", "figure": "<kind of figure/table/graph if any; else omit>"}
 ]
}
Rules: `pola` only for multi-pola papers; `section` only when sections exist (one capital letter; map »1. del/2. del« to A/B); `n` restarts as in the original (per section / per pola); `points` = points of each part a, b, c… (a task without parts = one element); `format` one per part from open | choice | fill | construct | table; the sum of points of all tasks = `points`, or = `maxListed` when candidates choose. Matura pola 1 multiple-choice lists: one short topic line per question, note which use a figure, table or graph. Topics must be descriptive enough for a writer to make a similar but new task (content, level, kind of answer), but NEVER quote sentences, numbers, names, organisms, compounds-in-context or experimental setups of the original word for word.

Check each file with `node -e` (valid JSON, points sum, n sequence) and run `node -e 'import("/home/user/Evklid/server/our-paper-structures.js").then(m=>console.log(Object.keys(m.PAPER_STRUCTURES).length))'` (must not throw). Don't modify other repo files, don't commit. Reply ≤ 8 lines: per paper total points, number of tasks/parts, minutes, anything unclear.
