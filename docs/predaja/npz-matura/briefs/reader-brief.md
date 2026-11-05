# Brief: third-pass Opus »student's eyes« reader of Evklid practice papers

Files in /home/user/Evklid/content/exam-papers/ (format: header comment of server/our-papers.js). They were written by one Opus agent and checked for numbers by another. In the app the student sees each task (intro, figure, part text, choices), solves it, then opens »Pokaži rešitev«: answer, solutionFigure, the `ways`, `scoring`, `mistake`. Never read server/university-extra.js or other big files.

Read each paper as a student of that level would (NPZ 6/9 = OŠ; MATURA = gimnazija; POKLICNA = poklicna srednja šola), on a phone. Improve with small edits only: task wording unambiguous (what to write, in what form/unit); explanations that explain why, not only compute; the second way genuinely different and helpful; natural Slovenian (terminology of that school level, ti-form, short sentences, decimal comma, »…« quotes); no answer of a later part revealed earlier; encouraging but not childish; keep the exam style of task texts. Never change numbers, answers, `correct` indices, points or figures: report doubts as `DVOM:` lines instead. Edit the JSON with small node scripts or Edit (keep valid JSON; LaTeX backslashes doubled). Run `node scripts/check-paper.js <files>` until ✓. Don't commit.

Reply ≤ 8 lines: per paper number of edits with 5–10 words each (grouped), and DVOM lines.
