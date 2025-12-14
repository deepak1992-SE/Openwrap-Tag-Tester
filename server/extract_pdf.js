const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const files = [
    'OpenWrap OTT video.pdf',
    'Prebid Server.pdf'
];

async function extractText() {
    console.log('Current directory:', __dirname);
    console.log('pdf-parse type:', typeof pdf);
    console.log('pdf-parse keys:', Object.keys(pdf));

    for (const file of files) {
        const filePath = path.join(__dirname, '..', file);
        console.log(`Checking file: ${filePath}`);

        if (fs.existsSync(filePath)) {
            console.log(`\n--- Extracting: ${file} ---\n`);
            const dataBuffer = fs.readFileSync(filePath);
            try {
                // Try to use PDFParse from the exported object
                console.log('PDFParse type:', typeof pdf.PDFParse);

                let data;
                if (typeof pdf.PDFParse === 'function') {
                    // It might be a class or a function
                    try {
                        // Try as a function first or check if it's a class
                        // But let's just try to instantiate it or call it
                        // The library seems to be https://github.com/mehmet-kozan/pdf-parse
                        // Looking at their docs (if I could), usually it's new PDFParse() or similar.
                        // But let's try to see if there is a static method or if it's the function itself.

                        // If it is the class, we might need to call a method on it.
                        // Let's try to create an instance
                        const parser = new pdf.PDFParse();
                        data = await parser.extract(dataBuffer); // Guessing method name
                    } catch (err) {
                        console.log('Error using new PDFParse():', err.message);
                        // Fallback: maybe it's a function that takes the buffer
                        try {
                            data = await pdf.PDFParse(dataBuffer);
                        } catch (err2) {
                            console.log('Error using pdf.PDFParse(buffer):', err2.message);
                        }
                    }
                }

                if (!data && typeof pdf === 'function') {
                    data = await pdf(dataBuffer);
                }

                if (data) {
                    console.log('Text length:', data.text ? data.text.length : 'undefined');
                    if (data.text) {
                        console.log(data.text.substring(0, 2000));
                        fs.writeFileSync(path.join(__dirname, `${file}.txt`), data.text);
                        console.log(`Saved text to ${file}.txt`);
                    } else {
                        console.log('Data extracted but no text property found:', Object.keys(data));
                    }
                } else {
                    console.log('Could not extract data using known methods.');
                }

            } catch (e) {
                console.error(`Error parsing ${file}:`, e);
            }
        } else {
            console.error(`File not found: ${filePath}`);
        }
    }
}

extractText();
