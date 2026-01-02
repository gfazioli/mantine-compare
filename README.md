# Mantine Compare Component

<img width="2752" height="1536" alt="Mantine Compare" src="https://github.com/user-attachments/assets/976c8ac5-aab6-4752-849c-d89c820bc91d" />

<div align="center">
  
  [![NPM version](https://img.shields.io/npm/v/%40gfazioli%2Fmantine-compare?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-compare)
  [![NPM Downloads](https://img.shields.io/npm/dm/%40gfazioli%2Fmantine-compare?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-compare)
  [![NPM Downloads](https://img.shields.io/npm/dy/%40gfazioli%2Fmantine-compare?style=for-the-badge&label=%20&color=f90)](https://www.npmjs.com/package/@gfazioli/mantine-compare)
  ![NPM License](https://img.shields.io/npm/l/%40gfazioli%2Fmantine-compare?style=for-the-badge)

---

[<kbd> <br/> ❤️ If this component has been useful to you or your team, please consider becoming a sponsor <br/> </kbd>](https://github.com/sponsors/gfazioli?o=esc)

</div>

## Overview

This component is created on top of the [Mantine](https://mantine.dev/) library.

[Mantine Compare](https://gfazioli.github.io/mantine-compare/) provides an interactive before/after viewer for any React nodes or images, with a slider you can drag, reveal on hover, or lock to a position. Configure the divider angle (0° for left/right, 90° for top/bottom, any value for diagonal) and control the initial split via defaultPosition. Built for Mantine, it includes a Styles API for fine‑grained styling and consistent layout and accessibility.

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

## Sponsor

<div align="center">

[<kbd> <br/> ❤️ If this component has been useful to you or your team, please consider becoming a sponsor <br/> </kbd>](https://github.com/sponsors/gfazioli?o=esc)

</div>

Your support helps me:

- Keep the project actively maintained with timely bug fixes and security updates 	
- Add new features, improve performance, and refine the developer experience 	
- Expand test coverage and documentation for smoother adoption 	
- Ensure long‑term sustainability without relying on ad hoc free time 	
- Prioritize community requests and roadmap items that matter most

Open source thrives when those who benefit can give back—even a small monthly contribution makes a real difference. Sponsorships help cover maintenance time, infrastructure, and the countless invisible tasks that keep a project healthy.

Your help truly matters.

💚 [Become a sponsor](https://github.com/sponsors/gfazioli?o=esc) today and help me keep this project reliable, up‑to‑date, and growing for everyone.

---
  
[![Star History Chart](https://api.star-history.com/svg?repos=gfazioli/mantine-compare&type=Timeline)](https://www.star-history.com/#gfazioli/mantine-compare&Timeline)
