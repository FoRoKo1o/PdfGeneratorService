import { fixOrphans} from "../fixOrphans.js";

export function renderList(block) {
    let html = block.ordered ? `<ol role="list">` : `<ul role="list">`;
    block.items.forEach(item => {
        html += `<li>${fixOrphans(item)}</li>`;
    });
    html += block.ordered ? `</ol>` : `</ul>`;
    return html;
}