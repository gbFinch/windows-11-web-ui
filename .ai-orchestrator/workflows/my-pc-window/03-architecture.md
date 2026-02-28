---
agent: architecture
sequence: 3
references: ["spec", "analysis"]
summary: "Component-based React architecture with a Window component handling drag/resize/minimize/maximize/close via pointer events, a WindowManager state layer in App.tsx, and a ThisPcContent child component. All state lives in App.tsx useState. No new dependencies — uses existing @fluentui/react-icons and CSS Modules."
---

## Architecture Overview

The architecture follows the existing component-based React pattern with props-down/callbacks-up data flow. A new `Window` component encapsulates all window chrome behavior (drag, resize, minimize, maximize, close, focus). App.tsx acts as the window manager, holding an array of open window state objects and passing handlers to each Window instance. Content components like `ThisPcContent` render as children inside Window.

```
App (window manager state)
├── Desktop
│   └── DesktopIcon × N  ──onDoubleClick──▶  App.openWindow()
├── Taskbar
├── StartMenu
└── Window × N (from openWindows state)
    ├── TitleBar (drag + controls)
    ├── ResizeHandles (8 zones)
    └── {children}  ←  ThisPcContent
                         ├── NavBar
                         ├── Sidebar
                         └── DriveGrid
                              └── DriveTile × 3
```

This pattern was chosen because:
- It matches the existing codebase architecture (FR-10, NFR-6)
- Minimal state in App.tsx aligns with the project constraint of no state management library (FR-12, FR-13)
- The Window component is fully reusable via children prop (FR-10)

## Component Design

### Window
- **Responsibility**: Renders a Windows 11-style window frame with title bar, resize handles, and body area. Manages its own drag/resize interaction state via refs.
- **Public Interface**:
  ```typescript
  interface WindowProps {
    id: string;
    title: string;
    icon?: ReactNode;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isMinimized: boolean;
    isMaximized: boolean;
    onMove: (id: string, x: number, y: number) => void;
    onResize: (id: string, x: number, y: number, w: number, h: number) => void;
    onMinimize: (id: string) => void;
    onMaximize: (id: string) => void;
    onClose: (id: string) => void;
    onFocus: (id: string) => void;
    children: ReactNode;
  }
  ```
- **Dependencies**: None (self-contained with CSS Module)
- **Requirements Covered**: FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-7, FR-8, FR-9, FR-10, FR-11, NFR-1, NFR-2, NFR-3, NFR-4, NFR-5, NFR-6
- **Internal Structure**:
  - Title bar div with icon, title text, and three control buttons
  - 8 invisible resize handle divs (4 edges + 4 corners, 8px wide)
  - Content area div rendering `children`
  - `useRef` for drag/resize tracking (startX, startY, startWidth, startHeight, resizeDirection)
  - Pointer event handlers: `onPointerDown`, `onPointerMove`, `onPointerUp` on title bar and resize handles

### ThisPcContent
- **Responsibility**: Renders mock File Explorer content for the "This PC" view.
- **Public Interface**:
  ```typescript
  interface ThisPcContentProps {}  // No props — self-contained with static data
  ```
- **Dependencies**: `src/data/drives.ts` for mock drive data
- **Requirements Covered**: FR-16, FR-17, FR-18, FR-19, NFR-8
- **Internal Structure**:
  - NavBar: back/forward/up buttons (disabled) + "This PC" breadcrumb
  - Sidebar: list of quick-access items
  - DriveGrid: CSS Grid of DriveTile components
  - DriveTile: icon + label + usage bar + free/total text

### App.tsx (Window Manager additions)
- **Responsibility**: Manages the array of open windows and provides handlers for window operations.
- **Public Interface**: No new external interface — internal state additions.
- **Dependencies**: Window, ThisPcContent
- **Requirements Covered**: FR-12, FR-13, FR-14, FR-15
- **Internal Structure**:
  - `openWindows` state: `WindowState[]`
  - `nextZIndex` ref: counter for z-index assignment
  - `handleIconDoubleClick(id)`: creates a new window entry
  - `handleWindowMove(id, x, y)`: updates window position
  - `handleWindowResize(id, x, y, w, h)`: updates window size
  - `handleWindowMinimize(id)`: sets isMinimized
  - `handleWindowMaximize(id)`: toggles isMaximized, stores/restores pre-maximize bounds
  - `handleWindowClose(id)`: removes window from array
  - `handleWindowFocus(id)`: assigns next z-index value

## Data Model

