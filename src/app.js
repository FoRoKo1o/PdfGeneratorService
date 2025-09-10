import express from "express";
import pdfRoutes from "./routes/pdf.js";

const app = express();
app.use(express.json());
app.use("/public", express.static("public"));

app.use("/", pdfRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`PDF service running on http://localhost:${PORT}`)
);