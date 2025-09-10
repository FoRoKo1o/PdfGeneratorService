/**
 * Replaces single-letter words with non-breaking spaces (Polish typography).
 * @param {string} text
 * @returns {string}
 */
export function fixOrphans(text) {
    if (!text) return "";
    return text.replace(/\b([aiouwzAIUOWZ])\s+/g, "$1&nbsp;");
}