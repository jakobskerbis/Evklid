---
name: evklid-project
description: STEMMind = Slovenian AI STEM tutor app (MAT/FIZ/KEM, OŠ+SŠ); code in jakobskerbis/Evklid, state as of 2026-10-27 <!-- brand:legacy -->
metadata:
  type: project
  modified: 2026-10-27T11:15:34.482Z
---

The "Ai tutor" project is STEMMind: an AI tutor for Slovenian primary (OŠ 6–9) and secondary (SŠ) students in math, physics, chemistry. The user (j) supplied a Slovenian system prompt and asked for the full app built around it. <!-- brand:legacy -->

- Repo: github.com/jakobskerbis/Evklid (main). Node 22 + Express + node:sqlite + @anthropic-ai/sdk, vanilla JS UI; prompt in prompts/system_prompt.md; mock mode when no API key.
- Copies of the revised prompt and change notes are in /mnt/project-files/evklid/.
- j has a Claude Ultra plan since ~27–29 Oct 2026 (200 $/month API credit after 7 days) and bought $5 of API credit on 2026-10-27; first real-key run is still untested.
- j writes to me in both English and Slovenian; app UI and prompt stay Slovenian.
- Open follow-ups: deploy (Render/Railway suggested), parental consent / privacy notice for minors, teacher run of docs/preizkus.md, verify which OŠ grade introduces moles.

**Task generator (decided 2026-10-27, brainstorm thread):** students shouldn't need to scan homework. Parametric templates (code picks numbers + computes answer, AI only writes wording), many task types, adaptive difficulty, attached to each curriculum topic, answer check tolerant of rounding but flags wrong rounding and explains it. Start with math OŠ 6–9, then FIZ/KEM. Sent to build thread.
**Progression + pedagogy (decided 2026-10-27):** mastery-gated chapters (8/10 + 2 hard), test-out quiz, decay → review; XP weighted by difficulty, hints reduce not zero, streaks; weekly leagues of 20–30, nicknames only, optional class board. Evidence-based techniques: retrieval first, spacing 1/3/7/21d, interleaving, faded worked examples, self-explanation, step-level feedback, dual coding, small steps; no "learning styles". Sent to build thread.
**Pricing + cost (2026-10-27):** j set 8.99 €/mo for 1 child, 14.49 €/mo for 2 (annual 69 € / 109 € per school year, confirmed); 7-day trial, weekly parent email, referral month, image downscale, answer reuse, GDPR parental consent <15, free tier (unlimited generated tasks, ~10 tutor msgs/day). Opus-only ≈13 €/active student/mo (loss); target 1–2 € via Haiku default + Opus escalation, caching, history trim, precomputed explanations (batch), code-checked answers, usage logging. j said "optimize all of it"; sent to build thread.
**Handwriting input (2026-10-27):** finger/mouse/stylus canvas; task text stays visible (sticky on phone, side-by-side on tablet/desktop); Haiku vision reads it, app confirms "Prebral sem: …" before grading. Sent to build thread.
**Built and pushed (2026-10-27):** learning paths, task generator, progression/XP, cost limits, touch input (keypad + writing pad, auto-opens on touch devices). Weekly leagues, teacher class codes and friend groups merged via PR #1 (2026-10-27): Lige tab, ucitelj.html teacher page, nicknames only from generated list, teacher sees nicknames not names. Topic explanations need `node scripts/generate-explanations.js --yes` run once with the API key.
**Modes (2026-10-27):** bottom bar Nova snov / Ponavljanje (due badge) / Priprava na test (chapters + date); "Današnji trening" ~15 min auto mix 70/30; switch anytime without losing progress. Built and pushed to main (c46fd53): sessions/test_plans tables, plan-based lazy sessions that resume.
**Anti-sharing (2026-10-27):** unique profile per student; plan = 1 or 2 profiles; a device bound to one plan; a profile active on one device at a time (new login ends old session); profile swap limited. Sent to build thread.
**UI (2026-10-27):** j finds the UI unintuitive and "like a 90s chatroom"; wants a modern Duolingo/Brilliant-style look, better graph (ticks, arrows, highlighted points) and a real number line for inequalities. Sent to build thread.
**Textbook (2026-10-27):** j wants an in-app textbook with explanations + interactive demos per topic. Proposed: lesson per topic (explain → worked example → demo → check → practice), AI-drafted once and teacher-reviewed, own slider demos + embedded PhET sims (CC BY 4.0). Teacher-level depth + "Razloži drugače" button with stored alternative explanations (visual, analogy, concrete numbers, formal), then "Vprašaj tutorja". Lives in thread "Add interactive textbook", not the build thread.
**University mode (2026-10-27 evening):** j wants study-program tutors (choose program at sign-up) covering ALL years of first-cycle UN programs at UL FKKT, UL FS, UL FMF, UM FKKT, with practice matched to their učni načrti. Implementation thread: "Add university study-program tutors" (cmsg_011HYzNBAS5HRU1H7PcSE7JtTTzpXKqhPt5Lc56qTZzbDB). Curricula (10 UN programs, all years, links) in /mnt/project-files/evklid/univerza/predmetniki-1-stopnja-UN.md, sent to that thread 2026-10-28. FMF pages are robots-blocked; FMF Matematika predmetnik there is from 2018/19 and needs checking.
