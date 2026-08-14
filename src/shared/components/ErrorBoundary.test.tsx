import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

function ThrowingChild(): never {
  throw new Error('Boom from child');
}

describe('ErrorBoundary', () => {
  it('renders children as-is when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div>Conteúdo normal</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Conteúdo normal')).toBeInTheDocument();
    expect(screen.queryByText('Algo deu errado')).not.toBeInTheDocument();
  });

  it('renders the fallback UI instead of crashing the tree when a child throws', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText('Ocorreu um erro inesperado na aplicação.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recarregar página' })).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo normal')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('logs the caught error via console.error', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.anything(),
    );

    consoleErrorSpy.mockRestore();
  });

  it('shows the error details in the dev-mode details block', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    // import.meta.env.DEV is true under Vitest by default.
    expect(screen.getByText('Detalhes do erro (desenvolvimento)')).toBeInTheDocument();
    expect(screen.getByText('Error: Boom from child')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
