"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const mono = "var(--font-jetbrains), monospace";

const EXEMPLES = [
  "49 personnes, Lyon → Annecy A/R, le 18 septembre",
  "Séminaire de 30 pers. en mai",
];

/** Entrée conversationnelle en une phrase : envoie vers /chat?q=… (auto-envoyé). */
export function HeroChatInput() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function go(message?: string) {
    const text = (message ?? value).trim();
    router.push(text ? `/chat?q=${encodeURIComponent(text)}` : "/chat");
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        style={{ display: "flex", border: "2px solid var(--bd)", background: "var(--field)" }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Décrivez votre besoin en une phrase…"
          aria-label="Décrivez votre besoin"
          style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", padding: "15px 16px", fontSize: 15, color: "var(--ink)", outline: "none" }}
        />
        <button
          type="submit"
          style={{ background: "var(--accent)", color: "var(--navy)", border: "none", borderLeft: "2px solid var(--bd)", padding: "0 22px", fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".02em", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          Chiffrer →
        </button>
      </form>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {EXEMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => go(ex)}
            style={{ border: "1px solid var(--line)", background: "var(--surface)", color: "var(--muted)", padding: "6px 12px", fontFamily: mono, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
          >
            {ex}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 14 }}>
        Vous préférez les détails ?{" "}
        <Link href="/devis" style={{ color: "var(--ink)", fontWeight: 700, textDecoration: "underline", textDecorationColor: "var(--accent)", textUnderlineOffset: 3 }}>
          Ouvrir le simulateur →
        </Link>
      </p>
    </div>
  );
}
