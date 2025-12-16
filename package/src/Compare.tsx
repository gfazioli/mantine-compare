import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import { useElementSize } from '@mantine/hooks';
import {
  clampNumber,
  clipPolygonHalfPlane,
  getLineSegmentInRect,
  getNormalFromAngle,
  normalizeAngle,
  projectCornersRange,
  projectPoint,
  toClipPathPolygon,
  type Point,
} from './lib/compare-geometry';
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

  /**
   * Angle of the divider in degrees (0-360).
   *
   * `angle={0}` behaves like the previous vertical direction (left/right compare).
   * `angle={90}` behaves like the previous horizontal direction (top/bottom compare).
   *
   * @default 0
   */
  angle?: number;

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
  angle: 0,
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
    angle,
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

  const normalizedAngle = normalizeAngle(angle);

  const resolvedSliderIcon = sliderIcon ?? (
    <IconArrowsLeftRight
      size={16}
      data-compare-default-icon
      style={{ transform: `rotate(${normalizedAngle}deg)`, transformOrigin: 'center' }}
    />
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

  const {
    ref: sizeRef,
    width: containerWidth,
    height: containerHeight,
  } = useElementSize<HTMLDivElement>();

  const geometry = useMemo(() => {
    const width = containerWidth;
    const height = containerHeight;
    const pos = clampNumber(position, 0, 100);

    const normal = getNormalFromAngle(normalizedAngle);

    if (width <= 0 || height <= 0) {
      return {
        leftClipPath: undefined as string | undefined,
        rightClipPath: undefined as string | undefined,
        sliderStyle: {
          left: '50%',
          top: '50%',
          width: '100%',
          height: '48px',
          transform: `translate(-50%, -50%) rotate(${normalizedAngle + 90}deg)`,
        } as React.CSSProperties,
      };
    }

    const { corners, min, max } = projectCornersRange(width, height, normal);
    const p = min + (pos / 100) * (max - min);

    const leftPoly = clipPolygonHalfPlane(corners, normal, p, true);
    const rightPoly = clipPolygonHalfPlane(corners, normal, p, false);

    const leftClipPath = toClipPathPolygon(leftPoly, width, height);
    const rightClipPath = toClipPathPolygon(rightPoly, width, height);

    const segment = getLineSegmentInRect(width, height, normal, p);
    if (!segment) {
      return {
        leftClipPath,
        rightClipPath,
        sliderStyle: {
          left: '50%',
          top: '50%',
          width: '100%',
          height: '48px',
          transform: `translate(-50%, -50%) rotate(${normalizedAngle + 90}deg)`,
        } as React.CSSProperties,
      };
    }

    const [a, b] = segment;
    const mid: Point = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const lineAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return {
      leftClipPath,
      rightClipPath,
      sliderStyle: {
        left: `${mid.x}px`,
        top: `${mid.y}px`,
        width: `${length}px`,
        height: '48px',
        transform: `translate(-50%, -50%) rotate(${lineAngle}deg)`,
      } as React.CSSProperties,
    };
  }, [containerWidth, containerHeight, normalizedAngle, position]);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const normal = getNormalFromAngle(normalizedAngle);
      const { min, max } = projectCornersRange(rect.width, rect.height, normal);
      const denom = max - min;

      if (Math.abs(denom) < 1e-9) {
        return;
      }

      const value = projectPoint(normal, { x, y });
      const newPosition = clampNumber(((value - min) / denom) * 100, 0, 100);

      setPosition(newPosition);
      onPositionChange?.(newPosition);
    },
    [normalizedAngle, onPositionChange]
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
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    document.removeEventListener(
      'touchmove',
      handleTouchMove as EventListener,
      { passive: false } as AddEventListenerOptions
    );
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleMouseDown = useCallback(() => {
    if (variant === 'fixed') {
      return;
    }
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [variant, handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback(() => {
    if (variant === 'fixed') {
      return;
    }
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [variant, handleTouchMove, handleTouchEnd]);

  const handleContainerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (variant !== 'hover') {
        return;
      }
      updatePosition(e.clientX, e.clientY);
    },
    [variant, updatePosition]
  );

  return (
    <Box
      ref={(node) => {
        containerRef.current = node;
        sizeRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      data-angle={normalizedAngle}
      data-variant={variant}
      onMouseMove={handleContainerMouseMove}
      {...getStyles('root')}
      {...others}
    >
      <Box
        {...getStyles('leftSection', {
          style: {
            clipPath: geometry.leftClipPath,
          },
        })}
      >
        {leftSection}
      </Box>

      <Box
        {...getStyles('rightSection', {
          style: {
            clipPath: geometry.rightClipPath,
          },
        })}
      >
        {rightSection}
      </Box>

      <Box
        {...getStyles('slider', {
          style: geometry.sliderStyle,
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
