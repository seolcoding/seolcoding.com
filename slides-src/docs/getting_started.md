Getting Started
Slidev (slide + dev, /slaɪdɪv/) is a web-based slides maker and presenter. It's designed for developers to focus on writing content in Markdown. With the power of web technologies like Vue, you are able to deliver pixel-perfect designs with interactive demos to your presentation.

TIP

You can learn more about the rationale behind this project in 📖 Why Slidev📖 Why Slidev.

Create Slides
Try it Online
Start Slidev right in your browser with StackBlitz: sli.dev/new

Create Locally
Requires Node.js >= 18.0 installed.

Run the following command to create a new Slidev project locally:

pnpm

npm

yarn

bun

deno

# If you haven't installed pnpm

npm i -g pnpm

pnpm create slidev
Follow the prompts to start your slides project. The slides content is in slides.md, which initially includes demos of most the Slidev features. For more information about the Markdown syntax, please check 📖 Syntax Guide📖 Syntax Guide.

Basic Commands
Slidev provides a set of commands in its CLI. Here are some common ones:

slidev - Start the dev server. See the dev command.
slidev export - Export the slides to PDF, PPTX, or PNGs. See 📖 Exporting📖 Exporting.
slidev build - Build the slides as a static web application. See 📖 Hosting📖 Hosting.
slidev format - Format the slides. See the format command.
slidev --help - Show the help message
To run these commands, you can add them to your package.json scripts (which has been done for you if the project was created via npm init slidev):

package.json

{
"scripts": {
"dev": "slidev --open",
"build": "slidev build",
"export": "slidev export"
}
}
Then, you can simply run npm run dev, npm run build, and npm run export.

For more information about the CLI, please check the CLI guide.

Setup Your Editor
Since Slidev uses Markdown as the source entry, you can use any editor you prefer to create your slides. We also provide tools to help you edit you slides more conveniently:

✨ VS Code Extension
✨ VS Code Extension
Help you better organize your slides and have a quick overview of them.
✨ Integrated Editor
✨ Integrated Editor
Edit your slides source file alongside the presentation.
✨ Prettier Plugin
✨ Prettier Plugin
Use the Prettier plugin to format your slides.
Join the Community
It's recommended to join our official Discord Server to get help, share your slides, or discuss anything about Slidev.

If you're encountering bugs, feel free to open an issue on GitHub.

Tech Stack
Slidev is made possible by combining these tools and technologies.

Vite - An extremely fast frontend tooling
Vue 3 powered Markdown - Focus on the content while having the power of HTML and Vue components whenever needed
UnoCSS - On-demand utility-first CSS framework, style your slides at ease
Shiki, Monaco Editor - First-class code snippets support with live coding capability
RecordRTC - Built-in recording and camera view
VueUse family - @vueuse/core, @vueuse/head, @vueuse/motion, etc.
Iconify - Iconsets collection.
Drauu - Drawing and annotations support
KaTeX - LaTeX math rendering.
Mermaid - Textual Diagrams.

VS Code Extension
Slidev

Visual Studio Marketplace Version Visual Studio Marketplace Downloads
The VS Code extension provides some features to help you better organize your slides and have a quick overview of them.

Features
Preview slides in the side panel
Slides tree view
Re-ordering slides
Folding for slide blocks
Multiple slides project support
Start the dev server with one click

Installation
You can install the extension from the VS Code Marketplace or the Open VSX Registry.

Usage
Click the Slidev icon in the activity bar to open the Slidev panel. In the Slidev panel, you can see the projects tree view, slides tree view, and the preview webview.

In the projects tree view, you can see all the Slidev projects in your workspace. You can click the item to open the corresponding file, and click the icon over it to switch the active project. The icon allows you to load a slides project that wasn't scanned automatically.

In the slides tree view, you can see all the slides in the active project. You can click the item to move your cursor to the slide in the editor, and drag and drop to reorder the slides.

In the preview webview, you can click the icon to start the dev server and click the icon to open the slides in the browser. Toggle icon to sync/unsync the preview navigation with the editor cursor.

There are also some commands you can use. Type Slidev in the command palette to see them.

You can add glob patterns to the slidev.include configuration to include files as Slidev entries. The default value is ["**/*.md"]. Example:

{
"slidev.include": ["**/presentation.md"]
}
Dev Command
You can customize the command to start dev server by setting the slidev.dev-command configuration. The default value is npm exec -c 'slidev ${args}'.

The configured command can contain placeholders:

${args}: All CLI arguments. e.g. slides.md --port 3000 --remote
${port}: The port number. e.g. 3000
Examples:

Global installation: slidev ${args}
For PNPM users, you can set it to pnpm slidev ${args}.
For code-server users, you can set it to pnpm slidev ${args} --base /proxy/${port}/. This will make the dev server accessible at http://localhost:8080/proxy/3000/.
