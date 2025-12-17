# 🗂️ RentPath Project Kanban

> Tracking development progress for the rental property management platform.

---

## 🟩 To Do

### 🎯 MVP - Critical Path (~160 hours)

> **Goal**: End-to-end application workflow in 6 weeks. Tenant can apply, manager can review/approve/reject. Launch as free beta to validate product-market fit, add monetization in January based on real user feedback.

#### Phase 1: Profile System (Weeks 1-2, ~45-50h)

- [ ] [feature] Property manager profile creation flow refinements - ~10h
- [ ] [feature] Tenant profile creation page (personal info, employment, documents, preferences) - ~20h
- [ ] [feature] Basic profile verification system (admin review, approve/reject) - ~15h

#### Phase 2: Application Flow (Weeks 2-3, ~45-50h)

- [ ] [feature] Tenant application form page (references profile, property-specific fields) - ~20h
- [ ] [feature] Application submission and draft save functionality - ~10h
- [ ] [feature] Email-restricted invite link validation (tenant-side) - ~12h
- [ ] [backend] Property type-specific validation rules - ~5h

#### Phase 3: Manager Review (Week 4, ~30-35h)

- [ ] [feature] Manager application review dashboard (list, basic filtering) - ~15h
- [ ] [feature] Manager application detail page with actions (approve, reject, schedule visit) - ~15h

#### Phase 4: Workflow & Notifications (Weeks 5-6, ~25-30h)

- [ ] [feature] Application status workflow (draft → submitted → approved/rejected) - ~10h
- [ ] [backend] Email notifications (application submitted, status changes) - ~8h
- [ ] [frontend] Auth-gated "Apply Now" button (login prompt when unauthenticated) - ~3h
- [ ] [frontend] Basic 404/500 error pages - ~2h

#### Phase 5: Security & Deploy (Week 6, ~20h)

- [ ] [security] CRITICAL - UUID primary keys instead of auto-increment IDs - ~15h
- [ ] [devops] Production deployment checklist and final testing - ~5h

---

### 📋 Post-MVP (After Launch)

#### Monetization (Highest Priority - January)

- [ ] [business] Finalize pricing model and tier structure based on beta feedback
- [ ] [frontend] Pricing page design and implementation
- [ ] [frontend] Landing page updates (pricing link, CTA adjustments, visual tweaks)
- [ ] [backend] Stripe integration setup (webhook handlers, subscription management, multiple payment methods)
- [ ] [backend] Payment method support (credit card, PayPal, Apple Pay, Google Pay)
- [ ] [backend] Subscription tiers and feature gating logic
- [ ] [backend] Billing dashboard for property managers (invoices, payment methods, usage)

#### Infrastructure & DevOps

- [ ] [infra] Migrate from AWS root user API key to IAM role
- [ ] [devops] Evaluate switching from npm/node to Bun (faster installs, ESLint compat needs @eslint/compat, CodeBuild needs custom image)
- [ ] [infra] Pre-commit hooks with lint-staged (PHP + JS unified)
- [ ] [devops] PHP formatting/linting scripts
- [ ] [devops] Verify localhost subdomain routing works without /etc/hosts modification (update docs if needed)
- [ ] [devops] Create setup script for local subdomain configuration
- [ ] [devops] Laravel Sail setup for local mail testing and service isolation
- [x] [devops] ~~Database testing strategy~~ - Tests now use MySQL via `.env.testing` (local) and GitHub Actions MySQL service (CI). SQLite-specific code removed from migrations. ✅
- [ ] [backend] OAuth integration (Google, Apple, Facebook)
- [ ] [tests] Increase test coverage for core features (properties, applications, tokens)

#### UX & Core Features

- [ ] [frontend] Social login buttons and flow
- [ ] [frontend] Tenant-side authenticated user menu
- [ ] [frontend] Tenant-side navigation flow
- [ ] [frontend] Contact page "submit request" functionality
- [ ] [feature] Admin dashboard (user management, property approval, system stats)
- [ ] [feature] Admin profile verification workflow UI
- [ ] [feature] Property status transitions UI (manager-side)
- [ ] [feature] Address validation with country-specific rules (postal code format, state/canton/province fields)
- [ ] [feature] Revise property type-specific logic across wizard steps
    - [ ] Make amenities/features type-specific (e.g., commercial: reception, meeting rooms; industrial: loading dock, 3-phase power)
    - [ ] Add more amenities per type (currently same 12 amenities for all types)
    - [ ] Consider type-specific validation rules
    - [ ] Review energy step relevance per type
