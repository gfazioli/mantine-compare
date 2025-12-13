import { Compare } from '@gfazioli/mantine-compare';
import { Box, Paper, Text, Title } from '@mantine/core';

function Demo() {
  return (
    <Compare
      before={
        <Paper p="xl" bg="blue.1" style={{ width: '100%', height: '100%' }}>
          <Title order={3}>Before</Title>
          <Text mt="md">Original design with basic styling</Text>
        </Paper>
      }
      after={
        <Paper p="xl" bg="green.1" style={{ width: '100%', height: '100%' }}>
          <Title order={3}>After</Title>
          <Text mt="md">Updated design with improved styling</Text>
        </Paper>
      }
      showLabels
      withBorder
      shadow="md"
      radius="md"
      minHeight="300px"
    />
  );
}

export default Demo;
