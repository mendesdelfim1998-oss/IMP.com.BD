import { useState } from 'react';
import { BarChart3, Settings, Download, FileSpreadsheet, ShieldCheck, Database, HardDrive } from 'lucide-react';
import { ParamentroTaxaPortuaria } from '../../types';

interface RelatoriosConfiguracaoModuleProps {
  taxas: ParamentroTaxaPortuaria[];
}

export function RelatoriosConfiguracaoModule({ taxas }: RelatoriosConfiguracaoModuleProps) {
  const [activeTab, setActiveTab] = useState<'relatorios' | 'configuracao'>('relatorios');

  return (
    <div id="relatorios-config-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Relatórios Marítimos & Parâmetros do Sistema
          </h2>
          <p className="text-slate-400 text-xs">Estatísticas de tráfego de navios, receitas por trimestre, auditoria e configuração On-Premises</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('relatorios')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'relatorios'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Relatórios & Estatísticas
        </button>
        <button
          onClick={() => setActiveTab('configuracao')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'configuracao'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Parâmetros & Servidor On-Premises
        </button>
      </div>

      {/* Relatorios Tab */}
      {activeTab === 'relatorios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Relatório Mensal de Tráfego de Navios</h3>
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400">Total de escalas efetuadas, tonelagem movimentada (GT) e tempo médio de atracação no Porto de Bissau.</p>
            <button className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors border border-slate-700 flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              Exportar PDF / Excel
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Relatório Financeiro de Receitas (XOF)</h3>
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400">Arrecadação detalhada por categoria: pilotagem, permanência em cais, rebocadores e emissão de certificados.</p>
            <button className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors border border-slate-700 flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              Exportar Balancete
            </button>
          </div>
        </div>
      )}

      {/* Configuracao Tab */}
      {activeTab === 'configuracao' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <HardDrive className="w-4 h-4 text-indigo-400" />
              Estado da Infraestrutura On-Premises (IMP Bissau)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">BASE DE DADOS</span>
                <span className="text-emerald-400 font-bold">PostgreSQL 16.2</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">BACKEND API</span>
                <span className="text-blue-400 font-bold">Laravel 12 REST API</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">AUTENTICAÇÃO</span>
                <span className="text-purple-400 font-bold">Laravel Sanctum JWT</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
