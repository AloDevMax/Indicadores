import React from 'react';
import { Link } from 'react-router-dom';

const highlights = [
  {
    title: 'Engajamento com regra clara',
    description: 'Transforme qualidade, seguranca e disciplina operacional em metas visiveis, com criterios simples para cada colaborador.',
  },
  {
    title: 'Gestao multiempresa e unidade',
    description: 'Organize operacoes por empresa, unidade produtiva e colaborador sem perder a visao executiva do todo.',
  },
  {
    title: 'Ritmo de reconhecimento',
    description: 'Premie comportamentos certos, acompanhe solicitacoes e crie uma cultura de performance com recorrencia.',
  },
];

const metrics = [
  { value: '1 painel', label: 'para acompanhar a operacao' },
  { value: '3 niveis', label: 'de reconhecimento positivo' },
  { value: '100%', label: 'foco em clareza para lideranca' },
];

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#fff5ef_45%,_#ffffff_100%)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <img src="/logo-horizontal.jpeg" alt="LabVW" className="h-9 w-auto object-contain" />

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-700 transition hover:border-brand-red-light hover:bg-brand-red-light hover:text-brand-red-dark"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="rounded-2xl bg-brand-red px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-brand-red-light transition hover:bg-brand-red-dark"
            >
              Solicitar acesso
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-24">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-brand-red-light bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand-red-dark shadow-sm">
              Plataforma para empresas com operacao em campo, industria e servicos
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-bold font-heading leading-[0.95] tracking-tight md:text-7xl">
                O jeito mais simples de transformar indicadores em comportamento.
              </h1>
              <p className="max-w-2xl text-base font-medium leading-7 text-slate-600 md:text-lg">
                O LabQuest conecta reconhecimento, disciplina operacional e visibilidade gerencial em um unico sistema.
                Sua lideranca para de perseguir planilhas e passa a dirigir cultura.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-950"
              >
                Comecar implantacao
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-700 transition hover:border-brand-orange hover:text-brand-red-dark"
              >
                Acessar plataforma
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-brand-red-light/40">
                  <div className="text-3xl font-black tracking-tight text-slate-900">{metric.value}</div>
                  <div className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-orange/30 via-brand-red/30 to-brand-teal/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-slate-900 p-6 text-white shadow-2xl shadow-brand-red-light">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-red-light">Visao executiva</div>
                  <div className="mt-2 text-2xl font-black">Operacao em movimento</div>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                  Em tempo real
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="rounded-xl bg-white/8 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-300">Saldo mensal de selos</div>
                  <div className="mt-3 flex items-end justify-between">
                    <div className="text-5xl font-black">87</div>
                    <div className="rounded-2xl bg-emerald-400/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                      +18% no mes
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/8 p-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-300">Unidades monitoradas</div>
                    <div className="mt-3 text-3xl font-black">12</div>
                  </div>
                  <div className="rounded-xl bg-white/8 p-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-300">Solicitacoes em fila</div>
                    <div className="mt-3 text-3xl font-black">09</div>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-brand-red/40 to-brand-orange/30 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-red-light">O que o diretor enxerga</div>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-100">
                    Quem esta performando, onde a operacao perdeu ritmo e quais lideres estao reforcando a cultura certa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100/60">
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-teal">Pilar</div>
                <h2 className="mt-4 text-2xl font-bold font-heading tracking-tight text-slate-900">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
          <div className="rounded-2xl border border-slate-100 bg-white px-6 py-10 shadow-2xl shadow-slate-100 md:px-10">
            <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-red">Tese de produto</div>
                <h2 className="mt-4 text-3xl font-bold font-heading tracking-tight text-slate-900 md:text-4xl">
                  O site precisa vender confianca antes de vender funcionalidade.
                </h2>
              </div>

              <div className="grid gap-4">
                <div className="rounded-xl bg-slate-50 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Para RH e operacoes</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Mostra criterios, premios, ranking e aderencia por unidade para sustentar cultura e performance.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Para diretoria</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Entrega visibilidade sobre engajamento, consistencia operacional e capacidade de escala da gestao.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
