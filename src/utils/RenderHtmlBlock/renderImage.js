import { fixOrphans} from "../fixOrphans.js";

/**
 * Renders an image block as HTML.
 * @param {Object} block - The image block, while image is base64 encoded.
 * @returns {string} The HTML representation of the image block.
 */
export function renderImage(block) {
    const width = block.width ? block.width : 100;
    const height = block.height ? block.height : "auto";
    return `<div style="text-align: center; margin: 10px 0;">
        <div style="display: block;">
            <img src="${block.src}" alt="${block.alt || ""}" width="${width}" ${height !== "auto" ? `height="${height}"` : ""} style="display: block; margin: 0 auto;">
        </div>
        ${block.caption ? `<div style="text-align: center; font-size: 0.9em; margin-top: 4px;">${fixOrphans(block.caption)}</div>` : ""}
    </div>`;
}