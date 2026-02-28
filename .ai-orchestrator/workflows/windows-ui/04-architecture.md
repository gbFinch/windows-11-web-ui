---
agent: architecture
sequence: 4
references: ["01-vision.md", "02-research.md", "03-tech-stack.md"]
summary: "A component-based React architecture with a flat hierarchy: App shell manages global state (selected icon, Start Menu open) and renders three top-level regions — Desktop, Taskbar, and StartMenu. Each UI element is an isolated component with CSS Modules and typed callback props. No routing, no global state library, no data layer — state flows down via props, events flow up via callbacks."
---

## 1. Architecture Overview

The architecture follows a **component-tree pattern** — a single-page React application where the App component owns all shared state and passes it down to presentational components via props. There is no routing, no server communication, and no persistent data layer. The entire application is a tree of React components rendering a static desktop UI with two pieces of interactive state: which desktop icon is selected, and whether the Start Menu is open.

This pattern was chosen because:
- The UI has exactly 2 state variables — no state management library is justified (G-5 extensibility via props, not Redux)
- All components are presentational with optional callback props — the simplest possible architecture for future action injection
- CSS Modules enforce component isolation at the styling level (Guiding Principle 3: component isolation)

```
[App]
 ├── [Desktop]
 │    ├── [DesktopIcon] × 5
 │    └── (wallpaper background)
 ├── [Taskbar]
 │    ├── [StartButton]
 │    ├── [TaskbarIcon] × 4 (Search, TaskView, Widgets, pinned apps)
 │    └── [SystemTray]
 │         ├── [SystemTrayIconGroup] (Wi-Fi, Volume, Battery)
 │         ├── [Clock]
 │         └── [NotificationBell]
 └── [StartMenu] (conditionally rendered)
      ├── [SearchBar]
      ├── [PinnedApps]
      │    └── [AppTile] × 18
      ├── [RecommendedSection]
      │    └── [RecommendedItem] × 4
      └── [UserPowerRow]
```

## 2. Component Design

### 2.1 App
- **Responsibility**: Root component that owns global state and renders the three top-level regions
- **Public Interface**: None (root component)
- **Dependencies**: Desktop, Taskbar, StartMenu
- **Requirements Covered**: G-1 (desktop), G-2 (taskbar), G-3 (Start Menu)
- **Internal Structure**:
  - `selectedIconId: string | null` state — which desktop icon is selected
  - `isStartMenuOpen: boolean` state — Start Menu visibility
  - Click handler on root div to deselect icons and close Start Menu when clicking empty space

### 2.2 Desktop
- **Responsibility**: Renders the wallpaper background and a grid of desktop icons
- **Public Interface**:
  ```typescript
  interface DesktopProps {
    icons: DesktopIconData[];
    selectedIconId: string | null;
    onIconSelect: (id: string) => void;
    onIconDoubleClick?: (id: string) => void;
    onBackgroundClick: () => void;
  }
  ```
- **Dependencies**: DesktopIcon
- **Requirements Covered**: G-1 (desktop icons, selection), G-4 (wallpaper, spacing)
- **Internal Structure**: CSS Grid layout for icon positioning (vertical column, ~76px cells). Background is a CSS gradient matching Windows 11 Bloom wallpaper colors.

### 2.3 DesktopIcon
- **Responsibility**: Renders a single desktop shortcut icon with label and selection state
- **Public Interface**:
  ```typescript
  interface DesktopIconProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDoubleClick?: (id: string) => void;
  }
  ```
- **Dependencies**: None
- **Requirements Covered**: G-1 (click to select), G-4 (icon size 48×48, label 12px), G-5 (callback props)
- **Internal Structure**: Single div with icon + label. Click calls `onSelect`, double-click calls `onDoubleClick`. Selected state applies accent-color highlight via CSS class toggle.

### 2.4 Taskbar
- **Responsibility**: Renders the bottom taskbar containing Start button, app icons, and system tray
- **Public Interface**:
  ```typescript
  interface TaskbarProps {
    isStartMenuOpen: boolean;
    onStartClick: () => void;
    onTaskbarIconClick?: (id: string) => void;
  }
  ```
- **Dependencies**: StartButton, TaskbarIcon, SystemTray
- **Requirements Covered**: G-2 (taskbar layout, 48px height, acrylic effect)
- **Internal Structure**: Flexbox layout — left spacer, centered icon group, right-aligned system tray. Acrylic effect via `backdrop-filter`.

### 2.5 StartButton
- **Responsibility**: Renders the Windows 11 logo button that toggles the Start Menu
- **Public Interface**:
  ```typescript
  interface StartButtonProps {
    isActive: boolean;
    onClick: () => void;
  }
  ```
