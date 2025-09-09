import express from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { jsonToHtml } from "./jsonToHtml.js";


const app = express();
app.use(express.json());

// /generate-pdf - POST with JSON file, returns PDF
app.post("/generate-pdf", (req, res) => {
    generatePdf(req.body.blocks, req.body.options || {}, res);
});

// 🔹 GET testowy z pliku
app.get("/test-generate-pdf", (req, res) => {
    try {
        const raw = fs.readFileSync("./sample.json", "utf-8");
        const { blocks, options = {} } = JSON.parse(raw);
        generatePdf(blocks, options, res);
    } catch (err) {
        console.error("Błąd odczytu pliku:", err);
        res.status(500).send("Nie udało się odczytać pliku testowego");
    }
});

function copyImagesToTmp(blocks, tmpDir) {
    const copied = new Set();
    return blocks.map((block) => {
        if (block.type === "image" && block.src) {
            let destPath;

            if (block.src.startsWith("data:")) {
                // base64
                const matches = block.src.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
                if (!matches) return block;
                const ext = matches[1].split("/")[1]; // np. png
                const data = matches[2];
                destPath = path.join(tmpDir, `${uuidv4()}.${ext}`);
                fs.writeFileSync(destPath, Buffer.from(data, "base64"));
            } else {
                // zwykły plik lokalny
                const srcPath = path.resolve(block.src);
                destPath = path.join(tmpDir, path.basename(block.src));
                if (!copied.has(destPath) && fs.existsSync(srcPath)) {
                    fs.copyFileSync(srcPath, destPath);
                    copied.add(destPath);
                }
            }

            return { ...block, src: path.basename(destPath) }; // używamy nazwy pliku w tymczasowym folderze
        }
        return block;
    });
}



function generatePdf(blocks, options, res) {
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
                console.error("Błąd konwersji:", err);
                return res.status(500).send("Konwersja nie powiodła się");
            }

            res.download(pdfPath, "document.pdf", () => {
                fs.unlinkSync(htmlPath);
                fs.unlinkSync(pdfPath);
                fixedBlocks.forEach(b => {
                    if (b.type === "image" && fs.existsSync(path.join(tmpDir, b.src))) {
                        fs.unlinkSync(path.join(tmpDir, b.src));
                    }
                });
            });
        }
    );
}


app.listen(3000, () =>
    console.log("PDF service running on http://localhost:3000")
);
