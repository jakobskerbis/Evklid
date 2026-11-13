// Kviz v živo za razred: učitelj ga vodi na projektorju (ucitelj.html), učenci odgovarjajo v Ligah.
// Strežnik: server/kviz.js. Oba pogleda vprašata strežnik vsakih 1,5 s; čas teče po uri strežnika.
import { t } from "./i18n.js";
import { icon, hydrateIcons } from "./icons.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const LETTERS = "ABCDEFGHIJ";
const POLL = 1500;
const msgOf = (d, status) => (d.code && t(d.code, d.params || {}) !== d.code ? t(d.code, d.params || {}) : d.error || t("common.error", { status }));

async function call(url, { method = "GET", body, headers = {} } = {}) {
  let r;
  try {
    r = await fetch(url, { method, headers: { "Content-Type": "application/json", ...headers }, body: body && JSON.stringify(body) });
  } catch {
    throw Object.assign(new Error(t("off.noConnection")), { status: 0 });
  }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(msgOf(d, r.status)), { status: r.status, data: d });
  return d;
}

// Naslov okna: »Kviz v živo · 7.a · tema«; imena v <bdi>, da se v RTL ne pomešajo.
const titleHtml = (...names) => [esc(t("kv.live")), ...names.filter(Boolean).map((n) => `<bdi>${esc(n)}</bdi>`)].join(" · ");

// Okno čez ves zaslon; zapre se z gumbom ali Esc. Vrne { dlg, body, foot, close }.
// Fokus gre na naslov (bralnik zaslona ga prebere), ne na gumb za zapiranje.
function screen(cls, title, onClose) {
  const dlg = document.createElement("dialog");
  dlg.className = `kv ${cls}`;
  dlg.setAttribute("aria-labelledby", "kv-title");
  dlg.innerHTML = `<header class="kv-head"><h2 id="kv-title" tabindex="-1"></h2><span class="kv-timer" role="timer" aria-live="off" aria-label="${esc(t("kv.seconds"))}"></span>
    <button type="button" class="ghost kv-x" aria-label="${esc(t("gr.close"))}" title="${esc(t("gr.close"))}">${icon("x")}</button></header>
    <div class="kv-body" aria-live="polite"></div><footer class="kv-foot"></footer>`;
  document.body.append(dlg);
  $(dlg, "h2").innerHTML = title;
  hydrateIcons(dlg);
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    onClose?.();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    dlg.close();
    dlg.remove();
  };
  $(dlg, ".kv-x").addEventListener("click", close);
  dlg.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  dlg.showModal();
  $(dlg, "h2").focus();
  return { dlg, body: $(dlg, ".kv-body"), foot: $(dlg, ".kv-foot"), close, isClosed: () => closed };
}
const $ = (root, s) => root.querySelector(s);

// Odštevanje po uri strežnika (odmik izmerimo ob vsakem odgovoru strežnika).
function timer(el) {
  let end = 0;
  let offset = 0;
  const tick = () => {
    if (!end) return (el.textContent = "");
    const left = Math.max(0, Math.ceil((end - (Date.now() + offset)) / 1000));
    el.textContent = String(left);
    el.classList.toggle("low", left <= 5);
  };
  const id = setInterval(tick, 250);
  return {
    set(v) {
      offset = v.now - Date.now();
      end = v.state === "question" ? v.endsAt : 0;
      tick();
    },
    stop: () => clearInterval(id),
  };
}

const boardHtml = (rows, total, me = null) =>
  `<ol class="kv-board">${rows
    .map((r) => `<li${r.nick === me ? ' class="me"' : ""}><span class="kv-rank">${r.rank}.</span><bdi>${esc(r.nick)}</bdi><b>${r.score}</b>${total ? `<small>${esc(t("kv.correctOf", { n: r.correct, total }))}</small>` : ""}</li>`)
    .join("")}</ol>`;

// Odgovor, ki je prišel pozneje od novejšega (poizvedba je bila na poti med klikom), ne sme stanja vrniti nazaj.
const stale = (v, nv) => v && nv.id === v.id && nv.v < v.v;

