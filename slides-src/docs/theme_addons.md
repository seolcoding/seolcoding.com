Theme and Addons
A slides project can have one theme and multiple addons. All of them can provide styles, components, layouts, and other configs to your slides project.

Use a Theme
Changing the theme in Slidev is surprisingly easy. All you need to do is to add the theme option in your headmatter:

---

## theme: seriph

# The first slide

You can find the list of official themes and community themes in the Themes Gallery.

Theme name convention

You can also pass a relative or absolute path to a local theme folder, like ../my-theme
You can always use the full package name as the theme name
If the theme is official or is named like slidev-theme-name, you can omit the slidev-theme- prefix
For scoped packages like @org/slidev-theme-name, the full package name is required
You can start the server and will be prompted to install the theme after a confirmation.

? The theme "@slidev/theme-seriph" was not found in your project, do you want to install it now? › (Y/n)
or install the theme manually via:

npm install @slidev/theme-seriph
And that's all, enjoy the new theme! For more details about the usage, you can refer to the theme's README.

See also:
✨ Eject Theme
✨ Eject Theme
Eject the installed theme from your project to customize it.
Use an Addon
Addons are similar to themes, but they are more flexible and can be used to add extra features to your slides project. You can add multiple addons to your project, and they can be used to add extra features to your slides project.

To use an addon, you can add the addons option in your headmatter:

---

addons:

- excalidraw
- '@slidev/plugin-notes'

---

You can find the list of official addons and community addons in the Addons Gallery.
