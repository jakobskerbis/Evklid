// Skrčene datoteke JS (N-08c, j 26. 11. 2026, kartica »Vse tri«): pred stiskanjem (server/compress.js) odstranimo
// komentarje in presledke ter skrajšamo sintakso (esbuild transform: minifyWhitespace + minifySyntax). Imena funkcij
// in spremenljivk ostanejo, zato so sporočila o napakah iz brskalnika še berljiva. Prenos prvega odprtja je ~27 %
// manjši (brotli), vsebina modula se ne spremeni. Samo datoteke aplikacije iz public/ (ne vendor, ne sw.js, ki mu
// strežnik vstavi različico); licenčni komentarji ostanejo (legalComments: "inline").
// Vklop: na produkciji (jeProdukcija) in v dimnem testu (scripts/preveri-aplikacijo.cjs), izklop EVKLID_SKRCI=0.
// Neuspeh (napaka razčlenjevanja) ne ustavi ničesar: datoteka gre nespremenjena.
import { jeProdukcija } from "./crypto-polje.js";

export const skrciVklopljeno = (env = process.env) => env.EVKLID_SKRCI === "1" || (env.EVKLID_SKRCI !== "0" && jeProdukcija(env));

let esbuild = null;
const IZPUSTI = /(^|[\\/])sw\.js$/;

// Vrne skrčeno vsebino (Buffer) ali null, če datoteke ne krčimo.
export async function skrciJs(buf, file) {
  if (!file.endsWith(".js") || IZPUSTI.test(file)) return null;
  esbuild ||= await import("esbuild");
  const { code } = await esbuild.transform(buf.toString("utf8"), {
    minifyWhitespace: true,
    minifySyntax: true,
    legalComments: "inline",
    charset: "utf8",
    sourcefile: file,
  });
  return Buffer.from(code);
}
