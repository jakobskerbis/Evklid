// Raven, XP do naslednje ravni, niz dni in krog dnevnega cilja (kot na spletu, public/xp-levels.js).
import React from "react";
import { Text, View } from "react-native";
import { levelProgress } from "../../../public/xp-levels.js";
import { t } from "@/lib/i18n";
import { font, useTheme } from "@/lib/theme";
import { Card, Icon, ProgressBar } from "./ui";

export type Xp = { total: number; today: number; goal: number; streak: number; level: number; levelFrom: number; levelTo: number };

export function XpHeader({ xp, name }: { xp: Xp; name: string }) {
  const th = useTheme();
  const lp = levelProgress(xp.total) as { level: number; from: number; to: number; pct: number };
  const goalPct = Math.min(1, xp.today / Math.max(1, xp.goal));
  return (
    <Card>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: th.text, fontSize: 20, ...font(700) }}>{t("mob.hello", { name })}</Text>
          <Text style={{ color: th.muted, fontSize: 14, marginTop: 2, ...font() }}>
            {t("xp.level", { n: lp.level })} · {t("xp.toNext", { xp: lp.to - xp.total, n: lp.level + 1 })}
          </Text>
        </View>
        <View style={{ alignItems: "center" }} accessibilityLabel={`${t("xp.streakTitle")}: ${xp.streak}`}>
          <Icon name={{ ios: "flame.fill", android: "local_fire_department" }} color={xp.streak ? th.warm : th.muted} size={26} />
          <Text style={{ color: th.text, ...font(700) }}>{xp.streak}</Text>
        </View>
      </View>
      <ProgressBar value={lp.pct / 100} color={th.gold} />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon name={{ ios: goalPct >= 1 ? "star.fill" : "star", android: goalPct >= 1 ? "star" : "star_outline" }} color={th.gold} size={18} />
        <Text style={{ color: th.text, fontSize: 15, flex: 1, ...font() }}>{goalPct >= 1 ? t("xp.goalDone") : t("xp.goalShort", { today: xp.today, goal: xp.goal })}</Text>
      </View>
    </Card>
  );
}
