// Nov račun z e-naslovom: isti obrazec kot na spletu (datum rojstva, strinjanje, neobvezna koda).
// Mlajši od starosti digitalne privolitve dobijo povezavo za starše (račun ustvari starš).
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { api, ApiError, webUrl } from "@/lib/api";
import { usesStoreBilling } from "@/lib/billing";
import { useSession } from "@/lib/session";
import { t } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Banner, Body, Button, Field, Screen } from "@/components/ui";
import { BirthDateField, Check, PrivacyLink, birthIso, type Birth } from "@/components/forms";

export default function Register() {
  const th = useTheme();
  const { refresh } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birth, setBirth] = useState<Birth>({ d: "", m: "", y: "" });
  const [agree, setAgree] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [underAge, setUnderAge] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const [parentSent, setParentSent] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth/register", {
        body: { email: email.trim(), password, birth_date: birthIso(birth), accept_privacy: agree, ...(code.trim() ? { promo_code: code.trim() } : {}) },
      });
      await refresh();
    } catch (err) {
      if (err instanceof ApiError && err.body?.under_age) setUnderAge(true);
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  // Premlad za lasten račun: Evklid pošlje staršu e-pošto s povezavo na stran za starše (kot na spletu).
  async function askParent() {
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth/ask-parent", { body: { email: parentEmail.trim() } });
      setParentSent(true);
      setParentEmail("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: th.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen contentContainerStyle={{ padding: 20, gap: 14, maxWidth: 560, width: "100%", alignSelf: "center" }}>
        <Body muted>{t("mob.registerIntro")}</Body>
        <Field label={t("mob.email")} value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="username" />
        <Field label={t("mob.newPassword")} value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" textContentType="newPassword" error={password && password.length < 8 ? t("mob.passwordShort") : null} />
        <BirthDateField value={birth} onChange={setBirth} />
        {/* Aktivacijska koda odklene plačljive funkcije mimo nakupa v aplikaciji: v trgovinah ni dovoljena (Apple 3.1.1). */}
        {!usesStoreBilling ? <Field label={t("mob.promoCode")} value={code} onChangeText={setCode} autoCapitalize="characters" placeholder="" /> : null}
        <Check checked={agree} onChange={setAgree}>
          {t("mob.agree")} <PrivacyLink />
        </Check>
        {error ? <Banner text={error} tone="danger" /> : null}
        {/* starsi.html kaže spletne cene; različica iz trgovine nanje ne sme voditi (Apple 3.1.1, Google Play) */}
        {underAge && !usesStoreBilling ? (
          <>
            <Field label={t("mob.parentEmail")} value={parentEmail} onChangeText={setParentEmail} autoCapitalize="none" autoComplete="off" keyboardType="email-address" />
            <Button title={t("mob.parentSend")} onPress={askParent} loading={busy} disabled={!parentEmail.includes("@")} />
            {parentSent ? <Banner text={t("mob.parentSent")} tone="ok" /> : null}
            <Button title={t("mob.parentsPage")} kind="secondary" onPress={() => WebBrowser.openBrowserAsync(webUrl("/starsi.html"))} />
          </>
        ) : null}
        <Button title={t("mob.register")} onPress={submit} loading={busy} disabled={!email || password.length < 8 || !birthIso(birth) || !agree} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