const head = (v) => (v.q >= 0 ? `<p class="kv-qn">${esc(t("kv.question", { n: v.q + 1, total: v.total }))}</p>` : "");

// --- učitelj (projektor) ---

export function hostQuiz({ code, key, game, onClose }) {
  const headers = key ? { "X-Teacher-Key": key } : {};
  const base = `/api/teacher/classes/${encodeURIComponent(code)}/kviz`;
  const s = screen("kv-host", titleHtml(game.className, game.topic.name), () => {
    clearInterval(poll);
    tm.stop();
    onClose?.();
  });
  const tm = timer($(s.dlg, ".kv-timer"));
  let v = null;
  let shown = "";
  let busy = false;

  const render = (nv) => {
    if (stale(v, nv)) return;
    v = nv;
    tm.set(v);
    if (v.state === "end") clearInterval(poll); // rezultati se ne spreminjajo več
    const k = `${v.state}:${v.q}`;
    if (k === shown && v.state === "question") {
      // isto vprašanje: posodobimo samo števec odgovorov (brez utripanja formul)
      $(s.body, ".kv-answered").textContent = t("kv.answered", { n: v.answered, total: v.players });
      return;
    }
    if (k === shown && v.state === "lobby") {
      // čakalnica: samo vzdevki, gumbi ostanejo (sicer bi klik ob osvežitvi zgrešil, fokus bi skakal)
      $(s.body, ".kv-count").textContent = t("kv.joined", { n: v.players });
      $(s.body, ".kv-nicks").innerHTML = (v.nicks || []).map((n) => `<span class="code-chip"><bdi>${esc(n)}</bdi></span>`).join("");
      return;
    }
    if (k === shown) return;
    shown = k;
    const q = v.question;
    let html = "";
    if (v.state === "lobby") {
      html = `<div class="kv-lobby"><p class="kv-big">${esc(t("kv.joinHow"))}</p>
        <p class="kv-count">${esc(t("kv.joined", { n: v.players }))}</p>
        <div class="kv-nicks">${(v.nicks || []).map((n) => `<span class="code-chip"><bdi>${esc(n)}</bdi></span>`).join("")}</div></div>`;
    } else if (v.state === "question") {
      html = `${head(v)}<div class="kv-q" dir="auto">${q.html}</div>
        ${q.options ? `<ol class="kv-opts">${q.options.map((o, i) => `<li><span class="kv-l">${LETTERS[i]}</span><span>${o}</span></li>`).join("")}</ol>` : ""}
        <p class="kv-answered">${esc(t("kv.answered", { n: v.answered, total: v.players }))}</p>`;
    } else if (v.state === "reveal") {
      const c = v.counts;
      const max = Math.max(1, ...(c.options || [0]));
      html = `${head(v)}<div class="kv-q" dir="auto">${q.html}</div>
        ${q.options
          ? `<ol class="kv-opts kv-res">${q.options.map((o, i) => `<li class="${i === q.index ? "ok" : ""}"><span class="kv-l">${LETTERS[i]}</span><span>${o}</span>${i === q.index ? `<span class="kv-ok" role="img" aria-label="${esc(t("kv.correctAnswer"))}">${icon("check")}</span>` : ""}<span class="kv-bar" style="--w:${(c.options[i] / max) * 100}%"></span><b>${c.options[i]}</b></li>`).join("")}</ol>`
          : `<p class="kv-ans">${esc(t("kv.correctAnswer"))}: <b><bdi>${q.answerHtml}</bdi></b></p>`}
        <p class="kv-sum"><span class="ok">${icon("check")} ${esc(t("task.correct"))}: ${c.right}</span> · <span class="bad">${icon("x")} ${esc(t("task.wrong"))}: ${c.wrong}</span> · ${esc(t("kv.none"))}: ${c.none}</p>
        ${q.solutionHtml ? `<details class="kv-sol"><summary>${esc(t("task.solution"))}</summary>${q.solutionHtml}</details>` : ""}
        ${v.board.length ? `<h3>${esc(t("kv.top"))}</h3>${boardHtml(v.board, 0)}` : ""}`;
    } else {
      html = `<h3>${esc(t("kv.results"))}</h3>${v.board.length ? boardHtml(v.board, v.total) : `<p class="muted">${esc(t("kv.nobody"))}</p>`}`;
    }
    s.body.innerHTML = html;
    hydrateIcons(s.body);
    const label = { lobby: "common.start", question: "kv.reveal", reveal: v.q + 1 < v.total ? "tour.next" : "kv.results", end: "gr.close" }[v.state];
    s.foot.innerHTML = `<button type="button" class="primary kv-go">${esc(t(label))}</button>
      ${document.fullscreenEnabled ? `<button type="button" class="secondary kv-fs">${icon("maximize")}<span>${esc(t("kv.fullscreen"))}</span></button>` : ""}
      ${v.state === "end" ? "" : `<button type="button" class="ghost kv-end">${esc(t("kv.end"))}</button>`}`;
    hydrateIcons(s.foot);
    $(s.foot, ".kv-go").addEventListener("click", go);
    $(s.foot, ".kv-fs")?.addEventListener("click", () => (document.fullscreenElement ? document.exitFullscreen() : s.dlg.requestFullscreen()).catch(() => {}));
    $(s.foot, ".kv-end")?.addEventListener("click", async () => {
      if (!confirm(t("kv.endConfirm"))) return;
      await call(base, { method: "DELETE", headers }).catch(() => {});
      s.close();
    });
    $(s.foot, ".kv-go").focus();
  };
  const fail = (e) => {
    s.body.innerHTML = `<p>${esc(e.message)}</p>`;
    s.foot.innerHTML = "";
    clearInterval(poll);
    tm.stop();
    $(s.dlg, ".kv-timer").textContent = "";
  };
  async function go() {
    if (v.state === "end") return s.close();
    if (busy) return;
    busy = true;
    try {
      render(await call(`${base}/naprej`, { method: "POST", headers, body: { state: v.state, q: v.q } }));
    } catch (e) {
      if (e.status === 404) fail(e);
    } finally {
      busy = false;
    }
  }
  const poll = setInterval(async () => {
    if (busy || s.isClosed()) return;
    try {
      const nv = await call(base, { headers });
      if (s.isClosed()) return;
      if (!nv.state) return fail(new Error(t("kv.gone")));
      render(nv);
    } catch (e) {
      if (e.status === 404 || e.status === 403) fail(e);
    }
  }, POLL);
  render(game);
}

