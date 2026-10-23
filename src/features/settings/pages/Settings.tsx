import React, { useState } from 'react';
import { Profile, Role } from '@/shared/types';
import { updateOwnProfileWithApi } from '@/shared/api';

interface SettingsProps {
  user: Profile;
  setUser: React.Dispatch<React.SetStateAction<Profile | null>>;
}

type Feedback = { type: 'success' | 'error'; text: string } | null;

const MIN_PASSWORD_LENGTH = 8;

const ROLE_LABELS: Record<Role, string> = {
  user: 'Colaborador',
  supervisor: 'Supervisor',
  admin: 'Gestor',
  developer: 'Desenvolvedor',
};

const INPUT_CLASS = 'w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-slate-900';
const LABEL_CLASS = 'text-[10px] font-black text-slate-400 uppercase tracking-widest';
const SUBMIT_CLASS = 'w-full py-4 font-black uppercase text-[10px] tracking-widest bg-brand-primary text-white rounded-2xl shadow-xl hover:bg-brand-primary-dark transition-all disabled:opacity-50';

const errorText = (error: unknown) => (error instanceof Error ? error.message : 'Não foi possível salvar.');

const FeedbackMessage: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
  if (!feedback) return null;
  const tone = feedback.type === 'success'
    ? 'bg-green-50 text-green-700 border-green-200'
    : 'bg-red-50 text-red-700 border-red-200';
  return <div role="status" className={`p-4 rounded-2xl font-bold text-sm border ${tone}`}>{feedback.text}</div>;
};

const NameForm: React.FC<SettingsProps> = ({ user, setUser }) => {
  const [fullName, setFullName] = useState(user.full_name);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      setUser(await updateOwnProfileWithApi({ full_name: fullName.trim() }));
      setFeedback({ type: 'success', text: 'Nome atualizado.' });
    } catch (error) {
      setFeedback({ type: 'error', text: errorText(error) });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="settings-full-name" className={LABEL_CLASS}>Nome completo</label>
        <input id="settings-full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} minLength={2} maxLength={120} required style={{ textTransform: 'none' }} className={INPUT_CLASS} />
      </div>
      <FeedbackMessage feedback={feedback} />
      <button type="submit" disabled={isSaving} className={SUBMIT_CLASS}>{isSaving ? 'Salvando...' : 'Salvar nome'}</button>
    </form>
  );
};

const EMPTY_PASSWORDS = { current: '', next: '', confirm: '' };

const PasswordForm: React.FC<SettingsProps> = ({ setUser }) => {
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleChange = (field: keyof typeof EMPTY_PASSWORDS) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next.length < MIN_PASSWORD_LENGTH) {
      setFeedback({ type: 'error', text: `A nova senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setFeedback({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    try {
      const updatedUser = await updateOwnProfileWithApi({ current_password: passwords.current, new_password: passwords.next });
      setPasswords(EMPTY_PASSWORDS);
      setFeedback({ type: 'success', text: 'Senha alterada.' });
      setUser(updatedUser);
    } catch (error) {
      setFeedback({ type: 'error', text: errorText(error) });
    } finally {
      setIsSaving(false);
    }
  };

  const fields: { id: string; label: string; field: keyof typeof EMPTY_PASSWORDS; autoComplete: string }[] = [
    { id: 'settings-current-password', label: 'Senha atual', field: 'current', autoComplete: 'current-password' },
    { id: 'settings-new-password', label: 'Nova senha', field: 'next', autoComplete: 'new-password' },
    { id: 'settings-confirm-password', label: 'Confirmar nova senha', field: 'confirm', autoComplete: 'new-password' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(({ id, label, field, autoComplete }) => (
        <div key={id} className="space-y-2">
          <label htmlFor={id} className={LABEL_CLASS}>{label}</label>
          <input id={id} type="password" autoComplete={autoComplete} value={passwords[field]} onChange={handleChange(field)} required style={{ textTransform: 'none' }} className={INPUT_CLASS} />
        </div>
      ))}
      <FeedbackMessage feedback={feedback} />
      <button type="submit" disabled={isSaving} className={SUBMIT_CLASS}>{isSaving ? 'Salvando...' : 'Trocar senha'}</button>
    </form>
  );
};

const Settings: React.FC<SettingsProps> = ({ user, setUser }) => {
  const isPasswordChangeRequired = Boolean(user.must_change_password);

  return (
    <div className="max-w-2xl mx-auto mt-6 md:mt-12 px-4 space-y-6">
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-slate-100">
        <h1 className="text-3xl font-bold font-heading text-slate-900 mb-6 tracking-tight">Meu perfil</h1>

        {isPasswordChangeRequired && (
          <p className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold">
            Sua senha foi definida pelo administrador. Defina uma nova senha para continuar usando o sistema.
          </p>
        )}

        <dl className="bg-slate-50 rounded-2xl p-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className={LABEL_CLASS}>E-mail</dt>
            <dd className="text-slate-900 font-bold break-all">{user.email}</dd>
          </div>
          <div>
            <dt className={LABEL_CLASS}>Função</dt>
            <dd className="text-slate-900 font-bold">{ROLE_LABELS[user.role]}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-slate-400">Para alterar o e-mail, fale com o administrador.</p>
      </div>

      {!isPasswordChangeRequired && (
        <section className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-slate-100">
          <h2 className="text-lg font-bold font-heading text-slate-900 mb-4">Nome</h2>
          <NameForm user={user} setUser={setUser} />
        </section>
      )}

      <section className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-slate-100">
        <h2 className="text-lg font-bold font-heading text-slate-900 mb-4">Senha</h2>
        <PasswordForm user={user} setUser={setUser} />
      </section>
    </div>
  );
};

export default Settings;
