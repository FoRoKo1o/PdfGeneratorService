import { fixOrphans } from "../fixOrphans.js";

export function generateTable(block) {
  let md = block.headers.join(" | ") + "\n";
  md += block.headers.map(() => "---").join(" | ") + "\n";
  block.rows.forEach(row => {
    md += row.join(" | ") + "\n";
  });
  md += "\n";
  if (block.caption) md += `*${fixOrphans(block.caption)}*\n\n`;
  if (block["caption-bottom"]) md += `_${fixOrphans(block["caption-bottom"])}_\n\n`;
  return md;
}
