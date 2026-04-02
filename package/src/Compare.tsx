import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { IconArrowsLeftRight } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  createVarsResolver,
  Factory,
  factory,
  getRadius,
  getThemeColor,
  StylesApiProps,
  Text,
  useProps,
  useStyles,
  type BoxProps,
  type MantineColor,
  type MantineRadius,
} from '@mantine/core';
import { useElementSize, useMergedRef, useUncontrolled } from '@mantine/hooks';
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
  | 'sliderButton'
  | 'leftLabel'
  | 'rightLabel';

export type CompareCssVariables = {
  root:
    | '--compare-aspect-ratio'
    | '--compare-radius'
    | '--compare-slider-color'
    | '--compare-slider-width';
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

  /** Border radius @default 'md' */
  radius?: MantineRadius | (string & {}) | number;

  /**
   * Angle of the divider in degrees (0-360).
   * `angle={0}` = vertical divider (left/right compare).
   * `angle={90}` = horizontal divider (top/bottom compare).
   * @default 0
   */
  angle?: number;

  /** Controlled slider position (0-100) */
  position?: number;

  /** Initial position of the slider (0-100), used in uncontrolled mode @default 50 */
  defaultPosition?: number;

  /** Callback when the slider position changes */
  onPositionChange?: (position: number) => void;

  /** Icon for the slider button */
  sliderIcon?: React.ReactNode;

  /** Minimum drag boundary in percentage (0-100) @default 0 */
  minDragBound?: number;

  /** Maximum drag boundary in percentage (0-100) @default 100 */
  maxDragBound?: number;

  /** Label displayed on the left section */
  leftLabel?: React.ReactNode;

  /** Label displayed on the right section */
  rightLabel?: React.ReactNode;

  /** Disables all interactions @default false */
  disabled?: boolean;

  /** Keyboard step size in percentage (1-50) @default 1 */
  keyboardStep?: number;

  /** Keyboard step size with Shift key @default 10 */
  keyboardShiftStep?: number;

  /** Slider divider color */
  sliderColor?: MantineColor;

  /** Slider divider width in px @default 2 */
  sliderWidth?: number;

  /** Auto-play: continuously slides back and forth @default false */
  autoPlay?: boolean;

  /** Auto-play speed (1-100), higher = faster @default 50 */
  autoPlaySpeed?: number;

  /** Auto-play easing function @default 'linear' */
  autoPlayEasing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';

  /** Only allow drag from the handle button, not the entire slider line @default false */
  handleOnly?: boolean;
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
  radius: 'md',
  minDragBound: 0,
  maxDragBound: 100,
  keyboardStep: 1,
  keyboardShiftStep: 10,
  sliderWidth: 2,
  autoPlaySpeed: 50,
};

const varsResolver = createVarsResolver<CompareFactory>(
  (theme, { aspectRatio, radius, sliderColor, sliderWidth }) => ({
    root: {
      '--compare-aspect-ratio': aspectRatio || '16/9',
      '--compare-radius': radius === undefined ? undefined : getRadius(radius),
      '--compare-slider-color': sliderColor ? getThemeColor(sliderColor, theme) : undefined,
      '--compare-slider-width': sliderWidth !== undefined ? `${sliderWidth}px` : undefined,
    },
  })
);

