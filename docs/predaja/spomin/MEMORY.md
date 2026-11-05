# Evklid (formerly Kompreno/STEMMind; repo github.com/jakobskerbis/Evklid) <!-- brand:legacy -->
Slovenian AI STEM tutor, Node 22, single-file DB. User j (Jakob Skerbiš) writes Slovenian, non-technical. Runs on Render Frankfurt (https://evklid-a6az.onrender.com, evklid.app via Cloudflare DNS-only); smart auto-deploy; EVKLID_EXPORT_TOKEN, EVKLID_DATA_KEY, Resend set. Android APK at evklid.app/prenesi, OTA built. j's PC (C:\Users\jakob\Desktop\stemmind-main; new checkout Desktop\Evklid). Shared folder /mnt/project-files/evklid/. Threads merge own PRs; dev only. <!-- brand:legacy -->
RENDER SHELL TESTS: any merge to main redeploys and kills shell jobs and wipes data/ files; hold merges (via optimizer) while j runs a shell test. Pasting in Render shell can add `^[[200~` — tell j to delete it.
OTA vs deploy order: OTA can reach app before Render deploys → app shows »Ni povezave« (4 Nov). Fixed #322; app now always mirrors web.

## WEEK 4–11 Nov (reset done 4 Nov 02:00)
**RUN TO 95 % (j 4 Nov 12:18), then stop until reset Wed 11 Nov 3:00. (A brief 90 % stop at 15:21 was a misread; j meant review rule, undone 15:23.)** CAS phases 2–3 after reset. Do NOT open payments-leftovers successor until 11 Nov.
POST-RESET QUEUE: auto bug-report triage [[evklid-prijave-samodejno]] (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtD8NKq2TBEHTkCS7aCYJ5hD), 22 tutor ideas in 5 packages (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtQAaLuE15x5oLAxZF2haHgm, /mnt/project-files/evklid/instruktor-ideje/), CAS phase 3, interactive letters (j 4 Nov 20:11: FIX so at least one interactive letter is always on the currently visible screen), realistic atlas Blender textures, 10 NPZ sheets, year 1 videos (materials), lab chemistry if not merged, 3D bio models upgrade (all 29 cells, Astra style, max detail), AR for geometric solids, MICROTRANSACTIONS cleanup (j approved 4 Nov 20:47; remove custom top-up amount, 30-day test passes, 2/5/10 € Podari add-on at checkout + texts all languages; plan /mnt/project-files/evklid/placljivi-paket/mikrotransakcije-nacrt.md; thread cmsg_011HYzNBAS5HRU1H7PcSE7JtRcmDNRojJFkZ92gyEJ6MyX does it; small fix, one review).
4 Nov afternoon PRs merged: #392 lab EM, #394 materials, #395 formulas in calculator, #397 tutor fractions/integrals/Σ, #399/#405 3D rotation+ghost scale, #400 scroll buttons, #402 wide screens, #403 keyboard, #407 Razloži htmlData fix + friendly network error.
4 Nov evening merged: #438 rounded training card, #439 keyboard swipe row, #440 flip flashcards, #441 hologram growth, #442 textbook bar opens at scroll edge. Open: finer sliders cmsg_011HYzNBAS5HRU1H7PcSE7Jt7jXqcHUqp4Lh21CxPnZoMP; remove mini scroll arrows cmsg_011HYzNBAS5HRU1H7PcSE7Jt8G41E8ag2J1P7z9FwFgP46. preveri-aplikacijo »tel-okna« step is known flaky; re-run once.
Open 4 Nov late: Jaz page profile card overlap cmsg_011HYzNBAS5HRU1H7PcSE7JtDNK1Ab8KVTN9MFGn2srZ5v; APK+web old icon cmsg_011HYzNBAS5HRU1H7PcSE7Jt7Sx4fyQXRyL91NVXRLFS69.
Earlier PUSH (j 4 Nov 09:34): NOTIFY j (notify=true) when all done/stopped. Optimizer drives it.
Atlas keeps its own 650 $. Per-thread effort table /mnt/project-files/optimizator/effort-po-nitih.md.
j rule: any thread may be split into several if it helps.
ATLAS SPLIT (specs /mnt/project-files/evklid/3d-atlas/niti.md): main (body/organs) cmsg_011HYzNBAS5HRU1H7PcSE7JtJvw81e9aNVtwH3sy7FQCwc; 3D world UI cmsg_011HYzNBAS5HRU1H7PcSE7JtUcDzQgqrbqw3UzWWtw2WNq. After atlas: one »Uči se« button with tabs Učbenik/Laboratorij/3D svet.
Optimizer plan /mnt/project-files/optimizator/tedenski-nacrt-2026-11-04.md. Handovers in /mnt/project-files/predaja/.
4 Nov morning done: PRs #279–#369 incl. #328 logo, #348 NPZ sheets, #350 home page, #357 analytics, #361 CAS phase 1, #363 landing page, #365, #369 payment fixes.
TUTOR: OŠ normal Haiku; SŠ paid Haiku more thinking; anti-invented-exercise rule live. Prompt caching on.
PRICING merged #290: OŠ 9,99/99 €, SŠ 13,99/139 €, faks 19,99/199 €, Družina (OŠ+SŠ) 18,99/189 €, Družina s študentom 27,99/269 €; top-up 5/10/20 €. Schools: AI cap 25 % of licence price, annual focus, pilot 12 € first 10 schools.
Pilot friend's account confirmed. APK build 7 done.
Games: 1 new game type every Thursday 8:17.
University: UL FKKT first; new faks structure for ALL faks lessons, ~200 $ over coming weeks.
NPZ cmsg_011HYzNBAS5HRU1H7PcSE7Jt9uNKFNTcvAUCjC3sfE7EH6. OPTIMIZER cmsg_011HYzNBAS5HRU1H7PcSE7Jt8EQahEA2WPJwMnPr2UBLVB.
THREADS: login/Render cmsg_011HYzNBAS5HRU1H7PcSE7JtD87vR3YznDhaphjmhNt5Lr; site speed cmsg_011HYzNBAS5HRU1H7PcSE7Jt6qhqFxoFFhcs2EhGFGkA6x; payments leftovers cmsg_011HYzNBAS5HRU1H7PcSE7Jt5RxBbYZKqzjHUDMswcE2nB; IGRE cmsg_011HYzNBAS5HRU1H7PcSE7Jt4sHE4mDDPEPxq8w5Ehx2bq; native app cmsg_011HYzNBAS5HRU1H7PcSE7Jt6coHWo6qvCQF4iEzumYkdH; formulas cmsg_011HYzNBAS5HRU1H7PcSE7JtF3c3ZUET66xkG8JwzAtoSy; tutor window cmsg_011HYzNBAS5HRU1H7PcSE7JtRD7HcedHLFBNN7sEGUAZnr.

## Queue details
- TEXTBOOK: cmsg_011HYzNBAS5HRU1H7PcSE7JtTw2vVCQo5mZXdLeQf9AR9E (done). faks cmsg_011HYzNBAS5HRU1H7PcSE7JtHA4fzZiaYBVmPh8JHBoryE. Handover /mnt/project-files/predaja/ucbenik.md.
- PILOT: j's matura friends join (MAT); invite drafted, j sends 15 Nov. j may send friends evklid.app now (4 Nov).
- CAS https://claude.ai/artifact/15ugM9DmxowjTJV5aAZrcc; thread cmsg_011HYzNBAS5HRU1H7PcSE7Jt1fQ57TjYAbLQHpmK2oJiHs. All 3 phases merged 4 Nov (#361, #382, #428); details [[evklid-cas]].
- OPTIMIZER later: per-skill mastery, weekly parent email, audit log. REJECTED: OpenAI mix, LangChain, Supabase, Pinecone, LiteLLM/Llama, Mathpix, Postgres before pilot, cutting features.
- NPZ: RIC request draft /mnt/project-files/evklid/npz-matura/prosnja-ric.md.
- s.p./d.o.o. card resent 1 Dec.

## Standing rules from j
- Gemini relays: reply with ONLY paste-ready text ([[j-gemini-replies]]).
- ALL DECISIONS for j go as cards into ONE thread »Odločitve zate« cmsg_011HYzNBAS5HRU1H7PcSE7Jt6zBtvecoWzGJyRTNXXvC1w. List artifact https://claude.ai/artifact/BUjXwR9kj1ZUwouhV4yuxm.
- Whenever a source/reference is needed, find the best possible one.
- May improve correctness/function/cost without asking if look unchanged.
- Proposals every morning 8:00 Ljubljana as thread message, not email.
- ALL PLATFORMS always match look+function. No wasted side space. Equations must wrap, not scroll.
- NEVER use tiny scroll arrows/mini scrollbars (▲▼ steppers) anywhere (j 4 Nov 21:29).
- Only Evklid keyboard everywhere except login credentials.
- Pricing maximizes j's net, ≥75 % margin. Only open tools.
- Claude may type passwords on j's device; never print secrets.
- API credit 200 $ (3 Nov); j downgrades to Max 5x 28 Nov → budget 100 $.
- Features before lessons. Gemini = ideas only.
- Weekly limit resets Wed 02:00 UTC; weekly stop at 95 %; 1 % ≈ $20–24.
- NO cap on parallel threads. Small asks still to existing threads.
- Optimizer owns pacing + docs/token-rules.md. Content Opus/Fable.
- REVIEWS (j 4 Nov): small fixes = ONE review; big changes/content = triple review.
- PRs: bundle, describe what/why/tested, npm test must pass, new features ≥1 test, fresh main. Tutor prompt + big look changes wait for j.
- Lesson queue: MAT-SS-3/4 → FIZ/KEM OŠ → new → FIZ/KEM SŠ → NAR/BIO.
- Tutor may change all settings except financial/personal. public/settings-registry.js.
- i18n: public/i18n/sl.js + 32 ui/*.json; wording docs/besedila.md.
- Lab: 80 experiments https://claude.ai/artifact/KULjnimXo1Hghn2y3Pe5xo; as realistic as possible.
- Free tier no ads, 0.2 $/student/month.

## Business
- Stripe test. 0 paying users. AI budget thread cmsg_011HYzNBAS5HRU1H7PcSE7JtCXhSZk46TY4tFKkVQPJUu3.
- Release plan https://claude.ai/artifact/MHakrxWJprdDkRnY6FEuY3: pilot 15 Nov 5–10 people, teachers Jan; zasebnost@evklid.app; no s.p.
- Materials cmsg_011HYzNBAS5HRU1H7PcSE7JtLiQtzcbSesb5tT8hXRJMM8. Nothing to people without j.
- Pricing artifact https://claude.ai/artifact/Nkb14LowXunGVjCkrvMAoA.
