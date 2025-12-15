import React from 'react';
import { render } from '@mantine-tests/core';
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
});
