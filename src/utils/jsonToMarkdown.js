import { fixOrphans } from "./fixOrphans.js";
import { generateImage } from "./RenderMdBlock/generateImage.js";
import { generateList } from "./RenderMdBlock/generateList.js";
import { generateParagraph } from "./RenderMdBlock/generateParagraph.js";
import { generateQuote } from "./RenderMdBlock/generateQuote.js";
import { generateTable } from "./RenderMdBlock/generateTable.js";
import { generateHeading } from "./RenderMdBlock/generateHeading.js";
import { generateLink } from "./RenderMdBlock/generateLink.js";

function jsonToPandocMarkdown(blocks, options = {}) {
  const lang = options.lang || "pl";
  const title = fixOrphans(options.title || "");
  const subtitle = options.subtitle || "";
  const author = options.author || "";

  let md = `---\ntitle: "${title}"\nsubtitle: "${subtitle}"\nauthor: "${author}"\nlang: "${lang}"\n---\n\n`;

  blocks.forEach((block, idx) => {
    const nextBlock = blocks[idx + 1];

    switch (block.type) {
      case "heading":
        md += generateHeading(block);
        break;
      case "whitespace":
        md += "\n";
        break;
      case "paragraph":
        md += generateParagraph(block, nextBlock);
        break;
      case "list":
        md += generateList(block);
        break;
      case "image":
        md += generateImage(block);
        break;
      case "table":
        md += generateTable(block);
        break;
      case "quote":
        md += generateQuote(block);
        break;
      case "link":
        md += generateLink(block, nextBlock);
        break;
      default:
        break;
    }
  });

  return md;
}


export { jsonToPandocMarkdown };