
import React, { useState } from 'react';

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
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[24px] mx-auto mb-6 flex items-center justify-center text-4xl shadow-xl shadow-indigo-100 rotate-3">
            🛡️
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">LabQuest</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">arena da excelência</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">endereço de email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ textTransform: 'none' }}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">senha de acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ textTransform: 'none' }}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 uppercase tracking-[0.2em] text-xs"
          >
            {loading ? 'entrando...' : 'iniciar jornada'}
          </button>
          {error && <div className="text-red-600 font-bold text-sm text-center mt-2">{error}</div>}
        </form>

        <div className="mt-6 text-center relative z-10">
          <p className="text-sm text-slate-500">Não tem conta? <a href="#/register" className="text-indigo-600 font-bold hover:text-indigo-700">Cadastre-se</a></p>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center relative z-10">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">acesso rápido para testes:</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setEmail('admin@test.com'); setPassword('admin123'); }} className="px-3 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 uppercase hover:bg-indigo-50 hover:text-indigo-600 transition-all">comandante</button>
            <button onClick={() => { setEmail('joao@acme.com'); setPassword('joao123'); }} className="px-3 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 uppercase hover:bg-indigo-50 hover:text-indigo-600 transition-all">explorador</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
