import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import ToastContainer from './ToastContainer';
import { toast } from '@/shared/lib/toast';

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when no toasts have been pushed', () => {
    const { container } = render(<ToastContainer />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a toast pushed via toast.success', () => {
    render(<ToastContainer />);

    act(() => {
      toast.success('Selo concedido com sucesso!');
    });

    expect(screen.getByText('Selo concedido com sucesso!')).toBeInTheDocument();
  });

  it('renders a toast pushed via toast.error', () => {
    render(<ToastContainer />);

    act(() => {
      toast.error('Falha ao salvar');
    });

    expect(screen.getByText('Falha ao salvar')).toBeInTheDocument();
  });

  it('renders a toast pushed via toast.info', () => {
    render(<ToastContainer />);

    act(() => {
      toast.info('Aviso informativo');
    });

    expect(screen.getByText('Aviso informativo')).toBeInTheDocument();
  });

  it('renders multiple concurrent toasts', () => {
    render(<ToastContainer />);

    act(() => {
      toast.success('Primeiro');
      toast.error('Segundo');
    });

    expect(screen.getByText('Primeiro')).toBeInTheDocument();
    expect(screen.getByText('Segundo')).toBeInTheDocument();
  });

  it('auto-dismisses a toast after 4000ms', () => {
    render(<ToastContainer />);

    act(() => {
      toast.success('Vai sumir');
    });
    expect(screen.getByText('Vai sumir')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.queryByText('Vai sumir')).not.toBeInTheDocument();
  });
});
