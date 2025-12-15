# SeolCoding.com - Project Guide

## Quick Start

```bash
npm install          # Install dependencies (Tailwind CSS)
hugo server -D       # Start dev server at localhost:1313
npm run dev          # Alias for hugo server -D
npm run build        # Build for production
```

## Architecture

- **Framework**: Hugo v0.147+ (Extended)
- **Theme**: CareerCanvas (Git submodule)
- **Styling**: Tailwind CSS 3.4+
- **Language**: Korean (defaultContentLanguage = "ko")
- **Deploy**: GitHub Actions → GitHub Pages
- **Domain**: <https://seolcoding.com>

## Theme Customization Strategy

**⚠️ CRITICAL**: Theme is a Git submodule. NEVER modify `themes/careercanvas/` directly.

### Override Method

Copy theme files to project root:

```bash
cp themes/careercanvas/layouts/partials/contact.html layouts/partials/contact.html
```

Hugo priority: `layouts/` > `themes/careercanvas/layouts/`

## Current Customizations

### Content Structure

- **Korean-only site** (no /ko/ prefix in URLs)
- **Sections**: Projects, Courses, Blog
- **Front matter**: TOML (`+++`) for projects/courses, YAML (`---`) for blog posts
- **No _index.md** in blog/ directory (matches English template)

### Navigation Menu

**Menu order**: 프로젝트 | 강의 | 블로그 | 서비스(dropdown)

- "소개", "연락" removed from menu (accessible via hero section)
- i18n language switcher hidden (code preserved)
- Services dropdown with 3 demo links (open in new tab)

### Layout Overrides

1. **hero.html**: Added 3 service cards (교육, 멘토링, 개발) below social links
2. **about.html**: Removed LinkedIn button, added seolcoding_logo.png + 연락하기 button
3. **contact.html**: 3-column layout (Google Form QR | Kakao OpenChat QR | Contact Info)
4. **footer.html**: Simplified - removed description, removed collab tags, kept tagline/location/email/SNS only
5. **list.html**: Added lorem picsum placeholders for missing featured_image
6. **nav.html**: Dropdown hover support, services menu, hidden i18n switcher

### Key Config (config.toml)

```toml
defaultContentLanguage = "ko"
defaultContentLanguageInSubdir = false

# QR Contact URLs
google_form_url = "https://forms.gle/YOUR_GOOGLE_FORM_ID"
kakao_openchat_url = "https://open.kakao.com/YOUR_OPENCHAT_ID"

# Services menu with dropdown
[[languages.ko.menu.main]]
  name = "서비스"
  identifier = "services"
  [[languages.ko.menu.main]]
    name = "데모 서비스 1"
    parent = "services"
```

### i18n Translations (i18n/ko.toml)

Added translations for:

- Services section (services, educationService, mentoringService, developmentService)
- QR contact sections (googleForm, kakaoOpenChat, buttons)

## Static Assets Required

```
static/images/
├── seolcoding_logo.png        # About section logo
├── seoldonghun-profile.jpg    # Hero profile image
└── qr/
    ├── seolcoding_google_qr.png     # Contact QR code
    └── seolcoding_kakao_qr.png  # Contact QR code
```

## Deployment

GitHub Actions workflow deploys on push to main:

- Builds CSS with Tailwind
- Builds Hugo site with --minify
- Deploys to GitHub Pages (seolcoding.com)

## Common Commands

```bash
# Development
hugo server -D

# Full production build
npm run build

# Theme management
git submodule update --init --recursive
git submodule update --remote
```

## Important Notes

- Always test locally before pushing to main
- CSS is built via Hugo Pipes (PostCSS/Tailwind) during `npm run dev` / `npm run build`
- Theme updates may require re-applying customizations
- All Korean content in `content/ko/`
- hugo server is always running in background