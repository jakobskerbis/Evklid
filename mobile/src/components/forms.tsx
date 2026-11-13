// Polja obrazcev: datum rojstva (dan, mesec, leto) in potrditveno polje.
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Icon } from "./ui";
import { font, radius, useTheme } from "@/lib/theme";
import { t } from "@/lib/i18n";
import { webUrl } from "@/lib/api";

export type Birth = { d: string; m: string; y: string };
export const birthIso = (b: Birth) => (b.y.length === 4 && b.m && b.d ? `${b.y}-${b.m.padStart(2, "0")}-${b.d.padStart(2, "0")}` : "");

export function BirthDateField({ value, onChange }: { value: Birth; onChange: (b: Birth) => void }) {
  const th = useTheme();
  const box = (key: keyof Birth, ph: string, max: number, flex: number) => (
    <TextInput
      value={value[key]}
      onChangeText={(v) => onChange({ ...value, [key]: v.replace(/\D/g, "").slice(0, max) })}
      placeholder={ph}
      placeholderTextColor={th.muted}
      keyboardType="number-pad"
      accessibilityLabel={`${t("mob.birthDate")}: ${ph}`}
      style={{ flex, minHeight: 50, borderRadius: radius.button, borderWidth: 1.5, borderColor: th.border, backgroundColor: th.surface, color: th.text, fontSize: 17, textAlign: "center", ...font() }}
    />
  );
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: th.muted, fontSize: 14, ...font(600) }}>{t("mob.birthDate")}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {box("d", t("mob.day"), 2, 1)}
        {box("m", t("mob.month"), 2, 1)}
        {box("y", t("mob.year"), 4, 1.6)}
      </View>
      <Text style={{ color: th.muted, fontSize: 13, ...font() }}>{t("mob.birthWhy")}</Text>
    </View>
  );
}

export function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  const th = useTheme();
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => onChange(!checked)} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start", paddingVertical: 4 }}>
      <View style={{ width: 26, height: 26, borderRadius: 7, borderWidth: 2, borderColor: checked ? th.accent : th.border, backgroundColor: checked ? th.accent : "transparent", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
        {checked ? <Icon name={{ ios: "checkmark", android: "check" }} size={15} color={th.accentText} /> : null}
      </View>
      <Text style={{ flex: 1, color: th.text, fontSize: 15, lineHeight: 21, ...font() }}>{children}</Text>
    </Pressable>
  );
}

export function PrivacyLink() {
  const th = useTheme();
  return (
    <Text style={{ color: th.accent, ...font(600) }} onPress={() => WebBrowser.openBrowserAsync(webUrl("/zasebnost.html"))} accessibilityRole="link">
      {t("mob.privacy")}
    </Text>
  );
}
