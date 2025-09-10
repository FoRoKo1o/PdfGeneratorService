import { fixOrphans} from "../fixOrphans.js";

export function renderParagraph(block) {
    return `<p style="text-align: justify;">${fixOrphans(block.content)}</p>`;
}