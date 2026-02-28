---
agent: impl-plan
sequence: 4
references: ["architecture"]
summary: "8-step implementation plan following bottom-up TDD order. Starts with types and data, then Window component tests and implementation, ThisPcContent tests and implementation, and finally App.tsx integration wiring. Critical path runs through all 8 steps sequentially."
---

## Implementation Strategy

- **Build Order**: Bottom-up. Define shared types and static data first, then build the Window component (the core dependency), then ThisPcContent, then wire everything in App.tsx.
- **TDD Approach**: Test specs are written before implementation for Window and ThisPcContent. Types and data files are trivial enough to verify by compilation.
- **Integration Strategy**: Incremental. Each component is tested in isolation, then integrated in App.tsx as the final step.
- **Scaffolding**: No new project scaffolding needed — the project is already set up with Vite, Vitest, React Testing Library, and CSS Modules.

## File Structure

```
src/
  types/
    index.ts                          # Add WindowState, DriveData interfaces
  data/
    drives.ts                         # Static mock drive data array
  components/
    Window/
      Window.tsx                      # Reusable window component
      Window.module.css               # Window styles
    ThisPcContent/
      ThisPcContent.tsx               # This PC file explorer content
      ThisPcContent.module.css        # This PC content styles
  App.tsx                             # Add window manager state + handlers
tests/
  components/
    Window/
      Window.test.tsx                 # Window component tests
    ThisPcContent/
      ThisPcContent.test.tsx          # ThisPcContent component tests
```

## Implementation Steps

#### Step 1: Types and Data
- **Files**: `src/types/index.ts` (modify), `src/data/drives.ts` (create)
- **Dependencies**: None
- **Description**: Add `WindowState` and `DriveData` interfaces to the shared types file. Create the static drives data array with three mock drives.
- **Key Implementation Details**:
  - `WindowState` interface: id, appId, title, icon, x, y, width, height, zIndex, isMinimized, isMaximized, preMaxBounds
  - `DriveData` interface: id, label, totalGB, freeGB, icon
  - `drives` constant array with C:, D:, E: drive data using `@fluentui/react-icons` HardDrive icon
- **Acceptance Check**: `npx tsc --noEmit` passes with no errors
- **Estimated Size**: ~50 lines

#### Step 2: Window Component Tests
- **Files**: `tests/components/Window/Window.test.tsx` (create)
- **Dependencies**: Step 1
- **Description**: Write tests for the Window component covering rendering, close callback, minimize callback, maximize toggle, focus callback, and children rendering.
- **Key Implementation Details**:
  - Test: renders title bar with title text and three control buttons
  - Test: calls onClose when close button is clicked
  - Test: calls onMinimize when minimize button is clicked
  - Test: calls onMaximize when maximize button is clicked
  - Test: calls onFocus when window body is clicked
  - Test: renders children content
  - Test: applies visibility hidden style when isMinimized is true
- **Acceptance Check**: Tests exist and fail (component not yet implemented)
- **Estimated Size**: ~100 lines

#### Step 3: Window Component Implementation
- **Files**: `src/components/Window/Window.tsx` (create), `src/components/Window/Window.module.css` (create)
- **Dependencies**: Step 1, Step 2
- **Description**: Implement the Window component with title bar (icon, title, minimize/maximize/close buttons), drag via pointer events on title bar, resize via 8 edge/corner handles, and children rendering area.
- **Key Implementation Details**:
  - `Window` component accepting `WindowProps`
  - Title bar with `SubtractRegular`, `MaximizeRegular`/`SquareMultipleRegular`, `DismissRegular` icons
  - `handleDragStart/Move/End` using `useRef` for offset tracking and `setPointerCapture`
  - `handleResizeStart/Move/End` with direction enum (n, s, e, w, ne, nw, se, sw)
  - Clamp position: title bar stays ≥0 top, window stays above taskbar (48px)
  - Clamp size: min 400×300
  - CSS: `--color-surface-primary` bg, `--radius-medium` corners, `--shadow-flyout`, 1px `--color-border-subtle` border
  - Title bar buttons: 46×32px, close hover `#c42b1c`
  - Resize handles: 8px invisible borders with appropriate cursors
  - `visibility: hidden` when `isMinimized`
  - When `isMaximized`: position 0,0, width 100vw, height `calc(100vh - 48px)`, no border-radius
- **Acceptance Check**: `npm run test` — Window tests from Step 2 pass
- **Estimated Size**: ~200 lines (tsx + css)

#### Step 4: ThisPcContent Tests
- **Files**: `tests/components/ThisPcContent/ThisPcContent.test.tsx` (create)
- **Dependencies**: Step 1
- **Description**: Write tests for ThisPcContent covering navigation bar, sidebar items, and drive tile rendering.
- **Key Implementation Details**:
  - Test: renders breadcrumb text "This PC"
  - Test: renders sidebar with Desktop, Documents, Downloads, Pictures
  - Test: renders three drive tiles with correct labels
  - Test: each drive tile shows "X GB free of Y GB" text
- **Acceptance Check**: Tests exist and fail (component not yet implemented)
- **Estimated Size**: ~60 lines

