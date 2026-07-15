"use client";

import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteHistoryItem, useHistory } from "@/hooks/use-analysis";
import { useNotifications } from "@/hooks/use-notifications";
import { getNotificationsEnabled, setNotificationsEnabled } from "@/lib/settings";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { clear: clearNotifications, items: notifications } = useNotifications();
  const { data } = useHistory();
  const deleteItem = useDeleteHistoryItem();

  useEffect(() => {
    // localStorage is unavailable during SSR; sync it in after mount to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotificationsEnabledState(getNotificationsEnabled());
  }, []);

  function toggleNotifications(checked: boolean) {
    setNotificationsEnabledState(checked);
    setNotificationsEnabled(checked);
  }

  function clearAllHistory() {
    for (const item of data?.items ?? []) {
      deleteItem.mutate(item.id);
    }
    setConfirmOpen(false);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-12 pt-8 pb-12">
      <div>
        <h1 className="text-display-sm text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage notifications and your local evaluation data.
        </p>
      </div>

      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Notifications
        </p>
        <div className="mt-4 flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <Bell className="size-4 text-muted-foreground" strokeWidth={1.5} />
            <div>
              <p className="text-sm text-foreground">Analysis complete alerts</p>
              <p className="text-xs text-muted-foreground">
                Notify me when an image finishes analyzing.
              </p>
            </div>
          </div>
          <Switch checked={notificationsEnabled} onCheckedChange={toggleNotifications} />
        </div>
        <div className="flex items-center justify-between pt-5">
          <div>
            <p className="text-sm text-foreground">Notification history</p>
            <p className="text-xs text-muted-foreground">
              {notifications.length} stored notification{notifications.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={clearNotifications}>
            Clear
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Data</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Evaluation history</p>
            <p className="text-xs text-muted-foreground">
              {data?.items.length ?? 0} analyzed image{data?.items.length === 1 ? "" : "s"} stored
            </p>
          </div>
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
              <Trash2 className="size-3.5" />
              Clear all
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes every analyzed image and report. This can&apos;t be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={clearAllHistory}>
                  Delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
