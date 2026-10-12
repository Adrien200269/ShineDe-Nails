/**
 * Uploadcare Integration Client for ShineDe Nails
 * Handles direct browser and server uploads to Uploadcare CDN.
 */

export const UPLOADCARE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || "9cd5a822a174c0a1bd1a";

export interface UploadcareUploadResponse {
  file: string; // UUID of uploaded file
}

/**
 * Uploads a local file directly to Uploadcare via Direct Upload API.
 * Returns the permanent global CDN URL.
 */
export async function uploadFileToUploadcare(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
  formData.append("UPLOADCARE_STORE", "1");
  formData.append("file", file);

  const response = await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Uploadcare upload failed: ${response.status} - ${errorText}`);
  }

  const data: UploadcareUploadResponse = await response.json();
  if (!data.file) {
    throw new Error("Invalid response from Uploadcare: file UUID missing.");
  }

  // Construct permanent global CDN URL
  return `https://ucarecdn.com/${data.file}/`;
}

/**
 * Uploads an image from an external URL to Uploadcare.
 */
export async function uploadUrlToUploadcare(imageUrl: string): Promise<string> {
  const formData = new FormData();
  formData.append("pub_key", UPLOADCARE_PUBLIC_KEY);
  formData.append("source_url", imageUrl);
  formData.append("store", "1");

  const response = await fetch("https://upload.uploadcare.com/from_url/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Uploadcare URL upload failed.");
  }

  const result = await response.json();

  if (result.type === "token") {
    // Poll for status until completed (max 10 seconds)
    const token = result.token;
    for (let i = 0; i < 20; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const statusRes = await fetch(
        `https://upload.uploadcare.com/from_url/status/?token=${token}`
      );
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.status === "success" && statusData.uuid) {
          return `https://ucarecdn.com/${statusData.uuid}/`;
        }
        if (statusData.status === "error") {
          throw new Error(statusData.error || "Failed to process image URL");
        }
      }
    }
  }

  throw new Error("Uploadcare timed out processing image URL.");
}

/**
 * Optimizes an Uploadcare CDN URL with smart quality, auto format, and dimension constraints.
 */
export function getOptimizedNailImageUrl(
  cdnUrl: string,
  options?: { width?: number; height?: number }
): string {
  if (!cdnUrl.includes("ucarecdn.com")) return cdnUrl;

  const width = options?.width || 1200;
  const height = options?.height;

  let transformation = `/-/quality/smart/-/format/auto/-/preview/${width}x${height || width}/`;
  
  // Ensure trailing slash on base URL before transformations
  const base = cdnUrl.endsWith("/") ? cdnUrl : `${cdnUrl}/`;
  return `${base}${transformation}`;
}
