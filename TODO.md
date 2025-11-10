# 🗂️ RentPath Project Kanban

> Tracking development progress for the rental property management platform.

---

## 🟩 To Do

### 🚀 Next Sprint (High Priority)
- [ ] [feature] Property manager profile creation flow refinements and validation logic
- [ ] [feature] Tenant profile creation page (personal info, employment, documents, preferences)
- [ ] [feature] Profile verification system (admin review, approval/rejection workflow)
- [ ] [feature] Tenant application form page (references profile, add property-specific details)
- [ ] [feature] Application submission and draft save functionality
- [ ] [feature] Email-restricted invite link validation (tenant-side)
- [ ] [feature] Manager application review dashboard (list, filter by status)
- [ ] [feature] Manager application detail page with actions (approve, reject, schedule visit)
- [ ] [feature] Application status workflow (draft → submitted → under_review → visit_scheduled → approved/rejected → leased)
- [ ] [backend] Email notifications (application submitted, status changes, visit scheduled)

### Core Features
- [ ] [feature] Property search/filtering for tenants (location, price range, bedrooms, type)
- [ ] [feature] Document upload management UI (view, download, delete)
- [ ] [feature] Property status transitions UI (manager-side)
- [ ] [feature] Property image bulk management (reorder, delete individual, set main image)
- [ ] [backend] Rich text editor for property descriptions
- [ ] [backend] Property type-specific validation rules

### Infrastructure & DevOps
- [ ] [infra] Migrate from AWS root user API key to IAM role
- [ ] [infra] Pre-commit hooks with lint-staged (PHP + JS unified)
- [ ] [devops] PHP formatting/linting scripts
- [ ] [devops] Verify localhost subdomain routing works without /etc/hosts modification (update docs if needed)
- [ ] [devops] Create setup script for local subdomain configuration
- [ ] [devops] Laravel Sail setup for local mail testing and service isolation
- [ ] [tests] Increase test coverage for core features (properties, applications, tokens)

### Security & Data Integrity
- [ ] [security] Rate limiting on public endpoints (property views, contact form)
- [ ] [security] CRITICAL - UUID primary keys instead of auto-increment IDs
- [ ] [backend] Soft deletes for properties and applications (audit trail)

### UX & Polish
- [ ] [frontend] Custom 404, 403, 500 error pages
- [ ] [frontend] Tenant-side authenticated user menu
- [ ] [frontend] Tenant-side navigation flow
- [ ] [frontend] Auth-gated "Apply Now" button (login prompt when unauthenticated)
- [ ] [frontend] Contact page "submit request" functionality
- [ ] [frontend] Loading states and skeleton loaders (property listings, dashboard)
- [ ] [frontend] Toast notifications for user actions (saved, deleted, error states)
- [ ] [frontend] Mobile responsive audit and fixes
- [ ] [ux] "Report Bug" button
- [ ] [config] Fix tsconfig to exclude build files from type checking

### Monetization (Medium Priority)
- [ ] [business] Finalize pricing model and tier structure
- [ ] [frontend] Pricing page design and implementation
- [ ] [frontend] Landing page updates (pricing link, CTA adjustments, visual tweaks)
- [ ] [backend] Stripe integration setup (webhook handlers, subscription management)
- [ ] [backend] Subscription tiers and feature gating logic
- [ ] [backend] Billing dashboard for property managers (invoices, payment methods, usage)

### Polish & Refinements (After Core Features)
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
