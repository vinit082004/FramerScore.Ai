"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Search, Settings, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandMark } from "@/components/layout/brand-mark";
import { HeaderNav } from "@/components/layout/header-nav";
import { useNotifications } from "@/hooks/use-notifications";
import { formatRelativeTime } from "@/lib/format";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const { items, unreadCount, markAllRead } = useNotifications();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/history?q=${encodeURIComponent(query.trim())}` : "/history");
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "u") {
        if (pathname !== "/upload") {
          e.preventDefault();
          router.push("/upload");
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, router]);

  return (
    <header className="sticky top-0 z-40 h-[72px] shrink-0 border-b border-border bg-card">
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-8 px-12">
        <Link href="/upload">
          <BrandMark />
        </Link>

        <HeaderNav />

        <form onSubmit={handleSearch} className="relative ml-auto w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search evaluations…"
            className="h-9 rounded-lg border-transparent bg-secondary/60 pl-10 text-sm focus-visible:border-ring focus-visible:bg-card"
          />
        </form>

        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-2" nativeButton={false} render={<Link href="/upload" />}>
            <Sparkles className="size-3.5" />
            Upload
            <kbd className="ml-1 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-medium">
              ⌘U
            </kbd>
          </Button>

          <DropdownMenu onOpenChange={(open) => open && markAllRead()}>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
              <Bell className="size-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex size-2 rounded-full bg-danger" />
              )}
              <span className="sr-only">Notifications</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items.length === 0 ? (
                <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No notifications yet.
                </p>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {items.map((n) => (
                    <div
                      key={n.id}
                      className="flex flex-col gap-0.5 rounded-md px-2 py-2 text-sm hover:bg-secondary/60"
                    >
                      <span className="text-foreground">{n.message}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
              <Avatar size="sm">
                <AvatarFallback>
                  <User className="size-3.5" />
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Account menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/settings" />}>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <p className="px-1.5 py-1 text-xs text-muted-foreground">
                FrameScore AI · Image evaluation
              </p>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
