// Jaz: napredek (XP), raven in predmet, dnevni cilj, opomniki, vibracije, vaje brez povezave,
// naročnina, menjava profila, zasebnost, odjava in izbris računa.
import React, { useState } from "react";
import { Alert, RefreshControl, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Application from "expo-application";
import { api, webUrl } from "@/lib/api";
import { useSession, useStudent } from "@/lib/session";
import { t } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useLoad } from "@/lib/useLoad";
import { hapticsOn, setHaptics, success } from "@/lib/haptics";
import { reminderTime, setReminder } from "@/lib/notifications";
import { packTaskCount, pendingCount, refreshPack, syncOffline } from "@/lib/offline";
import { Button, Card, Chip, Row, TabScreen, Title } from "@/components/ui";
import { XpHeader, type Xp } from "@/components/XpHeader";
import { LevelPicker, type Level } from "@/components/LevelPicker";

const TIMES = ["15:00", "17:00", "18:00", "19:00", "20:00"];
const GOALS = [30, 50, 100, 200];

export default function Me() {
  const th = useTheme();
  const student = useStudent();
  const { parent, students, select, signOut, updateStudent } = useSession();
  const { data: xp, refreshing, pull } = useLoad(() => api<Xp>(`/api/students/${student.id}/xp`).catch(() => null), [student.id], { refocus: true });
  const [remind, setRemind] = useState(reminderTime());
  const [haptic, setHaptic] = useState(hapticsOn());
  const [editLevel, setEditLevel] = useState(false);
  const [packBusy, setPackBusy] = useState(false);
  const [packCount, setPackCount] = useState(packTaskCount(student.id));
  const s = student.settings || {};

  const save = async (settings: Record<string, unknown>) => {
    try {
      const updated = await api(`/api/students/${student.id}`, { method: "PUT", body: { settings } });
      updateStudent(updated);
      success();
    } catch (err) {
      Alert.alert((err as Error).message);
    }
  };
  const toggleRemind = async (time: string) => {
    if (!(await setReminder(time))) return Alert.alert(t("mob.notifOff"));
    setRemind(time);
  };
  const downloadPack = async () => {
    setPackBusy(true);
    try {
      await syncOffline(student.id).catch(() => null);
      await refreshPack(student.id, null, true);
      setPackCount(packTaskCount(student.id));
      success();
    } catch (err) {
      Alert.alert((err as Error).message);
    } finally {
      setPackBusy(false);
    }
  };
  const level: Level = { educational_track: s.educational_track || "OSNOVNA_SOLA", curriculum_level: s.curriculum_level || "", subject: s.subject || "MAT" };
  // Raven in predmet v jeziku vmesnika (shranjena vrednost je slovenska, npr. »7. razred«, predmet je koda).
  const grade = /^(\d+)\. (razred|letnik)$/.exec(s.curriculum_level || "");
  const levelLabel = grade ? t(grade[2] === "letnik" ? "mob.yearN" : "mob.gradeN", { n: grade[1] }) : s.curriculum_level;
  const subjectKey = `subj.${s.subject}`;
  const subjectLabel = s.subject ? (t(subjectKey) === subjectKey ? s.subject : t(subjectKey)) : "";
  const waiting = pendingCount(student.id);
  const sub = parent?.subscription;

  return (
    <TabScreen title={t("nav.me")} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={pull} tintColor={th.accent} />}>
      {xp ? <XpHeader xp={xp} name={student.name} /> : null}

      <Card>
        <Title size={18}>{t("mob.learning")}</Title>
        {editLevel ? (
          <>
            <LevelPicker value={level} onChange={(l) => save(l)} />
            <Button title={t("mob.done")} kind="secondary" onPress={() => setEditLevel(false)} />
          </>
        ) : (
          <Row title={[levelLabel, subjectLabel].filter(Boolean).join(" · ") || t("mob.chooseLevel")} subtitle={t("mob.changeLevel")} icon={{ ios: "graduationcap", android: "school" }} onPress={() => setEditLevel(true)} />
        )}
        <Text style={{ color: th.muted, fontSize: 14, fontWeight: "600" }}>{t("mob.dailyGoal")}</Text>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {GOALS.map((g) => (
            <Chip key={g} label={`${g} XP`} active={Number(s.xp_goal || 50) === g} onPress={() => save({ xp_goal: g })} />
          ))}
        </View>
      </Card>

      <Card>
        <Title size={18}>{t("mob.reminders")}</Title>
        <Row
          title={t("mob.dailyReminder")}
          subtitle={remind ? t("mob.reminderAt", { time: remind }) : t("mob.reminderOff")}
          icon={{ ios: "bell", android: "notifications" }}
          right={<Switch value={!!remind} onValueChange={(v) => toggleRemind(v ? "18:00" : "")} trackColor={{ true: th.accent }} accessibilityLabel={t("mob.dailyReminder")} />}
        />
        {remind ? (
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {TIMES.map((time) => (
              <Chip key={time} label={time} active={remind === time} onPress={() => toggleRemind(time)} />
            ))}
          </View>
        ) : null}
        <Row
          title={t("mob.haptics")}
          icon={{ ios: "iphone.radiowaves.left.and.right", android: "vibration" }}
          right={
            <Switch
              value={haptic}
              onValueChange={(v) => {
                setHaptics(v);
                setHaptic(v);
              }}
              trackColor={{ true: th.accent }}
              accessibilityLabel={t("mob.haptics")}
            />
          }
        />
      </Card>

      <Card>
        <Title size={18}>{t("mob.offlineTitle")}</Title>
        <Text style={{ color: th.muted, fontSize: 15, lineHeight: 21 }}>
          {packCount ? t("mob.offlineReady", { n: packCount }) : t("mob.offlineIntro")}
          {waiting ? ` ${t("mob.pendingSync", { n: waiting })}` : ""}
        </Text>
        <Button title={packCount ? t("mob.offlineRefresh") : t("mob.offlineDownload")} kind="secondary" icon={{ ios: "arrow.down.circle", android: "download" }} loading={packBusy} onPress={downloadPack} />
      </Card>

      <Card style={{ paddingVertical: 4 }}>
        <Row
          title={t("mob.subscription")}
          subtitle={sub && ["active", "trialing", "past_due"].includes(sub.status) ? t("mob.subActive") : parent?.trial_ends_at && Date.parse(parent.trial_ends_at) > Date.now() ? t("mob.trialUntil", { date: new Date(parent.trial_ends_at).toLocaleDateString() }) : t("mob.subFree")}
          icon={{ ios: "star.circle", android: "workspace_premium" }}
          onPress={() => router.push("/subscription")}
        />
        {students.length > 1 ? <Row title={t("mob.switchProfile")} icon={{ ios: "person.2", android: "group" }} onPress={() => select(null)} /> : null}
        <Row title={t("guide.title")} icon={{ ios: "questionmark.circle", android: "help" }} onPress={() => router.push("/vodic")} />
        <Row title={t("mob.privacy")} icon={{ ios: "hand.raised", android: "privacy_tip" }} onPress={() => WebBrowser.openBrowserAsync(webUrl("/zasebnost.html"))} />
        <Row
          title={t("mob.signOut")}
          icon={{ ios: "rectangle.portrait.and.arrow.right", android: "logout" }}
          onPress={() =>
            Alert.alert(t("mob.signOut"), t("mob.signOutAsk"), [
              { text: t("mob.cancel"), style: "cancel" },
              { text: t("mob.signOut"), style: "destructive", onPress: () => signOut() },
            ])
          }
        />
        <Row title={t("mob.deleteAccount")} danger icon={{ ios: "trash", android: "delete" }} onPress={() => router.push("/delete-account")} />
      </Card>
      <Text style={{ color: th.muted, fontSize: 12, textAlign: "center" }}>
        {parent?.email || ""} · {Application.nativeApplicationVersion || ""} ({Application.nativeBuildVersion || ""})
      </Text>
    </TabScreen>
  );
}
