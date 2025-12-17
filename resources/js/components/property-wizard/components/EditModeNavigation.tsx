import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

interface EditModeNavigationProps {
    sectionTitle: string;
    onCancel: () => void;
    onDone: () => void;
    hasErrors: boolean;
}

export function EditModeNavigation({ sectionTitle, onCancel, onDone, hasErrors }: EditModeNavigationProps) {
    return (
        <div className="flex items-center justify-between rounded-b-2xl border-t border-border bg-card/50 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onCancel} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Overview
                </Button>
                <span className="text-sm text-muted-foreground">Editing: {sectionTitle}</span>
            </div>
            <Button onClick={onDone} disabled={hasErrors} className="gap-2">
                <Check className="h-4 w-4" />
                Done
            </Button>
        </div>
    );
}
