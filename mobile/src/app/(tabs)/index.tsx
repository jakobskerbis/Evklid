// Učna pot: raven in dnevni cilj XP, Današnji trening, ponavljanje in teme po poglavjih.
// Brez povezave se pot prebere iz paketa za vaje brez povezave (lib/offline.ts).
import React, { useEffect } from "react";
import { Pressable, RefreshControl, Text, View } from "react-native";
import { router } from "expo-router";
import { api, ApiError } from "@/lib/api";
import { useStudent } from "@/lib/session";
import { t } from "@/lib/i18n";
import { useTheme, radius } from "@/lib/theme";
import { useLoad } from "@/lib/useLoad";
import { getPack, pendingCount, refreshPack, syncOffline } from "@/lib/offline";
import { scheduleReminders } from "@/lib/notifications";
import { Banner, Body, Button, Card, ErrorView, Icon, Loading, ProgressBar, TabScreen } from "@/components/ui";
import { XpHeader, type Xp } from "@/components/XpHeader";

type Topic = { id: string; name: string; goals?: string; practice: boolean; status: "new" | "learning" | "mastered"; due?: boolean };
type Unit = { title: string; topics: Topic[]; progress: number; ahead?: boolean; mastered: boolean };
type PathView = { key: string | null; label?: string; units?: Unit[]; message?: string; offline?: boolean };
type Modes = { newTopic: Topic | null; dueCount: number; daily: { done: boolean; open: boolean } };

export default function Path() {
  const th = useTheme();
  const student = useStudent();
  const sid = student.id;

  const { data, error, loading, refreshing, pull, reload } = useLoad(
    async () => {
      try {
        const [path, xp, modes] = await Promise.all([api<PathView>(`/api/students/${sid}/path`), api<Xp>(`/api/students/${sid}/xp`), api<Modes>(`/api/students/${sid}/modes`)]);
        return { path, xp, modes, offline: false };
      } catch (err) {
        const pack = getPack(sid);
        if (err instanceof ApiError && err.offline && pack) return { path: { ...pack.view, key: pack.path } as PathView, xp: null, modes: null, offline: true };
        throw err;
      }
    },
    [sid],
    { refocus: true },
  );

  // V ozadju: paket za vaje brez povezave, pošiljanje čakajočih odgovorov, opomniki.
  useEffect(() => {
    if (!data || data.offline) return;
    syncOffline(sid).catch(() => {});
    if (data.path.key) refreshPack(sid, data.path.key).catch(() => {});
    if (data.xp) scheduleReminders(undefined, data.xp.today >= data.xp.goal).catch(() => {});
  }, [data, sid]);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorView message={error?.message || ""} onRetry={reload} retryLabel={t("mob.retry")} />;
  const { path, xp, modes, offline } = data;
  const waiting = pendingCount(sid);

  return (
    <TabScreen title={t("nav.path")} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={pull} tintColor={th.accent} />}>
      {offline ? <Banner text={t("mob.offlineMode")} tone="gold" icon={{ ios: "wifi.slash", android: "wifi_off" }} /> : null}
      {!offline && waiting ? <Banner text={t("mob.pendingSync", { n: waiting })} icon={{ ios: "arrow.triangle.2.circlepath", android: "sync" }} /> : null}
      {xp ? <XpHeader xp={xp} name={student.name} /> : null}

      {modes && !offline ? (
        <View style={{ gap: 10 }}>
          <Pressable onPress={() => router.push({ pathname: "/practice", params: { mode: "daily" } })} accessibilityRole="button">
            <View style={{ borderRadius: radius.card, padding: 18, backgroundColor: th.heroA, flexDirection: "row", alignItems: "center", gap: 14 }}>
              <Icon name={{ ios: modes.daily.done ? "checkmark.seal.fill" : "bolt.fill", android: modes.daily.done ? "verified" : "bolt" }} size={30} color="#FFFFFF" />
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#FFFFFF", fontSize: 19, fontWeight: "800" }}>{t("daily.title")}</Text>
                <Text style={{ color: "#FFFFFF", opacity: 0.9, fontSize: 15 }}>{modes.daily.done ? t("mob.dailyDone") : modes.daily.open ? t("mob.dailyContinue") : t("mob.dailyStart")}</Text>
              </View>
              <Icon name={{ ios: "chevron.right", android: "chevron_right" }} size={16} color="#FFFFFF" />
            </View>
          </Pressable>
          {modes.dueCount ? (
            <Card tone="gold" style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name={{ ios: "arrow.counterclockwise", android: "history" }} color={th.gold} />
              <Body style={{ flex: 1 }}>{t("mob.reviewDue", { n: modes.dueCount })}</Body>
              <Button title={t("mob.review")} kind="secondary" onPress={() => router.push({ pathname: "/practice", params: { mode: "review" } })} />
            </Card>
          ) : null}
        </View>
      ) : null}

      {!path.units ? <Banner text={path.message || t("mob.noPath")} /> : null}
      {path.label ? <Text style={{ color: th.muted, fontSize: 15, fontWeight: "600", marginTop: 6 }}>{path.label}</Text> : null}
      {(path.units || []).map((u, i) => (
        <Card key={u.title + i}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ flex: 1, color: th.text, fontSize: 18, fontWeight: "700" }}>{u.title}</Text>
            {u.mastered ? <Icon name={{ ios: "checkmark.seal.fill", android: "verified" }} color={th.ok} size={20} /> : null}
          </View>
          <ProgressBar value={u.progress || 0} color={u.mastered ? th.ok : th.accent} />
          {u.topics.map((tp) => (
            <Pressable
              key={tp.id}
              // Brez povezave se lekcija ne naloži: tema odpre kar vaje iz paketa (lib/offline.ts).
              onPress={() => (offline && tp.practice ? router.push({ pathname: "/practice", params: { mode: "topic", topic: tp.id } }) : router.push({ pathname: "/topic/[id]", params: { id: tp.id } }))}
              accessibilityRole="button"
              accessibilityLabel={`${tp.name}, ${t(`mob.status.${tp.status}`)}`}
              style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 9, minHeight: 44, opacity: pressed ? 0.6 : 1 })}
            >
              <StatusDot status={tp.status} due={tp.due} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: th.text, fontSize: 16, fontWeight: "600" }}>{tp.name}</Text>
                {tp.goals ? <Text style={{ color: th.muted, fontSize: 13 }} numberOfLines={1}>{tp.goals}</Text> : null}
              </View>
              <Icon name={{ ios: "chevron.right", android: "chevron_right" }} size={13} color={th.muted} />
            </Pressable>
          ))}
        </Card>
      ))}
    </TabScreen>
  );
}

function StatusDot({ status, due }: { status: Topic["status"]; due?: boolean }) {
  const th = useTheme();
  if (due) return <Icon name={{ ios: "arrow.counterclockwise.circle.fill", android: "history" }} color={th.gold} size={24} />;
  if (status === "mastered") return <Icon name={{ ios: "checkmark.circle.fill", android: "check_circle" }} color={th.ok} size={24} />;
  if (status === "learning") return <Icon name={{ ios: "circle.lefthalf.filled", android: "contrast" }} color={th.accent} size={24} />;
  return <Icon name={{ ios: "circle", android: "radio_button_unchecked" }} color={th.muted} size={24} />;
}
