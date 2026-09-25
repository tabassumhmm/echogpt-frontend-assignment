# EchoGPT Completion Evidence

## Runtime and reproducibility

- Runtime: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, shadcn/Radix primitives, and Motion.
- Package manager: pnpm 10.15.0.
- Verification command:

```sh
docker run --rm --network host --user "$(id -u):$(id -g)" -e HOME=/tmp \
  -v "$PWD:/work" -w /work mcr.microsoft.com/playwright:v1.63.0-noble \
  sh -lc 'corepack pnpm verify && corepack pnpm test:e2e:evidence'
```

- `corepack pnpm verify`: passed Biome formatting, ESLint with zero warnings, source and test TypeScript checks, and `next build`.
- No backend, authentication, server data APIs, or live provider calls are used.

## Functional coverage

| Area | Evidence |
|---|---|
| Routes | `/`, `/workspace`, and `/extension` are covered by the E2E manifest. |
| Workspace | New conversation, model switch, send, stop, context panel, history, import, and export are exercised. |
| Extension | Six quick actions, session persistence, settings, isolated extension history, and global reset are exercised. |
| Persistence | Versioned `echogpt.demo.v1` localStorage stores separate `workspaceConversations` and `extensionSessions`, plus shared theme/model/stream/UI preferences. |
| Reset | Confirmed global reset clears both histories and shared preferences. |
| Responses | Local deterministic scripted responses support send, stop, model switching, and recognizable demo model IDs without provider calls. |
| Import/export | Versioned JSON import/export is validated and round-tripped by the storage layer and E2E journey. |

## Automated evidence

Source manifest: `e2e/evidence/latest-run.json`

- Result: **3 passed, 0 failed, 0 skipped**.
- Accessibility: **14** `@axe-core/playwright` scans, **0 serious/critical violations**.
- Routes: `/`, `/extension`, `/workspace`.
- Viewports: `360x800`, `768x1024`, `1024x768`, `1440x900`.
- Recorded states: default route, responsive workspace, workspace history/model/send/stop/import/export/context flow, and extension actions/history/settings/reset flow.
- Environment: Node `v22.23.3`, pnpm `10.15.0`, Chromium Playwright image `v1.63.0`.

## Visual evidence

All captures were reviewed for layout, hierarchy, responsive behavior, dark theme, and visible console/runtime health.

| Route | Mobile | Desktop |
|---|---|---|
| Landing | `Screenshots/landing-mobile.png` | `Screenshots/landing-desktop.png` |
| Workspace | `Screenshots/workspace-mobile.png` | `Screenshots/workspace-desktop.png` |
| Extension | `Screenshots/extension-mobile.png` | `Screenshots/extension-desktop.png` |

- Mobile capture size: `360x800`.
- Desktop capture size: `1440x900`.
- No route-specific horizontal page overflow was recorded.
- Screenshot directory is gitignored by the assignment repository; artifacts are preserved locally for review.

## Architecture evidence

- Source: `Screenshots/architecture.mmd`.
- Rendered artifact: `Screenshots/architecture.png`.
- The final visual review passed with all required labels legible and no clipping or overlap.
- The diagram shows the Next.js App Router root, all three routes, shared client modules, versioned browser localStorage, explicit global reset, deterministic responses, no backend/provider boundary, and the separate Playwright/axe/viewport/capture evidence rail.

## Final quality gates

- [x] Application verification passes.
- [x] E2E evidence run passes.
- [x] Accessibility scans pass without filtering.
- [x] Six route captures exist and were visually reviewed.
- [x] Architecture source and PNG exist and were visually reviewed.
- [x] No live provider or backend behavior was introduced.
- [x] Final Git status/diff inspection recorded after the last artifact write.
