"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  analyzeImage,
  compareImages,
  deleteHistoryItem,
  getHistory,
  getHistoryItem,
} from "@/lib/api/analysis";

const HISTORY_KEY = ["history"];

export function useAnalyzeImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: analyzeImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });
}

export function useCompareImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: compareImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });
}

export function useHistory(limit = 100) {
  return useQuery({
    queryKey: [...HISTORY_KEY, limit],
    queryFn: () => getHistory(limit),
  });
}

export function useHistoryItem(id: string | undefined) {
  return useQuery({
    queryKey: ["history-item", id],
    queryFn: () => getHistoryItem(id as string),
    enabled: Boolean(id),
  });
}

export function useHistoryItemsByIds(ids: string[]) {
  return useQuery({
    queryKey: ["history-items", ids],
    queryFn: () => Promise.all(ids.map((id) => getHistoryItem(id))),
    enabled: ids.length > 0,
  });
}

export function useDeleteHistoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHistoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });
}
