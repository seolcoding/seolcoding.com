# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

SeolCoding.com is a **Hugo portfolio website** with Tailwind CSS styling.

| Component | Path | Tech |
|-----------|------|------|
| **Website** | `/` (root) | Hugo + Tailwind |
| **Prompt Tutorial** | `static/mini-apps/prompt-tutorial/` | Pre-built React app |

## Commands

```bash
npm install              # Tailwind CSS deps
hugo server -D           # Dev server (localhost:1313)
npm run build            # Production build (hugo --gc --minify)
git submodule update --init --recursive  # Theme
```

## Architecture

- **Framework**: Hugo v0.152+ (Extended)
- **Theme**: CareerCanvas (Git submodule in `themes/`) - NEVER edit directly
- **Styling**: Tailwind CSS via Hugo Pipes
- **Content**: Korean-only (`content/ko/`), no /ko/ URL prefix
- **Diagram**: `docs/architecture.excalidraw`

Override theme by copying to project layouts:
```bash
cp themes/careercanvas/layouts/partials/nav.html layouts/partials/nav.html
```

## Directory Structure

```
seolcoding.com/
├── .github/workflows/       # CI/CD (GitHub Actions)
├── archetypes/              # Hugo content templates
├── assets/                  # Source files (CSS, JS)
│   ├── css/                 # Tailwind source
│   └── js/                  # JavaScript source
├── content/ko/              # Korean content (Markdown)
│   ├── about.md             # Profile section
│   ├── awards.md            # Awards (6)
│   ├── certifications.md    # Certifications (8)
│   ├── blog/                # Blog posts
│   ├── courses/             # Courses
│   ├── projects/            # Projects
│   └── services/            # Services (dev/edu/consulting)
├── docs/                    # Documentation
│   └── architecture.excalidraw
├── i18n/                    # Internationalization
├── layouts/                 # Theme overrides
│   ├── _default/
│   ├── homepage/
│   └── partials/
├── static/                  # Static files (copied as-is)
│   ├── files/               # Resume PDF, downloads
│   ├── images/              # awards/, certifications/, qr/
│   ├── mini-apps/           # prompt-tutorial (React build)
│   └── busan_edu_db/        # Busan education DB
├── themes/careercanvas/     # Theme (Git submodule - DO NOT edit)
├── config.toml              # Hugo main config
├── package.json             # Node.js dependencies (Tailwind)
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── CLAUDE.md                # This file
```

## Deployment

GitHub Actions on push to `main`:
1. Install Hugo Extended v0.152.2
2. Install Node.js dependencies (Tailwind)
3. Build with `hugo --minify`
4. Deploy to GitHub Pages (seolcoding.com)

## Key Constraints

- **Theme submodule**: Never edit `themes/careercanvas/` directly
- **Hugo server**: Often runs in background on localhost:1313
- **Korean content**: Use word-break: keep-all for proper wrapping
- **External links**: Menu items for apps/slides point to external domains
- **Build artifacts**: `public/` and `resources/` are git-ignored

## Git-Ignored Directories

- `public/` - Hugo build output
- `resources/` - Hugo cache
- `node_modules/` - npm packages
- `.DS_Store` - macOS metadata
