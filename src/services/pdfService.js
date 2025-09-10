import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { copyImagesToTmp } from "./imageService.js";
import { jsonToHtml } from "../utils/jsonToHtml.js";

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
    const pdfPath = path.join(tmpDir, `${id}.pdf`);

    const fixedBlocks = copyImagesToTmp(blocks, tmpDir);
    const html = jsonToHtml(fixedBlocks, options);

    fs.writeFileSync(htmlPath, html);

    exec(
        `soffice --headless --convert-to pdf:writer_pdf_Export --outdir "${tmpDir}" "${htmlPath}"`,
        (err) => {
            if (err) {
                console.error("PDF conversion error:", err);
                return res.status(500).send("PDF conversion failed");
            }
            // Collect all temp files to clean up
            const tmpFiles = [htmlPath, pdfPath];
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