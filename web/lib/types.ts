export type FeedbackType = "positive" | "warning";
export type RatingTone = "success" | "brand" | "warning" | "danger";

export interface ParameterResult {
  id: string;
  name: string;
  score: number;
  label: string;
  detail: string;
  suggestion: string;
}

export interface FeedbackItem {
  type: FeedbackType;
  message: string;
}

export interface AnalysisResult {
  id: string;
  filename: string;
  created_at: string;
  image_url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  file_size_bytes: number;
  processing_time_seconds: number;
  overall_score: number;
  rating: string;
  rating_tone: RatingTone;
  star_rating: number;
  confidence: number;
  parameters: ParameterResult[];
  feedback: FeedbackItem[];
  suggestion: string;
  verdict_title: string;
  verdict_summary: string;
  verdict_reasons: string[];
  rank?: number | null;
  rank_label?: string | null;
}

export interface HistorySummary {
  id: string;
  filename: string;
  created_at: string;
  thumbnail_url: string;
  overall_score: number;
  rating: string;
  rating_tone: RatingTone;
}

export interface HistoryListResponse {
  items: HistorySummary[];
}

export interface CompareResponse {
  items: AnalysisResult[];
}

export interface ApiErrorPayload {
  detail: string;
}
