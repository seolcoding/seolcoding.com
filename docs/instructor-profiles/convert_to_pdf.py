#!/usr/bin/env python3
"""
Markdown to PDF converter using weasyprint
"""
import sys
import os

try:
    from weasyprint import HTML, CSS
    from weasyprint.text.fonts import FontConfiguration
except ImportError:
    print("weasyprint not installed. Installing...")
    os.system("pip3 install weasyprint")
    from weasyprint import HTML, CSS
    from weasyprint.text.fonts import FontConfiguration

# Read HTML file
html_file = "02_표준형_이력서.html"
pdf_file = "02_표준형_이력서.pdf"

# Custom CSS for better formatting
css = CSS(string="""
    @page {
        size: A4;
        margin: 2cm;
    }
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #333;
    }
    h1 {
        font-size: 24pt;
        margin-bottom: 0.2em;
        border-bottom: 2px solid #333;
        padding-bottom: 0.3em;
    }
    h2 {
        font-size: 16pt;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        color: #444;
    }
    strong {
        color: #000;
    }
    hr {
        border: none;
        border-top: 1px solid #ccc;
        margin: 1em 0;
    }
    ul {
        margin: 0.5em 0;
        padding-left: 1.5em;
    }
    li {
        margin: 0.3em 0;
    }
""")

font_config = FontConfiguration()

# Convert HTML to PDF
html = HTML(filename=html_file)
html.write_pdf(pdf_file, stylesheets=[css], font_config=font_config)

print(f"✅ PDF 생성 완료: {pdf_file}")
