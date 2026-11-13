// Izbira profila učenca (profil z geslom se na tej napravi odklene) in nov profil.
// Pravila so na strežniku: število profilov po paketu, soglasje starša, lasten profil od starosti privolitve.
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { api, ApiError } from "@/lib/api";
import { useSession, type Student } from "@/lib/session";
import { t } from "@/lib/i18n";
import { radius, useTheme } from "@/lib/theme";
import { Banner, Body, Button, Card, Chip, Field, Icon, Row, Screen, Title } from "@/components/ui";
import { Check } from "@/components/forms";
import { LevelPicker, type Level } from "@/components/LevelPicker";

export default function Profiles() {
  const th = useTheme();
  const { parent, students, refresh, select, signOut } = useSession();
  const [unlock, setUnlock] = useState<Student | null>(null);
  const [pw, setPw] = useState("");
  const [adding, setAdding] = useState(students.length === 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nov profil
  const [name, setName] = useState("");
  const [self, setSelf] = useState(!!parent?.minor);
  const [year, setYear] = useState("");
  const [level, setLevel] = useState<Level>({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" });
  const [consent, setConsent] = useState(false);
  const [profilePw, setProfilePw] = useState("");

  async function open(s: Student) {
    if (s.locked || s.needs_password) {
      setUnlock(s);
      setPw("");
      setError(null);
      return;
    }
    await select(s.id);
  }

  async function doUnlock() {
    if (!unlock) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/api/students/${unlock.id}/unlock`, { body: { password: pw, ...(unlock.needs_password ? { set: true } : {}) } });
      await refresh();
      await select(unlock.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const s = await api<Student>("/api/students", {
        body: { name: name.trim(), self, birth_year: self ? undefined : Number(year), consent, profile_password: profilePw, settings: level },
      });
      await refresh();
      await select(s.id);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  if (unlock) {
    return (
      <Screen>
        <Title>{unlock.name}</Title>
        <Body muted>{unlock.needs_password ? t("mob.setProfilePw") : t("mob.enterProfilePw")}</Body>
        <Field label={t("mob.profilePassword")} value={pw} onChangeText={setPw} secureTextEntry autoFocus onSubmitEditing={doUnlock} />
        {error ? <Banner text={error} tone="danger" /> : null}
        <Button title={t("mob.open")} onPress={doUnlock} loading={busy} disabled={pw.length < 4} />
        <Button title={t("mob.cancel")} kind="ghost" onPress={() => setUnlock(null)} />
      </Screen>
    );
  }

  return (
    <Screen>
      {!parent?.verified ? <VerifyEmail /> : null}
      {students.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {students.map((s) => (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              accessibilityLabel={s.name}
              onPress={() => open(s)}
              style={({ pressed }) => ({ width: 150, alignItems: "center", gap: 8, padding: 16, borderRadius: radius.card, backgroundColor: th.surface, borderWidth: 1, borderColor: th.border, opacity: pressed ? 0.7 : 1 })}
            >
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: th.accentSoft, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: th.accent, fontSize: 28, fontWeight: "800" }}>{s.name.slice(0, 1).toUpperCase()}</Text>
              </View>
              <Text style={{ color: th.text, fontSize: 16, fontWeight: "700" }} numberOfLines={1}>{s.name}</Text>
              {s.locked ? <Icon name={{ ios: "lock.fill", android: "lock" }} size={14} color={th.muted} /> : null}
            </Pressable>
          ))}
        </View>
      ) : null}

      {adding ? (
        <Card>
          <Title size={19}>{t("set.newStudent")}</Title>
          {!parent?.minor ? (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Chip label={t("mob.forMe")} active={self} onPress={() => setSelf(true)} />
              <Chip label={t("mob.forChild")} active={!self} onPress={() => setSelf(false)} />
            </View>
          ) : null}
          <Field label={t("set.name")} value={name} onChangeText={setName} placeholder={t("set.namePh")} maxLength={40} />
          {!self ? <Field label={t("mob.birthYear")} value={year} onChangeText={(v) => setYear(v.replace(/\D/g, "").slice(0, 4))} keyboardType="number-pad" /> : null}
          <LevelPicker value={level} onChange={setLevel} />
          <Field label={t("mob.profilePassword")} value={profilePw} onChangeText={setProfilePw} secureTextEntry placeholder={t("mob.profilePwHint")} />
          <Check checked={consent} onChange={setConsent}>{self ? t("mob.consentSelf") : t("mob.consentParent")}</Check>
          {error ? <Banner text={error} tone="danger" /> : null}
          <Button title={t("mob.createProfile")} onPress={create} loading={busy} disabled={!name.trim() || !consent || profilePw.length < 4 || (!self && year.length !== 4)} />
        </Card>
      ) : (
        <Button title={t("set.newStudent")} kind="secondary" icon={{ ios: "plus", android: "add" }} onPress={() => setAdding(true)} />
      )}

      <Card>
        <Row title={parent?.email || ""} subtitle={t("mob.signedInAs")} icon={{ ios: "person.crop.circle", android: "account_circle" }} />
        <Row
          title={t("mob.signOut")}
          icon={{ ios: "rectangle.portrait.and.arrow.right", android: "logout" }}
          onPress={() => Alert.alert(t("mob.signOut"), t("mob.signOutConfirm"), [{ text: t("mob.cancel"), style: "cancel" }, { text: t("mob.signOut"), style: "destructive", onPress: signOut }])}
        />
      </Card>
    </Screen>
  );
}

// Nepotrjen e-naslov: profila še ni mogoče ustvariti.
function VerifyEmail() {
  const { refresh } = useSession();
  const [sent, setSent] = useState(false);
  return (
    <Card tone="gold">
      <Body>{t("mob.verifyEmail")}</Body>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button
          title={sent ? t("mob.sent") : t("mob.resend")}
          kind="secondary"
          disabled={sent}
          style={{ flex: 1 }}
          onPress={async () => {
            await api("/api/auth/resend-verification", { body: {} }).catch(() => {});
            setSent(true);
          }}
        />
        <Button title={t("mob.verified")} style={{ flex: 1 }} onPress={() => refresh()} />
      </View>
    </Card>
  );
}
