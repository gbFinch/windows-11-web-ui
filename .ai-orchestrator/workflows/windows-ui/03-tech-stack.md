---
agent: tech-stack
sequence: 3
references: ["01-vision.md", "02-research.md"]
summary: "React 18 with TypeScript 5.x, Vite 5.x, CSS Modules, and @fluentui/react-icons. A pure frontend stack with no backend, database, or server infrastructure — optimized for pixel-accurate Windows 11 UI recreation with component-level extensibility. The primary trade-off is accepting the @fluentui/react-icons dependency for exact icon fidelity over the lighter react-icons alternative."
---

## 1. Stack Overview

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Language | TypeScript | 5.x | Static typing for component props and interfaces |
| Runtime | Node.js | 20 LTS | Development server and build tooling |
| UI Framework | React | 18.x | Component-based UI rendering |
| Build Tool | Vite | 5.x | Dev server with HMR and optimized production builds |
| Styling | CSS Modules | (built into Vite) | Component-scoped styles with zero runtime overhead |
| Icons | @fluentui/react-icons | 2.x | Official Microsoft Fluent UI icons matching Windows 11 |
| Test Runner | Vitest | 1.x | Unit testing with native Vite integration |
| Linter | ESLint | 9.x | Code quality and consistency |
| Formatter | Prettier | 3.x | Consistent code formatting |
| Package Manager | npm | 10.x | Dependency management (ships with Node.js 20) |

This is a pure frontend stack with no backend, database, or server-side rendering. The project is a static single-page application that renders a Windows 11 desktop UI entirely in the browser. React provides the component architecture needed for extensibility (G-5), TypeScript enforces typed callback props, CSS Modules deliver component-scoped styling with zero runtime cost, and @fluentui/react-icons provides exact Windows 11 icon fidelity (G-4).

The stack philosophy is "minimal and precise" — every technology is included because it directly serves a project requirement, not because it is conventional. There is no state management library (useState suffices), no routing library (single-page desktop), no CSS-in-JS runtime (CSS Modules are build-time), and no backend framework (no server needed).

## 2. Selection Criteria

| Criterion | Weight | Source | Definition |
|-----------|--------|--------|------------|
| Visual Fidelity | 5 | G-4 | Technology enables pixel-accurate reproduction of Windows 11 design tokens |
| Extensibility | 5 | G-5 | Technology supports typed callback props and component composition for future features |
| Zero Runtime Overhead | 4 | Guiding Principle 1 | Styling and icon solutions add no JavaScript runtime cost |
| Developer Experience | 3 | Constraint: Vite | Fast HMR, clear error messages, minimal configuration |
| Bundle Size | 3 | Performance | Total bundle stays under 500KB gzipped for fast initial load |
| Type Safety | 3 | Constraint: TypeScript | All component interfaces are statically typed |
| Maintenance Health | 2 | Risk mitigation | Technology is actively maintained with regular releases |

## 3. Language and Runtime

- **Selected**: TypeScript 5.x
- **Runtime**: Node.js 20 LTS (development only — no server-side runtime in production)
- **Type System**: Static. TypeScript's static types enforce the callback prop interfaces (e.g., `onClick?: () => void`) that make every component extensible. Without static types, a developer adding actions in v2 would have no IDE guidance on available props.
- **Rationale**:
  1. Typed component props are essential for extensibility (G-5) — TypeScript interfaces document every callback a component accepts
  2. Vite has first-class TypeScript support with zero configuration (Constraint: Vite)
  3. React's type definitions (`@types/react`) are mature and comprehensive
  4. Catches prop type errors at build time rather than runtime
  5. CSS Module type declarations (`.module.css.d.ts`) prevent referencing non-existent class names
- **Ecosystem Fit**: React, Vite, Vitest, ESLint, and @fluentui/react-icons all have native TypeScript support. No `@types/*` shims needed for core dependencies.
- **Team Impact**: TypeScript is the standard for React projects. No additional learning curve for a React developer.
- **Risks**: TypeScript adds build step complexity, but Vite handles this transparently. No meaningful risk for this project.

