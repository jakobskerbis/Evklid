// Opomniki: lokalni dnevni opomnik za vajo (deluje tudi brez povezave) in potisna obvestila strežnika
// (opomnik cilja, server/mobile/push.js). Opomnik za danes odpade, ko je dnevni cilj XP že dosežen.
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import Storage from "expo-sqlite/kv-store";
import { Platform } from "react-native";
import { api } from "./api";
import { t } from "./i18n";
import { key } from "./keys";

const KEY = key("reminder"); // "HH:MM" ali "" (izklopljeno)
const CHANNEL = "opomniki";
const PUSH_KEY = key("pushToken"); // žeton Expo, prijavljen na strežniku (za odjavo)

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export const reminderTime = () => Storage.getItemSync(KEY) || "";

async function permission() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL, { name: t("mob.remindChannel"), importance: Notifications.AndroidImportance.DEFAULT });
  }
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted) return true;
  if (!cur.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

// Potisna obvestila: žeton Expo pošljemo strežniku (samo na pravi napravi in z nastavljenim projektom EAS).
export async function registerPush() {
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!Device.isDevice || !projectId) return;
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    await api("/api/push/register", { body: { token: data, platform: Platform.OS } });
    Storage.setItemSync(PUSH_KEY, data);
  } catch {
    // brez obvestil strežnika aplikacija deluje naprej
  }
}

// Ob odjavi: strežnik ne pošilja več obvestil računa na ta telefon, lokalni opomniki odpadejo
// (ob naslednji prijavi jih učna pot znova nastavi ob shranjeni uri).
export async function unregisterPush() {
  const token = Storage.getItemSync(PUSH_KEY);
  if (token) await api("/api/push/unregister", { body: { token } }).catch(() => {});
  Storage.removeItemSync(PUSH_KEY);
}
export const cancelReminders = () => Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});

// Naslednjih 7 dni ob izbrani uri; danes ne, če je cilj že dosežen ali je ura mimo.
export async function scheduleReminders(time = reminderTime(), doneToday = false) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!time) return;
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  for (let d = 0; d < 7; d++) {
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, h, m);
    if (at <= now || (d === 0 && doneToday)) continue;
    await Notifications.scheduleNotificationAsync({
      content: { title: t("mob.remindTitle"), body: t("mob.remindBody"), data: { view: "path" } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
    });
  }
}

// Vklop/izklop iz nastavitev. Vrne false, če uporabnik obvestil ne dovoli.
export async function setReminder(time: string) {
  if (time && !(await permission())) return false;
  Storage.setItemSync(KEY, time);
  await scheduleReminders(time);
  if (time) registerPush();
  return true;
}
