#!/bin/bash

# Setup Git hooks for this repository
# Run this once after cloning: ./scripts/setup-hooks.sh

echo "🔧 Setting up Git hooks..."

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Git pre-commit hook: Auto-convert PDFs to PNGs
# This hook runs automatically before every commit

echo "🔍 Checking for PDF files..."

# Check if any PDF files are staged
PDF_CHANGES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(pdf|PDF)$' || true)

if [ -n "$PDF_CHANGES" ]; then
  echo "📄 PDF files detected in commit:"
  echo "$PDF_CHANGES"
  echo ""
  echo "🔄 Running PDF to PNG conversion..."

  npm run convert:pdf

  if [ $? -eq 0 ]; then
    echo "✅ PDF conversion successful"
    echo ""
    echo "📌 Adding generated PNG files to commit..."

    # Add generated PNG files to the commit
    git add static/images/awards/*.png static/images/certifications/*.png 2>/dev/null || true

    echo "✅ Done! PNG files added to commit"
  else
    echo "❌ PDF conversion failed"
    echo "💡 Run 'npm run convert:pdf' manually to debug"
    exit 1
  fi
else
  echo "✅ No PDF files in this commit"
fi

echo ""
exit 0
EOF

# Make hook executable
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks installed successfully!"
echo ""
echo "📝 What this does:"
echo "   - Automatically converts PDFs to PNGs before each commit"
echo "   - Only runs when PDF files are staged"
echo "   - Adds generated PNGs to the commit automatically"
echo ""
echo "💡 To test: Add a PDF file and run 'git commit'"
