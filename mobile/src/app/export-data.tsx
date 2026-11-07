// Prenos vseh podatkov v aplikaciji (GDPR čl. 15 in 20; kot Račun → Prenesi podatke na spletu, public/account.js):
// POST /api/account/export z geslom računa ali s ponovno prijavo z Apple (server/accounts/index.js). Gost gesla nima.
// Račun brez gesla na Androidu (prijava z Apple na iPhonu) dobi povezavo za nastavitev gesla na e-naslov računa.
// Datoteka gre v predpomnilnik telefona, sistemski meni za deljenje jo shrani v Datoteke ali pošlje naprej.
import React, { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { router, Stack } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import * as Sharing from "expo-sharing";
import { File, Paths } from "expo-file-system";
import brand from "../../../brand.json";
import { api, ApiError, randomString } from "@/lib/api";
import { useSession } from "@/lib/session";
import { t } from "@/lib/i18n";
import { failure, success } from "@/lib/haptics";
import { Banner, Body, Button, Card, Field, Screen, Title } from "@/components/ui";

const EXPORT_FILE = `${brand.slug}-podatki.json`;
// Kopija z osebnimi podatki ne ostane v predpomnilniku: izbrišemo jo ob odprtju zaslona (ostanek po sesutju), ob napaki
// in ko učenec zaslon zapusti (ne takoj po meniju za deljenje, ker jo aplikacija, ki ji jo je poslal, na Androidu morda
// še bere).
const removeCopy = () => {
  try {
    const f = new File(Paths.cache, EXPORT_FILE);
    if (f.exists) f.delete();
  } catch {}
};

export default function ExportData() {
  const { parent } = useSession();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const guest = !!parent?.guest;
  const noPassword = !guest && parent?.has_password === false;
  // Zapuščen zaslon: zahtevo prekličemo, po njej ničesar ne zapišemo in menija za deljenje ne odpremo čez drug zaslon.
  const mounted = useRef(true);
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    mounted.current = true;
    removeCopy();
    return () => {
      mounted.current = false;
      request.current?.abort();
      removeCopy();
    };
  }, []);

  const exportData = async (body: Record<string, string>) => {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      if (!(await Sharing.isAvailableAsync())) throw new Error(t("mob.exportUnavailable"));
      request.current = new AbortController();
      const data = await api("/api/account/export", { method: "POST", body, signal: request.current.signal });
      request.current = null;
      if (!mounted.current) return;
      const file = new File(Paths.cache, EXPORT_FILE);
      file.create({ overwrite: true });
      // expo-file-system 58: write() je asinhron; meni za deljenje šele, ko je datoteka cela.
      await file.write(JSON.stringify(data, null, 2));
      if (!mounted.current) return removeCopy();
      await Sharing.shareAsync(file.uri, { mimeType: "application/json", UTI: "public.json", dialogTitle: t("mob.exportTitle") });
      setPassword("");
      success();
      setNote(t("mob.exportDone"));
    } catch (err) {
      request.current = null;
      removeCopy();
      if (!mounted.current || (err as Error)?.name === "AbortError") return;
      failure();
      // Kot izbris (delete-account.tsx): 401 z login: true je potekla seja (api.ts jo že počisti), sicer napačno geslo
      // ali neuspela ponovna prijava z Apple.
      const denied = err instanceof ApiError && err.status === 401 && !err.body?.login;
      setError(denied ? t(body.apple_identity_token ? "mob.appleFailed" : "mob.wrongPassword") : (err as Error).message);
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  const withApple = async () => {
    try {
      const nonce = randomString(32);
      const cred = await AppleAuthentication.signInAsync({ nonce: await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce) });
      if (!cred.identityToken) return;
      exportData({ apple_identity_token: cred.identityToken, apple_nonce: nonce, ...(cred.authorizationCode ? { apple_authorization_code: cred.authorizationCode } : {}) });
    } catch (err: any) {
      if (err?.code !== "ERR_REQUEST_CANCELED") setError(err.message);
    }
  };
  // Račun brez gesla (prijava z Apple): povezava za nastavitev gesla na e-naslov računa (kot splet).
  const sendPasswordLink = async () => {
    if (!parent?.email) return;
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth/forgot", { body: { email: parent.email } });
      setNote(t("mob.exportLinkSent", { email: parent.email }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t("mob.exportData") }} />
      <Card>
        <Title size={20}>{t("mob.exportTitle")}</Title>
        <Body>{t("mob.exportText")}</Body>
        <Body muted small>{t("mob.exportPrivate")}</Body>
      </Card>
      {error ? <Banner text={error} tone="danger" /> : null}
      {note ? <Banner text={note} tone="ok" /> : null}
      {guest ? (
        <Button title={t("mob.exportButton")} icon={{ ios: "square.and.arrow.up", android: "download" }} loading={busy} onPress={() => exportData({})} />
      ) : noPassword && Platform.OS !== "ios" ? (
        <View style={{ gap: 8 }}>
          <Body muted small>{t("mob.exportNoPassword")}</Body>
          <Button title={t("mob.exportSetPassword")} kind="secondary" loading={busy} disabled={!parent?.email} onPress={sendPasswordLink} />
        </View>
      ) : (
        <>
          {noPassword ? null : (
            <>
              <Field label={t("mob.password")} value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" textContentType="password" />
              <Button title={t("mob.exportButton")} icon={{ ios: "square.and.arrow.up", android: "download" }} loading={busy} disabled={!password} onPress={() => exportData({ password })} />
            </>
          )}
          {/* j 7. 11.: račun z geslom potrdi z geslom; Apple samo za račun brez gesla (iPhone). */}
          {Platform.OS === "ios" && noPassword ? (
            <View style={{ gap: 8 }}>
              <Body muted small center>{t("mob.exportAppleHint")}</Body>
              <Button title={t("mob.confirmApple")} kind="primary" icon={{ ios: "apple.logo", android: "lock" }} disabled={busy} onPress={withApple} />
            </View>
          ) : null}
        </>
      )}
      <Button title={t("mob.back")} kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
