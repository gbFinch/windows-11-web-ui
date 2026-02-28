---
agent: impl-plan
sequence: 7
references: ["04-architecture.md", "05-project-structure.md"]
summary: "The scaffolding agent has already produced a complete, building, and functional implementation of all 15 components with CSS Modules, data files, and theme tokens. The implementation plan covers 4 refinement steps: visual polish pass, animation refinement, interaction state completeness, and cross-browser verification. No new components need to be created."
---

## 1. Implementation Strategy

The scaffolding step produced a complete implementation — all 15 components, all CSS Modules, all data files, theme tokens, and configuration files. The project builds and runs. The implementation plan therefore focuses on **refinement and polish** rather than building from scratch.

Strategy: bottom-up visual refinement. Start with the smallest leaf components (DesktopIcon, AppTile, TaskbarIcon), verify their visual accuracy against Windows 11 screenshots, then move up to container components (Desktop, Taskbar, StartMenu), and finally verify the full composition in App.

TDD ordering: tests are written for interaction behavior (icon selection, Start Menu toggle, clock formatting) before any refinement changes, ensuring regressions are caught.

## 2. File Structure

All files already exist. No new files need to be created. Files that may need refinement:

| File | Refinement Needed |
|------|-------------------|
| `src/styles/theme.css` | Verify all token values against Windows 11 screenshots |
| `src/components/Desktop/Desktop.module.css` | Wallpaper gradient tuning, icon grid spacing |
| `src/components/Taskbar/Taskbar.module.css` | Acrylic effect tuning, centered layout precision |
| `src/components/StartMenu/StartMenu.module.css` | Animation timing, dimensions, acrylic effect |
| `src/components/Taskbar/SystemTray.module.css` | Pill group styling refinement |

## 3. Implementation Steps

### Step 1: Write component tests (TDD)
- **Files**: `tests/components/Desktop/DesktopIcon.test.tsx`, `tests/components/Desktop/Desktop.test.tsx`, `tests/components/Taskbar/StartButton.test.tsx`, `tests/components/Taskbar/Clock.test.tsx`, `tests/components/StartMenu/StartMenu.test.tsx`, `tests/components/StartMenu/AppTile.test.tsx`
- **What to test**:
  - DesktopIcon: renders icon and label, calls onSelect on click, applies selected class when isSelected=true, calls onDoubleClick on double-click
  - Desktop: renders all 5 icons, calls onBackgroundClick when clicking background, stops propagation from icon grid
  - StartButton: renders, calls onClick, applies active class when isActive=true
  - Clock: renders time and date strings
  - StartMenu: renders search bar, pinned apps, recommended section, user/power row
  - AppTile: renders icon and label, calls onClick with id
- **Verification**: `npm run test` passes with all tests green
- **Lines**: ~150

### Step 2: Visual polish — theme tokens and wallpaper
- **Files**: `src/styles/theme.css`, `src/components/Desktop/Desktop.module.css`
- **What to do**:
  - Compare each CSS custom property value against a Windows 11 dark mode screenshot
  - Adjust wallpaper gradient stops to better match the Bloom wallpaper color temperature
  - Verify font-size, font-weight, and spacing values render correctly
- **Verification**: Side-by-side screenshot comparison at 1920×1080
- **Lines**: ~30 CSS changes

### Step 3: Visual polish — taskbar and system tray
- **Files**: `src/components/Taskbar/Taskbar.module.css`, `src/components/Taskbar/SystemTray.module.css`, `src/components/Taskbar/TaskbarIcon.module.css`
- **What to do**:
  - Verify taskbar is exactly 48px, acrylic blur is convincing
  - Ensure centered icon group is truly centered (not offset by system tray width)
  - Refine pill-shaped hover area for system tray icon group
  - Verify tooltip positioning and styling
- **Verification**: Visual comparison with Windows 11 taskbar screenshot
- **Lines**: ~40 CSS changes

### Step 4: Visual polish — Start Menu animation and layout
- **Files**: `src/components/StartMenu/StartMenu.module.css`, `src/components/StartMenu/StartMenu.tsx`
- **What to do**:
  - Verify Start Menu dimensions (600×700px), positioning (centered above taskbar)
  - Tune open animation (translateY + opacity, 200ms ease-out)
  - Add close animation (reverse, 150ms) using a closing state
  - Verify pinned apps 6-column grid spacing
  - Verify recommended items layout
- **Verification**: Open/close animation feels smooth, layout matches Windows 11
- **Lines**: ~50

## 4. Dependency Graph

```
Step 1 (tests) → Step 2 (theme polish)
                → Step 3 (taskbar polish)
                → Step 4 (Start Menu polish)
```

Steps 2, 3, and 4 are independent of each other but all depend on Step 1 (tests must exist before making changes).

## 5. Integration Checkpoints

1. **After Step 1**: All tests pass. The scaffold is verified to work correctly at the interaction level.
2. **After Steps 2-4**: Full visual review at 1920×1080. Compare side-by-side with Windows 11 screenshot. Check: wallpaper, icon grid, taskbar height/blur, Start Menu animation, system tray clock.

## 6. Risk Mitigation Steps

| Risk | Mitigation Step |
|------|----------------|
| Icon names change in @fluentui/react-icons updates | Pin exact version in package.json. Already resolved during scaffolding (WindowsRegular → WindowRegular, etc.) |
| backdrop-filter rendering differs across browsers | Test in Chrome, Firefox, Safari after Step 3. Add `@supports` fallback in Taskbar.module.css and StartMenu.module.css |
| Start Menu close animation requires state machine | Implement in Step 4 using a `isClosing` state with `onAnimationEnd` callback to unmount |
| CSS custom property values don't match Windows 11 | Step 2 is dedicated to verifying every token. Use browser DevTools color picker on Windows 11 screenshots |
