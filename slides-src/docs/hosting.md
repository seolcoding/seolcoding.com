uilding and Hosting
Slidev is designed to run as a web server when you are editing or presenting your slides. However, after the presentation, you may still want to share your interactive slides with others. This guide will show you how to build and host your slides.

Build as a SPA
You can build the slides into a static Single-page application (SPA) via the following command:

slidev build
By default, the generated files are placed in the dist folder. You can test the built version of you slides by running: npx vite preview or any other static server.

Base Path
To deploy your slides under sub-routes, you need to pass the --base option. The --base path must begin and end with a slash /. For example:

slidev build --base /talks/my-cool-talk/
Refer to Vite's documentation for more details.

Output directory
You can change the output directory using --out.

slidev build --out my-build-folder
Remove speaker notes
If you are sharing the built slides publicly and don't want to include your speaker notes, run the build with --without-notes:

slidev build --without-notes
Multiple Builds
You can build multiple slide decks in one go by passing multiple markdown files as arguments:

slidev build slides1.md slides2.md
Or if your shell supports it, you can use a glob pattern:

slidev build \*.md
In this case, each input file will generate a folder containing the build in the output directory.

Examples
Here are a few examples of the exported SPA:

Demo Slides
Composable Vue by Anthony Fu
More in Showcases
Options
✨ Generate PDF when Building
✨ Generate PDF when Building
Generate a downloadable PDF along with your slides build.
✨ Bundle Remote Assets
✨ Bundle Remote Assets
Download and bundle remote assets when building your slides.
Hosting
We recommend using npm init slidev@latest to scaffold your project, which contains the necessary configuration files for hosting services out-of-the-box.

GitHub Pages
To deploy your slides on GitHub Pages via GitHub Actions, follow these steps:

In your repository, go to Settings > Pages. Under Build and deployment, select GitHub Actions. (Do not choose Deploy from a branch and upload the dist directory, which is not recommended.)
Create .github/workflows/deploy.yml with the following content to deploy your slides to GitHub Pages via GitHub Actions.
Commit and push the changes to your repository. The GitHub Actions workflow will automatically deploy your slides to GitHub Pages every time you push to the main branch.
You can access your slides at https://<username>.github.io/<repository-name>/.
Netlify
Create netlify.toml in your project root with the following content:

Then go to your Netlify dashboard and create a new site with the repository.

Vercel
Create vercel.json in your project root with the following content:

Then go to your Vercel dashboard and create a new site with the repository.

Host on Docker
If you need a rapid way to run a presentation with containers, you can use the prebuilt docker image maintained by tangramor, or build your own.
