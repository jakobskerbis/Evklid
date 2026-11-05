---
name: evklid-zbirke
description: Knowledge collections + learning pass (PR #131, 29 Oct 2026) from j's cosmetics doc; rules and where the code lives
metadata:
  type: project
  modified: 2026-11-04T06:40:00.000Z
---

j's doc »Kozmetika in personalizacija v STEMMind igrah« (Claude Doc https://claude.ai/artifact/CipK75jjEf4tMk1dxJrTKR) was applied as MVP in PR #131 (merged 2026-10-29). <!-- brand:legacy -->

- Data/rules: public/zbirke.js (44 items: Periodni sistem badges, Fizikalni efekti fx, Matematične krivulje bg, 3 set items; 6 seasonal pass items `id~YYYY-[12]`). Rarity = topic level (topicTier), max 2 % legendary. New item = new row + drawing.
- Server: server/zbirke.js (sync on correct answer / chat mastery / view; manual mastery never counts; revoke keeps history). View: public/zbirke-view.js + zbirke.css; Jaz card; button in Igre; shop shows knowledge items as not buyable.
- Avatar slots now 9 (added badge, fx). Streak has auto freeze (1 missed day / 7) in progress.dayStreak.
- Doc rules to keep: knowledge is the only currency for these items, no loot boxes/randomness/timers, no paid cosmetics year 1, no chat between users.
- Not done (doc phase 2+): class leaderboard opt-in for showcase, peers inspecting showcase, share card, seasonal colour variants returning next year are automatic via season key.
- **Pot znanja (PR #135, merged 29 Oct, j: "more epic/legendary/mythic items for more points, as before"):** collection `pot`, 14 items unlocked by total XP (header star, incl. games): epic 2k–10k, legendary 15k–50k, mythic 60k–120k (new rarity `mythic`, only in pot). `need: {xp}`, granted in sync with source "xp". Hat slot accepts knowledge items (DRAW.hat). Optional `about` text per item.
- **Smešni liki (PR #230 merged 30 Oct, j: "italian brainrot" items + characters for XP, only non-vulgar):** collection `smesni`, 18 XP items 300–26k XP (PR #233 added 9 more after j: "naredi jih še več"; 10 `kind`s incl. Tung Tung Tung Hlodek, Škampini Mačkini, Lubenicini Krokodilini). Own drawings/names riffing on benign memes, no songs, skip blasphemous/violent ones (Tralalero, Bombardiro, Cappuccino Assassino). Only XP-unlocked `kind`s; max legendary. Screenshots /mnt/project-files/evklid/posnetki-zbirke/.
- Weekly run 4 Nov: PR #277 merged (hat_chef, acc_bubble, outfit_puffer, bg_pyramids, pot_rhind 25k XP); 0 wishes/trends yet. Era theme Egipt PR #287 MERGED 4 Nov with j's OK: tutor greeting in a temple pylon (chat.frame "pilon", building.front = one fixed-ratio SVG, exception to #294's frame "stavba" parts); wallpaper shaduf instead of columns. RULE (j 4 Nov): columns/stebri only for Antični; every other era gets a building of its own period (Taj Mahal etc.). Weekly new theme = era building, no columns, no religious symbols, j reviews screenshots first. Cosmetics thread hit the 24-attachment cap: link screenshots by path.
- Phase 2 PR #340 merged 4 Nov (j: »dokončaj vse«): class showcase opt-in (server/vitrina.js, default off, teacher-opened classes only, teacher off clears opt-ins, Preglej = topic+subject+date, never grade) and share card PNG (public/deli-kartico.js, no personal data, app share via native bridge PR #344, needs next APK). j 4 Nov: no parent switch, class XP board stays for all, zasebnost.html sentence added (PR #355).
- Body colours free since PR #144 (j); later PRs (#139 combos, #142 characters, #160 rarities, #190/#192 weekly updates) in [[evklid-zbirke-podrobno]].

**Why:** j wants cosmetics that prove knowledge, safe for kids under EU loot-box rules.
**How to apply:** new cosmetic items go into public/zbirke.js with a mastery rule, never a price. See [[evklid-ui-design]].