### WindowState
```typescript
interface WindowState {
  id: string;              // unique window instance id (e.g., "this-pc-1")
  appId: string;           // desktop icon id that spawned it (e.g., "this-pc")
  title: string;           // window title text
  icon: ReactNode;         // title bar icon
  x: number;               // left position in px
  y: number;               // top position in px
  width: number;           // width in px
  height: number;          // height in px
  zIndex: number;          // stacking order
  isMinimized: boolean;    // visibility toggle
  isMaximized: boolean;    // maximized state
  preMaxBounds: { x: number; y: number; width: number; height: number } | null;
}
```

Storage: React `useState` in App.tsx. No persistence — windows reset on page reload.

### DriveData
```typescript
interface DriveData {
  id: string;           // e.g., "c-drive"
  label: string;        // e.g., "Local Disk (C:)"
  totalGB: number;      // total capacity
  freeGB: number;       // free space
  icon: ReactNode;      // drive icon
}
```

Storage: Static array in `src/data/drives.ts`.

```
WindowState 1──* App.openWindows (in-memory array)
DriveData   1──* drives.ts (static constant)
```

## Interface Contracts

### Desktop → App (existing, now wired)
- **Method**: `onIconDoubleClick(id: string)`
- **Trigger**: User double-clicks a desktop icon
- **Input**: `id` — the desktop icon id (e.g., `"this-pc"`)
- **Effect**: App creates a new WindowState entry and adds it to `openWindows`
- **Example**: Double-click "This PC" → `onIconDoubleClick("this-pc")` → new window with title "This PC" and ThisPcContent children

### App → Window
- **Props**: Full `WindowProps` interface as defined in Component Design
- **Callbacks**:
  - `onMove(id, x, y)` — App updates the window's x/y in state
  - `onResize(id, x, y, w, h)` — App updates the window's position and dimensions
  - `onMinimize(id)` — App sets `isMinimized: true`
  - `onMaximize(id)` — App toggles `isMaximized` and manages `preMaxBounds`
  - `onClose(id)` — App filters the window out of `openWindows`
  - `onFocus(id)` — App assigns the next z-index value

### Window internal pointer events
- **Drag start**: `onPointerDown` on title bar → store offset, call `setPointerCapture`
- **Drag move**: `onPointerMove` → compute new x/y, clamp to viewport bounds (min 32px title bar visible, max `window.innerHeight - 48`), call `onMove`
- **Drag end**: `onPointerUp` → release capture
- **Resize start**: `onPointerDown` on resize handle → store initial bounds and direction
- **Resize move**: `onPointerMove` → compute new bounds based on direction, enforce min 400×300, call `onResize`
- **Resize end**: `onPointerUp` → release capture

## Technology Choices

| Technology | Purpose | Alternatives Considered | Selection Rationale |
|-----------|---------|------------------------|---------------------|
| Pointer Events API | Drag and resize interaction | Mouse events; `react-draggable` library | Pointer events provide unified touch/mouse handling and `setPointerCapture` for reliable tracking. No external dependency per NFR-3. Mouse events lack pointer capture. |
| CSS Modules | Component-scoped styling | Styled-components; Tailwind CSS | Matches existing codebase pattern (NFR-6). Zero runtime overhead. |
| `@fluentui/react-icons` | Title bar and drive icons | `react-icons`; custom SVGs | Already installed in the project. Provides Windows 11-native Fluent icons. |
| `useRef` for drag state | Track interaction state without re-renders | `useState` for all drag state | Refs avoid re-rendering the entire window tree on every pointer move, supporting 60fps (NFR-1, R-2 mitigation). |
| `useState` array in App.tsx | Window manager state | Context API; Zustand; Redux | Matches existing minimal-state pattern. Only App.tsx needs window state. No prop drilling beyond one level. |

## Data Flow

### Opening a Window (Primary Success Path)
1. User double-clicks "This PC" desktop icon
2. `DesktopIcon` calls `onDoubleClick("this-pc")`
3. `Desktop` propagates to `onIconDoubleClick("this-pc")`
4. `App.handleIconDoubleClick("this-pc")` executes:
   - Creates a new `WindowState` with id `"this-pc-{counter}"`, title `"This PC"`, centered position with 30px offset per open window, default size 800×600, next z-index
   - Appends to `openWindows` state
5. React re-renders: new `<Window>` appears with `<ThisPcContent>` as children
6. Window is visible at the computed position

