Skip to content

Slidev
Main Navigation

📖 Guide

✨ Features

Reference



Resources




Menu
On this page
Sidebar Navigation
Guide
Why Slidev

Getting Started

Syntax Guide

User Interface

Animations

Theme & Addons

Components

Layouts

Exporting

Hosting

FAQ

Advanced
Global Context

Writing Layouts

Writing Themes

Writing Addons

Customizations
Configurations

Directory Structure

Configure Highlighter

Configure Vite and Plugins

Configure Vue App

Configure UnoCSS

Configure Code Runners

Configure Transformers

Configure Monaco

Configure KaTeX

Configure Mermaid

Configure Routes

Configure Shortcuts

Configure Context Menu

Configure Fonts

Configure Pre-Parser

Built-in
CLI

Components

Layouts

Resources
Showcases

Theme Gallery

Addon Gallery

Learning Resources

Curated Covers

Release Notes

FAQ
Assets Handling
You may use static assets like images and videos in your slides. Since Slidev is based on Vite, you can import them directly in your markdown files.

URLs that can be statically analyzed as assets can use relative paths:


![alt](./image.png)
<img src="./image.png" />
In the above case, the URLs will be resolved to /BASE_URL/assets/image.png after build.

However, relative paths in frontmatter and other components will be broken after build:


---
background: ./image.png  # Broken after build
---

<Comp src="./image.png" />
In the above case, the URLs are not statically analyzable and will be preserved as-is, which will result in 404 errors after build.

To solve this, you can place these assets in the public folder and use an absolute path to import them:


---
background: /image.png
---

<Comp src="/image.png" />
For more details, refer to Vite's documentation.

Positioning
Since Slidev is web-based, CSS is the primary way to position elements. Here are some useful tips for position elements:

Grids And Flexboxes
You can use CSS Grids to create complex layouts:


Two columns

Complex case

<div class="grid grid-cols-2 gap-4">
  <div>
    The first column
  </div>
  <div>
    The second column
  </div>
</div>
And use Flexboxes to create more responsive layouts:


Horizontal

Vertical

<div class="flex items-center">
  <div>
    First block
  </div>
  <div>
    Second block
  </div>
</div>
Learn more: CSS Grids, flexboxes, or even Masonry.

Absolute Position
You can use UnoCSS to position elements absolutely:


<div class="absolute left-30px bottom-30px">
  This is a left-bottom aligned footer
</div>
Or use the draggable elements feature:

✨ Draggable Elements
✨ Draggable Elements
Move, resize, and rotate elements by dragging them with the mouse.
Adjust Sizes
Adjust all slides's size:
✨ Slide Canvas Size
✨ Slide Canvas Size
Set the size for all your slides.
Adjust several slides' size:
✨ Zoom Slides
✨ Zoom Slides
Zoom the content of a slide to a specific scale.
Adjust some elements' size:
✨ The `Transform` Component
✨ The `Transform` Component
A component for scaling some elements.
Suggest changes to this page
Pager
Previous page
Hosting
Next page
Global Context