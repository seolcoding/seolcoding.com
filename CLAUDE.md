# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

SeolCoding.com hosts a **Hugo portfolio website** and **prompt-tutorial app**:

| Component | Path | Tech |
|-----------|------|------|
| **Website** | `agents/website/` | Hugo + Tailwind |
| **Prompt Tutorial** | `agents/mini-apps/prompt-tutorial/` | React + Vite |

External sites (separate repos):
- apps.seolcoding.com (planned) - Mini-apps
- slides/lectures (planned) - Presentations & lectures

## Commands

### Website
```bash
cd agents/website
npm install              # Tailwind CSS deps
hugo server -D           # Dev server (localhost:1313)
npm run build            # Production build
git submodule update --init --recursive  # Theme
```

### Prompt Tutorial
```bash
cd agents/mini-apps/prompt-tutorial/web
npm install
npm run dev              # Dev server
npm run build            # Production build
```

### Root-level
```bash
npm run dev:website      # Hugo dev server
npm run dev:prompt       # prompt-tutorial dev
npm run build:all        # Build all
```

## Architecture

### Website (`agents/website/`)
- **Framework**: Hugo v0.147+ (Extended)
- **Theme**: CareerCanvas (Git submodule) - NEVER edit directly
- **Styling**: Tailwind CSS via Hugo Pipes
- **Content**: Korean-only (`content/ko/`), no /ko/ URL prefix

Override theme by copying to project layouts:
```bash
cp themes/careercanvas/layouts/partials/nav.html layouts/partials/nav.html
```

### Prompt Tutorial (`agents/mini-apps/prompt-tutorial/`)
- **Framework**: React + Vite
- **Purpose**: Interactive prompt engineering tutorial (12 chapters, 22 exercises)
- **URL**: seolcoding.com/mini-apps/prompt-tutorial/

## Deployment

GitHub Actions on push to `main`:
1. Build prompt-tutorial, copy to `agents/website/static/mini-apps/prompt-tutorial/`
2. Build Hugo site with `--minify`
3. Deploy to GitHub Pages (seolcoding.com)

## Key Constraints

- **Theme submodule**: Never edit `themes/careercanvas/` directly
- **Hugo server**: Often runs in background on localhost:1313
- **Korean content**: Use word-break: keep-all for proper wrapping
- **External links**: Menu items for apps/slides point to external domains
