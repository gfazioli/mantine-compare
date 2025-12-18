import type { CompareFactory } from '@gfazioli/mantine-compare';
import type { StylesApiData } from '../components/styles-api.types';

export const CompareStylesApi: StylesApiData<CompareFactory> = {
  selectors: {
    root: 'Root element',
    leftSection: 'Left section wrapper',
    rightSection: 'Right section wrapper',
    slider: 'Slider button',
    sliderLine: 'Line inside the slider button',
    sliderButton: 'Clickable area of the slider button',
  },

  vars: {
    root: {
      '--compare-aspect-ratio': 'Font family for the JSON tree',
      '--compare-radius': 'Border radius for the compare container',
    },
  },

  //modifiers: [{ selector: 'root' }],
};
