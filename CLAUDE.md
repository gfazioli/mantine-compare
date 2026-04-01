# CLAUDE.md

## Project
`@gfazioli/mantine-compare` — A Mantine 9 React component for side-by-side content comparison with a draggable, hoverable, or fixed split divider. Supports vertical, horizontal, and diagonal (arbitrary angle) dividers, drag boundaries, labels, auto-play with easing, disabled state, handle-only mode, viewport detection, and custom slider styling. Requires React 19 and TypeScript 6.

## Commands
| Command | Purpose |
|---------|---------|
| `yarn build` | Build the npm package via Rollup |
| `yarn dev` | Start the Next.js docs dev server (port 9281) |
| `yarn test` | Full test suite (syncpack + oxfmt + typecheck + lint + jest) |
| `yarn jest` | Run only Jest unit tests |
| `yarn docgen` | Generate component API docs (docgen.json) |
| `yarn docs:build` | Build the Next.js docs site for production |
| `yarn docs:deploy` | Build and deploy docs to GitHub Pages |
| `yarn lint` | Run ESLint + Stylelint |
| `yarn format:write` | Format all files with oxfmt |
| `yarn storybook` | Start Storybook dev server |
| `yarn clean` | Remove build artifacts |
| `yarn release:patch` | Bump patch version and deploy docs |
| `diny yolo` | AI-assisted commit (stage all, generate message, commit + push) |

> **Important**: After changing the public API (props, types, exports), always run `yarn clean && yarn build` before `yarn test`, because `yarn docgen` needs the fresh build output.

## Architecture

### Workspace Layout
Yarn workspaces monorepo with two workspaces: `package/` (npm package) and `docs/` (Next.js 15 documentation site).

### Package Source (`package/src/`)
```
Compare.tsx              # Component implementation (factory pattern)
Compare.module.css       # CSS Modules with data-attribute selectors
Compare.story.tsx        # Storybook stories
CompareProps.story.tsx   # Storybook configurator story
Compare.test.tsx         # Jest unit tests
index.ts                 # Public exports
lib/
  compare-geometry.ts    # Geometry utilities (clip-path, polygon clipping, line-rect intersection)
```

Single-component package — `Compare` is the only exported component, built with Mantine's `factory<CompareFactory>` pattern.

### Build Pipeline
Rollup bundles to dual ESM (`dist/esm/`) and CJS (`dist/cjs/`) with `'use client'` banner. CSS modules hashed with `hash-css-selector` (prefix `me`). TypeScript declarations via `rollup-plugin-dts`. CSS split into `styles.css` and `styles.layer.css`.

## Component Details

### Factory pattern
`Compare` uses Mantine's `factory<CompareFactory>` with `useProps`, `useStyles`, and `createVarsResolver` for CSS custom properties on `.root`.

### Variants
Three interaction modes via the `variant` prop:
- **`drag`** (default): Click and drag the slider button to compare. Shows slider button with icon.
- **`hover`**: Mouse position controls the split. No slider button.
- **`fixed`**: Static split at `defaultPosition`. No interaction, no slider button.

### Angle system
The `angle` prop (0-360°) controls the divider orientation:
- `0°` = vertical divider (left/right compare)
- `90°` = horizontal divider (top/bottom compare)
- Any value = diagonal divider using CSS `clip-path: polygon()`

The geometry is computed in `lib/compare-geometry.ts` using Sutherland-Hodgman polygon clipping.

### Controlled & uncontrolled
- **Uncontrolled**: `defaultPosition` sets the initial position. Syncs when `defaultPosition` changes at runtime.
- **Controlled**: `position` prop + `onPositionChange` callback via `useUncontrolled`.

### Labels
`leftLabel` and `rightLabel` render overlay text labels. Styled via `leftLabel`/`rightLabel` Styles API selectors.

### Drag boundaries
`minDragBound` and `maxDragBound` (0-100) limit the slider range. Respected by drag, keyboard, and auto-play.

### Disabled state
`disabled` prop blocks all interactions (drag, hover, keyboard). Renders with `data-disabled` and reduced opacity.

### Handle-only mode
`handleOnly` restricts drag to the handle button only — clicking/dragging the slider line does not move the position.

### Auto-play
`autoPlay` continuously animates the slider between min and max bounds using `requestAnimationFrame`. Pauses on hover (via ref, no re-render). Configuration:
- `autoPlaySpeed` (1-100): higher = faster. Internally converted to ms-per-percent.
- `autoPlayEasing`: `'linear'` (default), `'ease-in'`, `'ease-out'`, `'ease-in-out'`, `'spring'`. Modulates velocity based on position in the range.
- Auto-play range clamped to 1-99% to avoid degenerate clip-path at edges with diagonal angles.

### Slider styling
- `sliderColor` — color of the divider line (theme color or CSS value)
- `sliderWidth` — width in px (default 2)
- Both exposed as CSS variables: `--compare-slider-color`, `--compare-slider-width`

### Viewport detection
`onVisible` callback fires once when the component enters the viewport via `useIntersection`.

### Accessibility
- Slider has `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`
- Keyboard: Arrow keys (`keyboardStep`, default 1%), Shift+Arrow (`keyboardShiftStep`, default 10%), Home/End
- `tabIndex={0}` on slider for focus (not on `fixed` or `disabled`)
- `aria-disabled` when disabled

### CSS custom properties
- `--compare-aspect-ratio` — container aspect ratio
- `--compare-radius` — border radius from theme
- `--compare-slider-color` — slider divider color
- `--compare-slider-width` — slider divider width

### Styles API selectors
`root`, `leftSection`, `rightSection`, `slider`, `sliderLine`, `sliderButton`, `leftLabel`, `rightLabel`

### Ref handling
`ref` is extracted from props and merged with `containerRef` (for event handling), `sizeRef` (from `useElementSize`), and `intersectionRef` (for viewport detection) via `useMergedRef`.

## Testing
Jest with `jsdom` environment, `esbuild-jest` transform, CSS mocked via `identity-obj-proxy`. Tests use `@mantine-tests/core` render helper. `IntersectionObserver` mocked in `jsdom.mocks.cjs`.

## Ecosystem
This repo is part of the Mantine Extensions ecosystem, derived from the `mantine-base-component` template. See the workspace `CLAUDE.md` (in the parent directory) for:
- Development checklist (code → test → build → docs → release)
- Cross-cutting patterns (compound components, responsive CSS, GitHub sync)
- Update packages workflow
- Release process