### Dragging a Window
1. User presses pointer on title bar
2. `Window.handleDragStart`: stores pointer offset in ref, calls `setPointerCapture`
3. User moves pointer
4. `Window.handleDragMove`: computes new x/y from pointer position minus offset, clamps to viewport bounds, calls `onMove(id, newX, newY)`
5. `App` updates the window's x/y in state → React re-renders window at new position
6. User releases pointer
7. `Window.handleDragEnd`: releases pointer capture

### Closing a Window
1. User clicks close button
2. `Window` calls `onClose(id)`
3. `App.handleWindowClose(id)` filters the window from `openWindows`
4. React re-renders: window is removed from DOM

## Error Handling Strategy

- **Input Validation**: Window component clamps position/size values — x/y cannot place window below taskbar, width/height cannot go below 400×300. Invalid values are silently corrected.
- **Business Logic Errors**: If `handleIconDoubleClick` receives an unknown icon id, no window is opened (no-op). No error thrown.
- **Infrastructure Errors**: Not applicable — no network calls, no persistence, no external services.
- **Unhandled Errors**: React error boundary at App level (if one exists) catches render errors. Window component failures do not crash the desktop.
- **Error Propagation**: Callbacks return void. Invalid state is prevented by clamping, not by throwing.
- **Logging**: None required for this feature — all state is visual and immediately observable.

## Security Design

- **Authentication**: Not applicable — client-side-only application with no backend.
- **Authorization**: Not applicable — no user roles or permissions.
- **Data Protection**: Not applicable — no sensitive data. Mock drive data is hardcoded.
- **Input Sanitization**: Window title and content are rendered via React JSX, which auto-escapes strings. No `dangerouslySetInnerHTML` usage.
- **Threat Mitigations**: No external inputs, no network requests, no user-generated content. Attack surface is negligible for a client-side UI recreation.

## Design Decisions

### DD-1: Window position/size state lives in App.tsx, not in Window component
- **Context**: FR-13 requires multiple windows with independent state. Need to decide where state lives.
- **Alternatives**:
  1. Each Window manages its own position/size state internally → simpler component, but App cannot coordinate windows (e.g., cascade positioning, future taskbar indicators)
  2. App.tsx holds all window state, passes as props → App has full control, Window is a controlled component
- **Rationale**: Option 2 chosen. App needs to know window positions for spawn offset (FR-15) and future features (taskbar indicators). Controlled components are the established pattern in this codebase.
- **Consequences**: Every drag/resize move triggers a state update in App. Mitigated by using refs for intermediate tracking and only calling onMove/onResize on pointer move (not on every pixel).

### DD-2: Use refs for drag/resize interaction tracking, useState for final position
- **Context**: NFR-1 requires 60fps drag/resize. R-2 identifies re-render jank risk.
- **Alternatives**:
  1. Pure useState for all drag state → every pointer move triggers full re-render tree
  2. Pure refs + direct DOM manipulation → bypasses React, harder to maintain
  3. Refs for tracking + useState for position → pointer move updates ref, calls parent callback which updates state
- **Rationale**: Option 3 chosen. The parent state update is necessary for React to re-render the window at the new position, but the ref avoids storing intermediate drag metadata in state. The Window component itself doesn't re-render its children during drag because position changes only affect the wrapper div's style.
- **Consequences**: Slight complexity in having both refs and props for position data. Acceptable trade-off for performance.

### DD-3: Resize via 8 invisible overlay divs, not CSS resize property
- **Context**: FR-3 requires edge and corner resizing. Need to decide implementation approach.
- **Alternatives**:
  1. CSS `resize` property → only supports bottom-right corner, no edge resize
  2. Single `onPointerMove` on window with hit-testing → complex math, cursor management issues
  3. 8 invisible positioned divs (4 edges + 4 corners) with individual pointer handlers → clear separation, correct cursors via CSS
- **Rationale**: Option 3 chosen. Each resize handle has its own CSS cursor and pointer handler. The resize direction is known from which handle was grabbed, simplifying the math. 8px handle width provides comfortable grab targets (R-5 mitigation).
- **Consequences**: 8 extra DOM elements per window. Negligible performance impact.

### DD-4: Window spawn position uses counter-based offset
- **Context**: FR-15 requires offset positioning to avoid exact overlap. Gap-2 from analysis.
- **Alternatives**:
  1. Random position → unpredictable, may cluster
  2. Counter × 30px offset from center → predictable cascade, matches Windows 11 behavior
- **Rationale**: Option 2 chosen. Each new window spawns at viewport center offset by `windowCounter * 30` pixels right and down. Counter resets when all windows are closed.
- **Consequences**: After many windows, positions may go off-screen. Acceptable — user can drag windows back. Viewport clamping ensures title bar remains visible.
