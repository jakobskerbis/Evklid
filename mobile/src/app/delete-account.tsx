// Izbris računa v aplikaciji (zahteva App Store 5.1.1(v) in Google Play): z geslom ali s ponovno
// prijavo z Apple. Naročnino iz trgovine uporabnik prekliče v trgovini (aplikacija pokaže povezavo).
import React, { useState } from "react";
import { Alert, Platform, View } from "react-native";
import { router, Stack } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { api, ApiError, clearSession, randomString } from "@/lib/api";
import { useSession } from "@/lib/session";
import { t } from "@/lib/i18n";
import { failure } from "@/lib/haptics";
import { manageInStore, usesStoreBilling } from "@/lib/billing";
import { Banner, Body, Button, Card, Field, Screen, Title } from "@/components/ui";

export default function DeleteAccount() {
  const { parent } = useSession();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (body: Record<string, string>) => {
    setBusy(true);
    setError(null);
    try {
      await api("/api/account", { method: "DELETE", body });
      await clearSession();
      Alert.alert(t("mob.deleted"));
    } catch (err) {
      failure();
      // Applov žeton velja 5 min (strežnik: REAUTH_MAX_AGE_MS); 401 po prijavi z Apple ni napačno geslo (pregled #500 A).
      const denied = err instanceof ApiError && err.status === 401;
      setError(denied ? t(body.apple_identity_token ? "mob.appleExpired" : "mob.wrongPassword") : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const confirm = (body: Record<string, string>) =>
    Alert.alert(t("mob.deleteAccount"), t("mob.deleteAsk"), [
      { text: t("mob.cancel"), style: "cancel" },
      { text: t("mob.deleteForever"), style: "destructive", onPress: () => remove(body) },
    ]);
  const withApple = async () => {
    try {
      const nonce = randomString(32);
      const cred = await AppleAuthentication.signInAsync({ nonce: await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce) });
      if (!cred.identityToken) return;
      confirm({ apple_identity_token: cred.identityToken, apple_nonce: nonce, ...(cred.authorizationCode ? { apple_authorization_code: cred.authorizationCode } : {}) });
    } catch (err: any) {
      if (err?.code !== "ERR_REQUEST_CANCELED") setError(err.message);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t("mob.deleteAccount") }} />
      <Card tone="danger">
        <Title size={20}>{t("mob.deleteTitle")}</Title>
        <Body>{t("mob.deleteText")}</Body>
        {parent?.email ? <Body muted small>{parent.email}</Body> : null}
      </Card>
      {usesStoreBilling && parent?.subscription ? (
        <Card>
          <Body>{t("mob.deleteStoreSub")}</Body>
          <Button title={t("mob.manage")} kind="secondary" onPress={() => manageInStore()} />
        </Card>
      ) : null}
      {error ? <Banner text={error} tone="danger" /> : null}
      <Field label={t("mob.password")} value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" textContentType="password" />
      <Button title={t("mob.deleteForever")} kind="danger" loading={busy} disabled={!password} onPress={() => confirm({ password })} />
      {Platform.OS === "ios" ? (
        <View style={{ gap: 8 }}>
          <Body muted small center>{t("mob.deleteAppleHint")}</Body>
          <Button title={t("mob.confirmApple")} kind="secondary" icon={{ ios: "apple.logo", android: "lock" }} disabled={busy} onPress={withApple} />
        </View>
      ) : null}
      <Button title={t("mob.cancel")} kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
