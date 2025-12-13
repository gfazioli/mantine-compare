# Mantine Compare Component

<div align="center">
  
  [![NPM version](https://img.shields.io/npm/v/%40gfazioli%2Fmantine-compare?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-compare)
  [![NPM Downloads](https://img.shields.io/npm/dm/%40gfazioli%2Fmantine-compare?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-compare)
  [![NPM Downloads](https://img.shields.io/npm/dy/%40gfazioli%2Fmantine-compare?style=for-the-badge&label=%20&color=f90)](https://www.npmjs.com/package/@gfazioli/mantine-compare)
  ![NPM License](https://img.shields.io/npm/l/%40gfazioli%2Fmantine-compare?style=for-the-badge)

</div>

## Overview

This component is created on top of the [Mantine](https://mantine.dev/) library.

[![Mantine UI Library](https://img.shields.io/badge/-MANTINE_UI_LIBRARY-blue?style=for-the-badge&labelColor=black&logo=mantine
)](https://mantine.dev/)

A clean, flexible comparison component for showcasing before/after states, light vs dark themes, or alternative designs. Features a two-panel layout with support for any React content, responsive stacking, configurable aspect ratios, keyboard navigation, and full accessibility with ARIA labels. Perfect for design showcases, A/B testing visualizations, and documentation.

[![Mantine Extensions](https://img.shields.io/badge/-Watch_the_Video-blue?style=for-the-badge&labelColor=black&logo=youtube
)](https://www.youtube.com/playlist?list=PL85tTROKkZrWyqCcmNCdWajpx05-cTal4)
[![Demo and Documentation](https://img.shields.io/badge/-Demo_%26_Documentation-blue?style=for-the-badge&labelColor=black&logo=typescript
)](https://gfazioli.github.io/mantine-compare/)
[![Mantine Extensions HUB](https://img.shields.io/badge/-Mantine_Extensions_Hub-blue?style=for-the-badge&labelColor=blue
)](https://mantine-extensions.vercel.app/)


👉 You can find more components on the [Mantine Extensions Hub](https://mantine-extensions.vercel.app/) library.

## Installation

```sh
npm install @gfazioli/mantine-compare
```
or 

```sh
yarn add @gfazioli/mantine-compare
```

After installation import package styles at the root of your application:

```tsx
import '@gfazioli/mantine-compare/styles.css';
```

## Usage

```tsx
import { Compare } from '@gfazioli/mantine-compare';

function Demo() {
  return (
    <Compare
      before={<img src="/before.jpg" alt="Before" />}
      after={<img src="/after.jpg" alt="After" />}
      showLabels
      radius="md"
      withBorder
    />
  );
}
```

## Features

- 🖼️ **Flexible Content**: Each panel accepts any ReactNode - images, components, text, or interactive elements
- 📐 **Layout Controls**: Fixed aspect ratios, fit modes (contain, cover, fill), and responsive stacking
- 🎨 **Mantine Integration**: Supports radius, shadow, withBorder, and padding props from Mantine
- ⌨️ **Keyboard Navigation**: Navigate between panels using arrow keys
- ♿ **Accessible**: Full ARIA labeling for screen readers and assistive technologies
- 📱 **Responsive**: Automatic stacking on smaller screens with configurable breakpoints
- 🎯 **TypeScript**: Fully typed with comprehensive TypeScript support

## Props

- `before` - Content for the "before" or "left" panel (ReactNode)
- `after` - Content for the "after" or "right" panel (ReactNode)
- `beforeLabel` - Optional label for the before panel
- `afterLabel` - Optional label for the after panel
- `radius` - Border radius (default: 'sm')
- `shadow` - Box shadow (default: 'none')
- `withBorder` - Show border (default: false)
- `padding` - Padding inside panels (default: 'md')
- `aspectRatio` - Fixed aspect ratio like '16/9' or '1/1'
- `fit` - How content fits: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' (default: 'cover')
- `minHeight` - Minimum height for the container
- `orientation` - 'horizontal' or 'vertical' (default: 'horizontal')
- `stackAt` - Breakpoint for responsive stacking (default: 'sm')
- `showLabels` - Show visual labels on panels (default: false)
- `ariaLabel` - ARIA label for the comparison (default: 'Comparison view')

<div align="center">
  
[![Star History Chart](https://api.star-history.com/svg?repos=gfazioli/mantine-compare&type=Timeline)](https://www.star-history.com/#gfazioli/mantine-compare&Timeline)
