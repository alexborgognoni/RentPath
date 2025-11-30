import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
    return (
        <SonnerToaster
            position="bottom-right"
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: 'flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg',
                    title: 'text-sm font-medium text-foreground',
                    description: 'text-sm text-muted-foreground',
                    success: 'border-emerald-500/30 bg-emerald-500/10',
                    error: 'border-destructive/30 bg-destructive/10',
                    info: 'border-primary/30 bg-primary/10',
                },
            }}
        />
    );
}

export { toast } from 'sonner';
