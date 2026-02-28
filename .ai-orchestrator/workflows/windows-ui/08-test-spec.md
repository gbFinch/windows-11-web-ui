---
agent: test-spec
sequence: 8
references: ["04-architecture.md", "07-implementation-plan.md"]
summary: "Test specification covering 6 component test files with 25 test cases. Uses Vitest + React Testing Library. Tests focus on interaction behavior (icon selection, Start Menu toggle, clock display) and component rendering (correct children, prop forwarding). Visual styling is excluded from automated tests — verified manually."
---

## 1. Test Strategy

- **Framework**: Vitest 2.x with jsdom environment
- **Rendering**: @testing-library/react — render components, query by role/text, fire events
- **Assertions**: @testing-library/jest-dom for DOM matchers (toBeInTheDocument, toHaveClass)
- **Convention**: One test file per component being tested, mirroring src structure under `tests/components/`
- **Scope**: Interaction behavior and rendering correctness. CSS visual accuracy is NOT tested automatically — it requires manual screenshot comparison.
- **Mocking**: @fluentui/react-icons are real components (no mocking needed — they render SVGs). CSS Modules are handled by Vite's test config.

## 2. Test Coverage Matrix

| Requirement | Component | Test Cases | File |
|-------------|-----------|------------|------|
| G-1: Desktop icons render | Desktop | Renders all 5 icons | Desktop.test.tsx |
| G-1: Icon selection | DesktopIcon | Click calls onSelect; isSelected applies class | DesktopIcon.test.tsx |
| G-1: Background deselect | Desktop | Click background calls onBackgroundClick | Desktop.test.tsx |
| G-1: Double-click wired | DesktopIcon | Double-click calls onDoubleClick | DesktopIcon.test.tsx |
| G-2: Start button | StartButton | Click calls onClick; isActive applies class | StartButton.test.tsx |
| G-2: Taskbar icons | TaskbarIcon | Renders label as tooltip; click calls onClick | TaskbarIcon.test.tsx |
| G-2: Clock display | Clock | Renders time and date strings | Clock.test.tsx |
| G-3: Start Menu content | StartMenu | Renders search, pinned, recommended, user row | StartMenu.test.tsx |
| G-3: Start Menu toggle | App-level | Covered by StartButton + StartMenu tests |  |
| G-5: Callback props | All interactive | Each test verifies callback is called with correct id | All test files |

## 3. Test Cases

### tests/components/Desktop/DesktopIcon.test.tsx (5 cases)
1. **renders icon and label** — render with props, assert label text is in document
2. **calls onSelect with id on click** — click the icon, assert onSelect called with correct id
3. **applies selected class when isSelected is true** — render with isSelected=true, assert container has the selected CSS class
4. **does not apply selected class when isSelected is false** — render with isSelected=false, assert no selected class
5. **calls onDoubleClick with id on double-click** — double-click, assert onDoubleClick called with correct id

### tests/components/Desktop/Desktop.test.tsx (3 cases)
1. **renders all provided icons** — pass 5 icons, assert all 5 labels are in document
2. **calls onBackgroundClick when clicking desktop background** — click the desktop container, assert callback fired
3. **does not call onBackgroundClick when clicking an icon** — click an icon, assert onBackgroundClick NOT called (stopPropagation)

### tests/components/Taskbar/StartButton.test.tsx (3 cases)
1. **renders without crashing** — render, assert button with "Start" aria-label exists
2. **calls onClick when clicked** — click button, assert onClick called
3. **applies active class when isActive is true** — render with isActive=true, assert active class present

### tests/components/Taskbar/TaskbarIcon.test.tsx (2 cases)
1. **renders label as accessible name** — render, assert button with aria-label matching label exists
2. **calls onClick with id when clicked** — click, assert onClick called with correct id

### tests/components/Taskbar/Clock.test.tsx (2 cases)
1. **renders current time** — render, assert a string matching time format (h:mm AM/PM) is in document
2. **renders current date** — render, assert a string matching date format (M/D/YYYY) is in document

### tests/components/StartMenu/StartMenu.test.tsx (5 cases)
1. **renders search bar** — assert input with placeholder "Search" exists
2. **renders pinned section header** — assert "Pinned" text is in document
3. **renders all pinned app tiles** — pass 18 apps, assert all 18 labels present
4. **renders recommended section header** — assert "Recommended" text is in document
5. **renders user name** — assert "User" text is in document

### tests/components/StartMenu/AppTile.test.tsx (2 cases)
1. **renders icon and label** — render, assert label text in document
2. **calls onClick with id when clicked** — click tile, assert onClick called with correct id

## 4. What Is NOT Tested

- CSS visual accuracy (colors, spacing, border-radius, shadows) — manual verification only
- Animation timing and smoothness — manual verification only
- backdrop-filter rendering — browser-specific, manual verification
- Clock interval updates — testing setInterval timing is fragile; verified manually
- Responsive layout — not in v1 scope
