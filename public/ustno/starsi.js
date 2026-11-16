// Stikalo starša v zavihku Račun (odločitev j 10. 11.): »Dovoli odgovarjanje z glasom« za profile mlajše od 15 let,
// privzeto izklopljeno. Tipkanje pri ustnem spraševanju deluje vedno. Naloži se šele, ko je zavihek Račun odprt.
import { loadDicts, tt } from "./ustno.js";
import { icon } from "../icons.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export async function karticaStarsev(el, api) {
  if (!el) return;
  let r;
  try {
    [r] = await Promise.all([api("/api/account/ustno-glas"), loadDicts()]);
  } catch {
    return;
  }
  if (!el.isConnected || !r?.profili?.length) return;
  el.innerHTML = `<div class="card us-stars">
    <h2>${icon("mic")} ${esc(tt("u.starsNaslov"))}</h2>
    <p class="muted">${esc(tt("u.starsOpis"))}</p>
    ${r.profili
      .map((p) =>
        p.pod15
          ? `<label class="check"><input type="checkbox" data-glas="${p.id}" ${p.dovoljeno ? "checked" : ""}><span><b dir="auto">${esc(p.ime)}</b>: ${esc(tt("u.dovoli"))}</span></label>`
          : `<p><b dir="auto">${esc(p.ime)}</b>: ${esc(tt("u.nad15"))}</p>`,
      )
      .join("")}
    <p class="muted small" role="status" aria-live="polite"></p>
  </div>`;
  const status = el.querySelector('[role="status"]');
  el.querySelectorAll("[data-glas]").forEach((cb) =>
    cb.addEventListener("change", async () => {
      cb.disabled = true;
      try {
        await api("/api/account/ustno-glas", { method: "POST", body: { student_id: Number(cb.dataset.glas), dovoli: cb.checked } });
        status.textContent = tt("u.shranjeno");
      } catch (e) {
        cb.checked = !cb.checked;
        status.textContent = e?.message || "";
      } finally {
        cb.disabled = false;
      }
    }),
  );
}
