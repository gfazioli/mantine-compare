import { Compare, CompareProps } from '@gfazioli/mantine-compare';
import { Box, Image, SegmentedControl, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { useState } from 'react';

const GradientLeft = () => (
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
);

const GradientRight = () => (
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
);

const ImageLeft = () => (
  <Image
    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
    alt="Before"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
);

const ImageRight = () => (
  <Image
    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop"
    alt="After"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
);

function Demo(props: CompareProps) {
  const [content, setContent] = useState('gradient');

  return (
    <>
      <SegmentedControl
        value={content}
        onChange={setContent}
        data={[
          { value: 'gradient', label: 'Gradients' },
          { value: 'images', label: 'Images' },
        ]}
        size="xs"
        mb="sm"
        fullWidth
      />
      <Compare
        {...props}
        leftSection={content === 'images' ? <ImageLeft /> : <GradientLeft />}
        rightSection={content === 'images' ? <ImageRight /> : <GradientRight />}
      />
    </>
  );
}

const code = `
import { Compare } from '@gfazioli/mantine-compare';
import { Box, Text } from '@mantine/core';

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
          <Text size="xl" c="white" fw={700}>Before</Text>
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
          <Text size="xl" c="white" fw={700}>After</Text>
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
    // Layout
    { type: 'size', prop: 'radius', initialValue: 'md', libraryValue: 'md' },
    { type: 'string', prop: 'aspectRatio', initialValue: '16/9', libraryValue: '16/9' },
    {
      type: 'number',
      prop: 'angle',
      initialValue: 0,
      libraryValue: 0,
      min: 0,
      max: 360,
      step: 1,
    },
    {
      type: 'number',
      prop: 'defaultPosition',
      initialValue: 50,
      libraryValue: 50,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      type: 'number',
      prop: 'minDragBound',
      initialValue: 0,
      libraryValue: 0,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      type: 'number',
      prop: 'maxDragBound',
      initialValue: 100,
      libraryValue: 100,
      min: 0,
      max: 100,
      step: 1,
    },

    // Slider appearance
    { type: 'color', prop: 'sliderColor', initialValue: '', libraryValue: '' },
    {
      type: 'number',
      prop: 'sliderWidth',
      initialValue: 2,
      libraryValue: 2,
      min: 1,
      max: 10,
      step: 1,
    },

    // Labels
    { type: 'string', prop: 'leftLabel', initialValue: '', libraryValue: '' },
    { type: 'string', prop: 'rightLabel', initialValue: '', libraryValue: '' },

    // Behavior
    { type: 'boolean', prop: 'disabled', initialValue: false, libraryValue: false },
    { type: 'boolean', prop: 'handleOnly', initialValue: false, libraryValue: false },
    // Auto-play
    { type: 'boolean', prop: 'autoPlay', initialValue: false, libraryValue: false },
    {
      type: 'number',
      prop: 'autoPlaySpeed',
      initialValue: 50,
      libraryValue: 50,
      min: 1,
      max: 100,
      step: 1,
    },
    {
      type: 'select',
      prop: 'autoPlayEasing',
      initialValue: 'linear',
      libraryValue: 'linear',
      data: [
        { value: 'linear', label: 'Linear' },
        { value: 'ease-in', label: 'Ease in' },
        { value: 'ease-out', label: 'Ease out' },
        { value: 'ease-in-out', label: 'Ease in-out' },
        { value: 'spring', label: 'Spring' },
      ],
    },
  ],
};
