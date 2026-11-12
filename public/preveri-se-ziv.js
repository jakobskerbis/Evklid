// »Preveri se« v spletnem učbeniku: vpiši število in razvrsti (vrste z poljem type, public/preveri-se.js).
// Naloži se samo pri lekciji s takim vprašanjem (public/textbook.js), zato prvo odprtje aplikacije ne raste.
// Odziv je enak kot pri izbiri (»Pravilno!«, »Ni čisto tako.« z razlago »~«); prvi odgovor gre med šibke točke.
import { t } from "./i18n.js";
import { checkNumber, orderOk, orderHits, moveItem, placeItem } from "./preveri-se.js";

// Gumbi vsaj 44 px, deluje pri širini 360 px; slogi tu, ker jih drugje ni treba nalagati.
const CSS = `
.tb-vnos { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.tb-vnos input { flex: 1 1 8em; max-width: 14em; min-height: 44px; font-size: 1rem; }
.tb-vnos input.ok { border-color: var(--ok); }
.tb-vnos input.bad { border-color: var(--danger); }
.tb-vnos-enota { font-weight: 600; }
.tb-vnos button { min-height: 44px; }
.tb-vnos-prazno { margin: 4px 0; }
.tb-order-hint { margin: 0 0 6px; font-size: 0.92rem; }
.tb-checks ol.tb-order { list-style: none; padding: 0; margin: 0 0 8px; display: grid; gap: 6px; }
.tb-order-item { display: flex; align-items: stretch; gap: 4px; margin: 0; }
.tb-order-pick { flex: 1; min-width: 0; min-height: 44px; display: flex; align-items: center; justify-content: flex-start; gap: 10px; text-align: start; padding: 6px 10px; font-weight: 400; }
.tb-order-pick p { margin: 0; }
.tb-order-pick .katex { pointer-events: none; }
.tb-order-n { flex: none; width: 1.8em; height: 1.8em; border-radius: 50%; border: 2px dashed var(--border); display: inline-flex; align-items: center; justify-content: center; font-weight: 800; }
.tb-order-item.placed .tb-order-n { border-style: solid; border-color: var(--accent); background: var(--accent-soft); }
.tb-order-txt { min-width: 0; overflow-wrap: anywhere; }
.tb-order-mv { flex: none; width: 44px; min-height: 44px; padding: 0; display: inline-flex; align-items: center; justify-content: center; }
.tb-order-mv svg { width: 20px; height: 20px; }
.tb-order-up { display: inline-flex; transform: rotate(180deg); }
.tb-order-item.ok .tb-order-pick { border-color: var(--ok) !important; background: color-mix(in srgb, var(--ok) 15%, transparent) !important; }
.tb-order-item.bad .tb-order-pick { border-color: var(--danger) !important; }
.tb-order-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.tb-order-actions button { min-height: 44px; }
.tb-order-mv:disabled, .tb-order-actions button:disabled { opacity: 0.4; cursor: default; }
`;
function addStyle() {
  if (document.getElementById("preveri-se-css")) return;
  const st = document.createElement("style");
  st.id = "preveri-se-css";
  st.textContent = CSS;
  document.head.appendChild(st);
}

const L = "abcdefgh";

/**
 * Dopolni vprašanja .tb-typed v korenu: vnos števila ali seznam za razvrščanje (interactive), sicer prazno črto
 * oziroma premešane elemente z rešitvijo pod »Rešitev«. h: { checks, interactive, R, esc, ic, send, fit }.
 */
export function oziviPreveri(root, h) {
  addStyle();
  const { R, esc } = h;
  const inline = (md) => R(md).replace(/^\s*<p>([\s\S]*)<\/p>\s*$/, "$1");
  const unitOf = (c) => (c.unit ? ` ${inline(c.unit)}` : "");
  for (const el of root.querySelectorAll(".tb-typed:not([data-ziv])")) {
    el.dataset.ziv = "1";
    const qi = Number(el.dataset.q);
    const c = h.checks[qi];
    const body = el.querySelector(".tb-typed-body");
    if (!c || !body) continue;
    if (!h.interactive) {
      body.innerHTML =
        c.type === "stevilo"
          ? `<p class="tb-vnos-prazno">${esc(t("tb.num.label"))}: ________${unitOf(c)}</p>
            <details><summary>${esc(t("task.solution"))}</summary>${esc(c.answer)}${unitOf(c)}${c.why ? ` ${R(c.why)}` : ""}</details>`
          : `<ol type="a">${c.shown.map((k) => `<li>${R(c.items[k])}</li>`).join("")}</ol>
            <details><summary>${esc(t("task.solution"))}</summary>${c.items.map((_, i) => `${L[c.shown.indexOf(i)]})`).join(" → ")} ${c.why ? R(c.why) : ""}</details>`;
      h.fit?.(body);
      continue;
    }
    if (c.type === "stevilo") numberItem(el, body, c, qi, h, unitOf);
    else if (c.type === "razvrsti") orderItem(el, body, c, qi, h);
  }
}

