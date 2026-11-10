// Naročnina. Različica iz trgovine: nakup v aplikaciji (App Store / Google Play), obnovitev nakupov,
// upravljanje v trgovini. Neposredni prenos (APK): plačilo prek spletne blagajne.
// Cene so iz trgovine (v valuti in z DDV države uporabnika); aplikacija ne omenja drugih cen.
import React, { useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Stack } from "expo-router";
import { api, ApiError, webUrl } from "@/lib/api";
import { useSession } from "@/lib/session";
import { t } from "@/lib/i18n";
import { radius, useTheme } from "@/lib/theme";
import { useLoad } from "@/lib/useLoad";
import { celebrate } from "@/lib/haptics";
import { buyInStore, buyOnWeb, loadProducts, manageInStore, manageOnWeb, restorePurchases, usesStoreBilling, type StoreProduct } from "@/lib/billing";
import { Banner, Body, Button, Card, Chip, ErrorView, Icon, Loading, Screen, Title } from "@/components/ui";

type Access = { tier: "paid" | "promo" | "trial" | "bonus" | "free"; seats: number; until: string | null };
type Plan = { seats: number; interval: "month" | "year"; amount: number; currency: string; level?: string | null; family?: boolean };
type Account = { access: Access; plans: Plan[]; plan_level?: string; family_ok?: boolean; children?: { level?: string }[]; pilot?: { kind: "pilot" | "owner"; last_day: string | null; profiles: number } | null };
// Ime stopnje (kot na spletu, public/account.js levelName).
const levelName = (l?: string | null) => t(l === "FAKS" ? "lp.uni" : l === "SS" ? "lp.ss" : "lp.os");

const day = (iso: string) => new Date(iso).toLocaleDateString();
const EULA = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

