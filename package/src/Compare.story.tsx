import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Paper, Text, Title } from '@mantine/core';
import { Compare } from './Compare';

const meta: Meta<typeof Compare> = {
  title: 'Compare',
  component: Compare,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Compare>;

export const Basic: Story = {
  args: {
    before: (
      <Box p="xl" bg="blue.1" style={{ width: '100%', height: '100%' }}>
        <Text size="xl" fw={700}>
          Before
        </Text>
        <Text>This is the content before changes</Text>
      </Box>
    ),
    after: (
      <Box p="xl" bg="green.1" style={{ width: '100%', height: '100%' }}>
        <Text size="xl" fw={700}>
          After
        </Text>
        <Text>This is the content after changes</Text>
      </Box>
    ),
    minHeight: '300px',
  },
};

export const WithLabels: Story = {
  args: {
    before: (
      <Box p="xl" bg="red.1" style={{ width: '100%', height: '100%' }}>
        <Title order={3}>Old Design</Title>
        <Text mt="md">Legacy user interface with outdated styling</Text>
      </Box>
    ),
    after: (
      <Box p="xl" bg="teal.1" style={{ width: '100%', height: '100%' }}>
        <Title order={3}>New Design</Title>
        <Text mt="md">Modern user interface with updated styling</Text>
      </Box>
    ),
    showLabels: true,
    beforeLabel: 'Original',
    afterLabel: 'Updated',
    minHeight: '300px',
  },
};

export const WithBorderAndShadow: Story = {
  args: {
    before: (
      <Paper p="xl" withBorder style={{ width: '100%', height: '100%' }}>
        <Title order={4}>Version 1.0</Title>
        <Text mt="sm" c="dimmed">
          Initial release features
        </Text>
      </Paper>
    ),
    after: (
      <Paper p="xl" withBorder style={{ width: '100%', height: '100%' }}>
        <Title order={4}>Version 2.0</Title>
        <Text mt="sm" c="dimmed">
          Enhanced features and improvements
        </Text>
      </Paper>
    ),
    withBorder: true,
    shadow: 'md',
    radius: 'md',
    minHeight: '250px',
  },
};

export const VerticalOrientation: Story = {
  args: {
    before: (
      <Box p="xl" bg="violet.1" style={{ width: '100%', height: '100%' }}>
        <Text size="lg" fw={600}>
          Top Panel
        </Text>
        <Text size="sm" mt="xs">
          This is the top comparison view
        </Text>
      </Box>
    ),
    after: (
      <Box p="xl" bg="orange.1" style={{ width: '100%', height: '100%' }}>
        <Text size="lg" fw={600}>
          Bottom Panel
        </Text>
        <Text size="sm" mt="xs">
          This is the bottom comparison view
        </Text>
      </Box>
    ),
    orientation: 'vertical',
    minHeight: '400px',
    showLabels: true,
  },
};

export const WithAspectRatio: Story = {
  args: {
    before: (
      <Box bg="pink.2" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text size="xl" fw={700}>16:9 Aspect Ratio</Text>
      </Box>
    ),
    after: (
      <Box bg="cyan.2" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text size="xl" fw={700}>16:9 Aspect Ratio</Text>
      </Box>
    ),
    aspectRatio: '16/9',
    showLabels: true,
    beforeLabel: 'Light Theme',
    afterLabel: 'Dark Theme',
  },
};

export const CustomPadding: Story = {
  args: {
    before: (
      <Box bg="grape.1" style={{ width: '100%', height: '100%' }}>
        <Text>No extra padding from panel</Text>
      </Box>
    ),
    after: (
      <Box bg="indigo.1" style={{ width: '100%', height: '100%' }}>
        <Text>No extra padding from panel</Text>
      </Box>
    ),
    padding: 0,
    minHeight: '200px',
    withBorder: true,
  },
};

export const InteractiveContent: Story = {
  args: {
    before: (
      <Box p="xl" style={{ width: '100%', height: '100%' }}>
        <Title order={3} mb="md">Interactive Elements</Title>
        <button type="button" onClick={() => { console.log('Before clicked'); /* eslint-disable-line no-console */ }}>Click Me (Before)</button>
      </Box>
    ),
    after: (
      <Box p="xl" style={{ width: '100%', height: '100%' }}>
        <Title order={3} mb="md">Interactive Elements</Title>
        <button type="button" onClick={() => { console.log('After clicked'); /* eslint-disable-line no-console */ }}>Click Me (After)</button>
      </Box>
    ),
    minHeight: '300px',
    showLabels: true,
  },
};

export const DifferentRadius: Story = {
  args: {
    before: (
      <Box p="xl" bg="yellow.1" style={{ width: '100%', height: '100%' }}>
        <Text fw={600}>Sharp Corners</Text>
      </Box>
    ),
    after: (
      <Box p="xl" bg="lime.1" style={{ width: '100%', height: '100%' }}>
        <Text fw={600}>Sharp Corners</Text>
      </Box>
    ),
    radius: 0,
    withBorder: true,
    minHeight: '200px',
  },
};

export const LargeRadius: Story = {
  args: {
    before: (
      <Box p="xl" bg="blue.0" style={{ width: '100%', height: '100%' }}>
        <Text fw={600}>Very Round Corners</Text>
      </Box>
    ),
    after: (
      <Box p="xl" bg="green.0" style={{ width: '100%', height: '100%' }}>
        <Text fw={600}>Very Round Corners</Text>
      </Box>
    ),
    radius: 'xl',
    withBorder: true,
    shadow: 'lg',
    minHeight: '200px',
  },
};
