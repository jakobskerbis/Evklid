// Izbira šole, razreda/letnika in predmeta (osnovna in srednja šola; fakulteto izbereš na spletu).
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Chip } from "./ui";
import { t } from "@/lib/i18n";
import { font, useTheme } from "@/lib/theme";

export type Level = { educational_track: string; curriculum_level: string; subject: string };

const GRADES = { OSNOVNA_SOLA: [6, 7, 8, 9], SREDNJA_SOLA: [1, 2, 3, 4] } as const;
const SUBJECTS = { OSNOVNA_SOLA: ["MAT", "FIZ", "KEM", "BIO", "NAR"], SREDNJA_SOLA: ["MAT", "FIZ", "KEM", "BIO"] } as const;
export const levelValue = (track: string, n: number) => (track === "SREDNJA_SOLA" ? `${n}. letnik` : `${n}. razred`);

export function LevelPicker({ value, onChange }: { value: Level; onChange: (l: Level) => void }) {
  const th = useTheme();
  const track = value.educational_track === "SREDNJA_SOLA" ? "SREDNJA_SOLA" : "OSNOVNA_SOLA";
  const label = (s: string) => <Text style={{ color: th.muted, fontSize: 14, ...font(600) }}>{s}</Text>;
  const row = (children: React.ReactNode) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {children}
    </ScrollView>
  );
  return (
    <View style={{ gap: 8 }}>
      {label(t("set.school"))}
      {row(
        (["OSNOVNA_SOLA", "SREDNJA_SOLA"] as const).map((tr) => (
          <Chip
            key={tr}
            label={tr === "OSNOVNA_SOLA" ? t("mob.primary") : t("mob.secondary")}
            active={track === tr}
            onPress={() => onChange({ ...value, educational_track: tr, curriculum_level: levelValue(tr, GRADES[tr][0]) })}
          />
        )),
      )}
      {row(
        GRADES[track].map((n) => (
          <Chip
            key={n}
            label={track === "SREDNJA_SOLA" ? t("mob.yearN", { n }) : t("mob.gradeN", { n })}
            active={value.curriculum_level === levelValue(track, n)}
            onPress={() => onChange({ ...value, educational_track: track, curriculum_level: levelValue(track, n) })}
          />
        )),
      )}
      {label(t("set.subject"))}
      {row(SUBJECTS[track].map((s) => <Chip key={s} label={t(`subj.${s}`)} active={value.subject === s} onPress={() => onChange({ ...value, subject: s })} />))}
    </View>
  );
}
