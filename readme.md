# PDF Generator Service

A simple Node.js service for generating PDFs from structured JSON input using Express and LibreOffice.

## Features

- Generate PDFs from JSON describing document structure
- Supports headings, paragraphs, lists, whitespace, images, tables, and quotes
- Polish typographic orphans fixing
- Docker-ready

## Usage

### 1. Start the Service

```sh
npm install
npm start
```

Or with Docker:

```sh
docker build -t pdf-generator .
docker run -p 3000:3000 pdf-generator
```

### 2. API Endpoints

- `POST /generate-pdf`  
  Request body:  
  ```json
  {
    "blocks": [ ... ],
    "options": { ... }
  }
  ```
  Responds with a generated PDF.

- `GET /test-generate-pdf`  
  Uses `sample.json` as input and returns a PDF.

---

## Block Types Reference

Below are all supported block types with example data.

### 1. Heading

```json
{
  "type": "heading",
  "level": 1,
  "content": "Main Heading"
}
```

- `level`: integer (1-6, only 1-3 are rendered as headings)
- `content`: string

---

### 2. Paragraph

```json
{
  "type": "paragraph",
  "content": "This is a paragraph of text."
}
```

- `content`: string

---

### 3. List

**Unordered:**
```json
{
  "type": "list",
  "ordered": false,
  "items": ["Item 1", "Item 2", "Item 3"]
}
```

**Ordered:**
```json
{
  "type": "list",
  "ordered": true,
  "items": ["First", "Second", "Third"]
}
```

- `ordered`: boolean
- `items`: array of strings

---

### 4. Whitespace

```json
{
  "type": "whitespace",
  "height": 40
}
```

- `height`: integer (pixels, optional, default: 10)

---

### 5. Image

```json
{
  "type": "image",
  "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "alt": "Alt text",
  "caption": "Image caption",
  "width": 200,
  "height": 150
}
```

- `src`: base64 data URL or file path
- `alt`: string (optional)
- `caption`: string (optional)
- `width`: integer (optional)
- `height`: integer (optional)

---

### 6. Table

```json
{
  "type": "table",
  "caption": "Sample Table",
  "caption-bottom": "Author Name",
  "headers": ["Column 1", "Column 2", "Column 3"],
  "rows": [
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"]
  ]
}
```

- `caption`: string (optional, appears above table)
- `caption-bottom`: string (optional, appears below table)
- `headers`: array of strings
- `rows`: array of arrays of strings

---

### 7. Quote

```json
{
  "type": "quote",
  "content": "This is a quoted text.",
  "cite": "Author Name"
}
```

- `content`: string
- `cite`: string (optional)

---

## Options Reference

```json
{
  "lang": "pl",
  "title": "My PDF Document"
}
```

- `lang`: string (default: "pl")
- `title`: string (default: "Dokument")

---

## Example Input

See [`sample.json`](sample.json) for a full example.
