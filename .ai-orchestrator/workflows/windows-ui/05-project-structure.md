---
agent: project-structure
sequence: 5
references: ["03-tech-stack.md", "04-architecture.md"]
summary: "Feature-based component structure with co-located CSS Modules and a shared theme/data layer. 4 top-level src directories: components (grouped by UI region), data (static content arrays), styles (global theme), and types (shared interfaces). All 15 architecture components map to individual component directories."
---

## 1. Structure Overview

**Pattern**: Feature-based component grouping. Components are organized by UI region (Desktop, Taskbar, StartMenu) rather than by file type (all CSS in one folder, all components in another). This was chosen because the architecture defines 3 clear UI regions with distinct component subtrees — grouping by region keeps related files together and matches the mental model of the application.

**Principles**:
1. Co-location: Each component's `.tsx`, `.module.css`, and test file live in the same directory
2. Flat within groups: Component directories are at most 1 level deep within their region group — no deeply nested folders
3. Shared code is explicit: Only theme variables and TypeScript interfaces live in shared directories; no "utils" grab-bag
4. Data is separate from presentation: Static content arrays (icon lists, app lists) live in `data/`, not inside components

**Framework Conventions**: Follows standard Vite + React conventions — `index.html` at root, `src/main.tsx` as entry point, `public/` for static assets. CSS Modules use the `.module.css` suffix recognized by Vite natively.

**Architecture Mapping**: The 3 top-level component groups (Desktop, Taskbar, StartMenu) map directly to the 3 regions in the architecture diagram. Each architecture component (2.1–2.15) maps to a named component directory.

## 2. Directory Tree

```
windows-11-web-ui/
├── public/                              # Static assets served as-is
│   └── favicon.svg                      # Windows logo favicon
├── src/                                 # Application source code
│   ├── components/                      # All React components, grouped by UI region
│   │   ├── Desktop/                     # Desktop region (Architecture: 2.2 Desktop)
│   │   │   ├── Desktop.tsx              # Desktop container component
│   │   │   ├── Desktop.module.css       # Desktop styles (wallpaper, icon grid layout)
│   │   │   ├── DesktopIcon.tsx          # Single desktop icon (Architecture: 2.3)
│   │   │   └── DesktopIcon.module.css   # Desktop icon styles (selection highlight)
│   │   ├── Taskbar/                     # Taskbar region (Architecture: 2.4 Taskbar)
│   │   │   ├── Taskbar.tsx              # Taskbar container component
│   │   │   ├── Taskbar.module.css       # Taskbar styles (acrylic, layout)
│   │   │   ├── StartButton.tsx          # Start button (Architecture: 2.5)
│   │   │   ├── StartButton.module.css   # Start button styles
│   │   │   ├── TaskbarIcon.tsx          # Single taskbar icon (Architecture: 2.6)
│   │   │   ├── TaskbarIcon.module.css   # Taskbar icon styles (hover highlight, tooltip)
│   │   │   ├── SystemTray.tsx           # System tray container (Architecture: 2.7)
│   │   │   ├── SystemTray.module.css    # System tray styles (pill group)
│   │   │   ├── Clock.tsx               # Live clock (Architecture: 2.8)
│   │   │   └── Clock.module.css        # Clock styles
│   │   └── StartMenu/                   # Start Menu region (Architecture: 2.9 StartMenu)
│   │       ├── StartMenu.tsx            # Start Menu container with animation
│   │       ├── StartMenu.module.css     # Start Menu styles (acrylic, positioning)
│   │       ├── SearchBar.tsx            # Search input (Architecture: 2.10)
│   │       ├── SearchBar.module.css     # Search bar styles
│   │       ├── PinnedApps.tsx           # Pinned apps grid (Architecture: 2.11)
│   │       ├── PinnedApps.module.css    # Pinned apps grid styles
│   │       ├── AppTile.tsx              # Single app tile (Architecture: 2.12)
│   │       ├── AppTile.module.css       # App tile styles
│   │       ├── RecommendedSection.tsx   # Recommended section (Architecture: 2.13)
│   │       ├── RecommendedSection.module.css
│   │       ├── RecommendedItem.tsx      # Single recommended item (Architecture: 2.14)
│   │       ├── RecommendedItem.module.css
│   │       ├── UserPowerRow.tsx         # User/power bottom row (Architecture: 2.15)
│   │       └── UserPowerRow.module.css
│   ├── data/                            # Static content arrays (Architecture: Section 3)
│   │   ├── desktopIcons.tsx             # Desktop icon definitions
│   │   ├── taskbarIcons.tsx             # Taskbar icon definitions
│   │   ├── pinnedApps.tsx               # Start Menu pinned app definitions
│   │   └── recommendedItems.tsx         # Start Menu recommended items
│   ├── styles/                          # Global styles and theme
│   │   ├── theme.css                    # CSS custom properties (Windows 11 dark theme tokens)
│   │   └── global.css                   # Reset, font-face, body styles
│   ├── types/                           # Shared TypeScript interfaces
│   │   └── index.ts                     # All shared types (DesktopIconData, AppTileData, etc.)
│   ├── App.tsx                          # Root component (Architecture: 2.1 App)
│   ├── App.module.css                   # Root layout styles
│   └── main.tsx                         # Vite entry point, renders App
├── tests/                               # Test files
│   ├── components/                      # Component tests mirror src/components structure
│   │   ├── Desktop/
│   │   │   ├── Desktop.test.tsx
│   │   │   └── DesktopIcon.test.tsx
│   │   ├── Taskbar/
│   │   │   ├── Taskbar.test.tsx
│   │   │   ├── StartButton.test.tsx
│   │   │   ├── TaskbarIcon.test.tsx
│   │   │   ├── SystemTray.test.tsx
│   │   │   └── Clock.test.tsx
│   │   └── StartMenu/
│   │       ├── StartMenu.test.tsx
│   │       ├── PinnedApps.test.tsx
│   │       └── AppTile.test.tsx
│   └── setup.ts                         # Test setup (jsdom, testing-library config)
├── index.html                           # Vite HTML entry point
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
├── tsconfig.node.json                   # TypeScript config for Vite config file
├── vite.config.ts                       # Vite build configuration
├── eslint.config.js                     # ESLint flat config
├── .prettierrc                          # Prettier configuration
├── .gitignore                           # Git ignore rules
└── README.md                            # Project documentation
```