- **Dependencies**: None (uses @fluentui/react-icons for Windows logo)
- **Requirements Covered**: G-2 (Start button), G-3 (toggle Start Menu)
- **Internal Structure**: Button element with Windows logo icon. `isActive` applies a highlight style when Start Menu is open.

### 2.6 TaskbarIcon
- **Responsibility**: Renders a single taskbar app icon with tooltip
- **Public Interface**:
  ```typescript
  interface TaskbarIconProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    onClick?: (id: string) => void;
  }
  ```
- **Dependencies**: None
- **Requirements Covered**: G-2 (centered app icons), G-4 (40×40 hit target, 24×24 icon, hover highlight), G-5 (callback prop)
- **Internal Structure**: Button with icon, CSS tooltip on hover. Circular hover highlight (32px diameter).

### 2.7 SystemTray
- **Responsibility**: Renders the right-aligned system tray with grouped icons and clock
- **Public Interface**:
  ```typescript
  interface SystemTrayProps {
    onTrayClick?: (id: string) => void;
  }
  ```
- **Dependencies**: Clock
- **Requirements Covered**: G-2 (system tray), G-4 (pill-shaped group, clock format)
- **Internal Structure**: Flexbox row — chevron icon, grouped pill (Wi-Fi + Volume + Battery), Clock, notification bell. Clock updates every minute via `useEffect` + `setInterval`.

### 2.8 Clock
- **Responsibility**: Displays current time and date in Windows 11 format
- **Public Interface**:
  ```typescript
  interface ClockProps {} // No props — self-contained
  ```
- **Dependencies**: None
- **Requirements Covered**: G-2 (live clock in system tray)
- **Internal Structure**: `useState` for current time, `useEffect` with `setInterval(60000)` to update every minute. Formats as "h:mm AM/PM" on line 1, "M/D/YYYY" on line 2.

### 2.9 StartMenu
- **Responsibility**: Renders the Start Menu overlay with search, pinned apps, recommended, and user/power row
- **Public Interface**:
  ```typescript
  interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onAppClick?: (appId: string) => void;
  }
  ```
- **Dependencies**: SearchBar, PinnedApps, RecommendedSection, UserPowerRow
- **Requirements Covered**: G-3 (Start Menu content and animation), G-4 (dimensions, acrylic, rounded corners)
- **Internal Structure**: Conditionally rendered based on `isOpen`. CSS animation: `translateY(16px) → translateY(0)` + `opacity 0 → 1`, 200ms ease-out. Click outside closes via `onClose`.

### 2.10 SearchBar
- **Responsibility**: Renders a read-only search input matching Windows 11 styling
- **Public Interface**:
  ```typescript
  interface SearchBarProps {
    onSearch?: (query: string) => void;
  }
  ```
- **Dependencies**: None
- **Requirements Covered**: G-3 (search bar in Start Menu)
- **Internal Structure**: Read-only input with "Search" placeholder. 36px height, 16px border-radius. `onSearch` prop wired but not called in v1.

### 2.11 PinnedApps
- **Responsibility**: Renders the pinned apps grid in the Start Menu
- **Public Interface**:
  ```typescript
  interface PinnedAppsProps {
    apps: AppTileData[];
    onAppClick?: (appId: string) => void;
  }
  ```
- **Dependencies**: AppTile
- **Requirements Covered**: G-3 (6-column grid, 12-18 tiles)
- **Internal Structure**: CSS Grid, 6 columns. Section header "Pinned" + "All apps >" link.

### 2.12 AppTile
- **Responsibility**: Renders a single app tile (icon + label) in the pinned apps grid
- **Public Interface**:
  ```typescript
  interface AppTileProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    onClick?: (id: string) => void;
  }
  ```
- **Dependencies**: None
- **Requirements Covered**: G-3 (app tiles), G-4 (32×32 icon, 12px label), G-5 (callback prop)

### 2.13 RecommendedSection
- **Responsibility**: Renders the recommended items list in the Start Menu
- **Public Interface**:
  ```typescript
  interface RecommendedSectionProps {
    items: RecommendedItemData[];
    onItemClick?: (itemId: string) => void;
  }
  ```
- **Dependencies**: RecommendedItem
- **Requirements Covered**: G-3 (recommended section)

### 2.14 RecommendedItem
- **Responsibility**: Renders a single recommended item (icon + name + timestamp)
- **Public Interface**:
  ```typescript
  interface RecommendedItemProps {
    id: string;
    icon: React.ReactNode;
    name: string;
    timestamp: string;
    onClick?: (id: string) => void;
  }
  ```
- **Dependencies**: None
- **Requirements Covered**: G-3, G-5 (callback prop)

