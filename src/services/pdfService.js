import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { copyImagesToTmp } from "./imageService.js";
import { jsonToPandocHtml } from "../utils/jsonToHtml.js";

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

    const htmlPath = path.join(tmpDir, `${id}.html`);
    const odtPath = path.join(tmpDir, `${id}.odt`);
    const pdfPath = path.join(tmpDir, `${id}.pdf`);

    const fixedBlocks = copyImagesToTmp(blocks, tmpDir);
    const html = jsonToPandocHtml(fixedBlocks, options);

    fs.writeFileSync(htmlPath, html);

    // 1. HTML -> ODT przez Pandoc
    exec(
        `pandoc "${htmlPath}" --reference-doc=src/services/template.odt -o "${odtPath}"`,
        (err) => {
            if (err) {
                console.error("Pandoc ODT conversion error:", err);
                return res.status(500).send("ODT conversion failed");
            }
            // 2. ODT -> PDF przez LibreOffice
            exec(
                `soffice --headless --convert-to pdf:writer_pdf_Export --outdir "${tmpDir}" "${odtPath}"`,
                (err2) => {
                    if (err2) {
                        console.error("PDF conversion error:", err2);
                        return res.status(500).send("PDF conversion failed");
                    }
                    // Clean up and send PDF
                    const tmpFiles = [htmlPath, odtPath, pdfPath];
                    fixedBlocks.forEach(b => {
                        if (b.type === "image") {
                            const imgPath = path.join(tmpDir, b.src);
                            tmpFiles.push(imgPath);
                        }
                    });
                    res.download(pdfPath, "document.pdf", () => {
                        // cleanupTmpFiles(tmpFiles);
                    });
                }
            );
        }
    );
}