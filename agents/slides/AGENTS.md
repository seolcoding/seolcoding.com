# Repository Guidelines

## Project Structure & Module Organization
The latest Slidev deck lives in `slidev/slides.md`; keep every section self-contained so exported formats remain stable. Custom Vue components, layouts, and macros belong in `slidev/components/`, while reusable Markdown or code samples should go to `slidev/snippets/`. Static assets (images, fonts, videos) load from `public/` to keep Markdown light. Reference material for layouts, animations, and theming stays under `docs/` (start with `docs/BEST_PRACTICES.md` before touching slides). Archived or alternate versions (`v3_academic`, `v4_final`, `2026_ai_agent`) are read-only exemplars—do not back-port changes there without explicit approval.

## Build, Test, and Development Commands
- `pnpm install` – install the pinned Slidev toolchain defined by `pnpm-lock.yaml`.
- `pnpm dev` – launch Slidev locally with auto-reload and the built-in presenter UI (`slidev --open`).
- `pnpm build` – emit the production-ready static bundle to `.output` for Vercel/Netlify.
- `pnpm export` – generate a PDF; pass `--format png` or `--with-toc` for alternate deliverables.
Always run commands inside the `slidev/` directory so Slidev resolves the theme dependencies correctly.

## Coding Style & Naming Conventions
Slides mix Markdown, Frontmatter, and Vue SFC blocks—prefer Markdown-first authoring, only dropping into `<script setup>` inside fences when reactivity is required. Use two-space indentation for Markdown lists and Vue templates to match Slidev defaults. Name custom components in PascalCase (`components/BigNumber.vue`) and import them via `<BigNumber />` with `setup` auto-registration. Global configuration (theme, fonts, transition) belongs in the root frontmatter block of `slides.md`; keep keys alphabetized for scanning. Follow the `docs/layouts.md` canon before introducing bespoke CSS, and avoid raw HTML grids unless a supplied layout cannot express the design.

## Testing Guidelines
The project relies on manual verification rather than automated tests. Before opening a PR, run `pnpm dev` to click through every slide, verifying transitions, Mermaid diagrams, and `v-click` sequences. Use `pnpm export` to confirm the PDF renders without clipped content; spot-check speaker notes in the exported file. For behavioral experiments, create a temporary branch-specific slide under `slides.md` using `layout: notes` so reviewers can trace test scenarios without polluting the final deck.

## Commit & Pull Request Guidelines
Use Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, `docs:`) so change history doubles as release notes. Commits should focus on one narrative (e.g., “feat: add hiring metrics slide”) and mention slide numbers when relevant. Every PR needs: a summary describing the storyline change, clear testing notes (e.g., “pnpm dev, pnpm export”), screenshots for visual tweaks, and links to any tracking issue or brief. If the PR adjusts shared docs under `docs/`, call that out so other presenters can re-sync their local knowledge base. Avoid force-pushing after review begins unless rebasing is strictly necessary.
