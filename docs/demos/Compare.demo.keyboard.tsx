import { Compare } from '@gfazioli/mantine-compare';
import { Box, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Compare } from '@gfazioli/mantine-compare';
import { Box, Text } from '@mantine/core';

function Demo() {
  return (
    <Compare
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

function Demo() {
  return (
    <Compare
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

export const keyboard: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 540,
  defaultExpanded: false,
};
