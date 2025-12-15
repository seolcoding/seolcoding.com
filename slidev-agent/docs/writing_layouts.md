Skip to content

Slidev
Main Navigation

📖 Guide

✨ Features

Reference



Resources




Menu
Return to top
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

Writing Layouts
Please read 📖 Layouts📖 Layouts first.

To create a custom layout, simply create a new Vue file in the layouts directory:


your-slidev/
  ├── ...
  ├── slides.md
  └── layouts/
      ├── ...
      └── MyLayout.vue
Layouts are Vue components, so you can use all the features of Vue in them.

In the layout component, use <slot/> (the default slot) for the slide content:

default.vue

<template>
  <div class="slidev-layout default">
    <slot />
  </div>
</template>
You can also have named slots for more complex layouts:

split.vue

<template>
  <div class="slidev-layout split">
    <div class="left">
      <slot name="left" />
    </div>
    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>
And then use it with ✨ Slot Sugar for Layouts✨ Slot Sugar for Layouts.

Suggest changes to this page
Pager
Previous page
Global Context
Next page
Writing Themesk