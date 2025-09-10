import { fixOrphans} from "./fixOrphans.js";
import {renderHeading} from "./RenderHtmlBlock/renderHeading.js";
import { renderWhitespace } from "./RenderHtmlBlock/renderWhitespace.js";
import { renderParagraph } from "./RenderHtmlBlock/renderParagraph.js";
import { renderList } from "./RenderHtmlBlock/renderList.js";
import { renderImage } from "./RenderHtmlBlock/renderImage.js";
import { renderTable } from "./RenderHtmlBlock/renderTable.js";
import { renderQuote } from "./RenderHtmlBlock/renderQuote.js";
import config from "../config.js";

function jsonToHtml(blocks, options = {}) {
    const lang = options.lang || "pl";
    const title = fixOrphans(options.title || "Dokument");

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

    // generowanie spisu treści
    let tocHtml = "";
    if (toc.length > 0) {
        tocHtml = `<nav role="doc-toc" aria-label="${config.generalPdfInfo.tocAriaLabel || ""}"><h2>${config.generalPdfInfo.tocText || ""}</h2><ul>`;
        toc.forEach(item => {
            tocHtml += `<li class="toc-level-${item.level}">
                    <a href="#${item.id}">${item.text}</a>
                  </li>`;
        });
        tocHtml += `</ul></nav>`;
    }

    // składanie całego HTML
    let html = `
  <!DOCTYPE html>
  <html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
  </head>
  <body>
    <header role="banner" aria-label="${config.generalPdfInfo.bannerAriaLabel || ""}">
      <h1>${title}</h1>
    </header>
    ${tocHtml}
    <main role="main" aria-label="${config.generalPdfInfo.mainAriaLabel || ""}">
      ${bodyContent}
    </main>
    <footer role="contentinfo" aria-label="${config.generalPdfInfo.footerAriaLabel || ""}">
      <p>${config.generalPdfInfo.footerText || "Wygenerowano automatycznie"}</p>
    </footer>
  </body>
  </html>`;

    return html;
}

export { jsonToHtml };