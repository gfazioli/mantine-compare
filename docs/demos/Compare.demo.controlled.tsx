import { useState } from 'react';
import { Compare } from '@gfazioli/mantine-compare';
import { Box, Button, Group, Slider, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { useState } from 'react';
import { Compare } from '@gfazioli/mantine-compare';
import { Box, Button, Group, Slider, Text } from '@mantine/core';

function Demo() {
  const [position, setPosition] = useState(50);

  return (
    <>
      <Group mb="sm">
        <Button size="xs" onClick={() => setPosition(25)}>25%</Button>
        <Button size="xs" onClick={() => setPosition(50)}>50%</Button>
        <Button size="xs" onClick={() => setPosition(75)}>75%</Button>
      </Group>
      <Slider value={position} onChange={setPosition} min={0} max={100} mb="sm" />
      <Compare
        position={position}
        onPositionChange={setPosition}
        leftLabel="Before"
        rightLabel="After"
        leftSection={
          <Box style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', width: '100%', height: '100%' }} />
        }
        rightSection={
          <Box style={{ background: 'linear-gradient(45deg, #f093fb, #f5576c)', width: '100%', height: '100%' }} />
        }
      />
      <Text size="xs" c="dimmed" mt="xs" ta="center">Position: {Math.round(position)}%</Text>
    </>
  );
}
`;

function Demo() {
  const [position, setPosition] = useState(50);

  return (
    <>
      <Group mb="sm">
        <Button size="xs" onClick={() => setPosition(25)}>
          25%
        </Button>
        <Button size="xs" onClick={() => setPosition(50)}>
          50%
        </Button>
        <Button size="xs" onClick={() => setPosition(75)}>
          75%
        </Button>
      </Group>
      <Slider value={position} onChange={setPosition} min={0} max={100} mb="sm" />
      <Compare
        position={position}
        onPositionChange={setPosition}
        leftLabel="Before"
        rightLabel="After"
        leftSection={
          <Box
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              width: '100%',
              height: '100%',
            }}
          />
        }
        rightSection={
          <Box
            style={{
              background: 'linear-gradient(45deg, #f093fb, #f5576c)',
              width: '100%',
              height: '100%',
            }}
          />
        }
      />
      <Text size="xs" c="dimmed" mt="xs" ta="center">
        Position: {Math.round(position)}%
      </Text>
    </>
  );
}

export const controlled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 540,
  defaultExpanded: false,
};
