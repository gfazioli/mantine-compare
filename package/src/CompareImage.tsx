import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import classes from './CompareImage.module.css';

export type CompareImageStylesNames =
  | 'root'
  | 'leftSection'
  | 'rightSection'
  | 'slider'
  | 'sliderLine'
  | 'sliderButton';

export type CompareImageCssVariables = {
  root: '--compare-image-aspect-ratio';
  slider: '--compare-image-slider-position';
};

export interface CompareImageProps extends BoxProps, StylesApiProps<CompareImageFactory> {
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

export type CompareImageFactory = Factory<{
  props: CompareImageProps;
  ref: HTMLDivElement;
  stylesNames: CompareImageStylesNames;
  vars: CompareImageCssVariables;
}>;

const defaultProps: Partial<CompareImageProps> = {
  aspectRatio: '16/9',
  defaultPosition: 50,
  sliderIcon: <IconArrowsLeftRight size={16} />,
};

const varsResolver = createVarsResolver<CompareImageFactory>((_, { aspectRatio }) => ({
  root: {
    '--compare-image-aspect-ratio': aspectRatio || '16/9',
  },
  slider: {
    '--compare-image-slider-position': undefined,
  },
}));

export const CompareImage = factory<CompareImageFactory>((_props, ref) => {
  const props = useProps('CompareImage', defaultProps, _props);

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

  const getStyles = useStyles<CompareImageFactory>({
    name: 'CompareImage',
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
      if (!isDragging.current || !containerRef.current) {
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

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseUp, updatePosition]);

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
        {...getStyles('leftSection')}
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        {leftSection}
      </Box>

      <Box
        {...getStyles('rightSection')}
        style={{
          clipPath: `inset(0 0 0 ${position}%)`,
        }}
      >
        {rightSection}
      </Box>

      <Box
        {...getStyles('slider')}
        style={{
          left: `${position}%`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <Box {...getStyles('sliderLine')} />
        <Box {...getStyles('sliderButton')}>
          <ActionIcon variant="filled" color="gray" radius="xl" size="lg">
            {sliderIcon}
          </ActionIcon>
        </Box>
      </Box>
    </Box>
  );
});

CompareImage.classes = classes;
CompareImage.displayName = 'CompareImage';
