import { Compare, CompareProps } from '@gfazioli/mantine-compare';
import { Box, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

function Demo(props: CompareProps) {
  return (
    <Compare
      {...props}
      leftSection={
        <Box
          style={{
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size="xl" c="white" fw={700}>
            Before (leftSection)
          </Text>
        </Box>
      }
      rightSection={
        <Box
          style={{
            background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size="xl" c="white" fw={700}>
            After (rightSection)
          </Text>
        </Box>
      }
    />
  );
}

const code = `
import { Compare } from "@gfazioli/mantine-compare";
import { data } from './data';

function Demo() {
    return (
    <Compare{{props}}
      leftSection={
        <Box
          style={{
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size="xl" c="white" fw={700}>
            Before
          </Text>
        </Box>
      }
      rightSection={
        <Box
          style={{
            background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size="xl" c="white" fw={700}>
            After
          </Text>
        </Box>
      }
    />
  );
}
`;

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code: [{ fileName: 'Demo.tsx', code, language: 'tsx' }],
  controls: [
    {
      type: 'segmented',
      prop: 'variant',
      initialValue: 'drag',
      libraryValue: 'drag',
      data: [
        { value: 'drag', label: 'Drag' },
        { value: 'hover', label: 'Hover' },
        { value: 'fixed', label: 'Fixed' },
      ],
    },
    { type: 'size', prop: 'radius', initialValue: 'md', libraryValue: 'md' },
    {
      type: 'number',
      prop: 'angle',
      initialValue: 0,
      libraryValue: 0,
      min: 0,
      max: 360,
      step: 1,
    },
    { type: 'string', prop: 'aspectRatio', initialValue: undefined as any, libraryValue: null },
  ],
};
