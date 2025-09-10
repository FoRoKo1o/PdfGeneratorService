import express from "express";
import fs from "fs";
import { generatePdf } from "../services/pdfService.js";

const router = express.Router();

router.post("/generate-pdf", (req, res) => {
    generatePdf(req.body.blocks, req.body.options || {}, res);
});

router.get("/test-generate-pdf", (req, res) => {
    try {
        const raw = fs.readFileSync("./sample.json", "utf-8");
        const { blocks, options = {} } = JSON.parse(raw);
        generatePdf(blocks, options, res);
    } catch (err) {
        console.error("Error reading test file:", err);
        res.status(500).send("Failed to read test file");
    }
});

export default router;