import { fixOrphans} from "../fixOrphans.js";

export function renderTable(block) {
    let html = `<div style="text-align: center;">
            <table style="CustomTableStyle" role="table" aria-label="${block.caption || "Tabela"}" 
                   style="border-collapse: collapse; border: 1px solid black; display: inline-table;">`;
    if (block.caption) html += `<caption>${fixOrphans(block.caption)}</caption>`;
    html += "<thead><tr>";
    block.headers.forEach(h => {
        html += `<th style="border: 1px solid black; padding: 4px;">${fixOrphans(h)}</th>`;
    });
    html += "</tr></thead>";
    html += "<tbody>";
    block.rows.forEach(row => {
        html += "<tr>";
        row.forEach(cell => {
            html += `<td style="border: 1px solid black; padding: 4px;">${fixOrphans(cell)}</td>`;
        });
        html += "</tr>";
    });
    html += "</tbody></table></div>";
    if (block["caption-bottom"]) {
        html += `<p style="text-align: center; margin-top: 4px;"><em>${fixOrphans(block["caption-bottom"])}</em></p>`;
    }
    return html;
}