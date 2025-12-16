# Mantine Compare Component

<img width="2752" height="1536" alt="Mantine Compare" src="https://github.com/user-attachments/assets/976c8ac5-aab6-4752-849c-d89c820bc91d" />


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

An interactive JSON tree viewer component built with Mantine's Tree component. Features collapsible nodes, syntax highlighting with type-specific colors, copy-to-clipboard functionality, item count badges, configurable expansion depth, and smooth animations. Perfect for debugging API responses, exploring complex data structures, and developer tools.

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
import { Image } from '@mantine/core';

function Demo() {
  return (
    <Compare
      leftSection={
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
          alt="Before"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      }
      rightSection={
        <Image
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop"
          alt="After"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      }
    />
  );
}
```

<div align="center">
  
[![Star History Chart](https://api.star-history.com/svg?repos=gfazioli/mantine-compare&type=Timeline)](https://www.star-history.com/#gfazioli/mantine-compare&Timeline)
