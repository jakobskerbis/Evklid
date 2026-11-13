// Prijava: e-naslov in geslo ali »Prijava z Apple« (iPhone, iPad). Nov račun z Apple potrebuje še
// datum rojstva in strinjanje (ista pravila starosti kot registracija, server/accounts/age.js).
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Linking, Platform, Text, View } from "react-native";
import { Link, router } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { api, ApiError, randomString, webUrl } from "@/lib/api";
import { useSession } from "@/lib/session";
import { currentLanguage, t } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Banner, Body, Button, Card, Field, Screen, Title } from "@/components/ui";
import { BirthDateField, Check, PrivacyLink, birthIso, type Birth } from "@/components/forms";
import { Logo } from "@/components/Logo";
import brand from "../../../brand.json";

type AppleStep = { token: string; nonce: string; given?: string | null; family?: string | null; existing?: boolean };

export default function SignIn() {
  const th = useTheme();
  const { refresh } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appleOk, setAppleOk] = useState(false);
  const [apple, setApple] = useState<AppleStep | null>(null);
  const [birth, setBirth] = useState<Birth>({ d: "", m: "", y: "" });
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (Platform.OS === "ios") AppleAuthentication.isAvailableAsync().then(setAppleOk).catch(() => {});
  }, []);

  async function done() {
    await refresh();
  }

  async function login() {
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth/login", { body: { email: email.trim(), password } });
      await done();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function sendApple(step: AppleStep, extra: object = {}) {
    try {
      await api("/api/auth/apple", { body: { identity_token: step.token, nonce: step.nonce, given_name: step.given, family_name: step.family, ...extra } });
      await done();
    } catch (err) {
      // existing: račun s tem e-naslovom že obstaja, a naslov ni bil potrjen (strežnik ga zaščiti in poveže).
      if (err instanceof ApiError && err.body?.need_signup) setApple({ ...step, existing: !!err.body?.existing });
      else throw err;
    }
  }

  async function appleSignIn() {
    setError(null);
    try {
      const nonce = randomString(32);
      const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
      const cred = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
        nonce: hashed,
      });
      if (!cred.identityToken) throw new Error(t("mob.appleFailed"));
      setBusy(true);
      await sendApple({ token: cred.identityToken, nonce, given: cred.fullName?.givenName, family: cred.fullName?.familyName });
    } catch (err: any) {
      if (err?.code !== "ERR_REQUEST_CANCELED") setError(err.message || t("mob.appleFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function appleFinish() {
    if (!apple) return;
    setBusy(true);
    setError(null);
    try {
      await sendApple(apple, { birth_date: birthIso(birth), accept_privacy: agree });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (apple) {
    return (
      <Screen>
        <Title>{t(apple.existing ? "mob.appleExistingTitle" : "mob.appleNewTitle")}</Title>
        <Body muted>{t(apple.existing ? "mob.appleExistingText" : "mob.appleNewText")}</Body>
        <BirthDateField value={birth} onChange={setBirth} />
        <Check checked={agree} onChange={setAgree}>
          {t("mob.agree")} <PrivacyLink />
        </Check>
        {error ? <Banner text={error} tone="danger" /> : null}
        <Button title={t("mob.continue")} onPress={appleFinish} loading={busy} disabled={!agree || !birthIso(birth)} />
        <Button title={t("mob.cancel")} kind="ghost" onPress={() => setApple(null)} />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: th.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen contentContainerStyle={{ padding: 24, paddingTop: 72, gap: 14, maxWidth: 520, width: "100%", alignSelf: "center" }}>
        <View style={{ alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Logo size={72} />
          <Text style={{ color: th.text, fontSize: 32, fontWeight: "800" }}>{brand.name}</Text>
          <Body muted center>{t("mob.tagline")}</Body>
        </View>
        {/* Prijavljen v brskalniku (npr. aplikacijo je prenesel s spletne strani): stran /prenesi tam
            odpre aplikacijo že prijavljeno (prijava.tsx), brez vpisa gesla. */}
        <Card style={{ alignItems: "center" }}>
          <Body>{t("mob.fromWeb")}</Body>
          <Button title={t("mob.fromWebBtn")} kind="secondary" onPress={() => Linking.openURL(webUrl(`/prenesi?app=1&lang=${encodeURIComponent(currentLanguage())}`)).catch(() => {})} style={{ alignSelf: "stretch" }} />
        </Card>
        {appleOk ? (
          <>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
              buttonStyle={th.dark ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={10}
              style={{ height: 50 }}
              onPress={appleSignIn}
            />
            <Body muted small center>{t("mob.or")}</Body>
          </>
        ) : null}
        <Field label={t("mob.email")} value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="username" />
        <Field label={t("mob.password")} value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" textContentType="password" onSubmitEditing={login} returnKeyType="go" />
        {error ? <Banner text={error} tone="danger" /> : null}
        <Button title={t("mob.signIn")} onPress={login} loading={busy} disabled={!email || !password} />
        <Link href="/forgot" style={{ color: th.accent, textAlign: "center", fontWeight: "600", padding: 8 }}>
          {t("mob.forgot")}
        </Link>
        <Card style={{ marginTop: 12, alignItems: "center" }}>
          <Body>{t("mob.noAccount")}</Body>
          <Button title={t("mob.register")} kind="secondary" onPress={() => router.push("/register")} style={{ alignSelf: "stretch" }} />
        </Card>
      </Screen>
    </KeyboardAvoidingView>
  );
}
