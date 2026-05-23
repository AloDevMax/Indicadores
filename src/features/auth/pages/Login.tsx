
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoginResult {
  success: boolean;
  message?: string;
}

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<LoginResult>;
}


const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.toLowerCase().trim();

    setLoading(true);
    const result = await onLogin(normalizedEmail, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Credenciais inválidas.');
      return;
    }

    setError(null);
  };

  return (
    <div className="max-w-md mx-auto mt-10 md:mt-20 px-4">
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="text-center mb-10 relative z-10">
          <img src="/logo-vertical.jpeg" alt="LabVW" className="h-28 w-auto object-contain mx-auto mb-3" />
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Arena da Excelência</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Endereço de Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ textTransform: 'none' }}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-red transition-all"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Senha de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ textTransform: 'none' }}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-red transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red text-white font-black py-5 rounded-2xl hover:bg-brand-red-dark transition-all shadow-xl shadow-brand-red-light active:scale-95 uppercase tracking-[0.2em] text-xs"
          >
            {loading ? 'entrando...' : 'iniciar jornada'}
          </button>
          {error && <div className="text-red-600 font-bold text-sm text-center mt-2">{error}</div>}
        </form>

        <div className="mt-6 text-center relative z-10">
          <p className="text-sm text-slate-500">Nao tem conta? <Link to="/register" className="text-brand-red font-bold hover:text-brand-red-dark">Cadastre-se</Link></p>
          <p className="mt-2 text-xs text-slate-400">Quer entender o produto antes? <Link to="/" className="font-bold text-slate-600 hover:text-brand-red-dark">Voltar para a pagina inicial</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

