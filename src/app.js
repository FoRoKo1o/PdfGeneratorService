import express from "express";
import pdfRoutes from "./routes/pdf.js";
import templates from "./routes/templates.js";

const app = express();
app.use(express.json());
app.use("/public", express.static("public"));

app.use("/", pdfRoutes);
app.use("/", templates);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`PDF service running on http://localhost:${PORT}`)
);