#### Step 5: ThisPcContent Implementation
- **Files**: `src/components/ThisPcContent/ThisPcContent.tsx` (create), `src/components/ThisPcContent/ThisPcContent.module.css` (create)
- **Dependencies**: Step 1, Step 4
- **Description**: Implement the This PC content with nav bar, sidebar, and drive grid. Uses static data from `src/data/drives.ts`.
- **Key Implementation Details**:
  - NavBar: flex row with disabled back/forward/up icon buttons + "This PC" breadcrumb span
  - Sidebar: `<nav>` with list of quick-access items (Desktop, Documents, Downloads, Pictures) using Fluent folder icons
  - DriveGrid: CSS Grid of drive tiles
  - DriveTile: drive icon, label, usage bar (`<div>` with width percentage = used/total), free/total text
  - Usage bar: `--color-accent` fill, `--color-surface-tertiary` background, 4px height, `--radius-small` corners
- **Acceptance Check**: `npm run test` — ThisPcContent tests from Step 4 pass
- **Estimated Size**: ~150 lines (tsx + css)

#### Step 6: App.tsx Window Manager Integration
- **Files**: `src/App.tsx` (modify)
- **Dependencies**: Step 3, Step 5
- **Description**: Add window manager state to App.tsx. Wire `onIconDoubleClick` on Desktop to open windows. Render open windows with Window component wrapping ThisPcContent.
- **Key Implementation Details**:
  - `const [openWindows, setOpenWindows] = useState<WindowState[]>([])`
  - `const nextZIndex = useRef(100)`
  - `const windowCounter = useRef(0)`
  - `handleIconDoubleClick(id)`: if id is `"this-pc"`, create WindowState with centered position + 30px offset per `windowCounter`, default 800×600, push to openWindows
  - `handleWindowMove`, `handleWindowResize`, `handleWindowMinimize`, `handleWindowMaximize`, `handleWindowClose`, `handleWindowFocus` — each updates the corresponding window in state
  - Render: map `openWindows` to `<Window>` components, passing ThisPcContent as children for appId `"this-pc"`
  - Pass `onIconDoubleClick={handleIconDoubleClick}` to Desktop
- **Acceptance Check**: `npm run dev` — double-clicking "This PC" opens a draggable, resizable window with drive content
- **Estimated Size**: ~100 lines

#### Step 7: Build Verification
- **Files**: None (verification only)
- **Dependencies**: Step 6
- **Description**: Run full test suite and TypeScript compilation to verify everything works together.
- **Key Implementation Details**:
  - Run `npm run test`
  - Run `npx tsc --noEmit`
  - Run `npm run lint`
- **Acceptance Check**: All tests pass, no type errors, no lint errors
- **Estimated Size**: 0 lines

#### Step 8: Manual Smoke Test
- **Files**: None (verification only)
- **Dependencies**: Step 7
- **Description**: Run `npm run dev` and manually verify all acceptance criteria: open window, drag, resize, minimize, maximize, restore, close, z-index stacking with multiple windows.
- **Acceptance Check**: All AC-1 through AC-10 pass visual inspection
- **Estimated Size**: 0 lines

## Dependency Graph

```
Step 1 (types + data)
  ├── Step 2 (Window tests)
  │     └── Step 3 (Window impl)
  │           └── Step 6 (App.tsx integration)
  └── Step 4 (ThisPcContent tests)
        └── Step 5 (ThisPcContent impl)
              └── Step 6 (App.tsx integration)
                    └── Step 7 (build verification)
                          └── Step 8 (smoke test)
```

**Critical path**: Step 1 → Step 2 → Step 3 → Step 6 → Step 7 → Step 8

## Integration Checkpoints

**After Step 3 (Window component complete)**:
- Verification: `npm run test -- tests/components/Window/`
- Expected: All Window tests pass. Window component renders correctly in isolation with mock props.

**After Step 6 (Full integration)**:
- Verification: `npm run test && npx tsc --noEmit`
- Expected: All tests pass (Window + ThisPcContent + existing tests). No TypeScript errors. The app compiles and runs.

## Risk Mitigation Steps

**R-1 (Fluent UI icon names)**:
- Mitigation: In Step 3, import icons at the top of Window.tsx. If any import fails, check `@fluentui/react-icons` exports and use the closest alternative (e.g., `Subtract16Regular` instead of `SubtractRegular`).
- Fallback: Use simple Unicode characters (─ for minimize, □ for maximize, ✕ for close) as text fallbacks.

**R-2 (Drag/resize jank)**:
- Mitigation: In Step 3, use `useRef` for all intermediate drag/resize state. Only call `onMove`/`onResize` callbacks (which trigger parent state updates) on `pointermove`. The Window component's children are not affected by position changes (only the wrapper div's `style` prop changes).
- Fallback: If jank is observed, add `React.memo` to the children content component.

**R-3 (Pointer capture edge cases)**:
- Mitigation: In Step 3, always call `setPointerCapture` on pointer down and `releasePointerCapture` on pointer up. Add a `pointercancel` handler that cleans up drag/resize state.
- Fallback: If pointer capture fails on specific browsers, fall back to document-level pointermove/pointerup listeners.
