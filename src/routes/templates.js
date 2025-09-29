import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";

const router = express.Router();

const userTemplatesDir = path.join(process.cwd(), "templates", "UserAdded");
if (!fs.existsSync(userTemplatesDir)) {
    fs.mkdirSync(userTemplatesDir, { recursive: true });
}

// GET: List available templates
router.get("/templates/getAll", (req, res) => {
    const userAddedDir = path.join(process.cwd(), "templates", "UserAdded");
    const verifiedDir = path.join(process.cwd(), "templates", "Verified");

    function readTemplates(dir) {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir)
            .filter(file => file.endsWith(".odt"))
            .map(file => file);
    }

    const userAddedTemplates = readTemplates(userAddedDir);
    const verifiedTemplates = readTemplates(verifiedDir);

    res.json({
        userAdded: userAddedTemplates,
        verified: verifiedTemplates
    });
});

// POST: Upload a template to /templates/UserAdded
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, userTemplatesDir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/vnd.oasis.opendocument.text" && file.originalname.endsWith(".odt")) {
            cb(null, true);
        } else {
            cb(new Error("Only .odt files are allowed"));
        }
    }
});

router.post("/templates/upload", upload.single("template"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded or wrong file type.");
    }
    res.json({ message: "Template uploaded successfully", filename: req.file.originalname });
});

export default router;