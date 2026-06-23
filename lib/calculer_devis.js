/**
 * calculer_devis.js — Moteur de tarification NeoTravel
 * ======================================================
 * RÈGLE D'OR : Cette fonction ne fait JAMAIS appel au LLM.
 * Le calcul est 100% déterministe, documenté et auditable.
 * Mêmes paramètres en entrée = même prix en sortie, toujours.
 *
 * Auteurs : Groupe NeoTravel — MBA MSI Epitech
 */

// ─────────────────────────────────────────────────────────
// GRILLE TARIFAIRE FORFAITAIRE (jusqu'à 180 km)
// Source : formule_transfert_simple.pdf
// ─────────────────────────────────────────────────────────
const GRILLE_KM = {
  10:  250, 20:  250, 30:  250,
  40:  320, 50:  350, 60:  390,
  70:  430, 80:  500, 90:  540,
  100: 580, 110: 620, 120: 660,
  130: 700, 140: 740, 150: 780,
  160: 820, 170: 860, 180: 900,
};

// ─────────────────────────────────────────────────────────
// COEFFICIENTS (tous pilotables depuis Airtable en prod)
// ─────────────────────────────────────────────────────────
const COEFF_SAISONNALITE = {
  1:  -0.07, // Janvier  — basse saison
  2:  -0.07, // Février  — basse saison
  3:  +0.10, // Mars     — haute saison
  4:  +0.10, // Avril    — haute saison
  5:  +0.15, // Mai      — très haute saison
  6:  +0.15, // Juin     — très haute saison
  7:  +0.10, // Juillet  — haute saison
  8:  -0.07, // Août     — basse saison
  9:   0.00, // Septembre — moyenne saison
  10:  0.00, // Octobre   — moyenne saison
  11: -0.07, // Novembre  — basse saison
  12:  0.00, // Décembre  — moyenne saison
};

const COEFF_URGENCE = {
  DD_PRIORITAIRE:  +0.10,
  DD_URGENT:       +0.05,
  DD_NORMAL:       -0.05,
  DD_3MOISETPLUS:  -0.10,
};

// Tranches capacité : [min_exclus, max_inclus, coefficient]
const TRANCHES_CAPACITE = [
  [0,  19,  -0.05],
  [19, 53,   0.00],
  [53, 63,  +0.15],
  [63, 67,  +0.20],
  [67, 85,  +0.40],
];

const MARGE        = 0.15;
const TVA          = 0.10;
const PRIX_KM_LONG = 2.5;  // au-delà de 180km : (km*2) * 2.5

// ─────────────────────────────────────────────────────────
// FONCTIONS UTILITAIRES
// ─────────────────────────────────────────────────────────

/**
 * Arrondit un km à la dizaine supérieure pour lookup dans la grille.
 * Ex: 45km → 50, 80km → 80, 181km → hors grille
 */
function arrondir_km(km) {
  return Math.ceil(km / 10) * 10;
}

/**
 * Calcule le prix de base pour un transfert simple (aller uniquement).
 */
function prix_base_simple(distance_km) {
  if (distance_km <= 0) {
    throw new Error("La distance doit être supérieure à 0 km.");
  }
  if (distance_km > 85 * 10) {
    // Sécurité : distance absurde
    throw new Error(`Distance irréaliste : ${distance_km} km.`);
  }

  if (distance_km <= 180) {
    const km_arrondi = arrondir_km(distance_km);
    const prix = GRILLE_KM[km_arrondi];
    if (prix === undefined) {
      throw new Error(`Pas de tarif en grille pour ${km_arrondi} km.`);
    }
    return { prix, source: `Grille forfait (${km_arrondi} km)` };
  } else {
    // Au-delà de 180 km : (km * 2) * 2.5 €/km
    const prix = (distance_km * 2) * PRIX_KM_LONG;
    return { prix, source: `Hors grille (${distance_km} km × 2 × ${PRIX_KM_LONG} €/km)` };
  }
}

/**
 * Retourne le coefficient de saisonnalité à partir d'une date de départ.
 */
