interface OptionalBadgeProps {
    label?: string;
}

export function OptionalBadge({ label = 'Optional' }: OptionalBadgeProps) {
    return <span className="rounded bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">{label}</span>;
}
