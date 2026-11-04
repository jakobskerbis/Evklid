// Vodič po aplikaciji: isti seznam in besedila kot na spletu (public/vodic.js, Nastavitve → Pomoč).
// Odpre se iz Jaz → Vodič po aplikaciji. Tapni del, da ga odpreš.
import React from "react";
import { router, Stack, type Href } from "expo-router";
import { t } from "@/lib/i18n";
import { Body, Card, Row, Screen } from "@/components/ui";
import { APP_GUIDE } from "../../../public/vodic.js";

export default function Vodic() {
  return (
    <Screen>
      <Stack.Screen options={{ title: t("guide.title") }} />
      <Body muted>{t("guide.intro")}</Body>
      <Card style={{ paddingVertical: 4 }}>
        {APP_GUIDE.map((g) => (
          <Row
            key={g.id}
            title={t(g.title)}
            subtitle={t(g.text)}
            onPress={typeof g.app === "string" ? () => router.navigate(g.app as Href) : undefined}
          />
        ))}
      </Card>
    </Screen>
  );
}
