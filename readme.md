# PDF Generator Service

A "simple" Node.js service for generating PDFs from structured JSON input using Pandoc, Express and LibreOffice.

`JSON > .MD + .ODT > .ODT + VBA > PDF`
## Features

- Generate PDFs from JSON describing document structure
- Supports headings, paragraphs, lists, whitespace, images, tables, links and quotes
- Polish typographic orphans fixing
- Docker-ready

### Update:

- The HTML feature is now deprecated and has been replaced by Markdown. This change allows better control over headers and footers.
- The HTML feature is still superior for formatting images (currently, it’s unclear how to style images using Markdown).

## Usage

### 0. Requred step

Create macro inside LibreOffice

```vb
Sub UpdateTOC()
    ' Pobierz wszystkie indeksy (spis treści)
    Dim oIndexes As Object
    oIndexes = ThisComponent.getDocumentIndexes()

    ' Przejdź przez wszystkie indeksy i zaktualizuj każdy
    For i = 0 To oIndexes.getCount() - 1
        Dim oIndex As Object
        oIndex = oIndexes.getByIndex(i)
        If oIndex.supportsService("com.sun.star.text.ContentIndex") Then
            oIndex.update()  ' Zaktualizuj spis treści
        End If
    Next

    ' Zapisz dokument
    ThisComponent.store()

    ' Zamknij dokument
    ThisComponent.close(True)
End Sub
```

## In case of using noGUI system

`nano ~/.config/libreoffice/4/user/basic/Standard/Module1.xba`

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE script:module PUBLIC "-//OpenOffice.org//DTD OfficeDocument 1.0//EN" "module.dtd">
<script:module xmlns:script="http://openoffice.org/2000/script" script:name="Module1" script:language="StarBasic">Sub UpdateTOC()
    &apos; Pobierz wszystkie indeksy (spis treści)
    Dim oIndexes As Object
    oIndexes = ThisComponent.getDocumentIndexes()

    &apos; Przejdź przez wszystkie indeksy i zaktualizuj każdy
    For i = 0 To oIndexes.getCount() - 1
        Dim oIndex As Object
        oIndex = oIndexes.getByIndex(i)
        If oIndex.supportsService(&quot;com.sun.star.text.ContentIndex&quot;) Then
            oIndex.update()  &apos; Zaktualizuj spis treści
        End If
    Next

    &apos; Zapisz dokument
    ThisComponent.store()
    
    &apos; Zamknij dokument
    ThisComponent.close(True)
End Sub

</script:module>
```

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

- `GET /templates`  
  Returns a list of available template names.
```
{
    "templates":
    [
      "template",
      "template2"
    ]
}
```
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

### 4. Whitespace - not supported

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

### 8. Links
```json
{
    "type": "link",
    "text": "This si example linl",
    "url": "https://example.com"
},
```

## Options Reference

```json
{
  "lang": "pl",
  "title": "My PDF Document",
  "author": "Name to be inserted as Metadata",
  "toc": "true / false"
}
```

- `lang`: string (default: "pl")
- `title`: string (default: "Dokument")

---

## Example Input

See [`sample.json`](sample.json) for a full example.