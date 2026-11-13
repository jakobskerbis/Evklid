// Skupni pripomočki za orodja (tools.js, tools-chem.js, tools-prob.js).
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const texHtml = (s, display = false) => {
  try {
    return window.katex.renderToString(s, { throwOnError: false, displayMode: display, strict: "ignore" });
  } catch {
    return esc(s);
  }
};
export const usesComma = (locale) => {
  try {
    return (1.5).toLocaleString(locale || "sl").includes(",");
  } catch {
    return true;
  }
};
export const remember = {
  get(k, d) {
    try {
      return JSON.parse(localStorage.getItem(k) || "null") ?? d;
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

