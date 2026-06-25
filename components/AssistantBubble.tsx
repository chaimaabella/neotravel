"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Bulle d'accès permanent à l'assistant, présente partout sauf sur /chat. */
export function AssistantBubble() {
  const pathname = usePathname();
  if (pathname?.startsWith("/chat")) return null;

  return (
    <Link
      href="/chat"
      aria-label="Obtenir un devis en une phrase"
      className="nt-noprint"
      style={{
        position: "fixed",
        right: "clamp(16px,4vw,28px)",
        bottom: "clamp(16px,4vw,28px)",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        gap: 10,
        textDecoration: "none",
      }}
    >
      <span
        style={{
          background: "var(--bg)",
          color: "var(--ink)",
          border: "2px solid var(--bd)",
          padding: "9px 13px",
          fontSize: 12.5,
          fontWeight: 700,
          boxShadow: "0 6px 18px rgba(0,0,0,.12)",
          whiteSpace: "nowrap",
        }}
      >
        Un devis en une phrase ?
      </span>
      <span
        style={{
          position: "relative",
          width: 56,
          height: 56,
          background: "var(--accent)",
          color: "var(--navy)",
          border: "2px solid var(--navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 26,
          boxShadow: "0 8px 22px rgba(0,0,0,.22)",
        }}
      >
        N
        <span
          style={{
            position: "absolute",
            top: -3,
            right: -3,
            width: 13,
            height: 13,
            borderRadius: "50%",
            background: "#5dd08a",
            border: "2px solid var(--bg)",
          }}
        />
      </span>
    </Link>
  );
}