## 3. Module Organization

### Module: components/Desktop
- **Architecture Component**: 2.2 Desktop, 2.3 DesktopIcon
- **Responsibility**: Renders the desktop surface with wallpaper and selectable shortcut icons
- **Public API**: `Desktop` component (default export from Desktop.tsx), `DesktopIcon` component
- **Internal Structure**: Desktop.tsx (container with grid layout), DesktopIcon.tsx (individual icon), co-located CSS Modules
- **Dependencies**: `types/` (DesktopIconData), `styles/theme.css` (via CSS custom properties)
- **Test Strategy**: Unit tests in `tests/components/Desktop/` — test icon rendering, selection state, background click deselection

### Module: components/Taskbar
- **Architecture Component**: 2.4 Taskbar, 2.5 StartButton, 2.6 TaskbarIcon, 2.7 SystemTray, 2.8 Clock
- **Responsibility**: Renders the bottom taskbar with Start button, app icons, and system tray
- **Public API**: `Taskbar` component (default export from Taskbar.tsx)
- **Internal Structure**: Taskbar.tsx (container), StartButton.tsx, TaskbarIcon.tsx, SystemTray.tsx, Clock.tsx, co-located CSS Modules
- **Dependencies**: `types/` (TaskbarIconData), `styles/theme.css`
- **Test Strategy**: Unit tests in `tests/components/Taskbar/` — test Start button click, clock formatting, tooltip rendering

### Module: components/StartMenu
- **Architecture Component**: 2.9 StartMenu, 2.10 SearchBar, 2.11 PinnedApps, 2.12 AppTile, 2.13 RecommendedSection, 2.14 RecommendedItem, 2.15 UserPowerRow
- **Responsibility**: Renders the Start Menu overlay with search, pinned apps, recommended items, and user/power row
- **Public API**: `StartMenu` component (default export from StartMenu.tsx)
- **Internal Structure**: StartMenu.tsx (container with animation), SearchBar.tsx, PinnedApps.tsx, AppTile.tsx, RecommendedSection.tsx, RecommendedItem.tsx, UserPowerRow.tsx, co-located CSS Modules
- **Dependencies**: `types/` (AppTileData, RecommendedItemData), `styles/theme.css`
- **Test Strategy**: Unit tests in `tests/components/StartMenu/` — test open/close state, pinned apps grid rendering, app tile click callbacks

