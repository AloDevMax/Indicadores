import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ConfirmProvider, useConfirm } from './ConfirmContext';

function ConfirmConsumer() {
  const confirm = useConfirm();
  const [result, setResult] = useState<string>('pending');

  const handleClick = async () => {
    const confirmed = await confirm({
      title: 'Excluir Selo?',
      message: 'Esta ação não pode ser desfeita.',
    });
    setResult(String(confirmed));
  };

  return (
    <div>
      <button onClick={handleClick}>Abrir Confirmação</button>
      <span data-testid="result">{result}</span>
    </div>
  );
}

describe('ConfirmContext', () => {
  it('throws when useConfirm is called outside a ConfirmProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function Broken() {
      useConfirm();
      return null;
    }

    expect(() => render(<Broken />)).toThrow('useConfirm deve ser usado dentro de um ConfirmProvider');

    consoleErrorSpy.mockRestore();
  });

  it('opens the dialog on confirm() and resolves true when the user confirms', async () => {
    const user = userEvent.setup();
    render(
      <ConfirmProvider>
        <ConfirmConsumer />
      </ConfirmProvider>,
    );

    expect(screen.queryByText('Excluir Selo?')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Abrir Confirmação' }));

    expect(screen.getByText('Excluir Selo?')).toBeInTheDocument();
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => expect(screen.getByTestId('result').textContent).toBe('true'));
    expect(screen.queryByText('Excluir Selo?')).not.toBeInTheDocument();
  });

  it('opens the dialog on confirm() and resolves false when the user cancels', async () => {
    const user = userEvent.setup();
    render(
      <ConfirmProvider>
        <ConfirmConsumer />
      </ConfirmProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Abrir Confirmação' }));

    expect(screen.getByText('Excluir Selo?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    await waitFor(() => expect(screen.getByTestId('result').textContent).toBe('false'));
    expect(screen.queryByText('Excluir Selo?')).not.toBeInTheDocument();
  });
});