### 2.15 UserPowerRow
- **Responsibility**: Renders the bottom row of the Start Menu with user avatar and power button
- **Public Interface**:
  ```typescript
  interface UserPowerRowProps {
    userName: string;
    onUserClick?: () => void;
    onPowerClick?: () => void;
  }
  ```
- **Dependencies**: None
- **Requirements Covered**: G-3 (user/power row)

## 3. Data Model

No persistent data model. All data is static configuration defined as TypeScript constants:

### DesktopIconData
```typescript
interface DesktopIconData {
  id: string;        // unique identifier, e.g. "recycle-bin"
  icon: React.ReactNode; // Fluent UI icon component
  label: string;     // display name, e.g. "Recycle Bin"
}
```

### TaskbarIconData
```typescript
interface TaskbarIconData {
  id: string;
  icon: React.ReactNode;
  label: string;     // tooltip text
}
```

### AppTileData
```typescript
interface AppTileData {
  id: string;
  icon: React.ReactNode;
  label: string;
}
```

### RecommendedItemData
```typescript
interface RecommendedItemData {
  id: string;
  icon: React.ReactNode;
  name: string;
  timestamp: string; // display string, e.g. "Yesterday at 3:42 PM"
}
```

All data arrays are defined in a `data/` directory as static constants. No database, no API, no localStorage.

## 4. Interface Contracts

No external APIs. All communication is intra-component via React props:

### State Flow Contract
```
App state:
  selectedIconId: string | null
  isStartMenuOpen: boolean

App → Desktop:
  icons: DesktopIconData[]
  selectedIconId: string | null
  onIconSelect: (id) => setSelectedIconId(id)
  onIconDoubleClick: undefined (v1)
  onBackgroundClick: () => { setSelectedIconId(null); setIsStartMenuOpen(false) }

App → Taskbar:
  isStartMenuOpen: boolean
  onStartClick: () => setIsStartMenuOpen(prev => !prev)

App → StartMenu:
  isOpen: isStartMenuOpen
  onClose: () => setIsStartMenuOpen(false)
```

## 5. Technology Choices

| Technology | Purpose | Alternatives Considered | Selection Rationale |
|-----------|---------|------------------------|---------------------|
| React 18 | UI rendering | Vue 3, Svelte | Component props model directly supports callback extensibility (G-5). Largest ecosystem for future features. |
| TypeScript 5.x | Type safety | JavaScript | Typed interfaces enforce callback prop contracts. IDE autocomplete guides future developers. |
| Vite 5.x | Build tool | webpack, Parcel | Zero-config for React+TS+CSS Modules. Fastest HMR. |
| CSS Modules | Styling | styled-components, Tailwind | Zero runtime overhead. Component isolation. Plain CSS maps directly to Windows 11 design tokens. |
| @fluentui/react-icons | Icons | react-icons, lucide-react | Only library with exact Windows 11 Fluent UI icons (Research 3.5). |
| CSS Custom Properties | Theming | CSS-in-JS theme, Tailwind config | Native browser feature. No runtime. Enables future light theme by swapping values. |

## 6. Data Flow

### Flow 1: Desktop Icon Selection (Primary Success Path)
1. User clicks a DesktopIcon
2. DesktopIcon calls `onSelect(id)` prop
3. Desktop forwards to `onIconSelect(id)` prop
4. App calls `setSelectedIconId(id)`
5. React re-renders Desktop with new `selectedIconId`
6. The clicked DesktopIcon receives `isSelected: true`, applies highlight CSS class
7. Previously selected icon (if any) receives `isSelected: false`, removes highlight

### Flow 2: Desktop Background Click (Deselection)
1. User clicks empty desktop area
2. Desktop's background div `onClick` fires `onBackgroundClick()`
3. App calls `setSelectedIconId(null)` and `setIsStartMenuOpen(false)`
4. All DesktopIcons receive `isSelected: false`
5. StartMenu receives `isOpen: false`, animates closed

### Flow 3: Start Menu Toggle
1. User clicks StartButton
2. StartButton calls `onClick()` prop
3. Taskbar forwards to `onStartClick()` prop
4. App calls `setIsStartMenuOpen(prev => !prev)`
5. If opening: StartMenu renders with CSS animation (translateY + opacity)
6. If closing: StartMenu animates out and unmounts

## 7. Error Handling Strategy

This is a static frontend application with no network calls, no data persistence, and no user input processing. Error scenarios are minimal:

- **Rendering Errors**: React Error Boundary at the App level catches component render failures and displays a fallback UI. Prevents a single broken component from crashing the entire desktop.
- **Missing Icons**: If a @fluentui/react-icons import fails (icon removed in future version), the component renders a fallback placeholder square. Each icon usage should have a fallback.
- **Clock Errors**: If `Date` constructor or `setInterval` fails (extremely unlikely), Clock displays a static "—:— --" placeholder.
- **CSS Fallbacks**: If `backdrop-filter` is unsupported, the acrylic surfaces fall back to a solid semi-transparent background via `@supports` query.