### Module: data
- **Architecture Component**: Architecture Section 3 (Data Model — static arrays)
- **Responsibility**: Defines all static content displayed in the UI (icon lists, app lists, recommended items)
- **Public API**: Named exports of typed arrays: `desktopIcons`, `taskbarIcons`, `pinnedApps`, `recommendedItems`
- **Internal Structure**: One file per data category, each exporting a typed constant array
- **Dependencies**: `types/` (data interfaces), `@fluentui/react-icons` (icon components used in data definitions)
- **Test Strategy**: No tests — static data. Type safety enforced by TypeScript.

### Module: styles
- **Architecture Component**: Architecture Section 5 (Technology Choices — CSS Custom Properties), Research Finding 3.2 (design tokens)
- **Responsibility**: Defines the global Windows 11 dark theme and CSS reset
- **Public API**: CSS custom properties available globally (e.g., `var(--surface-primary)`)
- **Internal Structure**: theme.css (all design tokens), global.css (reset + font + body)
- **Dependencies**: None
- **Test Strategy**: No tests — visual verification only

### Module: types
- **Architecture Component**: Architecture Section 3 (Data Model interfaces)
- **Responsibility**: Defines shared TypeScript interfaces used across components and data
- **Public API**: Named exports: `DesktopIconData`, `TaskbarIconData`, `AppTileData`, `RecommendedItemData`
- **Internal Structure**: Single `index.ts` file with all shared interfaces
- **Dependencies**: None
- **Test Strategy**: No tests — type definitions only

## 4. Naming Conventions

### Directories
- **Rule**: PascalCase for component group directories (matching React component naming), camelCase for non-component directories
- **Examples**: `Desktop/`, `StartMenu/`, `Taskbar/` (component groups); `data/`, `styles/`, `types/`, `tests/` (non-component)
- **Exceptions**: `node_modules/`, `public/` — framework conventions

### Files
- **Source Files (Components)**: `PascalCase.tsx` — matches the component name exported from the file. Example: `DesktopIcon.tsx` exports `DesktopIcon`
- **Source Files (CSS Modules)**: `PascalCase.module.css` — matches the component file. Example: `DesktopIcon.module.css`
- **Source Files (Data)**: `camelCase.tsx` — describes the data content. Example: `desktopIcons.tsx`, `pinnedApps.tsx`
- **Source Files (Types)**: `camelCase.ts` — `index.ts` for the shared types barrel
- **Test Files**: `PascalCase.test.tsx` — matches the component being tested. Example: `DesktopIcon.test.tsx`
- **Configuration Files**: Framework-conventional names. Example: `vite.config.ts`, `tsconfig.json`, `eslint.config.js`

### Code Entities
- **Components**: PascalCase. Examples: `Desktop`, `DesktopIcon`, `StartMenu`
- **Props Interfaces**: PascalCase with `Props` suffix. Examples: `DesktopProps`, `DesktopIconProps`, `TaskbarIconProps`
- **Data Interfaces**: PascalCase with `Data` suffix. Examples: `DesktopIconData`, `AppTileData`
- **Functions**: camelCase. Examples: `handleIconSelect`, `formatTime`
- **Constants (data arrays)**: camelCase. Examples: `desktopIcons`, `pinnedApps`, `taskbarIcons`
- **CSS Module classes**: camelCase. Examples: `styles.container`, `styles.iconLabel`, `styles.isSelected`
- **CSS Custom Properties**: kebab-case with category prefix. Examples: `--color-surface-primary`, `--color-accent`, `--radius-medium`, `--shadow-flyout`

## 5. File Placement Rules

| File Type | Location | Rule | Example |
|-----------|----------|------|---------|
| React component | `src/components/[Region]/` | Component goes in its UI region group | `src/components/Desktop/DesktopIcon.tsx` |
| CSS Module | `src/components/[Region]/` | Co-located with its component, same name | `src/components/Desktop/DesktopIcon.module.css` |
| Static data array | `src/data/` | One file per data category | `src/data/desktopIcons.tsx` |
| Shared TypeScript interface | `src/types/index.ts` | All shared interfaces in one barrel file | `src/types/index.ts` |
| Global CSS | `src/styles/` | Theme tokens and reset only | `src/styles/theme.css` |
| Unit test | `tests/components/[Region]/` | Mirrors src/components structure | `tests/components/Desktop/DesktopIcon.test.tsx` |
| Test setup | `tests/` | Test configuration and utilities | `tests/setup.ts` |
| Build config | Project root | Framework-conventional location | `vite.config.ts` |
| Static asset | `public/` | Files served without processing | `public/favicon.svg` |

## 6. Dependency Rules

