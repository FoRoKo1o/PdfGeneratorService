import { fixOrphans } from "../fixOrphans.js";

export function generateImage(block) {
  return `![${block.alt || ''}](${block.src}){width=${block.width || '150'}}\n\n` +
    `*${fixOrphans(block.caption || '')}*\n\n`;
}
