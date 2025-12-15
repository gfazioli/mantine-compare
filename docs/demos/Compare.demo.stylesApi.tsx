import { Compare } from '@gfazioli/mantine-compare';
import { Box, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import { CompareStylesApi } from '../styles-api/Compare.styles-api';

const code = `
import { Compare } from "@gfazioli/mantine-compare";
import { data } from './data';

function Demo() {
  return (
    <Compare{{props}}
      title="demo.json"
      showIndentGuides
      showItemsCount
      withCopyToClipboard
      withExpandAll
      defaultExpanded
      maxDepth={1}
      data={data}
    />
  );
}
`;

function Demo(props: any) {
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
      {...props}
    />
  );
}

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: CompareStylesApi,
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
};