function feedback(el, h, ok, html) {
  const why = el.querySelector(".tb-why");
  why.hidden = false;
  why.className = `tb-why fb ${ok ? "ok" : "bad"}`;
  why.innerHTML = html;
  h.fit?.(why);
}
const tryAgain = (R, wrongWhy) => (wrongWhy ? `Ni čisto tako. ${R(wrongWhy)} Poskusi še enkrat.` : "Ni čisto tako. Premisli še enkrat ali preberi razlago zgoraj.");

function numberItem(el, body, c, qi, h, unitOf) {
  const { R, esc } = h;
  const label = esc(t("tb.num.label"));
  // Brez negativnih vrednosti zadošča številska tipkovnica telefona (nekatere nimajo minusa).
  const mode = c.value < 0 || c.wrong.some((w) => w.value < 0) ? "text" : "decimal";
  body.innerHTML = `<form class="tb-vnos" novalidate><input type="text" inputmode="${mode}" autocomplete="off" spellcheck="false" aria-label="${label}" placeholder="${label}">${
    c.unit ? `<span class="tb-vnos-enota">${unitOf(c).trim()}</span>` : ""
  }<button type="submit" class="primary">${esc(t("tb.quiz.check"))}</button></form><div class="tb-why" hidden aria-live="polite"></div>`;
  const form = body.querySelector("form");
  const input = form.querySelector("input");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const r = checkNumber(c, input.value);
    if (r.empty) return feedback(body, h, false, esc(t("tb.num.empty")));
    h.send(qi, { v: input.value });
    input.classList.toggle("ok", r.ok);
    input.classList.toggle("bad", !r.ok);
    feedback(body, h, r.ok, r.ok ? `Pravilno! ${c.why ? R(c.why) : ""}` : tryAgain(R, c.wrong[r.wrong]?.why));
    if (r.ok) form.querySelectorAll("input, button").forEach((x) => (x.disabled = true));
  });
}

// Razvrsti: dotik elementa ga postavi na naslednje mesto (številka v krogu), puščici ga premakneta za eno mesto.
function orderItem(el, body, c, qi, h) {
  const { R, esc, ic } = h;
  const n = c.items.length;
  let order = c.shown.slice();
  let placed = 0;
  let done = false;
  let marks = null; // po preverjanju: kateri so na pravem mestu
  body.innerHTML = `<p class="muted tb-order-hint">${esc(t("tb.order.hint"))}</p><ol class="tb-order"></ol>
    <div class="tb-order-actions"><button type="button" class="primary tb-order-check">${esc(t("tb.quiz.check"))}</button><button type="button" class="ghost tb-order-reset">${esc(t("tb.order.reset"))}</button></div>
    <div class="tb-why" hidden aria-live="polite"></div>`;
  const list = body.querySelector(".tb-order");
  const checkBtn = body.querySelector(".tb-order-check");
  const resetBtn = body.querySelector(".tb-order-reset");
  const draw = (focus) => {
    list.innerHTML = order
      .map(
        (k, i) => `<li class="tb-order-item${i < placed ? " placed" : ""}${marks ? (marks[i] ? " ok" : " bad") : ""}">
          <button type="button" class="tb-order-pick" data-i="${i}"${done ? " disabled" : ""}><span class="tb-order-n" aria-hidden="true">${i < placed ? i + 1 : ""}</span><span class="tb-order-txt">${R(c.items[k])}</span></button>
          <button type="button" class="tb-order-mv" data-i="${i}" data-d="-1" aria-label="${esc(t("tb.order.up", { pos: i + 1 }))}"${done || i === 0 ? " disabled" : ""}><span class="tb-order-up">${ic("chevron-down")}</span></button>
          <button type="button" class="tb-order-mv" data-i="${i}" data-d="1" aria-label="${esc(t("tb.order.down", { pos: i + 1 }))}"${done || i === n - 1 ? " disabled" : ""}>${ic("chevron-down")}</button>
        </li>`,
      )
      .join("");
    h.fit?.(list);
    if (focus) list.querySelector(focus)?.focus();
  };
  list.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || done) return;
    const i = Number(b.dataset.i);
    marks = null;
    if (b.classList.contains("tb-order-pick")) {
      ({ order, placed } = placeItem(order, placed, i));
      draw(`.tb-order-pick[data-i="${Math.min(placed, n - 1)}"]`);
    } else {
      const d = Number(b.dataset.d);
      order = moveItem(order, i, d);
      // Fokus ostane na isti puščici premaknjenega elementa (na robu na drugi, ker je ta onemogočena).
      const j = Math.max(0, Math.min(n - 1, i + d));
      draw(`.tb-order-mv[data-i="${j}"][data-d="${j === 0 ? 1 : j === n - 1 ? -1 : d}"]`);
    }
  });
  resetBtn.addEventListener("click", () => {
    if (done) return;
    placed = 0;
    marks = null;
    draw();
  });
  checkBtn.addEventListener("click", () => {
    const ok = orderOk(c, order);
    h.send(qi, { order });
    marks = order.map((v, i) => v === i);
    done = ok;
    if (ok) {
      placed = n;
      checkBtn.disabled = true;
      resetBtn.disabled = true;
    }
    draw();
    feedback(body, h, ok, ok ? `Pravilno! ${c.why ? R(c.why) : ""}` : `Ni čisto tako. ${esc(t("tb.order.wrong", { ok: orderHits(order), all: n }))}`);
  });
  draw();
}
