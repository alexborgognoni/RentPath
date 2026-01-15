# Sizing Standardization Implementation Plan

> **Status: COMPLETED** - All phases implemented January 2026

## Executive Summary

RentPath has excellent design token infrastructure but only ~35% compliance. This plan standardizes sizing across all 140+ frontend files using a phased approach.

## Completion Summary

| Phase                       | Status      | Key Deliverables                         |
| --------------------------- | ----------- | ---------------------------------------- |
| Phase 1: Foundation         | ✅ Complete | Size tokens in app.css, TypeScript types |
| Phase 2: UI Components      | ✅ Complete | 10 components updated with size variants |
| Phase 3: Feature Components | ✅ Complete | 20+ arbitrary values fixed               |
| Phase 4: Documentation      | ✅ Complete | Sizing guide, dev reference component    |

---

## Phase 1: Foundation (Week 1)

### 1.1 Define Component Size Scale in app.css

Add to `@theme` block in `resources/css/app.css`:

```css
@theme {
    /* Component Size Scale - 3 sizes only */

    /* Heights - 8px grid aligned */
    --height-sm: 2rem; /* 32px - compact */
    --height-md: 2.25rem; /* 36px - default */
    --height-lg: 2.75rem; /* 44px - touch-friendly */

    /* Icon sizes - paired with text */
    --icon-xs: 0.75rem; /* 12px - with text-xs */
    --icon-sm: 1rem; /* 16px - with text-sm (DEFAULT) */
    --icon-md: 1.25rem; /* 20px - with text-base */
    --icon-lg: 1.5rem; /* 24px - with text-lg */

    /* Button padding */
    --button-padding-x-sm: var(--space-3); /* 12px */
    --button-padding-x-md: var(--space-4); /* 16px */
    --button-padding-x-lg: var(--space-6); /* 24px */
    --button-padding-y-sm: var(--space-1-5); /* 6px */
    --button-padding-y-md: var(--space-2); /* 8px */
    --button-padding-y-lg: var(--space-2-5); /* 10px */

    /* Input padding */
    --input-padding-x: var(--space-3); /* 12px */
    --input-padding-y: var(--space-2); /* 8px */

    /* Card/container padding */
    --container-padding-sm: var(--space-4); /* 16px */
    --container-padding-md: var(--space-5); /* 20px */
    --container-padding-lg: var(--space-6); /* 24px */

    /* Section gaps */
    --section-gap-sm: var(--space-4); /* 16px */
    --section-gap-md: var(--space-6); /* 24px */
    --section-gap-lg: var(--space-8); /* 32px */

    /* Border radius - semantic */
    --radius-button: var(--radius-lg); /* 0.625rem */
    --radius-card: var(--radius-xl); /* 0.75rem */
    --radius-input: var(--radius-md); /* 0.5rem */
    --radius-badge: var(--radius-md); /* 0.5rem */
    --radius-modal: var(--radius-xl); /* 0.75rem */
}
```

### 1.2 Create Size Variant Types

Create `resources/js/types/sizes.ts`:

```typescript
export type ComponentSize = 'sm' | 'md' | 'lg';

export const sizeClasses = {
    button: {
        sm: 'h-8 px-3 py-1.5 text-sm gap-1.5',
        md: 'h-9 px-4 py-2 text-sm gap-2',
        lg: 'h-11 px-6 py-2.5 text-base gap-2',
    },
    input: {
        sm: 'h-8 px-3 py-1.5 text-sm',
        md: 'h-9 px-3 py-2 text-sm',
        lg: 'h-11 px-4 py-2.5 text-base',
    },
    icon: {
        sm: 'size-3', // 12px
        md: 'size-4', // 16px (default)
        lg: 'size-5', // 20px
    },
    iconButton: {
        sm: 'size-8', // 32px
        md: 'size-9', // 36px
        lg: 'size-11', // 44px
    },
} as const;
```

---

## Phase 2: UI Components (Week 2)

### 2.1 Update Button Component

**File:** `resources/js/components/ui/button.tsx`

**Changes:**

