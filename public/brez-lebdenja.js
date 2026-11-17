// Zaslon na dotik: brez »lebdečega« videza (:hover) (j, 17. 11. 2026: »ikone ostanejo označene«).
// Na telefonu in tablici brskalnik po tapu obdrži :hover na zadnjem gumbu, dokler ne tapneš drugam, zato je
// gumb videti izbran ali aktiven še dolgo po tem. Na napravah brez miške (hover: none) iz vseh pravil CSS
// odstranimo izbirnike s :hover (pravilo z več izbirniki ostane brez njih); tudi v slogih, ki se naložijo kasneje.
// Računalnik z miško (in naprava z dotikom in miško) ostane nespremenjen.
(function () {
  if (!window.matchMedia || !matchMedia("(hover: none)").matches) return;
  // Izbirniki na najvišji ravni, ločeni z vejico (vejice v :is(…), :not(…), [..] ostanejo).
  function split(sel) {
    var out = [], depth = 0, cur = "", q = null;
    for (var i = 0; i < sel.length; i++) {
      var c = sel[i];
      if (q) { if (c === q) q = null; cur += c; continue; }
      if (c === '"' || c === "'") q = c;
      else if (c === "(" || c === "[") depth++;
      else if (c === ")" || c === "]") depth--;
      if (c === "," && depth === 0) { out.push(cur); cur = ""; continue; }
      cur += c;
    }
    out.push(cur);
    return out.map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function clean(list) {
    if (!list) return;
    for (var i = list.length - 1; i >= 0; i--) {
      var r = list[i];
      if (r.selectorText !== undefined && r.selectorText.indexOf(":hover") !== -1) {
        var keep = split(r.selectorText).filter(function (s) { return s.indexOf(":hover") === -1; });
        try {
          if (keep.length) r.selectorText = keep.join(", ");
          else r.parentRule ? r.parentRule.deleteRule(i) : r.parentStyleSheet.deleteRule(i);
        } catch (e) {}
      } else if (r.cssRules) clean(r.cssRules); // @media, @supports, @layer
    }
  }
  var done = typeof WeakSet === "function" ? new WeakSet() : null;
  function sheet(s) {
    if (!s || (done && done.has(s))) return;
    var rules;
    try { rules = s.cssRules; } catch (e) { return; } // tuj izvor (pisave): brez :hover
    if (!rules) return;
    if (done) done.add(s);
    clean(rules);
  }
  function all() { for (var i = 0; i < document.styleSheets.length; i++) sheet(document.styleSheets[i]); }
  function watch(el) {
    if (el.tagName === "STYLE") sheet(el.sheet);
    else if (el.tagName === "LINK" && /stylesheet/i.test(el.rel)) {
      if (el.sheet) sheet(el.sheet);
      el.addEventListener("load", function () { sheet(el.sheet); });
    }
  }
  all();
  document.addEventListener("DOMContentLoaded", all);
  window.addEventListener("load", all);
  new MutationObserver(function (ms) {
    ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) watch(n); }); });
  }).observe(document.head || document.documentElement, { childList: true }); // leni slogi gredo v <head>
  window.EvklidDotik = { split: split };
})();
