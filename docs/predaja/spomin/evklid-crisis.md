---
name: evklid-crisis
description: Evklid crisis/damage-control playbook + safeguards (PR #163, 2026-10-30): doc link, owner thread, roles, how to verify/fix a bad answer, triple check of saved answers
metadata:
  type: project
  modified: 2026-11-04T06:58:28.831Z
---

j (2026-10-30 05:17): one thread does damage control for ANY bad event (viral wrong-answer video, unsafe content to a child, data leak, outage, payments, AI cost abuse, criticism). Owner thread "Pripravi krizni načrt za neljube dogodke" (cmsg_011HYzNBAS5HRU1H7PcSE7JtPDuSy1MCk5GtYETTQgqXmA): route every incident report there.

Playbook (Claude Doc, Slovenian): https://claude.ai/artifact/SDR71FXmRVsb6T5YzzQwhC; repo summary docs/krizni-nacrt.md.
- Rules: Claude verifies, fixes code and drafts; j approves every public post, e-mail, media reply and shutdown. Data leak → Informacijski pooblaščenec within 72 h (GDPR 33), by the controller = j himself (j 2026-10-30 09:49, replacing earlier 'parent').

Safeguards built (PR #163, merged 2026-10-30):
- »Prijavi napako« under each tutor reply → table message_reports (server/reports.js), purges answer_cache. Since PR #285 (thread »Izboljšaj okno inštruktorja«, 4 Nov): also »Prijavi napako« in every lesson (web+app, table bug_reports kind=lesson) and an admin-only flag in the chat header (kind=app, last 10 messages). Admin list: Račun → »Prijave napak« (GET /api/admin/reports, .md export /api/admin/reports/export, »Popravljeno«). Goal: fix reported lessons within days. Since PR #309 (4 Nov, j: reports didn't show the same LaTeX errors): a message report also stores, sealed, the raw model text, the rendered HTML snapshot (web DOM / app RichText HTML) and the device+screen. The admin list shows the snapshot, strictly sanitized, at the student's width.
- Message code #XXXX (base36 message id) under replies; `node scripts/najdi-sporocilo.js "#00YA" | --besedilo | --prijave | --odstrani`.
- Notice »Evklid se lahko zmoti…«; kill switch EVKLID_CHAT_OFF=1.
- j's rule (05:34/05:35): no wrong answer may be stored; storing is OK only after enough checks. server/verify.js: answer_cache rows and tutor flashcards are visible only after (1) code arithmetic check (lesson-math) and (2)(3) two different models (EVKLID_VERIFY_MODELS, default Sonnet+Opus, effort medium). Doubt, error, or over 12k chars means it is not stored. Cap EVKLID_VERIFY_DAILY_USD = 1 $/day (≈ 10–50 checks, j may raise). Mock mode: code check only.
- Other switches: EVKLID_ANSWER_CACHE=0, EVKLID_FREE_POOL_USD=0, EVKLID_MODEL.

- 2026-10-30 13:25 UTC: live app out of Anthropic API credit (tutorOff notice works). j: expected, NOT an incident; he does not top up, waits for the monthly 200 $ Max API credit. Don't escalate this again; while it lasts, verification fails so nothing new is cached. RESOLVED 3 Nov ~12:35 UTC: j linked the Ultra API credit (200 $), tutor works (note: after a failed call the app waits 10 min before trying the API again).

Related: [[evklid-release]] [[evklid-marketing]] [[evklid-ai-cost]]