export const Compare = factory<CompareFactory>((_props) => {
  const { ref, ...restProps } = _props as typeof _props & { ref?: React.Ref<HTMLDivElement> };
  const props = useProps('Compare', defaultProps, restProps);

  const {
    variant,
    leftSection,
    rightSection,
    aspectRatio,
    angle,
    radius,
    position: positionProp,
    defaultPosition,
    onPositionChange,
    sliderIcon,
    minDragBound,
    maxDragBound,
    leftLabel,
    rightLabel,
    disabled,
    keyboardStep,
    keyboardShiftStep,
    sliderColor,
    sliderWidth,
    autoPlay,
    autoPlaySpeed,
    autoPlayEasing,
    handleOnly,
    classNames,
    style,
    styles,
    unstyled,
    vars,
    className,
    ...others
  } = props;

  const normalizedAngle = normalizeAngle(angle);

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

  const [position, setPosition] = useUncontrolled({
    value: positionProp,
    defaultValue: defaultPosition ?? 50,
    finalValue: 50,
    onChange: onPositionChange,
  });

  // Sync position when defaultPosition changes in uncontrolled mode
  const prevDefaultPosition = useRef(defaultPosition);
  useEffect(() => {
    if (positionProp === undefined && defaultPosition !== prevDefaultPosition.current) {
      prevDefaultPosition.current = defaultPosition;
      setPosition(defaultPosition ?? 50);
    }
  }, [defaultPosition, positionProp, setPosition]);

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ref: sizeRef,
    width: containerWidth,
    height: containerHeight,
  } = useElementSize<HTMLDivElement>();

  const mergedRef = useMergedRef(ref as React.Ref<HTMLDivElement>, containerRef, sizeRef);

  // Auto-play
  const autoPlayDirection = useRef(1);
  const autoPlayRaf = useRef<number>(0);
  const autoPlayPosition = useRef(position);
  const isHoveredRef = useRef(false);

  // Keep auto-play position in sync with external changes
  useEffect(() => {
    autoPlayPosition.current = position;
  }, [position]);

  useEffect(() => {
    if (!autoPlay || disabled) {
      return undefined;
    }

    // Clamp to 1-99 to avoid degenerate clip-path at edges (especially with diagonal angles)
    const minBound = Math.max(minDragBound ?? 0, 1);
    const maxBound = Math.min(maxDragBound ?? 100, 99);
    // Convert speed (1-100) to ms per 1%: speed 100 → 5ms, speed 1 → 100ms
    const clampedSpeed = clampNumber(autoPlaySpeed ?? 50, 1, 100);
    const baseMsPerPercent = 105 - clampedSpeed;
    const easing = autoPlayEasing ?? 'linear';
    let lastTime = performance.now();

    // Easing multiplier based on normalized position in range (0-1).
    // Base 0.3 = minimum 30% speed to prevent stalling at edges.
    // Range 1.7 = reaches 2.0x at peak (0.3 + 1.7). Spring uses 0.2/1.8 for wider range.
    const getEasingMultiplier = (t: number): number => {
      switch (easing) {
        case 'ease-in':
          return 0.3 + 1.7 * t * t;
        case 'ease-out':
          return 0.3 + 1.7 * (1 - (1 - t) * (1 - t));
        case 'ease-in-out':
          return 0.3 + 1.7 * (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));
        case 'spring': {
          const center = Math.abs(t - 0.5) * 2;
          return 0.2 + 1.8 * (1 - center * center);
        }
        default:
          return 1;
      }
    };

    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      // Pause animation on hover — skip position update but keep RAF running
      if (isHoveredRef.current) {
        autoPlayRaf.current = requestAnimationFrame(animate);
        return;
      }

      const range = maxBound - minBound;
      const normalizedT = range > 0 ? (autoPlayPosition.current - minBound) / range : 0.5;
      const easingMultiplier = getEasingMultiplier(normalizedT);
      const step = (delta / baseMsPerPercent) * easingMultiplier;
      let next = autoPlayPosition.current + step * autoPlayDirection.current;

      if (next >= maxBound) {
        next = maxBound;
        autoPlayDirection.current = -1;
      } else if (next <= minBound) {
        next = minBound;
        autoPlayDirection.current = 1;
      }

      autoPlayPosition.current = next;
      setPosition(next);

      autoPlayRaf.current = requestAnimationFrame(animate);
    };

    autoPlayRaf.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(autoPlayRaf.current);
    };
  }, [autoPlay, disabled, minDragBound, maxDragBound, autoPlaySpeed, autoPlayEasing, setPosition]);

  const geometry = useMemo(() => {
    const width = containerWidth;
    const height = containerHeight;
    const pos = clampNumber(position, 0, 100);

    const normal = getNormalFromAngle(normalizedAngle);

    if (width <= 0 || height <= 0) {
      const lineAngle = normalizedAngle + 90;
      return {
        leftClipPath: undefined as string | undefined,
        rightClipPath: undefined as string | undefined,
        lineAngle,
        sliderStyle: {
          left: '50%',
          top: '50%',
          width: '100%',
          height: '48px',
          transform: `translate(-50%, -50%) rotate(${lineAngle}deg)`,
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
      const lineAngle = normalizedAngle + 90;
      return {
        leftClipPath,
        rightClipPath,
        lineAngle,
        sliderStyle: {
          left: '50%',
          top: '50%',
          width: '100%',
          height: '48px',
          transform: `translate(-50%, -50%) rotate(${lineAngle}deg)`,
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
      lineAngle,
      sliderStyle: {
        left: `${mid.x}px`,
        top: `${mid.y}px`,
        width: `${length}px`,
        height: '48px',
        transform: `translate(-50%, -50%) rotate(${lineAngle}deg)`,
      } as React.CSSProperties,
    };
  }, [containerWidth, containerHeight, normalizedAngle, position]);

  const sliderIconRotation = normalizedAngle - geometry.lineAngle;

  const resolvedSliderIcon = (
    <Box style={{ transform: `rotate(${sliderIconRotation}deg)`, transformOrigin: 'center' }}>
      {sliderIcon ?? <IconArrowsLeftRight size={16} data-compare-default-icon />}
    </Box>
  );

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current || disabled) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();

      const x = clampNumber(clientX - rect.left, 1, rect.width - 1);
      const y = clampNumber(clientY - rect.top, 1, rect.height - 1);

      const normal = getNormalFromAngle(normalizedAngle);
      const { min, max } = projectCornersRange(rect.width, rect.height, normal);
      const denom = max - min;

      if (Math.abs(denom) < 1e-9) {
        return;
      }

      const value = projectPoint(normal, { x, y });
      const rawPosition = ((value - min) / denom) * 100;

      const minBound = clampNumber(minDragBound || 0, 0, 100);
      const maxBound = clampNumber(maxDragBound || 100, 0, 100);
      const effectiveMin = Math.min(minBound, maxBound);
      const effectiveMax = Math.max(minBound, maxBound);

      const newPosition = clampNumber(rawPosition, effectiveMin, effectiveMax);

      setPosition(newPosition);
    },
    [normalizedAngle, disabled, minDragBound, maxDragBound, setPosition]
  );

  // Use stable refs for document listeners to avoid stale closure issues
  const updatePositionRef = useRef(updatePosition);
  updatePositionRef.current = updatePosition;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    updatePositionRef.current(e.clientX, e.clientY);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      updatePositionRef.current(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    document.removeEventListener(
      'touchmove',
      handleTouchMove as EventListener,
      {
        passive: false,
      } as AddEventListenerOptions
    );
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleMouseDown = useCallback(() => {
    if (variant === 'fixed' || disabled) {
      return;
    }
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [variant, disabled, handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback(() => {
    if (variant === 'fixed' || disabled) {
      return;
    }
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [variant, disabled, handleTouchMove, handleTouchEnd]);

  // Cleanup document listeners on unmount only
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove as EventListener);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleContainerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (variant !== 'hover' || disabled) {
        return;
      }
      updatePosition(e.clientX, e.clientY);
    },
    [variant, disabled, updatePosition]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (variant === 'fixed' || disabled) {
        return;
      }

      const step = e.shiftKey ? (keyboardShiftStep ?? 10) : (keyboardStep ?? 1);
      let newPosition: number | null = null;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        newPosition = Math.max(minDragBound ?? 0, position - step);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        newPosition = Math.min(maxDragBound ?? 100, position + step);
      } else if (e.key === 'Home') {
        e.preventDefault();
        newPosition = minDragBound ?? 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newPosition = maxDragBound ?? 100;
      }

      if (newPosition !== null) {
        setPosition(newPosition);
      }
    },
    [
      variant,
      disabled,
      position,
      minDragBound,
      maxDragBound,
      keyboardStep,
      keyboardShiftStep,
      setPosition,
    ]
  );

  return (
    <Box
      ref={mergedRef}
      data-angle={normalizedAngle}
      data-variant={variant}
      data-disabled={disabled || undefined}
      data-autoplay={autoPlay || undefined}
      onMouseMove={handleContainerMouseMove}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
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

      {leftLabel && (
        <Text {...getStyles('leftLabel')} component="span">
          {leftLabel}
        </Text>
      )}

      {rightLabel && (
        <Text {...getStyles('rightLabel')} component="span">
          {rightLabel}
        </Text>
      )}

      <Box
        {...getStyles('slider', {
          style: geometry.sliderStyle,
        })}
        role="slider"
        tabIndex={variant !== 'fixed' && !disabled ? 0 : undefined}
        aria-valuenow={Math.round(position)}
        aria-valuemin={minDragBound ?? 0}
        aria-valuemax={maxDragBound ?? 100}
        aria-label="Compare slider"
        aria-disabled={disabled || undefined}
        onMouseDown={handleOnly ? undefined : handleMouseDown}
        onTouchStart={handleOnly ? undefined : handleTouchStart}
        onKeyDown={handleKeyDown}
      >
        <Box {...getStyles('sliderLine')} />
        {variant === 'drag' && (
          <Box
            {...getStyles('sliderButton')}
            onMouseDown={handleOnly ? handleMouseDown : undefined}
            onTouchStart={handleOnly ? handleTouchStart : undefined}
          >
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
