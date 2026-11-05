---
name: evklid-windows
description: Evklid movable windows, menu-row reordering, tutor chat bubble and always-visible text (PR #215, thread "Odpiraj dele aplikacije kot premična okna", 30 Oct 2026)
metadata:
  type: project
  modified: 2026-10-30T13:30:47.843Z
---

j asked 30 Oct 2026 (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtFxTMTDFmsyphLx1e2exR1y): every app section draggable/resizable like Windows windows; drag a top tab icon onto the page; snap to half screen OR float anywhere; tutor "odpri kalkulator" opens it; tutor chat as removable SMS-style bubble outside the chat; every row menu reorderable; on phone the user's text, tutor text and task text always visible, else a popup with calm animation.

- PR #215 (branch claude/project-thread-z5igg3). Code: public/okna.js + okna.css (views reparented into windows, phone = bottom sheet), public/vrstice.js makeRowSortable (tabs, #tabbar, #modebar, .calc-modes, Zbirke), public/razpri.js (growing #input, overflow popup), server/chat-settings.js open_window tool + regex intent (no model call), device setting `windows` + "Ponastavi postavitev". Tests test/okna.test.js; smoke step `okna`. Docs: oblikovanje.md "Premična okna", "Besedilo vedno vidno".
- Triple review done 30 Oct (pass 2 bubble avoids windows, z-index capped; pass 3 narrow-window layouts, RTL, top bar: tabs scroll + mask fade, pills opaque). Phone calculator sheet 92 % height. Merged 30 Oct ~15:30 UTC with j's OK.
- Inner panel resizing (j 30 Oct 19:42): PR #235, public/razdelilnik.js makeSplitter (CSS var per container, localStorage evklid.razdelilnik), chat list (collapsible), path side, topic/practice, lesson+sim, graph panel, sci keypad; tied to `windows` setting + reset. Merged 31 Oct 03:40 UTC.
- j 31 Oct: windows/reorder/splitters must also work for everything added later, incl. weekly updates (cosmetics, IGRE, corner). Rule: docs/oblikovanje.md »Nove stvari (tudi tedenske posodobitve)«; enforced by test/okna-vsi.test.js (top tab → view + WINDOW_VIEWS) and smoke step `okna-vsi` (every tab opens as window; 2 tall grid or flex columns without .split-handle = error, opt-out data-brez-locnice). PR #243 merged 31 Oct 03:50 UTC.
- Screenshots /mnt/project-files/evklid/posnetki-okna/.

Related: [[evklid-ui-design]] [[evklid-graph-calculator]]
- PR #285 (4 Nov): bubble drop-on-X was broken (X hid before the check); now X magnet (96 px) + flick toward X closes (public/magnet.js).
