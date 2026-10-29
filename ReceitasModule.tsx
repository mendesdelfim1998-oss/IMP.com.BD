import { useState } from 'react';
import { TrendingUp, Download, ArrowUpRight } from 'lucide-react';
import { RubricaReceita } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ReceitasModuleProps {
  rubricas: RubricaReceita[];
}

export function ReceitasModule({ rubricas }: ReceitasModuleProps) {
  const { theme } = useTheme();
  const [selectedCategoria, setSelectedCategoria] = useState<string>('TODAS');

  const filtered = selectedCategoria === 'TODAS'
    ? rubricas
    : rubricas.filter(r => r.categoria === selectedCategoria);

  const totalMesXOF = rubricas.reduce((acc, r) => acc + r.arrecadadoMesAtualXOF, 0);
  const totalMetaXOF = rubricas.reduce((acc, r) => acc + r.metaAnualXOF, 0);
  const mediaExecucao = (rubricas.reduce((acc, r) => acc + r.percentualExecucao, 0) / (rubricas.length || 1)).toFixed(1);

  return (
    <div id="receitas-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Receitas, Consolidação & Mapas de Arrecadação Marítima
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400 text-xs' : 'text-slate-500 text-xs'}>
            Visão consolidada de receitas por rubrica orçamental, porto de origem e execução de metas financeiras do IMP
          </p>
        </div>
        <button
          onClick={() => alert('Mapa de Arrecadação de Receitas exportado em PDF com sucesso!')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
          }`}
        >
          <Download className="w-4 h-4 text-emerald-500" />
          Exportar Mapa Orçamental
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div
          className={`p-5 rounded-2xl border space-y-2 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider block">
            Arrecadação do Mês Atual
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-500 flex items-center justify-between">
            <span>{totalMesXOF.toLocaleString('pt-PT')} XOF</span>
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </div>
          <p className={theme === 'dark' ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
            Total apurado em todas as rubricas marítimo-portuárias
          </p>
        </div>

        {/* KPI 2 */}
        <div
          className={`p-5 rounded-2xl border space-y-2 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider block">
            Meta Orçamental Anual
          </span>
          <div className="text-2xl font-bold font-mono text-blue-500">
            {totalMetaXOF.toLocaleString('pt-PT')} XOF
          </div>
          <p className={theme === 'dark' ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
            Orçamento de estado e receitas próprias aprovadas
          </p>
        </div>

        {/* KPI 3 */}
        <div
          className={`p-5 rounded-2xl border space-y-2 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider block">
            Taxa Média de Execução
          </span>
          <div className="text-2xl font-bold font-mono text-amber-500">
            {mediaExecucao}% Executado
          </div>
          <p className="text-xs text-emerald-500">
            Desempenho acima do período homologado
          </p>
        </div>
      </div>

      {/* Filter by Category */}
      <div
        className={`flex items-center gap-2 p-2 rounded-2xl border overflow-x-auto text-xs ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}
      >
        <span className="text-slate-500 px-3 font-semibold font-mono uppercase text-[10px] shrink-0">
          Filtrar Categoria:
        </span>
        {['TODAS', 'Serviços Portuários', 'Segurança & Faróis', 'Licenciamento', 'Penalidades & Coimas'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoria(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedCategoria === cat
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rubricas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rubrica) => (
          <div
            key={rubrica.id}
            className={`p-5 rounded-2xl border space-y-4 transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    theme === 'dark'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {rubrica.codigoRubrica}
                </span>
                <h3
                  className={`font-bold text-base mt-1.5 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {rubrica.nomeRubrica}
                </h3>
                <p className={`text-xs mt-0.5 font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Porto / Origem: {rubrica.portoOrigem}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {rubrica.categoria}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                  Execução Orçamental:
                </span>
                <span className="text-emerald-500 font-bold">{rubrica.percentualExecucao}%</span>
              </div>
              <div
                className={`w-full h-2 rounded-full overflow-hidden border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                  style={{ width: `${Math.min(rubrica.percentualExecucao, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Stats row */}
            <div
              className={`grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-50 border-slate-200/80 text-slate-700'
              }`}
            >
              <div>
                <span className="text-slate-500 block text-[10px]">ARRECADADO (MÊS):</span>
                <span className="text-emerald-500 font-bold text-sm">
                  {rubrica.arrecadadoMesAtualXOF.toLocaleString('pt-PT')} XOF
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">META ANUAL:</span>
                <span className="text-blue-500 font-bold text-sm">
                  {rubrica.metaAnualXOF.toLocaleString('pt-PT')} XOF
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
