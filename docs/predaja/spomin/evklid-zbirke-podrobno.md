---
name: evklid-zbirke-podrobno
description: Knowledge collections + learning pass (PR #131, 29 Oct 2026) from j's cosmetics doc; rules and where the code lives
metadata:
  type: project
  modified: 2026-10-29T18:27:05.995Z
---

j's doc »Kozmetika in personalizacija v STEMMind igrah« (Claude Doc https://claude.ai/artifact/CipK75jjEf4tMk1dxJrTKR) was applied as MVP in PR #131 (merged 2026-10-29). <!-- brand:legacy -->

- Data/rules: public/zbirke.js (44 items: Periodni sistem badges, Fizikalni efekti fx, Matematične krivulje bg, 3 set items; 6 seasonal pass items `id~YYYY-[12]`). Rarity = topic level (topicTier), max 2 % legendary. New item = new row + drawing.
- Server: server/zbirke.js (sync on correct answer / chat mastery / view; manual mastery never counts; revoke keeps history). View: public/zbirke-view.js + zbirke.css; Jaz card; button in Igre; shop shows knowledge items as not buyable.
- Avatar slots now 9 (added badge, fx). Streak has auto freeze (1 missed day / 7) in progress.dayStreak.
- Doc rules to keep: knowledge is the only currency for these items, no loot boxes/randomness/timers, no paid cosmetics year 1, no chat between users.
- Not done (doc phase 2+): class showcase opt-in, peers inspecting showcase, share card.
- **Pot znanja (PR #135, merged 29 Oct, j: "more epic/legendary/mythic items for more points, as before"):** collection `pot`, 14 items unlocked by total XP (header star, incl. games): epic 2k–10k, legendary 15k–50k, mythic 60k–120k (new rarity `mythic`, only in pot). `need: {xp}`, granted in sync with source "xp". Hat slot accepts knowledge items (DRAW.hat). Optional `about` text per item.
- **PR #139 (merged 29 Oct, j's asks 18:28–18:34):** drawers hat/outfit/acc/badge/fx hold a list of up to 6 ids (MULTI, spotOf/SPOT in public/avatar.js: same spot replaces; old single strings still load). Lige: 44px avatars, avatar in hero, monthly board per stage (server/leagues.js monthView), week/month toggle for classes. Win badges collection `lige` (win_week_0..6 per league tier, win_week_podium, win_month, win_month_podium), granted into knowledge_items source 'league' when ≥3 students with XP (AWARD_MIN in public/zbirke.js).
- **PR #142 (merged 29 Oct):** drawer `kind` (Lik): 12 characters (cat…dragon) drawn in body colour (KIND, DRAW.kindBack/kindFront in public/zbirke.js) + 4 game items; collection `igre`, need {games: correct answers} or {cleared: different cleared games}; granted in Knowledge.sync, games result route returns `zbirke`.
- **PR #144 (merged 29 Oct, j: »barve naj bodo brezplačne liki pa ne«):** all 10 body colours cost 0; refundBodyColours in server/avatar.js refunds past colour purchases once at startup (reason `vračilo: avatar: body_x`, excluded from daily coin cap). Characters (kind) stay game-only. Coin shop still sells hats/outfits/etc.
- **PR #160 (merged 30 Oct, j: »redkejši predmeti s primernim okvirjem«):** rarities cosmic (Kozmičen) and eternal (Večen) above mythic, only Pot znanja (blackhole 160k, comet 200k, starcrown 300k XP) and igre (kind_phoenix 4000 games, kind_whale 200 cleared). Shop: price >1000 = mythic (hat_flame 1500, bg_nebula 2000, outfit_starcape 2500). Rarity frames all in public/games.css (gradient border-box, spinning conic for cosmic/eternal, ✦/∞ chip).
- **Weekly cosmetics updates (j 30 Oct, PR #190):** scheduled task fires into this thread Wed 02:13 UTC; recipe docs/kozmetika-posodobitve.md (4–6 items/week, ADDED → 7-day »Novo«). Inputs (app on Render since 30 Oct): GET evklid.app/api/kozmetika/export with Bearer EVKLID_EXPORT_TOKEN (PR #192; 404 without; wishes no names, deleted after 90 days). Token set 30 Oct (Render + Claude network secret) Game types weekly: IGRE thread (~04:13 UTC). +1 maths-history theme/week after PR #220 (docs/oblikovanje.md); themes need j's OK with screenshots before merge.

**Why:** j wants cosmetics that prove knowledge, safe for kids under EU loot-box rules.
**How to apply:** new cosmetic items go into public/zbirke.js with a mastery rule, never a price. See [[evklid-ui-design]].
