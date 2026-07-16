import "server-only";

import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { requireEnv } from "@/lib/env";

export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 10 * 1024 * 1024;

type MediaKind = "image" | "video";

let s3Client: S3Client | null = null;

type S3Sender = {
  send(command: PutObjectCommand | DeleteObjectCommand): Promise<unknown>;
};

function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY")
      }
    });
  }
  return s3Client;
}

export function validateMediaFile(file: File, kind: MediaKind) {
  if (!file || file.size === 0) return null;

  if (kind === "image") {
    if (file.type !== "image/webp") return "Only image/webp files are accepted.";
    if (file.size > IMAGE_MAX_BYTES) return "Image files must be 2MB or smaller.";
    return null;
  }

  if (file.type !== "video/mp4") return "Only video/mp4 files are accepted.";
  if (file.size > VIDEO_MAX_BYTES) return "Video files must be 10MB or smaller.";
  return null;
}

export function publicR2Url(key: string) {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (base) return `${base}/${key}`;
  const bucket = requireEnv("R2_BUCKET_NAME");
  const account = requireEnv("R2_ACCOUNT_ID");
  return `https://${bucket}.${account}.r2.cloudflarestorage.com/${key}`;
}

export async function uploadMediaFile(file: File, folder: string, kind: MediaKind) {
  const validation = validateMediaFile(file, kind);
  if (validation) throw new Error(validation);
  if (!file || file.size === 0) return null;

  const extension = kind === "image" ? "webp" : "mp4";
  const key = `${folder.replace(/^\/+|\/+$/g, "")}/${crypto.randomUUID()}.${extension}`;
  const body = Buffer.from(await file.arrayBuffer());

  await (getS3Client() as unknown as S3Sender).send(
    new PutObjectCommand({
      Bucket: requireEnv("R2_BUCKET_NAME"),
      Key: key,
      Body: body,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable"
    })
  );

  return {
    key,
    url: publicR2Url(key),
    mimeType: file.type
  };
}

export async function deleteMediaKey(key: string | null | undefined) {
  if (!key) return;
  await (getS3Client() as unknown as S3Sender).send(
    new DeleteObjectCommand({
      Bucket: requireEnv("R2_BUCKET_NAME"),
      Key: key
    })
  );
}
