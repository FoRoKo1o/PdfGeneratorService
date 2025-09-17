import { fixOrphans } from "../fixOrphans.js";

export function generateQuote(block) {
  let md = `> ${fixOrphans(block.content)}\n`;
  if (block.cite) md += `> — ${fixOrphans(block.cite)}\n`;
  return md + "\n";
}
