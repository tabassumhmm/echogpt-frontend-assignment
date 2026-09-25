# EchoGPT frontend assignment

EchoGPT is a frontend demo with three connected pages. The demo runs on your computer and stores data in the browser.

- `/` is the marketing landing page.
- `/workspace` is the chat workspace for several AI models.
- `/extension` is a simulator for a Chrome extension.

The demo is local-first (it runs on your computer and stores data in the browser). It uses fixed responses and browser storage. It has no backend, no login, no live AI provider, no payment, and no packaged Chrome extension.

## Before you start

Install Node.js. Use a version that Next.js 16 supports. Install pnpm 10.15.0, because `package.json` declares that version.

You do not need an API key. You do not need an environment variable for local use.

## Run the project locally

Do these steps in order.

1. Install the packages.

   ```bash
   pnpm install
   ```

2. Start the server for development.

   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

To build the production version and serve it, run:

```bash
pnpm build
pnpm start
```

## Pages

### `/`

The landing page shows the product. It provides:

- A hero section with a product preview in the browser
- A list of features
- A catalog of AI models
- A section that answers "Why EchoGPT?"
- A pricing section
- A questions and answers section
- A call to action and a footer

### `/workspace`

The workspace is where you chat with AI models. It provides:

- A separate conversation history for each model
- Actions to search, start a chat, rename a chat, pin a chat, and delete a chat
- Import and export of the workspace history
- Prompts to start a new conversation
- Fixed responses with a typing indicator, a stop button, and a regenerate button
- Panels for context and model selection

### `/extension`

The `/extension` page is a simulator. It is not a packaged browser extension. It provides:

- A chat tab and a settings tab
- Model selection
- A text box that stands in for the text of a web page
- Six quick actions: summarize, rewrite, translate, explain code, brainstorm, and generate image
- A separate conversation history for each action
- Keyboard shortcuts
- A button to clear the history and a button to reset everything
- A popup layout on desktop and a full width layout on mobile

## Data and privacy

The demo stores data in `localStorage` under a versioned key. The workspace and the extension keep separate histories. They share preferences such as the theme and the default model.

The workspace can import and export its history as JSON. The export does not include extension sessions. A global reset clears the data on both pages.

The demo does not send a network request. The demo makes sure that the imported data is valid before it accepts the data.

## Technologies

The project uses these tools:

- Next.js 16 with the App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS 4
- shadcn/ui and Radix UI
- `motion` for animation
- `lucide-react` for icons
- Playwright for browser tests
- `@axe-core/playwright` for accessibility tests
- Biome and ESLint to find code problems
- pnpm as the package manager

## Tests and evidence

Run these steps before you submit the project.

1. Run the full local test.

   ```bash
   pnpm verify
   ```

2. Run the browser tests.

   ```bash
   pnpm test:e2e
   ```

3. Save the test evidence and the accessibility results.

   ```bash
   pnpm test:e2e:evidence
   ```

The Playwright configuration starts the local server for you when `E2E_BASE_URL` is not set. To test a deployed version, set `E2E_BASE_URL` to the URL of that version.

The test evidence files are in these locations:

- `Screenshots/evidence-checklist.md`
- `Screenshots/`
- `e2e/evidence/latest-run.json`

The saved evidence shows that the tests pass on the three pages and four screen sizes. The saved evidence also shows no serious or critical accessibility errors. Run the tests again after you change the code.

## Accessibility

The project includes these features:

- Landmarks for the page structure and a skip link
- Controls that work with a keyboard and a visible focus outline
- Labels on dialogs and form controls
- The Escape key closes dialogs
- Support for reduced motion
- Light, dark, and system themes
- Layouts for phones, tablets, and desktops
- Browser tests for horizontal overflow on each page

The automated tests find some accessibility errors. A person must still review the pages by hand.

## Project structure and repository

The main folders are:

```text
src/app/page.tsx                         Landing page
src/app/workspace/                       Workspace UI and state
src/app/extension/                       Extension simulator UI and state
src/lib/storage/                         Versioned local persistence and import/export
src/components/marketing/               Landing-page interactive sections
e2e/                                     Playwright journeys and evidence reporter
Screenshots/                             Evidence screenshots and architecture assets
```

The source repository is at [github.com/tabassumhmm/echogpt-frontend-assignment](https://github.com/tabassumhmm/echogpt-frontend-assignment).

The live demo URL is not in this file yet. TODO: add the deployed Vercel, Netlify, or similar URL before you submit.

Before you submit, make sure that the GitHub repository is public. Before you submit, make sure that you open the deployed URL in a browser. Do not test only the version on your own computer.

## Known limitations

The demo has these limits:

- The responses are fixed. They do not call a live model.
- The `/extension` page has no Chrome manifest, no service worker, and no Chrome APIs.
- The project has no Lighthouse report and no Core Web Vitals report.
- The accessibility evidence covers only the serious and critical errors from the automated tests. It is not a full WCAG review.