- [ ] [feature] Error reporting and user feedback system
    - [ ] Automatic error detection with global error boundary
    - [ ] "Report Bug" button that captures error context (URL, user action, stack trace)
    - [ ] Database schema for storing bug reports (user_id, error_type, context, status, resolved_at)
    - [ ] Admin dashboard for viewing and managing bug reports
    - [ ] General feedback form (feature requests, suggestions, complaints)
    - [ ] Feedback categories and priority levels
    - [ ] Optional: integrate with external issue tracker (GitHub Issues, Linear, etc.)

#### Notification System

- [ ] [backend] Laravel Events for application lifecycle (ApplicationSubmitted, ApplicationApproved, ApplicationRejected, VisitScheduled, etc.)
- [ ] [backend] Laravel Notifications with database + mail channels
- [ ] [backend] Notification preferences per user (email frequency, notification types)
- [ ] [backend] Email templates with Blade/Markdown (branded, responsive)
- [ ] [backend] Queue-based email sending for performance
- [ ] [frontend] In-app notification center (bell icon, unread count, dropdown list)
- [ ] [frontend] Real-time notifications with Laravel Echo/Pusher (optional)
- [ ] [backend] Property manager notifications (new application, tenant message, visit reminder)
- [ ] [backend] Tenant notifications (application status change, visit scheduled, lease ready)

#### Polish & Refinements

- [ ] [refactor] Frontend architecture cleanup
- [ ] [refactor] Convert frontend to Tweak CSS variable system (brand colors, border radius, font sizes, spacing)
- [ ] [i18n] Full translation coverage beyond landing page
- [ ] [logging] Structured logging front + backend
- [ ] [ux] UX/styling overhaul

---

## 🟨 In Progress

---

## 🟦 Review / Testing

---

## 🟧 Blocked

---

## 🎁 Nice-to-Have (If Time Allows Before Launch)

> These are cut from the critical path to Christmas MVP. Only implement if core features are done early and you have buffer time.

### High Value, Low Effort

- [ ] [frontend] Confirmation modal component (replaces browser confirm dialogs) - ~4h
- [ ] [frontend] Toast notification system (replaces browser alerts) - ~4h
- [ ] [frontend] Loading skeletons for property listings and dashboard - ~5h
- [ ] [security] Rate limiting on public endpoints - ~3h
- [ ] [feature] Property search/filtering (basic: location, price, bedrooms) - ~15h

### Medium Value

- [ ] [feature] Property wizard draft image persistence (upload images immediately, store in DB, re-fetch on resume) - ~8h
- [ ] [backend] Soft deletes for properties and applications - ~3h
- [ ] [feature] Document management UI (view thumbnails, download, delete) - ~12h
- [ ] [feature] Property status transitions UI beyond active/inactive - ~10h
- [ ] [frontend] Custom 404/500 error page designs (beyond basic) - ~3h
- [ ] [feature] Property image bulk management (reorder, set main, delete) - ~8h

### Polish

- [ ] [frontend] Mobile responsive fixes for key flows - ~8h
- [ ] [backend] Rich text editor for property descriptions - ~6h
- [ ] [tests] Automated test coverage for application workflow - ~12h
- [ ] [frontend] Loading states and better error boundaries - ~4h

### Can Wait Until Post-Launch

- [ ] [backend] Email notification templates (make them pretty vs functional) - ~4h
- [ ] [frontend] Tenant-side authenticated user menu polish - ~3h
- [ ] [config] Fix tsconfig build file exclusion - ~2h
- [ ] [i18n] Migrate localization logic to use [laravel-react-i18n](https://github.com/EugeneMeles/laravel-react-i18n) - ~10h

---

## 🟪 Done

- [x] [feature] Invite token management system with custom links ✅ _(2025-11-10)_
- [x] [feature] Application access control (requires*invite flag) ✅ *(2025-11-10)\_
- [x] [i18n] Fix translation types ✅
- [x] [infra] AWS CodePipeline deployment (V1 migration) ✅
- [x] [infra] AWS infrastructure cost optimization (~60% reduction) ✅
- [x] [infra] CloudFront domain configuration ✅
- [x] [infra] Terraform state migration to S3 ✅
- [x] [infra] AWS account email migration + GCP account removal ✅

---
