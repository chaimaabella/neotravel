"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const mono = "var(--font-jetbrains), monospace";

const eur = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

type Msg =
  | { id: number; kind: "user"; text: string }
  | { id: number; kind: "botText"; text: string }
  | { id: number; kind: "quote"; ht: string; tva: string; ttc: string; ref: string }
  | { id: number; kind: "missing"; items: { label: string; sub: string }[] }
  | { id: number; kind: "complex"; text: string; ref: string };

const SUGGESTIONS = [
  "49 personnes, Lyon → Annecy aller-retour, 100 km, le 18 septembre",
  "On voudrait un car pour un séminaire en mai",
  "120 personnes, tour d'Italie sur 6 jours, 2 cars, départ Marseille",
];

const prettyField = (f: string) =>
  f.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

let counter = 100;
const nid = () => ++counter;

export function ChatBox() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      kind: "botText",
      text:
        "Bonjour ! Décrivez votre besoin — groupe, trajet, dates — et je vous chiffre un devis, ou je vous dis ce qu'il me manque.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const session = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    session.current =
      typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || typing) return;

    const history = messages
      .filter((m): m is Extract<Msg, { kind: "user" | "botText" }> => m.kind === "user" || m.kind === "botText")
      .map((m) => ({ role: m.kind === "user" ? "user" : "assistant", content: m.text }));

    setMessages((m) => [...m, { id: nid(), kind: "user", text }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: session.current, history }),
      });
      const data = await res.json();
      setMessages((m) => [...m, ...mapReply(data)]);
    } catch {
      setMessages((m) => [...m, { id: nid(), kind: "botText", text: "Une erreur réseau est survenue. Réessayez." }]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div style={{ width: "min(780px,100%)", margin: "0 auto", padding: "clamp(20px,3vw,32px) clamp(16px,4vw,40px) 40px" }}>
      <div style={{ border: "1.5px solid var(--line)", borderRadius: 22, display: "flex", flexDirection: "column", height: "min(74vh,680px)", background: "var(--bg)", overflow: "hidden" }}>
        {/* header */}
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 11, background: "var(--navy)", color: "#fff" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--accent)", color: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18 }}>N</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Assistant NeoTravel</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "#a9b6cc", display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5dd08a" }} />En ligne · répond au moteur
            </div>
          </div>
        </div>

        {/* messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12, background: "var(--surface)" }}>
          {messages.map((m) => (
            <Bubble key={m.id} m={m} />
          ))}
          {typing && (
            <div style={{ alignSelf: "flex-start", background: "var(--bg)", border: "1px solid var(--line)", padding: "13px 16px", display: "flex", gap: 5, alignItems: "center", borderRadius: "18px 18px 18px 5px" }}>
              {[0, 0.15, 0.3].map((d) => (
                <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--muted)", animation: `nt-bounce 1s infinite ${d}s` }} />
              ))}
            </div>
          )}
        </div>

        {/* suggestions + input */}
        <div style={{ borderTop: "1px solid var(--line)", background: "var(--bg)" }}>
          <div style={{ display: "flex", gap: 8, padding: "12px 14px 0", flexWrap: "wrap" }}>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} style={{ border: "1px solid var(--line)", borderRadius: 99, padding: "7px 13px", fontSize: 11.5, fontWeight: 600, cursor: "pointer", background: "var(--surface)", color: "var(--muted)", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.length > 42 ? s.slice(0, 40) + "…" : s}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Décrivez votre besoin…"
              aria-label="Votre message"
              style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 99, padding: "12px 16px", fontSize: 14, color: "var(--ink)" }}
            />
            <button onClick={() => send(input)} aria-label="Envoyer" style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--navy)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, cursor: "pointer", border: "none", flexShrink: 0 }}>↑</button>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "var(--muted)", margin: "14px 4px 0", lineHeight: 1.5 }}>
        L&apos;assistant extrait les informations de votre message et interroge le moteur déterministe.
        Il ne calcule jamais le prix lui-même — <strong style={{ color: "var(--ink)" }}>même formule, même
        résultat que le simulateur</strong>.
      </p>
    </div>
  );
}

