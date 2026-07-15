"use client";

import Link from "next/link";
import { Columns2, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScoreRing } from "@/components/analysis/score-ring";
import { StatusChip } from "@/components/analysis/status-chip";
import type { HistorySummary } from "@/lib/types";
import { assetUrl } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface HistoryCardProps {
  item: HistorySummary;
  onDelete: (id: string) => void;
  compareSelected?: boolean;
  onToggleCompare?: (id: string) => void;
}

export function HistoryCard({
  item,
  onDelete,
  compareSelected = false,
  onToggleCompare,
}: HistoryCardProps) {
  return (
    <div className="group flex flex-col gap-3 transition-transform duration-200 ease-out hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-lg">
        <Link href={`/history/${item.id}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetUrl(item.thumbnail_url)}
            alt={item.filename}
            className="h-44 w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.05]"
          />
        </Link>

        {compareSelected && (
          <div className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-brand" />
        )}

        <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <Dialog>
            <DialogTrigger
              render={<Button variant="ghost" size="icon-sm" className="bg-card/95 shadow-xs" />}
            >
              <Eye className="size-3.5" />
              <span className="sr-only">Quick preview</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="truncate">{item.filename}</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetUrl(item.thumbnail_url)}
                  alt={item.filename}
                  className="size-24 rounded-lg object-cover"
                />
                <div className="flex items-center gap-4">
                  <ScoreRing score={item.overall_score} tone={item.rating_tone} size={72} strokeWidth={7} />
                  <div>
                    <StatusChip label={item.rating} tone={item.rating_tone} />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
                <Button nativeButton={false} render={<Link href={`/history/${item.id}`} />}>
                  View full report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {onToggleCompare && (
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn(
                "bg-card/95 shadow-xs",
                compareSelected && "bg-brand text-brand-foreground hover:bg-brand/90"
              )}
              onClick={() => onToggleCompare(item.id)}
            >
              <Columns2 className="size-3.5" />
              <span className="sr-only">Add to compare</span>
            </Button>
          )}

          <Dialog>
            <DialogTrigger
              render={<Button variant="ghost" size="icon-sm" className="bg-card/95 shadow-xs" />}
            >
              <Trash2 className="size-3.5 text-danger" />
              <span className="sr-only">Delete</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this analysis?</DialogTitle>
                <DialogDescription>
                  This will permanently remove &ldquo;{item.filename}&rdquo; from your history.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                <DialogClose
                  render={<Button variant="destructive" onClick={() => onDelete(item.id)} />}
                >
                  Delete
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Link href={`/history/${item.id}`} className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">{item.filename}</p>
          <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-sm font-medium tabular-nums text-foreground">
            {item.overall_score}
          </span>
          <StatusChip label={item.rating} tone={item.rating_tone} />
        </div>
      </Link>
    </div>
  );
}
