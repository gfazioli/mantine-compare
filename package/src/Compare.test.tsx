import React from 'react';
import { render, screen } from '@mantine-tests/core';
import { Compare } from './Compare';

describe('Compare', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Compare before={<div>Before</div>} after={<div>After</div>} />
    );
    expect(container).toBeTruthy();
  });

  it('renders before and after content', () => {
    render(
      <Compare
        before={<div data-testid="before-content">Before Content</div>}
        after={<div data-testid="after-content">After Content</div>}
      />
    );
    expect(screen.getByTestId('before-content')).toBeInTheDocument();
    expect(screen.getByTestId('after-content')).toBeInTheDocument();
  });

  it('applies ARIA labels correctly', () => {
    render(
      <Compare
        before={<div>Before</div>}
        after={<div>After</div>}
        ariaLabel="Custom comparison"
        beforeLabel="Custom Before"
        afterLabel="Custom After"
      />
    );

    const rootElement = screen.getByRole('group', { name: 'Custom comparison' });
    expect(rootElement).toBeInTheDocument();

    const beforePanel = screen.getByRole('region', { name: 'Custom Before' });
    const afterPanel = screen.getByRole('region', { name: 'Custom After' });
    expect(beforePanel).toBeInTheDocument();
    expect(afterPanel).toBeInTheDocument();
  });

  it('shows visual labels when showLabels is true', () => {
    const { container } = render(
      <Compare
        before={<div>Before</div>}
        after={<div>After</div>}
        showLabels
        beforeLabel="Left Side"
        afterLabel="Right Side"
      />
    );

    expect(container.textContent).toContain('Left Side');
    expect(container.textContent).toContain('Right Side');
  });

  it('does not show visual labels when showLabels is false', () => {
    const { container } = render(
      <Compare
        before={<div>Before Content</div>}
        after={<div>After Content</div>}
        showLabels={false}
        beforeLabel="Left Side"
        afterLabel="Right Side"
      />
    );

    // Labels should not appear in text content
    expect(container.textContent).not.toContain('Left Side');
    expect(container.textContent).not.toContain('Right Side');
    // But content should still be there
    expect(container.textContent).toContain('Before Content');
    expect(container.textContent).toContain('After Content');
  });

  it('applies withBorder prop', () => {
    const { container } = render(
      <Compare before={<div>Before</div>} after={<div>After</div>} withBorder />
    );

    const rootElement = container.querySelector('[data-with-border]');
    expect(rootElement).toBeInTheDocument();
  });

  it('sets orientation attribute', () => {
    const { container, rerender } = render(
      <Compare before={<div>Before</div>} after={<div>After</div>} orientation="horizontal" />
    );

    let containerElement = container.querySelector('[data-orientation="horizontal"]');
    expect(containerElement).toBeInTheDocument();

    rerender(
      <Compare before={<div>Before</div>} after={<div>After</div>} orientation="vertical" />
    );

    containerElement = container.querySelector('[data-orientation="vertical"]');
    expect(containerElement).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(
      <Compare
        before={<div>Before</div>}
        after={<div>After</div>}
        className="custom-class"
      />
    );

    const rootElement = container.querySelector('.custom-class');
    expect(rootElement).toBeInTheDocument();
  });

  it('renders any ReactNode as content', () => {
    const CustomComponent = () => <div data-testid="custom">Custom Component</div>;

    render(
      <Compare
        before={
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
          </div>
        }
        after={<CustomComponent />}
      />
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });
});
