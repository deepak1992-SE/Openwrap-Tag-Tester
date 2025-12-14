const fs = require('fs');
const path = require('path');

const files = [
    'OpenWrap OTT video.pdf',
    'Prebid Server.pdf'
];

async function extractText() {
    try {
        console.log('Importing pdfjs-dist/legacy...');
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

        // In Node.js environment, we might need to set up the worker or disable it.
        // For recent versions, we might need to point to the worker file.
        // But let's try basic usage first.

        for (const file of files) {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                console.log(`\n--- Extracting: ${file} ---\n`);
                const dataBuffer = fs.readFileSync(filePath);
                // Convert Buffer to Uint8Array
                const uint8Array = new Uint8Array(dataBuffer);

                try {
                    const loadingTask = pdfjsLib.getDocument({
                        data: uint8Array,
                        // Disable worker if possible or let it fail and see
                        // useWorkerFetch: false,
                        // isEvalSupported: false,
                        // useSystemFonts: true
                    });

                    const doc = await loadingTask.promise;
                    console.log(`Pages: ${doc.numPages}`);

                    let fullText = '';

                    for (let i = 1; i <= doc.numPages; i++) {
                        const page = await doc.getPage(i);
                        const textContent = await page.getTextContent();
                        // Join items with space, but maybe check for hasEOL
                        const pageText = textContent.items.map(item => item.str + (item.hasEOL ? '\n' : ' ')).join('');
                        fullText += `\n--- Page ${i} ---\n${pageText}`;
                    }

                    console.log(fullText.substring(0, 2000));
                    fs.writeFileSync(path.join(__dirname, `${file}.txt`), fullText);
                    console.log(`Saved text to ${file}.txt`);

                } catch (e) {
                    console.error(`Error parsing ${file}:`, e);
                }
            } else {
                console.error(`File not found: ${filePath}`);
            }
        }
    } catch (err) {
        console.error('Error importing pdfjs-dist:', err);
    }
}

extractText();
