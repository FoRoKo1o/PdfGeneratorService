import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Copies images from blocks to tmpDir, handling base64 and file paths.
 * Returns new blocks with updated src.
 */
export function copyImagesToTmp(blocks, tmpDir) {
    const copied = new Set();
    return blocks.map((block) => {
        if (block.type === "image" && block.src) {
            let destPath;
            if (block.src.startsWith("data:")) {
                // base64
                const matches = block.src.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
                if (!matches) return block;
                const ext = matches[1].split("/")[1];
                const data = matches[2];
                destPath = path.join(tmpDir, `${uuidv4()}.${ext}`);
                fs.writeFileSync(destPath, Buffer.from(data, "base64"));
            } else {
                // local file
                const srcPath = path.resolve(block.src);
                destPath = path.join(tmpDir, path.basename(block.src));
                if (!copied.has(destPath) && fs.existsSync(srcPath)) {
                    fs.copyFileSync(srcPath, destPath);
                    copied.add(destPath);
                }
            }
            return { ...block, src: path.basename(destPath) };
        }
        return block;
    });
}