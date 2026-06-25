"use client";

import Link from "next/link";
import { useState } from "react";
import { openAssistant } from "@/lib/assistant-bus";

const mono = "var(--font-jetbrains), monospace";

const EXEMPLES = [
  "49 personnes, Lyon → Annecy A/R, le 18 septembre",
  "Séminaire de 30 pers. en mai",
];

/** Entrée conversationnelle en une phrase : ouvre l'assistant en popover (même page). */
export function HeroChatInput() {
  const [value, setValue] = useState("");

  function go(message?: string) {
    openAssistant((message ?? value).trim() || undefined);
    setValue("");
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
          className="nt-btn"
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
            className="nt-btn"
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