## 4. Framework Selection

### 4.1 React 18.x
- **Purpose**: Component-based UI framework for rendering the Windows 11 desktop
- **Selected**: React 18.x (with react-dom)
- **Rationale**: React's component model directly maps to the Windows 11 UI hierarchy (Desktop → DesktopIcon, Taskbar → TaskbarIcon, etc.). Props-based architecture enables the callback extensibility pattern required by G-5. React 18's concurrent features are not needed for v1 but provide a future performance path.
- **Integration**: Vite's `@vitejs/plugin-react` provides JSX transform, HMR, and optimized builds. TypeScript `.tsx` files are handled natively.
- **Configuration Approach**: Default Vite React template configuration. No custom Babel plugins or webpack overrides.
- **Risks**: None for this project scope. React 18 is the most stable and widely-deployed frontend framework.

### 4.2 @fluentui/react-icons 2.x
- **Purpose**: Icon library providing exact Windows 11 Fluent UI System Icons
- **Selected**: @fluentui/react-icons 2.x
- **Rationale**: Research finding 3.5 confirmed this is the only library with exact Windows 11 icon fidelity. The ~1KB/icon premium over react-icons is negligible for ~30 icons total (~30KB). Official Microsoft maintenance ensures icons stay current with Windows updates.
- **Integration**: Tree-shakeable ESM imports. Each icon is a React component: `import { WindowsRegular } from '@fluentui/react-icons'`. Works with TypeScript natively.
- **Configuration Approach**: No configuration needed. Import individual icons as needed.
- **Risks**: Some Windows 11 shell-specific icons (Recycle Bin, This PC) may not be in the Fluent UI set. Mitigation: create custom SVG components for any missing icons.

### 4.3 Vitest 1.x
- **Purpose**: Unit testing framework
- **Selected**: Vitest 1.x with @testing-library/react
- **Rationale**: Native Vite integration means shared configuration (tsconfig, module resolution, CSS Modules). Vitest uses the same transform pipeline as the dev server, eliminating configuration drift between dev and test environments. Jest would require separate configuration for CSS Modules and TypeScript.
- **Integration**: Shares `vite.config.ts`. Supports React Testing Library for component tests. CSS Module imports are automatically mocked.
- **Configuration Approach**: Add `test` config to `vite.config.ts`. Use jsdom environment for DOM testing.
- **Risks**: None. Vitest 1.x is stable and widely adopted.

## 5. Data Layer

No data layer is required. This is a pure frontend application with no persistent data, no user accounts, no API calls, and no server-side state. All state (selected icon ID, Start Menu open/closed) is ephemeral React component state via `useState`.

If a future version requires persistent state (e.g., desktop icon positions, user preferences), `localStorage` would be the first option before introducing a database.

## 6. Infrastructure and Deployment

### 6.1 Vite Dev Server (Development)
- **Purpose**: Local development with hot module replacement
- **Selected**: Vite 5.x built-in dev server
- **Rationale**: Ships with Vite, zero configuration. Provides instant HMR for CSS and React components.
- **Integration**: `npm run dev` starts the server on `localhost:5173`
- **Cost Model**: Free (local development)
- **Risks**: None

### 6.2 Static File Hosting (Production)
- **Purpose**: Serve the built static files (HTML, CSS, JS, assets)
- **Selected**: Any static hosting (Vite `build` produces a `dist/` folder)
- **Rationale**: The project is a static SPA. `npm run build` produces optimized static files that can be served from any web server, CDN, or static hosting service (GitHub Pages, Netlify, Vercel, S3+CloudFront).
- **Integration**: `vite build` outputs to `dist/`. No server-side rendering or API routes.
- **Cost Model**: Free tier available on most static hosting platforms
- **Risks**: No vendor lock-in — the output is standard HTML/CSS/JS

## 7. Developer Tooling

