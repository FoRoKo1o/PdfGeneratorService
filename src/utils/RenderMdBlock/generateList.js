import { fixOrphans } from "../fixOrphans.js";

export function generateList(block) {
  let md = '';
  if (block.ordered) {
    block.items.forEach((item, i) => {
      md += `${i + 1}. ${fixOrphans(item)}\n`;
    });
  } else {
    block.items.forEach(item => {
      md += `- ${fixOrphans(item)}\n`;
    });
  }
  return md + '\n';
}
