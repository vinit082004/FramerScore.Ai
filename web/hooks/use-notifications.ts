"use client";

import { useCallback, useEffect, useState } from "react";

export interface AppNotification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const STORAGE_KEY = "framescore.notifications";
const EVENT_NAME = "framescore:notifications-changed";

function readStore(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function writeStore(items: AppNotification[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function pushNotification(message: string) {
  if (typeof window !== "undefined") {
    const enabled = window.localStorage.getItem("framescore.settings.notificationsEnabled");
    if (enabled === "false") return;
  }
  const items = readStore();
  items.unshift({
    id: crypto.randomUUID(),
    message,
    createdAt: new Date().toISOString(),
    read: false,
  });
  writeStore(items.slice(0, 30));
}

export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    // localStorage is unavailable during SSR; sync it in after mount to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStore());
    const handler = () => setItems(readStore());
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const markAllRead = useCallback(() => {
    const next = readStore().map((n) => ({ ...n, read: true }));
    writeStore(next);
  }, []);

  const clear = useCallback(() => {
    writeStore([]);
  }, []);

  const unreadCount = items.filter((n) => !n.read).length;

  return { items, unreadCount, markAllRead, clear };
}
