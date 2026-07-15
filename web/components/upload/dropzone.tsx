"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ImagePlus, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateImageFile } from "@/lib/validation";
import { FramingGuide } from "@/components/upload/framing-guide";

export interface DropzoneHandle {
  openFilePicker: () => void;
}

interface DropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const Dropzone = forwardRef<DropzoneHandle, DropzoneProps>(function Dropzone(
  { onFileSelected, disabled },
  ref
) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    openFilePicker: () => inputRef.current?.click(),
  }));

  const handleFile = useCallback(
    (file: File | undefined | null) => {
      if (!file) return;
      const result = validateImageFile(file);
      if (!result.valid) {
        setError(result.error ?? "This file can't be used.");
        return;
      }
      setError(null);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      if (disabled) return;
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/")
      );
      const file = item?.getAsFile();
      if (file) handleFile(file);
    }
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [disabled, handleFile]);

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload an image by dragging, browsing, or pasting"
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (disabled) return;
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex min-h-[420px] cursor-pointer flex-col items-center justify-center gap-5 rounded-xl border text-center transition-colors duration-200",
          isDragging
            ? "border-brand bg-brand/[0.03]"
            : "border-dashed border-border bg-card hover:border-muted-foreground/30",
          !isDragging && !disabled && "animate-dash-pulse",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
          <UploadCloud className="size-6 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="space-y-1.5">
          <p className="text-base font-medium text-foreground">
            Drag and drop an image, or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            You can also paste an image from your clipboard
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
          <FramingGuide />
          <span className="max-w-32 text-left leading-relaxed">
            Best results with a centered, front-facing subject
          </span>
        </div>

        <p className="text-xs text-muted-foreground/70">PNG, JPEG or WEBP · up to 20MB</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-danger">
          <ImagePlus className="size-4" />
          {error}
        </p>
      )}
    </div>
  );
});
