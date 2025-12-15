import React, { useCallback, useRef, useState } from 'react';
import { IconArrowsLeftRight } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  createVarsResolver,
  Factory,
  factory,
  StylesApiProps,
  useProps,
  useStyles,
  type BoxProps,
} from '@mantine/core';
import classes from './Compare.module.css';

/** Available compare variants */
export type CompareVariant = 'fixed' | 'drag' | 'hover';

export type CompareStylesNames =
  | 'root'
  | 'leftSection'
  | 'rightSection'
  | 'slider'
  | 'sliderLine'
  | 'sliderButton';

export type CompareCssVariables = {
  root: '--compare-aspect-ratio';
};

export interface CompareProps extends BoxProps, StylesApiProps<CompareFactory> {
  /** Compare component variant @default 'drag' */
  variant?: CompareVariant;

  /** Content to display on the left side */
  leftSection: React.ReactNode;

  /** Content to display on the right side */
  rightSection: React.ReactNode;

  /** Aspect ratio of the container @default '16/9' */
  aspectRatio?: string;

  /** Direction of the slider movement and clipping @default 'vertical' */
  direction?: 'vertical' | 'horizontal';

  /** Initial position of the slider (0-100) @default 50 */
  defaultPosition?: number;

  /** Callback when the slider position changes */
  onPositionChange?: (position: number) => void;

  /** Icon for the slider button */
  sliderIcon?: React.ReactNode;
}

export type CompareFactory = Factory<{
  props: CompareProps;
  ref: HTMLDivElement;
  stylesNames: CompareStylesNames;
  variant: CompareVariant;
  vars: CompareCssVariables;
}>;

const defaultProps: Partial<CompareProps> = {
  variant: 'drag',
  aspectRatio: '16/9',
  defaultPosition: 50,
  direction: 'vertical',
};

const varsResolver = createVarsResolver<CompareFactory>((_, { aspectRatio }) => ({
  root: {
    '--compare-aspect-ratio': aspectRatio || '16/9',
  },
}));

export const Compare = factory<CompareFactory>((_props, ref) => {
  const props = useProps('Compare', defaultProps, _props);

  const {
    variant,
    leftSection,
    rightSection,
    aspectRatio,
    direction,
    defaultPosition,
    onPositionChange,
    sliderIcon,
    classNames,
    style,
    styles,
    unstyled,
    vars,
    className,
    ...others
  } = props;

  const resolvedSliderIcon = sliderIcon ?? (
    <IconArrowsLeftRight size={16} data-compare-default-icon />
  );

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

  const [position, setPosition] = useState(defaultPosition || 50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();

      const newPosition =
        direction === 'horizontal'
          ? Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
          : Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));

      setPosition(newPosition);
      onPositionChange?.(newPosition);
    },
    [direction, onPositionChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    },
    [updatePosition]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [updatePosition]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener(
      'touchmove',
      handleTouchMove as EventListener,
      { passive: false } as AddEventListenerOptions
    );
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleMouseDown = useCallback(() => {
    if (variant === 'fixed') return;
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [variant, handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback(() => {
    if (variant === 'fixed') return;
    isDragging.current = true;
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [variant, handleTouchMove, handleTouchEnd]);

  const handleContainerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (variant !== 'hover') return;
      updatePosition(e.clientX, e.clientY);
    },
    [variant, updatePosition]
  );

  return (
    <Box
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      data-direction={direction}
      data-variant={variant}
      onMouseMove={handleContainerMouseMove}
      {...getStyles('root')}
      {...others}
    >
      <Box
        {...getStyles('leftSection', {
          style: {
            clipPath:
              direction === 'horizontal'
                ? `inset(0 0 ${100 - position}% 0)`
                : `inset(0 ${100 - position}% 0 0)`,
          },
        })}
      >
        {leftSection}
      </Box>

      <Box
        {...getStyles('rightSection', {
          style: {
            clipPath:
              direction === 'horizontal'
                ? `inset(${position}% 0 0 0)`
                : `inset(0 0 0 ${position}%)`,
          },
        })}
      >
        {rightSection}
      </Box>

      <Box
        {...getStyles('slider', {
          style: {
            ...(direction === 'horizontal' ? { top: `${position}%` } : { left: `${position}%` }),
          },
        })}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <Box {...getStyles('sliderLine')} />
        {variant === 'drag' && (
          <Box {...getStyles('sliderButton')}>
            <ActionIcon variant="filled" color="dark.9" radius="xl" size="lg">
              {resolvedSliderIcon}
            </ActionIcon>
          </Box>
        )}
      </Box>
    </Box>
  );
});

Compare.classes = classes;
Compare.displayName = 'Compare';
