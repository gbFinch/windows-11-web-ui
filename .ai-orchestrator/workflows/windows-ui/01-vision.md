---
agent: vision
sequence: 1
references: []
summary: "A high-fidelity web application that recreates the Windows 11 desktop environment using React and TypeScript. It serves web developers and UI enthusiasts as both a technical showcase and an extensible platform for future desktop-like web experiences. Success is measured by visual indistinguishability from actual Windows 11 at normal viewing distance."
---

## 1. Project Vision

Create a pixel-accurate web recreation of the Windows 11 desktop environment — including the desktop surface, taskbar, Start Menu, and system tray — built with React and TypeScript as an extensible foundation. The application serves developers exploring desktop-in-browser paradigms and UI enthusiasts who want a faithful Windows 11 experience rendered entirely in web technologies. It matters because it demonstrates that modern CSS and React can reproduce the most widely-used desktop OS interface with production-level visual fidelity, while providing a platform that can evolve into a fully functional web-based desktop environment.

## 2. Problem Statement

**Current State**: There is no open, high-fidelity web recreation of the Windows 11 desktop that achieves screenshot-level accuracy. Existing web-based OS simulations (such as Windows 93, Windows XP online) are novelty projects with cartoon-like approximations — low-resolution icons, incorrect spacing, missing material effects (acrylic, Mica), and no component architecture for extensibility. A developer who wants to build a desktop-like web application has no reference implementation that demonstrates how to faithfully reproduce modern OS UI patterns (acrylic blur, system tray grouping, Start Menu layout) using standard web technologies.

**Desired State**: Opening the application in a browser presents a desktop that is visually indistinguishable from a Windows 11 screenshot at normal viewing distance. Every element — taskbar height, icon sizes, font weights, rounded corners, acrylic blur, hover animations — matches the real OS. The React component architecture allows a developer to add functionality (opening windows, launching apps, file management) by passing callback props to existing components, without restructuring the UI layer.

**Gap**: No existing project combines (a) pixel-accurate Windows 11 visual fidelity with (b) a modern React/TypeScript component architecture designed for extensibility. Building this requires deep knowledge of Windows 11 design tokens (Fluent 2), careful CSS implementation of material effects, and a component API designed around future action injection.

## 3. Target Users

### User Type 1: Web Developer (Builder)
- **Role**: Frontend developer who wants to extend the project with functional windows, apps, or custom desktop behaviors
- **Context**: Works in a code editor, runs `npm run dev`, iterates on components. Interacts daily during active development.
- **Primary Need**: A well-structured React component tree with typed props and callback hooks so they can add functionality without modifying existing UI code
- **Pain Points**: (1) Existing OS-in-browser projects use vanilla JS with no component structure, making extension painful. (2) No typed interfaces for desktop interactions (icon click, window open, app launch). (3) CSS is typically a single monolithic file with no scoping, causing style conflicts when adding features.
- **Success Scenario**: The developer clones the repo, runs `npm run dev`, sees the Windows 11 desktop. They open `DesktopIcon.tsx`, see the `onDoubleClick` prop, pass a function that opens a new `<Window>` component, and the icon now launches an app — without touching any other file.
- **Technical Proficiency**: Intermediate to Expert

### User Type 2: UI Enthusiast (Viewer)
- **Role**: Someone who wants to experience or showcase a Windows 11 desktop running in a browser
- **Context**: Opens the deployed URL in Chrome/Firefox/Edge on a 1080p+ display. Single session, exploratory interaction.
- **Primary Need**: A visually convincing Windows 11 experience — clicking the Start button, seeing the menu animate open, hovering over taskbar icons — that feels authentic
- **Pain Points**: (1) Existing web OS recreations look obviously fake due to wrong fonts, colors, and spacing. (2) No acrylic/blur effects make the UI feel flat. (3) Interactions feel dead — no hover states, no animations, no visual feedback.
- **Success Scenario**: The viewer opens the page, sees what looks like a Windows 11 desktop. They click the Start button and the menu slides up with a smooth animation. They hover over taskbar icons and see the subtle circular highlight. They click a desktop icon and it highlights with the accent color. They show it to a friend who asks "is that actually Windows?"
- **Technical Proficiency**: Novice to Intermediate

## 4. Goals

- **G-1**: Render a desktop surface with wallpaper background and at least 5 clickable shortcut icons with correct selection/deselection behavior.
  - **Priority**: P0
  - **Success Criterion**: Desktop displays 5 icons (Recycle Bin, This PC, Edge, File Explorer, folder) in a vertical grid; single-click selects with accent-color highlight; clicking background deselects all.
  - **User Types Served**: User Type 1, User Type 2

