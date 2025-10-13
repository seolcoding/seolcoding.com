const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Convert PDF files to PNG images (first page only)
 * Scans static/images/awards and static/images/certifications directories
 *
 * Note: Requires poppler-utils installed on system
 * - macOS: brew install poppler
 * - Ubuntu: apt-get install poppler-utils
 * - GitHub Actions: poppler-utils is pre-installed
 */

const DIRECTORIES = [
  'static/images/awards',
  'static/images/certifications'
];

async function convertPdfToPng(pdfPath) {
  try {
    console.log(`Converting: ${pdfPath}`);

    const dir = path.dirname(pdfPath);
    const basename = path.basename(pdfPath, '.pdf');
    const outputPath = path.join(dir, `${basename}.png`);

    // Use system pdftoppm directly for better compatibility and Korean font support
    // -png: output format
    // -f 1 -l 1: first page only
    // -scale-to 2048: high resolution
    // -singlefile: generate single file without page number suffix
    const command = `pdftoppm -png -f 1 -l 1 -scale-to 2048 -singlefile "${pdfPath}" "${path.join(dir, basename)}"`;

    execSync(command, { stdio: 'pipe' });

    if (fs.existsSync(outputPath)) {
      console.log(`  ✅ Created: ${outputPath}`);
      return true;
    } else {
      console.error(`  ❌ Generated file not found: ${outputPath}`);
      return false;
    }

  } catch (error) {
    console.error(`  ❌ Error converting ${pdfPath}:`, error.message);
    if (error.message.includes('pdftoppm: not found') || error.message.includes('command not found')) {
      console.error('  💡 Please install poppler-utils:');
      console.error('     macOS: brew install poppler');
      console.error('     Ubuntu: sudo apt-get install poppler-utils');
    }
    return false;
  }
}

async function scanAndConvertPdfs() {
  console.log('🔍 Scanning for PDF files...\n');

  let totalConverted = 0;
  let totalFailed = 0;

  for (const dir of DIRECTORIES) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      console.log(`📁 ${dir}: No PDF files found`);
      continue;
    }

    console.log(`📁 ${dir}: Found ${pdfFiles.length} PDF file(s)`);

    for (const pdfFile of pdfFiles) {
      const pdfPath = path.join(dir, pdfFile);
      const pngPath = path.join(dir, pdfFile.replace(/\.pdf$/i, '.png'));

      // Skip if PNG already exists and is newer than PDF
      if (fs.existsSync(pngPath)) {
        const pdfStat = fs.statSync(pdfPath);
        const pngStat = fs.statSync(pngPath);

        if (pngStat.mtime > pdfStat.mtime) {
          console.log(`  ⏭️  Skipping (PNG exists and is newer): ${pdfFile}`);
          continue;
        }
      }

      const success = await convertPdfToPng(pdfPath);
      if (success) {
        totalConverted++;
      } else {
        totalFailed++;
      }
    }

    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✨ Conversion complete!`);
  console.log(`   Converted: ${totalConverted}`);
  if (totalFailed > 0) {
    console.log(`   Failed: ${totalFailed}`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return totalFailed === 0;
}

// Run the script
scanAndConvertPdfs()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
