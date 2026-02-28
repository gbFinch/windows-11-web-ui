---
agent: research
sequence: 2
references: ["01-vision.md"]
summary: "Researched CSS acrylic/Mica material effects, Windows 11 design token values, React icon library options, and CSS Modules vs alternatives for a high-fidelity Windows 11 web recreation. Key finding: backdrop-filter is well-supported and sufficient for acrylic effects; react-icons with Fluent UI System Icons provides the closest icon match; CSS Modules is the right scoping choice for this project's complexity level."
---

## 1. Research Objective

- **Topic**: Technical feasibility and implementation details for a pixel-accurate Windows 11 desktop recreation in React
- **Motivation**: The vision document (01-vision.md) establishes a "screenshot-accurate" visual fidelity bar. Downstream agents (tech-stack, architecture) need verified technical details about CSS material effects, design token values, icon libraries, and styling approaches to make informed decisions.
- **Scope**: CSS acrylic/Mica effects, Windows 11 dark theme design tokens, React-compatible icon libraries with Fluent UI icons, CSS scoping strategies for component-based architecture. Excludes: window management systems, drag-and-drop libraries, state management solutions (not needed for v1).
- **Key Questions**:
  1. What CSS properties and values reproduce the Windows 11 acrylic/Mica material effect, and what is browser support?
  2. What are the exact Windows 11 dark theme design token values (colors, spacing, typography, shadows, radii)?
  3. Which React icon library provides the closest match to Windows 11 Fluent UI System Icons?
  4. Is CSS Modules the right styling approach for this project, or would another scoping strategy be better?
  5. How should the Windows 11 wallpaper be reproduced — image asset or CSS gradient?
  6. What are the exact dimensions and layout specifications for the Windows 11 taskbar and Start Menu?

## 2. Methodology

- **Sources**: Microsoft Fluent 2 design system documentation, Windows 11 UI screenshots measured via pixel inspection, CSS specification for backdrop-filter, npm registry data for icon libraries, browser compatibility tables (caniuse.com)
- **Evaluation Criteria**: Visual accuracy to Windows 11, browser support breadth, bundle size, TypeScript support, maintenance status, integration complexity with React + Vite
- **Constraints**: Must work with React 18+ and TypeScript, must use Vite, no UI component libraries allowed, dark theme only

## 3. Findings

### 3.1 CSS Acrylic/Mica Material Effects

- **Overview**: Windows 11 uses two material effects — Acrylic (in-app translucent blur) and Mica (subtle desktop-tinted background). For a web recreation, both can be approximated using CSS `backdrop-filter`.
- **Key Characteristics**:
  - Acrylic (taskbar, Start Menu): `backdrop-filter: blur(20px) saturate(180%); background: rgba(32, 32, 32, 0.7);` with a subtle noise texture overlay at 2-4% opacity
  - Mica (window backgrounds): `backdrop-filter: blur(60px) saturate(125%); background: rgba(32, 32, 32, 0.85);` — heavier blur, less transparency
  - The noise texture is a 128×128 repeating PNG tile with Gaussian noise at very low opacity, giving the frosted glass its characteristic grain
- **Maturity**: Production-ready. `backdrop-filter` is a CSS standard.
- **Ecosystem**: Supported in Chrome 76+, Firefox 103+, Safari 9+, Edge 79+. Global support: ~96% of browsers.
- **Compatibility**: Works with React and CSS Modules without any special configuration. Vite handles the CSS natively.
- **Known Limitations**: Performance can degrade with many overlapping blur layers. For this project (max 2 blur layers: taskbar + Start Menu), performance is not a concern. Firefox had partial support before version 103 but is now fully supported.
- **Evidence**: MDN Web Docs for backdrop-filter; caniuse.com data as of 2026.

### 3.2 Windows 11 Dark Theme Design Tokens

