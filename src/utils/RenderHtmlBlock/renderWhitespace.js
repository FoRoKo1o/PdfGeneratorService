export function renderWhitespace(block) {
    const h = block.height || 10;
    return `<div style="height: ${h}px; line-height: ${h}px;">&#8203;</div>`;
}