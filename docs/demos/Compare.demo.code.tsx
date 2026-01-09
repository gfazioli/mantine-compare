import { Compare } from '@gfazioli/mantine-compare';
import { CodeHighlight } from '@mantine/code-highlight';
import { MantineDemo } from '@mantinex/demo';
import classes from './Compare.module.css';

const code = `import { Compare } from '@gfazioli/mantine-compare';
import { CodeHighlight } from '@mantine/code-highlight';
import { exampleCodeBefore } from './exampleCodeBefore';
import { exampleCodeAfter } from './exampleCodeAfter';
import classes from './Compare.module.css';

function Demo() {
  return (
    <Compare
      classNames={classes}
      defaultPosition={80}
      leftSection={<CodeHighlight code={exampleCodeBefore} language="tsx" radius="md" />}
      rightSection={<CodeHighlight code={exampleCodeAfter} language="tsx" radius="md" />}
    />
  );
}`;

const cssCode = `.root {
  background-color: var(--mantine-color-gray-0);

  @mixin dark {
    background-color: var(--mantine-color-dark-8);
  }
}

.sliderLine {
  background-color: var(--mantine-color-dark-1);

  @mixin dark {
    background-color: var(--mantine-color-dark-6);
  }

  height: 16px;
  filter: blur(8px);
}`;

const codeExampleCodeBefore = `export const exampleCodeBefore = \`type Item = { id: string; price: number; qty: number };

function total(items: Item[], discountCode?: string): number {

    let sum = 0;
    for (const it of items) {
        sum += it.price * it.qty;
    }
    if (discountCode === "SAVE10") {
        sum = sum * 0.9;
    }
    return Math.round(sum * 100) / 100;
}
\`;`;

const codeExampleCodeAfter = `export const exampleCodeAfter = \`type Item = { id: string; price: number; qty: number };
type Discount = { code: string; apply(total: number): number };

const SAVE10: Discount = { code: "SAVE10", apply: (t) => t * 0.9 };
const discounts: Record<string, Discount> = { [SAVE10.code]: SAVE10 };

function computeTotal(items: Item[], discountCode?: string): number {
    if (items.some(i => i.price < 0 || i.qty <= 0)) {
        throw new Error("Invalid item values");
    }
    const base = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discounted = discountCode && discounts[discountCode]
        ? discounts[discountCode].apply(base)
        : base;
    return Math.round(discounted * 100) / 100;
}
\`;`;

const exampleCodeBefore = `type Item = { id: string; price: number; qty: number };

function total(items: Item[], discountCode?: string): number {

    let sum = 0;
    for (const it of items) {
        sum += it.price * it.qty;
    }
    if (discountCode === "SAVE10") {
        sum = sum * 0.9;
    }
    return Math.round(sum * 100) / 100;
}
`;

const exampleCodeAfter = `type Item = { id: string; price: number; qty: number };
type Discount = { code: string; apply(total: number): number };

const SAVE10: Discount = { code: "SAVE10", apply: (t) => t * 0.9 };
const discounts: Record<string, Discount> = { [SAVE10.code]: SAVE10 };

function computeTotal(items: Item[], discountCode?: string): number {
    if (items.some(i => i.price < 0 || i.qty <= 0)) {
        throw new Error("Invalid item values");
    }
    const base = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discounted = discountCode && discounts[discountCode]
        ? discounts[discountCode].apply(base)
        : base;
    return Math.round(discounted * 100) / 100;
}
`;

function Demo() {
  return (
    <Compare
      classNames={classes}
      defaultPosition={80}
      leftSection={<CodeHighlight code={exampleCodeBefore} language="tsx" radius="md" />}
      rightSection={<CodeHighlight code={exampleCodeAfter} language="tsx" radius="md" />}
    />
  );
}

export const codeSyntax: MantineDemo = {
  type: 'code',
  code: [
    {
      fileName: 'demo.tsx',
      code,
      language: 'tsx',
    },
    {
      fileName: 'Compare.module.css',
      code: cssCode,
      language: 'scss',
    },
    {
      fileName: 'exampleCodeBefore.ts',
      code: codeExampleCodeBefore,
      language: 'tsx',
    },
    {
      fileName: 'exampleCodeAfter.ts',
      code: codeExampleCodeAfter,
      language: 'tsx',
    },
  ],
  component: Demo,
  defaultExpanded: false,
};
