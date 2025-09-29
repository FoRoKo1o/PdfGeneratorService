import fs from "fs";
import path from "path";

/**
 * Cleans up only the provided files in the temporary directory
 */
export function cleanupTmpFiles(files = []) {
    files.forEach(file => {
        try {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        } catch (err) {
            console.error(`Error deleting file ${file}:`, err);
        }
    });
}
