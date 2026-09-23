---
name: pdf-extractor
description: Extracts text notes and splits PDFs automatically. Use this skill when working with large PDFs that exceed read limits to process them sequentially.
---

# PDF Extractor

## Overview
This skill provides automated scripts to extract text and split PDF files. It is intended for use when dealing with files that are too large to read directly.
**Note:** The native `read_file` tool handles PDF text extraction intrinsically. Always prefer `read_file` for reading PDFs over the Node.js scripts below, as it is faster and doesn't require temporary files. Use the scripts here *if and only if* the file is too large to read directly (e.g., exceeds file size or token limits).

## Workflows

### 1. Direct Reading (Preferred Method)
1. Directly use the `read_file` tool on the target PDF file if it is small or medium-sized.
2. Read the returned text directly to generate Obsidian notes topic-by-topic.

### 2. Splitting a Large PDF for Topic-by-Topic Processing
If a PDF file is too large to read directly, you can split it by specific page ranges or into sequential chunks:

- **Extracting a Specific Page Range**:
  Use this when you know exactly which pages correspond to the current topic:
  ```bash
  rtk node "<path-to-skill>/scripts/split_pdf.js" <absolute-path-to-target-pdf> <start-page> <end-page>
  ```
- **Splitting into Fixed-Size Chunks (Recommended for processing whole directories)**:
  Use this to split the PDF into small parts of `N` pages (default is 20 pages):
  ```bash
  rtk node "<path-to-skill>/scripts/split_pdf.js" <absolute-path-to-target-pdf> --chunk 20
  ```

Once split:
1. Read the split PDF part(s) using the `read_file` tool.
2. Process the topic, write/merge it into the master note.
3. Run the `rearrange-topics` script on the master file.
4. **Crucial Cleanup:** Immediately delete the temporary split PDF files.

### 3. Extracting Text from a PDF (Fallback Method)
If `read_file` fails or a raw text dump is needed for a large file:
1. Run the extractor script with `rtk` (uses `pdf-parse` for fast text extraction):
   ```bash
   rtk node "<path-to-skill>/scripts/extract_pdf.js" <absolute-path-to-target-pdf>
   ```
2. The script will generate `temp_pdf_text.txt` in the same directory as the PDF. Read this file sequentially (e.g., topic by topic using line ranges).
3. **Crucial Cleanup:** Delete `temp_pdf_text.txt` from the workspace immediately after finishing the topic.

## Included Scripts
- `extract_pdf.js`: Uses `pdf-parse` to extract text content to a `.txt` file.
- `split_pdf.js`: Uses `pdf-lib` to extract page ranges or split a PDF into sequential page chunks.
- `package.json`: Contains dependencies (`pdf-lib`, `pdf-parse`, `pdf2json`).

