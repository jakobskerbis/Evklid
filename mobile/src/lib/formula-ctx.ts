// Pomen črk v formulah za zaslon (lekcija, naloge, klepet): predmet in oznake lekcije (:::simboli).
// RichText v tem okviru izriše klikljive črke; dotik odpre kartico kot na spletu (public/formula-info.js).
import { createContext } from "react";

export type Fx = { subject?: string | null; symbols?: unknown[] | null } | null;
export const FormulaCtx = createContext<Fx>(null);