function mapReply(data: unknown): Msg[] {
  const d = (data ?? {}) as Record<string, unknown>;
  const msg = typeof d.message === "string" ? d.message : "";

  // Devis chiffré (statut complet)
  if (d.success === true && typeof d.prix_ttc === "number") {
    const ht = Number(d.prix_ht);
    const ttc = Number(d.prix_ttc);
    const tva = Math.max(0, ttc - ht);
    return [
      { id: nid(), kind: "botText", text: msg || "Voici votre devis :" },
      { id: nid(), kind: "quote", ht: eur(ht), tva: eur(tva), ttc: eur(ttc), ref: `#NT-${Math.floor(1000 + Math.random() * 9000)}` },
    ];
  }

  // Cas complexe → escalade humaine
  if (d.statut === "cas_complexe") {
    return [
      { id: nid(), kind: "complex", text: msg || "Votre demande nécessite une étude personnalisée.", ref: `#NT-CX-${Math.floor(1000 + Math.random() * 9000)}` },
    ];
  }

  // Incomplet → champs manquants
  if (d.success === false) {
    const champs = Array.isArray(d.champs_manquants) ? (d.champs_manquants as string[]) : [];
    const out: Msg[] = [{ id: nid(), kind: "botText", text: msg || "Il me manque quelques informations." }];
    if (champs.length) {
      out.push({
        id: nid(),
        kind: "missing",
        items: champs.map((c) => ({ label: prettyField(c), sub: "à préciser" })),
      });
    }
    return out;
  }

  return [{ id: nid(), kind: "botText", text: msg || "Désolé, je n'ai pas pu traiter la demande." }];
}

function Bubble({ m }: { m: Msg }) {
  if (m.kind === "user") {
    return (
      <div style={{ alignSelf: "flex-end", maxWidth: "82%", background: "var(--navy)", color: "#fff", padding: "11px 15px", fontSize: 14, lineHeight: 1.45, borderRadius: "18px 18px 5px 18px" }}>
        {m.text}
      </div>
    );
  }

  if (m.kind === "botText") {
    return (
      <div style={{ alignSelf: "flex-start", maxWidth: "88%", background: "var(--bg)", border: "1px solid var(--line)", padding: "11px 15px", fontSize: 14, lineHeight: 1.45, borderRadius: "18px 18px 18px 5px" }}>
        {m.text}
      </div>
    );
  }

  if (m.kind === "quote") {
    return (
      <div style={{ alignSelf: "stretch", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ padding: "13px 16px 11px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13.5 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--ok)" }} />Devis chiffré
          </span>
          <span style={{ fontFamily: mono, fontSize: 10.5, color: "var(--muted)" }}>{m.ref}</span>
        </div>
        <div style={{ padding: "14px 16px 16px" }}>
          <Row label="Sous-total HT" value={m.ht} />
          <Row label="TVA 10 %" value={m.tva} pb={11} />
          <div style={{ background: "var(--navy)", color: "#fff", borderRadius: 12, padding: "13px 15px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontWeight: 700, fontSize: 12.5, textTransform: "uppercase", letterSpacing: ".02em" }}>Total TTC</span>
            <span className="nt-num" style={{ fontWeight: 900, fontSize: 27, color: "var(--accent)", lineHeight: 0.82 }}>{m.ttc}</span>
          </div>
          <Link href="/devis" style={{ display: "block", marginTop: 11, background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)", textAlign: "center", padding: 11, borderRadius: 99, fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
            Ouvrir dans le simulateur →
          </Link>
          <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
            calculé par le moteur — identique au simulateur
          </div>
        </div>
      </div>
    );
  }

  if (m.kind === "missing") {
    return (
      <div style={{ alignSelf: "stretch", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ padding: "13px 16px 11px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--line)", fontWeight: 700, fontSize: 13.5 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--warn)" }} />Informations à compléter
        </div>
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {m.items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 20, height: 20, borderRadius: 6, border: "1.5px solid var(--muted)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{it.label}</div>
                <div style={{ fontSize: 11, fontFamily: mono, color: "var(--muted)" }}>{it.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // complex
  return (
    <div style={{ alignSelf: "stretch", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
      <div style={{ padding: "13px 16px 11px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--line)", fontWeight: 700, fontSize: 13.5 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--danger)" }} />Transmis à un conseiller
      </div>
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: 13, lineHeight: 1.5, fontWeight: 500, margin: "0 0 12px", color: "var(--muted)" }}>{m.text}</p>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 11.5, fontWeight: 600, padding: "6px 0", borderTop: "1px solid var(--line)", color: "var(--muted)" }}>
          <span>Réponse sous</span><span style={{ color: "var(--ink)", fontWeight: 700 }}>24 h ouvrées</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 11.5, fontWeight: 600, padding: "6px 0", color: "var(--muted)" }}>
          <span>Dossier</span><span style={{ color: "var(--ink)", fontWeight: 700 }}>{m.ref}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, pb = 3 }: { label: string; value: string; pb?: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 12, fontWeight: 600, padding: `3px 0 ${pb}px`, color: "var(--muted)" }}>
      <span>{label}</span>
      <span style={{ color: "var(--ink)" }}>{value}</span>
    </div>
  );
}
