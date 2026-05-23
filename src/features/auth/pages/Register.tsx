import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface RegisterResult {
  success: boolean;
  message?: string;
}

interface RegisterProps {
  onRegister: (email: string, password: string, full_name: string) => Promise<RegisterResult>;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError('Informe seu nome completo.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const result = await onRegister(email.trim(), password, fullName.trim());
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Falha no cadastro.');
      return;
    }

    setError(null);
  };

  return (
    <div className="max-w-md mx-auto mt-10 md:mt-20 px-4">
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Cadastro LabQuest</h1>
          <p className="text-slate-500 text-sm">Crie sua conta e entre na jornada!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400">Nome completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ textTransform: 'none' }}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-brand-red"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ textTransform: 'none' }}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-brand-red"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ textTransform: 'none' }}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-brand-red"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">Confirmar senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ textTransform: 'none' }}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-brand-red"
              required
            />
          </div>

          {error && <p className="text-red-600 font-bold text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-red text-white font-black py-3 rounded-2xl hover:bg-brand-red-dark transition-all"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Criar minha conta'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Já tem conta? <Link to="/login" className="text-brand-red font-bold hover:text-brand-red-dark">Fazer login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
