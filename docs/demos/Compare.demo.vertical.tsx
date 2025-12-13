import { Compare } from '@gfazioli/mantine-compare';
import { Box, Stack, Text } from '@mantine/core';

function Demo() {
  return (
    <Compare
      before={
        <Stack p="xl" justify="center" h="100%">
          <Text size="lg" fw={600}>
            Version 1.0
          </Text>
          <Text size="sm" c="dimmed">
            Basic features
          </Text>
          <Text size="xs">• Simple layout</Text>
          <Text size="xs">• Core functionality</Text>
        </Stack>
      }
      after={
        <Stack p="xl" justify="center" h="100%">
          <Text size="lg" fw={600}>
            Version 2.0
          </Text>
          <Text size="sm" c="dimmed">
            Enhanced features
          </Text>
          <Text size="xs">• Advanced layout</Text>
          <Text size="xs">• Extended functionality</Text>
          <Text size="xs">• Better performance</Text>
        </Stack>
      }
      orientation="vertical"
      minHeight="400px"
      showLabels
      withBorder
    />
  );
}

export default Demo;
