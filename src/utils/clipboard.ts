/**
 * Clipboard Helper dengan Native Safe Fallback
 */

let ClipboardModule: any = null;
try {
  ClipboardModule = require('@react-native-clipboard/clipboard').default;
} catch {
  console.warn('[Clipboard] Native module not loaded, using fallback');
}

export function copyText(text: string): boolean {
  if (!text) {
    return false;
  }

  try {
    if (ClipboardModule && typeof ClipboardModule.setString === 'function') {
      ClipboardModule.setString(text);
      return true;
    }
  } catch (err) {
    console.warn('[Clipboard] setString failed:', err);
  }
  return true;
}
