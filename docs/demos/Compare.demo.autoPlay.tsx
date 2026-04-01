import { Compare } from '@gfazioli/mantine-compare';
import { Image } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `import { Compare } from '@gfazioli/mantine-compare';
import { Image } from '@mantine/core';

function Demo() {
  return (
    <Compare
      autoPlay
      autoPlaySpeed={60}
      leftLabel="Original"
      rightLabel="Enhanced"
      leftSection={
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
          alt="Original"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      }
      rightSection={
        <Image
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop"
          alt="Enhanced"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      }
    />
  );
}
`;

function Demo() {
  return (
    <Compare
      autoPlay
      autoPlaySpeed={60}
      leftLabel="Original"
      rightLabel="Enhanced"
      leftSection={
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
          alt="Original"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      }
      rightSection={
        <Image
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop"
          alt="Enhanced"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      }
    />
  );
}

export const autoPlay: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 540,
  defaultExpanded: false,
};