```
Allowed Dependencies:
  components/[Region]/*  -->  types/          (components import shared interfaces)
  components/[Region]/*  -->  styles/         (via CSS custom properties, not JS imports)
  components/[Region]/*  -->  data/           (only App.tsx imports data to pass as props)
  data/*                 -->  types/          (data files import interfaces for type safety)
  data/*                 -->  @fluentui/react-icons  (data files reference icon components)
  App.tsx                -->  components/*/   (App imports top-level region components)
  App.tsx                -->  data/           (App imports static data arrays)

Forbidden Dependencies:
  components/Desktop/*   -/->  components/Taskbar/*    (regions do not import from each other)
  components/Desktop/*   -/->  components/StartMenu/*  (regions do not import from each other)
  components/Taskbar/*   -/->  components/StartMenu/*  (regions do not import from each other)
  types/                 -/->  components/             (types must not depend on components)
  styles/                -/->  components/             (styles must not depend on components)
  data/                  -/->  components/             (data must not depend on components)
```

Cross-region communication flows through App.tsx via props — never via direct imports between regions. This ensures each region can be developed and tested independently.

## 7. Configuration Files

| File | Location | Purpose | Generated by Scaffolding |
|------|----------|---------|------------------------|
| `package.json` | Root | Dependencies, scripts (`dev`, `build`, `test`, `lint`) | Yes |
| `tsconfig.json` | Root | TypeScript compiler options (strict mode, JSX, paths) | Yes |
| `tsconfig.node.json` | Root | TypeScript config for vite.config.ts | Yes |
| `vite.config.ts` | Root | Vite dev server and build config, React plugin, test config | Yes |
| `eslint.config.js` | Root | ESLint 9 flat config with TypeScript and React rules | Yes |
| `.prettierrc` | Root | Prettier formatting rules (single quotes, trailing commas) | Yes |
| `.gitignore` | Root | Ignores node_modules, dist, .env, build artifacts | Yes |
| `index.html` | Root | Vite HTML entry point, mounts React app | Yes |
| `README.md` | Root | Project description, setup instructions, architecture overview | Yes |

## 8. Key File Descriptions

### `src/main.tsx`
- **Purpose**: Application entry point. Mounts the React app to the DOM.
- **Contents**: Imports `App`, imports `styles/global.css` and `styles/theme.css`, calls `ReactDOM.createRoot().render(<App />)`
- **Dependencies**: `App.tsx`, `styles/global.css`, `styles/theme.css`
- **Depended On By**: `index.html` (via Vite script tag)
- **Architecture Reference**: Entry point for the entire application

### `src/App.tsx`
- **Purpose**: Root component owning global state and rendering the 3 UI regions
- **Contents**: `selectedIconId` and `isStartMenuOpen` state, event handlers, renders Desktop + Taskbar + StartMenu
- **Dependencies**: `components/Desktop/Desktop`, `components/Taskbar/Taskbar`, `components/StartMenu/StartMenu`, `data/*`, `types/`
- **Depended On By**: `main.tsx`
- **Architecture Reference**: Architecture 2.1 (App)

### `src/styles/theme.css`
- **Purpose**: Defines all Windows 11 dark theme design tokens as CSS custom properties
- **Contents**: `:root` block with ~40 custom properties for colors, spacing, radii, shadows, typography, and animation durations
- **Dependencies**: None
- **Depended On By**: Every CSS Module file (via `var()` references)
- **Architecture Reference**: G-6 (CSS custom property system), Research Finding 3.2 (design tokens)

### `src/types/index.ts`
- **Purpose**: Central barrel file for all shared TypeScript interfaces
- **Contents**: `DesktopIconData`, `TaskbarIconData`, `AppTileData`, `RecommendedItemData` interfaces
- **Dependencies**: None
- **Depended On By**: All component files and data files
- **Architecture Reference**: Architecture Section 3 (Data Model)

### `src/data/desktopIcons.tsx`
- **Purpose**: Defines the 5 desktop shortcut icons displayed on the desktop
- **Contents**: Typed array of `DesktopIconData` with Fluent UI icon components and labels
- **Dependencies**: `types/`, `@fluentui/react-icons`
- **Depended On By**: `App.tsx` (passes to Desktop as props)
- **Architecture Reference**: Architecture DD-3 (static data arrays)

### `vite.config.ts`
- **Purpose**: Vite build tool configuration
- **Contents**: React plugin, test configuration (jsdom environment, setup file path), build options
- **Dependencies**: `@vitejs/plugin-react`, `vitest`
- **Depended On By**: `npm run dev`, `npm run build`, `npm run test`
- **Architecture Reference**: Tech Stack Section 7 (Developer Tooling)
