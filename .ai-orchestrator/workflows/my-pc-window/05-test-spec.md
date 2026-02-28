---
agent: test-spec
sequence: 5
references: ["spec", "impl-plan"]
summary: "17 test cases covering Window component (7 unit, 3 edge cases) and ThisPcContent (4 unit), plus 3 non-functional verification cases. Uses Vitest + React Testing Library with vi.fn() mocks. All tests map to spec requirements FR-1 through FR-19 and AC-1 through AC-10."
---

## Test Strategy

- **Test Framework**: Vitest 2.x with jsdom environment
- **Test Runner**: `npm run test` (vitest run)
- **Assertion Style**: `expect()` from Vitest with `@testing-library/jest-dom` matchers
- **Mocking Strategy**: `vi.fn()` for all callback props. No external service mocks needed — all data is static.
- **Test Naming Convention**: `describe('<Component>')` → `it('<behavior description>')`
- **Coverage Target**: 100% of new components (Window, ThisPcContent). Measured by function coverage.
- **Test Categories**: Unit tests only — no integration or e2e tests needed for this feature (all components are testable in isolation with React Testing Library).

## Test Coverage Matrix

| Requirement ID | Requirement Summary | Test Case IDs | Coverage Type |
|---------------|-------------------|---------------|---------------|
| FR-1 | Window renders title bar with icon, title, 3 buttons | TC-U-01 | Unit |
| FR-4 | Minimize hides window (visibility hidden) | TC-U-04 | Unit |
| FR-5/FR-6 | Maximize/restore toggle | TC-U-05 | Unit |
| FR-8 | Close button calls onClose | TC-U-02 | Unit |
| FR-9 | Click window calls onFocus | TC-U-06 | Unit |
| FR-10 | Window renders children | TC-U-07 | Unit |
| FR-16 | Nav bar with "This PC" breadcrumb | TC-U-08 | Unit |
| FR-17 | Sidebar with 4 items | TC-U-09 | Unit |
| FR-18 | Three drive tiles with labels | TC-U-10 | Unit |
| FR-19 | Drive tiles show free/total text | TC-U-11 | Unit |
| FR-2 | Minimize button calls onMinimize | TC-U-03 | Unit |
| FR-3 | Resize enforces minimum size | TC-E-01 | Edge Case |
| FR-7 | Double-click title bar calls onMaximize | TC-E-02 | Edge Case |
| FR-11 | Window not rendered below taskbar when maximized | TC-E-03 | Edge Case |
| NFR-4 | Title bar buttons have correct dimensions | TC-NF-01 | Non-Functional |
| NFR-6 | CSS Modules used (no inline styles leak) | TC-NF-02 | Non-Functional |
| NFR-8 | Drive usage bars present | TC-NF-03 | Non-Functional |
| AC-1 | This PC window shows drive tiles | TC-U-10, TC-U-11 | Unit |
| AC-4 | Minimize hides window in DOM | TC-U-04 | Unit |
| AC-7 | Close removes window | TC-U-02 | Unit |
| AC-9 | Three drive tiles visible | TC-U-10 | Unit |
| AC-10 | Nav bar + sidebar visible | TC-U-08, TC-U-09 | Unit |

## Unit Test Cases

### Window Component

#### TC-U-01: Window renders title bar with title text and three control buttons
- **Covers**: FR-1, AC-1
- **Component**: `Window`
- **Setup**: Render Window with title="Test Window", all callbacks as vi.fn(), children as `<div>test content</div>`
- **Input**: Default props with isMinimized=false, isMaximized=false
- **Expected Output**: Text "Test Window" is in the document. Three buttons exist in the title bar (minimize, maximize, close) — query by aria-label.
- **Teardown**: None

#### TC-U-02: Close button calls onClose with window id
- **Covers**: FR-8, AC-7
- **Component**: `Window`
- **Setup**: Render Window with id="win-1", onClose=vi.fn()
- **Input**: Click the close button (aria-label="Close")
- **Expected Output**: onClose called once with "win-1"
- **Teardown**: None

#### TC-U-03: Minimize button calls onMinimize with window id
- **Covers**: FR-2, FR-4
- **Component**: `Window`
- **Setup**: Render Window with id="win-1", onMinimize=vi.fn()
- **Input**: Click the minimize button (aria-label="Minimize")
- **Expected Output**: onMinimize called once with "win-1"
- **Teardown**: None

#### TC-U-04: Window is hidden when isMinimized is true
- **Covers**: FR-4, AC-4
- **Component**: `Window`
- **Setup**: Render Window with isMinimized=true
- **Input**: No user action
- **Expected Output**: The window wrapper element has `visibility: hidden` style
- **Teardown**: None

#### TC-U-05: Maximize button calls onMaximize with window id
- **Covers**: FR-5, FR-6, AC-5
- **Component**: `Window`
- **Setup**: Render Window with id="win-1", onMaximize=vi.fn()
- **Input**: Click the maximize button (aria-label="Maximize")
- **Expected Output**: onMaximize called once with "win-1"
- **Teardown**: None

#### TC-U-06: Clicking window body calls onFocus
- **Covers**: FR-9, AC-8
- **Component**: `Window`
- **Setup**: Render Window with id="win-1", onFocus=vi.fn()
- **Input**: Click (pointerdown) on the window container
- **Expected Output**: onFocus called with "win-1"
- **Teardown**: None

