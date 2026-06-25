"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/devis", label: "Simulateur" },
  { href: "/chat", label: "Devis en 1 phrase" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("neotravel.theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <header
      className="nt-noprint"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "var(--bg)",
        borderBottom: "2px solid var(--bd)",
      }}
    >
      <div
        style={{
          width: "min(1160px,100%)",
          margin: "0 auto",
          padding: "14px clamp(16px,4vw,40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--ink)" }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--accent)",
              color: "var(--navy)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 19,
              border: "2px solid var(--bd)",
            }}
          >
            N
          </div>
          <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: "-.01em" }}>NEOTRAVEL</span>
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(14px,2.4vw,26px)",
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".02em",
          }}
        >
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  paddingBottom: 4,
                  borderBottom: active ? "3px solid var(--accent)" : "3px solid transparent",
                  color: "var(--ink)",
                  textDecoration: "none",
                  opacity: active ? 1 : 0.7,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={toggleTheme}
            title="Basculer clair / sombre"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              cursor: "pointer",
              border: "2px solid var(--bd)",
              background: "transparent",
              color: "var(--ink)",
              padding: "7px 11px",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {dark ? "☀ Clair" : "☾ Sombre"}
          </button>
          <Link
            href="/chat"
            style={{
              background: "var(--accent)",
              color: "var(--navy)",
              padding: "9px 16px",
              fontSize: 12.5,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".02em",
              textDecoration: "none",
              border: "2px solid var(--navy)",
            }}
          >
            Devis en 1 phrase →
          </Link>
        </div>
      </div>
    </header>
  );
}
