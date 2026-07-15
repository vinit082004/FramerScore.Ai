"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { History as HistoryIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryCard } from "@/components/history/history-card";
import { useDeleteHistoryItem, useHistory } from "@/hooks/use-analysis";

function HistoryPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const { data, isLoading } = useHistory();
  const deleteItem = useDeleteHistoryItem();

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.filename.toLowerCase().includes(q) || item.rating.toLowerCase().includes(q)
    );
  }, [data, query]);

  function toggleCompare(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 6
          ? [...prev, id]
          : prev
    );
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-12 pt-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-sm text-foreground">History</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every image you&apos;ve evaluated, in one place.
          </p>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by filename or rating…"
          className="w-72"
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-24 text-center">
          <HistoryIcon className="size-6 text-muted-foreground/50" strokeWidth={1.5} />
          <p className="mt-2 text-base font-medium text-foreground">
            {query ? "No matching results" : "No analyses yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {query
              ? "Try a different filename or rating."
              : "Upload your first image to see it here."}
          </p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-4 gap-x-6 gap-y-10">
          {filtered.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onDelete={(id) => deleteItem.mutate(id)}
              compareSelected={selected.includes(item.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-lg bg-foreground px-5 py-3 shadow-md"
          >
            <span className="text-sm text-background">{selected.length} selected</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => router.push(`/compare?ids=${selected.join(",")}`)}
            >
              Compare
            </Button>
            <button
              onClick={() => setSelected([])}
              className="text-xs text-background/70 hover:text-background"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-12 pt-8 pb-12">
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <HistoryPageContent />
    </Suspense>
  );
}
