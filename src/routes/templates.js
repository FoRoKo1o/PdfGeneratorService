import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/templates", (req, res) => {
    const templatesDir = path.join(process.cwd(), "templates");
    fs.readdir(templatesDir, (err, files) => {
        if (err) {
            console.error("Error reading templates directory:", err);
            return res.status(500).send("Failed to read templates directory");
        }
        const templates = files
            .filter(file => file.endsWith(".odt"))
            .map(file => path.basename(file, ".odt"));
        res.json({ templates });
    });
});

export default router;