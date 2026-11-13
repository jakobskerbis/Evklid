// Narečje inštruktorja oziroma različica jezika (nastavitev profila »dialect«).
// Velja samo za pogovorni ton v klepetu: strokovni izrazi, formule, enote, okvirji »Zapomni si«,
// povzetki, kartice in naloge ostanejo v knjižnem jeziku (pravilo v prompts/system_prompt.md).
//
// Ključ je koda jezika pogovora (public/i18n/languages.js). Prazna vrednost = knjižni jezik (privzeto).
// name: ime v izbirnem seznamu (v tem jeziku); hint: kratko navodilo za model (gre v prompt pod črto
// predpomnjenja), samo značilnosti, ki so zanesljive, da model ne izmišljuje.
// Isti seznam uporabljajo strežnik (preverjanje, prompt), register nastavitev in Nastavitve.

export const DIALECTS = {
  sl: [
    { id: "pogovorno", name: "Pogovorna slovenščina", hint: "sproščena pogovorna slovenščina (npr. »zdej«, »tko«, »a veš«, krajši nedoločnik »delat«), brez kletvic in žaljivega slenga" },
    { id: "ljubljansko", name: "Ljubljansko", hint: "ljubljanski pogovorni jezik (npr. »dej«, »zdej«, »tko«, »kva«, »sej«, »mal«, »čist«, »a ne«)" },
    { id: "gorenjsko", name: "Gorenjsko", hint: "gorenjsko narečje (Kranj, Škofja Loka, Jesenice, Bohinj): nekaj značilnih gorenjskih besed in izgovora v zapisu, ki ga zna prebrati vsak" },
    { id: "dolenjsko", name: "Dolenjsko", hint: "dolenjsko narečje (Novo mesto, Trebnje, Ribnica): nekaj značilnih dolenjskih besed in izgovora v berljivem zapisu" },
    { id: "stajersko", name: "Štajersko", hint: "štajersko narečje (Maribor, Celje, Ptuj; npr. »fajn«, »glih«), nekaj značilnih besed v berljivem zapisu" },
    { id: "prekmursko", name: "Prekmursko", hint: "prekmursko narečje (Murska Sobota, Lendava; npr. »ka« = kaj, »ge« = kje, »vö« = ven, »nika« = nič), zmerno, da ostane razumljivo tudi drugim" },
    { id: "korosko", name: "Koroško", hint: "koroško narečje (Mežiška in Mislinjska dolina, Dravograd, Ravne): nekaj značilnih koroških besed v berljivem zapisu" },
    { id: "primorsko", name: "Primorsko", hint: "primorsko narečje (Koper, Nova Gorica, Kras; npr. »san« = sem, »ma« = ampak, »bon« = bom), zmerno" },
  ],
  en: [
    { id: "en-GB", name: "British English", hint: "British English spelling and vocabulary (maths, colour, metre, revision, Year 9)" },
    { id: "en-US", name: "American English", hint: "American English spelling and vocabulary (math, color, meter, 9th grade)" },
    { id: "en-AU", name: "Australian English", hint: "Australian English, friendly and casual (e.g. 'no worries', 'heaps'), British-style spelling" },
    { id: "en-IN", name: "Indian English", hint: "Indian English as used in Indian schools (lakh/crore where natural, 'revise', 'marks', 'sums'), clear and warm" },
    { id: "en-IE", name: "Irish English", hint: "Irish English, warm and casual (e.g. 'grand', 'sure look'), British-style spelling" },
    { id: "en-SCO", name: "Scottish English", hint: "Scottish English flavour (e.g. 'wee', 'aye', 'cannae'), lightly, British-style spelling" },
  ],
  de: [
    { id: "de-AT", name: "Österreichisch", hint: "österreichisches Deutsch (z. B. 'Jänner', 'heuer', 'leiwand', 'passt'), Schulbegriffe aus Österreich (Matura, Schularbeit)" },
    { id: "de-CH", name: "Schweizerisch", hint: "Schweizer Hochdeutsch mit Schweizer Färbung (kein ß, 'grüezi', 'merci', 'parkieren', 'Znüni'); keine schwer lesbare Mundart" },
    { id: "de-BY", name: "Bairisch", hint: "leicht bairische Färbung (z. B. 'Servus', 'passt scho', 'a bisserl'), gut lesbar" },
  ],
  es: [
    { id: "es-ES", name: "Español de España", hint: "español peninsular (vosotros, 'vale', 'guay', 'ordenador')" },
    { id: "es-MX", name: "Español de México", hint: "español mexicano (ustedes, 'chido', 'padre', 'computadora')" },
    { id: "es-AR", name: "Español rioplatense", hint: "español rioplatense con voseo ('vos tenés', 'che', 'dale', 'bárbaro')" },
  ],
  pt: [
    { id: "pt-PT", name: "Português europeu", hint: "português europeu (tu, 'fixe', 'ecrã', 'telemóvel')" },
    { id: "pt-BR", name: "Português do Brasil", hint: "português brasileiro (você, 'legal', 'tela', 'celular')" },
  ],
  fr: [
    { id: "fr-QC", name: "Français québécois", hint: "français québécois léger ('c'est correct', 'icitte' avec modération, 'courriel', 'fin de semaine')" },
    { id: "fr-BE", name: "Français de Belgique", hint: "français de Belgique ('septante', 'nonante', 'une fois', 'savoir' = pouvoir)" },
    { id: "fr-CH", name: "Français de Suisse", hint: "français de Suisse romande ('septante', 'huitante', 'nonante', 'natel')" },
  ],
  nl: [{ id: "nl-BE", name: "Vlaams", hint: "Vlaams Nederlands (België): 'ge/gij' licht, 'amai', 'goesting', 'plezant'" }],
  hr: [
    { id: "kajkavski", name: "Kajkavski", hint: "lagana kajkavska boja (Zagreb, Zagorje, Varaždin; npr. 'kaj', 'saki', 'bum' = bit ću), čitljivo" },
    { id: "cakavski", name: "Čakavski", hint: "lagana čakavska boja (Istra, Kvarner, otoci; npr. 'ča', 'ki' = koji), čitljivo" },
    { id: "dalmatinski", name: "Dalmatinski", hint: "lagana dalmatinska boja (Split, Zadar; npr. 'ajme', 'fjaka', 'đir'), čitljivo" },
  ],
  it: [
    { id: "it-TS", name: "Triestino / Giuliano", hint: "italiano con leggera coloritura triestina ('ciò', 'bon', 'xe' con moderazione), sempre leggibile" },
  ],
  ar: [
    { id: "ar-EG", name: "مصري", hint: "Egyptian Arabic (عامية مصرية) for the chat tone; terms and formulas in Modern Standard Arabic" },
    { id: "ar-LEV", name: "شامي", hint: "Levantine Arabic (شامي) for the chat tone; terms and formulas in Modern Standard Arabic" },
    { id: "ar-GULF", name: "خليجي", hint: "Gulf Arabic (خليجي) for the chat tone; terms and formulas in Modern Standard Arabic" },
    { id: "ar-MA", name: "مغاربي", hint: "Maghrebi Arabic (Darija) lightly, readable for learners; terms and formulas in Modern Standard Arabic" },
  ],
  hi: [{ id: "hinglish", name: "Hinglish", hint: "Hinglish: Hindi mixed with common English words as Indian students speak, in Devanagari unless the student writes in Latin script" }],
};

// Možnosti za jezik pogovora (prazen seznam, če jezik nima različic).
export function dialectsFor(lang) {
  return DIALECTS[String(lang || "")] || [];
}

// Veljavno narečje za jezik ali "" (knjižni jezik).
export function cleanDialect(value, lang) {
  const v = String(value ?? "").trim();
  return dialectsFor(lang).some((d) => d.id === v) ? v : "";
}

export function dialectInfo(value, lang) {
  return dialectsFor(lang).find((d) => d.id === value) || null;
}