No logging infrastructure is needed for v1. Console.error for development debugging only.

## 8. Security Design

Minimal security surface — this is a static SPA with no backend, no user data, no authentication, and no external API calls.

- **Authentication**: None required. No user accounts.
- **Authorization**: None required. No protected resources.
- **Data Protection**: No sensitive data exists. All data is static configuration.
- **Input Sanitization**: The SearchBar is read-only in v1. If made interactive in v2, React's JSX escaping prevents XSS by default. No `dangerouslySetInnerHTML` is used anywhere.
- **Dependencies**: Keep dependencies minimal (React, Vite, @fluentui/react-icons) to reduce supply chain attack surface. Run `npm audit` periodically.

## 9. Design Decisions

### DD-1: Props-down, callbacks-up over global state management
- **Decision**: Use React `useState` in App and pass state/callbacks via props instead of Redux, Zustand, or React Context.
- **Context**: The application has exactly 2 state variables (`selectedIconId`, `isStartMenuOpen`). G-5 requires extensibility via callback props.
- **Alternatives Considered**:
  - Redux Toolkit: Provides centralized state, but adds ~10KB bundle + boilerplate for 2 state variables. Overkill.
  - React Context: Avoids prop drilling, but the component tree is only 2-3 levels deep. No drilling problem exists.
- **Rationale**: The simplest solution that works. Two state variables do not justify a state management library. Props make the data flow explicit and testable.
- **Consequences**: If v2 adds 10+ state variables (window positions, app states, notifications), Context or Zustand should be introduced. The refactor is straightforward — lift state from App into a context provider.

### DD-2: CSS Modules over CSS-in-JS
- **Decision**: Use CSS Modules (`.module.css` files) for component-scoped styling.
- **Context**: G-4 requires pixel-accurate styling with exact Windows 11 design tokens. G-6 requires CSS custom properties for theming.
- **Alternatives Considered**:
  - styled-components: Supports dynamic styles via props, but adds 12KB runtime. The only dynamic style needed is icon selection highlight, which is a CSS class toggle.
  - Tailwind CSS: Fast development but utility classes obscure the design token mapping. `className="rounded-lg bg-[#2D2D2D] p-4"` is harder to audit against Windows 11 specs than `.surface { background: var(--surface-primary); border-radius: var(--radius-medium); }`.
- **Rationale**: CSS Modules provide component isolation with zero runtime cost. Plain CSS syntax maps directly to Windows 11 design tokens. CSS custom properties handle the theming layer.
- **Consequences**: Dynamic styles based on props require either inline styles or CSS class toggling. For v1 this is only needed for icon selection (class toggle) and Start Menu visibility (conditional render + CSS animation).

### DD-3: Static data arrays over configuration files
- **Decision**: Define desktop icons, taskbar icons, pinned apps, and recommended items as TypeScript constant arrays in a `data/` directory.
- **Context**: All UI content is static in v1. No user customization, no API-driven content.
- **Alternatives Considered**:
  - JSON config files: Separates data from code, but loses TypeScript type checking and React component references (icons are JSX elements).
  - Hardcoded in components: Simpler but makes it impossible to change content without modifying component logic.
- **Rationale**: TypeScript constants provide type safety, support React.ReactNode icon references, and are easy to find and modify. The `data/` directory creates a clear boundary between "what to show" and "how to show it."
- **Consequences**: If v2 needs user-customizable desktops, the data arrays become the initial state loaded from localStorage or an API. The component interfaces don't change — they already accept data via props.

### DD-4: Conditional rendering over CSS visibility for Start Menu
- **Decision**: The StartMenu component is conditionally rendered (`isOpen && <StartMenu />`) rather than always mounted with CSS `display: none`.
- **Context**: G-3 requires smooth open/close animation.
- **Alternatives Considered**:
  - CSS `display: none` / `visibility: hidden`: Keeps the component mounted, avoiding re-mount cost. But the Start Menu has no expensive initialization — it's static content.
  - CSS `opacity: 0` + `pointer-events: none`: Allows CSS-only animation but keeps the DOM node in the accessibility tree when hidden.
- **Rationale**: Conditional rendering is the simplest approach and keeps the DOM clean. The open animation is handled by CSS `@keyframes` on mount. Close animation uses a brief delay before unmount (via a `closing` state or CSS `animation-fill-mode`).
- **Consequences**: The close animation requires a small state machine: `isOpen` → `isClosing` (play animation) → unmount. This adds ~5 lines of logic to the StartMenu component.
