import type { CSSProperties } from "react";

export function coverStyle(cover: string): CSSProperties {
  const value = cover.trim();
  if (value.startsWith("http") || value.startsWith("/") || value.startsWith("data:")) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(7, 10, 18, 0.1), rgba(7, 10, 18, 0.82)), url("${value}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  if (value.length > 0) {
    return { backgroundImage: value };
  }
  return {
    backgroundImage: "linear-gradient(135deg, #131a2c 0%, #312e81 55%, #0b0f1a 100%)",
  };
}
