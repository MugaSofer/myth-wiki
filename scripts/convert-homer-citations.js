#!/usr/bin/env node
/**
 * Convert Homer file-line citations to standard book-and-line numbers.
 *
 * The wiki citations use Gutenberg source file line numbers (e.g., "Iliad III.1975")
 * instead of standard Greek verse line numbers (e.g., "Iliad 3.380").
 *
 * This script uses proportional mapping: for each file line within a book,
 * it calculates the proportion of the way through the book and maps to
 * the corresponding standard Greek line number. Accuracy is typically ±5-15 lines.
 */

const fs = require('fs');
const path = require('path');

// Book boundaries (file line numbers where each book starts)
const ILIAD_BOOKS = [
  { book: 1,  start: 185,   roman: 'I' },
  { book: 2,  start: 780,   roman: 'II' },
  { book: 3,  start: 1619,  roman: 'III' },
  { book: 4,  start: 2059,  roman: 'IV' },
  { book: 5,  start: 2578,  roman: 'V' },
  { book: 6,  start: 3454,  roman: 'VI' },
  { book: 7,  start: 3959,  roman: 'VII' },
  { book: 8,  start: 4407,  roman: 'VIII' },
  { book: 9,  start: 4944,  roman: 'IX' },
  { book: 10, start: 5573,  roman: 'X' },
  { book: 11, start: 6153,  roman: 'XI' },
  { book: 12, start: 6965,  roman: 'XII' },
  { book: 13, start: 7396,  roman: 'XIII' },
  { book: 14, start: 8202,  roman: 'XIV' },
  { book: 15, start: 8708,  roman: 'XV' },
  { book: 16, start: 9427,  roman: 'XVI' },
  { book: 17, start: 10014, roman: 'XVII' },
  { book: 18, start: 10445, roman: 'XVIII' },
  { book: 19, start: 10911, roman: 'XIX' },
  { book: 20, start: 11293, roman: 'XX' },
  { book: 21, start: 11748, roman: 'XXI' },
  { book: 22, start: 12295, roman: 'XXII' },
  { book: 23, start: 12757, roman: 'XXIII' },
  { book: 24, start: 13496, roman: 'XXIV' },
];
const ILIAD_END = 14381; // approx end of text

// Standard Greek line counts per book (Iliad)
const ILIAD_LINES = [
  611, 877, 461, 544, 909, 529, 482, 565, 713, 579,
  848, 471, 837, 522, 746, 867, 761, 617, 424, 503,
  611, 515, 897, 804
];

const ODYSSEY_BOOKS = [
  { book: 1,  start: 719,   roman: 'I' },
  { book: 2,  start: 1166,  roman: 'II' },
  { book: 3,  start: 1614,  roman: 'III' },
  { book: 4,  start: 2109,  roman: 'IV' },
  { book: 5,  start: 2973,  roman: 'V' },
  { book: 6,  start: 3470,  roman: 'VI' },
  { book: 7,  start: 3797,  roman: 'VII' },
  { book: 8,  start: 4139,  roman: 'VIII' },
  { book: 9,  start: 4731,  roman: 'IX' },
  { book: 10, start: 5307,  roman: 'X' },
  { book: 11, start: 5893,  roman: 'XI' },
  { book: 12, start: 6525,  roman: 'XII' },
  { book: 13, start: 6976,  roman: 'XIII' },
  { book: 14, start: 7429,  roman: 'XIV' },
  { book: 15, start: 7950,  roman: 'XV' },
  { book: 16, start: 8516,  roman: 'XVI' },
  { book: 17, start: 9021,  roman: 'XVII' },
  { book: 18, start: 9683,  roman: 'XVIII' },
  { book: 19, start: 10145, roman: 'XIX' },
  { book: 20, start: 10749, roman: 'XX' },
  { book: 21, start: 11183, roman: 'XXI' },
  { book: 22, start: 11645, roman: 'XXII' },
  { book: 23, start: 12175, roman: 'XXIII' },
  { book: 24, start: 12545, roman: 'XXIV' },
];
const ODYSSEY_END = 13100; // approx end of text

