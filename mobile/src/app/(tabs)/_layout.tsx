// Spodnja vrstica z zavihki: sistemska (iOS Liquid Glass, Android Material), v istem vrstnem redu in z
// enakimi ikonami kot spletna aplikacija na telefonu (public/index.html #tabbar): Učna pot, Uči se (Učbenik,
// Laboratorij, 3D svet), Inštruktor, nato Skeniraj na mestu spletnih Tekmovanj ali NPZ/mature (ju aplikacija
// brez povezave nima), Jaz.
import React from "react";
import { NativeTabs } from "expo-router/native-tabs";
import { t, useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export default function TabLayout() {
  useLanguage();
  const th = useTheme();
  return (
    <NativeTabs tintColor={th.accent}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: "map", selected: "map.fill" }} md="map" />
        <NativeTabs.Trigger.Label>{t("nav.path")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="textbook">
        <NativeTabs.Trigger.Icon sf={{ default: "graduationcap", selected: "graduationcap.fill" }} md="school" />
        <NativeTabs.Trigger.Label>{t("nav.learn")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tutor">
        <NativeTabs.Trigger.Icon sf={{ default: "message", selected: "message.fill" }} md="chat" />
        <NativeTabs.Trigger.Label>{t("nav.chat")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="scan">
        <NativeTabs.Trigger.Icon sf={{ default: "camera.viewfinder", selected: "camera.viewfinder" }} md="document_scanner" />
        <NativeTabs.Trigger.Label>{t("mob.scan")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="me">
        <NativeTabs.Trigger.Icon sf={{ default: "person", selected: "person.fill" }} md="person" />
        <NativeTabs.Trigger.Label>{t("nav.me")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
