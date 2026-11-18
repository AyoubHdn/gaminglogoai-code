/* eslint-disable @typescript-eslint/restrict-template-expressions */
// src/utils/s3Paths.ts

export const S3_BASE =
  `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING}.s3.${process.env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com`;

export function s3Style(path: string) {
  // Remove any starting slash: s3Style("/styles/f4.webp") → "styles/f4.webp"
  const clean = path.replace(/^\//, "");
  return `${S3_BASE}/${clean}`;
}
