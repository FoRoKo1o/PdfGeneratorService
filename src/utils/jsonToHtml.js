import { fixOrphans } from "./fixOrphans.js";
import { renderHeading } from "./RenderHtmlBlock/renderHeading.js";
import { renderWhitespace } from "./RenderHtmlBlock/renderWhitespace.js";
import { renderParagraph } from "./RenderHtmlBlock/renderParagraph.js";
import { renderList } from "./RenderHtmlBlock/renderList.js";
import { renderImage } from "./RenderHtmlBlock/renderImage.js";
import { renderTable } from "./RenderHtmlBlock/renderTable.js";
import { renderQuote } from "./RenderHtmlBlock/renderQuote.js";
import config from "../config.js";

function jsonToPandocHtml(blocks, options = {}) {
  const lang = options.lang || "pl";
  const title = fixOrphans(options.title || "Dokument");
  const HeaderText = options.HeaderText || "";
  const footer = options.footer || "";

  let toc = [];
  let bodyContent = "";

  blocks.forEach((block, idx) => {
    switch (block.type) {
      case "heading":
        bodyContent += renderHeading(block, idx, toc);
        break;
      case "whitespace":
        bodyContent += renderWhitespace(block);
        break;
      case "paragraph":
        bodyContent += renderParagraph(block);
        break;
      case "list":
        bodyContent += renderList(block);
        break;
      case "image":
        bodyContent += renderImage(block);
        break;
      case "table":
        bodyContent += renderTable(block);
        break;
      case "quote":
        bodyContent += renderQuote(block);
        break;
      default:
        break;
    }
  });

  // Table of contents
  let tocHtml = "";
  if (toc.length > 0) {
    tocHtml = `<nav role="doc-toc" aria-label="${config.generalPdfInfo.tocAriaLabel || ""}">
      <h2>${config.generalPdfInfo.tocText || ""}</h2>
      <ul>
        ${toc.map(item => `<li class="toc-level-${item.level}"><a href="#${item.id}">${item.text}</a></li>`).join("")}
      </ul>
    </nav>`;
  }

  // Dodajemy blok metadanych Pandoc na górze HTML
  let html = `--- 
title: "${title}"
subtitle: "${HeaderText}"
footer: "${footer}"
lang: "${lang}"
---
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
</head>
<body>
  <header>
    <h1>${title}</h1>
  </header>
  ${tocHtml}
  <main>
    ${bodyContent}
  </main>
  <footer>
    <p>${footer || config.generalPdfInfo.footerText || "© 2025 My Application"}</p>
  </footer>
</body>
</html>`;

  return html;
}

export { jsonToPandocHtml };