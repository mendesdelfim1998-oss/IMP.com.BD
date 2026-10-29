import { useState } from 'react';
import { ShieldAlert, FileText, AlertTriangle, CheckCircle, Scale } from 'lucide-react';
import { LicencaNavegacao, MultaInfracao } from '../../types';

interface MultasLicencasModuleProps {
  multas: MultaInfracao[];
  licencas: LicencaNavegacao[];
}

export function MultasLicencasModule({ multas, licencas }: MultasLicencasModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'multas' | 'licencas'>('multas');

  return (
    <div id="multas-licencas-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Infrações Marítimas, Multas & Licenciamento
          </h2>
          <p className="text-slate-400 text-xs">Autos de notícia, aplicação do Código Marítimo de Bissau e licenças de navegação</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('multas')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'multas'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Autos de Infração & Multas ({multas.length})
        </button>
        <button
          onClick={() => setActiveSubTab('licencas')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'licencas'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Licenças de Navegação & Actividade ({licencas.length})
        </button>
      </div>

      {/* Multas Tab */}
      {activeSubTab === 'multas' && (
        <div className="space-y-4">
          {multas.map((m) => (
            <div key={m.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{m.embarcacaoOuEntidade}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {m.numeroAutoInfracao}
                    </span>
                  </div>
                  <div className="text-xs text-rose-300 mt-1 font-mono">{m.artigoViolado}</div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-rose-400 font-mono">{m.valorMultaXOF.toLocaleString()} XOF</div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {m.statusMulta}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-semibold block mb-0.5">Descrição da Infracção:</span>
                {m.descricaoInfracao}
              </p>

              <div className="text-[11px] text-slate-500 font-mono">
                Data da Ocorrência: {m.dataOcorrencia}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Licencas Tab */}
      {activeSubTab === 'licencas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licencas.map((lic) => (
            <div key={lic.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                    {lic.tipoActividade}
                  </span>
                  <h3 className="font-bold text-white text-base mt-2">{lic.titular}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Nº: {lic.numeroLicenca}</div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    lic.status === 'Válida'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {lic.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">CONCESSÃO</span>
                  <span className="text-slate-200">{lic.dataConcessao}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">VALIDADE</span>
                  <span className="text-emerald-400">{lic.dataValidade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
