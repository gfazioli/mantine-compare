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

type Point = { x: number; y: number };

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(angle: number | undefined) {
  const raw = typeof angle === 'number' && Number.isFinite(angle) ? angle : 0;
  return ((raw % 360) + 360) % 360;
}

function dot(n: Point, p: Point) {
  return n.x * p.x + n.y * p.y;
}

function getRectCorners(width: number, height: number): Point[] {
  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];
}

function intersectSegmentWithLine(s: Point, e: Point, n: Point, p: number): Point | null {
  const ds = dot(n, s);
  const de = dot(n, e);
  const denom = de - ds;

  if (Math.abs(denom) < 1e-9) {
    return null;
  }

  const t = (p - ds) / denom;
  if (t < 0 || t > 1) {
    return null;
  }

  return { x: s.x + (e.x - s.x) * t, y: s.y + (e.y - s.y) * t };
}

function clipPolygonHalfPlane(points: Point[], n: Point, p: number, keepLessEqual: boolean) {
  if (points.length === 0) {
    return [] as Point[];
  }

  const inside = (pt: Point) => {
    const v = dot(n, pt);
    return keepLessEqual ? v <= p + 1e-9 : v >= p - 1e-9;
  };

  const output: Point[] = [];
  for (let i = 0; i < points.length; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const currentInside = inside(current);
    const nextInside = inside(next);

    if (currentInside && nextInside) {
      output.push(next);
    } else if (currentInside && !nextInside) {
      const intersection = intersectSegmentWithLine(current, next, n, p);
      if (intersection) {
        output.push(intersection);
      }
    } else if (!currentInside && nextInside) {
      const intersection = intersectSegmentWithLine(current, next, n, p);
      if (intersection) {
        output.push(intersection);
      }
      output.push(next);
    }
  }

  return output;
}

function toClipPathPolygon(points: Point[], width: number, height: number) {
  if (width <= 0 || height <= 0 || points.length === 0) {
    return 'polygon(0 0, 0 0, 0 0)';
  }

  const formatted = points
    .map((pt) => {
      const x = clampNumber((pt.x / width) * 100, 0, 100);
      const y = clampNumber((pt.y / height) * 100, 0, 100);
      return `${x.toFixed(4)}% ${y.toFixed(4)}%`;
    })
    .join(', ');

  return `polygon(${formatted})`;
}

function getLineSegmentInRect(
  width: number,
  height: number,
  n: Point,
  p: number
): [Point, Point] | null {
  if (width <= 0 || height <= 0) {
    return null;
  }

  const corners = getRectCorners(width, height);
  const edges: Array<[Point, Point]> = [
    [corners[0], corners[1]],
    [corners[1], corners[2]],
    [corners[2], corners[3]],
    [corners[3], corners[0]],
  ];

  const intersections: Point[] = [];
  for (const [s, e] of edges) {
    const ds = dot(n, s) - p;
    const de = dot(n, e) - p;

    if (Math.abs(ds) < 1e-9 && Math.abs(de) < 1e-9) {
      intersections.push(s, e);
      continue;
    }

    if (Math.abs(ds) < 1e-9) {
      intersections.push(s);
      continue;
    }

    if (Math.abs(de) < 1e-9) {
      intersections.push(e);
      continue;
    }

    if ((ds < 0 && de > 0) || (ds > 0 && de < 0)) {
      const intersection = intersectSegmentWithLine(s, e, n, p);
      if (intersection) {
        intersections.push(intersection);
      }
    }
  }

  const unique: Point[] = [];
  for (const pt of intersections) {
    const exists = unique.some((u) => Math.abs(u.x - pt.x) < 0.5 && Math.abs(u.y - pt.y) < 0.5);
    if (!exists) {
      unique.push(pt);
    }
  }

  if (unique.length < 2) {
    return null;
  }

  let bestA = unique[0];
  let bestB = unique[1];
  let bestDist = -1;

  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) {
      const dx = unique[i].x - unique[j].x;
      const dy = unique[i].y - unique[j].y;
      const dist = dx * dx + dy * dy;
      if (dist > bestDist) {
        bestDist = dist;
        bestA = unique[i];
        bestB = unique[j];
      }
    }
  }

  return [bestA, bestB];
}

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
  const isDragging = useRef(false);

  const {
    ref: sizeRef,
    width: containerWidth,
    height: containerHeight,
  } = useElementSize<HTMLDivElement>();

  const geometry = useMemo(() => {
    const width = containerWidth;
    const height = containerHeight;
    const pos = clampNumber(position, 0, 100);

    const rad = (normalizedAngle * Math.PI) / 180;
    const normal: Point = { x: Math.cos(rad), y: Math.sin(rad) };

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

    const corners = getRectCorners(width, height);
    const projections = corners.map((c) => dot(normal, c));
    const min = Math.min(...projections);
    const max = Math.max(...projections);
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

      const rad = (normalizedAngle * Math.PI) / 180;
      const normal: Point = { x: Math.cos(rad), y: Math.sin(rad) };

      const corners = getRectCorners(rect.width, rect.height);
      const projections = corners.map((c) => dot(normal, c));
      const min = Math.min(...projections);
      const max = Math.max(...projections);
      const value = dot(normal, { x, y });
      const newPosition = clampNumber(((value - min) / (max - min)) * 100, 0, 100);

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
    if (variant === 'fixed') {
      return;
    }
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [variant, handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback(() => {
    if (variant === 'fixed') {
      return;
    }
    isDragging.current = true;
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
