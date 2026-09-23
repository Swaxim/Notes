const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function splitPdf() {
    const args = process.argv.slice(2);
    const inputFile = args[0];

    if (!inputFile) {
        console.error("Usage:");
        console.error("  node split_pdf.js <input_pdf_path> <start_page> <end_page>      (Extract page range)");
        console.error("  node split_pdf.js <input_pdf_path> --chunk <size>               (Split into chunks of size)");
        console.error("  node split_pdf.js <input_pdf_path>                              (Default: split into 20-page chunks)");
        process.exit(1);
    }

    if (!fs.existsSync(inputFile)) {
        console.error(`Error: File not found: ${inputFile}`);
        process.exit(1);
    }

    const originalPdfBytes = fs.readFileSync(inputFile);
    const pdfDoc = await PDFDocument.load(originalPdfBytes);
    const numberOfPages = pdfDoc.getPages().length;

    const outputDir = path.dirname(inputFile);
    const baseName = path.basename(inputFile, '.pdf');

    // Parse options
    let chunkMode = false;
    let chunkSize = 20;
    let startPage = null;
    let endPage = null;

    if (args[1] === '--chunk' || args[1] === '-c') {
        chunkMode = true;
        chunkSize = parseInt(args[2], 10);
        if (isNaN(chunkSize) || chunkSize <= 0) {
            console.error("Error: Chunk size must be a positive integer.");
            process.exit(1);
        }
    } else if (args[1] && args[2]) {
        startPage = parseInt(args[1], 10);
        endPage = parseInt(args[2], 10);
        if (isNaN(startPage) || isNaN(endPage)) {
            console.error("Error: Start page and end page must be numbers.");
            process.exit(1);
        }
    } else if (args.length === 1) {
        chunkMode = true;
        chunkSize = 20; // Default chunk size
    } else {
        console.error("Error: Invalid arguments.");
        process.exit(1);
    }

    if (chunkMode) {
        console.log(`Splitting PDF into chunks of ${chunkSize} pages (total pages: ${numberOfPages})...`);
        let partNum = 1;
        for (let i = 0; i < numberOfPages; i += chunkSize) {
            const doc = await PDFDocument.create();
            const start = i;
            const end = Math.min(i + chunkSize - 1, numberOfPages - 1);
            
            const pagesToCopy = Array.from({ length: end - start + 1 }, (_, index) => index + start);
            const copiedPages = await doc.copyPages(pdfDoc, pagesToCopy);
            copiedPages.forEach((page) => doc.addPage(page));

            const pdfBytes = await doc.save();
            const outputFile = path.join(outputDir, `${baseName}_part_${partNum}_pages_${start + 1}_to_${end + 1}.pdf`);
            fs.writeFileSync(outputFile, pdfBytes);
            console.log(`Saved part ${partNum}: ${outputFile}`);
            partNum++;
        }
        console.log("Chunk splitting complete.");
    } else {
        // Extract specific range
        let start = startPage - 1;
        let end = endPage - 1;

        if (start < 0) start = 0;
        if (end >= numberOfPages) end = numberOfPages - 1;

        if (start > end) {
            console.error(`Error: start page (${startPage}) cannot be greater than end page (${endPage}) or total pages (${numberOfPages}).`);
            process.exit(1);
        }

        const doc = await PDFDocument.create();
        const pagesToCopy = Array.from({ length: end - start + 1 }, (_, i) => i + start);
        const copiedPages = await doc.copyPages(pdfDoc, pagesToCopy);
        copiedPages.forEach((page) => doc.addPage(page));
        
        const pdfBytes = await doc.save();
        const outputFile = path.join(outputDir, `${baseName}_pages_${start + 1}_to_${end + 1}.pdf`);
        fs.writeFileSync(outputFile, pdfBytes);
        console.log(`Splitting complete. Saved to ${outputFile}`);
    }
}

splitPdf().catch(console.error);