| Tool | Purpose | Selected | Rationale |
|------|---------|----------|-----------|
| Package Manager | Dependency management | npm 10.x | Ships with Node.js 20 LTS. No additional install. pnpm would save disk space but adds setup friction for contributors. |
| Linter | Code quality | ESLint 9.x + @eslint/js + typescript-eslint | Catches type errors and React-specific issues (hooks rules, prop validation). ESLint 9 flat config is simpler than legacy .eslintrc. |
| Formatter | Code style | Prettier 3.x | Eliminates formatting debates. Single-line config. Chosen over Biome because Prettier has broader editor integration. |
| Test Runner | Test execution | Vitest 1.x | Native Vite integration, shared config, fast execution. Chosen over Jest because Jest requires separate CSS Module and TypeScript configuration. |
| Build Tool | Dev server + production build | Vite 5.x | Instant HMR, native TypeScript/CSS Modules support, optimized production builds. Chosen over webpack because Vite requires zero configuration for this stack. |

## 8. Compatibility Matrix

| Technology A | Technology B | Compatibility | Notes |
|-------------|-------------|---------------|-------|
| TypeScript 5.x | React 18.x | Confirmed | @types/react and @types/react-dom provide complete type coverage |
| TypeScript 5.x | Vite 5.x | Confirmed | Vite transpiles TypeScript natively via esbuild |
| React 18.x | Vite 5.x | Confirmed | @vitejs/plugin-react provides JSX transform and HMR |
| CSS Modules | Vite 5.x | Confirmed | Built-in support, no plugin needed. `.module.css` convention. |
| CSS Modules | TypeScript 5.x | Confirmed | Vite generates `.module.css.d.ts` type declarations |
| @fluentui/react-icons 2.x | React 18.x | Confirmed | Icons are React components, peer dependency on React 16+ |
| @fluentui/react-icons 2.x | TypeScript 5.x | Confirmed | Ships with TypeScript declarations |
| Vitest 1.x | Vite 5.x | Confirmed | Shares vite.config.ts, same transform pipeline |
| Vitest 1.x | React 18.x | Confirmed | Via @testing-library/react and jsdom environment |
| ESLint 9.x | TypeScript 5.x | Confirmed | Via typescript-eslint parser and plugin |
| Prettier 3.x | ESLint 9.x | Confirmed | Via eslint-config-prettier to disable conflicting rules |

## 9. Rejected Alternatives

| Rejected Technology | Role | Reason for Rejection | Would Reconsider If |
|--------------------|------|---------------------|---------------------|
| react-icons | Icon library | Limited Fluent UI icon coverage; icons are from VS Code set, not Windows 11 shell set (Research 3.5). Fails G-4 visual fidelity requirement. | @fluentui/react-icons is discontinued or react-icons adds full Fluent UI System Icons |
| styled-components | CSS scoping | Adds 12KB runtime overhead for style computation. CSS Modules achieve the same scoping with zero runtime cost (Research 3.6). Violates "Zero Runtime Overhead" criterion. | Project requires heavily dynamic prop-based styling beyond CSS custom properties |
| Tailwind CSS | CSS framework | Utility classes make pixel-accurate custom styling harder. Cannot directly map Windows 11 design tokens to semantic class names (Research 3.6). Fails "Visual Fidelity" criterion. | Project shifts from pixel-accurate recreation to rapid prototyping |
| Next.js | React framework | Adds server-side rendering, routing, and API routes — none of which are needed. Increases complexity without benefit for a static SPA. Violates "minimal and precise" stack philosophy. | Project adds server-side features (authentication, API, SSR) |
| Jest | Test runner | Requires separate configuration for CSS Modules (moduleNameMapper) and TypeScript (ts-jest or babel-jest). Vitest shares Vite's config natively (Section 4.3). | Project migrates away from Vite |
| pnpm | Package manager | Saves disk space but requires separate installation. npm ships with Node.js and is sufficient for a project with ~10 dependencies. | Project grows to 50+ dependencies where disk/install speed matters |
| Emotion | CSS-in-JS | 7KB runtime overhead. Same rejection rationale as styled-components — CSS Modules are sufficient and zero-cost. | Same as styled-components |
