# Project Context

Project Name

R8ESTATE

Product

B2B SaaS

Industry

Real Estate

Target Users

Real estate agents.

Goal

Build trust between buyers and sellers using verified trust cards.

Current Scope

MVP

Included

Landing Page (Completed)

Authentication (Completed)

Onboarding Flow (Completed)

Dashboard (Completed)

Trust Card (Completed)

Verification

Excluded

Payments

Messaging

CRM

Property Listings

Style

Modern

Minimal

Professional

Clean

Premium

Personality

Trust

Security

Transparency

Primary Color

Blue

Typography

Inter

Responsive

Desktop

Tablet

Mobile

---

## Phase 1 Incremental Refactoring

**Status**: Completed

- **Large component decomposition**: Split God Components into single-responsibility components without folder restructuring.
- **Password logic extraction**: Split validation logic to `/lib` and UI to `/components/auth`.
- **Trust Card decomposition**: Splitted `trust-card-preview.tsx` into avatar, header, highlights, and socials.
- **Wizard decomposition**: Splitted `wizard-steps.tsx` into individual step files.
- **Architectural Strategy**: Feature-First restructuring deferred to Phase 2 (post-MVP).

## Goal-Based Dashboard

**Status**: Completed

- **Goal-driven layout**: The dashboard renders a unique data set and content configuration per agent goal (More Leads, More Authority, More Referrals).
- **Data layer**: Each goal config lives in `data/goals/` as an isolated file exporting a `GoalConfig` object. A `getGoalConfig()` helper resolves the correct config by goal string with fallback.
- **Type system**: All dashboard data shapes are centrally defined in `types/dashboard.ts` (`GoalConfig`, `GoalProgress`, `Recommendation`, `FunnelStep`, etc.).
- **Component architecture**: The dashboard is composed of focused single-responsibility components in `components/dashboard/shared/`: `GoalSummary`, `PerformanceInsights`, `ConversionFunnel`, `AnalyticsCharts`, `SmartRecommendations`, `RecentActivity`, `QuickActions`.
- **Dynamic loading**: `GoalDashboard` is loaded via `next/dynamic` in `app/dashboard/page.tsx` to avoid SSR issues and improve initial page load.

## Sidebar Navigation & UX Consistency Cleanup
**Status**: Completed
- **Sidebar IA**: Restructured navigation to 4 main tabs (Overview, Trust Card, Verification, Settings). Other tabs act as title-only placeholders for now.
- **Settings Toggle**: Sidebar bottom changes dynamically from Trust Score to Support & Logout links when Settings is active.
- **Decision-Oriented Dashboard**: Executive Performance Insights simplified to 2 highly actionable observation cards; Funnel displays sequential conversion rate text bridges between steps with visual connector lines removed; Goal Status is nested inside Recommendations as an action-oriented coach lead-in; standalone Goal Progress widget removed.
- **Visual Audit Fixes**: Standardized border-radius (cards use `rounded-xl`, pills use `rounded-md`), card header bottom padding (`pb-4 border-b border-slate-100`), consistent card shadows (`shadow-sm border-slate-200`), card subtitle spacing (`mt-1`), and cleaned up icon sizing.
- **Code Registry Pattern**: Decentralized goal configuration switches by establishing `data/goals/index.ts` as a registry, cleaning up page routing dependencies.
- **Type-Safe Refactoring**: Tightened props and data shapes (such as `Recommendation.impact` strictly using `"High" | "Medium" | "Low"`). Removed unused components (`goal-progress.tsx`, `more-leads-dashboard.tsx`) and functions (`conversionLabel`).