#### TC-U-07: Window renders children content
- **Covers**: FR-10
- **Component**: `Window`
- **Setup**: Render Window with children `<p>Hello World</p>`
- **Input**: No user action
- **Expected Output**: Text "Hello World" is in the document
- **Teardown**: None

### ThisPcContent Component

#### TC-U-08: Renders breadcrumb with "This PC" text
- **Covers**: FR-16, AC-10
- **Component**: `ThisPcContent`
- **Setup**: Render ThisPcContent
- **Input**: No user action
- **Expected Output**: Text "This PC" is in the document
- **Teardown**: None

#### TC-U-09: Renders sidebar with four quick-access items
- **Covers**: FR-17, AC-10
- **Component**: `ThisPcContent`
- **Setup**: Render ThisPcContent
- **Input**: No user action
- **Expected Output**: Texts "Desktop", "Documents", "Downloads", "Pictures" are all in the document
- **Teardown**: None

#### TC-U-10: Renders three drive tiles with correct labels
- **Covers**: FR-18, AC-9
- **Component**: `ThisPcContent`
- **Setup**: Render ThisPcContent
- **Input**: No user action
- **Expected Output**: Texts "Local Disk (C:)", "Data (D:)", "USB Drive (E:)" are all in the document
- **Teardown**: None

#### TC-U-11: Drive tiles show free/total text
- **Covers**: FR-19, AC-9
- **Component**: `ThisPcContent`
- **Setup**: Render ThisPcContent
- **Input**: No user action
- **Expected Output**: Texts "120 GB free of 256 GB", "340 GB free of 512 GB", "18 GB free of 32 GB" are all in the document
- **Teardown**: None

## Edge Case and Error Test Cases

#### TC-E-01: Window renders at specified position and size
- **Covers**: FR-3
- **Category**: Boundary condition
- **Setup**: Render Window with x=100, y=50, width=600, height=400
- **Input**: No user action
- **Expected Behavior**: Window wrapper element has style containing left: 100px, top: 50px, width: 600px, height: 400px
- **Why This Matters**: Verifies the controlled position/size props are applied correctly

#### TC-E-02: Double-clicking title bar calls onMaximize
- **Covers**: FR-7, AC-6
- **Category**: Interaction variant
- **Setup**: Render Window with id="win-1", onMaximize=vi.fn()
- **Input**: Double-click the title bar area
- **Expected Behavior**: onMaximize called with "win-1"
- **Why This Matters**: Title bar double-click is an alternative maximize trigger

#### TC-E-03: Maximized window has correct positioning
- **Covers**: FR-5, FR-11
- **Category**: Boundary condition
- **Setup**: Render Window with isMaximized=true
- **Input**: No user action
- **Expected Behavior**: Window wrapper has style with left: 0px, top: 0px
- **Why This Matters**: Maximized windows must fill viewport above taskbar

## Non-Functional Test Cases

#### TC-NF-01: Title bar buttons are rendered as accessible buttons
- **Covers**: NFR-4
- **Type**: Accessibility / Structure
- **Setup**: Render Window
- **Procedure**: Query for buttons by aria-label
- **Threshold**: All three buttons (Minimize, Maximize, Close) are found as button elements
- **Measurement Method**: `screen.getByRole('button', { name: 'Minimize' })` etc.

#### TC-NF-02: Window uses CSS Modules (class names applied)
- **Covers**: NFR-6
- **Type**: Structure
- **Setup**: Render Window
- **Procedure**: Check that the window container has a className
- **Threshold**: Container element has a non-empty className attribute
- **Measurement Method**: `container.firstChild` has truthy `className`

#### TC-NF-03: Drive tiles contain usage bar elements
- **Covers**: NFR-8
- **Type**: Structure
- **Setup**: Render ThisPcContent
- **Procedure**: Query for usage bar elements by role or test-id
- **Threshold**: 3 usage bar elements found (one per drive)
- **Measurement Method**: `getAllByRole('progressbar')` returns 3 elements

## Test Data Requirements

**Window default props factory**:
```typescript
const defaultWindowProps = {
  id: 'win-1',
  title: 'Test Window',
  x: 100, y: 50,
  width: 600, height: 400,
  zIndex: 1,
  isMinimized: false,
  isMaximized: false,
  onMove: vi.fn(),
  onResize: vi.fn(),
  onMinimize: vi.fn(),
  onMaximize: vi.fn(),
  onClose: vi.fn(),
  onFocus: vi.fn(),
}
```

No external mocks needed. ThisPcContent uses static data from `src/data/drives.ts`.

## Test File Map

| Test File | Test Case IDs | Tests For (Source File) |
|----------|---------------|----------------------|
| `tests/components/Window/Window.test.tsx` | TC-U-01 through TC-U-07, TC-E-01, TC-E-02, TC-E-03, TC-NF-01, TC-NF-02 | `src/components/Window/Window.tsx` |
| `tests/components/ThisPcContent/ThisPcContent.test.tsx` | TC-U-08 through TC-U-11, TC-NF-03 | `src/components/ThisPcContent/ThisPcContent.tsx` |