// Standard Greek line counts per book (Odyssey)
const ODYSSEY_LINES = [
  444, 434, 497, 847, 493, 331, 347, 586, 566, 574,
  640, 453, 440, 533, 557, 481, 606, 428, 604, 394,
  434, 501, 372, 548
];

function findBook(fileLine, books, fileEnd) {
  for (let i = books.length - 1; i >= 0; i--) {
    if (fileLine >= books[i].start) {
      return {
        bookNum: books[i].book,
        bookStart: books[i].start,
        bookEnd: (i < books.length - 1) ? books[i + 1].start : fileEnd,
        roman: books[i].roman,
        index: i
      };
    }
  }
  return null;
}

function fileLineToStandard(fileLine, work) {
  const books = work === 'iliad' ? ILIAD_BOOKS : ODYSSEY_BOOKS;
  const fileEnd = work === 'iliad' ? ILIAD_END : ODYSSEY_END;
  const stdLines = work === 'iliad' ? ILIAD_LINES : ODYSSEY_LINES;

  const book = findBook(fileLine, books, fileEnd);
  if (!book) return null;

  const fileOffset = fileLine - book.bookStart;
  const fileBookLen = book.bookEnd - book.bookStart;
  const proportion = fileOffset / fileBookLen;
  const stdLine = Math.round(proportion * stdLines[book.index]);

  return {
    book: book.bookNum,
    line: Math.max(1, stdLine),
    roman: book.roman
  };
}

function convertCitation(match, work) {
  // Parse file line numbers from the citation
  // Formats: "III.1975-1982" or "III.1975" or "1975-1982" or "1975"
  const result = fileLineToStandard(parseInt(match), work);
  if (!result) return null;
  return result;
}

// Roman numeral to integer
function romanToInt(roman) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100 };
  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const curr = map[roman[i]];
    const next = map[roman[i + 1]];
    if (next && curr < next) {
      result -= curr;
    } else {
      result += curr;
    }
  }
  return result;
}

