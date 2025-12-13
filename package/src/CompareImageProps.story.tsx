import React from 'react';
import { Box, Text } from '@mantine/core';
import { CompareImage, CompareImageProps } from './CompareImage';

export default {
  title: 'CompareImage Props',
  args: {
    aspectRatio: '16/9',
    defaultPosition: 50,
  },
  argTypes: {
    aspectRatio: { control: 'text' },
    defaultPosition: { control: { type: 'number', min: 0, max: 100 } },
  },
};

export function UsageProps(props: CompareImageProps) {
  const leftSection = (
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
        Left Section
      </Text>
    </Box>
  );

  const rightSection = (
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
        Right Section
      </Text>
    </Box>
  );

  return <CompareImage leftSection={leftSection} rightSection={rightSection} {...props} />;
}
