import { useCallback, useEffect, useRef, useState } from 'react';

export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

interface UseAutosaveOptions<T> {
    /** Data to autosave */
    data: T;
    /** Function to perform the save operation */
    onSave: (data: T) => Promise<void>;
    /** Debounce delay in milliseconds (default: 1000ms) */
    debounceMs?: number;
    /** Whether autosave is enabled (default: true) */
    enabled?: boolean;
    /** Callback when save succeeds */
    onSuccess?: () => void;
    /** Callback when save fails */
    onError?: (error: unknown) => void;
}

interface UseAutosaveReturn {
    /** Current save status */
    status: AutosaveStatus;
    /** Last successful save timestamp */
    lastSavedAt: Date | null;
    /** Whether a save is currently in progress */
    isSaving: boolean;
    /** Manually trigger a save (bypasses debounce) */
    saveNow: () => Promise<void>;
    /** Mark data as dirty (triggers debounced save) */
    markDirty: () => void;
}

export function useAutosave<T>({ data, onSave, debounceMs = 1000, enabled = true, onSuccess, onError }: UseAutosaveOptions<T>): UseAutosaveReturn {
    const [status, setStatus] = useState<AutosaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

    // Refs for handling race conditions and cleanup
    const saveInProgressRef = useRef(false);
    const pendingDataRef = useRef<T | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dataRef = useRef(data);
    const initialDataRef = useRef<string | null>(null);

    // Store initial data snapshot on mount
    useEffect(() => {
        if (initialDataRef.current === null) {
            initialDataRef.current = JSON.stringify(data);
        }
    }, []);

    // Keep data ref updated
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    // Perform the actual save
    const performSave = useCallback(
        async (dataToSave: T) => {
            if (saveInProgressRef.current) {
                // Queue this data to be saved after current save completes
                pendingDataRef.current = dataToSave;
                return;
            }

            saveInProgressRef.current = true;
            setStatus('saving');

            try {
                await onSave(dataToSave);
                setLastSavedAt(new Date());
                setStatus('saved');
                onSuccess?.();

                // Check if there's pending data to save
                if (pendingDataRef.current !== null) {
                    const pending = pendingDataRef.current;
                    pendingDataRef.current = null;
                    saveInProgressRef.current = false;
                    await performSave(pending);
                }
            } catch (error) {
                setStatus('error');
                onError?.(error);
            } finally {
                saveInProgressRef.current = false;
            }
        },
        [onSave, onSuccess, onError],
    );

    // Manual save (bypasses debounce)
    const saveNow = useCallback(async () => {
        // Clear any pending debounced save
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        await performSave(dataRef.current);
    }, [performSave]);

    // Mark data as dirty (triggers debounced save)
    const markDirty = useCallback(() => {
        if (!enabled) return;

        setStatus('pending');

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new debounced save
        debounceTimerRef.current = setTimeout(() => {
            performSave(dataRef.current);
        }, debounceMs);
    }, [enabled, debounceMs, performSave]);

    // Auto-trigger save when data changes
    useEffect(() => {
        if (!enabled) return;

        // Skip if this is the initial render or data hasn't changed from initial
        const currentDataStr = JSON.stringify(data);
        if (initialDataRef.current === currentDataStr) {
            return;
        }

        markDirty();
    }, [data, enabled, markDirty]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return {
        status,
        lastSavedAt,
        isSaving: status === 'saving',
        saveNow,
        markDirty,
    };
}
