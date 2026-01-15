/**
 * Component Size Scale
 *
 * Standard size variants for UI components based on 8px grid system.
 * All interactive components should support these three sizes for consistency.
 *
 * | Size | Height | Use Case                          |
 * |------|--------|-----------------------------------|
 * | sm   | 32px   | Compact UIs, toolbars, dense data |
 * | md   | 36px   | Default forms, buttons (DEFAULT)  |
 * | lg   | 44px   | Hero CTAs, touch-friendly targets |
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Icon-only button sizes
 * Square buttons that contain only an icon (e.g., close buttons, toggles)
 */
export type IconButtonSize = 'icon-sm' | 'icon-md' | 'icon-lg';

/**
 * Combined size type for components that support both text and icon-only variants
 */
export type ButtonSize = ComponentSize | IconButtonSize;

/**
 * Pre-defined Tailwind class combinations for each component size.
 * These ensure consistent sizing across the application.
 *
 * Usage:
 * ```tsx
 * import { sizeClasses } from '@/types/sizes';
 * <button className={sizeClasses.button.md}>Click me</button>
 * ```
 */
export const sizeClasses = {
    /**
     * Button size classes
     * - Height, padding, text size, and icon gap are all coordinated
     * - Icon sizes are set via [&_svg] selector
     */
    button: {
        sm: 'h-8 px-3 py-1.5 text-sm gap-1.5 [&_svg]:size-3.5',
        md: 'h-9 px-4 py-2 text-sm gap-2 [&_svg]:size-4',
        lg: 'h-11 px-6 py-2.5 text-base gap-2 [&_svg]:size-5',
        'icon-sm': 'size-8 p-0 [&_svg]:size-4',
        'icon-md': 'size-9 p-0 [&_svg]:size-4',
        'icon-lg': 'size-11 p-0 [&_svg]:size-5',
    },

    /**
     * Input/form field size classes
     * - Heights match button heights for alignment
     * - Padding is consistent, only height varies
     */
    input: {
        sm: 'h-8 px-3 py-1.5 text-sm',
        md: 'h-9 px-3 py-2 text-sm',
        lg: 'h-11 px-4 py-2.5 text-base',
    },

    /**
     * Select/dropdown size classes
     */
    select: {
        sm: 'h-8 px-3 py-1.5 text-sm',
        md: 'h-9 px-3 py-2 text-sm',
        lg: 'h-11 px-4 py-2.5 text-base',
    },

    /**
     * Badge size classes
     * - Only sm and md are typically needed for badges
     */
    badge: {
        sm: 'px-1.5 py-0.5 text-xs gap-1 [&_svg]:size-3',
        md: 'px-2 py-0.5 text-xs gap-1.5 [&_svg]:size-3.5',
    },

    /**
     * Avatar size classes
     */
    avatar: {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-12',
    },

    /**
     * Icon size classes (standalone icons)
     * Pairs with text sizes:
     * - xs: text-xs
     * - sm: text-sm (default)
     * - md: text-base
     * - lg: text-lg
     */
    icon: {
        xs: 'size-3',
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6',
    },

    /**
     * Icon container classes (icon buttons, icon wrappers)
     * For decorative icons in headers, cards, etc.
     */
    iconContainer: {
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-10 [&_svg]:size-5',
        lg: 'size-12 [&_svg]:size-6',
    },
} as const;

/**
 * Typography scale paired with icon sizes
 * Use this to ensure icons match their surrounding text
 *
 * | Text Size  | Icon Size | Tailwind Classes      |
 * |------------|-----------|----------------------|
 * | text-xs    | size-3    | 12px                 |
 * | text-sm    | size-4    | 16px (default)       |
 * | text-base  | size-5    | 20px                 |
 * | text-lg    | size-6    | 24px                 |
 */
export const textIconPairing = {
    xs: { text: 'text-xs', icon: 'size-3' },
    sm: { text: 'text-sm', icon: 'size-4' },
    base: { text: 'text-base', icon: 'size-5' },
    lg: { text: 'text-lg', icon: 'size-6' },
} as const;

/**
 * Container padding scale
 * Use for cards, modals, sections
 */
export const containerPadding = {
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
} as const;

/**
 * Gap/spacing scale for layouts
 */
export const layoutGap = {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
} as const;

/**
 * Default size for most components
 */
export const DEFAULT_SIZE: ComponentSize = 'md';
