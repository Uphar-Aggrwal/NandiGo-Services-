"use client";

import { useState } from "react";

type SafeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

export function SafeImage({ src, alt, className }: SafeImageProps) {
  const fallback = "/nandigo-logo.png";
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setCurrentSrc(fallback)}
    />
  );
}
