const NOTIFICATIONS_ENABLED_KEY = "framescore.settings.notificationsEnabled";

export function getNotificationsEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  return raw === null ? true : raw === "true";
}

export function setNotificationsEnabled(enabled: boolean) {
  window.localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));
}
