const fs = require('fs');
const readline = require('readline');

const logPath = "C:\\Users\\Sayed\\.gemini\\antigravity-ide\\brain\\1402606c-86ca-4dec-af55-4a8aa6b645cb\\.system_generated\\logs\\transcript_full.jsonl";
const filesToFind = [
    "app/onboarding/wizard/page.tsx"
];

const fileContents = {};
filesToFind.forEach(f => fileContents[f] = "");

async function processLineByLine() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            const data = JSON.parse(line);
            if (data.content) {
                const content = data.content;
                for (const fileName of filesToFind) {
                    if (content.includes("File Path:") && content.includes(fileName.replace(/\//g, '\\'))) {
                        const lines = content.split('\n');
                        const extractedLines = [];
                        for (const l of lines) {
                            const match = l.match(/^\d+: (.*)$/);
                            if (match) {
                                extractedLines.push(match[1]);
                            }
                        }
                        if (extractedLines.length > 0) {
                            fileContents[fileName] = extractedLines.join('\n');
                        }
                    }
                }
            }
        } catch (e) {
            // ignore
        }
    }

    for (const [fname, fcontent] of Object.entries(fileContents)) {
        if (fcontent) {
            fs.writeFileSync(`d:/R8Estate/${fname}`, fcontent);
            console.log(`Restored ${fname}`);
        } else {
            console.log(`Could not find content for ${fname}`);
        }
    }
}

processLineByLine();
