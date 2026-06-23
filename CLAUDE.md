# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NeoTravel is a sales automation prototype for a travel agency: lead capture via chatbot, qualification, quote calculation, PDF generation, and automated follow-ups. Built as a MSc 1 Epitech project (5-person team, 1 week).

The AI agent lives in **n8n Cloud**, not in this codebase. This Next.js app is the prospect-facing frontend (chatbot + landing page) that communicates with n8n via webhook. Quote calculation (`calculer_devis()`) runs server-side in n8n — it never goes through the LLM.

## Commands

```bash
npm run dev      # Dev server on http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

No test framework is configured yet.

## Architecture

```
Chatbot (Next.js) → webhook → Agent IA (n8n) → calculer_devis() / PDF / Airtable CRM / Relances
```

- **Frontend**: Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript (strict)
- **Styling**: Tailwind via `@tailwindcss/postcss` plugin; CSS variables for theme colors in `app/globals.css`; Geist font loaded in `app/layout.tsx`
- **Backend orchestration**: n8n Cloud (workflows exported in `n8n-exports/`)
- **Data**: Airtable (CRM + dashboard)
- **Deployment**: Vercel

## Key Conventions

- Path alias: `@/*` maps to project root (tsconfig paths)
- App Router only — all pages/layouts under `app/`
- Environment variables: `N8N_WEBHOOK_URL` (webhook endpoint), `NEXT_PUBLIC_APP_URL` (public site URL). Stored in `.env.local` (gitignored).
