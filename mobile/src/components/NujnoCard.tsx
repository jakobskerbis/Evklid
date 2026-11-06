// Varnostni odgovor (kot na spletu, public/app.js addNujno): potrjena besedila nujno.* (kartica j, 6. 11.),
// številke po državi profila ali telefona (public/nujno.js), gumbi »Pokliči«, zapiranje z ×. Ni napaka in
// inštruktorja ne ustavi.
import React from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { getCalendars, getLocales } from "expo-localization";
import { zaznajNujno, stevilke, vrstice, klici, telHref, drzavaNaprave, izoliraj } from "../../../public/nujno.js";
import { t } from "@/lib/i18n";
import { radius, useTheme } from "@/lib/theme";
import { Icon } from "@/components/ui";

export type Nujno = { vrsta: string };

// Lokalni zaznavalnik brez AI (strošek 0): takoj ob pošiljanju, brez povezave in ob napaki.
export const lokalnoNujno = (text?: string): Nujno | null => {
  const vrsta = text ? (zaznajNujno(text) as string | null) : null;
  return vrsta ? { vrsta } : null;
};

function napravaDrzava(): string {
  try {
    return drzavaNaprave(getCalendars()[0]?.timeZone || "", getLocales().map((l) => l.languageTag));
  } catch {
    return "";
  }
}

type Line = [string, Record<string, any>];
const tr = ([k, p]: Line) => t(k, { ...izoliraj(p), ure: p.ure ? t(p.ure[0], p.ure[1]) : "" });

export function NujnoCard({ n, settings, meja, onClose }: { n: Nujno; settings?: Record<string, any>; meja?: boolean; onClose: () => void }) {
  const th = useTheme();
  const st = stevilke(settings || {}, napravaDrzava());
  const [head, ...rest] = vrstice(n.vrsta, st) as Line[];
  const calls = (klici(n.vrsta, st) as string[]).filter(Boolean);
  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={t("nujno.oznaka")}
      style={{ alignSelf: "stretch", backgroundColor: th.surface, borderRadius: radius.card, borderWidth: 2, borderColor: th.warm, paddingVertical: 14, paddingStart: 16, paddingEnd: 52, gap: 4 }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("nujno.zapri")}
        onPress={onClose}
        hitSlop={6}
        style={{ position: "absolute", top: 6, end: 6, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}
      >
        <Icon name={{ ios: "xmark", android: "close" }} size={18} color={th.muted} />
      </Pressable>
      <Text style={{ color: th.text, fontSize: 18, fontWeight: "700", marginBottom: 2 }}>{tr(head)}</Text>
      {rest.map((l) => (
        <Text key={l[0]} style={{ color: th.text, fontSize: 16, lineHeight: 22 }}>
          {tr(l)}
        </Text>
      ))}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {calls.map((c) => (
          <Pressable
            key={c}
            accessibilityRole="button"
            onPress={() => Linking.openURL(telHref(c)).catch(() => {})}
            style={{ minHeight: 44, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, borderRadius: radius.button, backgroundColor: th.accent }}
          >
            <Icon name={{ ios: "phone.fill", android: "call" }} size={18} color={th.accentText} />
            <Text style={{ color: th.accentText, fontSize: 16, fontWeight: "700" }}>{t("nujno.klic", izoliraj({ n: c }))}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ color: th.muted, fontSize: 13, marginTop: 6 }}>{t(meja ? "nujno.opomba" : "nujno.opombaKratka")}</Text>
    </View>
  );
}
