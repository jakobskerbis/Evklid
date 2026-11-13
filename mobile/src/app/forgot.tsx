// Pozabljeno geslo: strežnik pošlje povezavo za novo geslo na e-naslov (odpre se na spletu).
import React, { useState } from "react";
import { router } from "expo-router";
import { api } from "@/lib/api";
import { t } from "@/lib/i18n";
import { Banner, Body, Button, Field, Screen } from "@/components/ui";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth/forgot", { body: { email: email.trim() } });
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      {sent ? (
        <>
          <Banner text={t("mob.forgotSent")} tone="ok" icon={{ ios: "envelope.fill", android: "mail" }} />
          <Button title={t("mob.back")} onPress={() => router.back()} />
        </>
      ) : (
        <>
          <Body muted>{t("mob.forgotText")}</Body>
          <Field label={t("mob.email")} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
          {error ? <Banner text={error} tone="danger" /> : null}
          <Button title={t("mob.forgotSend")} onPress={submit} loading={busy} disabled={!email.includes("@")} />
        </>
      )}
    </Screen>
  );
}