export default function Subscription() {
  const th = useTheme();
  const { parent, refresh } = useSession();
  const [interval, setInterval] = useState<"month" | "year">("year");
  const [buying, setBuying] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const { data, error, loading, reload } = useLoad(async () => {
    const [account, store] = await Promise.all([api<Account>("/api/account"), loadProducts()]);
    return { access: account.access, plans: account.plans, account, ...store };
  }, []);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorView message={error?.message || ""} onRetry={reload} retryLabel={t("mob.retry")} />;
  const { access, info, products, plans, account } = data;
  // Cena stopnje profila (j 2026-11-01); Družina samo pri vsaj 2 profilih, s študentom, če je med njimi faks.
  const withStudent = !!account.children?.some((c) => c.level === "FAKS");
  const fits = (p: StoreProduct) =>
    !p.level ? true : p.family ? !!account.family_ok && p.level === (withStudent ? "FAKS" : "SS") : p.level === (account.plan_level || "OS");
  const nameOf = (p: StoreProduct) =>
    p.family ? t(p.level === "FAKS" ? "pay.familyStudent" : "pay.family") : p.level ? t("pay.seats1Level", { level: levelName(p.level) }) : t(p.seats === 1 ? "mob.oneChild" : "mob.twoChildren");
  // Pilot in lastnik (pregled #477 B3): poln paket brezplačno, brez nakupa (strežnik ga zavrne).
  const pilot = account.pilot || null;
  const paid = access.tier === "paid" || !!pilot;
  const otherProvider = paid && info.provider && info.provider !== (Platform.OS === "ios" ? "apple" : "google");

  const priceOf = (p: StoreProduct) => {
    if (p.price) return p.price;
    const plan = plans.find((x) => x.interval === p.interval && (p.level ? x.level === p.level && !!x.family === !!p.family : x.seats === p.seats));
    return plan ? new Intl.NumberFormat(undefined, { style: "currency", currency: plan.currency }).format(plan.amount / 100) : "";
  };
  const buy = async (p: StoreProduct) => {
    setBuying(p.id);
    try {
      const out = usesStoreBilling ? await buyInStore(p, info.account_token) : await buyOnWeb(p.seats, p.interval);
      await refresh();
      await reload();
      if (usesStoreBilling) {
        // Nakup je zapisan, a ne velja (račun že plačuje drugje) ali še čaka na potrditev.
        if (out?.conflict) Alert.alert(t("mob.subConflict"));
        else if (out?.pending) Alert.alert(t("mob.purchasePending"));
        else {
          celebrate();
          Alert.alert(t("mob.thanks"), t("mob.subActive"));
        }
      }
    } catch (err: any) {
      if (err?.cancelled) return;
      Alert.alert(err instanceof ApiError && err.status === 409 ? t("mob.subConflict") : err.message);
    } finally {
      setBuying(null);
    }
  };
  const restore = async () => {
    setRestoring(true);
    try {
      const out = await restorePurchases();
      await refresh();
      await reload();
      Alert.alert(out.account ? t("mob.restored") : t("mob.nothingToRestore"));
    } catch (err) {
      Alert.alert((err as Error).message);
    } finally {
      setRestoring(false);
    }
  };

  const shown = products.filter((p) => p.interval === interval && fits(p)).sort((a, b) => a.seats - b.seats);
  return (
    <Screen>
      <Stack.Screen options={{ title: t("mob.subscription") }} />
      <Card tone={paid ? "ok" : "accent"}>
        <Title size={20}>
          {pilot
            ? pilot.kind === "owner"
              ? t("acct.owner")
              : t("acct.pilot", { date: day(`${pilot.last_day}T12:00:00Z`), n: pilot.profiles })
            : paid
            ? t("mob.subActive")
            : access.until && access.tier === "trial"
              ? t("mob.trialUntil", { date: day(access.until) })
              : access.until && (access.tier === "promo" || access.tier === "bonus")
                ? t("mob.accessUntil", { date: day(access.until) })
                : t("mob.subFree")}
        </Title>
        {paid && !pilot && access.until ? <Body muted>{t(parent?.subscription?.cancel_at_period_end ? "mob.endsOn" : "mob.renews", { date: day(access.until) })}</Body> : null}
        {!paid ? (
          <View style={{ gap: 8 }}>
            {["mob.perk1", "mob.perk2", "mob.perk3", "mob.perk4"].map((k) => (
              <View key={k} style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                <Icon name={{ ios: "checkmark.circle.fill", android: "check_circle" }} color={th.accent} size={18} />
                <Body style={{ flex: 1 }}>{t(k)}</Body>
              </View>
            ))}
          </View>
        ) : null}
      </Card>

      {parent?.minor ? <Banner text={t("mob.minorPurchase")} tone="gold" icon={{ ios: "person.2.fill", android: "family_restroom" }} /> : null}
      {otherProvider ? <Banner text={t("mob.subElsewhere")} /> : null}

      {!paid ? (
        <>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Chip label={t("mob.yearly")} active={interval === "year"} onPress={() => setInterval("year")} />
            <Chip label={t("mob.monthly")} active={interval === "month"} onPress={() => setInterval("month")} />
          </View>
          {shown.length ? (
            shown.map((p) => (
              <Pressable key={p.id} onPress={() => buy(p)} disabled={!!buying} accessibilityRole="button" style={({ pressed }) => ({ borderRadius: radius.card, borderWidth: 2, borderColor: p.seats === 1 ? th.accent : th.border, backgroundColor: th.surface, padding: 16, gap: 4, opacity: pressed || (buying && buying !== p.id) ? 0.6 : 1 })}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Icon name={{ ios: p.seats === 1 ? "person.fill" : "person.2.fill", android: p.seats === 1 ? "person" : "group" }} color={th.accent} />
                  <Text style={{ flex: 1, color: th.text, fontSize: 18, fontWeight: "700" }}>{nameOf(p)}</Text>
                  <Text style={{ color: th.text, fontSize: 18, fontWeight: "800" }}>{priceOf(p)}</Text>
                </View>
                <Body muted small>{t(p.interval === "year" ? "mob.perYear" : "mob.perMonth")} · {t("mob.cancelAnytime")}</Body>
                {buying === p.id ? <Body small>{t("mob.processing")}</Body> : null}
              </Pressable>
            ))
          ) : (
            <Banner text={t("mob.storeUnavailable")} />
          )}
          <Body muted small>{usesStoreBilling ? t(Platform.OS === "ios" ? "mob.autoRenewIos" : "mob.autoRenewAndroid") : t("mob.payOnWeb")}</Body>
        </>
      ) : (
        // Različica iz trgovine ne vodi na spletno plačilo (pravila trgovin); naročnino s spleta upravljaš na spletu.
        info.provider === "stripe" ? (
          usesStoreBilling ? null : <Button title={t("mob.manage")} kind="secondary" onPress={() => manageOnWeb().then(() => reload())} />
        ) : (
          <Button title={t("mob.manage")} kind="secondary" onPress={() => manageInStore().then(() => reload())} />
        )
      )}

      {usesStoreBilling ? <Button title={t("mob.restore")} kind="ghost" loading={restoring} onPress={restore} /> : null}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 16 }}>
        <Text style={{ color: th.accent, paddingVertical: 12 }} onPress={() => WebBrowser.openBrowserAsync(webUrl("/zasebnost.html"))} accessibilityRole="link">{t("mob.privacy")}</Text>
        {Platform.OS === "ios" ? <Text style={{ color: th.accent, paddingVertical: 12 }} onPress={() => WebBrowser.openBrowserAsync(EULA)} accessibilityRole="link">{t("mob.terms")}</Text> : null}
      </View>
    </Screen>
  );
}
