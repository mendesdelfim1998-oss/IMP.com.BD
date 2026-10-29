import { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, Ship, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function RelatoriosModule() {
  const { theme } = useTheme();
  const [reportType, setReportType] = useState('trafego');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (format: string) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Relatório gerado com sucesso no formato ${format.toUpperCase()}! Arquivo pronto para auditoria.`);
    }, 1200);
  };

  return (
    <div id="relatorios-module" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Relatórios Marítimos, Estatísticas & Execução Financeira
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Geração de mapas oficiais de tráfego de navios, arrecadação de taxas e balancetes para o Ministério dos Transportes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setReportType('trafego')}
          className={`p-5 rounded-2xl text-left border transition-all ${
            reportType === 'trafego'
              ? theme === 'dark'
                ? 'bg-blue-600/20 text-white border-blue-500/50 shadow-lg shadow-blue-600/10'
                : 'bg-blue-50/90 text-blue-900 border-blue-400 shadow-sm font-semibold'
              : theme === 'dark'
              ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              : 'bg-white text-slate-700 border-slate-200/90 hover:border-blue-300 shadow-sm'
          }`}
        >
          <Ship className="w-6 h-6 text-blue-500 mb-2" />
          <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Relatório de Tráfego & Movimento de Navios
          </h3>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Escalas nos portos de Bissau, Buba e Cacheu, toneladas movimentadas e TEUs
          </p>
        </button>

        <button
          onClick={() => setReportType('financeiro')}
          className={`p-5 rounded-2xl text-left border transition-all ${
            reportType === 'financeiro'
              ? theme === 'dark'
                ? 'bg-blue-600/20 text-white border-blue-500/50 shadow-lg shadow-blue-600/10'
                : 'bg-blue-50/90 text-blue-900 border-blue-400 shadow-sm font-semibold'
              : theme === 'dark'
              ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              : 'bg-white text-slate-700 border-slate-200/90 hover:border-blue-300 shadow-sm'
          }`}
        >
          <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
          <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Mapa Mensal de Arrecadação de Receitas
          </h3>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Consolidação de taxas portuárias, pilotagem, licenças e multas cobradas
          </p>
        </button>

        <button
          onClick={() => setReportType('inspeccoes')}
          className={`p-5 rounded-2xl text-left border transition-all ${
            reportType === 'inspeccoes'
              ? theme === 'dark'
                ? 'bg-blue-600/20 text-white border-blue-500/50 shadow-lg shadow-blue-600/10'
                : 'bg-blue-50/90 text-blue-900 border-blue-400 shadow-sm font-semibold'
              : theme === 'dark'
              ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              : 'bg-white text-slate-700 border-slate-200/90 hover:border-blue-300 shadow-sm'
          }`}
        >
          <BarChart3 className="w-6 h-6 text-amber-500 mb-2" />
          <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Estatísticas de Segurança & Retenção PSC
          </h3>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Índices de conformidade MARPOL, certificados ativos e retenções no Porto de Bissau
          </p>
        </button>
      </div>

      <div className={`p-6 rounded-2xl border space-y-6 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {reportType === 'trafego' && 'Relatório Detalhado de Tráfego Marítimo (2026)'}
              {reportType === 'financeiro' && 'Balancete Financeiro & Arrecadação de Taxas IMP'}
              {reportType === 'inspeccoes' && 'Relatório de Auditoria de Segurança & Vistorias PSC'}
            </h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Período de Análise: Ano de 2026 • Filtro: Todos os Portos da Guiné-Bissau
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </button>
            <button
              onClick={() => handleDownload('excel')}
              disabled={downloading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar Excel / CSV
            </button>
          </div>
        </div>

        {/* Report Preview Data */}
        <div className="space-y-4">
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono p-4 rounded-xl border ${
            theme === 'dark'
              ? 'bg-slate-950 border-slate-800 text-white'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <div>
              <span className={`block text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>TOTAL ESCALAS:</span>
              <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>42 Navios</span>
            </div>
            <div>
              <span className={`block text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>CARGA MOVIMENTADA:</span>
              <span className="text-emerald-500 font-bold text-sm">18.900 Toneladas</span>
            </div>
            <div>
              <span className={`block text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>TOTAL TEUs:</span>
              <span className="text-blue-500 font-bold text-sm">450 Contentores</span>
            </div>
            <div>
              <span className={`block text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>RECEITA LIQUIDADA:</span>
              <span className="text-amber-500 font-bold text-sm">63.900.000 XOF</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
            theme === 'dark'
              ? 'bg-slate-950 border-slate-800 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className={`font-bold pb-2 border-b ${
              theme === 'dark' ? 'text-slate-200 border-slate-800' : 'text-slate-900 border-slate-200'
            }`}>
              RESUMO EXECUTIVO PARA AUDITORIA:
            </div>
            <p className={`leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              O sistema consolidou até ao momento 100% das operações do Porto Comercial de Bissau, registando elevados padrões de eficiência na arrecadação de taxas de pilotagem e permanência em cais. Todos os dados estão armazenados no servidor On-Premises e prontos para verificação das instâncias governamentais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