// --- učenec ---

export function playQuiz(studentId, gameId, onClose) {
  const base = `/api/students/${studentId}/kviz/${encodeURIComponent(gameId)}`;
  const s = screen("kv-play", titleHtml(), () => {
    clearInterval(poll);
    tm.stop();
    onClose?.();
  });
  const tm = timer($(s.dlg, ".kv-timer"));
  let v = null;
  let shown = "";
  let sending = false;
  s.body.innerHTML = `<p class="muted">${esc(t("common.loading"))}</p>`;

  const scoreLine = () => (v.rank ? `<p class="kv-score">${esc(t("kv.score", { n: v.score, rank: v.rank, players: v.players }))}</p>` : "");
  const render = (nv) => {
    if (stale(v, nv)) return;
    v = nv;
    tm.set(v);
    if (v.state === "end") clearInterval(poll);
    $(s.dlg, "h2").innerHTML = titleHtml(v.className);
    const k = `${v.state}:${v.q}:${v.answered}`;
    if (k === shown && v.state !== "lobby") return;
    shown = k;
    const q = v.question;
    let html = "";
    if (v.state === "lobby") html = `<div class="kv-lobby"><p class="kv-big">${esc(t("kv.wait"))}</p><p class="muted">${esc(v.topic)} · ${esc(t("kv.joined", { n: v.players }))}</p></div>`;
    else if (v.state === "question" && v.answered) html = `${head(v)}<p class="kv-big">${icon("circle-check")} ${esc(t("kv.sent"))}</p>`;
    else if (v.state === "question") {
      html = `${head(v)}<div class="kv-q" dir="auto">${q.html}</div>
        ${q.options
          ? `<div class="kv-opts kv-pick">${q.options.map((o, i) => `<button type="button" class="kv-opt" data-i="${i}"><span class="kv-l">${LETTERS[i]}</span><span>${o}</span></button>`).join("")}</div>`
          : `<form class="kv-form row"><input name="a" autocomplete="off" inputmode="${q.type === "number" ? "decimal" : "text"}" placeholder="${esc(t("kv.answerPh"))}" aria-label="${esc(t("kv.answerPh"))}" required>${q.unit ? `<span class="kv-unit">${esc(q.unit)}</span>` : ""}<button class="primary" type="submit">${esc(t("kv.send"))}</button></form>`}
        <p class="kv-msg" role="alert"></p>`;
    } else if (v.state === "reveal") {
      const r = v.result;
      const res = r.ok
        ? `<p class="kv-big ok">${icon("circle-check")} ${esc(t("kv.plus", { n: r.points }))}</p>`
        : `<p class="kv-big bad">${icon("circle-x")} ${esc(t(r.none ? "comp.timeUp" : "task.wrong"))}</p><p class="kv-ans">${esc(t("kv.correctAnswer"))}: <b><bdi>${q.answerHtml}</bdi></b></p>`;
      html = `${head(v)}${res}${scoreLine()}`;
    } else html = `<p class="kv-big">${esc(t("kv.over"))}</p>${scoreLine()}<p class="muted kv-c">${esc(t("kv.correctOf", { n: v.correct, total: v.total }))}</p>`;
    s.body.innerHTML = html;
    hydrateIcons(s.body);
    s.body.querySelectorAll(".kv-opt").forEach((b) => b.addEventListener("click", () => send(Number(b.dataset.i))));
    const f = $(s.body, ".kv-form");
    if (f) {
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        send(f.elements.a.value);
      });
      f.elements.a.focus();
    }
  };
  const fail = (e) => {
    s.body.innerHTML = `<p class="kv-big">${esc(e.message)}</p>`;
    clearInterval(poll);
    tm.stop();
    $(s.dlg, ".kv-timer").textContent = "";
  };
  async function send(input) {
    if (sending) return;
    sending = true;
    s.body.querySelectorAll("button").forEach((b) => (b.disabled = true));
    try {
      render(await call(`${base}/odgovor`, { method: "POST", body: { q: v.q, input } }));
    } catch (e) {
      s.body.querySelectorAll("button").forEach((b) => (b.disabled = false));
      const m = $(s.body, ".kv-msg");
      if (e.status === 404) fail(e);
      else if (e.status === 409) shown = ""; // vprašanje se je vmes zaprlo: naslednje vprašanje strežnika pokaže rezultat
      else if (m) m.textContent = e.message;
    } finally {
      sending = false;
    }
  }
  let poll = null;
  call(`${base}/join`, { method: "POST" })
    .then((nv) => {
      if (s.isClosed()) return;
      render(nv);
      if (v.state === "end") return;
      poll = setInterval(async () => {
        if (sending || s.isClosed()) return;
        try {
          render(await call(base));
        } catch (e) {
          if (e.status === 404) fail(e);
        }
      }, POLL);
    })
    .catch(fail);
}

// Kartica v Ligah, ko v učenčevem razredu poteka kviz. Prazno, ko kviza ni.
export async function quizCardHtml(studentId) {
  let d;
  try {
    d = await call(`/api/students/${studentId}/kviz`);
  } catch {
    return "";
  }
  return d.games
    .map(
      (g) => `<div class="card kv-card"><p>${icon("zap")} <b>${esc(t("kv.liveIn", { name: g.className }))}</b><br><span class="muted">${esc(g.topic)}</span></p>
      <button type="button" class="primary" data-kviz="${esc(g.id)}">${esc(t("kv.joinBtn"))}</button></div>`,
    )
    .join("");
}