function get_coeff_saisonnalite(date_depart) {
  const d = new Date(date_depart);
  if (isNaN(d.getTime())) throw new Error(`Date de départ invalide : ${date_depart}`);
  const mois = d.getMonth() + 1; // getMonth() retourne 0-11
  return {
    coeff: COEFF_SAISONNALITE[mois],
    label: `Mois ${mois} → ${(COEFF_SAISONNALITE[mois] * 100).toFixed(0)}%`
  };
}

/**
 * Retourne le coefficient d'urgence.
 */
function get_coeff_urgence(code_urgence) {
  const coeff = COEFF_URGENCE[code_urgence];
  if (coeff === undefined) {
    throw new Error(
      `Code urgence invalide : "${code_urgence}". ` +
      `Valeurs acceptées : ${Object.keys(COEFF_URGENCE).join(", ")}`
    );
  }
  return { coeff, label: `${code_urgence} → ${(coeff * 100).toFixed(0)}%` };
}

/**
 * Retourne le coefficient de capacité selon le nombre de passagers.
 */
function get_coeff_capacite(nb_passagers) {
  if (nb_passagers <= 0) throw new Error("Le nombre de passagers doit être > 0.");
  if (nb_passagers > 85) throw new Error(`NeoTravel ne dispose pas de véhicule pour ${nb_passagers} passagers (max 85).`);

  for (const [min_excl, max_incl, coeff] of TRANCHES_CAPACITE) {
    if (nb_passagers > min_excl && nb_passagers <= max_incl) {
      return {
        coeff,
        label: `${nb_passagers} passagers (tranche ${min_excl+1}–${max_incl}) → ${(coeff * 100).toFixed(0)}%`
      };
    }
  }
  throw new Error(`Aucune tranche de capacité trouvée pour ${nb_passagers} passagers.`);
}

// ─────────────────────────────────────────────────────────
// FONCTION PRINCIPALE — calculer_devis()
// ─────────────────────────────────────────────────────────

/**
 * Calcule le prix d'un devis NeoTravel de façon déterministe.
 *
 * @param {Object} params
 * @param {number}  params.nb_passagers   — nombre de personnes dans le groupe
 * @param {string}  params.date_depart    — date du départ aller (ISO : "2025-05-14")
 * @param {string}  params.date_demande   — date à laquelle le client a fait sa demande (ISO)
 * @param {number}  params.distance_km    — distance en km (aller simple)
 * @param {boolean} params.aller_retour   — true si le client veut un retour
 * @param {string}  params.urgence        — code urgence : DD_PRIORITAIRE | DD_URGENT | DD_NORMAL | DD_3MOISETPLUS
 * @param {Object}  [params.options]      — options supplémentaires
 * @param {number}  [params.options.nb_guides]         — nombre de guides/accompagnateurs (80€/jour)
 * @param {number}  [params.options.nb_nuits_chauffeur] — nombre de nuits chauffeur (120€/nuit)
 * @param {boolean} [params.options.peages_inclus]     — si les péages sont inclus dans le forfait
 *
 * @returns {Object} Résultat complet avec prix HT, TVA, TTC et détail du calcul
 */
