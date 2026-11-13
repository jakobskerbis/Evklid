// Obvestilo »Testna verzija« pod glavo: kaj v aplikaciji še ne dela. Seznam pošlje strežnik (/api/config → test_notice),
// ker je odvisen od nastavitev (plačila v živo, e-pošta). Zaprto obvestilo se znova pokaže, ko se seznam spremeni.
import { t } from "./i18n.js";

const KEY = "evklid.testnaVerzija";
const ITEMS = { tutorOff: "beta.tutorOff", tutor: "beta.tutor", pay: "beta.pay", email: "beta.email", apps: "beta.apps" };

function get() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function set(v) {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
}

export function initTestNotice(items, { showView } = {}) {
  const box = document.getElementById("test-notice");
  const list = document.getElementById("test-notice-list");
  const more = box?.querySelector(".tn-more");
  if (!box || !list || !more) return;
  const keys = (Array.isArray(items) ? items : []).filter((k) => ITEMS[k]);
  const sig = keys.join(",");
  if (!keys.length || get() === sig) {
    box.hidden = true;
    return;
  }
  list.innerHTML = "";
  for (const k of keys) {
    const li = document.createElement("li");
    li.dataset.i18n = ITEMS[k];
    li.textContent = t(ITEMS[k]);
    list.append(li);
  }
  if (showView) {
    const li = document.createElement("li");
    li.className = "tn-report";
    const span = document.createElement("span");
    span.dataset.i18n = "beta.reportText";
    span.textContent = t("beta.reportText");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ghost small";
    btn.dataset.i18n = "beta.report";
    btn.textContent = t("beta.report");
    btn.addEventListener("click", () => showView("feedback"));
    li.append(span, " ", btn);
    list.append(li);
  }
  more.addEventListener("click", () => {
    const open = list.hidden;
    list.hidden = !open;
    more.setAttribute("aria-expanded", String(open));
  });
  box.querySelector(".tn-close")?.addEventListener("click", () => {
    set(sig);
    box.hidden = true;
  });
  box.hidden = false;
}
