---
agent: spec
sequence: 1
references: []
summary: "Specification for a reusable Window component and This PC window content in a Windows 11 web UI recreation. Defines draggable, resizable, stackable windows with minimize/maximize/close behavior, plus mock File Explorer content with drive tiles. The Window component accepts children for reuse across future app windows."
---

## Overview

This specification defines a reusable Window component and a "This PC" window for an existing Windows 11 desktop web recreation built with React 18 and TypeScript. The Window component provides drag, resize, minimize, maximize, restore, close, and z-index stacking behaviors matching Windows 11. When the user double-clicks the "This PC" desktop icon, a window opens displaying mock File Explorer content with a sidebar, navigation bar, and drive usage tiles. The Window component accepts arbitrary children, enabling reuse for any future application window.

## Functional Requirements

**Window Component**

- FR-1: The system MUST render a window with a title bar containing an icon, title text, and three control buttons (minimize, maximize/restore, close) when a Window component is mounted.
- FR-2: The system MUST reposition the window by updating its x/y coordinates when the user clicks and drags the title bar.
- FR-3: The system MUST resize the window when the user drags any of the four edges or four corners, enforcing a minimum size of 400px width and 300px height.
- FR-4: The system MUST hide the window (set visibility hidden, not unmount) when the user clicks the minimize button.
- FR-5: The system MUST expand the window to fill the entire viewport minus the 48px taskbar height when the user clicks the maximize button, and store the pre-maximize position and size.
- FR-6: The system MUST restore the window to its pre-maximize position and size when the user clicks the restore button (shown in place of maximize when maximized).
- FR-7: The system MUST toggle between maximized and restored states when the user double-clicks the title bar.
- FR-8: The system MUST call the onClose callback when the user clicks the close button, allowing the parent to remove the window.
- FR-9: The system MUST bring a window to the front (highest z-index) when the user clicks anywhere on that window.
- FR-10: The system MUST render the children prop as the window body content below the title bar.
- FR-11: The system MUST constrain window dragging so the window cannot be moved below the 48px taskbar area.

**Window Manager (App.tsx)**

- FR-12: The system MUST open a "This PC" window when the user double-clicks the desktop icon with id `this-pc`.
- FR-13: The system MUST support multiple simultaneously open windows, each with independent position, size, and z-index state.
- FR-14: The system MUST remove a window from the open windows list when its close callback is invoked.
- FR-15: The system MUST spawn each new window at a position offset from the previous window to avoid exact overlap.

**This PC Content**

- FR-16: The This PC window MUST display a navigation bar with disabled back, forward, and up buttons and a breadcrumb showing "This PC".
- FR-17: The This PC window MUST display a sidebar listing Desktop, Documents, Downloads, and Pictures as static items.
- FR-18: The This PC window MUST display three drive tiles: "Local Disk (C:)" (256 GB total, 120 GB free), "Data (D:)" (512 GB total, 340 GB free), and "USB Drive (E:)" (32 GB total, 18 GB free).
- FR-19: Each drive tile MUST display a drive icon, label, a horizontal usage bar showing the proportion of used space, and text reading "{free} GB free of {total} GB".

## Non-Functional Requirements

- NFR-1: Window drag and resize operations MUST update position at 60fps with no visible jank (using pointer events, not mouse events).
- NFR-2: All window styling MUST use existing CSS custom properties from theme.css (colors, spacing, radii, shadows, typography).
- NFR-3: The Window component MUST have zero external drag/resize library dependencies.
- NFR-4: Title bar control buttons MUST have a 46×32px hit target matching Windows 11 dimensions.
- NFR-5: The close button MUST display background color `#c42b1c` on hover.
- NFR-6: The Window component MUST use CSS Modules for all styling, consistent with the existing codebase.
- NFR-7: All new TypeScript code MUST pass the existing strict TypeScript configuration with no type errors.
- NFR-8: Drive usage bars MUST use `--color-accent` for the filled portion and `--color-surface-tertiary` for the unfilled portion.

## Acceptance Criteria

- AC-1 (FR-12): Given the desktop is displayed, when the user double-clicks the "This PC" icon, then a window titled "This PC" appears containing drive tiles.
- AC-2 (FR-2): Given a window is open, when the user clicks and drags the title bar, then the window moves to follow the pointer.
- AC-3 (FR-3): Given a window is open, when the user drags a corner to resize below 400×300, then the window stops shrinking at 400×300.
- AC-4 (FR-4): Given a window is open, when the user clicks minimize, then the window becomes hidden but remains in the DOM.
- AC-5 (FR-5, FR-6): Given a window is in normal state, when the user clicks maximize, then the window fills the viewport minus taskbar; when the user clicks restore, it returns to its previous size and position.
- AC-6 (FR-7): Given a window is in normal state, when the user double-clicks the title bar, then the window maximizes; double-clicking again restores it.
- AC-7 (FR-8): Given a window is open, when the user clicks close, then the window is removed from the DOM.
- AC-8 (FR-9, FR-13): Given two windows are open, when the user clicks the background window, then it moves to the front (higher z-index than the other).
- AC-9 (FR-18, FR-19): Given the This PC window is open, then three drive tiles are visible, each showing a label, usage bar, and free/total text.
- AC-10 (FR-16, FR-17): Given the This PC window is open, then a navigation bar with breadcrumb "This PC" and a sidebar with four items (Desktop, Documents, Downloads, Pictures) are visible.

## Scope

- Reusable `Window` component in `src/components/Window/`
- `ThisPcContent` component in `src/components/ThisPcContent/`
- Mock drive data in `src/data/drives.ts`
- Window manager state additions to `App.tsx`
- Wiring `onIconDoubleClick` in Desktop to open windows
- CSS Modules for all new components
- New TypeScript interfaces for window state in `src/types/index.ts`

## Non-Goals

- Taskbar window indicators (showing open windows in the taskbar) — deferred to a future feature.
- Window snap/dock behavior (dragging to screen edges) — deferred.
- Animated window open/close/minimize transitions — deferred.
- Functional file system navigation within This PC — this is mock/static content only.
- Right-click context menus on windows or drive tiles — deferred.
- Light theme support — out of scope per existing project constraints.
- Keyboard navigation for window controls — deferred to accessibility feature.

## Assumptions

- The `@fluentui/react-icons` package includes `SubtractRegular` (minimize), `MaximizeRegular`, `SquareMultipleRegular` (restore), and `DismissRegular` (close) icons. **Risk: medium** — icon names may differ.
- Pointer events (`onPointerDown`, `onPointerMove`, `onPointerUp`) with `setPointerCapture` are sufficient for smooth drag/resize without external libraries. **Risk: low.**
- The existing `Desktop` component's `onIconDoubleClick` prop is correctly propagated from App.tsx through to DesktopIcon. **Risk: low** — confirmed by code inspection.

## Open Questions

None identified.
