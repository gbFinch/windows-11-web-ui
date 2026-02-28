// Window component tests — covers FR-1, FR-2, FR-4, FR-5, FR-6, FR-7, FR-8, FR-9, FR-10, FR-11
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Window from '../../../src/components/Window/Window';

const defaultProps = () => ({
  id: 'win-1',
  title: 'Test Window',
  x: 100,
  y: 50,
  width: 600,
  height: 400,
  zIndex: 1,
  isMinimized: false,
  isMaximized: false,
  onMove: vi.fn(),
  onResize: vi.fn(),
  onMinimize: vi.fn(),
  onMaximize: vi.fn(),
  onClose: vi.fn(),
  onFocus: vi.fn(),
});

describe('Window', () => {
  // TC-U-01 | Covers: FR-1
  it('renders title bar with title text and three control buttons', () => {
    render(<Window {...defaultProps()}>content</Window>);
    expect(screen.getByText('Test Window')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Minimize' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Maximize' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  // TC-U-02 | Covers: FR-8, AC-7
  it('calls onClose with window id when close button is clicked', () => {
    const props = defaultProps();
    render(<Window {...props}>content</Window>);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(props.onClose).toHaveBeenCalledWith('win-1');
  });

  // TC-U-03 | Covers: FR-4
  it('calls onMinimize with window id when minimize button is clicked', () => {
    const props = defaultProps();
    render(<Window {...props}>content</Window>);
    fireEvent.click(screen.getByRole('button', { name: 'Minimize' }));
    expect(props.onMinimize).toHaveBeenCalledWith('win-1');
  });

  // TC-U-04 | Covers: FR-4, AC-4
  it('applies visibility hidden when isMinimized is true', () => {
    const props = defaultProps();
    props.isMinimized = true;
    const { container } = render(<Window {...props}>content</Window>);
    expect((container.firstChild as HTMLElement).style.visibility).toBe('hidden');
  });

  // TC-U-05 | Covers: FR-5, FR-6, AC-5
  it('calls onMaximize with window id when maximize button is clicked', () => {
    const props = defaultProps();
    render(<Window {...props}>content</Window>);
    fireEvent.click(screen.getByRole('button', { name: 'Maximize' }));
    expect(props.onMaximize).toHaveBeenCalledWith('win-1');
  });

  // TC-U-06 | Covers: FR-9, AC-8
  it('calls onFocus when window is clicked', () => {
    const props = defaultProps();
    const { container } = render(<Window {...props}>content</Window>);
    fireEvent.pointerDown(container.firstChild as HTMLElement);
    expect(props.onFocus).toHaveBeenCalledWith('win-1');
  });

  // TC-U-07 | Covers: FR-10
  it('renders children content', () => {
    render(<Window {...defaultProps()}><p>Hello World</p></Window>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  // TC-E-01 | Covers: FR-3
  it('renders at specified position and size', () => {
    const { container } = render(<Window {...defaultProps()}>content</Window>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.left).toBe('100px');
    expect(el.style.top).toBe('50px');
    expect(el.style.width).toBe('600px');
    expect(el.style.height).toBe('400px');
  });

  // TC-E-02 | Covers: FR-7, AC-6
  it('calls onMaximize on title bar double-click', () => {
    const props = defaultProps();
    render(<Window {...props}>content</Window>);
    fireEvent.doubleClick(screen.getByText('Test Window'));
    expect(props.onMaximize).toHaveBeenCalledWith('win-1');
  });

  // TC-E-03 | Covers: FR-5, FR-11
  it('positions at 0,0 when maximized', () => {
    const props = defaultProps();
    props.isMaximized = true;
    const { container } = render(<Window {...props}>content</Window>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.left).toBe('0px');
    expect(el.style.top).toBe('0px');
  });

  // TC-NF-01 | Covers: NFR-4
  it('renders control buttons as accessible button elements', () => {
    render(<Window {...defaultProps()}>content</Window>);
    expect(screen.getByRole('button', { name: 'Minimize' }).tagName).toBe('BUTTON');
    expect(screen.getByRole('button', { name: 'Maximize' }).tagName).toBe('BUTTON');
    expect(screen.getByRole('button', { name: 'Close' }).tagName).toBe('BUTTON');
  });

  // TC-NF-02 | Covers: NFR-6
  it('applies CSS Module class names', () => {
    const { container } = render(<Window {...defaultProps()}>content</Window>);
    expect((container.firstChild as HTMLElement).className).toBeTruthy();
  });
});