function calculer_devis(params) {

  // ── 1. VALIDATION DES PARAMÈTRES ─────────────────────
  const { nb_passagers, date_depart, date_demande, distance_km, aller_retour, urgence, options = {} } = params;

  if (nb_passagers === undefined || nb_passagers === null)
    throw new Error("Paramètre manquant : nb_passagers");
  if (!date_depart)
    throw new Error("Paramètre manquant : date_depart");
  if (!date_demande)
    throw new Error("Paramètre manquant : date_demande");
  if (distance_km === undefined || distance_km === null)
    throw new Error("Paramètre manquant : distance_km");
  if (urgence === undefined || urgence === null)
    throw new Error("Paramètre manquant : urgence");

  const lignes = []; // détail du calcul, ligne par ligne

  // ── 2. PRIX DE BASE (transfert simple) ───────────────
  const { prix: base_simple, source: source_base } = prix_base_simple(distance_km);
  lignes.push({
    libelle: `Base transfert simple — ${source_base}`,
    montant: base_simple
  });

  // ── 3. ALLER/RETOUR ──────────────────────────────────
  let base = base_simple;
  if (aller_retour) {
    base = base_simple * 2;
    lignes.push({
      libelle: "Aller/Retour (× 2)",
      montant: base
    });
  }

  // ── 4. MARGE COMMERCIALE (+15%) ──────────────────────
  const montant_marge = base * MARGE;
  const apres_marge = base + montant_marge;
  lignes.push({
    libelle: `Marge commerciale (+${(MARGE * 100).toFixed(0)}%)`,
    montant: montant_marge
  });

  // ── 5. COEFFICIENT SAISONNALITÉ ──────────────────────
  const { coeff: cs, label: label_saison } = get_coeff_saisonnalite(date_depart);
  const montant_saison = apres_marge * cs;
  const apres_saison = apres_marge + montant_saison;
  lignes.push({
    libelle: `Saisonnalité — ${label_saison}`,
    montant: montant_saison
  });

  // ── 6. COEFFICIENT URGENCE ───────────────────────────
  const { coeff: cu, label: label_urgence } = get_coeff_urgence(urgence);
  const montant_urgence = apres_saison * cu;
  const apres_urgence = apres_saison + montant_urgence;
  lignes.push({
    libelle: `Urgence — ${label_urgence}`,
    montant: montant_urgence
  });

  // ── 7. COEFFICIENT CAPACITÉ ──────────────────────────
  const { coeff: cc, label: label_capacite } = get_coeff_capacite(nb_passagers);
  const montant_capacite = apres_urgence * cc;
  const apres_capacite = apres_urgence + montant_capacite;
  lignes.push({
    libelle: `Capacité — ${label_capacite}`,
    montant: montant_capacite
  });

  // ── 8. OPTIONS SUPPLÉMENTAIRES ───────────────────────
  let total_options = 0;

  if (options.nb_guides && options.nb_guides > 0) {
    // 80€ par guide par jour — on suppose 1 jour par défaut si non précisé
    const nb_jours = options.nb_jours || 1;
    const montant_guide = options.nb_guides * 80 * nb_jours;
    total_options += montant_guide;
    lignes.push({
      libelle: `Guide(s) — ${options.nb_guides} × 80€ × ${nb_jours} jour(s)`,
      montant: montant_guide
    });
  }

  if (options.nb_nuits_chauffeur && options.nb_nuits_chauffeur > 0) {
    const montant_nuit = options.nb_nuits_chauffeur * 120;
    total_options += montant_nuit;
    lignes.push({
      libelle: `Nuit(s) chauffeur — ${options.nb_nuits_chauffeur} × 120€`,
      montant: montant_nuit
    });
  }

  if (options.peages_inclus) {
    lignes.push({
      libelle: "Péages — inclus au forfait (montant selon trajet réel)",
      montant: 0
    });
  }

  // ── 9. SOUS-TOTAL HT ─────────────────────────────────
  const prix_ht = Math.round((apres_capacite + total_options) * 100) / 100;
  lignes.push({
    libelle: "─── SOUS-TOTAL HT",
    montant: prix_ht
  });

  // ── 10. TVA (10%) ────────────────────────────────────
  const montant_tva = Math.round(prix_ht * TVA * 100) / 100;
  lignes.push({
    libelle: `TVA (${(TVA * 100).toFixed(0)}%)`,
    montant: montant_tva
  });

  // ── 11. TOTAL TTC ────────────────────────────────────
  const prix_ttc = Math.round((prix_ht + montant_tva) * 100) / 100;

  // ── 12. RÉSULTAT FINAL ───────────────────────────────
  return {
    prix_ht,
    tva: montant_tva,
    prix_ttc,
    devise: "EUR",
    lignes,
    coefficients: {
      marge:        `+${(MARGE * 100).toFixed(0)}%`,
      saisonnalite: label_saison,
      urgence:      label_urgence,
      capacite:     label_capacite,
    },
    meta: {
      distance_km,
      aller_retour: aller_retour || false,
      nb_passagers,
      date_depart,
      date_demande,
      calcule_le: new Date().toISOString(),
    }
  };
}


// ─────────────────────────────────────────────────────────
// JEUX DE TESTS
// ─────────────────────────────────────────────────────────

