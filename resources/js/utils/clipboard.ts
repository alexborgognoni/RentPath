/**
 * Copy text to clipboard with fallback for non-HTTPS environments
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    // Modern clipboard API (requires HTTPS)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.warn('Clipboard API failed, using fallback:', error);
            return fallbackCopy(text);
        }
    }

    // Fallback for non-HTTPS environments
    return fallbackCopy(text);
}

/**
 * Fallback clipboard copy using execCommand
 */
function fallbackCopy(text: string): boolean {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '0';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (error) {
        console.error('Fallback copy failed:', error);
        document.body.removeChild(textArea);
        return false;
    }
}
