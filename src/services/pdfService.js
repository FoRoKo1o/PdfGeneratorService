import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { copyImagesToTmp } from "./imageService.js";
import { jsonToPandocMarkdown } from "../utils/jsonToMarkdown.js";

function cleanupTmpFiles(files) {
    files.forEach(file => {
        try {
            if (fs.existsSync(file)) fs.unlinkSync(file);
        } catch (e) {
            console.error("Error deleting temp file:", e);
        }
    });
}

/**
 * Generates a PDF from blocks and options, sends it via Express response.
 */
export function generatePdf(blocks, options, res) {
    const id = uuidv4();
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const mdPath = path.join(tmpDir, `${id}.md`);
    const odtPath = path.join(tmpDir, `${id}.odt`);
    const pdfPath = path.join(tmpDir, `${id}.pdf`);

    // Copy images and update src to filename only
    const fixedBlocks = copyImagesToTmp(blocks, tmpDir);
    // Update image src to filename only for Markdown
    fixedBlocks.forEach(block => {
        if (block.type === "image" && block.src) {
            block.src = path.basename(block.src);
        }
    });

    const md = jsonToPandocMarkdown(fixedBlocks, options);

    fs.writeFileSync(mdPath, md);

    // 1. Markdown -> ODT przez Pandoc
    const pandocTocFlag = options.toc === true || options.toc === "true" ? "--table-of-contents" : "";
    exec(
        `pandoc "${mdPath}" --reference-doc=../templates/template.odt --wrap=preserve ${pandocTocFlag} -o "${odtPath}"`,
        { cwd: tmpDir },
        (err) => {
            if (err) {
                console.error("Pandoc ODT conversion error:", err);
                return res.status(500).send("ODT conversion failed");
            }
            
            // 2. Uruchomienie makra, aby zaktualizować spis treści
            exec(
                `soffice --headless ${odtPath}  "macro:///Standard.Module1.UpdateTOC"`,
                { cwd: tmpDir },
                (err2) => {
                    if (err2) {
                        console.error("Makro nie wykonało się poprawnie:", err2);
                        return res.status(500).send("Macro execution failed");
                    }

                    // 3. ODT -> PDF przez LibreOffice
                    exec(
                        `soffice --headless --convert-to pdf:writer_pdf_Export --outdir "${tmpDir}" "${odtPath}"`,
                        { cwd: tmpDir },
                        (err3) => {
                            if (err3) {
                                console.error("PDF conversion error:", err3);
                                return res.status(500).send("PDF conversion failed");
                            }

                            // 4. Wysyłanie pliku PDF
                            const tmpFiles = [mdPath, odtPath, pdfPath];
                            fixedBlocks.forEach(b => {
                                if (b.type === "image") {
                                    const imgPath = path.join(tmpDir, b.src);
                                    tmpFiles.push(imgPath);
                                }
                            });

                            res.download(pdfPath, "document.pdf", () => {
                                cleanupTmpFiles(tmpFiles);
                            });
                        }
                    );
                }
            );
        }
    );
}
