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
  /** Content to display on the left side */
  leftSection: React.ReactNode;

  /** Content to display on the right side */
  rightSection: React.ReactNode;

  /** Aspect ratio of the container @default '16/9' */
  aspectRatio?: string;

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
  vars: CompareCssVariables;
}>;

const defaultProps: Partial<CompareProps> = {
  aspectRatio: '16/9',
  defaultPosition: 50,
  sliderIcon: <IconArrowsLeftRight size={16} />,
};

const varsResolver = createVarsResolver<CompareFactory>((_, { aspectRatio }) => ({
  root: {
    '--compare-aspect-ratio': aspectRatio || '16/9',
  },
}));

export const Compare = factory<CompareFactory>((_props, ref) => {
  const props = useProps('Compare', defaultProps, _props);

  const {
    leftSection,
    rightSection,
    aspectRatio,
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
    (clientX: number) => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const containerWidth = rect.width;

      const newPosition = Math.max(0, Math.min(100, (x / containerWidth) * 100));
      setPosition(newPosition);
      onPositionChange?.(newPosition);
    },
    [onPositionChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX);
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
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback(() => {
    isDragging.current = true;
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove, handleTouchEnd]);

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
      {...getStyles('root')}
      {...others}
    >
      <Box
        {...getStyles('leftSection', {
          style: {
            clipPath: `inset(0 ${100 - position}% 0 0)`,
          },
        })}
      >
        {leftSection}
      </Box>

      <Box
        {...getStyles('rightSection', {
          style: {
            clipPath: `inset(0 0 0 ${position}%)`,
          },
        })}
      >
        {rightSection}
      </Box>

      <Box
        {...getStyles('slider', {
          style: {
            left: `${position}%`,
          },
        })}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <Box {...getStyles('sliderLine')} />
        <Box {...getStyles('sliderButton')}>
          <ActionIcon variant="filled" color="dark.9" radius="xl" size="lg">
            {sliderIcon}
          </ActionIcon>
        </Box>
      </Box>
    </Box>
  );
});

Compare.classes = classes;
Compare.displayName = 'Compare';
