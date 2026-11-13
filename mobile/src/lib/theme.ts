// Barve, robovi in pisava privzetega spletnega sloga »Čist« (public/style.css :root in :root.dark,
// docs/oblikovanje.md »Slogi«), za vse zaslone aplikacije. Spremeniš splet? Spremeni tudi tukaj.
// Zasloni barv ne pišejo neposredno, vedno vzamejo barvo iz useTheme().
import { useColorScheme, type TextStyle } from "react-native";

const light = {
  bg: "#F6F7F9",
  surface: "#FFFFFF",
  surface2: "#EEF1F5",
  text: "#141821",
  muted: "#566070",
  border: "#E1E5EB",
  accent: "#2353D1",
  accentSoft: "#E8EEFC",
  accentText: "#FFFFFF",
  ok: "#1E7A4C",
  okSoft: "#E5F4EC",
  danger: "#D33A3F",
  dangerText: "#FFFFFF", // besedilo na gumbu »danger« (kontrast AA tudi v temnem načinu)
  dangerSoft: "#FDECEC",
  gold: "#F5A524",
  goldSoft: "#FFF6E0",
  warm: "#B0500A",
  heroA: "#2353D1",
  heroB: "#3563DC",
};

const dark: typeof light = {
  bg: "#0D1117",
  surface: "#151B23",
  surface2: "#1E2631",
  text: "#E6EAF0",
  muted: "#9DA7B6",
  border: "#2A3340",
  accent: "#6E9BFF",
  accentSoft: "#1A2A4A",
  accentText: "#0D1117",
  ok: "#4CD38C",
  okSoft: "#12301F",
  danger: "#FF6B6E",
  dangerText: "#0D1117",
  dangerSoft: "#3A1A1F",
  gold: "#F5A524",
  goldSoft: "#3A2E10",
  warm: "#F5A35C",
  heroA: "#2353D1",
  heroB: "#2F5FD8",
};

export type Theme = typeof light & { dark: boolean };

// Isti predmet pri vsakem izrisu (stabilne odvisnosti za useMemo in WebView).
const LIGHT: Theme = { ...light, dark: false };
const DARK: Theme = { ...dark, dark: true };

export function useTheme(): Theme {
  return useColorScheme() === "dark" ? DARK : LIGHT;
}

// --radius 14 px (kartice) in --radius-sm 10 px (gumbi, polja) kot na spletu.
export const radius = { card: 14, button: 10, pill: 999 };

// Pisava Instrument Sans (spletni --font). Statične datoteke TTF v assets/fonts so izrezane iz
// spremenljive pisave @fontsource-variable/instrument-sans (latin + latin-ext, OFL); Android ne bere woff2.
// Vsaka debelina je svoja družina: fontWeight ob lastni pisavi na Androidu doda še umetno odebelitev.
export const fonts = {
  "InstrumentSans-Regular": require("../../assets/fonts/InstrumentSans-Regular.ttf"),
  "InstrumentSans-SemiBold": require("../../assets/fonts/InstrumentSans-SemiBold.ttf"),
  "InstrumentSans-Bold": require("../../assets/fonts/InstrumentSans-Bold.ttf"),
};
let fontsReady = false;
export const setFontsReady = (ok: boolean) => void (fontsReady = ok);
// font(700) namesto fontWeight: "700". Če se pisava ne naloži, ostane sistemska z isto debelino.
export function font(weight: 400 | 600 | 700 = 400): TextStyle {
  if (!fontsReady) return weight === 400 ? {} : { fontWeight: String(weight) as TextStyle["fontWeight"] };
  return { fontFamily: weight === 700 ? "InstrumentSans-Bold" : weight === 600 ? "InstrumentSans-SemiBold" : "InstrumentSans-Regular" };
}
export const space = (n: number) => n * 4;
