import { fixOrphans} from "../fixOrphans.js";

export function renderQuote(block) {
    return `<blockquote style="margin: 10px 20px; padding: 10px; border-left: 3px solid #888; background-color: #f9f9f9;">
        <p style="text-align: justify; margin: 0;">${fixOrphans(block.content)}</p>
        ${block.cite ? `<cite style="display: block; text-align: right; font-style: italic; margin-top: 4px;">${fixOrphans(block.cite)}</cite>` : ""}
    </blockquote>`;
}