import { Compare } from '@gfazioli/mantine-compare';
import { Box } from '@mantine/core';

function Demo() {
  return (
    <Compare
      before={
        <Box
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          Light Theme
        </Box>
      }
      after={
        <Box
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          Dark Theme
        </Box>
      }
      aspectRatio="16/9"
      showLabels
      beforeLabel="Light"
      afterLabel="Dark"
      radius="lg"
      shadow="xl"
    />
  );
}

export default Demo;