- Standardize all sizes to use new tokens
- Fix icon sizing per button size
- Add compound variants for icon buttons

```typescript
const buttonVariants = cva(
    'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    {
        variants: {
            variant: {
                /* existing */
            },
            size: {
                sm: 'h-8 px-3 py-1.5 text-sm gap-1.5 [&_svg]:size-3.5',
                md: 'h-9 px-4 py-2 text-sm gap-2 [&_svg]:size-4',
                lg: 'h-11 px-6 py-2.5 text-base gap-2 [&_svg]:size-5',
                icon_sm: 'size-8 p-0 [&_svg]:size-4',
                icon_md: 'size-9 p-0 [&_svg]:size-4',
                icon_lg: 'size-11 p-0 [&_svg]:size-5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);
```

### 2.2 Update Input Component

**File:** `resources/js/components/ui/input.tsx`

**Changes:**

- Add size variants matching button heights
- Standardize padding

```typescript
const inputVariants = cva(
    'flex w-full rounded-md border border-input bg-transparent text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            size: {
                sm: 'h-8 px-3 py-1.5 text-sm',
                md: 'h-9 px-3 py-2 text-sm',
                lg: 'h-11 px-4 py-2.5 text-base',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
);
```

### 2.3 Components to Update

| Component      | Current Issues                      | Target State                 |
| -------------- | ----------------------------------- | ---------------------------- |
| `button.tsx`   | Icon sizing not tied to button size | Add `icon_sm/md/lg` variants |
| `input.tsx`    | No size variants                    | Add `sm/md/lg` variants      |
| `textarea.tsx` | Hardcoded `min-h-[80px]`            | Use `min-h-20` (Tailwind)    |
| `select.tsx`   | Mixed compact/normal modes          | Align to `sm/md/lg`          |
| `checkbox.tsx` | `rounded-[4px]` hardcoded           | Use `rounded-sm`             |
| `badge.tsx`    | No size variants                    | Add `sm/md` variants         |
| `avatar.tsx`   | Single `size-8`                     | Add `sm/md/lg` variants      |
| `card.tsx`     | Not using `--card-padding`          | Reference CSS var            |
| `dialog.tsx`   | Different padding than Sheet        | Standardize to `p-6`         |
| `sheet.tsx`    | Different padding than Dialog       | Standardize to `p-6`         |

---

## Phase 3: Feature Components (Week 3)

### 3.1 Fix Arbitrary Values

**51 files with arbitrary bracket syntax to fix:**

| Pattern              | Count | Replacement               |
| -------------------- | ----- | ------------------------- |
| `w-[480px]`          | 3     | `w-[30rem]` or `max-w-lg` |
| `h-[80px]`           | 2     | `h-20`                    |
| `min-h-[80px]`       | 1     | `min-h-20`                |
| `translate-x-[18px]` | 1     | Keep (switch animation)   |
| `rounded-[4px]`      | 1     | `rounded-sm`              |

### 3.2 Standardize Page Layouts

**Files to update:**

- `layouts/manager-layout.tsx` - Replace `256` and `64` with `w-64` and `w-16`
- `layouts/tenant-layout.tsx` - Already good
- `layouts/base-layout.tsx` - Already good

### 3.3 Standardize Section Headers

Create consistent pattern across all wizard steps and dashboard sections:

```typescript
// Standardized section header pattern
<div className="flex items-center gap-3 mb-6">
    <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
        <Icon className="size-5 text-muted-foreground" />
    </div>
    <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
</div>
```

---

## Phase 4: Documentation & Enforcement (Week 4)

### 4.1 Create Size Reference Component

Create `resources/js/components/dev/size-reference.tsx` showing all size variants visually.

### 4.2 Add ESLint Rules

Install and configure `eslint-plugin-tailwindcss`:

```json
{
    "rules": {
        "tailwindcss/no-arbitrary-value": "warn",
        "tailwindcss/enforces-shorthand": "error"
    }
}
```

### 4.3 Update Documentation

- Add sizing guide to `/docs/patterns/sizing.md`
- Update component documentation with size examples
- Add Storybook stories showing all size variants

