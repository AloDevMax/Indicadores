import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Excluir Selo?"
        message="mensagem"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.queryByText('Excluir Selo?')).not.toBeInTheDocument();
  });

  it('renders the title, message, and default labels when open', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Excluir Selo?"
        message="Esta ação não pode ser desfeita."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('Excluir Selo?')).toBeInTheDocument();
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('calls onConfirm when the confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen
        title="Excluir Colaborador?"
        message="mensagem"
        confirmLabel="Excluir"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <ConfirmDialog
        isOpen
        title="Excluir Colaborador?"
        message="mensagem"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses custom labels when provided', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Enviar convites?"
        message="mensagem"
        confirmLabel="Enviar Convites"
        cancelLabel="Voltar"
        variant="default"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Enviar Convites' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
  });
});