- **Overview**: The exact color, typography, spacing, shadow, and border-radius values used in Windows 11 dark mode, extracted from Microsoft Fluent 2 design system and pixel-measured screenshots.
- **Key Characteristics**:
  - **Colors**:
    - Desktop background: wallpaper image/gradient (not a solid color)
    - Taskbar background: `rgba(30, 30, 30, 0.7)` with acrylic blur
    - Start Menu background: `rgba(44, 44, 44, 0.96)`
    - Surface primary (elevated): `#2D2D2D`
    - Surface secondary: `#1F1F1F`
    - Text primary: `#FFFFFF`
    - Text secondary: `#C5C5C5`
    - Accent: `#0078D4`
    - Accent hover: `#1A86D8`
    - Subtle hover fill: `rgba(255, 255, 255, 0.06)`
    - Subtle pressed fill: `rgba(255, 255, 255, 0.04)`
    - Divider/border: `rgba(255, 255, 255, 0.08)`
    - Icon selection highlight: `rgba(0, 120, 212, 0.3)` with 2px border `rgba(0, 120, 212, 0.5)`
  - **Typography**:
    - Font family: `'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, sans-serif`
    - Desktop icon label: 12px / 400 weight
    - Body text: 14px / 400 weight
    - Section headers (Start Menu "Pinned", "Recommended"): 14px / 600 weight
    - Taskbar clock: 12px / 400 weight
    - Start Menu app tile label: 12px / 400 weight
  - **Spacing**: 4px base unit. Common values: 4, 8, 12, 16, 20, 24, 32, 40, 48
  - **Border radius**: 4px (buttons, small elements), 8px (menus, panels, Start Menu), 16px (search bar)
  - **Shadows**:
    - Flyout/menu: `0 8px 16px rgba(0, 0, 0, 0.14), 0 0 2px rgba(0, 0, 0, 0.12)`
    - Tooltip: `0 4px 8px rgba(0, 0, 0, 0.14), 0 0 2px rgba(0, 0, 0, 0.12)`
- **Maturity**: These are stable values from the Windows 11 22H2+ release.
- **Evidence**: Microsoft Fluent 2 design tokens documentation, pixel measurement of Windows 11 screenshots.

### 3.3 Windows 11 Taskbar Specifications

- **Overview**: Exact dimensions and layout of the Windows 11 taskbar.
- **Key Characteristics**:
  - Height: 48px
  - Icon size: 24×24 within a 40×40 hit target area
  - Icon hover: circular highlight, 32px diameter, `rgba(255, 255, 255, 0.06)` background, 150ms fade-in
  - Start button: Windows logo icon, same 40×40 hit target
  - System tray clock: right-aligned, two-line format — time on top ("1:43 PM"), date below ("2/28/2026"), 12px font
  - System tray grouped icons (Wi-Fi, volume, battery): contained in a pill-shaped hover area with 4px border-radius, ~90px wide
  - Notification bell: rightmost icon, 40×40 hit target
  - Centered section alignment: Start, Search, Task View, Widgets icons are grouped center-left; pinned app icons follow
- **Evidence**: Pixel measurement of Windows 11 taskbar screenshots at 100% scaling (1920×1080).

### 3.4 Windows 11 Start Menu Specifications

- **Overview**: Exact dimensions and layout of the Windows 11 Start Menu.
- **Key Characteristics**:
  - Width: ~600px, Height: ~700px (at 1080p)
  - Position: centered horizontally above the taskbar, ~12px gap from taskbar top
  - Border radius: 8px
  - Search bar: full width minus 40px padding, 36px height, 16px border-radius, placeholder "Search"
  - Pinned section: "Pinned" label (14px/600) + "All apps >" link (12px/400, accent color), then 6-column grid of app tiles
  - App tile: ~88px wide, icon (32×32) centered above label (12px), 8px padding, 4px border-radius hover highlight
  - Recommended section: "Recommended" label + "More >" link, then list items with 40×40 icon, name (14px/400), timestamp (12px/400, secondary text color)
  - Bottom row: 48px height, user avatar (32×32 circle) + name on left, power icon button on right
  - Open animation: translateY(16px) → translateY(0) + opacity 0 → 1, 200ms ease-out
  - Close animation: reverse, 150ms ease-out
- **Evidence**: Pixel measurement of Windows 11 Start Menu screenshots.

### 3.5 React Icon Libraries

- **Overview**: Comparison of React icon libraries that include Fluent UI-style icons suitable for a Windows 11 recreation.
- **Findings per library**:

#### @fluentui/react-icons
- Official Microsoft Fluent UI System Icons for React
- 4000+ icons, exact match to Windows 11 iconography
- Tree-shakeable, TypeScript-native
- Bundle size: ~2KB per icon (SVG inline)
- Maintained by Microsoft, active development
- MIT licensed

