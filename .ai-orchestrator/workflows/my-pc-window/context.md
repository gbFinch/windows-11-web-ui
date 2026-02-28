# Project: This PC Window

## Type
feature

## Description
Implement a reusable Window component and use it to show a "This PC" window when the user double-clicks the "This PC" desktop icon (`id: 'this-pc'`).

### Reusable Window Component
A generic `Window` component (`src/components/Window/`) that faithfully recreates a Windows 11 application window:
- **Title bar**: app icon + title text on left; minimize, maximize/restore, close buttons on right with correct Fluent icons and hover colors (close button turns red on hover)
- **Draggable**: click-and-drag the title bar to reposition the window
- **Resizable**: drag any edge or corner to resize; enforce a minimum size (400×300)
- **Maximize/restore**: double-click title bar or click maximize button to toggle between maximized (fills viewport minus taskbar) and restored state; remember pre-maximize position/size
- **Minimize**: hides the window (sets visibility; does not unmount)
- **Close**: calls an `onClose` callback so the parent can remove it
- **Focus/z-index**: clicking a window brings it to front (highest z-index)
- **Styling**: Windows 11 dark theme — `--color-surface-primary` background, 1px `--color-border-subtle` border, `--radius-medium` corners, `--shadow-flyout` shadow, Mica-style title bar tint

The component accepts `children` for its body content, making it reusable for any future window (File Explorer, Settings, Edge, etc.).

### This PC Content
When the "This PC" icon is double-clicked, open a Window titled "This PC" containing mock File-Explorer-style content:
- **Navigation bar**: back/forward/up buttons (disabled, decorative) + breadcrumb path showing "This PC"
- **Sidebar**: quick-access list — Desktop, Documents, Downloads, Pictures (static, non-interactive)
- **Main area**: grid of device/drive tiles:
  - `Local Disk (C:)` — 256 GB total, 120 GB free, blue usage bar
  - `Data (D:)` — 512 GB total, 340 GB free, blue usage bar
  - `USB Drive (E:)` — 32 GB total, 18 GB free, blue usage bar
- Each drive tile shows: drive icon, label, usage bar, and "X GB free of Y GB" text

### Window Manager State (in App.tsx)
- Add state to track open windows: `openWindows` array with `{ id, title, content, position, size, isMinimized, isMaximized, zIndex }`
- Wire `onIconDoubleClick` on Desktop to open the corresponding window
- Render open windows; pass close/minimize/maximize handlers

## Background
The project is a pixel-accurate Windows 11 web recreation. Currently it has a static desktop with icons, taskbar, and start menu — but no functional windows. This is the first step toward making the desktop interactive. The Window component must be generic so it can be reused for every future app window.

## Constraints
- React 18 + TypeScript, Vite, CSS Modules — same stack as existing code
- No external drag/resize libraries — implement with pointer events
- Use `@fluentui/react-icons` (already installed) for title-bar buttons and drive icons
- Follow existing design token system in `src/styles/theme.css`
- Window must not overlap the 48px taskbar at the bottom
- Keep state minimal — `useState` in App.tsx, no state management library
- Component folder: `src/components/Window/`
- This PC content folder: `src/components/ThisPcContent/`
- Mock drive data in `src/data/drives.ts`

## Existing Code/System
- **Repository**: `/Users/gbasin/Development/windows_test_ui`
- **App.tsx**: manages `selectedIconId` and `isStartMenuOpen` state; renders `<Desktop>`, `<Taskbar>`, `<StartMenu>`
- **Desktop.tsx**: already accepts `onIconDoubleClick?: (id: string) => void` prop — currently unused
- **DesktopIcon.tsx**: fires `onDoubleClick?.(id)` on double-click — already wired
- **desktopIcons.tsx**: "This PC" icon has `id: 'this-pc'`
- **types/index.ts**: shared interfaces for icon data
- **theme.css**: full Windows 11 dark theme tokens (colors, spacing, radii, shadows, typography)

## Success Criteria
- Double-clicking "This PC" on the desktop opens a window with mock drive data
- Window can be dragged by its title bar to any position
- Window can be resized from edges and corners with a minimum size enforced
- Minimize hides the window; maximize fills the viewport (above taskbar); restore returns to previous size/position
- Close button removes the window
- Multiple windows can be open simultaneously with correct z-index stacking (click to focus)
- The Window component renders arbitrary `children` — reusable for future windows
- Visual style matches Windows 11 dark theme (title bar, borders, shadows, button hover states)

## Human Gates
impl-plan

## Additional Notes
- Title bar button sizes: 46×32 px hit target, matching Windows 11
- Close button hover: `#c42b1c` background
- Maximize button should toggle icon between `MaximizeRegular` and `SquareMultipleRegular` (restore)
- Resize cursors: `nwse-resize`, `nesw-resize`, `ew-resize`, `ns-resize` on appropriate edges/corners
- Default window spawn position: centered in viewport, offset slightly for each subsequent window to avoid perfect stacking
- Drive usage bar: thin horizontal bar, filled portion uses `--color-accent`, unfilled uses `--color-surface-tertiary`
