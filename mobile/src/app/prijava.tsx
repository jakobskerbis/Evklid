// Prijava iz brskalnika: stran /prenesi v brskalniku, kjer je račun prijavljen, odpre
// evklid://prijava?t=… (server/mobile/app-link.js). Aplikacija najprej pokaže, v kateri račun se bo
// prijavila (tuja povezava te ne sme potiho prijaviti v drug račun), ob »Nadaljuj« porabi žeton (velja
// enkrat) in dobi svojo sejo; profil iz brskalnika je odprt brez gesla. Nato splet v aplikaciji (/web; brez
// prijave ga zaščita preusmeri na prijavo).
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { t } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Banner, Body, Button, Screen } from "@/components/ui";

export default function Prijava() {
  const th = useTheme();
  const { t: token } = useLocalSearchParams<{ t?: string }>();
  const { signedIn, refresh, select, signOut } = useSession();
  const [email, setEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ text: string; offline: boolean } | null>(null);

  const fail = (err: any) =>
    setError({
      text: err?.message || String(err),
      offline: err instanceof ApiError && err.offline,
    });

  // Za kateri račun je povezava (žeton ostane neporabljen).
  const check = useCallback(async () => {
    if (!token) return router.replace("/web");
    try {
      const r = await api<{ email: string }>("/api/auth/app-link/check", {
        body: { token },
      });
      setEmail(r.email);
    } catch (err) {
      fail(err);
    }
  }, [token]);

  useEffect(() => {
    check();
  }, [check]);

  async function accept() {
    setBusy(true);
    setError(null);
    try {
      // Prej prijavljen račun na telefonu se odjavi (seja na strežniku ne ostane veljavna).
      if (signedIn) await signOut();
      const r = await api<{ student_id?: number | null }>("/api/auth/app-link", { body: { token } });
      if (r.student_id) await select(r.student_id);
      await refresh();
      router.replace("/web");
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      contentContainerStyle={{
        padding: 24,
        paddingTop: 96,
        gap: 16,
        maxWidth: 520,
        width: "100%",
        alignSelf: "center",
      }}
    >
      {error ? (
        <>
          <Banner text={error.text} tone="danger" />
          {error.offline ? (
            <Button
              title={t("mob.retry")}
              onPress={() => {
                setError(null);
                (email ? accept : check)();
              }}
              loading={busy}
            />
          ) : null}
          <Button title={t("mob.signIn")} kind={error.offline ? "ghost" : "primary"} onPress={() => router.replace("/web")} />
        </>
      ) : email ? (
        <>
          <Body center>{t("mob.linkConfirm", { email })}</Body>
          <Button title={t("mob.continue")} onPress={accept} loading={busy} />
          <Button title={t("mob.cancel")} kind="ghost" onPress={() => router.replace("/web")} disabled={busy} />
        </>
      ) : (
        <View style={{ alignItems: "center", gap: 12 }}>
          <ActivityIndicator color={th.accent} />
          <Body muted center>
            {t("mob.linkBusy")}
          </Body>
        </View>
      )}
    </Screen>
  );
}
