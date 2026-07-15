export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_FILE_BYTES = 20 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): FileValidationResult {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { valid: false, error: "Unsupported format. Use PNG, JPEG, or WEBP." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { valid: false, error: "File exceeds the 20MB size limit." };
  }
  return { valid: true };
}
