import React from 'react';
import { render } from '@mantine-tests/core';
import { fireEvent } from '@testing-library/react';
import { Compare } from './Compare';

describe('Compare', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Compare leftSection={<div>Left Content</div>} rightSection={<div>Right Content</div>} />
    );
    expect(container).toBeTruthy();
  });

  it('renders left and right sections', () => {
    const { container } = render(
      <Compare
        leftSection={<div data-testid="left">Left Content</div>}
        rightSection={<div data-testid="right">Right Content</div>}
      />
    );
    expect(container.textContent).toContain('Left Content');
    expect(container.textContent).toContain('Right Content');
  });

  it('applies default position', () => {
    const { container } = render(
      <Compare leftSection={<div>Left</div>} rightSection={<div>Right</div>} defaultPosition={50} />
    );
    const slider = container.querySelector('[class*="slider"]');
    expect(slider).toBeTruthy();
  });

  it('accepts custom aspect ratio', () => {
    const { container } = render(
      <Compare leftSection={<div>Left</div>} rightSection={<div>Right</div>} aspectRatio="4/3" />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with ReactNode content', () => {
    const leftContent = (
      <div>
        <h1>Left Title</h1>
        <p>Left paragraph</p>
      </div>
    );
    const rightContent = (
      <div>
        <h1>Right Title</h1>
        <p>Right paragraph</p>
      </div>
    );

    const { container } = render(<Compare leftSection={leftContent} rightSection={rightContent} />);

    expect(container.textContent).toContain('Left Title');
    expect(container.textContent).toContain('Right Title');
    expect(container.textContent).toContain('Left paragraph');
    expect(container.textContent).toContain('Right paragraph');
  });

  it('supports angle=90 (horizontal behavior)', () => {
    const { container } = render(
      <Compare
        angle={90}
        defaultPosition={25}
        leftSection={<div>Top</div>}
        rightSection={<div>Bottom</div>}
      />
    );

    const root = container.querySelector('[data-angle]') as HTMLElement | null;
    expect(root?.getAttribute('data-angle')).toBe('90');

    const sliderLine = container.querySelector('[class*="sliderLine"]');
    expect(sliderLine).toBeTruthy();
  });

  it('supports fixed variant without button', () => {
    const { container } = render(
      <Compare
        variant="fixed"
        defaultPosition={75}
        leftSection={<div>Left</div>}
        rightSection={<div>Right</div>}
      />
    );

    const root = container.querySelector('[data-variant]') as HTMLElement | null;
    expect(root?.getAttribute('data-variant')).toBe('fixed');

    const button = container.querySelector('[class*="sliderButton"]');
    expect(button).toBeNull();

    const sliderLine = container.querySelector('[class*="sliderLine"]');
    expect(sliderLine).toBeTruthy();
  });

  it('supports drag variant with button (default)', () => {
    const { container } = render(
      <Compare variant="drag" leftSection={<div>Left</div>} rightSection={<div>Right</div>} />
    );

    const root = container.querySelector('[data-variant]') as HTMLElement | null;
    expect(root?.getAttribute('data-variant')).toBe('drag');

    const button = container.querySelector('[class*="sliderButton"]');
    expect(button).toBeTruthy();
  });

  it('supports hover variant without button', () => {
    const { container } = render(
      <Compare variant="hover" leftSection={<div>Left</div>} rightSection={<div>Right</div>} />
    );

    const root = container.querySelector('[data-variant]') as HTMLElement | null;
    expect(root?.getAttribute('data-variant')).toBe('hover');

    const button = container.querySelector('[class*="sliderButton"]');
    expect(button).toBeNull();

    const sliderLine = container.querySelector('[class*="sliderLine"]');
    expect(sliderLine).toBeTruthy();
  });

  it('slider has role="slider" with ARIA attributes', () => {
    const { container } = render(
      <Compare
        leftSection={<div>Left</div>}
        rightSection={<div>Right</div>}
        defaultPosition={30}
        minDragBound={10}
        maxDragBound={90}
      />
    );

    const slider = container.querySelector('[role="slider"]') as HTMLElement | null;
    expect(slider).toBeTruthy();
    expect(slider?.getAttribute('aria-valuenow')).toBe('30');
    expect(slider?.getAttribute('aria-valuemin')).toBe('10');
    expect(slider?.getAttribute('aria-valuemax')).toBe('90');
    expect(slider?.getAttribute('aria-label')).toBe('Compare slider');
  });

  it('slider has tabIndex for keyboard focus (drag variant)', () => {
    const { container } = render(
      <Compare leftSection={<div>Left</div>} rightSection={<div>Right</div>} />
    );

    const slider = container.querySelector('[role="slider"]') as HTMLElement | null;
    expect(slider?.getAttribute('tabindex')).toBe('0');
  });

  it('slider has no tabIndex for fixed variant', () => {
    const { container } = render(
      <Compare variant="fixed" leftSection={<div>Left</div>} rightSection={<div>Right</div>} />
    );

    const slider = container.querySelector('[role="slider"]') as HTMLElement | null;
    expect(slider?.getAttribute('tabindex')).toBeNull();
  });

  it('calls onPositionChange when ArrowRight is pressed', () => {
    const onPositionChange = jest.fn();
    const { container } = render(
      <Compare
        leftSection={<div>Left</div>}
        rightSection={<div>Right</div>}
        defaultPosition={50}
        onPositionChange={onPositionChange}
      />
    );

    const slider = container.querySelector('[role="slider"]') as HTMLElement;
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onPositionChange).toHaveBeenCalledWith(51);
  });

  it('calls onPositionChange with 10% step when Shift+ArrowRight is pressed', () => {
    const onPositionChange = jest.fn();
    const { container } = render(
      <Compare
        leftSection={<div>Left</div>}
        rightSection={<div>Right</div>}
        defaultPosition={50}
        onPositionChange={onPositionChange}
      />
    );

    const slider = container.querySelector('[role="slider"]') as HTMLElement;
    fireEvent.keyDown(slider, { key: 'ArrowRight', shiftKey: true });
    expect(onPositionChange).toHaveBeenCalledWith(60);
  });

  it('respects minDragBound on ArrowLeft', () => {
    const onPositionChange = jest.fn();
    const { container } = render(
      <Compare
        leftSection={<div>Left</div>}
        rightSection={<div>Right</div>}
        defaultPosition={20}
        minDragBound={20}
        onPositionChange={onPositionChange}
      />
    );

    const slider = container.querySelector('[role="slider"]') as HTMLElement;
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(onPositionChange).toHaveBeenCalledWith(20);
  });

  it('respects maxDragBound on ArrowRight', () => {
    const onPositionChange = jest.fn();
    const { container } = render(
      <Compare
        leftSection={<div>Left</div>}
        rightSection={<div>Right</div>}
        defaultPosition={80}
        maxDragBound={80}
        onPositionChange={onPositionChange}
      />
    );

    const slider = container.querySelector('[role="slider"]') as HTMLElement;
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onPositionChange).toHaveBeenCalledWith(80);
  });

  it('Home key moves to minDragBound', () => {
    const onPositionChange = jest.fn();
    const { container } = render(
      <Compare
        leftSection={<div>Left</div>}
        rightSection={<div>Right</div>}
        defaultPosition={50}
        minDragBound={10}
        onPositionChange={onPositionChange}
      />
    );

    const slider = container.querySelector('[role="slider"]') as HTMLElement;
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onPositionChange).toHaveBeenCalledWith(10);
  });

  it('End key moves to maxDragBound', () => {
    const onPositionChange = jest.fn();
    const { container } = render(
      <Compare
        leftSection={<div>Left</div>}
        rightSection={<div>Right</div>}
        defaultPosition={50}
        maxDragBound={90}
        onPositionChange={onPositionChange}
      />
    );

    const slider = container.querySelector('[role="slider"]') as HTMLElement;
    fireEvent.keyDown(slider, { key: 'End' });
    expect(onPositionChange).toHaveBeenCalledWith(90);
  });

  it('keyboard does not work on fixed variant', () => {
    const onPositionChange = jest.fn();
    const { container } = render(
      <Compare
        variant="fixed"
        leftSection={<div>Left</div>}
        rightSection={<div>Right</div>}
        defaultPosition={50}
        onPositionChange={onPositionChange}
      />
    );

    const slider = container.querySelector('[role="slider"]') as HTMLElement;
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onPositionChange).not.toHaveBeenCalled();
  });

  it('renders custom slider icon', () => {
    const { container } = render(
      <Compare
        leftSection={<div>Left</div>}
        rightSection={<div>Right</div>}
        sliderIcon={<span data-testid="custom-icon">⇔</span>}
      />
    );

    expect(container.querySelector('[data-testid="custom-icon"]')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Compare ref={ref} leftSection={<div>Left</div>} rightSection={<div>Right</div>} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
