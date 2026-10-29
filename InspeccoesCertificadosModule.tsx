import { useState } from 'react';
import { ClipboardCheck, Award, Plus, AlertOctagon, CheckCircle2, ShieldAlert, FileCheck2 } from 'lucide-react';
import { CertificadoMaritimo, Inspeccao } from '../../types';

interface InspeccoesCertificadosModuleProps {
  inspeccoes: Inspeccao[];
  certificados: CertificadoMaritimo[];
  onAddInspeccao: (insp: Inspeccao) => void;
}

export function InspeccoesCertificadosModule({ inspeccoes, certificados, onAddInspeccao }: InspeccoesCertificadosModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'inspeccoes' | 'certificados'>('inspeccoes');

  return (
    <div id="inspeccoes-certificados-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-400" />
            Inspecção Marítima & Certificação de Segurança
          </h2>
          <p className="text-slate-400 text-xs">Vistorias técnicas, controlo de navegação (Port State Control) e emissão de certificados marítimos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('inspeccoes')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'inspeccoes'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Relatórios de Vitoria & Inspecção ({inspeccoes.length})
        </button>
        <button
          onClick={() => setActiveSubTab('certificados')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'certificados'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Certificados Emitidos ({certificados.length})
        </button>
      </div>

      {/* Inspeccoes Tab */}
      {activeSubTab === 'inspeccoes' && (
        <div className="space-y-4">
          {inspeccoes.map((insp) => (
            <div key={insp.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{insp.embarcacaoNome}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {insp.codigoInspeccao}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Inspector Responsável: <span className="text-slate-200">{insp.inspectorNome}</span></div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    insp.resultado === 'Aprovado'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : insp.resultado === 'Aprovado com Recomendações'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {insp.resultado}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Tipo de Vistoria</span>
                  <span className="text-slate-200">{insp.tipoVistoria}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Data da Vistoria</span>
                  <span className="text-slate-200">{insp.dataInspeccao}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                <span className="text-slate-500 font-semibold block mb-1">Observações do Inspector:</span>
                <p>{insp.observacoes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificados Tab */}
      {activeSubTab === 'certificados' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificados.map((cert) => (
            <div key={cert.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                    Certificado de {cert.tipoCertificado}
                  </span>
                  <h3 className="font-bold text-white text-base mt-2">{cert.embarcacaoNome}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Nº: {cert.numeroCertificado}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {cert.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">DATA DE EMISSÃO</span>
                  <span className="text-slate-200">{cert.dataEmissao}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">VALIDADE ATÉ</span>
                  <span className="text-emerald-400">{cert.dataExpiracao}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800/80">
                Emitido por: <span className="text-slate-300">{cert.emitoPor}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
