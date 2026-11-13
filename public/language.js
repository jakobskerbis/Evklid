// Izbira jezika (Nastavitve in prvi zagon). Seznam ima iskalnik (dropdown.js pri dolgih seznamih).
import { icon } from "./icons.js";
import { t, currentLang, languageOptions, setLanguage } from "./i18n.js";
import { langInfo, uiLanguage, UI_LANGUAGES } from "./i18n/languages.js";

// onChange(code) shrani jezik v profil (če obstaja); nato se stran naloži znova v novem jeziku.
export function mountLanguageCard(box, { compact = false, onChange = null } = {}) {
  if (!box) return;
  const lang = currentLang();
  const uiNote = (code) => {
    const ui = uiLanguage(code);
    return ui === code ? "" : t("lang.uiIn", { lang: langInfo(ui).native });
  };
  box.innerHTML = `
    ${compact ? "" : `<h2 class="h-icon">${icon("globe")}${t("lang.title")}</h2>`}
    <label class="lang-field"><span class="${compact ? "" : "sr-only"}">${compact ? `${icon("globe")} ` : ""}${t("lang.label")}</span>
      <select class="lang-select" data-search data-search-ph="${t("common.search")}" data-empty-text="${t("common.noOptions")}">${languageOptions(lang)}</select>
    </label>
    <p class="muted small-note lang-ui-note"${uiNote(lang) ? "" : " hidden"}>${uiNote(lang)}</p>
    ${compact ? "" : `<p class="muted small-note">${t("lang.note", { n: UI_LANGUAGES.length })}</p>`}`;
  const sel = box.querySelector(".lang-select");
  sel.addEventListener("change", async () => {
    const code = sel.value;
    const note = box.querySelector(".lang-ui-note");
    note.textContent = t("lang.saving");
    note.hidden = false;
    sel.disabled = true;
    try {
      if (onChange) await onChange(code);
    } finally {
      if (!setLanguage(code)) {
        sel.disabled = false;
        note.textContent = uiNote(code);
      }
    }
  });
}
