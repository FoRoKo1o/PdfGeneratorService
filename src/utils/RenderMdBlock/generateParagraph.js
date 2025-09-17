import { fixOrphans } from "../fixOrphans.js";

export function generateParagraph(block, nextBlock) {
  let paragraph = `${fixOrphans(block.content)}`;

  if (nextBlock && nextBlock.type !== "paragraph" && nextBlock.type !== "link") {
    paragraph += "\n\n";
  }


  return paragraph;
}