// Scan wiki files and convert citations
function processFiles(wikiDir, dryRun = true) {
  const changes = [];

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        processFile(fullPath, changes);
      }
    }
  }

  function processFile(filePath, changes) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Pattern 1: "Iliad ROMAN.FILELINE-FILELINE" or "Iliad ROMAN.FILELINE"
    // Pattern 2: "Odyssey ROMAN.FILELINE-FILELINE" or "Odyssey ROMAN.FILELINE"
    // Pattern 3: "Iliad FILELINE-FILELINE" (no book number, just raw line)
    // Pattern 4: "Odyssey FILELINE-FILELINE"

    // Handle Iliad with Roman numerals
    content = content.replace(
      /Iliad ((?:X{0,3})(IX|IV|V?I{0,3}))\.(\d+)(?:-(\d+))?/g,
      (match, roman, _sub, startStr, endStr) => {
        const startLine = parseInt(startStr);
        const start = fileLineToStandard(startLine, 'iliad');
        if (!start) return match;

        // Verify book matches
        const expectedBook = romanToInt(roman);
        if (start.book !== expectedBook) {
          // Book mismatch - might not be a file line citation
          // Check if the number is already a reasonable standard line number
          if (startLine <= ILIAD_LINES[expectedBook - 1]) {
            return match; // Already standard
          }
        }

        let result = `Iliad ${start.book}.${start.line}`;
        if (endStr) {
          const end = fileLineToStandard(parseInt(endStr), 'iliad');
          if (end && end.line !== start.line) {
            result += `-${end.line}`;
          }
        }

        if (result !== match) {
          changes.push({ file: filePath, from: match, to: result });
          modified = true;
        }
        return result;
      }
    );

    // Handle Odyssey with Roman numerals
    content = content.replace(
      /Odyssey ((?:X{0,3})(IX|IV|V?I{0,3}))\.(\d+)(?:-(\d+))?/g,
      (match, roman, _sub, startStr, endStr) => {
        const startLine = parseInt(startStr);
        const start = fileLineToStandard(startLine, 'odyssey');
        if (!start) return match;

        const expectedBook = romanToInt(roman);
        if (start.book !== expectedBook) {
          if (startLine <= ODYSSEY_LINES[expectedBook - 1]) {
            return match; // Already standard
          }
        }

        let result = `Odyssey ${start.book}.${start.line}`;
        if (endStr) {
          const end = fileLineToStandard(parseInt(endStr), 'odyssey');
          if (end && end.line !== start.line) {
            result += `-${end.line}`;
          }
        }

        if (result !== match) {
          changes.push({ file: filePath, from: match, to: result });
          modified = true;
        }
        return result;
      }
    );

    // Handle bare line numbers: "Odyssey 9894-9897" (no book/Roman prefix)
    // These are file line numbers > max single-book line count
    content = content.replace(
      /Odyssey (\d{4,5})(?:-(\d{4,5}))?/g,
      (match, startStr, endStr) => {
        const startLine = parseInt(startStr);
        // Only convert if it looks like a file line number (> ~700, which is start of Book I)
        if (startLine < 700) return match;

        const start = fileLineToStandard(startLine, 'odyssey');
        if (!start) return match;

        let result = `Odyssey ${start.book}.${start.line}`;
        if (endStr) {
          const end = fileLineToStandard(parseInt(endStr), 'odyssey');
          if (end && !(end.book === start.book && end.line === start.line)) {
            if (end.book === start.book) {
              result += `-${end.line}`;
            } else {
              result += `-${end.book}.${end.line}`;
            }
          }
        }

        if (result !== match) {
          changes.push({ file: filePath, from: match, to: result });
          modified = true;
        }
        return result;
      }
    );

    // Handle bare Iliad line numbers
    content = content.replace(
      /Iliad (\d{3,5})(?:-(\d{3,5}))?(?!\.\d)/g,
      (match, startStr, endStr) => {
        const startLine = parseInt(startStr);
        if (startLine < 185) return match; // Before Book I
        // Check if this looks like a standard citation already (book.line format would have been caught earlier)
        // If number is small enough to be a standard line number for some book, skip
        if (startLine < 910) return match; // Could be a valid standard line for any book

        const start = fileLineToStandard(startLine, 'iliad');
        if (!start) return match;

        let result = `Iliad ${start.book}.${start.line}`;
        if (endStr) {
          const end = fileLineToStandard(parseInt(endStr), 'iliad');
          if (end && !(end.book === start.book && end.line === start.line)) {
            if (end.book === start.book) {
              result += `-${end.line}`;
            } else {
              result += `-${end.book}.${end.line}`;
            }
          }
        }

        if (result !== match) {
          changes.push({ file: filePath, from: match, to: result });
          modified = true;
        }
        return result;
      }
    );

    if (modified && !dryRun) {
      fs.writeFileSync(filePath, content, 'utf8');
    }

    return content;
  }

  walkDir(wikiDir);
  return changes;
}

// Main
const wikiDir = path.join(__dirname, '..', 'wiki');
const dryRun = process.argv.includes('--apply') ? false : true;

console.log(dryRun ? '=== DRY RUN (use --apply to write changes) ===' : '=== APPLYING CHANGES ===');
console.log();

const changes = processFiles(wikiDir, dryRun);

// Group by file
const byFile = {};
for (const c of changes) {
  const rel = path.relative(wikiDir, c.file);
  if (!byFile[rel]) byFile[rel] = [];
  byFile[rel].push(c);
}

let totalChanges = 0;
for (const [file, fileChanges] of Object.entries(byFile).sort()) {
  console.log(`${file}:`);
  for (const c of fileChanges) {
    console.log(`  ${c.from}  →  ${c.to}`);
    totalChanges++;
  }
}

console.log();
console.log(`Total: ${totalChanges} citations across ${Object.keys(byFile).length} files`);
