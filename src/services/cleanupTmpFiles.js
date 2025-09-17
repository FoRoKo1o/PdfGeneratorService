import fs from "fs";
import path from "path";

/**
 * Cleans up all files in the temporary directory
 */
export function cleanupTmpFiles() {
    const tmpDir = path.join(process.cwd(), "tmp");

    try {
        // Check if the directory exists
        if (fs.existsSync(tmpDir)) {
            // Read all files in the directory
            const files = fs.readdirSync(tmpDir);

            // Loop through the files and delete them
            files.forEach(file => {
                const filePath = path.join(tmpDir, file);
                try {
                    if (fs.lstatSync(filePath).isFile()) {
                        fs.unlinkSync(filePath); // Delete file
                    }
                } catch (err) {
                    console.error(`Error deleting file ${filePath}:`, err);
                }
            });
        }
    } catch (err) {
        console.error("Error cleaning up tmp directory:", err);
    }
}
