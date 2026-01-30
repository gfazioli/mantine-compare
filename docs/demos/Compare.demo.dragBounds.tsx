import { Compare } from '@gfazioli/mantine-compare';
import { Box, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Compare } from '@gfazioli/mantine-compare';
import { Box, Text } from '@mantine/core';

function Demo() {
  return (
    <Compare
      angle={30}
      minDragBound={20}
      maxDragBound={80}
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
            Left Section
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
            Right Section
          </Text>
        </Box>
      }
    />
  );
}`;

function Demo() {
  return (
    <Compare
      angle={30}
      minDragBound={20}
      maxDragBound={80}
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
            Left Section
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
            Right Section
          </Text>
        </Box>
      }
    />
  );
}

export const dragBounds: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  defaultExpanded: false,
};
