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
- [ ] [backend] Stripe integration setup (webhook handlers, subscription management)
- [ ] [backend] Subscription tiers and feature gating logic
- [ ] [backend] Billing dashboard for property managers (invoices, payment methods, usage)

#### Infrastructure & DevOps
- [ ] [infra] Migrate from AWS root user API key to IAM role
- [ ] [infra] Pre-commit hooks with lint-staged (PHP + JS unified)
- [ ] [devops] PHP formatting/linting scripts
- [ ] [devops] Verify localhost subdomain routing works without /etc/hosts modification (update docs if needed)
- [ ] [devops] Create setup script for local subdomain configuration
- [ ] [devops] Laravel Sail setup for local mail testing and service isolation
- [ ] [tests] Increase test coverage for core features (properties, applications, tokens)

#### UX & Core Features
- [ ] [frontend] Tenant-side authenticated user menu
- [ ] [frontend] Tenant-side navigation flow
- [ ] [frontend] Contact page "submit request" functionality
- [ ] [feature] Property status transitions UI (manager-side)

#### Polish & Refinements
- [ ] [refactor] Frontend architecture cleanup
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
- [ ] [frontend] Toast notification system (replaces browser alerts) - ~4h
- [ ] [frontend] Loading skeletons for property listings and dashboard - ~5h
- [ ] [security] Rate limiting on public endpoints - ~3h
- [ ] [feature] Property search/filtering (basic: location, price, bedrooms) - ~15h

### Medium Value
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
- [ ] [ux] "Report Bug" button - ~2h
- [ ] [frontend] Tenant-side authenticated user menu polish - ~3h
- [ ] [config] Fix tsconfig build file exclusion - ~2h

---

## 🟪 Done
- [x] [feature] Invite token management system with custom links ✅ *(2025-11-10)*
- [x] [feature] Application access control (requires_invite flag) ✅ *(2025-11-10)*
- [x] [i18n] Fix translation types ✅
- [x] [infra] AWS CodePipeline deployment (V1 migration) ✅
- [x] [infra] AWS infrastructure cost optimization (~60% reduction) ✅
- [x] [infra] CloudFront domain configuration ✅
- [x] [infra] Terraform state migration to S3 ✅
- [x] [infra] AWS account email migration + GCP account removal ✅

---
