import { fixOrphans } from "../fixOrphans.js";

export function generateHeading(block) {
  return `${"#".repeat(block.level || 1)} ${fixOrphans(block.content)}\n\n`;
}