- **G-2**: Implement a pixel-accurate Windows 11 taskbar with centered icons, Start button, and system tray.
  - **Priority**: P0
  - **Success Criterion**: Taskbar is 48px tall, uses acrylic blur effect, has centered app icons with 40×40 hit targets, and a right-aligned system tray displaying a live clock in "h:mm AM/PM" format.
  - **User Types Served**: User Type 1, User Type 2

- **G-3**: Implement a Start Menu that toggles open/closed with smooth animation and contains search, pinned apps, recommended section, and user/power row.
  - **Priority**: P0
  - **Success Criterion**: Start Menu opens/closes with a 200ms slide-up/fade-in animation; contains a search bar, 6-column pinned apps grid with 12+ app tiles, a recommended section with 3+ items, and a bottom row with user avatar and power button.
  - **User Types Served**: User Type 1, User Type 2

- **G-4**: Achieve visual fidelity indistinguishable from Windows 11 at normal viewing distance.
  - **Priority**: P0
  - **Success Criterion**: Typography uses Segoe UI Variable at correct sizes (12/13/14px); colors match Windows 11 dark theme hex values (#202020, #2D2D2D, #0078D4); rounded corners are 4px/8px; all hover states use 150-200ms ease-out transitions.
  - **User Types Served**: User Type 2

- **G-5**: Design all interactive components with typed callback props for future extensibility.
  - **Priority**: P1
  - **Success Criterion**: Every clickable component (DesktopIcon, TaskbarIcon, StartMenu items) accepts `onClick` and/or `onDoubleClick` props typed with TypeScript interfaces. Adding an action requires only passing a function — no structural changes.
  - **User Types Served**: User Type 1

- **G-6**: Establish a CSS custom property system defining the full Windows 11 dark theme palette.
  - **Priority**: P1
  - **Success Criterion**: A single CSS file defines all color, spacing, shadow, and border-radius values as custom properties. Changing `--accent-color` updates the accent throughout the entire UI.
  - **User Types Served**: User Type 1

## 5. Success Metrics

### Quantitative Metrics

| Metric | Target | Measurement Method | Goal Reference |
|--------|--------|--------------------|----------------|
| Desktop icon count | ≥ 5 icons rendered | Count rendered `DesktopIcon` components | G-1 |
| Taskbar height accuracy | Exactly 48px | Measure via browser DevTools | G-2 |
| Start Menu animation duration | 150-250ms | Measure CSS transition duration | G-3 |
| Color accuracy | 100% of defined colors match Windows 11 hex values | Compare CSS custom properties against Windows 11 design tokens | G-4 |
| Callback prop coverage | 100% of interactive components accept onClick/onDoubleClick | Audit TypeScript interfaces for all clickable components | G-5 |

### Qualitative Metrics

| Metric | Assessment Method | Acceptable Outcome | Goal Reference |
|--------|-------------------|--------------------|----------------|
| Visual authenticity | Side-by-side comparison with Windows 11 screenshot by 3 reviewers | At least 2 of 3 reviewers rate the web version as "convincing" or "indistinguishable" | G-4 |
| Developer extensibility | A developer unfamiliar with the codebase adds a click action to a desktop icon | Completed in under 10 minutes without modifying existing component internals | G-5 |
| Interaction polish | Manual testing of all hover, click, and animation states | All transitions feel smooth with no visual jank, snapping, or missing states | G-3, G-4 |

## 6. Guiding Principles

1. **Pixel fidelity over speed**: When a trade-off exists between shipping faster and matching Windows 11 exactly, choose fidelity. A slightly delayed but visually perfect component is better than a fast but approximate one.
   - **Rationale**: The core value proposition (G-4) is visual indistinguishability. Compromising fidelity undermines the entire project.
   - **Implication**: Use exact Windows 11 hex values, font sizes, and spacing — never "close enough" approximations.

2. **Callback-driven extensibility**: Every interactive element must accept action callbacks as props. No component should hard-code behavior.
   - **Rationale**: The project is explicitly designed as a foundation for future functionality (G-5). Hard-coded no-ops would require refactoring later.
   - **Implication**: `DesktopIcon` takes `onClick?: () => void` and `onDoubleClick?: () => void` even though v1 passes nothing.

3. **Component isolation**: Each visual element is a self-contained component with its own CSS Module. No global styles except the theme variables.
   - **Rationale**: Future developers (User Type 1) need to modify one component without side effects on others.
   - **Implication**: `Taskbar.module.css` cannot reference classes from `StartMenu.module.css`. Shared styles live only in CSS custom properties.

4. **Dark theme first**: v1 implements only the Windows 11 dark theme. Light theme is deferred.
   - **Rationale**: Dark theme is the most visually distinctive Windows 11 look and reduces scope by 50% for theming work.
   - **Implication**: All color tokens are dark-theme values. The CSS custom property names should be semantic (e.g., `--surface-primary`) to support future light theme without renaming.

5. **No fake functionality**: Buttons and icons have visual feedback (hover, active states) but do not pretend to do something they cannot. No loading spinners, no fake file listings, no simulated app windows.
   - **Rationale**: Fake functionality creates false expectations and technical debt. Clean no-op callbacks are honest and extensible.
   - **Implication**: The search bar in the Start Menu shows a placeholder but does not accept input or show results.

## 7. Scope Boundaries

### In Scope (Version 1)
- Desktop surface with CSS gradient wallpaper matching Windows 11 default
- 5 desktop shortcut icons with select/deselect behavior
- Taskbar: Start button, Search icon, Task View icon, Widgets icon, 4 pinned app icons, system tray
- System tray: Wi-Fi, volume, battery icons in grouped pill; live clock; notification bell
- Start Menu: search bar, pinned apps grid (12-18 tiles), recommended section (3-4 items), user/power row
- Start Menu open/close animation
- All hover, focus, and active states for interactive elements
- Acrylic/Mica material effects via CSS backdrop-filter
- Full Windows 11 dark theme color palette as CSS custom properties
- React component architecture with TypeScript interfaces and callback props
- Vite dev server and build configuration

### Out of Scope (Deferred)
- **Functional windows/app launching**: Deferred because it requires a window management system (z-index, drag, resize, minimize/maximize). Planned for v2.
- **Light theme**: Deferred to reduce scope. CSS custom property naming supports future addition.
- **Right-click context menus**: Deferred because context menus require a positioning system and menu item registry. Planned for v2.
- **Drag-and-drop for desktop icons**: Deferred because it requires a grid snapping system. Planned for v2.
- **Responsive/mobile layout**: Deferred because Windows 11 is a desktop OS; mobile layout is not authentic. May be considered for tablet mode in v3.
- **Keyboard navigation/accessibility**: Deferred for v1 but recognized as important for v2.
- **Sound effects**: Deferred as non-essential for visual fidelity.
- **Backend/API integration**: No backend exists or is needed for v1.

### Ambiguous Items
- **Taskbar icon tooltips**: Context mentions tooltips on hover. Recommended: include in v1 — they are a small CSS-only feature that adds significant polish.
- **Start Menu search bar interactivity**: Context says "non-functional." Recommended: render the input field but disable typing (read-only with placeholder). This avoids a cursor blinking in a dead input.
- **Desktop icon double-click**: Context says "wire up handler, no action." Recommended: include — attach `onDoubleClick` prop with no default handler. Zero cost, enables future use.

## 8. Risks to the Vision

- **VR-1**: CSS `backdrop-filter` performance or browser support causes visual degradation.
  - **Likelihood**: Low (supported in all modern browsers since 2020)
  - **Impact**: Taskbar and Start Menu lose their signature acrylic look, making the UI feel flat and unconvincing.
  - **Mitigation**: Implement a fallback semi-transparent background with a subtle noise texture overlay. Test in Chrome, Firefox, Safari, and Edge.
  - **Detection**: Visual testing on each target browser during development.

- **VR-2**: Segoe UI font is unavailable on non-Windows systems, degrading typography fidelity.
  - **Likelihood**: High (macOS and Linux do not ship Segoe UI)
  - **Impact**: Typography looks noticeably different on non-Windows machines, breaking the "indistinguishable" goal.
  - **Mitigation**: Use the fallback chain `'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, sans-serif`. Accept that non-Windows users see system-ui, which is visually close. Optionally bundle Segoe UI Variable as a web font if licensing permits.
  - **Detection**: Test on macOS and Linux during development; compare font rendering side-by-side.

- **VR-3**: Scope creep into functional features (windows, apps, file system) delays v1 delivery.
  - **Likelihood**: Medium (the project is inherently tempting to extend)
  - **Impact**: v1 never ships because the team keeps adding "just one more feature."
  - **Mitigation**: The scope boundaries in Section 7 are explicit. All functional features are deferred to v2. The callback prop architecture (G-5) makes it easy to add features later without rushing them into v1.
  - **Detection**: If any PR/commit introduces window management, drag-and-drop, or app launching, it is out of scope.

- **VR-4**: Color and spacing values do not match actual Windows 11, resulting in an "off" look.
  - **Likelihood**: Medium (Windows 11 design tokens are not fully public; values must be extracted from screenshots or Figma)
  - **Impact**: The UI looks "inspired by" rather than "identical to" Windows 11, failing the core visual fidelity goal (G-4).
  - **Mitigation**: Cross-reference multiple sources: Microsoft Fluent 2 design tokens, Windows 11 Figma community files, and pixel-measured screenshots. Define all values as CSS custom properties so corrections are single-line changes.
  - **Detection**: Side-by-side screenshot comparison at each development milestone.
