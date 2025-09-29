import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { copyImagesToTmp } from "./imageService.js";
import { jsonToPandocMarkdown } from "../utils/jsonToMarkdown.js";
import { cleanupTmpFiles } from "./cleanupTmpFiles.js";
import { verifyTemplate } from "../utils/verifyTemplate.js";
import PQueue from "p-queue";
/**
 * Generates a PDF from blocks and options, sends it via Express response.
 */

const queue = new PQueue({ concurrency: 5 }); 

export async function generatePdf(blocks, options, res) {
    queue.add(() => generatePdfTask(blocks, options, res));
}

async function generatePdfTask(blocks, options, res) {
    const id = uuidv4();
    const tmpDir = path.join(process.cwd(), "tmp");
    const mdPath = path.join(tmpDir, `${id}.md`);
    const odtPath = path.join(tmpDir, `${id}.odt`);
    const pdfPath = path.join(tmpDir, `${id}.pdf`);
    const template = options.template || "template";

    // Check if template exists
    const isValidTemplate = await verifyTemplate(template);
    if (!isValidTemplate) {
        console.error("Invalid template provided:", template);
        return res.status(400).send("Invalid template.");
    }


    // Copy images and update src to filename only
    let fixedBlocks;
    try {
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        fixedBlocks = copyImagesToTmp(blocks, tmpDir);
        fixedBlocks.forEach(block => {
            if (block.type === "image" && block.src) {
                block.src = path.basename(block.src);
            }
        });
    } catch (err) {
        console.error("Error processing images:", err);
        cleanupTmpFiles();
        return res.status(500).send("Error processing images.");
    }

    // Generate markdown
    let md;
    try {
        md = jsonToPandocMarkdown(fixedBlocks, options);
        fs.writeFileSync(mdPath, md);
    } catch (err) {
        console.error("Error generating markdown:", err);
        cleanupTmpFiles();
        return res.status(500).send("Error generating markdown.");
    }

    // Convert Markdown to ODT via Pandoc
    try {
        const pandocTocFlag = options.toc === true || options.toc === "true" ? "--table-of-contents" : "";
        await execPromise(`pandoc "${mdPath}"  --reference-doc=../templates/${template}.odt --wrap=preserve ${pandocTocFlag} -o "${odtPath}"`, tmpDir);
    } catch (err) {
        console.error("Pandoc ODT conversion error:", err);
        cleanupTmpFiles();
        return res.status(500).send("ODT conversion failed");
    }

    // Run macro to update table of contents
    try {
        await execPromise(`soffice --headless ${odtPath} "macro:///Standard.Module1.UpdateTOC"`, tmpDir);
    } catch (err) {
        console.error("Macro execution error:", err);
        cleanupTmpFiles();
        return res.status(500).send("Macro execution failed");
    }

    // Convert ODT to PDF using LibreOffice
    try {
        await execPromise(`soffice --headless --convert-to pdf:writer_pdf_Export --outdir "${tmpDir}" "${odtPath}"`, tmpDir);
    } catch (err) {
        console.error("PDF conversion error:", err);
        cleanupTmpFiles();
        return res.status(500).send("PDF conversion failed");
    }

    // Send the PDF to the client and clean up
    const tmpFiles = [mdPath, odtPath, pdfPath];
    fixedBlocks.forEach(block => {
        if (block.type === "image" && block.src) {
            tmpFiles.push(path.join(tmpDir, block.src));
        }
    });

    try {
        res.download(pdfPath, "document.pdf", () => {
            cleanupTmpFiles(tmpFiles);
        });
    } catch (err) {
        console.error("Error sending PDF:", err);
        cleanupTmpFiles(tmpFiles);
        return res.status(500).send("Error sending PDF.");
    }
}

// Helper function to promisify exec
function execPromise(command, cwd) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (err, stdout, stderr) => {
            if (err) {
                console.error(`exec error: ${err}`);
                reject(err);
            } else {
                resolve(stdout || stderr);
            }
        });
    });
}
