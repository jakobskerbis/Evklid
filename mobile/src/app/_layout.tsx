// Korenska postavitev: prijava → spletna stran Evklida v aplikaciji (src/app/web.tsx, j 2026-11-04: splet in
// aplikacija vedno enaka). Naravni zavihki (učna pot, vaje, pogovor …) ostanejo za vaje brez povezave in se
// odprejo iz zaslona »Ni povezave«; zasloni nad njimi so naravni sklad (iOS: potisk z robu, Android: nazaj).
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SessionProvider, useSession } from "@/lib/session";
import { t, useLanguage } from "@/lib/i18n";
import { font, fonts, setFontsReady, useTheme } from "@/lib/theme";
import { watchPurchases } from "@/lib/billing";
import { useAppUpdates } from "@/lib/updates";
import { api, setBusyListener, setTakenHandler } from "@/lib/api";

SplashScreen.preventAutoHideAsync().catch(() => {});

function Root() {
  const { ready, signedIn, student, refresh, select } = useSession();
  const th = useTheme();
  useLanguage();
  // Nova različica: ob prijavi (in po nekaj urah v ozadju) ponudi posodobitev na en klik (src/lib/updates.ts).
  const [updating, cancelUpdate] = useAppUpdates(ready && signedIn);
  // Pisava spletnega sloga Čist (Instrument Sans); ob napaki ostane sistemska.
  const [fontsLoaded, fontError] = useFonts(fonts);
  const fontsDone = fontsLoaded || !!fontError;
  if (fontsDone) setFontsReady(fontsLoaded);

  useEffect(() => {
    if (ready && fontsDone) SplashScreen.hideAsync().catch(() => {});
  }, [ready, fontsDone]);

  // Nakupi v trgovini, ki niso prišli prek gumba (prekinjeni, potrjeni pozneje), se zapišejo ob zagonu.
  useEffect(() => (signedIn ? watchPurchases(() => refresh().catch(() => {})) : undefined), [signedIn, refresh]);

  // Profil je hkrati odprt samo na eni napravi. Če ga ima druga (npr. brskalnik), ponudimo prevzem kot splet
  // (public/account.js): »Nadaljuj tukaj« ga zapre na drugi napravi in znova naloži zaslone.
  const [epoch, setEpoch] = useState(0);
  const askingTaken = useRef(false);
  useEffect(() => {
    setTakenHandler((id) => {
      if (askingTaken.current || !id) return;
      askingTaken.current = true;
      const done = () => (askingTaken.current = false);
      Alert.alert(t("mob.takenTitle"), t("mob.takenText"), [
        { text: t("mob.takenOther"), style: "cancel", onPress: () => (done(), select(null)) },
        {
          text: t("mob.takenHere"),
          onPress: () =>
            api(`/api/students/${id}/claim`, { body: {} })
              .then(() => setEpoch((e) => e + 1))
              // Brez povezave ali druga napaka: povemo zakaj; naslednja zahteva profila vprašanje ponovi.
              .catch((err) => Alert.alert((err as Error).message))
              .finally(done),
        },
      ], { cancelable: false });
    });
    return () => setTakenHandler(null);
  }, [select]);

  // Strežnik se ravno znova zaganja (objava nove različice): »Evklid se posodablja …«, kot pasica na spletu.
  const [serverBusy, setServerBusy] = useState(false);
  useEffect(() => {
    setBusyListener(setServerBusy);
    return () => setBusyListener(null);
  }, []);

  // Dotik obvestila odpre učno pot.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      if (signedIn) router.navigate("/web");
    });
    return () => sub.remove();
  }, [signedIn]);

  // Po prijavi (in ob zagonu prijavljene aplikacije) se odpre spletna stran; tudi po »Nadaljuj tukaj« (epoch
  // znova izriše Stack, ki se sicer odpre na prvem zaslonu, naravni učni poti).
  // fontsDone: Stack je že izrisan (prej navigacija ne gre).
  useEffect(() => {
    if (ready && fontsDone && signedIn) router.replace("/web");
  }, [ready, fontsDone, signedIn, epoch]);

  if (!ready || !fontsDone) return null;
  // Kam gre zaščiten zaslon, ki ga ni mogoče odpreti. Brez tega Expo Router izbere prvi prosti zaslon
  // po abecedi: ob prvem zagonu se je odprlo »Pozabljeno geslo« namesto prijave.
  const home = !signedIn ? "/sign-in" : "/web";
  const header = { headerTintColor: th.accent, headerStyle: { backgroundColor: th.bg }, headerTitleStyle: { color: th.text, ...(font(700) as { fontFamily?: string; fontWeight?: "700" }) }, contentStyle: { backgroundColor: th.bg }, headerBackButtonDisplayMode: "minimal" as const };
  return (
    <>
      <StatusBar style="auto" />
      <Stack key={epoch} screenOptions={header}>
        {/* Povezava iz brskalnika (evklid://prijava?t=…): prijava brez gesla, src/app/prijava.tsx */}
        <Stack.Screen name="prijava" options={{ headerShown: false }} />
        <Stack.Protected guard={!signedIn} redirectTo={home}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ title: t("mob.register") }} />
          <Stack.Screen name="forgot" options={{ title: t("mob.forgot"), presentation: "modal" }} />
        </Stack.Protected>
        <Stack.Protected guard={signedIn} redirectTo={home}>
          <Stack.Screen name="web" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={signedIn && !student} redirectTo={home}>
          <Stack.Screen name="profiles" options={{ title: t("mob.profiles"), headerLargeTitle: true }} />
        </Stack.Protected>
        <Stack.Protected guard={signedIn && !!student} redirectTo={home}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="topic/[id]" options={{ title: "" }} />
          <Stack.Screen name="practice" options={{ title: t("mob.practice") }} />
          <Stack.Screen name="chat/[id]" options={{ title: t("nav.chat") }} />
          <Stack.Screen name="subscription" options={{ title: t("mob.subscription"), presentation: "modal" }} />
          <Stack.Screen name="calculator" options={{ title: t("nav.graph"), presentation: "modal" }} />
          <Stack.Screen name="delete-account" options={{ title: t("mob.deleteAccount"), presentation: "modal" }} />
          <Stack.Screen name="vodic" options={{ title: t("guide.title") }} />
        </Stack.Protected>
      </Stack>
      {serverBusy ? (
        <View pointerEvents="none" accessibilityLiveRegion="polite" style={{ position: "absolute", left: 16, right: 16, bottom: 32, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: th.surface, borderColor: th.border, borderWidth: 1, borderRadius: 12, padding: 12 }}>
          <ActivityIndicator color={th.accent} />
          <Text style={[{ color: th.text, flex: 1 }, font(400)]}>{t("off.updating")}</Text>
        </View>
      ) : null}
      {/* Prenos novega APK; gumb nazaj prekliče prenos. */}
      <Modal transparent visible={updating !== null} animationType="fade" statusBarTranslucent onRequestClose={cancelUpdate}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: 24 }}>
          <View style={{ backgroundColor: th.surface, borderColor: th.border, borderWidth: 1, borderRadius: 16, padding: 24, alignItems: "center", gap: 12, minWidth: 240 }}>
            <ActivityIndicator color={th.accent} />
            {/* po 10 %, da bralnik zaslona ne bere vsakega odstotka */}
            <Text style={{ color: th.text, fontSize: 16, textAlign: "center" }} accessibilityLiveRegion="polite">
              {t("mob.updateDownloading", { pct: Math.floor((updating ?? 0) / 10) * 10 })}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default function Layout() {
  return (
    <SessionProvider>
      <Root />
    </SessionProvider>
  );
}
