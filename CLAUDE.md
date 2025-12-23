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

- **Framework**: Hugo v0.147+ (Extended)
- **Theme**: CareerCanvas (Git submodule in `themes/`) - NEVER edit directly
- **Styling**: Tailwind CSS via Hugo Pipes
- **Content**: Korean-only (`content/ko/`), no /ko/ URL prefix

Override theme by copying to project layouts:
```bash
cp themes/careercanvas/layouts/partials/nav.html layouts/partials/nav.html
```

## Directory Structure

```
seolcoding.com/
├── config.toml          # Hugo main config
├── content/ko/          # Korean content
│   ├── about.md         # Profile section
│   ├── awards.md        # Awards (6)
│   ├── certifications.md # Certifications (8)
│   ├── blog/            # Blog posts
│   ├── courses/         # Courses
│   ├── projects/        # Projects
│   └── services/        # Services (dev/edu/consulting)
├── layouts/             # Theme overrides
├── static/              # Static files
│   ├── images/          # awards/, certifications/, qr/
│   ├── mini-apps/       # prompt-tutorial build
│   └── files/           # Resume PDF
└── themes/careercanvas/ # Theme (submodule - DO NOT edit)
```

## Deployment

GitHub Actions on push to `main`:
1. Build Hugo site with `--minify`
2. Deploy to GitHub Pages (seolcoding.com)

## Key Constraints

- **Theme submodule**: Never edit `themes/careercanvas/` directly
- **Hugo server**: Often runs in background on localhost:1313
- **Korean content**: Use word-break: keep-all for proper wrapping
- **External links**: Menu items for apps/slides point to external domains

## Archived Content

- `agents/slides/` - Slides (archived, git-ignored, kept locally)