---

## Size Reference Table

### Component Heights (8px grid)

| Size | Height        | Use Case                       |
| ---- | ------------- | ------------------------------ |
| `sm` | 32px (`h-8`)  | Compact toolbars, dense tables |
| `md` | 36px (`h-9`)  | Default forms, buttons         |
| `lg` | 44px (`h-11`) | Hero CTAs, touch targets       |

### Icon Sizes

| Size | Dimension       | Pair With                  |
| ---- | --------------- | -------------------------- |
| `xs` | 12px (`size-3`) | `text-xs`, badges          |
| `sm` | 16px (`size-4`) | `text-sm`, default buttons |
| `md` | 20px (`size-5`) | `text-base`, large buttons |
| `lg` | 24px (`size-6`) | `text-lg`, headers         |

### Spacing Scale (Semantic)

| Token   | Value | Use                             |
| ------- | ----- | ------------------------------- |
| `gap-2` | 8px   | Tight grouping (buttons in row) |
| `gap-3` | 12px  | Form field spacing              |
| `gap-4` | 16px  | Card content spacing            |
| `gap-6` | 24px  | Section spacing                 |
| `gap-8` | 32px  | Major section breaks            |

### Container Padding

| Context   | Padding                   | Class          |
| --------- | ------------------------- | -------------- |
| Badge     | 8px × 4px                 | `px-2 py-0.5`  |
| Button sm | 12px × 6px                | `px-3 py-1.5`  |
| Button md | 16px × 8px                | `px-4 py-2`    |
| Card      | 24px                      | `p-6`          |
| Modal     | 24px                      | `p-6`          |
| Page      | 16px mobile, 24px desktop | `px-4 sm:px-6` |

---

## Files to Modify (Priority Order)

### High Priority (Breaking Inconsistencies)

1. `resources/css/app.css` - Add size tokens
2. `resources/js/components/ui/button.tsx` - Add size variants
3. `resources/js/components/ui/input.tsx` - Add size variants
4. `resources/js/components/ui/checkbox.tsx` - Fix `rounded-[4px]`
5. `resources/js/layouts/manager-layout.tsx` - Fix hardcoded pixels

### Medium Priority (Visual Consistency)

6. `resources/js/components/ui/select.tsx` - Align sizes
7. `resources/js/components/ui/badge.tsx` - Add size variants
8. `resources/js/components/ui/avatar.tsx` - Add size variants
9. `resources/js/components/ui/dialog.tsx` - Standardize padding
10. `resources/js/components/ui/sheet.tsx` - Match dialog padding

### Lower Priority (Polish)

11-20. Wizard step components - Use consistent section patterns
21-30. Dashboard components - Standardize card layouts
31+. Feature components - Replace arbitrary values

---

## Success Metrics

| Metric                        | Before | After            | Status |
| ----------------------------- | ------ | ---------------- | ------ |
| Arbitrary bracket values      | 51     | ~5 (intentional) | ✅     |
| Components with size variants | 2      | 10+              | ✅     |
| Token compliance (spacing)    | ~35%   | 90%+             | ✅     |
| Consistent icon sizing        | 60%    | 95%+             | ✅     |
| Documentation                 | None   | Complete guide   | ✅     |

---

## Estimated Effort

| Phase                       | Duration        | Files Changed |
| --------------------------- | --------------- | ------------- |
| Phase 1: Foundation         | 2-3 hours       | 2 files       |
| Phase 2: UI Components      | 4-6 hours       | 12 files      |
| Phase 3: Feature Components | 8-12 hours      | 40+ files     |
| Phase 4: Documentation      | 2-3 hours       | 5 files       |
| **Total**                   | **16-24 hours** | **60+ files** |

---

## References

- [Size in Design Systems - EightShapes](https://medium.com/eightshapes-llc/size-in-design-systems-64f234aec519)
- [shadcn/ui Button Implementation](https://ui.shadcn.com/docs/components/button)
- [CVA Documentation](https://cva.style/docs)
- [8-Point Grid System](https://cieden.com/book/sub-atomic/spacing/spacing-best-practices)
