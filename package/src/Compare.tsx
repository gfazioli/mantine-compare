import React from 'react';
import {
  Box,
  createVarsResolver,
  Factory,
  factory,
  getRadius,
  getSize,
  getSpacing,
  MantineRadius,
  MantineSize,
  MantineShadow,
  MantineSpacing,
  StylesApiProps,
  useProps,
  useStyles,
  type BoxProps,
} from '@mantine/core';
import classes from './Compare.module.css';

export type CompareFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type CompareOrientation = 'horizontal' | 'vertical';

export type CompareStylesNames =
  | 'root'
  | 'container'
  | 'panel'
  | 'beforePanel'
  | 'afterPanel'
  | 'label';

export type CompareCssVariables = {
  root:
    | '--compare-radius'
    | '--compare-shadow'
    | '--compare-padding'
    | '--compare-aspect-ratio'
    | '--compare-min-height';
  container: never;
  panel: '--compare-panel-fit';
  beforePanel: never;
  afterPanel: never;
  label: never;
};

export interface CompareBaseProps {
  /** Content for the "before" or "left" panel */
  before: React.ReactNode;

  /** Content for the "after" or "right" panel */
  after: React.ReactNode;

  /** Optional label for the before panel (for accessibility and visual labeling) */
  beforeLabel?: React.ReactNode;

  /** Optional label for the after panel (for accessibility and visual labeling) */
  afterLabel?: React.ReactNode;

  /** Border radius from theme or number to set border-radius in px @default 'sm' */
  radius?: MantineRadius | (string & {}) | number;

  /** Box shadow from theme or any valid CSS box-shadow value @default 'none' */
  shadow?: MantineShadow | (string & {});

  /** Whether to show border @default false */
  withBorder?: boolean;

  /** Padding from theme or number to set padding in px @default 'md' */
  padding?: MantineSpacing | (string & {}) | number;

  /** Fixed aspect ratio (e.g., '16/9', '1/1', '4/3') @default undefined */
  aspectRatio?: string;

  /** How content should fit within panels @default 'cover' */
  fit?: CompareFit;

  /** Minimum height for the comparison container @default undefined */
  minHeight?: MantineSize | (string & {}) | number;

  /** Orientation: horizontal (side-by-side) or vertical (stacked) @default 'horizontal' */
  orientation?: CompareOrientation;

  /** Breakpoint at which to switch from horizontal to vertical on responsive layouts @default 'sm' */
  stackAt?: MantineSize | (string & {});

  /** ARIA label for the comparison container @default 'Comparison view' */
  ariaLabel?: string;

  /** Whether to show visual labels on panels @default false */
  showLabels?: boolean;
}

export interface CompareProps
  extends BoxProps,
    CompareBaseProps,
    StylesApiProps<CompareFactory> {}

export type CompareFactory = Factory<{
  props: CompareProps;
  ref: HTMLDivElement;
  stylesNames: CompareStylesNames;
  vars: CompareCssVariables;
}>;

export const defaultProps: Partial<CompareProps> = {
  radius: 'sm',
  shadow: 'none',
  withBorder: false,
  padding: 'md',
  fit: 'cover',
  orientation: 'horizontal',
  stackAt: 'sm',
  ariaLabel: 'Comparison view',
  showLabels: false,
};

const varsResolver = createVarsResolver<CompareFactory>(
  (
    _,
    { radius, shadow, padding, aspectRatio, minHeight, fit }
  ) => {
    return {
      root: {
        '--compare-radius': radius ? getRadius(radius) : undefined,
        '--compare-shadow': shadow,
        '--compare-padding': padding ? getSpacing(padding) : undefined,
        '--compare-aspect-ratio': aspectRatio,
        '--compare-min-height': minHeight ? getSize(minHeight) : undefined,
      },
      container: {},
      panel: {
        '--compare-panel-fit': fit,
      },
      beforePanel: {},
      afterPanel: {},
      label: {},
    };
  }
);

export const Compare = factory<CompareFactory>((_props, ref) => {
  const props = useProps('Compare', defaultProps, _props);

  const {
    before,
    after,
    beforeLabel,
    afterLabel,
    radius,
    shadow,
    withBorder,
    padding,
    aspectRatio,
    fit,
    minHeight,
    orientation,
    stackAt,
    ariaLabel,
    showLabels,

    classNames,
    style,
    styles,
    unstyled,
    vars,
    className,

    ...others
  } = props;

  const getStyles = useStyles<CompareFactory>({
    name: 'Compare',
    props,
    classes,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver,
  });

  const beforePanelRef = React.useRef<HTMLDivElement>(null);
  const afterPanelRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow keyboard navigation between panels
    if (e.key === 'Tab') {
      // Let default tab behavior work
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const panels = [beforePanelRef.current, afterPanelRef.current].filter(Boolean);
      const focusedIndex = panels.findIndex(
        (panel) => panel === document.activeElement || panel?.contains(document.activeElement)
      );

      if (focusedIndex !== -1) {
        const nextIndex =
          e.key === 'ArrowLeft'
            ? (focusedIndex - 1 + panels.length) % panels.length
            : (focusedIndex + 1) % panels.length;
        panels[nextIndex]?.focus();
        e.preventDefault();
      }
    }
  };

  const effectiveBeforeLabel = beforeLabel || 'Before';
  const effectiveAfterLabel = afterLabel || 'After';

  const containerContent = (
    <>
      <Box
        ref={beforePanelRef}
        {...getStyles('panel', { className: classes.beforePanel })}
        data-compare-panel="before"
        role="region"
        aria-label={typeof effectiveBeforeLabel === 'string' ? effectiveBeforeLabel : 'Before view'}
        tabIndex={0}
      >
        {showLabels && effectiveBeforeLabel && (
          <Box {...getStyles('label')} data-position="before">
            {effectiveBeforeLabel}
          </Box>
        )}
        {before}
      </Box>

      <Box
        ref={afterPanelRef}
        {...getStyles('panel', { className: classes.afterPanel })}
        data-compare-panel="after"
        role="region"
        aria-label={typeof effectiveAfterLabel === 'string' ? effectiveAfterLabel : 'After view'}
        tabIndex={0}
      >
        {showLabels && effectiveAfterLabel && (
          <Box {...getStyles('label')} data-position="after">
            {effectiveAfterLabel}
          </Box>
        )}
        {after}
      </Box>
    </>
  );

  return (
    <Box
      ref={ref}
      {...getStyles('root')}
      data-with-border={withBorder || undefined}
      role="group"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      {...others}
    >
      <Box
        {...getStyles('container')}
        data-orientation={orientation}
        data-stack-at={stackAt}
      >
        {containerContent}
      </Box>
    </Box>
  );
});

Compare.classes = classes;
Compare.displayName = 'Compare';
