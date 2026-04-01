import type { CompareFactory } from '@gfazioli/mantine-compare';
import type { StylesApiData } from '../components/styles-api.types';

export const CompareStylesApi: StylesApiData<CompareFactory> = {
  selectors: {
    root: 'Root element',
    leftSection: 'Left section wrapper',
    rightSection: 'Right section wrapper',
    slider: 'Slider container (line + button)',
    sliderLine: 'Divider line inside the slider',
    sliderButton: 'Clickable drag handle button',
    leftLabel: 'Label overlay on the left section',
    rightLabel: 'Label overlay on the right section',
  },

  vars: {
    root: {
      '--compare-aspect-ratio': 'Aspect ratio for the compare container',
      '--compare-radius': 'Border radius for the compare container',
      '--compare-slider-color': 'Color of the slider divider line',
      '--compare-slider-width': 'Width of the slider divider line in px',
    },
  },
};
