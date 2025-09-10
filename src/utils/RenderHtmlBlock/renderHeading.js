import { fixOrphans} from "../fixOrphans.js";

/**
 * Ensures heading level is between 1 and 3.
 * @param {number} level
 * @returns {number}
 */
export function sanitizeHeadingLevel(level) {
    if (level < 1) return 1;
    if (level > 3) return 3;
    return level;
}

export function renderHeading(block, idx, toc) {
    const level = sanitizeHeadingLevel(block.level);
    const id = `heading-${idx}`;
    const text = fixOrphans(block.content);
    const fontSizes = {
        1: "24pt",
        2: "20pt",
        3: "18pt",
        // Headings levels 4-6 are unnecessary ~W.Polar
        // 4: "16pt",
        // 5: "14pt",
        // 6: "12pt"
    };
    toc.push({ id, text, level });
    return `<h${level} id="${id}" style="font-size: ${fontSizes[level]}; margin: 8pt 0;">${text}</h${level}>`;
}