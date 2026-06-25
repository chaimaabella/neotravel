import Link from "next/link";

const mono = "var(--font-jetbrains), monospace";
const wrap: React.CSSProperties = { width: "min(1160px,100%)", margin: "0 auto" };

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section
        style={{
          ...wrap,
          padding: "clamp(40px,6vw,68px) clamp(16px,4vw,40px) clamp(28px,4vw,40px)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "clamp(34px,5vw,54px)",
            right: "clamp(16px,4vw,40px)",
            background: "var(--navy)",
            color: "var(--accent)",
            padding: "13px 15px",
            textAlign: "center",
            border: "2px solid var(--navy)",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: "clamp(26px,4vw,34px)", lineHeight: 0.85 }}>0%</div>
          <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: ".06em" }}>IA</div>
          <div style={{ fontFamily: mono, fontSize: 8, color: "#fff", marginTop: 4 }}>DANS LE PRIX</div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--accent)",
            color: "var(--navy)",
            padding: "8px 13px",
            fontSize: 12,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: ".03em",
            marginBottom: 24,
          }}
        >
          ▲ Prix 100% déterministe
        </div>

        <h1
          style={{
            fontWeight: 800,
            fontSize: "clamp(34px,6.2vw,66px)",
            lineHeight: 0.98,
            letterSpacing: "-.02em",
            textTransform: "uppercase",
            margin: "0 0 22px",
            maxWidth: 880,
          }}
        >
          Le prix de votre car,{" "}
          <span
            style={{
              background: "var(--accent)",
              color: "var(--navy)",
              padding: "0 8px",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            calculé devant vous.
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(15px,2vw,18px)",
            lineHeight: 1.5,
            maxWidth: 600,
            margin: "0 0 28px",
            color: "var(--muted)",
            fontWeight: 500,
          }}
        >
          Aucune IA ne fixe votre tarif. Une formule unique, transparente et auditable — mêmes
          informations, même prix, pour tout le monde. Du minibus à l&apos;autocar grand tourisme,
          de 1 à 85 passagers.
        </p>

        {/* Route line */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, maxWidth: 560, marginBottom: 30 }}>
          <div>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--ink)" }} />
            <div style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 700, marginTop: 7 }}>DÉPART</div>
          </div>
          <div
            style={{
              flex: 1,
              height: 3,
              background:
                "repeating-linear-gradient(90deg,var(--ink),var(--ink) 9px,transparent 9px,transparent 16px)",
              margin: "0 12px 18px",
              position: "relative",
            }}
          >
            <span style={{ position: "absolute", right: -2, top: -8, fontSize: 15 }}>▶</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bd)", marginLeft: "auto" }} />
            <div style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 700, marginTop: 7 }}>DESTINATION</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 13, flexWrap: "wrap" }}>
          <Link href="/devis" style={ctaDark}>Simuler mon devis →</Link>
          <Link href="/chat" style={ctaOutline}>Parler à l&apos;assistant</Link>
        </div>
      </section>

      {/* BOARD STRIP */}
      <div style={{ background: "var(--navy)", color: "#fff" }}>
        <div style={{ ...wrap, padding: "0 clamp(16px,4vw,40px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          {[
            ["1 → 85", "Passagers par demande"],
            ["~10 s", "Pour un devis détaillé"],
            ["TVA 10 %", "Transport de voyageurs"],
          ].map(([big, small]) => (
            <div key={big} style={{ padding: "26px 0" }}>
              <div style={{ fontWeight: 900, fontSize: 30, color: "var(--accent)" }}>{big}</div>
              <div style={{ fontSize: 12.5, color: "#9fb0cc", marginTop: 5, textTransform: "uppercase", letterSpacing: ".03em", fontWeight: 600 }}>{small}</div>
            </div>
          ))}
        </div>
      </div>

      {/* D'OÙ VIENT CHAQUE EURO */}
      <section style={{ ...wrap, padding: "clamp(40px,5vw,56px) clamp(16px,4vw,40px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 36, alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "clamp(28px,4vw,42px)", lineHeight: 1, textTransform: "uppercase", letterSpacing: "-.02em", marginBottom: 16 }}>
            D&apos;où vient chaque euro.
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--muted)", fontWeight: 500, margin: "0 0 22px" }}>
            On ne sort pas un chiffre magique. On affiche le calcul, ligne par ligne : base, marge,
            saison, urgence, capacité, options. Puis TVA et TTC.
          </p>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            <span style={{ background: "var(--navy)", color: "#fff", padding: "6px 12px", fontFamily: mono, fontSize: 11, fontWeight: 700 }}>CASCADE</span>
            <span style={{ background: "var(--accent)", color: "var(--navy)", padding: "6px 12px", fontFamily: mono, fontSize: 11, fontWeight: 700 }}>RÉF. VÉRIFIABLE</span>
            <span style={{ border: "2px solid var(--bd)", padding: "5px 11px", fontFamily: mono, fontSize: 11, fontWeight: 700 }}>AUDITABLE</span>
          </div>
        </div>

        <div style={{ border: "2px solid var(--bd)" }}>
          <div style={{ background: "var(--navy)", color: "#fff", padding: "11px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 800, fontSize: 14, textTransform: "uppercase", letterSpacing: ".03em" }}>Devis — exemple</span>
            <span style={{ fontFamily: mono, fontSize: 11, color: "var(--accent)" }}>#NT-4471</span>
          </div>
          <div style={{ padding: 18, fontFamily: mono, fontSize: 13, fontWeight: 500, background: "var(--bg)" }}>
            {[
              ["Base · 100 km", "580,00 €", false],
              ["Aller-retour ×2", "+ 580,00 €", true],
              ["Marge +15 %", "+ 174,00 €", true],
              ["Capacité 49 pers.", "— 0,00 €", false],
            ].map(([l, v, bold]) => (
              <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span>{l}</span>
                <span style={{ fontWeight: bold ? 700 : 400 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--navy)", color: "#fff", padding: "15px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: ".03em" }}>Total TTC</span>
            <span className="nt-num" style={{ fontWeight: 900, fontSize: 34, color: "var(--accent)", lineHeight: 0.85 }}>1 466,30 €</span>
          </div>
        </div>
      </section>

      {/* TWO TOOLS */}
      <section style={{ ...wrap, padding: "0 clamp(16px,4vw,40px) clamp(40px,5vw,56px)" }}>
        <div style={{ fontWeight: 800, fontSize: "clamp(24px,3.4vw,34px)", textTransform: "uppercase", letterSpacing: "-.02em", marginBottom: 22 }}>
          Deux outils, un seul moteur
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          <ToolCard href="/devis" glyph="=" title="Le simulateur" cta="Ouvrir le simulateur →">
            Trajet, groupe, options. Le devis se recompose en direct, ligne par ligne — vous voyez
            d&apos;où vient chaque euro.
          </ToolCard>
          <ToolCard href="/chat" glyph="~" title="L'assistant" cta="Parler à l'assistant →">
            Décrivez en une phrase. Il qualifie, complète, puis interroge le{" "}
            <strong>même moteur déterministe</strong> — jamais d&apos;invention.
          </ToolCard>
        </div>
      </section>

      {/* WHY FAIR */}
      <div style={{ background: "var(--navy)", color: "#fff" }}>
        <section style={{ ...wrap, padding: "clamp(40px,5vw,56px) clamp(16px,4vw,40px)" }}>
          <div style={{ fontWeight: 800, fontSize: "clamp(24px,3.4vw,34px)", textTransform: "uppercase", letterSpacing: "-.02em", marginBottom: 26 }}>
            Pourquoi ce prix est juste
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 22 }}>
            {[
              ["01", "Déterministe", "Mêmes entrées, même prix. Aucune variable cachée, aucune négo à la tête du client."],
              ["02", "Transparent", "Chaque euro est expliqué : base, marge, coefficients, options, avant TVA et TTC."],
              ["03", "Auditable", "Référence sur chaque devis. Relancez le calcul un mois après : même résultat au centime."],
            ].map(([n, t, p]) => (
              <div key={n}>
                <div style={{ fontWeight: 900, fontSize: 46, color: "var(--accent)", lineHeight: 0.85, marginBottom: 12 }}>{n}</div>
                <div style={{ fontWeight: 800, fontSize: 19, textTransform: "uppercase", marginBottom: 9 }}>{t}</div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#9fb0cc", margin: 0 }}>{p}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* COEFFICIENTS */}
      <section style={{ ...wrap, padding: "clamp(40px,5vw,56px) clamp(16px,4vw,40px)" }}>
        <div style={{ fontWeight: 800, fontSize: "clamp(24px,3.4vw,34px)", textTransform: "uppercase", letterSpacing: "-.02em", marginBottom: 22 }}>
          Les coefficients, en clair
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", border: "2px solid var(--bd)" }}>
          <CoeffCell title="SAISONNALITÉ">
            Mai–juin : <Strong>+15 %</Strong>
            <br />Mars/avr./juil. : +10 %
            <br />Jan/fév/août/nov : −7 %
          </CoeffCell>
          <CoeffCell title="URGENCE · DÉLAI">
            &lt; 48 h : <Strong>+10 %</Strong>
            <br />&lt; 7 j : +5 % · &lt; 3 mois : −5 %
            <br />&gt; 3 mois : −10 %
          </CoeffCell>
          <CoeffCell title="CAPACITÉ · PLACES">
            1–19 : −5 % · 20–53 : 0 %
            <br />54–63 : +15 % · 64–67 : +20 %
            <br />68–85 : <Strong>+40 %</Strong>
          </CoeffCell>
        </div>
      </section>
    </div>
  );
}

const ctaDark: React.CSSProperties = {
  background: "var(--navy)", color: "#fff", padding: "15px 26px", fontSize: 15, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: ".02em", textDecoration: "none",
};
const ctaOutline: React.CSSProperties = {
  background: "var(--bg)", color: "var(--ink)", padding: "15px 26px", fontSize: 15, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: ".02em", border: "2px solid var(--bd)", textDecoration: "none",
};

function ToolCard({ href, glyph, title, cta, children }: { href: string; glyph: string; title: string; cta: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ border: "2px solid var(--bd)", padding: 28, background: "var(--surface)", textDecoration: "none", color: "var(--ink)", display: "block" }}>
      <div style={{ display: "inline-flex", width: 44, height: 44, background: "var(--accent)", border: "2px solid var(--navy)", color: "var(--navy)", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 24, marginBottom: 16 }}>
        {glyph}
      </div>
      <div style={{ fontWeight: 800, fontSize: 22, textTransform: "uppercase", marginBottom: 10 }}>{title}</div>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--muted)", fontWeight: 500, margin: "0 0 16px" }}>{children}</p>
      <span style={{ fontWeight: 800, textTransform: "uppercase", fontSize: 13, letterSpacing: ".02em" }}>{cta}</span>
    </Link>
  );
}

function CoeffCell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 22, borderBottom: "2px solid var(--line)" }}>
      <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid var(--accent)" }}>{title}</div>
      <div style={{ fontFamily: mono, fontSize: 13, lineHeight: 1.9, color: "var(--muted)" }}>{children}</div>
    </div>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: "var(--ink)" }}>{children}</strong>;
}
