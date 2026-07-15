"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateImageFile } from "@/lib/validation";

interface MultiDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function MultiDropzone({ onFilesSelected, disabled }: MultiDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    for (const file of files) {
      const result = validateImageFile(file);
      if (!result.valid) {
        setError(`${file.name}: ${result.error}`);
        return;
      }
    }
    setError(null);
    onFilesSelected(files);
  }

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload images to compare by dragging or browsing"
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
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center transition-colors duration-200",
          isDragging
            ? "border-brand bg-brand/[0.03]"
            : "border-border bg-card hover:border-muted-foreground/30",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
          <UploadCloud className="size-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <p className="text-base font-medium text-foreground">
          Drag and drop 2–6 images, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPEG or WEBP · up to 20MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
