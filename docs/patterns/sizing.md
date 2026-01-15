# Sizing Standards

Guidelines for consistent component sizing across the RentPath frontend.

## Quick Reference

### Component Heights (8px Grid)

| Size | Height | Tailwind | Use Case                       |
| ---- | ------ | -------- | ------------------------------ |
| `sm` | 32px   | `h-8`    | Compact toolbars, dense tables |
| `md` | 36px   | `h-9`    | Default forms, buttons         |
| `lg` | 44px   | `h-11`   | Hero CTAs, touch targets       |

### Icon Sizes

| Size | Dimension | Tailwind | Pair With                  |
| ---- | --------- | -------- | -------------------------- |
| `xs` | 12px      | `size-3` | `text-xs`, badges          |
| `sm` | 16px      | `size-4` | `text-sm`, default buttons |
| `md` | 20px      | `size-5` | `text-base`, large buttons |
| `lg` | 24px      | `size-6` | `text-lg`, headers         |

### Container Padding

| Context        | Padding     | Class         |
| -------------- | ----------- | ------------- |
| Badge          | 8px × 4px   | `px-2 py-0.5` |
| Button sm      | 12px × 6px  | `px-3 py-1.5` |
| Button md      | 16px × 8px  | `px-4 py-2`   |
| Button lg      | 24px × 10px | `px-6 py-2.5` |
| Card           | 24px        | `p-6`         |
| Modal/Dialog   | 24px        | `p-6`         |
| Sheet          | 24px        | `p-6`         |
| Page (mobile)  | 16px        | `px-4`        |
| Page (desktop) | 24px        | `sm:px-6`     |

## Components with Size Variants

### Button

```tsx
import { Button } from '@/components/ui/button';

// Text buttons
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// Icon-only buttons
<Button size="icon-sm"><Icon /></Button>
<Button size="icon-md"><Icon /></Button>
<Button size="icon-lg"><Icon /></Button>
```

### Input

```tsx
import { Input } from '@/components/ui/input';

<Input size="sm" />  // 32px height
<Input size="md" />  // 36px height (default)
<Input size="lg" />  // 44px height
```

### Textarea

```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea size="sm" />  // Compact
<Textarea size="md" />  // Default
<Textarea size="lg" />  // Large
```

### Select

```tsx
import { Select } from '@/components/ui/select';

<Select size="sm" />  // 32px height
<Select size="md" />  // 36px height (default)
<Select size="lg" />  // 44px height
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge';

<Badge size="sm">Small</Badge>
<Badge size="md">Medium (default)</Badge>

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="muted">Muted</Badge>
```

### Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar size="xs">...</Avatar>  // 24px - Compact lists
<Avatar size="sm">...</Avatar>  // 32px - Navigation
<Avatar size="md">...</Avatar>  // 40px - Cards (default)
<Avatar size="lg">...</Avatar>  // 48px - Profile headers
<Avatar size="xl">...</Avatar>  // 64px - Profile pages
```

## Spacing Scale

Use semantic spacing for consistency:

| Token   | Value | Use                             |
| ------- | ----- | ------------------------------- |
| `gap-2` | 8px   | Tight grouping (buttons in row) |
| `gap-3` | 12px  | Form field spacing              |
| `gap-4` | 16px  | Card content spacing            |
| `gap-6` | 24px  | Section spacing                 |
| `gap-8` | 32px  | Major section breaks            |

## Best Practices

### DO

- Use size variants instead of custom heights
- Pair icon sizes with text sizes (see table above)
- Use Tailwind's standard spacing scale
- Keep buttons and inputs at the same size when inline

```tsx
// Good: Aligned heights
<div className="flex items-center gap-2">
    <Input size="md" />
    <Button size="md">Submit</Button>
</div>
```

### DON'T

- Use arbitrary bracket values for sizes (`h-[37px]`)
- Mix different size scales in the same context
- Use pixel values in inline styles
- Create custom size variants outside the system

```tsx
// Bad: Arbitrary values
<div className="h-[37px] px-[13px]">...</div>

// Good: Standard tokens
<div className="h-9 px-3">...</div>
```

## Allowed Arbitrary Values

Some arbitrary values are acceptable:

| Pattern                   | Reason                      |
| ------------------------- | --------------------------- |
| `ring-[3px]`              | Focus ring standard         |
| `translate-x-[18px]`      | Animation micro-positioning |
| `translate-y-[calc(...)]` | Complex positioning         |
| `min-h-[650px]`           | Layout-specific (carousels) |
| `rounded-[2px]`           | Tooltip arrow styling       |

## Dev Reference Component

A visual reference component is available for development:

```tsx
import { SizeReference } from '@/components/dev/size-reference';

// Render in a dev/storybook context
<SizeReference />;
```

## CSS Variables

Size tokens are defined in `resources/css/app.css`:

```css
@theme {
    /* Component Heights */
    --height-sm: 2rem; /* 32px */
    --height-md: 2.25rem; /* 36px */
    --height-lg: 2.75rem; /* 44px */

    /* Icon Sizes */
    --icon-xs: 0.75rem; /* 12px */
    --icon-sm: 1rem; /* 16px */
    --icon-md: 1.25rem; /* 20px */
    --icon-lg: 1.5rem; /* 24px */
}
```

## Migration Guide

When updating existing code:

1. Replace `h-[Xpx]` with closest Tailwind class
2. Replace `size="icon"` with `size="icon-md"`
3. Replace `size="default"` with `size="md"` (or remove, it's default)
4. Replace `compact` prop with `size="sm"`

| Old             | New        |
| --------------- | ---------- |
| `h-[32px]`      | `h-8`      |
| `h-[36px]`      | `h-9`      |
| `h-[44px]`      | `h-11`     |
| `w-[200px]`     | `w-52`     |
| `min-h-[400px]` | `min-h-96` |
| `max-w-[180px]` | `max-w-44` |
