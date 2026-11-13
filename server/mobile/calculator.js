// Stran /kalkulator: kalkulator spletne aplikacije (znanstveni, grafični, orodja, PSE) brez prijave,
// za WebView v mobilni aplikaciji (mobile/src/app/calculator.tsx). ?mode=sci|graph|tools|pse, ?lang=xx,
// ?theme=dark|light, ?subject=KEM. Skripte so lastne datoteke (public/kalkulator*.js), zato velja ista CSP
// kot za ostale strani (script-src 'self'). Shranjeni grafi potrebujejo prijavo, zato jih stran ne kaže.
import path from "node:path";
import { fileURLToPath } from "node:url";

const page = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "kalkulator.html");

export function mountCalculator(app) {
  app.get("/kalkulator", (_req, res) => {
    res.set("Cache-Control", "no-cache").type("html").sendFile(page);
  });
}
