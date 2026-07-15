import { apiDelete, apiGet, apiPostForm, API_BASE_URL } from "@/lib/api/client";
import type {
  AnalysisResult,
  CompareResponse,
  HistoryListResponse,
} from "@/lib/types";

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  return apiPostForm<AnalysisResult>("/api/analyze", formData);
}

export async function compareImages(files: File[]): Promise<CompareResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return apiPostForm<CompareResponse>("/api/compare", formData);
}

export async function getHistory(limit = 100): Promise<HistoryListResponse> {
  return apiGet<HistoryListResponse>(`/api/history?limit=${limit}`);
}

export async function getHistoryItem(id: string): Promise<AnalysisResult> {
  return apiGet<AnalysisResult>(`/api/history/${id}`);
}

export async function deleteHistoryItem(id: string): Promise<{ ok: boolean }> {
  return apiDelete<{ ok: boolean }>(`/api/history/${id}`);
}

export function exportUrl(id: string, format: "json" | "csv"): string {
  return `${API_BASE_URL}/api/history/${id}/export?format=${format}`;
}
