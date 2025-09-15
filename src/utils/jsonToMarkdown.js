import { fixOrphans } from "./fixOrphans.js";

function jsonToPandocMarkdown(blocks, options = {}) {
  const lang = options.lang || "pl";
  const title = fixOrphans(options.title || "Dokument");
  const subtitle = options.HeaderText || "";
  const footer = options.footer || "";
  const author = options.author || "";

  let md = `---
title: "${title}"
subtitle: "${subtitle}"
footer: "${footer}"
author: "${author}"
lang: "${lang}"
---

`;

  blocks.forEach((block, idx) => {
    switch (block.type) {
      case "heading":
        md += `${"#".repeat(block.level || 1)} ${fixOrphans(block.content)}\n\n`;
        break;
      case "whitespace":
        md += "\n";
        break;
      case "paragraph":
        md += `${fixOrphans(block.content)}\n\n`;
        break;
      case "list":
        if (block.ordered) {
          block.items.forEach((item, i) => {
            md += `${i + 1}. ${fixOrphans(item)}\n`;
          });
        } else {
          block.items.forEach(item => {
            md += `- ${fixOrphans(item)}\n`;
          });
        }
        md += "\n";
        break;
      case "image":
        // Only use the filename, as images are copied to tmpDir
        md += `\n::: {.ObrazWysrodkowany}\n`;
        md += `![${block.alt || ""}](${block.src}){width=${block.width || "150"}}\n\n`;
        md += `*${fixOrphans(block.caption || "")}*\n`;
        md += `:::\n\n`;
        // md += `![${block.alt || "qweqwe"}](${block.src}){.ObrazWysrodkowany width=${block.width}}`;
        // if (block.caption) md += `*${fixOrphans(block.caption)}*\n\n`;
        break;
      case "table":
        md += block.headers.join(" | ") + "\n";
        md += block.headers.map(() => "---").join(" | ") + "\n";
        block.rows.forEach(row => {
          md += row.join(" | ") + "\n";
        });
        md += "\n";
        if (block.caption) md += `*${fixOrphans(block.caption)}*\n\n`;
        if (block["caption-bottom"]) md += `_${fixOrphans(block["caption-bottom"])}_\n\n`;
        break;
      case "quote":
        md += `> ${fixOrphans(block.content)}\n`;
        if (block.cite) md += `> — ${fixOrphans(block.cite)}\n`;
        md += "\n";
        break;
      default:
        break;
    }
  });

  return md;
}

export { jsonToPandocMarkdown };