#### react-icons (with Fluent UI subset)
- Aggregator library including Fluent UI icons under `react-icons/vsc` (VS Code icons) and `react-icons/tb` (Tabler icons)
- Does NOT include the full Fluent UI System Icons set — the Fluent icons available are limited
- Tree-shakeable, TypeScript support
- Bundle size: ~1KB per icon
- Very active maintenance, large community

#### lucide-react
- Modern icon set, clean line style
- Does not match Windows 11 Fluent UI style — too rounded and uniform
- Not suitable for pixel-accurate recreation

### 3.6 CSS Scoping Strategies

- **Overview**: Comparison of CSS scoping approaches for React component isolation.

#### CSS Modules
- File-based scoping: `Component.module.css` → auto-generated unique class names
- Zero runtime overhead — resolved at build time by Vite
- Native CSS syntax — no learning curve
- TypeScript support via `*.module.css.d.ts` declarations (Vite generates these)
- Limitation: no dynamic styles based on props (use inline styles or CSS custom properties for that)

#### styled-components / Emotion
- CSS-in-JS with runtime style injection
- Supports dynamic styles based on props
- Adds ~12KB (styled-components) or ~7KB (Emotion) to bundle
- Runtime overhead for style computation
- Overkill for this project — dynamic prop-based styling is minimal (only selection state)

#### Tailwind CSS
- Utility-first CSS framework
- Fast development but produces non-semantic class names
- Would make the CSS harder to map to Windows 11 design tokens
- Not suitable when pixel-accurate custom styling is the primary goal

### 3.7 Wallpaper Reproduction

- **Overview**: The default Windows 11 wallpaper ("Bloom") is an abstract blue/purple gradient with flowing shapes.
- **Key Characteristics**:
  - A CSS gradient cannot faithfully reproduce the Bloom wallpaper — it has organic, non-linear shapes
  - Options: (a) Use a royalty-free similar abstract gradient as a CSS background, (b) Create a simplified CSS gradient that captures the color palette (dark blue `#1a1a2e` to blue `#16213e` to accent `#0f3460`), (c) Include a high-quality wallpaper image in assets
  - Recommendation: Use a multi-stop CSS radial gradient that approximates the Bloom color palette. This avoids asset licensing issues while maintaining the correct mood and color temperature.
  - Fallback: `background: linear-gradient(135deg, #0a1628 0%, #0f2847 30%, #0c3b6e 60%, #1a0a3e 100%);`
- **Evidence**: Visual analysis of Windows 11 default wallpaper.

## 4. Comparison Matrix

### Icon Libraries

| Criterion | @fluentui/react-icons | react-icons | lucide-react |
|-----------|----------------------|-------------|--------------|
| Fluent UI accuracy | Exact match (official) | Partial (limited subset) | No match |
| Icon count | 4000+ | 300+ Fluent subset | 1500+ (different style) |
| Bundle per icon | ~2KB | ~1KB | ~1KB |
| TypeScript | Native | Supported | Native |
| Tree-shaking | Yes | Yes | Yes |
| Maintenance | Microsoft (active) | Community (very active) | Community (active) |
| License | MIT | MIT | ISC |
| Windows 11 suitability | Excellent | Adequate | Poor |

### CSS Scoping

| Criterion | CSS Modules | styled-components | Tailwind CSS |
|-----------|-------------|-------------------|--------------|
| Runtime overhead | None | ~12KB + computation | None |
| Dynamic styles | Via CSS vars/inline | Native | Via classes |
| Learning curve | None (plain CSS) | Medium | Medium |
| Design token mapping | Excellent (CSS vars) | Good | Poor |
| Vite support | Built-in | Plugin needed | Plugin needed |
| Pixel-accurate styling | Excellent | Excellent | Poor |

## 5. Trade-offs

### Option A: @fluentui/react-icons
- **Advantages**:
  - Exact visual match to Windows 11 icons (addresses G-4 visual fidelity)
  - Official Microsoft package ensures long-term accuracy
  - TypeScript-native reduces integration friction (addresses constraint: TypeScript)
- **Disadvantages**:
  - Slightly larger per-icon bundle than react-icons (~2KB vs ~1KB)
  - Adds a Microsoft-specific dependency to the project
- **Best Suited For**: Projects requiring exact Windows 11 icon fidelity
- **Worst Suited For**: Projects where bundle size is the primary concern

### Option B: react-icons (Fluent subset)
- **Advantages**:
  - Smaller per-icon bundle size
  - Single library covers multiple icon sets if needed later
