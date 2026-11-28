// Pet statusov preverjanja na zaslonu »Skeniraj« (j, 25. 11. 2026: »Nikoli ne prikazuj lažne gotovosti.«).
// To je edino mesto, ki iz dokazov preverjanja določi status; lastni reševalnik (solvecore.js), preverjanje AI rešitev
// (verify.js, server/scan.js) in vmesnik (scan.js) ga vsi kličejo tukaj. Nov modul, ker ga uvažajo tako
// solvecore.js kot verify.js (verify.js uvaža solvecore.js, zato ga ne more imeti nobeden od njiju brez krožnega uvoza).
//
//   verified    Preverjeno           točna algebra ali SymPy dokaže celotno množico rešitev (nobena ne manjka, nobena ni odveč)
//   partial     Delno preverjeno     vsaka navedena rešitev drži, popolnost ni preverjena (periodične rešitve, sistemi)
//   numeric     Numerično preverjeno preizkus s števili brez dokaza (odvod, integral, neenačba na mreži, ničle na omejenem območju)
//   unverified  Nepreverjeno         koda naloge ne zna preveriti (limite, besedilne naloge, naloge s podatki)
//   wrong       Napačno              preverjanje je padlo: rešitev ne drži ali katera manjka
//
// Od PV-01 (docs/preverjanje.md) pravila določa skupna definicija za ves Evklid (public/preverjanje/statusi.js, sedem
// statusov); tukaj jih samo prevedemo v pet statusov skenerja, zato so izidi in besedila na zaslonu enaki kot prej.
import { statusIzDokazov, vSkener } from "../preverjanje/statusi.js";

export const STATUSES = ["verified", "partial", "numeric", "unverified", "wrong"];

/**
 * Dokazi preverjanja → status.
 *   holds:    true (navedeno drži) | false (ne drži) | null (ni preverjeno)
 *   how:      "exact" (točna algebra ali SymPy) | "numeric" (števila s toleranco)
 *   complete: "exact" (popolnost dokazana) | "na" (vprašanje popolnosti ne obstaja: izraz, odvod)
 *             | "numeric" (iskanje na omejenem območju) | "unknown" (ni preverjena) | false (katera rešitev manjka)
 */
export function statusOf({ holds = null, how = "numeric", complete = "unknown" } = {}) {
  // Skener ne pozna Leana: »formal« šteje kot doslej (neznana vrednost = numerično), da je izid za vsak vhod enak.
  return vSkener(statusIzDokazov({ holds, how: how === "exact" ? "exact" : "numeric", complete: complete === "formal" ? "numeric" : complete }));
}

// Ali rezultat sme biti prikazan kot odgovor (napačen in nepreverjen lastni rezultat gre k AI).
export const statusShows = (s) => s === "verified" || s === "partial" || s === "numeric";
