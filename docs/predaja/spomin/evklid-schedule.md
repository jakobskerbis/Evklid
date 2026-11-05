---
name: evklid-schedule
description: Student timetable (Urnik) feature, PR #115 merged 2026-10-29: input ways, uses, privacy, where the code is
metadata:
  type: project
---

j asked 2026-10-29 14:53: »naj imajo učenci v aplikaciji možnost dodajanja svojega urnika«. Built and merged as PR #115 (docs/urnik.md).

- Jaz → Urnik (desktop top tab »Urnik»): weekly lessons + tests/kolokviji/izpiti/ustno/oddaje. Input: by hand, photo (Opus by default, EVKLID_SCHEDULE_MODEL, preview then save), .ics link/file, UL FMF public timetable (urnik.fmf.uni-lj.si has `?export=1` .ics for the whole semester; layer ids per year, e.g. 32 = 1. letnik M).
- Uses: Učna pot card »Danes/Jutri imaš«, »Ponovi pred uro« (5-task `class` session), reminder for a test today/tomorrow + optional device notification (real push needs hosting), Priprava na test auto-follows the nearest test (test_plans.event_id; manual plan wins), tutor tools get_schedule/change_schedule + summary in dynamic prompt.
- Private: never in leagues/teacher; in account export; deleted with student.

**Why:** j wants students' real school week and test dates to drive what they practise.
**How to apply:** new timetable sources (other faculties' .ics, eAsistent) plug into server/schedule.js parseIcs/scheduleSources. Related: [[evklid-chat-settings]], [[evklid-university]].
