---
name: evklid-weekly-report
description: Weekly report email redesign (PR #218, merged 2026-10-30): content, charts, quiet-week skip, self profiles
metadata:
  type: project
  modified: 2026-10-30T15:26:30.269Z
---

j (2026-10-30): weekly reports must be »vredna pošiljanja in ogleda«, and asked for charts. PR #218 merged 2026-10-30 (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtHpzoFRzadrZBozRo6bEqFE).

- Code: server/accounts/weekly.js (childWeek, headline, nextSteps, barsHtml); sent Sunday ≥17:00 Ljubljana via Resend.
- Content: one-line headline, streak, bar chart per day (tasks + tutor questions), tiles (solved vs last week, first-try %, questions), goal countdown, topics per subject with accuracy bars, mastered / strong / weak (with reason), up to 3 next steps, »Za pogovor doma« tip for parents. XP removed.
- Charts are HTML tables with height/bgcolor only (Gmail strips SVG, Outlook ignores div heights). Not yet tested in real Gmail/Outlook.
- »Zame« profiles (consent text starts »Profil je moj.«) get 2nd-person wording, no parent tips.
- No email after two weeks without activity (one quiet email is sent, then pause).
- Previews: /mnt/project-files/evklid/tedensko-porocilo/.

Related: [[evklid-accounts-billing]]
