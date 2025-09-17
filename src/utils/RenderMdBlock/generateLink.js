export function generateLink(block, nextBlock) {
  const { text, url } = block;

  // Normalny format linku
  let linkMarkdown = `[${text}](${url})`;

  if (nextBlock && nextBlock.type != "paragraph") {
    linkMarkdown += "\n\n"; // Dodajemy podwójne \n, jeśli po linku idzie znacznik inny niż paragraf
  }

  return linkMarkdown + "\n";
}
