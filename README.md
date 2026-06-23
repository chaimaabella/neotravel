# NeoTravel

Prototype d'automatisation du processus commercial de NeoTravel :
captation du lead, qualification, calcul de devis, envoi et relances automatiques.

Projet réalisé dans le cadre du MSc 1 Epitech — 1 semaine, équipe de 5.

---

## Stack

| Brique                 | Outil                                   |
| ---------------------- | --------------------------------------- |
| Front / Chatbot        | Next.js + Vercel                        |
| Orchestration agent IA | n8n Cloud                               |
| Calcul devis           | `calculer_devis()` — nœud Code n8n (JS) |
| Génération PDF         | Nœud n8n HTML→PDF                       |
| Base de données & CRM  | Airtable                                |
| Dashboard pilotage     | Airtable Interface                      |
| Relances automatiques  | Schedule Trigger n8n + SMTP             |

---

## Prérequis

- [Node.js](https://nodejs.org) v18 ou supérieur
- Un compte [n8n Cloud](https://n8n.io) (gratuit)
- Un compte [Airtable](https://airtable.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit) pour le déploiement

---

## Lancer le projet en local

1. Cloner le repo et installer les dépendances :

```bash
git clone https://github.com/ton-compte/neotravel.git
cd neotravel
npm install
```

2. Copier le fichier d'environnement et remplir les variables :

```bash
cp .env.example .env.local
```

3. Lancer le serveur de développement :

```bash
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

| Variable              | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `N8N_WEBHOOK_URL`     | URL du webhook n8n qui reçoit les messages du chat      |
| `NEXT_PUBLIC_APP_URL` | URL publique du site (ex: https://neotravel.vercel.app) |

---

## Structure du projet

```
neotravel/
├── app/                  # Pages Next.js (App Router)
│   ├── page.tsx          # Landing page prospect
│   └── api/chat/         # Route API → webhook n8n
├── components/           # Composants React (ChatBox, etc.)
├── lib/                  # Code métier (calculer_devis.ts + tests)
├── n8n-exports/          # Workflows n8n exportés (.json)
└── .env.local            # Variables secrètes (jamais sur Git)
```

---

## Architecture

L'agent IA vit dans n8n. Le front Next.js envoie les messages via webhook.
Le calcul du prix ne transite jamais par le LLM — uniquement par `calculer_devis()`.

```
Chatbot (Next.js)
      ↓ webhook
Agent IA (n8n)
      ↓
calculer_devis() · PDF · Airtable CRM · Relances
      ↓
Dashboard Airtable
```

---

## Équipe

Projet réalisé par [Chaimaa], [Ivan], [Julie], [Leaticia], [Suzanne].
