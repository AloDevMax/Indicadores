import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TemporaryPasswordsDialog from './TemporaryPasswordsDialog';

const PASSWORDS = [
  { email: 'ana@example.com', temporary_password: 'Abc23defGh45' },
  { email: 'bia@example.com', temporary_password: 'Zxc98vbnMk76' },
];

describe('TemporaryPasswordsDialog', () => {
  it('renders nothing when there are no passwords to show', () => {
    const { container } = render(<TemporaryPasswordsDialog passwords={[]} onClose={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('lists every e-mail with its temporary password and warns they are shown only once', () => {
    render(<TemporaryPasswordsDialog passwords={PASSWORDS} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: 'Senhas temporárias' })).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    expect(screen.getByText('Abc23defGh45')).toBeInTheDocument();
    expect(screen.getByText('bia@example.com')).toBeInTheDocument();
    expect(screen.getByText('Zxc98vbnMk76')).toBeInTheDocument();
    expect(screen.getByText(/não serão exibidas novamente/)).toBeInTheDocument();
  });

  it('copies all pairs to the clipboard as "email: password" lines', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    render(<TemporaryPasswordsDialog passwords={PASSWORDS} onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Copiar tudo' }));

    expect(writeText).toHaveBeenCalledWith('ana@example.com: Abc23defGh45\nbia@example.com: Zxc98vbnMk76');
    expect(await screen.findByRole('button', { name: 'Copiado!' })).toBeInTheDocument();
  });

  it('calls onClose when the admin confirms they saved the passwords', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TemporaryPasswordsDialog passwords={PASSWORDS} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Já anotei' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
