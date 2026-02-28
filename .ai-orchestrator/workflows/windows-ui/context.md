# Project: Windows 11 Web UI

## Type
new-project

## Description
Build a high-fidelity React web application that faithfully recreates the Windows 11 desktop environment. The visual quality must be indistinguishable from a screenshot of actual Windows 11 — not a "inspired by" approximation, but a pixel-accurate recreation.

### Desktop
- Full-screen area with the default Windows 11 blue abstract wallpaper (use a CSS gradient that closely matches it)
- Desktop shortcut icons (Recycle Bin, This PC, Microsoft Edge, File Explorer, a folder) arranged in a vertical grid on the left with proper spacing (~76px grid cells)
- Icon rendering: crisp, properly sized (48×48 icon + label below), with the exact Windows 11 icon selection style — subtle rounded-rectangle highlight with semi-transparent accent color fill
- Single click selects an icon; clicking desktop background deselects all
- Double-click handler wired up (no action in v1)

### Taskbar
- 48px height, pinned to bottom, full width
- Acrylic material: semi-transparent background with `backdrop-filter: blur(20px) saturate(180%)` matching the real Windows 11 Mica/Acrylic effect
- Centered section: Start button (Windows 11 logo), Search, Task View, Widgets, then pinned app icons (Edge, File Explorer, Microsoft Store, Settings) — all with proper 40×40 hit targets and 24×24 icons
- Right-aligned system tray: hidden icons chevron (^), Wi-Fi + volume + battery grouped in a pill-shaped hover area, clock/date display matching Windows 11 format ("1:43 PM\n2/28/2026"), notification bell
- Taskbar icons show a subtle tooltip on hover (app name) with Windows 11 tooltip styling
- Hover state: circular subtle highlight behind icon. Active/pressed: slightly darker

### Start Menu
- Opens centered above the Start button, ~600px wide × ~700px tall
- Acrylic background with rounded corners (8px radius), subtle drop shadow
- Top: search bar with "Search" placeholder, rounded, matching Windows 11 search field styling
- "Pinned" section: label + "All apps >" link, then a 6-column grid of app tiles (icon + name), at least 12-18 apps
- Divider line
- "Recommended" section: label + "More >" link, then a list of 3-4 recent items with icon, name, and timestamp
- Bottom: user profile avatar (circle placeholder) + name on left, power button on right
- Smooth open/close animation (slide up + fade in, ~200ms ease-out)

### Visual Quality Requirements
- **Typography**: Segoe UI Variable (with fallback chain: 'Segoe UI', system-ui, -apple-system, sans-serif). Use the correct font weights — 400 for body, 600 for headings/labels. Font sizes must match Windows 11: 12px for icon labels, 13px for body text, 14px for section headers
- **Colors**: Extract exact Windows 11 color values — not approximations. Background: `#202020` dark surfaces, `#2D2D2D` elevated surfaces, `#0078D4` accent blue, `#FFFFFF` text on dark, `#1E1E1E` taskbar tint. Use CSS custom properties for all colors
- **Spacing**: Follow Windows 11 spacing system — 4px base unit, consistent padding/margins
- **Rounded corners**: 4px for small elements, 8px for panels/menus, matching Windows 11 exactly
- **Shadows**: Subtle layered shadows matching Windows 11 elevation system — `0 2px 4px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12)` for menus
- **Animations**: Smooth, subtle transitions — 150-200ms ease-out for hover states, menu open/close
- **Acrylic/Mica**: Proper implementation using backdrop-filter with blur + saturation + tinted overlay layer, not just a simple semi-transparent background

## Background
This is a high-fidelity UI recreation of Windows 11 as a web application. Built with React to serve as an extensible foundation — future versions will add functional windows, app launching, file management, and other desktop interactions. The visual quality bar is "screenshot-accurate" — someone should not be able to tell at a glance whether they're looking at real Windows 11 or this web app.

## Constraints
- React 18+ with TypeScript
- Vite as build tool
- CSS Modules for component-scoped styling
- No UI component libraries — all components built from scratch to match Windows 11 design exactly
- `react-icons` package — use Fluent UI System Icons (`react-icons/tb` TbIcons or `react-icons/vsc`) for the closest match to Windows 11 iconography
- CSS Grid/Flexbox for layout
- Target resolution: 1920×1080 primary, reasonable at other sizes
- Component architecture: each UI element is its own component with typed props including callback handlers for future actions
- Dark theme only for v1 (Windows 11 dark mode)

## Existing Code/System
None. This is a brand new project. The repository is currently empty.

## Success Criteria
- `npm run dev` starts the app and shows a desktop visually indistinguishable from Windows 11 at normal viewing distance
- Desktop displays 5 shortcut icons with correct selection behavior
- Taskbar is pixel-accurate to Windows 11: correct height, acrylic effect, centered icons, system tray with clock
- Start Menu opens/closes with smooth animation and contains search, pinned apps, recommended section, and user/power row
- All hover, focus, and active states match Windows 11 behavior — subtle, smooth, consistent
- Typography, spacing, colors, and rounded corners all match Windows 11 design language
- Acrylic/Mica material effects are convincing (blur + saturation + tint)
- All interactive components accept callback props (`onClick`, `onDoubleClick`) for future extensibility

## Human Gates
architecture, tech-stack, impl-plan

## Additional Notes
- Reference the Windows 11 Figma design system and Microsoft Fluent 2 design tokens for exact values where possible
- CSS custom properties should define the full Windows 11 dark theme palette — surface colors, text colors, accent colors, border colors, shadow values
- Component structure:
  - `Desktop` — wallpaper + icon grid + click-to-deselect
  - `DesktopIcon` — icon + label, selectable, accepts callbacks
  - `Taskbar` — container for Start button, pinned apps, system tray
  - `StartButton` — Windows 11 logo icon
  - `StartMenu` — search bar, pinned apps grid, recommended list, user/power row
  - `TaskbarIcon` — individual taskbar app icon with tooltip
  - `SystemTray` — grouped indicators + clock
- State: minimal `useState` — selected desktop icon ID, Start Menu open/closed
- No routing, no global state management, no backend
- Pay special attention to the small details that make Windows 11 feel polished: the exact border radius on the Start Menu, the subtle 1px borders on elevated surfaces, the way hover highlights fade in rather than snap, the grouped system tray icons