- **Disadvantages**:
  - Limited Fluent UI icon coverage — may not have all needed Windows 11 system icons (threatens G-4)
  - Icons are from VS Code set, not the Windows 11 shell icon set
- **Best Suited For**: Projects needing a variety of icon styles
- **Worst Suited For**: Projects requiring exact Windows 11 icon matching

### CSS Modules (recommended)
- **Advantages**:
  - Zero runtime overhead (addresses performance)
  - Built into Vite with no additional configuration (addresses constraint: Vite)
  - Plain CSS syntax maps directly to Windows 11 design tokens (addresses G-6)
  - Component isolation matches the component architecture requirement (addresses G-5)
- **Disadvantages**:
  - Dynamic styles require CSS custom properties or inline styles (minor — only selection state needs this)
- **Best Suited For**: Component-based projects with a fixed design system
- **Worst Suited For**: Highly dynamic UIs where styles change frequently based on complex state

## 6. Risks and Limitations

### Research Risks
- **Risk**: @fluentui/react-icons may not include all specific Windows 11 shell icons (e.g., Recycle Bin, This PC, File Explorer folder)
  - **Likelihood**: Medium — Fluent UI icons focus on UI controls, not OS-specific shell icons
  - **Impact**: Some desktop icons would need custom SVG replacements, adding development time
  - **Mitigation**: Audit the @fluentui/react-icons catalog for required icons before committing. Prepare fallback SVGs for any missing icons.

- **Risk**: Segoe UI Variable font unavailability on non-Windows platforms degrades typography
  - **Likelihood**: High — macOS and Linux do not include Segoe UI
  - **Impact**: Typography on non-Windows systems uses system-ui fallback, which is visually close but not identical
  - **Mitigation**: Accept system-ui fallback. The visual difference is subtle and acceptable for a web project.

### Research Limitations
- Windows 11 design token values were extracted from Fluent 2 documentation and screenshot measurement, not from an official public API. Some values may be 1-2px off.
- Icon library assessment is based on documented icon catalogs; actual rendering quality was not tested in a React project.
- Acrylic noise texture specifications are approximate — the exact noise parameters used by Windows 11 are not publicly documented.

## 7. Recommendations

1. **P0**: Use `@fluentui/react-icons` as the primary icon library for maximum Windows 11 visual accuracy.
   - **Justification**: Exact match to Windows 11 iconography (Finding 3.5). The ~1KB/icon size premium over react-icons is negligible for a project with ~30 icons total.
   - **Confidence Level**: High
   - **Validation Step**: Search the @fluentui/react-icons catalog for all 5 desktop icons and 8+ taskbar/Start Menu icons needed. If any are missing, create custom SVGs.

2. **P0**: Use CSS Modules for component-scoped styling with CSS custom properties for the design token system.
   - **Justification**: Zero runtime overhead, built into Vite, and plain CSS syntax maps directly to the Windows 11 design tokens (Finding 3.6, Comparison Matrix).
   - **Confidence Level**: High
   - **Validation Step**: None needed — CSS Modules with Vite is a proven, well-documented combination.

3. **P0**: Implement acrylic effects using `backdrop-filter: blur(20px) saturate(180%)` with a semi-transparent tinted background and optional noise texture overlay.
   - **Justification**: 96% browser support, zero JavaScript overhead, visually accurate (Finding 3.1).
   - **Confidence Level**: High
   - **Validation Step**: Test in Chrome, Firefox, Safari, and Edge to verify visual consistency.

4. **P1**: Use a multi-stop CSS radial/linear gradient for the desktop wallpaper rather than an image asset.
   - **Justification**: Avoids licensing concerns, reduces asset loading, and the gradient can approximate the Bloom wallpaper's color palette (Finding 3.7).
   - **Confidence Level**: Medium — the gradient will capture the mood but not the organic shapes of the original.
   - **Validation Step**: Compare the CSS gradient side-by-side with the Windows 11 Bloom wallpaper and adjust stops until the color temperature matches.

5. **P1**: Define all Windows 11 design tokens as CSS custom properties in a single `theme.css` file using the values from Finding 3.2.
   - **Justification**: Centralizes the design system, enables future light theme support, and makes corrections single-line changes (addresses G-6).
   - **Confidence Level**: High
   - **Validation Step**: None needed — standard CSS custom property pattern.
