function fixOrphans(text) {
    if (!text) return "";
    return text.replace(/\b([aiouwzAIUOWZ])\s+/g, "$1&nbsp;");
}

function sanitizeHeadingLevel(level) {
    if (level < 1) return 1;
    if (level > 6) return 6;
    return level;
}

function jsonToHtml(blocks, options = {}) {
    const lang = options.lang || "pl";
    const title = fixOrphans(options.title || "Dokument");

    let toc = []; // zbieramy nagłówki do spisu treści
    let bodyContent = "";

    blocks.forEach((block, idx) => {
        switch (block.type) {
            case "heading": {
                const level = sanitizeHeadingLevel(block.level);
                const id = `heading-${idx}`;
                const text = fixOrphans(block.content);

                // nadpisanie font-size w zależności od level
                const fontSizes = {
                    1: "24pt",
                    2: "20pt",
                    3: "18pt",
                    4: "16pt",
                    5: "14pt",
                    6: "12pt"
                };
                bodyContent += `<h${level} id="${id}" style="font-size: ${fontSizes[level]}; margin: 8pt 0;">${text}</h${level}>`;
                toc.push({ id, text, level });
                break;
            }

            case "whitespace":
                const h = block.height || 10;
                // Dodajemy niewidoczny znak, żeby div nie był pusty
                bodyContent += `<div style="height: ${h}px; line-height: ${h}px;">&#8203;</div>`;
                break;

            case "paragraph":
                bodyContent += `<p style="text-align: justify;">${fixOrphans(block.content)}</p>`;
                break;

            case "list":
                if (block.ordered) {
                    bodyContent += `<ol role="list">`;
                    block.items.forEach(item => {
                        bodyContent += `<li>${fixOrphans(item)}</li>`;
                    });
                    bodyContent += `</ol>`;
                } else {
                    bodyContent += `<ul role="list">`;
                    block.items.forEach(item => {
                        bodyContent += `<li>${fixOrphans(item)}</li>`;
                    });
                    bodyContent += `</ul>`;
                }
                break;

            case "image":
                const width = block.width ? block.width : 100;
                const height = block.height ? block.height : "auto";

                bodyContent += `<div style="text-align: center; margin: 10px 0;">
        <div style="display: block;">
            <img src="${block.src}" alt="${block.alt || ""}" width="${width}" ${height !== "auto" ? `height="${height}"` : ""} style="display: block; margin: 0 auto;">
        </div>
        ${block.caption ? `<div style="text-align: center; font-size: 0.9em; margin-top: 4px;">${fixOrphans(block.caption)}</div>` : ""}
    </div>`;
                break;



            case "table":
                bodyContent += `<div style="text-align: center;">
                        <table role="table" aria-label="${block.caption || "Tabela"}" 
                               style="border-collapse: collapse; border: 1px solid black; display: inline-table;">`;
                if (block.caption) bodyContent += `<caption>${fixOrphans(block.caption)}</caption>`;

                // nagłówki
                bodyContent += "<thead><tr>";
                block.headers.forEach(h => {
                    bodyContent += `<th style="border: 1px solid black; padding: 4px;">${fixOrphans(h)}</th>`;
                });
                bodyContent += "</tr></thead>";

                // wiersze danych
                bodyContent += "<tbody>";
                block.rows.forEach(row => {
                    bodyContent += "<tr>";
                    row.forEach(cell => {
                        bodyContent += `<td style="border: 1px solid black; padding: 4px;">${fixOrphans(cell)}</td>`;
                    });
                    bodyContent += "</tr>";
                });
                bodyContent += "</tbody></table></div>";
                // dolny podpis pod tabelą
                if (block["caption-bottom"]) {
                    bodyContent += `<p style="text-align: center; margin-top: 4px;"><em>${fixOrphans(block["caption-bottom"])}</em></p>`;
                }
                break;



            case "quote":
                bodyContent += `<blockquote style="margin: 10px 20px; padding: 10px; border-left: 3px solid #888; background-color: #f9f9f9;">
        <p style="text-align: justify; margin: 0;">${fixOrphans(block.content)}</p>
        ${block.cite ? `<cite style="display: block; text-align: right; font-style: italic; margin-top: 4px;">${fixOrphans(block.cite)}</cite>` : ""}
    </blockquote>`;
                break;


            default:
                break;
        }
    });

    // generowanie spisu treści
    let tocHtml = "";
    if (toc.length > 0) {
        tocHtml = `<nav role="doc-toc" aria-label="Spis treści"><h2>Spis treści wygenerowany automatycznie</h2><ul>`;
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
    <header role="banner" aria-label="Nagłówek dokumentu">
      <h1>${title}</h1>
    </header>
    ${tocHtml}
    <main role="main" aria-label="Treść główna">
      ${bodyContent}
    </main>
    <footer role="contentinfo" aria-label="Stopka dokumentu">
      <p>Wygenerowano automatycznie</p>
    </footer>
  </body>
  </html>`;

    return html;
}
export { jsonToHtml };