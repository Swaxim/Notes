const fs = require('fs');
const path = require('path');

// Helper to clean leading delimiters and trim whitespace from title
function cleanTitleText(rest) {
    if (!rest) return '';
    // Strip leading colons, dashes, dots, and spaces
    return rest.replace(/^[\:\-\.\s]+/, '').trim();
}

function rearrangeHeadings(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const hasCRLF = content.includes('\r\n');
    // Normalize newlines before splitting
    content = content.replace(/\r\n/g, '\n');
    const lines = content.split('\n');

    // Categories of valid prefixes
    const LECTURE_PREFIXES = new Set([
        'chapter', 'topic', 'week', 'lecture', 'module', 'unit', 'part', 'section'
    ]);
    const SPECIAL_PREFIXES = new Set([
        'lab', 'tutorial', 'assignment', 'appendix', 'project', 'step'
    ]);
    const VALID_PREFIXES = new Set([...LECTURE_PREFIXES, ...SPECIAL_PREFIXES]);

    // Regexes for parsing
    // 1. Heading with a prefix word and number: e.g. "Chapter 1: Title" or "Lab 2 - Title"
    const prefixNumberRegex = /^\s*([A-Za-z]+)\s+(\d+(?:\.\d+)*)([\:\-\.\s]+.*)?$/;
    // 2. Heading with just a number: e.g. "1.1 Title" or "2 Title"
    const justNumberRegex = /^\s*(\d+(?:\.\d+)*)([\:\-\.\s]+.*)?$/;

    let inCodeBlock = false;
    let inFrontMatter = false;
    const matches = [];
    const lecturePrefixCounts = {};

    // Check if the file starts with frontmatter
    if (lines.length > 0 && lines[0].trim() === '---') {
        inFrontMatter = true;
    }

    // First pass: scan all lines to find numbered headings and count lecture prefixes
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Handle frontmatter toggle
        if (inFrontMatter && i > 0 && line.trim() === '---') {
            inFrontMatter = false;
            continue;
        }
        if (inFrontMatter) continue;

        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;

        // Check if line starts with hashes
        const headingMatch = line.match(/^(#+)\s+(.*)$/);
        if (headingMatch) {
            const hashes = headingMatch[1];
            const level = hashes.length;
            const titlePart = headingMatch[2].trim();

            let parsed = null;

            // Attempt to match with prefix and number
            const matchA = titlePart.match(prefixNumberRegex);
            if (matchA) {
                const prefix = matchA[1];
                const prefixLower = prefix.toLowerCase();
                if (VALID_PREFIXES.has(prefixLower)) {
                    parsed = {
                        hasPrefix: true,
                        prefix: prefix,
                        prefixLower: prefixLower,
                        numStr: matchA[2],
                        rest: matchA[3] || ""
                    };
                }
            }

            // If prefix not valid/matched, check if it starts with just a number
            if (!parsed) {
                const matchB = titlePart.match(justNumberRegex);
                if (matchB) {
                    parsed = {
                        hasPrefix: false,
                        prefix: "",
                        prefixLower: "",
                        numStr: matchB[1],
                        rest: matchB[2] || ""
                    };
                }
            }

            if (parsed) {
                // If it is a level 1 heading and falls under LECTURE_PREFIXES or has no prefix
                if (level === 1) {
                    if (!parsed.hasPrefix || LECTURE_PREFIXES.has(parsed.prefixLower)) {
                        const p = parsed.hasPrefix ? parsed.prefixLower : 'chapter';
                        lecturePrefixCounts[p] = (lecturePrefixCounts[p] || 0) + 1;
                    }
                }
                matches.push({
                    index: i,
                    level: level,
                    parsed: parsed,
                    hashes: hashes
                });
            }
        }
    }

    // Determine the most common lecture prefix
    let mostCommonLecturePrefix = '';
    let maxCount = 0;
    for (const [prefix, count] of Object.entries(lecturePrefixCounts)) {
        if (count > maxCount) {
            maxCount = count;
            mostCommonLecturePrefix = prefix;
        }
    }

    if (mostCommonLecturePrefix) {
        mostCommonLecturePrefix = mostCommonLecturePrefix.charAt(0).toUpperCase() + mostCommonLecturePrefix.slice(1);
    } else {
        mostCommonLecturePrefix = 'Chapter'; // Default fallback
    }

    // Second pass: renumber headings sequentially and hierarchically
    const currentNums = Array(10).fill(0);
    let lectureCounter = 0;
    const specialCounters = {};
    let mainTopicRenumberedCount = 0;
    let subtopicRenumberedCount = 0;
    const specialStats = {};

    for (const item of matches) {
        const { index, level, parsed, hashes } = item;

        if (level >= currentNums.length) {
            continue; // Ignore excessively deep headings
        }

        if (level === 1) {
            // Main topic heading (Level 1)
            let chosenPrefix = '';
            let assignedNumber = 0;

            if (!parsed.hasPrefix || LECTURE_PREFIXES.has(parsed.prefixLower)) {
                // Lecture topic
                lectureCounter++;
                assignedNumber = lectureCounter;
                chosenPrefix = mostCommonLecturePrefix;
            } else if (SPECIAL_PREFIXES.has(parsed.prefixLower)) {
                // Special section (Lab, Assignment, etc.)
                const pLower = parsed.prefixLower;
                specialCounters[pLower] = (specialCounters[pLower] || 0) + 1;
                assignedNumber = specialCounters[pLower];
                // Keep original prefix name properly capitalized
                chosenPrefix = parsed.prefix.charAt(0).toUpperCase() + parsed.prefix.slice(1).toLowerCase();
                
                specialStats[chosenPrefix] = (specialStats[chosenPrefix] || 0) + 1;
            }

            // Set current level 1 number and reset child levels
            currentNums[1] = assignedNumber;
            for (let i = 2; i < currentNums.length; i++) {
                currentNums[i] = 0;
            }

            const cleanTitle = cleanTitleText(parsed.rest);
            lines[index] = `${hashes} ${chosenPrefix} ${assignedNumber}${cleanTitle ? ': ' + cleanTitle : ''}`;
            mainTopicRenumberedCount++;
        } else {
            // Subtopic heading (Level > 1)
            currentNums[level]++;

            // Reset all levels below the current level to 0
            for (let i = level + 1; i < currentNums.length; i++) {
                currentNums[i] = 0;
            }

            // Ensure parent levels are initialized to at least 1 if they are 0
            for (let i = 1; i < level; i++) {
                if (currentNums[i] === 0) {
                    currentNums[i] = 1;
                }
            }

            const cleanTitle = cleanTitleText(parsed.rest);
            const hierarchicalNumber = currentNums.slice(1, level + 1).join('.');
            lines[index] = `${hashes} ${hierarchicalNumber}${cleanTitle ? ' ' + cleanTitle : ''}`;
            subtopicRenumberedCount++;
        }
    }

    // Write back with appropriate newline
    const joinChar = hasCRLF ? '\r\n' : '\n';
    fs.writeFileSync(filePath, lines.join(joinChar), 'utf8');

    // Build detailed stats output
    let statsStr = `${lectureCounter} lecture topics (using prefix '${mostCommonLecturePrefix}')`;
    const specialParts = Object.entries(specialStats).map(([pref, cnt]) => `${cnt} ${pref}s`);
    if (specialParts.length > 0) {
        statsStr += ` and special sections: ${specialParts.join(', ')}`;
    }

    console.log(`Success: Renumbered ${mainTopicRenumberedCount} main topics (${statsStr}) and ${subtopicRenumberedCount} subtopics sequentially.`);
}

const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error("Usage: node rearrange.js <file-path>");
    process.exit(1);
}

rearrangeHeadings(args[0]);