function afficher_devis(titre, params) {
  console.log("\n" + "═".repeat(60));
  console.log(`🧪 TEST : ${titre}`);
  console.log("═".repeat(60));
  try {
    const result = calculer_devis(params);
    result.lignes.forEach(l => {
      const signe = l.montant >= 0 ? "+" : "";
      console.log(`  ${l.libelle.padEnd(46)} ${signe}${l.montant.toFixed(2)} €`);
    });
    console.log("─".repeat(60));
    console.log(`   PRIX HT  : ${result.prix_ht.toFixed(2)} €`);
    console.log(`   TVA 10%  : ${result.tva.toFixed(2)} €`);
    console.log(`   PRIX TTC : ${result.prix_ttc.toFixed(2)} €`);
  } catch (e) {
    console.log(`   ERREUR ATTENDUE : ${e.message}`);
  }
}

// ── CAS 1 : Demande simple complète ──────────────────────
afficher_devis("Cas simple — 100km, 40 passagers, urgence normale, mai", {
  nb_passagers: 40,
  date_depart:  "2025-05-14",
  date_demande: "2025-05-01",
  distance_km:  100,
  aller_retour: false,
  urgence:      "DD_NORMAL",
});

// ── CAS 2 : Aller/retour, basse saison, urgence prioritaire ──
afficher_devis("Aller/retour — 80km, 20 passagers, prioritaire, novembre", {
  nb_passagers: 20,
  date_depart:  "2025-11-10",
  date_demande: "2025-11-09",
  distance_km:  80,
  aller_retour: true,
  urgence:      "DD_PRIORITAIRE",
});

// ── CAS 3 : Grand groupe, très haute saison ───────────────
afficher_devis("Grand groupe — 60 passagers, 150km, juin, avec guide et nuit chauffeur", {
  nb_passagers: 60,
  date_depart:  "2025-06-20",
  date_demande: "2025-06-01",
  distance_km:  150,
  aller_retour: false,
  urgence:      "DD_URGENT",
  options: {
    nb_guides: 1,
    nb_jours: 2,
    nb_nuits_chauffeur: 1,
  }
});

// ── CAS 4 : Distance hors grille (> 180km) ────────────────
afficher_devis("Hors grille — 250km, 30 passagers, mars, 3 mois à l'avance", {
  nb_passagers: 30,
  date_depart:  "2025-03-15",
  date_demande: "2024-12-10",
  distance_km:  250,
  aller_retour: false,
  urgence:      "DD_3MOISETPLUS",
});

// ── CAS 5 : Petit groupe (minibus <=19) ───────────────────
afficher_devis("Petit groupe — 12 passagers, 50km, octobre", {
  nb_passagers: 12,
  date_depart:  "2025-10-05",
  date_demande: "2025-09-20",
  distance_km:  50,
  aller_retour: false,
  urgence:      "DD_NORMAL",
});

// ── CAS LIMITES : Erreurs attendues ───────────────────────
afficher_devis("❌ CAS LIMITE — 0 passager", {
  nb_passagers: 0,
  date_depart:  "2025-05-14",
  date_demande: "2025-05-01",
  distance_km:  100,
  aller_retour: false,
  urgence:      "DD_NORMAL",
});

afficher_devis(" CAS LIMITE — 90 passagers (hors capacité max)", {
  nb_passagers: 90,
  date_depart:  "2025-05-14",
  date_demande: "2025-05-01",
  distance_km:  100,
  aller_retour: false,
  urgence:      "DD_NORMAL",
});

afficher_devis(" CAS LIMITE — Code urgence invalide", {
  nb_passagers: 40,
  date_depart:  "2025-05-14",
  date_demande: "2025-05-01",
  distance_km:  100,
  aller_retour: false,
  urgence:      "SUPER_URGENT",
});

afficher_devis(" CAS LIMITE — Date invalide", {
  nb_passagers: 40,
  date_depart:  "pas-une-date",
  date_demande: "2025-05-01",
  distance_km:  100,
  aller_retour: false,
  urgence:      "DD_NORMAL",
});

afficher_devis(" CAS LIMITE — Paramètre manquant (distance_km absent)", {
  nb_passagers: 40,
  date_depart:  "2025-05-14",
  date_demande: "2025-05-01",
  aller_retour: false,
  urgence:      "DD_NORMAL",
});

console.log("\n" + "═".repeat(60));
console.log(" Tous les tests terminés");
console.log("═".repeat(60));

module.exports = { calculer_devis };
