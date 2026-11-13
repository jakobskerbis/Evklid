// Ime aplikacije (brand.json v korenu) za strežnik in skripte. Prejšnja imena (legacy) uporablja
// samo koda za prenos: nastavitve .env, baza, piškotki, oznake zagonskih datotek, bližnjice.
import fs from "node:fs";

export const BRAND = JSON.parse(fs.readFileSync(new URL("../brand.json", import.meta.url), "utf8"));
export const LEGACY = BRAND.legacy || [];
