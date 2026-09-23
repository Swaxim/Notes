const fs = require('fs');
const path = require('path');
const PDFParser = require("pdf2json");

const inputFile = process.argv[2];
if (!inputFile) {
    console.error("Usage: node extract_pdf.js <input_pdf_path>");
    process.exit(1);
}

if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
}

// Instantiate PDFParser with context=null, and rawText = 1 to extract text
const pdfParser = new PDFParser(null, 1);

pdfParser.on("pdfParser_dataError", errData => {
    console.error("Error parsing PDF:", errData.parserError);
    process.exit(1);
});

pdfParser.on("pdfParser_dataReady", pdfData => {
    const outputDir = path.dirname(inputFile);
    const outputFile = path.join(outputDir, "temp_pdf_text.txt");
    fs.writeFileSync(outputFile, pdfParser.getRawTextContent());
    console.log(`Done. Text saved to ${outputFile}`);
});

pdfParser.loadPDF(inputFile);
